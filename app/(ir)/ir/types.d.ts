import type { DetailedHTMLProps, HTMLAttributes } from 'react';

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'swiper-container': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
                init?: string;
                /** Swiper custom element uses DOM `class`, not only React `className`. */
                class?: string;
            };
            'swiper-slide': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
                'data-hash'?: string;
                class?: string;
            };
        }
    }
}

export {};
