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
                className="flex min-h-full w-full items-start overflow-visible bg-transparent pt-8 backdrop:bg-white300 md:h-[640px] md:min-h-0 md:w-[800px] md:pt-0 md:shadow-2xl dark:text-blue-300 dark:backdrop:bg-neutral-700"
            >
                {children}
                <button
                    onClick={onDismiss}
                    className="fixed right-3 top-3 rounded-md p-2 text-center focus:ring-2 focus:ring-black focus:ring-offset-4 focus:ring-offset-[#D6DDDF] active:scale-90"
                >
                    <Close />
                </button>

                {hasAnyLink && (
                    <div className="fixed left-0 top-[420px] flex w-full items-center justify-between px-2">
                        {hasPrevSeries && (
                            <Link
                                href={getSeriesURL(prevSeries.seriesId)}
                                replace
                                scroll={false}
                                className="scale-100 rounded-md bg-white200/90 p-6 shadow-lg active:scale-95 dark:bg-gray-900/50"
                                data-umami-event={`prev-button-to-${prevSeries.seriesId}`}
                            >
                                <Back />
                            </Link>
                        )}

                        {hasNextSeries && (
                            <Link
                                href={getSeriesURL(nextSeries.seriesId)}
                                replace
                                scroll={false}
                                className="scale-100 rounded-md bg-white200/90 p-6 shadow-lg active:scale-95 dark:bg-gray-900/50"
                                data-umami-event={`next-button-to-${nextSeries.seriesId}`}
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
