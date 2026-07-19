/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#0B0B0D",
        paper: "#FBF9F4",
        gold: { DEFAULT: "#C9A24B", light: "#E9D9AE", dim: "#9C7B34" },
        navy: { DEFAULT: "#16233F", light: "#2C4977", deep: "#0C1526" },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Manrope", "sans-serif"],
      },
      boxShadow: {
        gold: "0 8px 30px -8px rgba(201,162,75,0.45)",
      },
    },
  },
  plugins: [],
};
