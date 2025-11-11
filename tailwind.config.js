/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0a0a0a',
        'darker-bg': '#050505',
        'card-bg': '#1a1a1a',
        'card-border': '#2a2a2a',
        'coral': '#ff6b6b',
        'coral-bright': '#ff8e8e',
        'coral-glow': '#ff4757',
        'teal': '#00d4aa',
        'teal-bright': '#00f5d4',
        'purple': '#6c5ce7',
        'purple-bright': '#a29bfe',
        'accent': '#ff6b6b',
        'accent-bright': '#ff8e8e',
        'text-primary': '#ffffff',
        'text-secondary': '#b8b8b8',
        'text-muted': '#666666',
        'success': '#00d4aa',
        'warning': '#ffa726',
        'error': '#ff4757',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Clash Display', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glass-sm': '0 4px 16px rgba(0, 0, 0, 0.2)',
        'glow': '0 0 20px rgba(255, 107, 107, 0.3)',
        'glow-teal': '0 0 20px rgba(0, 212, 170, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(255, 107, 107, 0.1)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255, 107, 107, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 107, 107, 0.8)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        sparkle: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.5, transform: 'scale(1.2)' },
        },
        popup: {
          '0%': { transform: 'translateY(0) scale(0.8)', opacity: 0 },
          '20%': { transform: 'translateY(-20px) scale(1.1)', opacity: 1 },
          '80%': { transform: 'translateY(-80px) scale(1)', opacity: 1 },
          '100%': { transform: 'translateY(-100px) scale(0.8)', opacity: 0 },
        },
        glow: {
          '0%, 100%': { 'box-shadow': '0 0 5px rgba(255,111,97,0.5)' },
          '50%': { 'box-shadow': '0 0 15px rgba(255,111,97,0.9)' },
        },
        gradientShift: {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '100%': {
            backgroundPosition: '100% 50%',
          },
        },
        float: {
          '0%': {
            transform: 'translatey(0px)',
          },
          '50%': {
            transform: 'translatey(-10px)',
          },
          '100%': {
            transform: 'translatey(0px)',
          },
        },
        'pulse-ring': {
          '0%': {
            transform: 'scale(1)',
            opacity: '1',
          },
          '50%': {
            transform: 'scale(1.1)',
            opacity: '0.7',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        spin: {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'bounce-gentle': 'bounce-gentle 2s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        sparkle: 'sparkle 1.5s ease-in-out infinite',
        popup: 'popup 2s ease-out forwards',
        glow: 'glow 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s infinite',
        'spin': 'spin 1s linear infinite',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}