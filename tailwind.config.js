/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "gradient-start": "var(--gradient-start)",
        "gradient-end": "var(--gradient-end)",
      },
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
      },
      fadeOut: {
        '0%': { opacity: 1 },
        '100%': { opacity: 0 },
      },
    },
    animation: {
      fadeIn: 'fadeIn 300ms ease-in forwards',
      fadeOut: 'fadeOut 300ms ease-out forwards',
    },
  },
  variants: {
    opacity: ({ after }) => after(["disabled"]),
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/container-queries"),
    function ({ addUtilities }) {
      addUtilities({
        ".border-gradient-to-r": {
          borderImage:
            "linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-stops), var(--tw-gradient-to)) 1",
        },
        ".border-gradient-to-l": {
          borderImage:
            "linear-gradient(to left, var(--tw-gradient-from), var(--tw-gradient-stops), var(--tw-gradient-to)) 1",
        },
        ".border-gradient-to-b": {
          borderImage:
            "linear-gradient(to bottom, var(--tw-gradient-from), var(--tw-gradient-stops), var(--tw-gradient-to)) 1",
        },
        ".border-gradient-to-t": {
          borderImage:
            "linear-gradient(to top, var(--tw-gradient-from), var(--tw-gradient-stops), var(--tw-gradient-to)) 1",
        },
      });
    },
  ],
};
