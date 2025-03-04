/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media", // or "class" if you want manual control
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Ensure this includes your app files
    "./components/**/*.{js,ts,jsx,tsx}", // Add if you have components
    // ... other paths ...
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};