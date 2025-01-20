/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        custom: "3px 3px 0px 2px  #38333F",
      },
      screens: {
        '540px': { max: '540px' },
      },
    },
  },
  plugins: [],
}