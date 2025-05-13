/* @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        // Add the 3D perspective classes we need
        transformStyle: {
          'preserve-3d': 'preserve-3d',
        },
        perspective: {
          1000: '1000px',
        },
        rotate: {
          'x-5': 'rotateX(5deg)',
        }
      }
    },
    plugins: [],
  }