import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiX, FiImage, FiCheck } from 'react-icons/fi';
import { theme } from '../../styles/theme.js';
import toast from 'react-hot-toast';

export default function ImageUpload({ 
  currentImage, 
  onImageChange, 
  placeholder = '/logo2.svg',
  size = 100,
  label = 'Upload Image',
  variant = 'circular'
}) {
  const [preview, setPreview] = useState(currentImage || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection
  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file', {
        style: {
          background: theme.colors.error.main,
          color: theme.colors.neutral[0]
        }
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB', {
        style: {
          background: theme.colors.error.main,
          color: theme.colors.neutral[0]
        }
      });
      return;
    }

    setUploading(true);

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target.result;
      setPreview(base64String);
      onImageChange(base64String);
      setUploading(false);
      toast.success('Image uploaded successfully!', {
        style: {
          background: theme.colors.success.main,
          color: theme.colors.neutral[0]
        }
      });
    };
    reader.onerror = () => {
      toast.error('Error reading file', {
        style: {
          background: theme.colors.error.main,
          color: theme.colors.neutral[0]
        }
      });
      setUploading(false);
    };
    reader.readAsDataURL(file);
  }

  // Handle remove image
  function handleRemoveImage() {
    setPreview('');
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('Image removed', {
      style: {
        background: theme.colors.neutral[600],
        color: theme.colors.neutral[0]
      }
    });
  }

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing[4],
    position: 'relative'
  };

  const imageContainerStyle = {
    position: 'relative',
    display: 'inline-block',
    borderRadius: variant === 'circular' ? '50%' : theme.borderRadius.xl,
    overflow: 'hidden',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '3px solid rgba(255, 255, 255, 0.2)',
    boxShadow: theme.shadows.lg,
    transition: 'all 0.3s ease'
  };

  const imageStyle = {
    width: `${size}px`,
    height: `${size}px`,
    objectFit: 'cover',
    backgroundColor: 'transparent',
    transition: 'all 0.3s ease'
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    cursor: 'pointer'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: theme.spacing[3],
    flexWrap: 'wrap',
    justifyContent: 'center'
  };

  const buttonBaseStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[2],
    padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
    borderRadius: theme.borderRadius.lg,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    fontFamily: theme.typography.fontFamily.primary,
    cursor: uploading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    border: 'none',
    position: 'relative',
    overflow: 'hidden'
  };

  const uploadButtonStyle = {
    ...buttonBaseStyle,
    background: `linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.primary[600]} 100%)`,
    color: theme.colors.neutral[0],
    boxShadow: theme.shadows.md,
    opacity: uploading ? 0.7 : 1
  };

  const removeButtonStyle = {
    ...buttonBaseStyle,
    background: `linear-gradient(135deg, ${theme.colors.error.main} 0%, ${theme.colors.error.dark} 100%)`,
    color: theme.colors.neutral[0],
    boxShadow: theme.shadows.md,
    opacity: uploading ? 0.7 : 1
  };

  const hiddenInputStyle = {
    display: 'none'
  };

  const LoadingOverlay = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colors.neutral[0],
        fontSize: theme.typography.fontSize.sm,
        gap: theme.spacing[2]
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{
          width: '24px',
          height: '24px',
          border: '2px solid transparent',
          borderTop: '2px solid currentColor',
          borderRadius: '50%'
        }}
      />
      <span>Uploading...</span>
    </motion.div>
  );

  return (
    <motion.div 
      style={containerStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        style={imageContainerStyle}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <img 
          src={preview || placeholder} 
          alt="Preview" 
          style={imageStyle}
          onError={(e) => {
            e.target.src = placeholder;
          }}
        />
        
        {/* Hover overlay */}
        <div 
          style={overlayStyle}
          onMouseEnter={(e) => e.target.style.opacity = '1'}
          onMouseLeave={(e) => e.target.style.opacity = '0'}
          onClick={() => fileInputRef.current?.click()}
        >
          <FiImage size={24} color={theme.colors.neutral[0]} />
        </div>

        {/* Loading overlay */}
        <AnimatePresence>
          {uploading && <LoadingOverlay />}
        </AnimatePresence>
      </motion.div>

      <motion.div 
        style={buttonGroupStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={uploadButtonStyle}
          whileHover={!uploading ? { 
            scale: 1.05, 
            boxShadow: theme.shadows.lg,
            background: `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 100%)`
          } : {}}
          whileTap={!uploading ? { scale: 0.95 } : {}}
        >
          {uploading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid transparent',
                  borderTop: '2px solid currentColor',
                  borderRadius: '50%'
                }}
              />
              Uploading...
            </>
          ) : (
            <>
              <FiUpload size={16} />
              {label}
            </>
          )}
        </motion.button>

        <AnimatePresence>
          {preview && preview !== placeholder && (
            <motion.button
              type="button"
              onClick={handleRemoveImage}
              disabled={uploading}
              style={removeButtonStyle}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={!uploading ? { 
                scale: 1.05, 
                boxShadow: theme.shadows.lg 
              } : {}}
              whileTap={!uploading ? { scale: 0.95 } : {}}
            >
              <FiX size={16} />
              Remove
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={hiddenInputStyle}
      />
    </motion.div>
  );
}
