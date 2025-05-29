// tailwind.config.js
const defaultScreens = require('tailwindcss/defaultTheme').screens;
module.exports = {
    theme: {
      extend: {},
      screens: {
        'xxx-sm': '360px',     // móviles muy pequeños
        'xx-sm': '375px',    // móviles tipo iPhone
        'xsm': '411px',    // Pixel 2
        ...defaultScreens,
        'laptop': '1366px', // laptops comunes
        'fullhd': '1920px', // pantallas grandes
      },
    },
  };