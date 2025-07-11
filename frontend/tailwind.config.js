module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          900: '#0B0D17',
          800: '#1A1D29',
          700: '#2A2D3A',
          600: '#3A3D4A',
          500: '#4A4D5A',
          400: '#5A5D6A',
          300: '#6A6D7A',
          200: '#7A7D8A',
          100: '#8A8D9A',
        },
        cosmic: {
          blue: '#1E40AF',
          purple: '#7C3AED',
          pink: '#EC4899',
          orange: '#F59E0B',
        }
      },
      fontFamily: {
        'space': ['Orbitron', 'monospace'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
} 