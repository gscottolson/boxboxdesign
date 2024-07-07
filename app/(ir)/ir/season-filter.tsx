'use client';
import React from 'react';
import { PosterSwiper } from './swiper';

type iRacingSeason = '2024s3' | '2024s2' | '2024s1';

interface SeasonFilterProps {}

function getSeasonLabel(season: iRacingSeason) {
    switch (season) {
        case '2024s1':
            return 'iRacing 2024 Season 1';
        case '2024s2':
            return 'iRacing 2024 Season 2';
        case '2024s3':
            return 'iRacing 2024 Season 3';
        default:
            return '[ missing season ]';
    }
}

export function SeasonFilter(props: SeasonFilterProps) {
    const [modalVisible, setModalVisible] = React.useState<boolean>(false);
    const [season, setSeason] = React.useState<iRacingSeason>('2024s3');

    const handleSeasonSelect = React.useCallback(() => {
        setModalVisible(true);
    }, []);

    const handleSeasonClick = React.useCallback((season: iRacingSeason) => {
        setSeason(season);
        setModalVisible(false);
    }, []);

    return (
        <div className="flex h-dvh flex-col justify-center">
            <PosterSwiper />

            <button className="mt-8 text-2xl text-stone-600 dark:text-stone-100" onClick={handleSeasonSelect}>
                {getSeasonLabel(season)}
            </button>

            {modalVisible && (
                <div className="fixed z-10 flex h-dvh w-dvw items-center justify-center bg-stone-900 bg-opacity-60">
                    <div className="flex h-full max-h-[600px] w-full max-w-[600px] flex-col justify-center gap-12 bg-stone-900 text-3xl text-stone-300">
                        <button onClick={() => handleSeasonClick('2024s3')}>2024 Season 3</button>
                        <button onClick={() => handleSeasonClick('2024s2')}>2024 Season 2</button>
                        <button onClick={() => handleSeasonClick('2024s1')}>2024 Season 1</button>
                    </div>
                </div>
            )}
        </div>
    );
}
