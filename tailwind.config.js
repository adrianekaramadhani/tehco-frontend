// File: tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <-- PASTIKAN BARIS INI ADA DAN BENAR
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}