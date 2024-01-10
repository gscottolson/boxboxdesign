import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        siteGradient: 'url(/iracing/bg-gradient.png)',
      },
      colors: {
        white100: '#F5F5F5',
        white200: '#EBEBEB',
        white300: '#D6DDDF',
        white400: '#C9D2D5',
        gray700: '#5D6C6F',
        teal800: '#32545B',
        blue800: '#2B3C59',
        backdrop: 'rgb(215 221 223 / 0.8)',
        rookie: '#92342E',
        classD: '#F98406',
        classC: '#D3A400',
        classB: '#3C6D56',
        classA: '#315187',
      },
      height: {
        pdf: '640px',
        card: '240px',
      },
      width: {
        pdf: '480px',
        card: '240px',
      },
      scale: {
        card: '0.992',
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
