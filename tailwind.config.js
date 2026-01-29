/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000', // Deep Pitch Black
        surface: '#0a0a0a', // very dark card
        primary: '#00d4ff', // Electric Blue
        'primary-dark': '#0088aa',
        secondary: '#0055ff', // Kinetic Blue
        text: {
          primary: '#ffffff',
          secondary: '#a0a0a0',
          muted: '#555555',
        },
        status: {
          active: '#00ffaa', // Cyber Green
          inactive: '#ffaa00', // Cyber Orange
          deleted: '#ff0055', // Cyber Red
        }
      },
      borderRadius: {
        '3xl': '32px',
        '4xl': '48px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 20px -5px rgba(0, 212, 255, 0.5)',
        'neon-strong': '0 0 30px -2px rgba(0, 212, 255, 0.6)',
        'glow': '0 0 15px -3px rgba(0, 212, 255, 0.3)',
      },
      keyframes: {
        'kinetic-reveal': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      animation: {
        'kinetic-reveal': 'kinetic-reveal 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
      }
    },
  },
  plugins: [],
}
