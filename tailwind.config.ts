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
        primary: "#101011",
        secondary: "#1b1b1b",
        purple: "#5542f6",
        "light-purple": "#c8c2fc",
        "custom-white": "#f6f6f6",
        "custom-gray": "#a5a5ac",
        "gradient-start": "#242424",
        "gradient-end": "#1a1a1b",
        "btn-primary": "#1e293b",
        "btn-secondary": "#f3eeff",
        heading: "#f3eeff",
        hyperlink: "#9333ea",
        paragraph: "#c3b4fc",
        warning: "#f87171",
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
