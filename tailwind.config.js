/**
 * Enables variable coloring with opacity.
 * @param {String} variableName - The CSS variable name.
 * @returns The function that allows opacity configuration.
 */
function withOpacity(variableName) {
  return ({ opacityValue }) =>
    opacityValue !== undefined
      ? `rgba(var(${variableName}), ${opacityValue})`
      : `rgba(var(${variableName}))`;
}

module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "786px",
      lg: "1024px",
    },

    fontFamily: {
      header: "var(--font-family-header)",
      body: "var(--font-family-body)",
    },

    fontSize: {
      xs: ["10px", "14px"],
      sm: ["14px", "18px"],
      md: ["18px", "24px"],
      xl: ["20px", "25px"],
      "2xl": ["28px", "35px"],
      "3xl": ["36px", "45px"],
      "4xl": ["44px", "48px"],
      "5xl": ["52px", "58px"],
    },

    textColor: {
      base: withOpacity("--color-text-base"),
      highlight: withOpacity("--color-text-highlight"),
      "highlight-hover": withOpacity("--color-text-highlight-hover"),
      link: withOpacity("--color-text-link"),
      "link-hover": withOpacity("--color-text-link-hover"),
    },

    extend: {
      backgroundColor: {
        base: {
          DEFAULT: withOpacity("--color-background-base"),
          highlight: withOpacity("--color-background-highlight"),
        },
        scrollbar: {
          track: withOpacity("--color-scrollbar-track"),
          thumb: withOpacity("--color-scrollbar-thumb"),
        },
      },
      color: {
        white: withOpacity("--color-text-base"),
      },
      colors: {
        "green-light": withOpacity("--color-green-light"),
        "green-base": withOpacity("--color-green-base"),
        "green-dark": withOpacity("--color-green-dark"),
        "yellow-base": withOpacity("--color-yellow-base"),
        "yellow-dark": withOpacity("--color-yellow-dark"),
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-in": "slideIn 0.6s ease-out forwards",
        "scale-in": "scaleIn 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
    },
  },
  plugins: [],
};
