const plugin = require("tailwindcss/plugin");

module.exports = {
  purge: ["./pages/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      white: {
        light: "#FFFDFC",
        DEFAULT: "#f4edea",
        dark: "#CDC0BA",
      },
      blue: {
        light: "#435084",
        DEFAULT: "#273469",
        dark: "#111D4D",
      },
      darkblue: {
        DEFAULT: "#12263a",
      },
      lightblue: {
        light: "#FFFFFF",
        DEFAULT: "#e4d9ff",
        dark: "#C0A6FF",
      },
      yellow: {
        light: "#FFEAD5",
        DEFAULT: "#f4d1ae",
        dark: "#CEA175",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
