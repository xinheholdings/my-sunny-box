/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17211b",
        cream: "#fffdf6",
        sunshine: "#ffd95a",
        leaf: "#2e6b4f",
      },
    },
  },
  plugins: [],
};

module.exports = config;
