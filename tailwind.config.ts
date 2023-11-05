import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#3bf",
        secondary: "#66f",
        tertiary: "#b3f",
        "gradient-start": "#181c2e",
        "gradient-end": "#250958",
        "btn-primary": "#1e293b",
        "btn-secondary": "#f3eeff",
        heading: "#f3eeff",
        hyperlink: "#9333ea",
        paragraph: "#c3b4fc",
        warning: "#f87171",
        "test-primary": "#101011",
        "test-secondary": "#1b1b1b",
        "test-purple": "#5542f6",
        "test-light-purple": "#c8c2fc",
        "test-white": "#f6f6f6",
        "test-gray": "#a5a5ac",
        "test-gradient-start": "#242424",
        "test-gradient-end": "#1a1a1b",
      },
      backgroundImage: {
        "radial-gradient": "radial-gradient(circle at top, #242424 , #1a1a1b)",
        "linear-gradient":
          "linear-gradient(0deg, rgba(26,26,26,1) 0%, rgba(40,40,40,1) 100%);",
      },
    },
  },
  plugins: [],
};
export default config;
