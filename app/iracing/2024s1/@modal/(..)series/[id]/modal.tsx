'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import useLockBodyScroll from '@/app/useLockBodyScroll';
import { createPortal } from 'react-dom';
import { Back, Close, Next } from '../../../icons';
import Link from 'next/link';
import { SeriesResult } from '@/app/iracing/schedule-list';

export function Modal({
  children,
  title,
  next = [{name: '', licenseClass: 'A'}, {index: 0}],
  prev = [{name: '', licenseClass: 'A'}, {index: 0}],
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
  }, []);

  const onDismiss = React.useCallback(() => {
    router.back();
    setLocked(false);
    document.title = originalTitle;
  }, [router]);

  const [nextSeries]: SeriesResult = next;
  const nextHref = `/iracing/series/${nextSeries.seriesId}`;

  const [prevSeries]: SeriesResult = prev;
  const prevHref = `/iracing/series/${prevSeries.seriesId}`;

  return createPortal(
    <div>
      <dialog
        id="series-modal"
        ref={dialogRef}
        onClose={onDismiss}
        className="relative flex h-[640px] w-full overflow-visible bg-white300 shadow-2xl backdrop:bg-backdrop backdrop:backdrop-blur-sm md:w-[800px]"
      >
        {children}
        <button
          onClick={onDismiss}
          className="absolute right-3 top-3 rounded-md p-2 text-center focus:ring-2 focus:ring-black focus:ring-offset-4 focus:ring-offset-[#D6DDDF] active:scale-90"
        >
          <Close />
        </button>

        <Link
          href={prevHref}
          replace
          scroll={false}
          className="absolute -left-3 top-1/2 mt-[-26px] rounded-md bg-white200 p-4 shadow-sm active:scale-95"
        >
          <Back />
        </Link>

        <Link
          href={nextHref}
          replace
          scroll={false}
          className="absolute -right-3 top-1/2 mt-[-26px] rounded-md bg-white200 p-4 shadow-sm active:scale-95"
        >
          <Next />
        </Link>
      </dialog>
    </div>,
    document.getElementById('modal-root')!,
  );
}
