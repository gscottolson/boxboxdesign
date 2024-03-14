'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import useLockBodyScroll from '@/app/useLockBodyScroll';
import { createPortal } from 'react-dom';
import { Back, Close, Next } from '../../../icons';
import Link from 'next/link';
import { SeriesResult } from '@/app/(iracing)/iracing/types';
import { getSeriesURL } from '@/app/(iracing)/iracing/data/series-util';

export function Modal({
    children,
    title,
    next = [{ name: '', season: null, licenseClass: null, discipline: null, setup: null }, { index: 0 }],
    prev = [{ name: '', season: null, licenseClass: null, discipline: null, setup: null }, { index: 0 }],
}: {
    children: React.ReactNode;
    title: string;
    next?: SeriesResult;
    prev?: SeriesResult;
}) {
    const router = useRouter();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [_locked, setLocked] = useLockBodyScroll(false, 'site-body');
    const [originalTitle] = useState(document.title);

    useLayoutEffect(() => {
        if (!dialogRef.current?.open) {
            dialogRef.current?.showModal();
            setLocked(true);
            document.title = title;
        }
    }, [setLocked, title]);

    const onDismiss = React.useCallback(() => {
        router.back();
        setLocked(false);
        document.title = originalTitle;
    }, [router, originalTitle, setLocked]);

    const [nextSeries]: SeriesResult = next;
    const [prevSeries]: SeriesResult = prev;
    const hasPrevSeries = !!prevSeries.seriesId;
    const hasNextSeries = !!nextSeries.seriesId;
    const hasAnyLink = hasPrevSeries || hasNextSeries;

    return createPortal(
        <div>
            <dialog
                id="series-modal"
                ref={dialogRef}
                onClose={onDismiss}
                className="flex h-full w-full items-start overflow-visible bg-transparent pt-8 backdrop:bg-backdrop backdrop:backdrop-blur-sm md:h-[640px] md:w-[800px] md:pt-0 md:shadow-2xl dark:text-blue-300 dark:backdrop:bg-gray-950/50"
            >
                {children}
                <button
                    onClick={onDismiss}
                    className="fixed right-3 top-3 rounded-md p-2 text-center focus:ring-2 focus:ring-black focus:ring-offset-4 focus:ring-offset-[#D6DDDF] active:scale-90"
                >
                    <Close />
                </button>

                {hasAnyLink && (
                    <div className="fixed bottom-1/3 left-0 flex w-full items-center justify-between px-2 md:px-8">
                        {hasPrevSeries && (
                            <Link
                                href={getSeriesURL(prevSeries.seriesId)}
                                replace
                                scroll={false}
                                className="scale-100 rounded-md bg-white200 p-6 shadow-lg active:scale-95 dark:bg-gray-900"
                            >
                                <Back />
                            </Link>
                        )}

                        {hasNextSeries && (
                            <Link
                                href={getSeriesURL(nextSeries.seriesId)}
                                replace
                                scroll={false}
                                className="scale-100 rounded-md bg-white200 p-6 shadow-lg active:scale-95 dark:bg-gray-900"
                            >
                                <Next />
                            </Link>
                        )}
                    </div>
                )}
            </dialog>
        </div>,
        document.getElementById('modal-root')!,
    );
}
