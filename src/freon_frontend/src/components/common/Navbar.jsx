import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX, FiHome, FiEdit3, FiUser, FiLogOut } from 'react-icons/fi';
import Avatar from './Avatar';
import { theme } from '../../styles/theme';

export default function Navbar() {
  const { profile, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActiveLink = (path) => {
    if (path === '/feed') return location.pathname === '/feed';
    if (path === '/create-post') return location.pathname === '/create-post';
    if (path === '/profile') return location.pathname.startsWith('/profile');
    return false;
  };

  const navStyle = {
    position: 'sticky',
    top: 0,
    zIndex: theme.zIndex.sticky,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: `1px solid ${theme.colors.neutral[200]}`,
    marginBottom: '0'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '60px'
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary[900],
    textDecoration: 'none',
    fontFamily: theme.typography.fontFamily.heading
  };

  const desktopNavStyle = {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
  };

  const linkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: theme.colors.neutral[600],
    padding: '0.5rem 1rem',
    borderRadius: theme.borderRadius.md,
    transition: 'all 0.2s ease',
    fontSize: '0.875rem',
    fontWeight: theme.typography.fontWeight.medium
  };

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: theme.colors.secondary[500],
    color: 'white',
    boxShadow: theme.shadows.sm
  };

  const mobileMenuButtonStyle = {
    display: 'none',
    padding: '0.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    color: theme.colors.neutral[600],
    fontSize: '1.25rem',
    cursor: 'pointer'
  };

  const profileSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  };

  const logoutButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: theme.colors.error.main,
    color: 'white',
    border: 'none',
    borderRadius: theme.borderRadius.md,
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: theme.typography.fontWeight.medium,
    transition: 'all 0.2s ease'
  };

  const mobileMenuStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    borderBottom: `1px solid ${theme.colors.neutral[200]}`,
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  };

  const mobileLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    textDecoration: 'none',
    color: theme.colors.neutral[700],
    padding: '0.75rem 1rem',
    borderRadius: theme.borderRadius.lg,
    transition: 'all 0.2s ease',
    fontSize: '1rem'
  };

  const mobileActiveLinkStyle = {
    ...mobileLinkStyle,
    backgroundColor: theme.colors.secondary[500],
    color: 'white'
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        {/* Logo */}
        <Link to="/feed" style={logoStyle}>
          Freon
        </Link>
        
        {/* Desktop Navigation */}
        <div style={{...desktopNavStyle, '@media (max-width: 768px)': { display: 'none' }}}>
          <Link 
            to="/feed" 
            style={isActiveLink('/feed') ? activeLinkStyle : linkStyle}
          >
            <FiHome size={16} />
            Feed
          </Link>

          <Link 
            to="/create-post" 
            style={isActiveLink('/create-post') ? activeLinkStyle : linkStyle}
          >
            <FiEdit3 size={16} />
            Create
          </Link>
          
          <Link 
            to="/profile" 
            style={isActiveLink('/profile') ? activeLinkStyle : linkStyle}
          >
            <FiUser size={16} />
            Profile
          </Link>
          
          {profile && (
            <div style={profileSectionStyle}>
              <Avatar 
                src={profile.image_url}
                alt={`${profile.username}'s avatar`}
                size={32}
                username={profile.username}
                showPlaceholder={true}
              />
              <span style={{ 
                color: theme.colors.neutral[700], 
                fontSize: '0.875rem',
                fontWeight: theme.typography.fontWeight.medium
              }}>
                {profile.username}
              </span>
              <button 
                onClick={logout}
                style={logoutButtonStyle}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = theme.colors.error.dark;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = theme.colors.error.main;
                }}
              >
                <FiLogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          style={mobileMenuButtonStyle}
          onClick={toggleMobileMenu}
          className="mobile-menu-btn"
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          style={mobileMenuStyle}
          className="mobile-menu"
        >
            <Link 
              to="/feed" 
              style={isActiveLink('/feed') ? mobileActiveLinkStyle : mobileLinkStyle}
              onClick={closeMobileMenu}
            >
              <FiHome size={20} />
              Feed
            </Link>

            <Link 
              to="/create-post" 
              style={isActiveLink('/create-post') ? mobileActiveLinkStyle : mobileLinkStyle}
              onClick={closeMobileMenu}
            >
              <FiEdit3 size={20} />
              Create Post
            </Link>
            
            <Link 
              to="/profile" 
              style={isActiveLink('/profile') ? mobileActiveLinkStyle : mobileLinkStyle}
              onClick={closeMobileMenu}
            >
              <FiUser size={20} />
              Profile
            </Link>

            {profile && (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderTop: `1px solid ${theme.colors.neutral[200]}`,
                  marginTop: '0.5rem',
                  paddingTop: '1rem'
                }}>
                  <Avatar 
                    src={profile.image_url}
                    alt={`${profile.username}'s avatar`}
                    size={36}
                    username={profile.username}
                    showPlaceholder={true}
                  />
                  <span style={{ 
                    color: theme.colors.neutral[700],
                    fontSize: '1rem',
                    fontWeight: theme.typography.fontWeight.medium
                  }}>
                    {profile.username}
                  </span>
                </div>
                
                <button 
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  style={{
                    ...logoutButtonStyle,
                    width: '100%',
                    justifyContent: 'center',
                    marginTop: '0.5rem'
                  }}
                >
                  <FiLogOut size={20} />
                  Logout
                </button>
              </>
            )}
          </div>
        )}

      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }
        }
        
        @media (min-width: 769px) {
          .mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
