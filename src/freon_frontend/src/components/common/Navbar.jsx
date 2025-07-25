import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { profile, logout } = useAuth();
  const location = useLocation();

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #dee2e6',
    marginBottom: '2rem'
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#007bff',
    textDecoration: 'none'
  };

  const navLinksStyle = {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#495057',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background-color 0.2s'
  };

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: '#007bff',
    color: 'white'
  };

  const profileImageStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    marginRight: '0.5rem'
  };

  return (
    <nav style={navStyle}>
      <Link to="/feed" style={logoStyle}>
        Freon
      </Link>
      
      <div style={navLinksStyle}>
        <Link 
          to="/feed" 
          style={location.pathname === '/feed' ? activeLinkStyle : linkStyle}
        >
          Feed
        </Link>
        
        <Link 
          to="/profile" 
          style={location.pathname.startsWith('/profile') ? activeLinkStyle : linkStyle}
        >
          Profile
        </Link>
        
        {profile && (
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem' }}>
            <img 
              src={profile.image_url || '/logo2.svg'} 
              alt="Profile" 
              style={profileImageStyle}
            />
            <span style={{ marginRight: '1rem', color: '#495057' }}>
              {profile.username}
            </span>
            <button 
              onClick={logout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
