/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#050505",
          900: "#0a0a0c",
          850: "#111114",
          800: "#18181c",
          700: "#232329",
        },
        violet: {
          DEFAULT: "#8B3EF5",
          light: "#B87CFA",
          dark: "#5B1FC7",
        },
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      maxWidth: {
        content: "1320px",
      },
      boxShadow: {
        glow: "0 0 60px -10px rgba(139, 62, 245, 0.45)",
      },
    },
  },
  plugins: [],
};
