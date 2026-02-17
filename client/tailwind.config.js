/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#020617',
        },
        brand: {
          green: '#22c55e',
          red: '#ef4444',
          navy: '#0f172a',
        },
        // Theme-aware colors using CSS custom properties
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        'text-secondary': 'var(--color-textSecondary)',
        border: 'var(--color-border)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
        success: 'var(--color-success)',
        info: 'var(--color-info)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Theme-aware shadows using CSS custom properties
      boxShadow: {
        'theme-sm': 'var(--shadow-sm)',
        'theme-md': 'var(--shadow-md)',
        'theme-lg': 'var(--shadow-lg)',
      },
      // Accessibility utilities
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    // Accessibility plugin
    function({ addUtilities }) {
      const newUtilities = {
        '.sr-only': {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: '0',
        },
        '.focus:not-sr-only': {
          position: 'static',
          width: 'auto',
          height: 'auto',
          padding: 'inherit',
          margin: 'inherit',
          overflow: 'visible',
          clip: 'auto',
          whiteSpace: 'inherit',
        },
        // High contrast mode
        '.high-contrast': {
          filter: 'contrast(1.5)',
        },
        '.high-contrast *': {
          borderColor: '#000000 !important',
          borderWidth: '2px !important',
        },
        // Large text mode
        '.large-text': {
          fontSize: '120%',
          lineHeight: '1.6',
        },
        '.large-text input, .large-text button, .large-text textarea': {
          fontSize: '120%',
          padding: '0.75rem',
        },
        // Reduced motion
        '.reduced-motion *': {
          animationDuration: '0.01ms !important',
          animationIterationCount: '1 !important',
          transitionDuration: '0.01ms !important',
        },
        // Screen reader optimized
        '.screen-reader-optimized': {
          lineHeight: '1.8',
          letterSpacing: '0.12em',
        },
        '.screen-reader-optimized a:focus': {
          outline: '3px solid #000',
          outlineOffset: '2px',
        },
        // Theme transitions
        '.theme-transition': {
          transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease',
        },
      };
      addUtilities(newUtilities);
    },
  ],
}