/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'in': 'in 0.2s ease-out',
        'slide-in-from-bottom-3': 'slide-in-from-bottom-3 0.3s ease-out',
      },
      keyframes: {
        'in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-from-bottom-3': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-lg': '0 0 40px rgba(139, 92, 246, 0.4)',
      }
    ,
      colors: {
        brand: {
          primary: '#2F6F4E',
          accent: '#6BCB77',
          background: '#F4FFF8',
          card: '#FFFFFF',
          text: '#2D2D2D',
          border: '#E0E0E0',
        },
        botanical: {
          50: '#f6fbf6',
          100: '#ecf7ec',
          200: '#d7efe0',
          300: '#bfe6c6',
          400: '#8fd29a',
          500: '#4fb56a',
          600: '#2f8b44',
          700: '#206433',
          800: '#144423',
          900: '#0b2a14'
        },
        botanicalAmber: {
          50: '#fffaf2',
          100: '#fff3df',
          200: '#ffe6b8',
          300: '#ffd480',
          400: '#ffc24a',
          500: '#ffb019',
          600: '#e08f12',
          700: '#a5620d',
          800: '#6a3f08',
          900: '#412604'
        }
      }
    },
  },
  plugins: [],
};