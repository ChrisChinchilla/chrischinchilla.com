const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // TODO: Refactor at some point?
        primary: colors.blue,
        secondary: colors.pink,
        brandBlue: '#9db0c2',
        brandYellow: '#eaba5d',
        brandGrey:'#4b555c'
      },
      // TODO: Parameter
        dropShadow: {
          lg: '0 10px 8px #9db0c2',
        },
      fontFamily: {
        // TODO: Shame it has to be this way…
        sans: ["Bitter", ...defaultTheme.fontFamily.sans],
        serif: ["Bitter", ...defaultTheme.fontFamily.sans],
        // serif: 
        btn: ["Albert Sans"],
        // TODO: Can I do it this way?
        heading: ["Albert Sans"],
        subheading: ["Albert Sans"],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
    darkMode: 'class',

};

/* 

  Alternative tailwind.config.js
  
  NOTE: Add this fonts to <head>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;700&display=swap" rel="stylesheet" />
*/

// module.exports = {
//   content: ["./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}"],
//   theme: {
//     extend: {
//       colors: {
//         primary: colors.cyan,
//         secondary: colors.lime,
//       },
//       fontFamily: {
//         sans: ["'Nunito'", ...defaultTheme.fontFamily.sans],
//       },
//     },
//   },
//   plugins: [require("@tailwindcss/typography")],
//   darkMode: "class",
// };
