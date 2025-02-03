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
          from: { scale: "0" },
          to: { scale: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        incr: {
          "0%": { scale: "1" },
          "100%": { scale: "1.01" },
        },
        incrBig: {
          "0%": { scale: "1" },
          "100%": { scale: "1.1" },
        },
      },
      animation: {
        slide: "slide .2s ease-in-out",
        slideIn: "slideIn .5s ease-in-out forwards",
        incr:"incr .1s ease-in-out forwards",
        incrBig:"incrBig .3s ease-in-out forwards"
      },
      // Custom scrollbar styles
      scrollbar: {
        DEFAULT: {
          width: '6px',
          borderRadius: '10px',
          backgroundColor: '#1f2937', // gray-800
          thumbColor: '#9333ea', // purple-600
          thumbHoverColor: '#7e22ce', // purple-700
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".custom-scrollbar::-webkit-scrollbar": {
          width: "6px",
        },
        ".custom-scrollbar::-webkit-scrollbar-thumb": {
          backgroundColor: "#9333ea",
          borderRadius: "10px",
        },
        ".custom-scrollbar::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#7e22ce",
        },
        ".custom-scrollbar::-webkit-scrollbar-track": {
          backgroundColor: "#1f2937",
        },
      });
    },
  ],
};
