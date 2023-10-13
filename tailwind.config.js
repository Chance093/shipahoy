/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  mode: 'jit',
  theme: {
    extend: {
      colors: {
        'primary': '#3bf',
        'secondary': '#66f',
        'tertiary': '#b3f',
        'gradient-start': '#181c2e',
        'gradient-end': '#250958',
        'btn-primary': '#1e293b',
        'btn-secondary': '#f3eeff',
        'heading': '#f3eeff',
        'hyperlink': '#9333ea',
        'paragraph': '#c3b4fc'
      },
    },
  },
  plugins: [],
}
