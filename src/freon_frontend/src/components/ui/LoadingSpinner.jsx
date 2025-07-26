import { theme } from '../../styles/theme.js';

export default function LoadingSpinner({ 
  size = 'medium', 
  message = '', 
  variant = 'primary',
  fullScreen = false 
}) {
  const sizeMap = {
    small: 20,
    medium: 40,
    large: 60,
    xlarge: 80
  };

  const spinnerSize = sizeMap[size];

  const colorVariants = {
    primary: theme.colors.primary[500],
    secondary: theme.colors.secondary[500],
    white: theme.colors.neutral[0],
    dark: theme.colors.neutral[800]
  };

  const SpinnerComponent = () => (
    <div
      style={{
        width: spinnerSize,
        height: spinnerSize,
        border: `3px solid ${colorVariants[variant]}20`,
        borderTop: `3px solid ${colorVariants[variant]}`,
        borderRadius: '50%',
        position: 'relative',
        animation: 'spin 1s linear infinite'
      }}
    />
  );

  const DotsSpinner = () => (
    <div style={{ display: 'flex', gap: theme.spacing[2] }}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          style={{
            width: 8,
            height: 8,
            backgroundColor: colorVariants[variant],
            borderRadius: '50%'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.2
          }}
        />
      ))}
    </div>
  );

  const PulseSpinner = () => (
    <motion.div
      style={{
        width: spinnerSize,
        height: spinnerSize,
        backgroundColor: colorVariants[variant],
        borderRadius: '50%'
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 0.3, 0.7]
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  );

  const SkeletonLoader = ({ width = '100%', height = '20px', className = '' }) => (
    <motion.div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius: theme.borderRadius.md,
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%'
      }}
      animate={{
        backgroundPosition: ['200% 0', '-200% 0']
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  );

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[4],
    padding: theme.spacing[6],
    ...(fullScreen && {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(5px)',
      zIndex: theme.zIndex.modal
    })
  };

  const messageStyle = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    fontWeight: theme.typography.fontWeight.medium,
    textAlign: 'center'
  };

  return (
    <div
      style={containerStyle}
    >
      <SpinnerComponent />
      {message && (
        <p
          style={messageStyle}
        >
          {message}
        </p>
      )}
      
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Specialized loading components
export function DotsLoader({ message = '', variant = 'primary' }) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: theme.spacing[3] 
    }}>
      <div style={{ display: 'flex', gap: theme.spacing[2] }}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            style={{
              width: 8,
              height: 8,
              backgroundColor: theme.colors[variant][500],
              borderRadius: '50%'
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: index * 0.2
            }}
          />
        ))}
      </div>
      {message && (
        <p style={{
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.neutral[600]
        }}>
          {message}
        </p>
      )}
    </div>
  );
}

export function SkeletonLoader({ 
  width = '100%', 
  height = '20px', 
  className = '',
  lines = 1,
  gap = theme.spacing[2]
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          className={`skeleton ${className}`}
          style={{
            width: index === lines - 1 && lines > 1 ? '60%' : width,
            height,
            borderRadius: theme.borderRadius.md,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%'
          }}
          animate={{
            backgroundPosition: ['200% 0', '-200% 0']
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
            delay: index * 0.1
          }}
        />
      ))}
    </div>
  );
}

export function PulseLoader({ size = 'medium', variant = 'primary' }) {
  const sizeMap = {
    small: 20,
    medium: 40,
    large: 60
  };

  return (
    <motion.div
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        backgroundColor: theme.colors[variant][500],
        borderRadius: '50%'
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 0.3, 0.7]
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  );
}
