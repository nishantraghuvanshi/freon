import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../common/ImageUpload';

export default function RegisterPage() {
  const { register, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', bio: '', image_url: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    
    const success = await register(form.username, form.bio, form.image_url);
    if (success) {
      navigate('/feed'); // Redirect to feed after successful registration
    }
    
    setLoading(false);
  }

  const containerStyle = {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '2rem',
    textAlign: 'center'
  };

  const titleStyle = {
    fontSize: '2rem',
    color: '#007bff',
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

  const buttonStyle = {
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1
  };

  const errorStyle = {
    color: '#dc3545',
    marginTop: '1rem',
    padding: '0.5rem',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '4px'
  };

  const previewStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem'
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Create Your Profile</h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <ImageUpload
          currentImage={form.image_url}
          onImageChange={(imageUrl) => setForm({ ...form, image_url: imageUrl })}
          size={100}
          label="Upload Avatar"
        />
      </div>

      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          placeholder="Username (required)"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          style={inputStyle}
          required
        />
        
        <textarea
          placeholder="Tell us about yourself..."
          value={form.bio}
          onChange={e => setForm({ ...form, bio: e.target.value })}
          style={textareaStyle}
        />
        
        <button 
          type="submit" 
          disabled={loading || !form.username.trim()}
          style={buttonStyle}
        >
          {loading ? 'Creating Profile...' : 'Create Profile'}
        </button>
      </form>

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}
    </div>
  );
}
