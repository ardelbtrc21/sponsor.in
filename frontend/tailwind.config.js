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
    extend: {
      colors: {
        blusponsorin: "#031930",
        blusponsorinHover: "#2563EB"
      },
    },
  },
  plugins: [
    // require('flowbite/plugin')
  ],
};
