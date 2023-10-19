import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  mode: 'jit',
  theme: {
    extend: {
      colors: {
        primary: '#3bf',
        secondary: '#66f',
        tertiary: '#b3f',
        'gradient-start': '#181c2e',
        'gradient-end': '#250958',
        'btn-primary': '#1e293b',
        'btn-secondary': '#f3eeff',
        heading: '#f3eeff',
        hyperlink: '#9333ea',
        paragraph: '#c3b4fc',
        warning: '#f87171',
      },
    },
  },
  plugins: [],
};
export default config;
