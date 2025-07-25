import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { freon_backend } from 'declarations/freon_backend';
import { Principal } from '@dfinity/principal';
import PostCard from '../common/PostCard';
import CreatePost from './CreatePost';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

export default function FeedPage() {
  const { error, setError, getPersonalizedFeed } = useAuth();
  const navigate = useNavigate();
  const [allPosts, setAllPosts] = useState([]);
  const [personalizedPosts, setPersonalizedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [feedType, setFeedType] = useState('global'); // 'global' or 'personal'

  useEffect(() => {
    fetchAllPosts();
    fetchAllUsers();
    fetchPersonalizedFeed();
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

  // Fetch personalized feed
  async function fetchPersonalizedFeed() {
    try {
      const posts = await getPersonalizedFeed();
      // Sort posts by timestamp (newest first)
      const sortedPosts = posts.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
      setPersonalizedPosts(sortedPosts || []);
    } catch (e) {
      console.error('Failed to fetch personalized feed');
    }
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
    fetchAllPosts(); // Refresh the feeds
    fetchPersonalizedFeed();
  }

  // Switch feed type
  function switchFeedType(type) {
    setFeedType(type);
  }

  // Get current posts based on feed type
  const currentPosts = feedType === 'personal' ? personalizedPosts : allPosts;

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

  const feedToggleStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem',
    gap: '0.5rem'
  };

  const toggleButtonStyle = {
    padding: '0.5rem 1rem',
    border: '1px solid #007bff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s'
  };

  const activeToggleStyle = {
    ...toggleButtonStyle,
    backgroundColor: '#007bff',
    color: 'white'
  };

  const inactiveToggleStyle = {
    ...toggleButtonStyle,
    backgroundColor: 'white',
    color: '#007bff'
  };

  if (loading) {
    return <LoadingSpinner message="Loading feed..." />;
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>
          {feedType === 'personal' ? 'Personal Feed' : 'Global Feed'}
        </h1>
        <p style={subtitleStyle}>
          {feedType === 'personal' 
            ? 'Posts from people you follow' 
            : 'Discover what everyone is sharing on Freon'
          }
        </p>
      </div>

      <div style={feedToggleStyle}>
        <button
          onClick={() => switchFeedType('global')}
          style={feedType === 'global' ? activeToggleStyle : inactiveToggleStyle}
        >
          Global Feed ({allPosts.length})
        </button>
        <button
          onClick={() => switchFeedType('personal')}
          style={feedType === 'personal' ? activeToggleStyle : inactiveToggleStyle}
        >
          Personal Feed ({personalizedPosts.length})
        </button>
      </div>

      <CreatePost onPostCreated={handlePostCreated} />

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        {currentPosts.length === 0 ? (
          <div style={emptyStateStyle}>
            <h3>
              {feedType === 'personal' ? 'No posts in your personal feed' : 'No posts yet'}
            </h3>
            <p>
              {feedType === 'personal' 
                ? 'Follow some users to see their posts here, or switch to the Global Feed to discover content.'
                : 'Be the first to share something with the community!'
              }
            </p>
          </div>
        ) : (
          <>
            <h3 style={{ marginBottom: '1rem', color: '#495057' }}>
              {feedType === 'personal' ? 'From People You Follow' : 'Latest Posts'} ({currentPosts.length})
            </h3>
            {currentPosts.map((post) => (
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
