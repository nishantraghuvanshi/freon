import { Toaster } from 'react-hot-toast';
import { theme } from '../../styles/theme.js';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options for all toasts
        duration: 4000,
        style: {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          color: theme.colors.neutral[800],
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: theme.borderRadius.xl,
          boxShadow: theme.shadows.lg,
          fontSize: theme.typography.fontSize.sm,
          fontFamily: theme.typography.fontFamily.primary,
          fontWeight: theme.typography.fontWeight.medium,
          padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
          maxWidth: '350px'
        },
        
        // Success toasts
        success: {
          duration: 3000,
          iconTheme: {
            primary: theme.colors.success.main,
            secondary: theme.colors.neutral[0]
          },
          style: {
            background: `linear-gradient(135deg, ${theme.colors.success.main}15 0%, ${theme.colors.success.light}15 100%)`,
            border: `1px solid ${theme.colors.success.main}30`,
            color: theme.colors.success.dark
          }
        },
        
        // Error toasts
        error: {
          duration: 5000,
          iconTheme: {
            primary: theme.colors.error.main,
            secondary: theme.colors.neutral[0]
          },
          style: {
            background: `linear-gradient(135deg, ${theme.colors.error.main}15 0%, ${theme.colors.error.light}15 100%)`,
            border: `1px solid ${theme.colors.error.main}30`,
            color: theme.colors.error.dark
          }
        },
        
        // Loading toasts
        loading: {
          iconTheme: {
            primary: theme.colors.primary.main,
            secondary: theme.colors.neutral[0]
          },
          style: {
            background: `linear-gradient(135deg, ${theme.colors.primary[500]}15 0%, ${theme.colors.primary[300]}15 100%)`,
            border: `1px solid ${theme.colors.primary[500]}30`,
            color: theme.colors.primary[700]
          }
        }
      }}
    />
  );
}
