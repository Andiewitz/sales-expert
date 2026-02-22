/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#FFC107',
          'gold-20': 'rgba(255, 193, 7, 0.2)',
          'gold-40': 'rgba(255, 193, 7, 0.4)',
          black: '#000000',
          dark: '#121212',
          gray: '#1E1E1E'
        }
      }
    },
  },
  plugins: [],
}
