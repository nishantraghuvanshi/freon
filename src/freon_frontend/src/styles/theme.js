// Modern Design System for Freon - Tech Minimal
export const theme = {
  // Color Palette - Tech Minimal & Professional
  colors: {
    // Primary Brand Colors - Pure blacks and cool grays
    primary: {
      50: '#f8f9fa',
      100: '#f1f3f4',
      200: '#e8eaed',
      300: '#dadce0',
      400: '#bdc1c6',
      500: '#9aa0a6', // Main brand color - Medium gray
      600: '#80868b',
      700: '#5f6368',
      800: '#3c4043',
      900: '#202124'  // Pure black
    },
    
    // Secondary Colors - Electric accent
    secondary: {
      50: '#fff3e0',
      100: '#ffe0b2',
      200: '#ffcc80',
      300: '#ffb74d',
      400: '#ffa726',
      500: '#ff9800', // Vibrant orange accent
      600: '#fb8c00',
      700: '#f57c00',
      800: '#ef6c00',
      900: '#e65100'
    },
    
    // Neutral Grays - Clean and minimal
    neutral: {
      0: '#ffffff',    // Pure white
      50: '#fafafa',   // Off-white
      100: '#f5f5f5',  // Light gray
      200: '#eeeeee',  // Lighter gray
      300: '#e0e0e0',  // Light medium gray
      400: '#bdbdbd',  // Medium gray
      500: '#9e9e9e',  // Standard gray
      600: '#757575',  // Dark gray
      700: '#616161',  // Darker gray
      800: '#424242',  // Very dark gray
      900: '#212121'   // Near black
    },
    
    // Semantic Colors - Clean and professional
    success: {
      light: '#66bb6a',
      main: '#4caf50',  // Clean green
      dark: '#388e3c'
    },
    warning: {
      light: '#ffb74d',
      main: '#ff9800',  // Orange accent
      dark: '#f57c00'
    },
    error: {
      light: '#ef5350',
      main: '#f44336',  // Clean red
      dark: '#d32f2f'
    },
    info: {
      light: '#42a5f5',
      main: '#2196f3',  // Clean blue
      dark: '#1976d2'
    }
  },
  
  // Typography
  typography: {
    fontFamily: {
      primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      heading: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"JetBrains Mono", "Fira Code", monospace'
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    },
    lineHeight: {
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2
    }
  },
  
  // Spacing Scale
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  },
  
  // Shadows
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
  },
  
  // Breakpoints for Responsive Design
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  
  // Z-Index Scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800
  },
  
  // Animation & Transitions
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }
  }
};

// Dark Theme - Tech Minimal Dark Mode
export const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    neutral: {
      0: '#000000',    // Pure black
      50: '#121212',   // Very dark gray
      100: '#1e1e1e',  // Dark gray
      200: '#2d2d2d',  // Medium dark gray
      300: '#404040',  // Medium gray
      400: '#5a5a5a',  // Light medium gray
      500: '#757575',  // Standard gray
      600: '#9e9e9e',  // Light gray
      700: '#bdbdbd',  // Lighter gray
      800: '#e0e0e0',  // Very light gray
      900: '#ffffff'   // Pure white
    },
    primary: {
      ...theme.colors.primary,
      500: '#e0e0e0',  // Light gray for dark mode primary
      700: '#ffffff',  // White for dark mode text
      900: '#ffffff'   // White for dark mode emphasis
    }
  }
};

// Utility function to get responsive values
export const responsive = (values) => {
  const breakpoints = Object.keys(theme.breakpoints);
  return breakpoints.reduce((acc, breakpoint, index) => {
    if (values[index] !== undefined) {
      acc[`@media (min-width: ${theme.breakpoints[breakpoint]})`] = values[index];
    }
    return acc;
  }, {});
};
