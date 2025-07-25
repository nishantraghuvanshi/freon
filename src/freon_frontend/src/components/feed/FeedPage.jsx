import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { freon_backend } from 'declarations/freon_backend';
import { Principal } from '@dfinity/principal';
import PostCard from '../common/PostCard';
import CreatePost from './CreatePost';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

export default function FeedPage() {
  const { error, setError } = useAuth();
  const navigate = useNavigate();
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    fetchAllPosts();
    fetchAllUsers();
  }, []);

  // Fetch all posts from all users
  async function fetchAllPosts() {
    setLoading(true);
    setError('');
    try {
      const posts = await freon_backend.get_all_posts();
      // Sort posts by timestamp (newest first)
      const sortedPosts = posts.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
      setAllPosts(sortedPosts || []);
    } catch (e) {
      setError('Failed to fetch posts.');
    }
    setLoading(false);
  }

  // Fetch all users for author lookup
  async function fetchAllUsers() {
    try {
      const result = await freon_backend.get_all_users();
      setAllUsers(result);
    } catch (e) {
      console.error('Failed to fetch users for author lookup');
    }
  }

  // Handle clicking on post author
  function handleAuthorClick(authorPrincipal) {
    const foundUser = allUsers.find(([userPrincipal, _]) => 
      userPrincipal.toText() === authorPrincipal.toText()
    );
    if (foundUser) {
      navigate(`/profile/user/${foundUser[0].toText()}`);
    }
  }

  // Handle post creation success
  function handlePostCreated() {
    fetchAllPosts(); // Refresh the feed
  }

  const containerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '0 1rem'
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

  if (loading) {
    return <LoadingSpinner message="Loading global feed..." />;
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Global Feed</h1>
        <p style={subtitleStyle}>
          Discover what everyone is sharing on Freon
        </p>
      </div>

      <CreatePost onPostCreated={handlePostCreated} />

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        {allPosts.length === 0 ? (
          <div style={emptyStateStyle}>
            <h3>No posts yet</h3>
            <p>Be the first to share something with the community!</p>
          </div>
        ) : (
          <>
            <h3 style={{ marginBottom: '1rem', color: '#495057' }}>
              Latest Posts ({allPosts.length})
            </h3>
            {allPosts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                showAuthor={true} 
                onAuthorClick={handleAuthorClick}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
