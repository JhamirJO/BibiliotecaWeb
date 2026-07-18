/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'

export default {
  darkMode: 'class', // o false
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js',
  ],
  theme: {
    extend: {
      outlineWidth: {
        3: '3px',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['light'], // ['light', 'dark'] si quieres ambos
  },
}
