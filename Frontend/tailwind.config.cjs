/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module .exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
     extend: {
      colors: {
        primary: '#2563EB',
        backgroundStart: '#1E3A8A',
        backgroundEnd: '#1E40AF',
        surface: '#1F2937',
        text: '#FFFFFF',
        muted: '#9CA3AF',
        accent: '#3B82F6',
      },
    },
  },
  plugins: [],
}
