import { useState } from 'react';
import { freon_backend } from 'declarations/freon_backend';
import { Principal } from '@dfinity/principal';
import { useAuth } from '../../context/AuthContext';
import ImageUpload from '../common/ImageUpload';
import CyclesNotification from '../cycles/CyclesNotification';

export default function CreatePost({ onPostCreated }) {
  const { principal, error, setError } = useAuth();
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!postContent.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      const principalToPost = Principal.fromText(principal.toText());
      const ok = await freon_backend.create_post(principalToPost, postContent.trim(), postImage || '');
      if (ok) {
        setPostContent('');
        setPostImage('');
        
        // Show cycles notification for creating a post
        setShowNotification(true);
        
        if (onPostCreated) {
          onPostCreated(); // Notify parent component to refresh
        }
      } else {
        setError('Failed to create post.');
      }
    } catch (e) {
      setError('Post creation failed.');
    }
    setLoading(false);
  }

  const containerStyle = {
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '2rem'
  };

  const titleStyle = {
    fontSize: '1.25rem',
    marginBottom: '1rem',
    color: '#495057'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  };

  const textareaStyle = {
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ced4da',
    fontSize: '1rem',
    resize: 'vertical',
    minHeight: '100px',
    fontFamily: 'inherit'
  };

  const footerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const buttonStyle = {
    padding: '0.5rem 1.5rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: loading || !postContent.trim() ? 'not-allowed' : 'pointer',
    opacity: loading || !postContent.trim() ? 0.6 : 1
  };

  const counterStyle = {
    fontSize: '0.875rem',
    color: postContent.length > 250 ? '#dc3545' : '#6c757d'
  };

  return (
    <>
      <div style={containerStyle}>
        <h3 style={titleStyle}>What's on your mind?</h3>

        <form onSubmit={handleSubmit} style={formStyle}>
          <textarea
            placeholder="Share your thoughts with the community..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            maxLength={280}
            style={textareaStyle}
          />

          <div style={{ marginBottom: "1rem" }}>
            <ImageUpload
              currentImage={postImage}
              onImageChange={setPostImage}
              placeholder=""
              size={120}
              label="Add Image"
            />
          </div>
          <span style={counterStyle}>{postContent.length}/280 characters</span>

          <div style={footerStyle}>
            <button
              type="submit"
              disabled={loading || !postContent.trim()}
              style={buttonStyle}
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>

      <CyclesNotification
        message="You earned cycles for posting!"
        amount={10}
        type="earned"
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </>
  );
}
