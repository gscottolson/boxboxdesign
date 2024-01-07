'use client';

import React from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import useLockBodyScroll from '@/app/useLockBodyScroll';
import { createPortal } from 'react-dom';

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const bodyRef = useRef<HTMLBodyElement>(document.body as HTMLBodyElement)
  const [locked, setLocked] = useLockBodyScroll(false, 'site-body')

  useLayoutEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
      setLocked(true);
    }
  }, []);
  
  const onDismiss = React.useCallback(() => {
    router.back();
    setLocked(false);
  }, [router])

  return createPortal(
    <div>
      <dialog
        id="series-modal"
        ref={dialogRef}
        onClose={onDismiss}
        className="flex w-full md:w-[800px] h-[640px] relative shadow-2xl backdrop:bg-backdrop bg-white300"
      >
        {children}
        <button onClick={onDismiss} className="absolute top-0 right-0 size-[64px] p-[16px] text-center">
          <svg className="inline-block" width="20" height="20" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M52.7598 4.69434L4.75977 52.6943M4.75977 4.69434L52.7598 52.6943" stroke="#32545B" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </dialog>
    </div>,
    document.getElementById('modal-root')!
  );
}