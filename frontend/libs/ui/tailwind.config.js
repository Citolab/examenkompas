const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    join(__dirname, 'src/**/*.{js,ts,jsx,tsx}'),
    join(__dirname, '.storybook/preview.js'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#FFBEBE',
          DEFAULT: '#f86d70',
          dark: '#a1616a',
        },
        secondary: {
          light: colors.indigo[300],
          DEFAULT: colors.indigo,
          dark: colors.indigo[900],
        },
        muted: colors.gray,
      },
    },
    fontFamily: {
      header: ['poppins', 'roboto'],
      body: ['anonymous', 'verdana'],
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [],
};
