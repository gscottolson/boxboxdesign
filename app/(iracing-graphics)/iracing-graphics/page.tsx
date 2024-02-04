'use client';

import Balancer from 'react-wrap-balancer';
import { Options, findOptionsIndex } from './graphics-options';
import { GraphicsUI } from './graphics-ui';
import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { BoxBoxDesign } from '@/app/logos';

type ArrowElement = HTMLElement;

export default function Page() {
    const [focus, setFocus] = useState<number>(0);
    const [activeArrow, setActiveArrow] = useState<ArrowElement>();

    useEffect(() => {
        if (activeArrow) {
            activeArrow.style.display = 'none';
        }
        if (focus !== null) {
            const { focusClass } = Options[focus];
            const first = document.querySelector(`.${focusClass} .Arrow`) as ArrowElement;
            setActiveArrow(first);
            if (first && first.style) first.style.display = 'block';
        }
    }, [activeArrow, focus]);

    const prev = useCallback(() => {
        const result = focus !== null ? focus - 1 : 0;
        setFocus(result < 0 ? Options.length - 1 : result);
    }, [focus]);

    const next = useCallback(() => {
        const result = focus !== null ? focus + 1 : 0;
        setFocus(result % Options.length);
    }, [focus]);

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setFocus(parseInt(event.target.value, 10));
    }, []);

    const handleClick = useCallback((event: any) => {
        const ancestor = event.target.closest('[class*="control-"]');
        if (ancestor) {
            const [targetClass] = ancestor.classList;
            if (targetClass) {
                const focusIndex = findOptionsIndex(targetClass);
                setFocus(focusIndex);
            }
        }
    }, []);

    useEffect(() => {
        function handleKeyDown(event: any) {
            if (event.key === 'ArrowLeft') {
                prev();
            } else if (event.key === 'ArrowRight') {
                next();
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [next, prev]);

    return (
        // <div className="flex w-full flex-col items-start lg:items-center lg:justify-center">
        <div className="flex min-h-dvh w-full flex-col gap-2 pt-2 lg:justify-center lg:gap-8 lg:pt-0">
            <h1 className="pb-4 pt-8 text-center text-3xl/10 drop-shadow-graphics-header lg:pb-8 lg:text-5xl">
                <Balancer>iRacing Graphics, Explained</Balancer>
            </h1>

            <div className="mx-auto flex w-full max-w-[1280px] grow basis-5/6 flex-col items-center justify-start md:w-[80%] lg:w-full lg:grow-0 lg:basis-auto lg:flex-row lg:items-start">
                <div
                    onClick={handleClick}
                    className="mx-auto w-[80%] pr-[4%] drop-shadow-lg lg:w-[60%]" /* pr matches arrow padding in SVG */
                >
                    <GraphicsUI />
                </div>

                <div className="mx-auto flex w-[90%] flex-col justify-between px-[4%] py-2 md:w-[80%] lg:min-h-[500px] lg:w-[480px] lg:py-4 lg:pl-0 lg:pr-8">
                    <div className="order-2 lg:order-1">
                        <h2 className="pb-4 pt-4 text-xl/6 md:text-2xl/8 lg:pt-0 lg:text-3xl/10">
                            {focus !== null && Options[focus].title}
                        </h2>
                        {focus !== null &&
                            Options[focus].detail.map((item, index) => (
                                <p key={index} className="lg:text-lg pb-4 text-base">
                                    {item}
                                </p>
                            ))}
                    </div>
                    <div className="order-1 lg:order-2">
                        <div className="flex w-full select-none items-center justify-center gap-4">
                            <button
                                onClick={prev}
                                className="border-1 active:border-b-1 flex rounded-md border-b-2 border-[#B20028] bg-[#CD002E] p-2 pr-3 active:scale-95"
                            >
                                <PrevNextArrows mode="prev" />
                            </button>
                            <input
                                type="range"
                                value={focus}
                                className="w-1/2 max-w-72"
                                min="0"
                                max={Options.length - 1}
                                step={1}
                                onChange={handleChange}
                            />
                            <button
                                onClick={next}
                                className="border-1 active:border-b-1 flex rounded-md border-b-2 border-[#B20028] bg-[#CD002E] p-2 pl-3 active:scale-95"
                            >
                                <PrevNextArrows mode="next" />
                            </button>
                        </div>
                        <div className="relative -top-[10px] select-none text-center opacity-50">
                            {focus + 1} / {Options.length}
                        </div>
                    </div>
                </div>
            </div>

            <div className="color-teal800 mb-4 flex w-full items-center justify-center lg:pt-8">
                <Link href="/" className="w-40 lg:w-64">
                    <BoxBoxDesign.LightHorizontal scale={0.1} fillColor="#D41742" />
                </Link>
            </div>
        </div>
    );
}

function PrevNextArrows(props: { mode: 'prev' | 'next' }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="24" fill="none" viewBox="0 0 21 24">
            {props.mode === 'prev' && (
                <path
                    fill="#E6E6E6"
                    d="M1.52 11.132a1 1 0 0 0 0 1.736l17.984 10.277A1 1 0 0 0 21 22.277V1.723a1 1 0 0 0-1.496-.868L1.519 11.132Z"
                />
            )}
            {props.mode === 'next' && (
                <path
                    fill="#E6E6E6"
                    d="M19.48 11.132a1 1 0 0 1 0 1.736L1.497 23.145A1 1 0 0 1 0 22.277V1.723A1 1 0 0 1 1.496.855l17.985 10.277Z"
                />
            )}
        </svg>
    );
}
