import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function FollowButton({ targetPrincipal, targetUsername }) {
  const { principal, followUser, unfollowUser, getFollowing } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if already following on component mount
  useEffect(() => {
    checkFollowingStatus();
  }, [targetPrincipal]);

  async function checkFollowingStatus() {
    if (!principal || !targetPrincipal) return;
    
    try {
      const followingList = await getFollowing(principal);
      const isCurrentlyFollowing = followingList.some(
        p => p.toText() === targetPrincipal.toText()
      );
      setIsFollowing(isCurrentlyFollowing);
    } catch (e) {
      console.error('Error checking follow status:', e);
    }
  }

  async function handleFollowToggle() {
    if (!principal || !targetPrincipal) return;
    
    setLoading(true);
    try {
      if (isFollowing) {
        const success = await unfollowUser(targetPrincipal);
        if (success) {
          setIsFollowing(false);
        }
      } else {
        const success = await followUser(targetPrincipal);
        if (success) {
          setIsFollowing(true);
        }
      }
    } catch (e) {
      console.error('Error toggling follow:', e);
    }
    setLoading(false);
  }

  // Don't show follow button for own profile
  if (principal && principal.toText() === targetPrincipal.toText()) {
    return null;
  }

  const buttonStyle = {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '6px',
    cursor: loading ? 'not-allowed' : 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s',
    backgroundColor: isFollowing ? '#dc3545' : '#007bff',
    color: 'white',
    opacity: loading ? 0.7 : 1
  };

  const hoverStyle = {
    backgroundColor: isFollowing ? '#c82333' : '#0056b3'
  };

  return (
    <button
      onClick={handleFollowToggle}
      disabled={loading}
      style={buttonStyle}
      onMouseOver={(e) => {
        if (!loading) {
          e.target.style.backgroundColor = hoverStyle.backgroundColor;
        }
      }}
      onMouseOut={(e) => {
        if (!loading) {
          e.target.style.backgroundColor = buttonStyle.backgroundColor;
        }
      }}
    >
      {loading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
}
