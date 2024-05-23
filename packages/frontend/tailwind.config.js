// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@medusajs/ui-preset')],
  content: [
    './web/**/*.{js,ts,jsx,tsx}',
    './shared/components/**/*.{js,ts,jsx,tsx}',
    './shared/i18n/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      sans: 'Poppins',
      twemoji: [
        'Twemoji Country Flags',
        'Open Sans',
        'Helvetica',
        'sans-serif',
      ],
    },
    colors: {
      ...colors,
      primary: {
        400: '#e01a37',
        500: '#d31834',
        600: '#e51736',
      },
      secondary: {
        200: '#e2ecf3',
        900: '#20292F',
      },
      gray: {
        ...colors.gray,
        150: '#EEF0F1',
        900: '#323232',
      },
    },
    extend: {
      maxWidth: {
        'page-content': '1300px',
      },
      boxShadow: {
        'no-offset':
          '0 0px 10px 0px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
      zIndex: {
        60: 60,
        70: 70,
        80: 80,
        90: 90,
        100: 100,
      },
      screens: {
        xs: {
          raw: '(min-width: 448px)',
        },
      },
    },
  },
  plugins: [],
};
