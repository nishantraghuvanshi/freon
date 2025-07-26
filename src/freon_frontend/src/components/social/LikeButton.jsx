import { useState, useEffect } from 'react';
import { FiHeart } from 'react-icons/fi';
import { freon_backend } from 'declarations/freon_backend';
import { Principal } from '@dfinity/principal';
import { useAuth } from '../../context/AuthContext';
import CyclesNotification from '../cycles/CyclesNotification';
import { theme } from '../../styles/theme';

export default function LikeButton({ postId, onLikeChange }) {
  const { principal } = useAuth();
  const [likes, setLikes] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [optimisticCount, setOptimisticCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({});

  useEffect(() => {
    fetchLikes();
  }, [postId]);

  useEffect(() => {
    if (principal && likes.length > 0) {
      const liked = likes.some(likePrincipal => 
        likePrincipal.toText() === principal.toText()
      );
      setIsLiked(liked);
    }
  }, [likes, principal]);

  async function fetchLikes() {
    try {
      const likesData = await freon_backend.get_post_likes(postId);
      setLikes(likesData);
      setOptimisticCount(likesData.length);
    } catch (error) {
      console.error('Failed to fetch likes:', error);
    }
  }

  async function handleLike() {
    if (!principal || loading) return;

    setLoading(true);
    const wasLiked = isLiked;
    
    // Optimistic update
    setIsLiked(!wasLiked);
    setOptimisticCount(prev => wasLiked ? prev - 1 : prev + 1);
    
    try {
      const principalObj = Principal.fromText(principal.toText());
      let success;
      
      if (wasLiked) {
        success = await freon_backend.unlike_post(principalObj, postId);
      } else {
        success = await freon_backend.like_post(principalObj, postId);
        
        // Show notification when liking a post (cycles earned by post author)
        if (success && !wasLiked) {
          setNotificationData({
            message: "Post author earned cycles!",
            amount: 5,
            type: 'earned'
          });
          setShowNotification(true);
        }
      }

      if (success) {
        // Refresh likes to get actual state
        await fetchLikes();
        if (onLikeChange) {
          onLikeChange();
        }
      } else {
        // Revert optimistic update
        setIsLiked(wasLiked);
        setOptimisticCount(prev => wasLiked ? prev + 1 : prev - 1);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // Revert optimistic update
      setIsLiked(wasLiked);
      setOptimisticCount(prev => wasLiked ? prev + 1 : prev - 1);
    }
    
    setLoading(false);
  }

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.75rem',
    backgroundColor: isLiked ? theme.colors.error.light : 'transparent',
    color: isLiked ? 'white' : theme.colors.neutral[600],
    border: `1px solid ${isLiked ? theme.colors.error.main : theme.colors.neutral[300]}`,
    borderRadius: theme.borderRadius.md,
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '0.875rem',
    fontWeight: theme.typography.fontWeight.medium,
    opacity: loading ? 0.7 : 1
  };

  return (
    <>
      <button
        onClick={handleLike}
        style={buttonStyle}
        disabled={!principal || loading}
        onMouseEnter={(e) => {
          if (!loading && !isLiked) {
            e.target.style.backgroundColor = theme.colors.neutral[50];
            e.target.style.borderColor = theme.colors.error.main;
            e.target.style.color = theme.colors.error.main;
          }
        }}
        onMouseLeave={(e) => {
          if (!loading && !isLiked) {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.borderColor = theme.colors.neutral[300];
            e.target.style.color = theme.colors.neutral[600];
          }
        }}
      >
        <div>
          <FiHeart 
            size={16} 
            fill={isLiked ? 'currentColor' : 'none'} 
          />
        </div>
        <span>{optimisticCount}</span>
      </button>

      <CyclesNotification
        message={notificationData.message}
        amount={notificationData.amount}
        type={notificationData.type}
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </>
  );
}
