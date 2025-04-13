// module.exports = {
//   purge: [],
//   darkMode: false, // or 'media' or 'class'
//   theme: {
//     extend: {},
//   },
//   variants: {
//     extend: {},
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config, import ('flowbit')} */
// eslint-disable-next-line no-undef
module.exports = {
  content: [
    "./src//*.{js,jsx,ts,tsx}",
    // "node_modules/flowbite-react//*.{js,jsx,ts,tsx}",
    // './node_modules/flowbite//*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // require('flowbite/plugin')
  ],
};
