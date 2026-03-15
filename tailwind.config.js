const DESKTOP_BREAKPOINT_PX = 1080;

const config = {
  theme: {
    screens: {
      desktop: `${DESKTOP_BREAKPOINT_PX}px`,
    },
    fontFamily: {
      sans: ["Rubik", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#0177FF",
      },
    },
  },
};

export default config;
