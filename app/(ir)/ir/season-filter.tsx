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
        <div className="my-auto flex h-dvh shrink-0 flex-col justify-start lg:justify-center">
            <div className="mb-4 shrink-0 text-center text-stone-600 dark:text-stone-100">
                <div className="mt-12 uppercase tracking-wider lg:mt-0 lg:text-xl dark:text-stone-400">
                    iRacing Offical Series Schedules
                </div>

                <div className="relative inline-block w-full max-w-[500px]">
                    <button
                        className="inline-block text-center text-2xl font-extralight tracking-tighter lg:text-3xl"
                        onClick={handleSeasonSelect}
                    >
                        {season}
                    </button>

                    {modalVisible && (
                        <div
                            onClick={handleModalClick}
                            className="absolute left-0 top-[100px] z-20 my-auto flex flex-col items-center justify-center gap-1 bg-stone-800 text-xl text-stone-300"
                        >
                            <button
                                className="block w-full"
                                onClick={() => handleSeasonClick(iRacingSeasons['2024s3'])}
                            >
                                {iRacingSeasons['2024s3']}
                            </button>
                            <button
                                className="block w-full"
                                onClick={() => handleSeasonClick(iRacingSeasons['2024s2'])}
                            >
                                {iRacingSeasons['2024s2']}
                            </button>
                            <button
                                className="block w-full"
                                onClick={() => handleSeasonClick(iRacingSeasons['2024s1'])}
                            >
                                {iRacingSeasons['2024s1']}
                            </button>
                        </div>
                    )}
                </div>

                <div className="">
                    <button
                        className="text-xl font-light text-stone-600 lg:text-2xl dark:text-stone-100"
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
                />
            )}
        </div>
    );
}
