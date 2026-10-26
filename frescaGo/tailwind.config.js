const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: token("canvas"),
        surface: token("surface"),
        soft: token("soft"),
        photo: token("photo"),
        ink: token("ink"),
        line: token("line"),
        primary: {
          DEFAULT: token("primary"),
          dark: token("primary-strong"),
        },
        brand: token("brand"),
        secondary: token("ink"),
        accent: {
          DEFAULT: token("accent"),
          soft: token("accent-soft"),
        },
        danger: {
          DEFAULT: token("danger"),
          soft: token("danger-soft"),
        },
        gray: {
          50: token("gray-50"),
          100: token("gray-100"),
          200: token("gray-200"),
          300: token("gray-300"),
          400: token("gray-400"),
          500: token("gray-500"),
          600: token("gray-600"),
          700: token("gray-700"),
          800: token("gray-800"),
          900: token("gray-900"),
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      borderRadius: {
        card: "1.25rem",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
    },
  },
  plugins: [],
};
