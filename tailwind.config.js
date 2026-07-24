/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aurum: {
          bg: '#090B0E',         // Ultra-deep charcoal/black
          card: '#12151E',       // Surface container dark
          surface: '#1A1E2B',    // Elevated card/modal
          border: '#2A3042',     // Subtle dark border
          hover: '#242A3C',      // Hover state on cards
          gold: {
            DEFAULT: '#D4AF37',  // Primary Metallic Gold
            light: '#F5E6AD',    // Light Gold highlight
            dark: '#AA8518',     // Deep Gold
            champagne: '#C5A059' // Soft Champagne Gold
          },
          burgundy: {
            DEFAULT: '#6B1D2F',  // Royal Burgundy
            dark: '#4A111F'
          }
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.25)',
        'gold-sm': '0 0 10px rgba(212, 175, 55, 0.15)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
