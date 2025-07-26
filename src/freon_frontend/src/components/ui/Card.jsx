import { theme } from '../../styles/theme.js';

export default function Card({
  children,
  variant = 'default',
  padding = 'medium',
  hover = true,
  className = '',
  onClick,
  ...props
}) {
  const cardVariants = {
    default: {
      background: 'rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
    },
    elevated: {
      background: 'rgba(255, 255, 255, 0.9)',
      boxShadow: theme.shadows.xl,
      border: 'none'
    },
    outlined: {
      background: 'rgba(255, 255, 255, 0.8)',
      border: `1px solid ${theme.colors.neutral[200]}`,
      boxShadow: theme.shadows.sm
    },
    filled: {
      background: theme.colors.neutral[0],
      boxShadow: theme.shadows.lg,
      border: 'none'
    }
  };

  const paddingStyles = {
    none: '0',
    small: theme.spacing[4],
    medium: theme.spacing[6],
    large: theme.spacing[8]
  };

  const baseStyle = {
    borderRadius: theme.borderRadius['2xl'],
    padding: paddingStyles[padding],
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    cursor: onClick ? 'pointer' : 'default',
    position: 'relative',
    overflow: 'hidden',
    ...cardVariants[variant]
  };

  return (
    <div
      className={`freon-card ${className}`}
      style={baseStyle}
      onClick={onClick}
      {...props}
    >
      {/* Subtle gradient overlay for depth */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
          pointerEvents: 'none'
        }}
      />
      
      {children}
    </div>
  );
}

// Specialized card variants
export function GlassCard(props) {
  return <Card variant="default" {...props} />;
}

export function ElevatedCard(props) {
  return <Card variant="elevated" {...props} />;
}

export function OutlinedCard(props) {
  return <Card variant="outlined" {...props} />;
}

export function FilledCard(props) {
  return <Card variant="filled" {...props} />;
}
