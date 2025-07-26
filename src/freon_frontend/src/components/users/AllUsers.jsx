import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { freon_backend } from 'declarations/freon_backend';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import FollowButton from '../common/FollowButton';
import Avatar from '../common/Avatar';

export default function AllUsers() {
  const { error, setError, principal } = useAuth();
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllUsers();
  }, []);

  async function fetchAllUsers() {
    setLoading(true);
    setError('');
    try {
      const result = await freon_backend.get_all_users();
      setAllUsers(result);
    } catch (e) {
      setError('Failed to fetch users.');
    }
    setLoading(false);
  }

  function handleViewUser(userPrincipal) {
    navigate(`/profile/user/${userPrincipal.toText()}`);
  }

  // Filter users based on search term
  const filteredUsers = allUsers.filter(([userPrincipal, userProfile]) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      userProfile.username.toLowerCase().includes(searchLower) ||
      userProfile.bio.toLowerCase().includes(searchLower)
    );
  });

  // Exclude current user from the list
  const otherUsers = filteredUsers.filter(([userPrincipal, _]) => 
    userPrincipal.toText() !== principal?.toText()
  );

  const containerStyle = {
    maxWidth: '800px',
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

  const searchStyle = {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '2rem'
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

  const userGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1rem'
  };

  const userCardStyle = {
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    padding: '1.5rem',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  };

  const userCardHoverStyle = {
    ...userCardStyle,
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  };

  const userHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem'
  };

  const avatarStyle = {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    marginRight: '1rem',
    objectFit: 'cover'
  };

  const usernameStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: '0.25rem'
  };

  const principalStyle = {
    fontSize: '0.75rem',
    color: '#868e96',
    fontFamily: 'monospace'
  };

  const bioStyle = {
    color: '#6c757d',
    fontSize: '0.9rem',
    lineHeight: '1.4'
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
    return <LoadingSpinner message="Loading community members..." />;
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Community Members</h2>
        <p style={subtitleStyle}>
          Discover and connect with other users on Freon
        </p>
      </div>

      <input
        type="text"
        placeholder="Search users by name or bio..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={searchStyle}
      />

      <div style={statsStyle}>
        <div style={statStyle}>
          <div style={statNumberStyle}>{allUsers.length}</div>
          <div style={statLabelStyle}>Total Users</div>
        </div>
        <div style={statStyle}>
          <div style={statNumberStyle}>{otherUsers.length}</div>
          <div style={statLabelStyle}>
            {searchTerm ? 'Filtered Results' : 'Other Users'}
          </div>
        </div>
      </div>

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      {otherUsers.length === 0 ? (
        <div style={emptyStateStyle}>
          <h3>
            {searchTerm ? 'No users found' : 'No other users yet'}
          </h3>
          <p>
            {searchTerm 
              ? 'Try adjusting your search terms.' 
              : 'You\'re among the first members of the community!'}
          </p>
        </div>
      ) : (
        <div style={userGridStyle}>
          {otherUsers.map(([userPrincipal, userProfile]) => (
            <div
              key={userPrincipal.toText()}
              style={userCardStyle}
              onMouseEnter={e => {
                Object.assign(e.target.style, userCardHoverStyle);
              }}
              onMouseLeave={e => {
                Object.assign(e.target.style, userCardStyle);
              }}
            >
              <div 
                onClick={() => handleViewUser(userPrincipal)}
                style={{...userHeaderStyle, cursor: 'pointer'}}
              >
                <Avatar 
                  src={userProfile.image_url}
                  alt={`${userProfile.username}'s avatar`}
                  size={50}
                  username={userProfile.username}
                  showPlaceholder={true}
                />
                <div style={{flex: 1, marginLeft: '12px'}}>
                  <div style={usernameStyle}>{userProfile.username}</div>
                  <div style={principalStyle}>
                    {userPrincipal.toText().slice(0, 20)}...
                  </div>
                </div>
              </div>
              <div 
                onClick={() => handleViewUser(userPrincipal)}
                style={{...bioStyle, cursor: 'pointer'}}
              >
                {userProfile.bio || 'No bio available'}
              </div>
              <div style={{marginTop: '1rem', display: 'flex', justifyContent: 'flex-end'}}>
                <FollowButton 
                  targetPrincipal={userPrincipal} 
                  targetUsername={userProfile.username}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
