import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { freon_backend } from 'declarations/freon_backend';
import { Principal } from '@dfinity/principal';
import { useAuth } from '../../context/AuthContext';
import PostCard from '../common/PostCard';
import LoadingSpinner from '../common/LoadingSpinner';
import FollowButton from '../common/FollowButton';

export default function ProfileView() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { error, setError } = useAuth();
  const [viewedUser, setViewedUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [showPosts, setShowPosts] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  async function fetchUserProfile() {
    setLoading(true);
    setError('');
    try {
      const userPrincipal = Principal.fromText(userId);
      const result = await freon_backend.get_user(userPrincipal);
      if (Array.isArray(result) && result.length > 0 && result[0]) {
        setViewedUser({ principal: userPrincipal, profile: result[0] });
      } else {
        setError('User not found.');
        navigate('/profile/users');
      }
    } catch (e) {
      setError('Failed to fetch user profile.');
      navigate('/profile/users');
    }
    setLoading(false);
  }

  async function fetchUserPosts() {
    if (!viewedUser) return;
    
    setPostsLoading(true);
    setError('');
    try {
      const posts = await freon_backend.get_posts_by_user(viewedUser.principal);
      // Sort posts by timestamp (newest first)
      const sortedPosts = (posts || []).sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
      setUserPosts(sortedPosts);
      setShowPosts(true);
    } catch (e) {
      setError('Failed to fetch user posts.');
    }
    setPostsLoading(false);
  }

  function handleBack() {
    navigate('/profile/users');
  }

  const containerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem',
    padding: '2rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #dee2e6'
  };

  const profileImageStyle = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    marginBottom: '1rem',
    border: '3px solid #007bff',
    objectFit: 'cover'
  };

  const titleStyle = {
    fontSize: '2rem',
    color: '#007bff',
    marginBottom: '0.5rem'
  };

  const bioStyle = {
    color: '#6c757d',
    fontSize: '1.1rem',
    marginBottom: '1rem'
  };

  const principalStyle = {
    fontSize: '0.875rem',
    color: '#868e96',
    fontFamily: 'monospace',
    backgroundColor: '#e9ecef',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    display: 'inline-block'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '2rem'
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.2s'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff',
    color: 'white'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6c757d',
    color: 'white'
  };

  const postsStyle = {
    marginTop: '2rem'
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
    padding: '2rem',
    color: '#6c757d'
  };

  if (loading) {
    return <LoadingSpinner message="Loading user profile..." />;
  }

  if (!viewedUser) {
    return (
      <div style={containerStyle}>
        <div style={errorStyle}>
          User not found.
        </div>
        <button onClick={handleBack} style={secondaryButtonStyle}>
          Back to Users
        </button>
      </div>
    );
  }

  const { principal: vPrincipal, profile: vProfile } = viewedUser;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <img 
          src={vProfile.image_url || '/logo2.svg'} 
          alt={vProfile.username}
          style={profileImageStyle}
        />
        <h1 style={titleStyle}>{vProfile.username}</h1>
        <p style={bioStyle}>{vProfile.bio}</p>
        <span style={principalStyle}>
          ID: {vPrincipal.toText()}
        </span>
        <div style={{marginTop: '1rem'}}>
          <FollowButton 
            targetPrincipal={vPrincipal} 
            targetUsername={vProfile.username}
          />
        </div>
      </div>

      <div style={buttonGroupStyle}>
        <button 
          onClick={fetchUserPosts}
          disabled={postsLoading}
          style={primaryButtonStyle}
        >
          {postsLoading ? 'Loading...' : `View ${vProfile.username}'s Posts`}
        </button>
        
        <button 
          onClick={handleBack}
          style={secondaryButtonStyle}
        >
          Back to Users
        </button>
      </div>

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      {showPosts && (
        <div style={postsStyle}>
          <h3 style={{ marginBottom: '1rem', color: '#495057' }}>
            {vProfile.username}'s Posts ({userPosts.length})
          </h3>
          
          {userPosts.length === 0 ? (
            <div style={emptyStateStyle}>
              <p>{vProfile.username} hasn't posted anything yet.</p>
            </div>
          ) : (
            <>
              {userPosts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  showAuthor={false}
                />
              ))}
              <button 
                onClick={() => setShowPosts(false)}
                style={secondaryButtonStyle}
              >
                Hide Posts
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
