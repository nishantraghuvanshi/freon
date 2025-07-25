import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function UserPage() {
  const { profile } = useAuth();
  const location = useLocation();

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
            <img 
              src={profile?.image_url || '/logo2.svg'} 
              alt="Profile" 
              style={profileImageStyle}
            />
            <h1 style={titleStyle}>{profile?.username}</h1>
            <p style={bioStyle}>{profile?.bio}</p>
            <span style={principalStyle}>
              ID: {profile?.username || 'Loading...'}
            </span>
          </div>

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
