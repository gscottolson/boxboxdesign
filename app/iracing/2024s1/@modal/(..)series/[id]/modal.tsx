'use client';

import React from 'react';
import { useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);
  
  const onDismiss = React.useCallback(() => {
    router.back();
  }, [])

  return createPortal(
    <div>
      <dialog ref={dialogRef} onClose={onDismiss} className="flex w-6/12 h-1/2 relative backdrop:bg-dialog-backdrop bg-page-bg">
          {children}
          <button onClick={onDismiss} className="absolute top-0 right-0 size-[64px] p-[16px] text-center">
            <svg className="inline-block" width="24" height="24" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M52.7598 4.69434L4.75977 52.6943M4.75977 4.69434L52.7598 52.6943" stroke="black" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </dialog>
      </div>

    ,
    document.getElementById('modal-root')!
  );
}