/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        crucigrama: {
          purple: "#6D28D9",
          yellow: "#FACC15",
        },
      },
    },
  },
  plugins: [],
};
