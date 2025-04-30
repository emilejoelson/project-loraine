/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "app-primary-purple":"#8c52ff",
        "app-secondary-purple":"#cb6ce6",
        "app-fird-purple":"#d2abc9",
        "app-primay-dark": "#362E75",
        "app-secondary-dark": "#7263D8",
        "app-accent-light": "#CDB9FD",
        "app-accent-lighter": "rgba(213,217,254,0.5)",
        "app-highlight-dar": "#2000E5",
        "custom-opacity": "rgb(0, 0, 0, 0.5)", 
        "app-primary-dark": "#362E75",
      },
      backgroundImage: {
        pagesGradient: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23d8a4d1' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
        bgUploadCv: "url('/assets/images/background-image-deposit-cv.jpg')",
        bgVideo: "url('/assets/videos/background-video.mp4')",
      },
      padding: {
        "app-primary-padding": "3.8rem",
        "app-secondary-padding": "2rem",
      },
      fontSize: {
        customInherit: "inherit",
      },
      
      gridTemplateColumns: {
        autoFit: "repeat(auto-fit, minmax(min(400px,100%), 1fr))",
        autoFitSM: "repeat(auto-fit, minmax(min(350px,100%), 1fr))",
      },
      boxShadow: {
        headerLinksShadow:
          "0px 6px 18px -1px rgba(0, 0, 0, 0.04),0px 2px 6px -1px rgba(0, 0, 0, 0.07)",
          "custom": "0 8px 20px rgba(0, 0, 0, 0.4)", 
      },
      screens: {
        "custom-1024":{max:"1024px"},
        "custom-952": { max: "952px" },
        "custom-650": { max: "650px" },
        "custom-450": {max: "450px"}
      },
      lineHeight: {
        '62px': '62px',
      },
    },
  },
  plugins: [],
};
