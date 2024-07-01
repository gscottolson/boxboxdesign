'use client';

import { useRef, useEffect, useState } from 'react';
import 'swiper/css/bundle';
import { SwiperContainer, register } from 'swiper/element/bundle';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { iRacing2024S3SportsCarSeries } from '@/app/(iracing)/iracing/data/2024s3-sportscar';
register();

const darkBGValues = '0, 0, 0';
const darkStyles = `
.swiper-wrapper .swiper-slide-shadow-left {
    background-image: linear-gradient(to left, rgba(${darkBGValues}, 0.7), rgba(${darkBGValues}, 0.3));
}
.swiper-wrapper .swiper-slide-shadow-right {
    background-image: linear-gradient(to right, rgba(${darkBGValues}, 0.7), rgba(${darkBGValues}, 0.3));
}
`;

const lightBGValues = '230, 228, 226';
const lightStyles = `
.swiper-wrapper .swiper-slide-shadow-left {
    background-image: linear-gradient(to left, rgba(${lightBGValues}, 0.7), rgba(${lightBGValues}, 0.3));
}   
.swiper-wrapper .swiper-slide-shadow-right {
    background-image: linear-gradient(to right, rgba(${lightBGValues}, 0.7), rgba(${lightBGValues}, 0.3));
}   
`;

const swiperParams = {
    cssMode: false,
    grabCursor: true,
    speed: 100,
    centeredSlides: true,
    freeMode: {
        enabled: true,
        sticky: true,
    },
    effect: 'coverflow',
    coverflowEffect: {
        rotate: '20',
        modifier: '1',
        depth: '10',
        scale: '0.95',
        slideShadows: true,
        stretch: '0',
    },
    scrollbar: {
        draggable: false,
        hide: true,
        el: '.swiper-custom-scrollbar',
    },
    breakpoints: {
        320: { slidesPerView: 1.2 },
        640: { slidesPerView: 2.2 },
        1024: { slidesPerView: 2.8 },
    },
};

const posterIDs = iRacing2024S3SportsCarSeries.map((series) => series.seriesId);

export function PosterSwiper(): React.ReactNode {
    const swiperElRef = useRef<SwiperContainer>(null);
    const [isClient, setIsClient] = useState(false);
    const { theme } = useTheme();

    useEffect(() => setIsClient(true), []);

    useEffect(() => {
        if (swiperElRef && swiperElRef.current) {
            Object.assign(swiperElRef.current, swiperParams, {
                injectStyles: [theme === 'dark' ? darkStyles : lightStyles],
            });
            swiperElRef.current.initialize();
        } else {
            console.info('Expected !!! swiperElRef to reference swiper element', swiperElRef.current);
        }
    }, [isClient, theme]);

    return !isClient ? null : (
        <div className="relative flex w-full justify-center" key={`swiper-${theme}`}>
            <swiper-container ref={swiperElRef} init="false" class="swiper my-auto w-full max-w-[1440px] py-48">
                {posterIDs.map((value, index) => {
                    const posterSlug = `${value}-${theme === 'dark' ? 'Dark' : 'Light'}`;
                    return (
                        <div
                            slot={`slide-${index}`}
                            className="slide-content flex h-auto items-center justify-center bg-slate-950 bg-opacity-5 dark:bg-opacity-80"
                            key={value}
                        >
                            <Image
                                className="h-auto w-full"
                                src={`/iracing/posters/2024s3/${posterSlug}.png`}
                                alt=""
                                width={900}
                                height={1200}
                            />
                        </div>
                    );
                })}
            </swiper-container>
            <div className="swiper-custom-scrollbar absolute bottom-[-24px] h-[6px] w-11/12 rounded-[4px] bg-slate-900 bg-opacity-5 dark:bg-opacity-90" />
        </div>
    );
}
