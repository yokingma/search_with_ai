/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    },
  },
  plugins: [],
  darkMode: ['selector', '[theme-mode="dark"]'],
  corePlugins: {
    preflight: false
  }
};

