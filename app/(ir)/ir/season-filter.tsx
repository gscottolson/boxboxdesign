'use client';
import React from 'react';
import { PosterSwiper } from './swiper';
import { iRacingSeasons } from '@/app/enums';

interface SeasonFilterProps {}

export function SeasonFilter(props: SeasonFilterProps) {
    const [modalVisible, setModalVisible] = React.useState<boolean>(false);
    const [season, setSeason] = React.useState<iRacingSeasons>(iRacingSeasons['2024s3']);

    const handleSeasonSelect = React.useCallback(() => {
        setModalVisible(true);
    }, []);

    const handleSeasonClick = React.useCallback((season: iRacingSeasons) => {
        setSeason(season);
        setModalVisible(false);
    }, []);

    return (
        <div className="flex h-dvh flex-col justify-center">
            <PosterSwiper />

            <button className="mt-8 text-2xl text-stone-600 dark:text-stone-100" onClick={handleSeasonSelect}>
                {season}
            </button>

            {modalVisible && (
                <div className="fixed z-10 flex h-dvh w-dvw items-center justify-center bg-stone-900 bg-opacity-60">
                    <div className="flex h-full max-h-[600px] w-full max-w-[600px] flex-col justify-center gap-12 bg-stone-900 text-3xl text-stone-300">
                        <button onClick={() => handleSeasonClick(iRacingSeasons['2024s3'])}>
                            {iRacingSeasons['2024s3']}
                        </button>
                        <button onClick={() => handleSeasonClick(iRacingSeasons['2024s2'])}>
                            {iRacingSeasons['2024s2']}
                        </button>
                        <button onClick={() => handleSeasonClick(iRacingSeasons['2024s1'])}>
                            {iRacingSeasons['2024s1']}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
