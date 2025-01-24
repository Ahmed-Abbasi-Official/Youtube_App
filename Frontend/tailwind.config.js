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
      keyframes: {
        slide: {
          from: { scale:"0" },
          to: { scale: '1' },
        },
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        slide: 'slide .2s ease-in-out',
      },
      animation: {
        slideIn: 'slideIn .5s ease-in-out forwards',
      },
    },
  },
  plugins: [],
}