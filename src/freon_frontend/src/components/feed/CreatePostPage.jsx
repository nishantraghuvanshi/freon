import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePost from './CreatePost';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle post creation success
  function handlePostCreated() {
    setShowSuccess(true);
    // Show success message briefly, then redirect to feed
    setTimeout(() => {
      navigate('/feed');
    }, 2000);
  }

  const containerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem 1rem'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '3rem'
  };

  const titleStyle = {
    fontSize: '2.5rem',
    color: '#007bff',
    marginBottom: '0.5rem'
  };

  const subtitleStyle = {
    color: '#6c757d',
    fontSize: '1.1rem',
    marginBottom: '2rem'
  };

  const backButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    textDecoration: 'none',
    cursor: 'pointer',
    marginBottom: '2rem',
    fontSize: '1rem',
    transition: 'background-color 0.2s'
  };

  const successMessageStyle = {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #c3e6cb',
    marginBottom: '2rem',
    textAlign: 'center',
    fontSize: '1.1rem'
  };

  const createPostContainerStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    border: '1px solid #e9ecef'
  };

  return (
    <div style={containerStyle}>
      <button
        onClick={() => navigate('/feed')}
        style={backButtonStyle}
        onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
      >
        ← Back to Feed
      </button>

      <div style={headerStyle}>
        <h1 style={titleStyle}>Create New Post</h1>
        <p style={subtitleStyle}>
          Share your thoughts, ideas, and moments with the Freon community
        </p>
      </div>

      {showSuccess && (
        <div style={successMessageStyle}>
          🎉 Your post has been created successfully! Redirecting to feed...
        </div>
      )}

      <div style={createPostContainerStyle}>
        <CreatePost onPostCreated={handlePostCreated} />
      </div>
    </div>
  );
}
