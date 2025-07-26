import { useState, useEffect } from 'react';
import { freon_backend } from 'declarations/freon_backend';
import { Principal } from '@dfinity/principal';
import { useAuth } from '../../context/AuthContext';
import PostCard from '../common/PostCard';
import LoadingSpinner from '../common/LoadingSpinner';

export default function UserPosts() {
  const { principal, error, setError } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (principal) {
      fetchUserPosts();
    }
  }, [principal]);

  async function fetchUserPosts() {
    setLoading(true);
    setError('');
    try {
      const principalToQuery = Principal.fromText(principal.toText());
      const posts = await freon_backend.get_posts_by_user(principalToQuery);
      // Sort posts by timestamp (newest first)
      const sortedPosts = (posts || []).sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
      setUserPosts(sortedPosts);
    } catch (e) {
      setError('Failed to fetch your posts.');
    }
    setLoading(false);
  }

  const containerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem'
  };

  const titleStyle = {
    fontSize: '2rem',
    color: '#007bff',
    marginBottom: '0.5rem'
  };

  const subtitleStyle = {
    color: '#6c757d'
  };

  const errorStyle = {
    color: '#dc3545',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '4px',
    padding: '0.75rem',
    marginBottom: '1rem'
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '3rem 1rem',
    color: '#6c757d'
  };

  const statsStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '2rem'
  };

  const statStyle = {
    textAlign: 'center'
  };

  const statNumberStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#007bff'
  };

  const statLabelStyle = {
    fontSize: '0.875rem',
    color: '#6c757d'
  };

  const refreshButtonStyle = {
    padding: '0.5rem 1rem',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '1rem'
  };

  if (loading) {
    return <LoadingSpinner message="Loading your posts..." />;
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>My Posts</h2>
        <p style={subtitleStyle}>
          Manage and view all your posts
        </p>
      </div>

      <div style={statsStyle}>
        <div style={statStyle}>
          <div style={statNumberStyle}>{userPosts.length}</div>
          <div style={statLabelStyle}>Total Posts</div>
        </div>
        <div style={statStyle}>
          <div style={statNumberStyle}>
            {userPosts.length > 0 ? Math.round(userPosts.reduce((acc, post) => acc + post.content.length, 0) / userPosts.length) : 0}
          </div>
          <div style={statLabelStyle}>Avg. Characters</div>
        </div>
      </div>

      <button 
        onClick={fetchUserPosts}
        style={refreshButtonStyle}
        disabled={loading}
      >
        🔄 Refresh Posts
      </button>

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      {userPosts.length === 0 ? (
        <div style={emptyStateStyle}>
          <h3>No posts yet</h3>
          <p>You haven't shared anything yet. Visit the feed to create your first post!</p>
        </div>
      ) : (
        <div>
          {userPosts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              showAuthor={false}
              onUpdate={fetchUserPosts}
            />
          ))}
        </div>
      )}
    </div>
  );
}
