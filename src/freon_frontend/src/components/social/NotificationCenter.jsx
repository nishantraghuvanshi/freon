import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiHeart, FiMessageCircle, FiUserPlus, FiX } from 'react-icons/fi';
import { freon_backend } from 'declarations/freon_backend';
import { Principal } from '@dfinity/principal';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import { theme } from '../../styles/theme';

export default function NotificationCenter() {
  const { principal } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (principal) {
      fetchNotifications();
      fetchUnreadCount();
      
      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCount();
        if (showNotifications) {
          fetchNotifications();
        }
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [principal, showNotifications]);

  async function fetchNotifications() {
    if (!principal) return;
    
    setLoading(true);
    try {
      const principalObj = Principal.fromText(principal.toText());
      const notificationsData = await freon_backend.get_notifications(principalObj);
      
      // Enhance notifications with user profiles
      const enhancedNotifications = await Promise.all(
        notificationsData.map(async (notification) => {
          try {
            const profileResult = await freon_backend.get_user(notification.notifier);
            return {
              ...notification,
              notifierProfile: profileResult[0] || null
            };
          } catch (error) {
            return {
              ...notification,
              notifierProfile: null
            };
          }
        })
      );

      setNotifications(enhancedNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
    setLoading(false);
  }

  async function fetchUnreadCount() {
    if (!principal) return;

    try {
      const principalObj = Principal.fromText(principal.toText());
      const count = await freon_backend.get_unread_notifications_count(principalObj);
      setUnreadCount(Number(count));
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }

  async function markAsRead(notificationId) {
    if (!principal) return;

    try {
      const principalObj = Principal.fromText(principal.toText());
      await freon_backend.mark_notification_read(principalObj, notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  function getNotificationIcon(type) {
    switch (type) {
      case 'Like':
        return <FiHeart size={16} style={{ color: theme.colors.error.main }} />;
      case 'Comment':
      case 'Reply':
        return <FiMessageCircle size={16} style={{ color: theme.colors.secondary[500] }} />;
      case 'Follow':
        return <FiUserPlus size={16} style={{ color: theme.colors.primary[600] }} />;
      default:
        return <FiBell size={16} />;
    }
  }

  function getNotificationText(notification) {
    const username = notification.notifierProfile?.username || 'Someone';
    
    switch (notification.notification_type) {
      case 'Like':
        return `${username} liked your post`;
      case 'Comment':
        return `${username} commented on your post`;
      case 'Reply':
        return `${username} replied to your comment`;
      case 'Follow':
        return `${username} started following you`;
      default:
        return `${username} interacted with your content`;
    }
  }

  function formatTimestamp(timestamp) {
    const date = new Date(Number(timestamp) / 1000000);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  const bellButtonStyle = {
    position: 'relative',
    padding: '0.5rem',
    backgroundColor: 'transparent',
    border: `1px solid ${theme.colors.neutral[300]}`,
    borderRadius: theme.borderRadius.full,
    cursor: 'pointer',
    color: theme.colors.neutral[600],
    transition: 'all 0.2s ease'
  };

  const badgeStyle = {
    position: 'absolute',
    top: '-2px',
    right: '-2px',
    backgroundColor: theme.colors.error.main,
    color: 'white',
    borderRadius: theme.borderRadius.full,
    fontSize: '0.75rem',
    fontWeight: theme.typography.fontWeight.bold,
    minWidth: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid white'
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Bell Button */}
      <motion.button
        onClick={() => setShowNotifications(!showNotifications)}
        style={bellButtonStyle}
        whileHover={{ scale: 1.05, backgroundColor: theme.colors.neutral[50] }}
        whileTap={{ scale: 0.95 }}
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <motion.div
            style={badgeStyle}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.div>
        )}
      </motion.button>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 998
              }}
              onClick={() => setShowNotifications(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.5rem',
                width: '380px',
                maxWidth: '90vw',
                maxHeight: '500px',
                backgroundColor: 'white',
                borderRadius: theme.borderRadius.lg,
                boxShadow: theme.shadows.xl,
                border: `1px solid ${theme.colors.neutral[200]}`,
                zIndex: 999,
                overflow: 'hidden'
              }}
            >
              {/* Header */}
              <div style={{
                padding: '1rem',
                borderBottom: `1px solid ${theme.colors.neutral[200]}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.1rem',
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.neutral[800]
                }}>
                  Notifications
                </h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: theme.colors.neutral[500],
                    cursor: 'pointer',
                    padding: '0.25rem'
                  }}
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Notifications List */}
              <div style={{
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                {loading ? (
                  <div style={{
                    padding: '2rem',
                    textAlign: 'center',
                    color: theme.colors.neutral[500]
                  }}>
                    Loading notifications...
                  </div>
                ) : notifications.length === 0 ? (
                  <div style={{
                    padding: '2rem',
                    textAlign: 'center',
                    color: theme.colors.neutral[500]
                  }}>
                    <FiBell size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                    <p>No notifications yet</p>
                    <p style={{ fontSize: '0.875rem' }}>
                      You'll see notifications here when people interact with your posts
                    </p>
                  </div>
                ) : (
                  notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        if (!notification.read) {
                          markAsRead(notification.id);
                        }
                      }}
                      style={{
                        padding: '1rem',
                        borderBottom: `1px solid ${theme.colors.neutral[100]}`,
                        cursor: 'pointer',
                        backgroundColor: notification.read ? 'transparent' : theme.colors.neutral[50],
                        transition: 'background-color 0.2s ease',
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'flex-start'
                      }}
                      whileHover={{ backgroundColor: theme.colors.neutral[25] }}
                    >
                      {/* Avatar */}
                      <Avatar
                        src={notification.notifierProfile?.image_url}
                        alt={`${notification.notifierProfile?.username || 'User'}'s avatar`}
                        size={40}
                        username={notification.notifierProfile?.username || 'User'}
                        showPlaceholder={true}
                      />

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.25rem'
                        }}>
                          {getNotificationIcon(notification.notification_type)}
                          {!notification.read && (
                            <div style={{
                              width: '6px',
                              height: '6px',
                              backgroundColor: theme.colors.secondary[500],
                              borderRadius: '50%'
                            }} />
                          )}
                        </div>
                        
                        <p style={{
                          margin: 0,
                          fontSize: '0.875rem',
                          color: theme.colors.neutral[800],
                          lineHeight: '1.4'
                        }}>
                          {getNotificationText(notification)}
                        </p>
                        
                        <p style={{
                          margin: '0.25rem 0 0 0',
                          fontSize: '0.75rem',
                          color: theme.colors.neutral[500]
                        }}>
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
