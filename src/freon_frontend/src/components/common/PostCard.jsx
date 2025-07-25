import { useEffect, useState } from 'react';
import { freon_backend } from 'declarations/freon_backend';

export default function PostCard({ post, showAuthor = false, onAuthorClick = null }) {
  const [authorProfile, setAuthorProfile] = useState(null);

  useEffect(() => {
    if (showAuthor) {
      getUserProfile(post.author).then(profile => {
        setAuthorProfile(profile);
      });
    }
  }, [post.author, showAuthor]);

  // Get user profile for a post author
  async function getUserProfile(userPrincipal) {
    try {
      const result = await freon_backend.get_user(userPrincipal);
      if (Array.isArray(result) && result.length > 0 && result[0]) {
        return result[0];
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  // Format timestamp
  function formatTimestamp(timestamp) {
    const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
    return date.toLocaleString();
  }

  return (
    <div style={{ 
      border: '1px solid #eee', 
      borderRadius: 8, 
      padding: 12, 
      marginBottom: 12,
      backgroundColor: '#f9f9f9'
    }}>
      {showAuthor && authorProfile && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: 8,
          cursor: onAuthorClick ? 'pointer' : 'default'
        }} onClick={() => onAuthorClick && onAuthorClick(post.author)}>
          <img 
            src={authorProfile.image_url || '/logo2.svg'} 
            alt="avatar" 
            width={24} 
            height={24} 
            style={{ borderRadius: 12, marginRight: 8 }} 
          />
          <strong style={{ color: '#007bff' }}>{authorProfile.username}</strong>
        </div>
      )}
      <p style={{ margin: '0 0 8px 0' }}>{post.content}</p>
      <small style={{ color: '#666' }}>
        Posted on {formatTimestamp(post.timestamp)}
      </small>
    </div>
  );
}
