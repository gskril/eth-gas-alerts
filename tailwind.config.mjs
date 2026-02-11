/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        highlight: '#e4f2ff',
        'gas-green': '#61ff00',
        'gas-yellow': '#ffe142',
        'gas-red': '#ff0000',
      },
      maxWidth: {
        content: '55rem',
      },
    },
  },
  plugins: [],
};
