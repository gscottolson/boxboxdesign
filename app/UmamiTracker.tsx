'use client';

import React, { useEffect } from 'react';

export function UmamiTracker() {
    useEffect(() => {
        if (window.location.hostname !== 'localhost') {
            const script = document.createElement('script');
            script.async = true;
            script.defer = true;
            script.setAttribute('data-website-id', 'ea42990e-0591-454e-b494-416a0703ceef');
            script.src = 'https://analytics.us.umami.is/script.js';
            document.head.appendChild(script);

            return () => {
                document.head.removeChild(script);
            };
        } else {
            console.info('Umami tracking is disabled on localhost.');
        }
    }, []);

    return null;
}
