// Global Color Palette
export const colors = {
  // Primary Colors
  primary: '#1f2937',
  primaryLight: '#374151',
  primaryDark: '#111827',
  
  // Background Colors
  background: '#f9fafb',
  backgroundLight: '#ffffff',
  backgroundDark: '#f3f4f6',
  
  // Text Colors
  text: '#111827',
  textSecondary: '#6b7280',
  textLight: '#9ca3af',
  textMuted: '#d1d5db',
  
  // Action Colors
  indigo: '#6366f1',
  indigoLight: '#eef2ff',
  purple: '#8b5cf6',
  purpleLight: '#f5f3ff',
  pink: '#ec4899',
  pinkLight: '#fdf2f8',
  amber: '#f59e0b',
  amberLight: '#fffbeb',
  green: '#10b981',
  greenLight: '#f0fdf4',
  cyan: '#06b6d4',
  cyanLight: '#ecfeff',
  
  // Status Colors
  success: '#10b981',
  successBg: '#f0fdf4',
  warning: '#f59e0b',
  warningBg: '#fffbeb',
  warningText: '#92400e',
  error: '#ef4444',
  errorBg: '#fef2f2',
  info: '#3b82f6',
  infoBg: '#eff6ff',
  
  // Border Colors
  border: '#f3f4f6',
  borderLight: '#e5e7eb',
  borderDark: '#d1d5db',
  
  // Alert Colors
  alertWarning: '#fef3c7',
  
  // Notification Colors
  notificationBg: '#f3f4f6',
  
  // White & Black
  white: '#ffffff',
  black: '#000000',
};

// Color aliases for semantic usage
export const theme = {
  colors: {
    // Main theme colors
    background: colors.background,
    surface: colors.backgroundLight,
    text: colors.text,
    textSecondary: colors.textSecondary,
    
    // Interactive elements
    primary: colors.primary,
    accent: colors.indigo,
    
    // Status
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    
    // Borders
    border: colors.border,
    divider: colors.borderLight,
  },
};
