/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stadium: {
          dark: '#0B0F19',
          card: '#161F30',
          accent: '#00F0FF', // Neon cyan
          pitch: '#00FF87',  // FIFA Pitch green
          purple: '#6C5DD3', // Tournament purple
          warning: '#FFB800',
          danger: '#FF4A55',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 240, 255, 0.15)',
        glowGreen: '0 0 20px rgba(0, 255, 135, 0.2)',
      }
    },
  },
  plugins: [],
}
