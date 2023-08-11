import { type Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Plus Jakarta Sans", "sans-serif"],
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontSize: {
        "heading-xl": [
          "1.5rem",
          {
            fontWeight: "700",
          },
        ],
        "heading-l": [
          "1.125rem",
          {
            fontWeight: "700",
          },
        ],
        "heading-m": [
          "0.9375rem",
          {
            fontWeight: "700",
          },
        ],
        "heading-s": [
          "0.75rem",
          {
            fontWeight: "700",
            letterSpacing: "0.15rem",
          },
        ],
        "body-l": [
          "0.8125rem",
          {
            fontWeight: "500",
            lineHeight: "1.4375rem",
          },
        ],
        "body-m": [
          "0.75rem",
          {
            fontWeight: "700",
          },
        ],
      },
      colors: {
        transparent: "transparent",
        black: "#000112",
        "very-dark-grey": "#20212C",
        "dark-grey": "#2B2C37",
        "lines-dark": "#3E3F4E",
        "medium-grey": "#828FA3",
        "lines-light": "#E4EBFA",
        "light-grey": "#F4F7FD",
        white: "#FFFFFF",
        "main-purple": "#635FC7",
        "main-purple-hover": "#A8A4FF",
        red: "#EA5555",
        "red-hover": "#FF9898",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
