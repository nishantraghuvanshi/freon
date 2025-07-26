import { useState, useEffect } from 'react';
import { FiZap, FiX } from 'react-icons/fi';
import { theme } from '../../styles/theme';

export default function CyclesNotification({ 
  message, 
  amount, 
  type = 'earned', 
  isVisible, 
  onClose,
  duration = 4000 
}) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const notificationStyle = {
    position: 'fixed',
    top: '1rem',
    right: '1rem',
    backgroundColor: type === 'earned' ? theme.colors.success[50] : theme.colors.secondary[50],
    border: `1px solid ${type === 'earned' ? theme.colors.success[200] : theme.colors.secondary[200]}`,
    borderRadius: theme.borderRadius.lg,
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    zIndex: 1000,
    minWidth: '280px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
    opacity: isVisible ? 1 : 0,
    transition: 'all 0.3s ease-in-out'
  };

  const iconStyle = {
    color: type === 'earned' ? theme.colors.success.main : theme.colors.secondary.main,
    flexShrink: 0
  };

  const contentStyle = {
    flex: 1
  };

  const messageStyle = {
    fontSize: '0.875rem',
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.neutral[900],
    marginBottom: '0.25rem'
  };

  const amountStyle = {
    fontSize: '0.75rem',
    color: type === 'earned' ? theme.colors.success[700] : theme.colors.secondary[700],
    fontWeight: theme.typography.fontWeight.bold
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem',
    color: theme.colors.neutral[400],
    borderRadius: theme.borderRadius.sm
  };

  if (!isVisible) return null;

  return (
    <div style={notificationStyle}>
      <FiZap size={20} style={iconStyle} />
      <div style={contentStyle}>
        <div style={messageStyle}>{message}</div>
        <div style={amountStyle}>
          {type === 'earned' ? '+' : '-'}{amount} cycles
        </div>
      </div>
      <button style={closeButtonStyle} onClick={onClose}>
        <FiX size={16} />
      </button>
    </div>
  );
}
