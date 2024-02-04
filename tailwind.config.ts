import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        fontSize: {
            // Base Value: 16 Scale: 1.309
            xs: '0.562rem',
            sm: '0.75rem',
            base: '1rem',
            xl: '1.312rem',
            '2xl': '1.688rem',
            '3xl': '2.25rem',
            '4xl': '2.938rem',
            '5xl': '3.812rem',
            '6xl': '5rem',
        },
        extend: {
            boxShadow: {
                homeShadow:
                    '0px 16px 36px 0px rgba(6, 14, 70, 0.10), 0px 66px 66px 0px rgba(6, 14, 70, 0.09), 0px 148px 89px 0px rgba(6, 14, 70, 0.05), 0px 263px 105px 0px rgba(6, 14, 70, 0.01), 0px 411px 115px 0px rgba(6, 14, 70, 0.00)',
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
            dropShadow: {
                'graphics-header': [
                    '0 0.5px 0 #AAAAAA',
                    '0 1px 0 #AAAAAA',
                    '0 0 1px rgba(77, 0, 17, 0.25)',
                    '0 2px 2px rgba(77, 0, 17, 0.21)',
                    '0 4px 2px rgba(77, 0, 17, 0.13)',
                    '0 7px 3px rgba(77, 0, 17, 0.04)',
                    '0 11px 3px rgba(77, 0, 17, 0.00)',
                ],
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
