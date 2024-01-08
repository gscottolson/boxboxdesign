'use client';

import React from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import useLockBodyScroll from '@/app/useLockBodyScroll';
import { createPortal } from 'react-dom';
import { Close } from '../../../icons';

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
        <button onClick={onDismiss} className="absolute top-3 right-3 rounded-md p-2 text-center focus:ring-2 focus:ring-black focus:ring-offset-4 focus:ring-offset-[#D6DDDF]">
          <Close />
        </button>
      </dialog>
    </div>,
    document.getElementById('modal-root')!
  );
}