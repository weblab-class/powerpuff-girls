/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.html",      // Include the root HTML file
    "./src/**/*.{js,ts,jsx,tsx}", // Include all files in the src folder
    ".client/src/**/*.{js,ts,jsx,tsx}",
    "./src/index.css",
    "./client/src/index.css"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};