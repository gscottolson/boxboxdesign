'use client';

import { useRef, useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { SwiperContainer, register } from 'swiper/element/bundle';
import { Swiper } from 'swiper/types';
register();

const MyComponent = () => {
    const swiperElRef = useRef<SwiperContainer>(null);
    const [isClient, setIsClient] = useState(false);

    const posterIDs = [
        '4d87-GlobalMazdaFixed',
        '0422-FerrariGT3Fixed',
        'a3f6-GRCupFixed',
        'e7fa-PCCOpen',
        '9942-GT4Fixed',
        'ed6d-GlobalChallengeFixed',
        '38a2-ClioFixed',
        'a158-TCRFixed',
        '79aa-SpecRacerOpen',
        'eb70-MustangFixed',
        '70e4-MissionRFixed',
        'e764-TCRChallengeOpen',
        '455b-RingMeisterFixed',
        'bff8-PorscheCupOpen',
        '4f27-PorscheCupFixed',
        'b35b-GTEnduranceOpen',
    ];

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
        <div className="flex h-dvh w-full">
            <swiper-container
                class="swiper swiper-3d m-auto w-11/12"
                speed="500"
                css-mode="false"
                navigation="true"
                pagination="true"
                loop="true"
                grab-cursor="true"
                centered-slides="true"
                slides-per-view="3"
                effect="coverflow"
                coverflow-effect-rotate="30"
                coveflow-effect-modifier="1"
                coverflow-effect-depth="100"
                coverflow-effect-scale="0.9"
                coverflow-effect-slide-shadows="true"
                coverflow-effect-stretch="0"
            >
                {posterIDs.map((value) => (
                    <swiper-slide class="flex h-auto items-center justify-center" key={value}>
                        <div className="swiper-slide-transform aspect-[3/4] bg-slate-300">
                            <img className="h-auto w-full" src={`/iracing/posters/2024s3/${value}-Dark.png`} />
                        </div>
                    </swiper-slide>
                ))}
            </swiper-container>
        </div>
    );
};

export default MyComponent;
