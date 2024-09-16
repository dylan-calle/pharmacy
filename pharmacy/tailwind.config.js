/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        zain: ["Zain", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
