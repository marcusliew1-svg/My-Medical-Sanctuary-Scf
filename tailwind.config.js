/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0B1A2E",
        gold: "#B56F5B",
        "gold-light": "#D9B8AA",
        ivory: "#FDFBF7",
        "warm-white": "#F7F5F2",
        "deep-green": "#315B4C",
        charcoal: "#2A2A2E",
        "warm-gray": "#6B6B72",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        premium: "0 20px 55px rgba(11, 26, 46, 0.10)",
        soft: "0 10px 30px rgba(11, 26, 46, 0.08)",
      },
    },
  },
  plugins: [],
};
