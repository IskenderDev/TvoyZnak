const config = {
  theme: {
    fontFamily: {
      sans: ["Rubik", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#0177FF",
      },
    },
  },
  screens: {
    sm: "640px",
    md: {
      raw:
        "(min-width: 768px) and (min-height: 500px), (min-width: 768px) and (hover: hover), (min-width: 768px) and (pointer: fine)",
    },
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
};

export default config;
