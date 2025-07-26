import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiGlobe, FiUsers } from 'react-icons/fi';
import { freon_backend } from 'declarations/freon_backend';
import { Principal } from '@dfinity/principal';
import PostCard from '../common/PostCard';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../styles/theme';

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

  // Refresh feeds when component mounts or when returning from create post
  useEffect(() => {
    const refreshFeeds = () => {
      fetchAllPosts();
      fetchPersonalizedFeed();
    };

    // Refresh immediately
    refreshFeeds();

    // Set up interval to refresh periodically
    const interval = setInterval(refreshFeeds, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Switch feed type
  function switchFeedType(type) {
    setFeedType(type);
  }

  // Get current posts based on feed type
  const currentPosts = feedType === 'personal' ? personalizedPosts : allPosts;

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '1rem',
    minHeight: '100vh'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem',
    padding: '1rem'
  };

  const titleStyle = {
    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
    color: theme.colors.primary[900],
    marginBottom: '0.5rem',
    fontFamily: theme.typography.fontFamily.heading,
    fontWeight: theme.typography.fontWeight.bold
  };

  const subtitleStyle = {
    color: theme.colors.neutral[600],
    marginBottom: '1.5rem',
    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
    lineHeight: theme.typography.lineHeight.relaxed
  };

  const activeToggleStyle = {
    padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
    border: `2px solid ${theme.colors.secondary[500]}`,
    borderRadius: theme.borderRadius.lg,
    cursor: 'pointer',
    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
    fontWeight: theme.typography.fontWeight.medium,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    minWidth: 'fit-content',
    backgroundColor: theme.colors.secondary[500],
    color: 'white',
    boxShadow: theme.shadows.md
  };

  const inactiveToggleStyle = {
    padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
    border: `2px solid ${theme.colors.secondary[500]}`,
    borderRadius: theme.borderRadius.lg,
    cursor: 'pointer',
    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
    fontWeight: theme.typography.fontWeight.medium,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    minWidth: 'fit-content',
    backgroundColor: 'white',
    color: theme.colors.secondary[500]
  };

  const createPostPromptStyle = {
    marginBottom: '2rem'
  };

  const createButtonStyle = {
    width: '100%',
    padding: '1.5rem',
    justifyContent: 'center',
    fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
    gap: '0.75rem'
  };

  const errorStyle = {
    backgroundColor: theme.colors.error.light,
    color: 'white',
    padding: '1rem',
    borderRadius: theme.borderRadius.lg,
    marginBottom: '1rem',
    textAlign: 'center'
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: 'clamp(2rem, 5vw, 3rem) 1rem',
    color: theme.colors.neutral[600]
  };

  const feedToggleStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem',
    gap: '0.75rem',
    flexWrap: 'wrap',
    padding: '0 1rem'
  };

  const postsContainerStyle = {
    marginTop: '2rem'
  };

  const postsHeaderStyle = {
    marginBottom: '1.5rem',
    color: theme.colors.neutral[700],
    fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)',
    fontWeight: theme.typography.fontWeight.semibold,
    padding: '0 0.5rem'
  };

  if (loading) {
    return <LoadingSpinner message="Loading feed..." fullScreen />;
  }

  return (
    <div 
      style={containerStyle}
    >
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
          <FiGlobe size={18} />
          Global Feed ({allPosts.length})
        </button>
        
        <button
          onClick={() => switchFeedType('personal')}
          style={feedType === 'personal' ? activeToggleStyle : inactiveToggleStyle}
        >
          <FiUsers size={18} />
          Personal Feed ({personalizedPosts.length})
        </button>
      </div>

      <Card variant="elevated" style={createPostPromptStyle}>
        <Button
          variant="primary"
          size="large"
          style={createButtonStyle}
          onClick={() => navigate('/create-post')}
        >
          <FiPlus size={20} />
          Create New Post
        </Button>
      </Card>

      {error && (
        <div 
          style={errorStyle}
        >
          {error}
        </div>
      )}

      <div style={postsContainerStyle}>
        {currentPosts.length === 0 ? (
          <div 
            style={emptyStateStyle}
          >
            <h3 style={{ marginBottom: '1rem', fontSize: 'clamp(1.25rem, 3vw, 1.5rem)' }}>
              {feedType === 'personal' ? 'No posts in your personal feed' : 'No posts yet'}
            </h3>
            <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', lineHeight: 1.6 }}>
              {feedType === 'personal' 
                ? 'Follow some users to see their posts here, or switch to the Global Feed to discover content.'
                : 'Be the first to share something with the community!'
              }
            </p>
          </div>
        ) : (
          <>
            <h3 style={postsHeaderStyle}>
              {feedType === 'personal' ? 'From People You Follow' : 'Latest Posts'} ({currentPosts.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {currentPosts.map((post, index) => (
                <div
                  key={post.id}
                >
                  <PostCard 
                    post={post} 
                    showAuthor={true} 
                    onAuthorClick={handleAuthorClick}
                    onUpdate={() => {
                      fetchAllPosts();
                      fetchPersonalizedFeed();
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
