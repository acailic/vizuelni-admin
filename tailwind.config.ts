import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ===========================================
      // SERBIAN GOVERNMENT COLOR SYSTEM
      // National colors used with restraint
      // ===========================================
      colors: {
        // Government brand colors (reference CSS custom properties)
        gov: {
          primary: 'rgb(var(--color-gov-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-gov-secondary) / <alpha-value>)',
          accent: 'rgb(var(--color-gov-accent) / <alpha-value>)',
        },
        // Serbian national colors
        serbia: {
          red: 'rgb(var(--color-serbia-red) / <alpha-value>)',
          blue: 'rgb(var(--color-serbia-blue) / <alpha-value>)',
          white: 'rgb(var(--color-serbia-white) / <alpha-value>)',
        },
        // Neutral scale for UI (Swiss-inspired)
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },

      // ===========================================
      // TYPOGRAPHY SYSTEM
      // IBM Plex Sans: Swiss-inspired, excellent Cyrillic
      // Noto Serif: Authoritative headings
      // JetBrains Mono: Data precision
      // ===========================================
      fontFamily: {
        sans: [
          '"IBM Plex Sans"',
          '"Noto Sans"',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        serif: ['"Noto Serif"', '"Source Serif 4"', 'Georgia', 'serif'],
        display: ['"Noto Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'monospace'],
        // Fallback for Cyrillic-heavy content
        cyrillic: ['"IBM Plex Sans"', '"Noto Sans"', 'sans-serif'],
      },

      // Font sizes
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        display: ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.05' }],
        headline: ['clamp(1.875rem, 3.5vw, 3rem)', { lineHeight: '1.15' }],
      },

      // Spacing
      spacing: {
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
        '192': '48rem',
        '224': '56rem',
        '256': '64rem',
        '288': '72rem',
      },

      // Animation
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-left': 'slideLeft 0.5s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': {
            transform: 'scale(0.3)',
            opacity: '0',
          },
          '50%': {
            transform: 'scale(1.05)',
          },
          '70%': {
            transform: 'scale(0.9)',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
      },

      // Shadows
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        elevated: '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
      },

      // Border radius
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      // Grid
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
      },

      // Z-index
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },

      // Aspect ratios
      aspectRatio: {
        '4/3': '4 / 3',
        '21/9': '21 / 9',
      },

      // Container
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
};

export default config;
