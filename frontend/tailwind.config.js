/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    'bg-red-200', 'text-red-800',
    'bg-blue-200', 'text-blue-800',
    'bg-green-200', 'text-green-800',
    'bg-yellow-200', 'text-yellow-800',
    'bg-purple-200', 'text-purple-800',
    'bg-pink-200', 'text-pink-800',
    'bg-orange-200', 'text-orange-800',
    'bg-teal-200', 'text-teal-800',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
