import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import CyclesWallet from '../cycles/CyclesWallet';

export default function UserPage() {
  const { profile, principal, getFollowing, getFollowers } = useAuth();
  const location = useLocation();
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    if (principal) {
      fetchSocialStats();
    }
  }, [principal]);

  async function fetchSocialStats() {
    try {
      const following = await getFollowing(principal);
      const followers = await getFollowers(principal);
      setFollowingCount(following.length);
      setFollowersCount(followers.length);
    } catch (e) {
      console.error('Error fetching social stats:', e);
    }
  }

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 1rem'
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
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    marginBottom: '1rem',
    border: '3px solid #007bff'
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

  const socialStatsStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    marginTop: '1rem',
    marginBottom: '1rem'
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

  const navStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '2rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #dee2e6'
  };

  const linkStyle = {
    padding: '0.5rem 1rem',
    textDecoration: 'none',
    color: '#495057',
    borderRadius: '4px',
    transition: 'all 0.2s'
  };

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: '#007bff',
    color: 'white'
  };

  // Check if we're on the main profile page (not a sub-route)
  const isMainProfile = location.pathname === '/profile';

  return (
    <div style={containerStyle}>
      {isMainProfile && (
        <>
          <div style={headerStyle}>
            <Avatar 
              src={profile?.image_url}
              alt={`${profile?.username}'s avatar`}
              size={100}
              username={profile?.username || ''}
              showPlaceholder={true}
            />
            <h1 style={titleStyle}>{profile?.username}</h1>
            <p style={bioStyle}>{profile?.bio}</p>
            <span style={principalStyle}>
              ID: {profile?.username || 'Loading...'}
            </span>
            
            <div style={socialStatsStyle}>
              <div style={statStyle}>
                <div style={statNumberStyle}>{followingCount}</div>
                <div style={statLabelStyle}>Following</div>
              </div>
              <div style={statStyle}>
                <div style={statNumberStyle}>{followersCount}</div>
                <div style={statLabelStyle}>Followers</div>
              </div>
            </div>
          </div>

          <CyclesWallet />

          <nav style={navStyle}>
            <Link 
              to="/profile/edit" 
              style={linkStyle}
            >
              ✏️ Edit Profile
            </Link>
            
            <Link 
              to="/profile/posts" 
              style={linkStyle}
            >
              📝 My Posts
            </Link>
            
            <Link 
              to="/profile/users" 
              style={linkStyle}
            >
              👥 Browse Users
            </Link>
          </nav>

          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 1rem',
            color: '#6c757d' 
          }}>
            <h3>Welcome to your profile!</h3>
            <p>Choose an option above to manage your profile, view your posts, or explore other users.</p>
          </div>
        </>
      )}

      <Outlet />
    </div>
  );
}
