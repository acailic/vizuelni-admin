/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'gov-primary': '#0D4077',
        'serbia-blue': '#0D4077',
        'serbia-red': '#C6363C',
      },
    },
  },
  plugins: [],
};
