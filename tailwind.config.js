const plugin = require("tailwindcss/plugin");

module.exports = {
  purge: ["./pages/**/*.ts", "./components/**/*.ts"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
