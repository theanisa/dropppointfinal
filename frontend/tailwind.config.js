/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'orange-primary': '#f97316',
        'gray-bg': '#f8fafc',
        'black-primary': '#000000',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'fb': '8px',
        'fb-lg': '12px',
      },
      boxShadow: {
        'fb': '0 1px 1px -1px rgb(0 0 0 / 0.1), 0 2px 4px rgb(0 0 0 / 0.1)',
        'fb-elevated': '0 0 0 1px rgba(0 0 0, 0.05), 0 2px 8px rgba(0 0 0, 0.08)',
      },
      screens: {
        'fb-desktop': '1024px',
      },
    },
  },
  plugins: [],
}

