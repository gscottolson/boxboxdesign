'use client';

import { useRef, useEffect, useState } from 'react';
import 'swiper/css/bundle';
import { SwiperContainer, register } from 'swiper/element/bundle';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { iRacing2024S3SportsCarSeries } from '@/app/(iracing)/iracing/data/2024s3-sportscar';
register();

const swiperParams = {
    cssMode: false,
    grabCursor: true,
    speed: 200,
    centeredSlides: true,
    freeMode: {
        enabled: true,
        sticky: true,
    },
    // effect: 'coverflow',
    // coverflowEffect: {
    //     rotate: '20',
    //     modifier: '1',
    //     depth: '10',
    //     scale: '0.95',
    //     slideShadows: true,
    //     stretch: '0',
    // },
    spaceBetween: 4,
    hashNavigation: {
        watchState: true,
    },
    mousewheel: true,
    keyboard: true,
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

const sportsCarSeries = iRacing2024S3SportsCarSeries;

export function PosterSwiper(): React.ReactNode {
    const swiperElRef = useRef<SwiperContainer>(null);
    const [isClient, setIsClient] = useState(false);
    const { theme } = useTheme();

    useEffect(() => setIsClient(true), []);

    useEffect(() => {
        if (swiperElRef && swiperElRef.current) {
            Object.assign(swiperElRef.current, swiperParams);
            swiperElRef.current.initialize();
        }
    }, [isClient, theme]);

    return !isClient ? null : (
        <div className="relative flex w-full justify-center">
            <swiper-container ref={swiperElRef} init="false" class="swiper my-auto w-full max-w-[1440px] py-48">
                {sportsCarSeries.map((series, index) => {
                    const posterSlug = `${series.seriesId}-${theme === 'dark' ? 'Dark' : 'Light'}`;
                    return (
                        <swiper-slide
                            key={series.seriesId}
                            data-hash={series.seriesId}
                            class="flex h-auto items-center justify-center bg-slate-950 bg-opacity-5 shadow-2xl dark:bg-opacity-80"
                            className="slide-content"
                        >
                            <Image
                                className="h-auto w-full"
                                src={`/iracing/posters/2024s3/${posterSlug}.png`}
                                alt={`Race Schedule Poster for ${series.name}, a race series in iRacing 2024 Season 3`}
                                width={900}
                                height={1200}
                            />
                        </swiper-slide>
                    );
                })}
            </swiper-container>
            <div className="swiper-custom-scrollbar absolute bottom-[-24px] h-[6px] w-11/12 rounded-[4px] bg-slate-900 bg-opacity-5 dark:bg-opacity-90" />
        </div>
    );
}
