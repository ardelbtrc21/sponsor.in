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
        blusponsorinHover: "#2563EB",
        primary: '#031930',
        secondary: '#758AA5',
        lightblue: '#D1DDED',
        darkblue: '#213A59',        
        white: '#FFFFFF'
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to bottom, #D1DDED 17%, #758AA5 36%, #213A59 59%, #031930 90%)',
      },
    },
  },
  plugins: [
    // require('flowbite/plugin')
  ],
};
