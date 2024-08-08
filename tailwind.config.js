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
