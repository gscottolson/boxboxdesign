import React from 'react';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['swiper-container']: React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement>,
                HTMLElement,
                'slide-per-view'
            >;
            ['swiper-slide']: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement, 'role'>;
        }
    }
}
