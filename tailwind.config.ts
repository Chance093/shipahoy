import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  mode: 'jit',
  theme: {
    colors: {
      'primary': '#3bf',
      'secondary': '#66f',
      'tertiary': '#b3f',
      'gradientStart': '#181c2e',
      'gradientEnd': '#250958',
      'primaryTypography': '#f3eeff',
      'secondaryTypography': '#c3b4fc'
    }
  },
  plugins: [],
}
export default config
