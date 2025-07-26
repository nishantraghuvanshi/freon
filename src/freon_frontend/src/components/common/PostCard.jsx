import { useState, useEffect } from 'react';
import { FiHeart, FiMessageCircle, FiMoreVertical } from 'react-icons/fi';
import { freon_backend } from 'declarations/freon_backend';
import { Principal } from '@dfinity/principal';
import LikeButton from '../social/LikeButton';
import Avatar from './Avatar';
import Card from '../ui/Card';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../styles/theme';

export default function PostCard({ post, onPostUpdate }) {
  const { currentUser } = useAuth();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPost, setCurrentPost] = useState(post);

  useEffect(() => {
    fetchAuthor();
  }, [post.author]);

  useEffect(() => {
    setCurrentPost(post);
  }, [post]);

  async function fetchAuthor() {
    try {
      const result = await freon_backend.get_user(post.author);
      if (Array.isArray(result) && result.length > 0 && result[0]) {
        setAuthor(result[0]);
      }
    } catch (error) {
      console.error('Failed to fetch author:', error);
    }
    setLoading(false);
  }

  // Format timestamp
  function formatTimestamp(timestamp) {
    const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  if (loading) {
    return (
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      {/* Author Info */}
      <div className="flex items-center gap-3 mb-6">
        <Avatar 
          src={author?.image_url}
          alt={`${author?.username || 'User'}'s avatar`}
          size={40}
          username={author?.username}
          showPlaceholder={true}
        />
        <div className="flex-1">
          <div className="font-light text-gray-900 text-xs">
            {author?.username || 'Unknown User'}
          </div>
          <div className="text-xs text-gray-500">
            {formatTimestamp(currentPost.timestamp)}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-6 text-black leading-relaxed text-base">
        {currentPost.content}
      </div>
      
      {/* Post Image */}
      {currentPost.image_url && (
        <div className="mb-6">
          <img 
            src={currentPost.image_url}
            alt="Post image"
            className="w-full max-w-md h-auto rounded-lg border border-gray-200 shadow-sm"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Social Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center">
          <LikeButton 
            postId={currentPost.id} 
            initialLikes={Number(currentPost.likes)} 
            onLikeChange={onPostUpdate}
          />
        </div>
      </div>
    </Card>
  );
}
