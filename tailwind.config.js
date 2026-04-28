/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0A1D37",
        accent: "#3AB4BA",
        background: "#F8FBFF",
        busy: "#FF4D4D",
        moderate: "#FFB347",
        low: "#4CAF50",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
