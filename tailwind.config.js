/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        icici: {
          blue: {
            dark: '#003366',
            light: '#0f4c81',
            hover: '#0a3d6d',
          },
          orange: {
            DEFAULT: '#f37021',
            hover: '#e05f13',
            light: '#ffe8db',
          },
          ice: '#f4f7fa',
          gray: {
            dark: '#333333',
            light: '#777777',
          }
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
