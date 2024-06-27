'use client';

import { useRef, useEffect, useState } from 'react';
import 'swiper/css/bundle';
import { SwiperContainer, register } from 'swiper/element/bundle';
import Image from 'next/image';
register();

// swiper parameters
const swiperParams = {
    // pagination: true,
    // pagination-dynamic-bullets="true"
    cssMode: false,
    grabCursor: true,
    speed: 100,
    centeredSlides: true,
    // slidesPerView: 1.2,
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
        slideShadows: 'true',
        stretch: '0',
    },
    breakpoints: {
        320: { slidesPerView: 1.2 },
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
    },
    on: {
        init() {
            // ...
        },
    },
};

const posterIDs = [
    '2cd1-StockCarBrasilFixed',
    '4a4b-BMWPowerTourFixed',
    '4d87-GlobalMazdaFixed',
    '4f27-PorscheCupFixed',
    '9b1b-IMSAEnduranceOpen',
    '9d22-GTEOpen',
    '9df6-LMP3Fixed',
    '38a2-ClioFixed',
    '70e4-MissionRFixed',
    '79aa-SpecRacerOpen',
    '149a-IMSAVintageOpen',
    '0422-FerrariGT3Fixed',
    '455b-RingMeisterFixed',
    '458d-IMSAFixed',
    '8552-AdvancedMazdaOpen',
    '8903-SupercarsAusOpen',
    '9942-GT4Fixed',
    'a3f6-GRCupFixed',
    'a158-TCRFixed',
    'aa1b-LMP2Fixed',
    'b1e2-IMSAOpen',
    'b35b-GTEnduranceOpen',
    'bb65-SupercarsOpen',
    'bff8-PorscheCupOpen',
    'c5d8-GT3Fixed',
    'ce87-IMSAPilotOpen',
    'd034-SCCOpen',
    'd829-RainMasterFixed',
    'e7fa-PCCOpen',
    'e764-TCRChallengeOpen',
    'eb70-MustangFixed',
    'ec92-RadicalCupFixed',
    'ed6d-GlobalChallengeFixed',
];

const MyComponent = () => {
    const swiperElRef = useRef<SwiperContainer>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => setIsClient(true), []);

    useEffect(() => {
        if (swiperElRef && swiperElRef.current) {
            Object.assign(swiperElRef.current, swiperParams);
            swiperElRef.current.initialize();
        } else {
            console.info('Expected !!! swiperElRef to reference swiper element', swiperElRef.current);
        }
    }, [isClient]);

    return !isClient ? null : (
        <div className="flex h-dvh w-full">
            <swiper-container ref={swiperElRef} init="false" class="swiper m-auto w-11/12 py-48">
                {posterIDs.map((value, index) => (
                    <div
                        slot={`slide-${index}`}
                        className="slide-content flex h-auto items-center justify-center bg-slate-950"
                        key={value}
                    >
                        <Image
                            className="h-auto w-full"
                            src={`/iracing/posters/2024s3/${value}-Dark.png`}
                            alt=""
                            width={900}
                            height={1200}
                        />
                    </div>
                ))}
            </swiper-container>
        </div>
    );
};

export default MyComponent;
