/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cy-green': '#1fa971',
        'cy-blue-darkest': '#171926',
        'cy-blue-darker': '#1b1e2e',
        'cy-blue-dark': '#2e3247',
        'cy-gray-light': '#d0d2e0',
        'cy-gray': '#9095ad',
        'cy-red': '#ff5770',
        'cy-blue': '#6470f3',
        'cy-yellow': '#EDBB4A',
        'cy-orange': '#db7905',
        'cy-purple': '#7f43c9'
      }
    },
  },
  plugins: [],
}