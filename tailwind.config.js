/** @type {import('tailwindcss').Config} */
const withOpacityValue = (variable) => ({ opacityValue } = {}) => {
  if (opacityValue !== undefined) {
    return `rgb(var(${variable}) / ${opacityValue})`;
  }
  return `rgb(var(${variable}) / 1)`;
};

export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: withOpacityValue("--color-primary-500"),
          50: withOpacityValue("--color-primary-50"),
          100: withOpacityValue("--color-primary-100"),
          200: withOpacityValue("--color-primary-200"),
          300: withOpacityValue("--color-primary-300"),
          400: withOpacityValue("--color-primary-400"),
          500: withOpacityValue("--color-primary-500"),
          600: withOpacityValue("--color-primary-600"),
          700: withOpacityValue("--color-primary-700"),
          800: withOpacityValue("--color-primary-800"),
          900: withOpacityValue("--color-primary-900"),
          950: withOpacityValue("--color-primary-950"),
        },
        "primary-foreground": withOpacityValue("--color-on-primary"),
        background: withOpacityValue("--color-background"),
        foreground: withOpacityValue("--color-foreground"),
        surface: withOpacityValue("--color-surface"),
        "surface-muted": withOpacityValue("--color-surface-muted"),
        border: withOpacityValue("--color-border"),
        muted: withOpacityValue("--color-muted"),
        danger: withOpacityValue("--color-danger"),
        success: withOpacityValue("--color-success"),
      },
    },
  },
  plugins: [],
};
