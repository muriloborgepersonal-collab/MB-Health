/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f0f1a', // Dark background
        surface: '#1a1a2e', // Card background
        primary: '#00d4ff', // Electric Blue
        'primary-dark': '#00a3cc',
        secondary: '#1e90ff', // Royal Blue
        text: {
          primary: '#ffffff',
          secondary: '#e0e0e0',
          muted: '#9ca3af',
        },
        status: {
          active: '#10b981', // Green
          inactive: '#f59e0b', // Orange
          deleted: '#ef4444', // Red
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
