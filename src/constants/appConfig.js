// Application Configuration
export const APP_CONFIG = {
  // Dashboard Settings
  HOME_PAGE_WIDGET_COUNT: 6, // Number of widgets to display on dashboard

  // ============================================================================
  // DARK THEME WITH SCHNEIDER WHITE HEADER/FOOTER (CURRENT ACTIVE THEME)
  // ============================================================================
  // Dark theme for main content + White header/footer for Schneider branding
  // ============================================================================

  THEME: {
    // Primary Schneider Green
    PRIMARY_GREEN: '#3DCD58',
    SCHNEIDER_GREEN: '#3DCD58',
    DARK_GREEN: '#009742',

    // Dark Background Colors (adapted from SVG mockup)
    BG_DARK_PRIMARY: '#0a1a0f',      // Darkest green-tinted background
    BG_DARK_SECONDARY: '#0f1f29',    // Medium dark with blue-green tint
    BG_DARK_TERTIARY: '#1a2e1a',     // Lighter dark green
    BG_DARK_CARD: 'rgba(15, 31, 41, 0.6)',  // Glassmorphic card background

    // Gradient Backgrounds
    BG_GRADIENT_MAIN: 'linear-gradient(135deg, #0a1a0f 0%, #0f1f29 50%, #1a2e1a 100%)',
    BG_GRADIENT_CARD: 'linear-gradient(135deg, rgba(61, 205, 88, 0.05) 0%, rgba(0, 151, 66, 0.02) 100%)',

    // Text Colors for Dark Theme
    TEXT_PRIMARY: '#FFFFFF',
    TEXT_SECONDARY: 'rgba(255, 255, 255, 0.7)',
    TEXT_TERTIARY: 'rgba(255, 255, 255, 0.5)',

    // Legacy Light Theme (for compatibility)
    WHITE: '#FFFFFF',
    LIGHT_GRAY: '#F5F5F5',
    MEDIUM_GRAY: '#E0E0E0',
    DARK_GRAY: '#424242',

    // Glassmorphism
    GLASS_BG: 'rgba(15, 31, 41, 0.4)',
    GLASS_BORDER: 'rgba(61, 205, 88, 0.2)',
    GLASS_BLUR: 'blur(10px)',

    // Accent Colors
    ACCENT_GREEN_GLOW: 'rgba(61, 205, 88, 0.3)',
    ACCENT_BLUE: '#3b82f6',
    ACCENT_PURPLE: '#8b5cf6',

    // Status Colors
    STATUS_GOOD: '#4CAF50',
    STATUS_WARNING: '#FF9800',
    STATUS_CRITICAL: '#F44336',
    STATUS_DEAD: '#9E9E9E',
    STATUS_AI_INSIGHT: '#3DCD58',  // Changed from blue to Schneider green

    // Network Visualization Highlight Colors
    HIGHLIGHT_COLOR: '#06b6d4',  // Bright cyan for path highlighting
    HIGHLIGHT_GLOW: 'rgba(6, 182, 212, 0.6)',  // Cyan glow effect
    DIMMED_OPACITY: 0.15,  // Opacity for non-highlighted elements
  },

  // Animation Settings
  ANIMATION: {
    BLINK_CRITICAL: true,
    HOVER_ZOOM: true,
    TRANSITION_DURATION: 300,
    PARTICLE_COUNT: 50,  // Number of background particles
  },

  // 3-Column SVG Layout (from dashboard.svg)
  LAYOUT: {
    LEFT_PANEL_WIDTH: '26%',    // Lab Hierarchy
    CENTER_PANEL_WIDTH: '40%',  // Device Network
    RIGHT_PANEL_WIDTH: '28%',   // AI Insights
    TOP_STATS_HEIGHT: '120px',
    PANEL_GAP: '16px',
  },

  // Grid Layout (legacy)
  GRID: {
    COLUMNS: 3, // Number of columns in widget grid
    SPACING: 3, // Grid spacing
  },
};

export default APP_CONFIG;

// ============================================================================
// DARK THEME BACKUP (ORIGINAL CONFIGURATION)
// ============================================================================
// To revert to dark theme, replace the THEME object above with this configuration:
// ============================================================================
/*
  THEME: {
    // Primary Schneider Green
    PRIMARY_GREEN: '#3DCD58',
    SCHNEIDER_GREEN: '#3DCD58',
    DARK_GREEN: '#009742',

    // Dark Background Colors (adapted from SVG mockup)
    BG_DARK_PRIMARY: '#0a1a0f',      // Darkest green-tinted background
    BG_DARK_SECONDARY: '#0f1f29',    // Medium dark with blue-green tint
    BG_DARK_TERTIARY: '#1a2e1a',     // Lighter dark green
    BG_DARK_CARD: 'rgba(15, 31, 41, 0.6)',  // Glassmorphic card background

    // Gradient Backgrounds
    BG_GRADIENT_MAIN: 'linear-gradient(135deg, #0a1a0f 0%, #0f1f29 50%, #1a2e1a 100%)',
    BG_GRADIENT_CARD: 'linear-gradient(135deg, rgba(61, 205, 88, 0.05) 0%, rgba(0, 151, 66, 0.02) 100%)',

    // Text Colors for Dark Theme
    TEXT_PRIMARY: '#FFFFFF',
    TEXT_SECONDARY: 'rgba(255, 255, 255, 0.7)',
    TEXT_TERTIARY: 'rgba(255, 255, 255, 0.5)',

    // Legacy Light Theme (for compatibility)
    WHITE: '#FFFFFF',
    LIGHT_GRAY: '#F5F5F5',
    MEDIUM_GRAY: '#E0E0E0',
    DARK_GRAY: '#424242',

    // Glassmorphism
    GLASS_BG: 'rgba(15, 31, 41, 0.4)',
    GLASS_BORDER: 'rgba(61, 205, 88, 0.2)',
    GLASS_BLUR: 'blur(10px)',

    // Accent Colors
    ACCENT_GREEN_GLOW: 'rgba(61, 205, 88, 0.3)',
    ACCENT_BLUE: '#3b82f6',
    ACCENT_PURPLE: '#8b5cf6',

    // Status Colors
    STATUS_GOOD: '#4CAF50',
    STATUS_WARNING: '#FF9800',
    STATUS_CRITICAL: '#F44336',
    STATUS_DEAD: '#9E9E9E',
    STATUS_AI_INSIGHT: '#3DCD58',  // Changed from blue to Schneider green
  },
*/
// ============================================================================
