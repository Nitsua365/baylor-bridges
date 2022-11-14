const color = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: color.emerald,
        primaryTwo: color.teal,
        secondary: color.yellow,
        neutral: color.gray
      }
    },
  },
  plugins: [],
}