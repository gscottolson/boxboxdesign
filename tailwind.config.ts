import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        white100: "#F5F5F5",
        white200: "#EBEBEB",
        white300: "#D6DDDF",
        gray700: "#5D6C6F",
        teal800: "#32545B",
        blue800: "#2B3C59",
        backdrop: "rgb(214 221 223 / 0.8)",
      },
    },
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
