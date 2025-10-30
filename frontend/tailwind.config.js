/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // class-based dark mode for predictable toggling
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      colors: {
        neutral: {
          50: '#fbfbfc',
          100: '#f5f6f7',
          200: '#eceef2',
          300: '#dfe3ea',
          400: '#c7ceda',
          500: '#9aa4b6',
          600: '#6f7a8b',
          700: '#48505a',
          800: '#2d3338',
          900: '#111417',
        },
        primary: {
          50: '#f5f7ff',
          100: '#e6edff',
          300: '#9fb3ff',
          500: '#5a7fff', // base blue
          700: '#3b59d6',
        },
        glass: 'rgba(255,255,255,0.06)',
      },
      borderRadius: {
        lg: '16px',
        xl: '20px',
        'pill': '9999px',
      },
      boxShadow: {
        'soft-1': '0 6px 20px rgba(14,18,26,0.06)',
        'soft-2': '0 10px 30px rgba(14,18,26,0.08)',
        'glass': '0 8px 30px rgba(15,23,42,0.25)',
      },
      transitionProperty: {
        'common': 'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
      },
      backdropBlur: {
        xs: '4px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.glass-bg': {
          'background-color': 'rgba(255,255,255,0.06)',
          'backdrop-filter': 'blur(6px)',
          '-webkit-backdrop-filter': 'blur(6px)',
          'border': '1px solid rgba(255,255,255,0.08)',
        },
        '.bg-accent-bluePurple': {
          'background-image': 'linear-gradient(90deg,#7cc8ff 0%,#b093ff 100%)'
        },
        '.bg-accent-tealCyan': {
          'background-image': 'linear-gradient(90deg,#4fd1c5 0%,#22c1c3 100%)'
        },
        '.bg-accent-pinkOrange': {
          'background-image': 'linear-gradient(90deg,#ff8ab3 0%,#ffa66d 100%)'
        },
      }, ['responsive', 'hover']);
    }
  ]
}