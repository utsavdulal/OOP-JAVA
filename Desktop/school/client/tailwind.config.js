/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef4f1',
          100: '#d5e4dc',
          200: '#a8c5b6',
          300: '#7ba58f',
          400: '#4e8669',
          500: '#3f6f5a', // Deep academic green
          600: '#325948',
          700: '#264336',
          800: '#192c24',
          900: '#0c1612',
        },
        secondary: {
          500: '#5F8F7A', // Muted green
          600: '#4d7564',
        },
        accent: {
          500: '#E0A800', // Gold/Yellow highlight
          600: '#c29100',
        },
        surface: {
          bg: '#F5F7F3', // Light soft white background
          card: '#FFFFFF', // Pure white
        },
        text: {
          primary: '#2E2E2E',
          secondary: '#6B6B6B',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'Open Sans', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Montserrat', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'count-up': 'countUp 2s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
