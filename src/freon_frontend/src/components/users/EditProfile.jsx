import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ImageUpload from '../common/ImageUpload';

export default function EditProfile() {
  const { profile, updateProfile, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: profile?.username || '',
    bio: profile?.bio || '',
    image_url: profile?.image_url || ''
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    
    const success = await updateProfile(form.username, form.bio, form.image_url);
    if (success) {
      navigate('/profile');
    }
    
    setLoading(false);
  }

  function handleCancel() {
    navigate('/profile');
  }

  const containerStyle = {
    maxWidth: '500px',
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

  const previewStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2rem'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  const inputStyle = {
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '1rem'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem'
  };

  const primaryButtonStyle = {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1
  };

  const secondaryButtonStyle = {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer'
  };

  const errorStyle = {
    color: '#dc3545',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '4px',
    padding: '0.75rem',
    marginTop: '1rem'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Edit Profile</h2>
        <p style={subtitleStyle}>Update your profile information</p>
      </div>

      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <ImageUpload
          currentImage={form.image_url}
          onImageChange={(imageUrl) => setForm({ ...form, image_url: imageUrl })}
          size={100}
          label="Change Avatar"
        />
      </div>

      <form onSubmit={handleSubmit} style={formStyle}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Username
          </label>
          <input
            type="text"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            style={inputStyle}
            required
            placeholder="Enter your username"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Bio
          </label>
          <textarea
            value={form.bio}
            onChange={e => setForm({ ...form, bio: e.target.value })}
            style={textareaStyle}
            placeholder="Tell us about yourself..."
            maxLength={500}
          />
          <small style={{ color: '#6c757d' }}>
            {form.bio.length}/500 characters
          </small>
        </div>

        <div style={buttonGroupStyle}>
          <button 
            type="submit" 
            disabled={loading || !form.username.trim()}
            style={primaryButtonStyle}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          
          <button 
            type="button" 
            onClick={handleCancel}
            style={secondaryButtonStyle}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}
    </div>
  );
}
