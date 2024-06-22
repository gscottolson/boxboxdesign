'use client';

import { useRef, useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { SwiperContainer, register } from 'swiper/element/bundle';
register();

const MyComponent = () => {
    const swiperElRef = useRef<SwiperContainer>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        if (swiperElRef && swiperElRef.current) {
            // listen for Swiper events using addEventListener
            swiperElRef.current.addEventListener('swiperprogress', (e) => {
                // const [swiper, progress] = e.detail;
                console.log(e.target);
            });

            swiperElRef.current.addEventListener('swiperslidechange', (e) => {
                console.log('slide changed');
            });
        }
    }, []);

    return !isClient ? null : (
        <div className="flex h-dvh w-full items-center">
            <swiper-container
                class="m-auto w-2/3"
                speed="500"
                css-mode="true"
                navigation="true"
                pagination="true"
                loop="true"
                grab-cursor="true"
                centered-slides="true"
                slides-per-view="3"
                effect="coverflow"
                coverflow-effect-rotate="60"
                coverflow-effect-stretch="0"
                coverflow-effect-depth="200"
                coverflow-effect-scale="0.9"
                grabCursor="true"
            >
                {[1, 2, 3, 4, 5, 6].map((value) => (
                    <swiper-slide class="flex h-96 items-center justify-center" key={value}>
                        <div className="swiper-slide-transform flex aspect-[3/4] h-full items-center justify-center bg-slate-300">
                            Slide {value}
                        </div>
                    </swiper-slide>
                ))}
            </swiper-container>
        </div>
    );
};

export default MyComponent;
