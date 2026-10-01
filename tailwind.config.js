/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warmth: {
          50: '#FDFBF7',
          100: '#FAF6EE',
          200: '#F3ECD8',
          300: '#E7DCBA',
          400: '#D5C493',
          500: '#BD9E57',
        },
        terracotta: {
          50: '#FFF5F2',
          100: '#FFE6DF',
          200: '#FFD0C2',
          500: '#D9532F',
          600: '#C03D1A',
          700: '#9C2E11',
        },
        marigold: {
          50: '#FFFDF0',
          100: '#FFF9D2',
          200: '#FFF0A3',
          400: '#F5B700',
          500: '#E09F00',
          600: '#B87A00',
        },
        forest: {
          50: '#F2F8F4',
          100: '#DEF0E3',
          500: '#2E7D32',
          600: '#236526',
          700: '#194B1B',
        },
        rosebud: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          500: '#E11D48',
          600: '#BE123C',
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Noto Sans"', 'sans-serif'],
      },
      fontSize: {
        'accessible-sm': ['1.125rem', { lineHeight: '1.6' }],
        'accessible-base': ['1.25rem', { lineHeight: '1.65' }],
        'accessible-lg': ['1.5rem', { lineHeight: '1.6' }],
        'accessible-xl': ['1.875rem', { lineHeight: '1.4' }],
        'accessible-2xl': ['2.25rem', { lineHeight: '1.3' }],
      },
      boxShadow: {
        'soft-lift': '0 8px 24px -4px rgba(60, 40, 20, 0.08), 0 2px 6px -1px rgba(60, 40, 20, 0.04)',
        'mic-glow': '0 0 0 8px rgba(217, 83, 47, 0.2), 0 12px 32px rgba(217, 83, 47, 0.35)',
        'mic-active': '0 0 0 16px rgba(217, 83, 47, 0.3), 0 0 0 32px rgba(217, 83, 47, 0.15)',
      },
      animation: {
        'pulse-gentle': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'mic-ripple': 'ripple 1.8s ease-out infinite',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
