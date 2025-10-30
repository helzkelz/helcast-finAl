/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#121212',
        'coral': '#FF6F61',
        'coral-bright': '#FF8A75',
        'teal': '#00A9A5',
        'light-gray': '#333333',
        'medium-gray': '#222222',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      keyframes: {
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
        }
      },
      animation: {
        sparkle: 'sparkle 1.5s ease-in-out infinite',
        popup: 'popup 2s ease-out forwards',
        glow: 'glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}