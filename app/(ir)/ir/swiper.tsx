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
        <div className="h-dvh w-full">
            <swiper-container
                slides-per-view="3"
                class="m-auto w-1/2"
                speed="500"
                css-mode="true"
                navigation="true"
                pagination="true"
            >
                {[1, 2, 3, 4, 5, 6].map((value) => (
                    <swiper-slide class="flex h-96 items-center justify-center bg-slate-300" key={value}>
                        Slide {value}
                    </swiper-slide>
                ))}
            </swiper-container>
        </div>
    );
};

export default MyComponent;
