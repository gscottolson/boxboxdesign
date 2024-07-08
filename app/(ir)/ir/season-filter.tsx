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

    const handleBGClick = React.useCallback(() => {
        setModalVisible(false);
    }, []);

    const handleModalClick = React.useCallback((evt: React.MouseEvent<HTMLDivElement>) => {
        evt.stopPropagation();
    }, []);

    return (
        <div className="flex h-dvh flex-col justify-center">
            <div className="text-center text-xl text-stone-600 dark:text-stone-100">
                <div className="uppercase tracking-wider dark:text-stone-400">iRacing Offical Series Schedules</div>
                <button
                    className="inline-block text-center text-3xl font-extralight tracking-tighter"
                    onClick={handleSeasonSelect}
                >
                    {season}
                </button>
                <div className="mb-8">
                    <button
                        className="text-xl font-light text-stone-600 dark:text-stone-100"
                        onClick={handleSeasonSelect}
                    >
                        Sports Car
                    </button>
                </div>
            </div>

            <PosterSwiper />

            {modalVisible && (
                <div
                    className="fixed z-10 flex h-dvh w-dvw items-center justify-center bg-stone-900 bg-opacity-60"
                    onClick={handleBGClick}
                >
                    <div
                        onClick={handleModalClick}
                        className="flex h-full max-h-[600px] w-full max-w-[600px] flex-col items-center justify-center gap-1 bg-stone-900 text-xl text-stone-300"
                    >
                        <button
                            className="block w-64 bg-stone-800"
                            onClick={() => handleSeasonClick(iRacingSeasons['2024s3'])}
                        >
                            {iRacingSeasons['2024s3']}
                        </button>
                        <button
                            className="block w-64 bg-stone-800"
                            onClick={() => handleSeasonClick(iRacingSeasons['2024s2'])}
                        >
                            {iRacingSeasons['2024s2']}
                        </button>
                        <button
                            className="block w-64 bg-stone-800"
                            onClick={() => handleSeasonClick(iRacingSeasons['2024s1'])}
                        >
                            {iRacingSeasons['2024s1']}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
