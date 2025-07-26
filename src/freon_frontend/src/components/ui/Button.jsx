import { theme } from '../../styles/theme.js';

export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  isDisabled = false,
  leftIcon = null,
  rightIcon = null,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const buttonVariants = {
    primary: {
      background: `linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.primary[600]} 100%)`,
      color: theme.colors.neutral[0],
      border: 'none',
      '&:hover': {
        background: `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 100%)`,
        transform: 'translateY(-1px)',
        boxShadow: theme.shadows.lg
      },
      '&:active': {
        transform: 'translateY(0)',
        boxShadow: theme.shadows.md
      }
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: theme.colors.neutral[700],
      border: `1px solid ${theme.colors.neutral[300]}`,
      backdropFilter: 'blur(10px)',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.2)',
        borderColor: theme.colors.primary[500],
        transform: 'translateY(-1px)'
      }
    },
    outline: {
      background: 'transparent',
      color: theme.colors.primary[600],
      border: `2px solid ${theme.colors.primary[500]}`,
      '&:hover': {
        background: theme.colors.primary[500],
        color: theme.colors.neutral[0],
        transform: 'translateY(-1px)'
      }
    },
    ghost: {
      background: 'transparent',
      color: theme.colors.neutral[700],
      border: 'none',
      '&:hover': {
        background: 'rgba(0, 0, 0, 0.05)',
        transform: 'translateY(-1px)'
      }
    },
    danger: {
      background: `linear-gradient(135deg, ${theme.colors.error.main} 0%, ${theme.colors.error.dark} 100%)`,
      color: theme.colors.neutral[0],
      border: 'none',
      '&:hover': {
        background: `linear-gradient(135deg, ${theme.colors.error.dark} 0%, #c62828 100%)`,
        transform: 'translateY(-1px)'
      }
    }
  };

  const sizeStyles = {
    small: {
      padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
      fontSize: theme.typography.fontSize.sm,
      borderRadius: theme.borderRadius.md
    },
    medium: {
      padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
      fontSize: theme.typography.fontSize.base,
      borderRadius: theme.borderRadius.lg
    },
    large: {
      padding: `${theme.spacing[4]} ${theme.spacing[8]}`,
      fontSize: theme.typography.fontSize.lg,
      borderRadius: theme.borderRadius.xl
    }
  };

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
    fontFamily: theme.typography.fontFamily.primary,
    fontWeight: theme.typography.fontWeight.medium,
    cursor: isDisabled || isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    position: 'relative',
    overflow: 'hidden',
    userSelect: 'none',
    width: fullWidth ? '100%' : 'auto',
    opacity: isDisabled ? 0.6 : 1,
    ...sizeStyles[size],
    ...buttonVariants[variant]
  };

  const LoadingSpinner = () => (
    <div
      style={{
        width: '16px',
        height: '16px',
        border: '2px solid transparent',
        borderTop: '2px solid currentColor',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}
    />
  );

  return (
    <button
      type={type}
      onClick={isDisabled || isLoading ? undefined : onClick}
      disabled={isDisabled || isLoading}
      className={`freon-button ${className}`}
      style={baseStyle}
      {...props}
    >
      {/* Content */}
      {isLoading ? (
        <>
          <LoadingSpinner />
          Loading...
        </>
      ) : (
        <>
          {leftIcon && <span className="left-icon">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="right-icon">{rightIcon}</span>}
        </>
      )}
      
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}

// Specialized button variants
export function PrimaryButton(props) {
  return <Button variant="primary" {...props} />;
}

export function SecondaryButton(props) {
  return <Button variant="secondary" {...props} />;
}

export function OutlineButton(props) {
  return <Button variant="outline" {...props} />;
}

export function GhostButton(props) {
  return <Button variant="ghost" {...props} />;
}

export function DangerButton(props) {
  return <Button variant="danger" {...props} />;
}
