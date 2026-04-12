'use client';

import { useEffect, useState } from 'react';
import SeriesClient, { type SeriesClientProps } from './SeriesClient';

const seasonLoaders = {
    '2026s2': () => import('../data/2026s2.json'),
    '2026s1': () => import('../data/2026s1.json'),
    '2025s4': () => import('../data/2025s4.json'),
} as const;

export type ScheduleSeasonKey = keyof typeof seasonLoaders;

export function SeriesClientSeason({ seasonKey }: { seasonKey: ScheduleSeasonKey }) {
    const [series, setSeries] = useState<SeriesClientProps['series'] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        seasonLoaders[seasonKey]()
            .then((m) => {
                if (!cancelled) setSeries(m.default as unknown as SeriesClientProps['series']);
            })
            .catch(() => {
                if (!cancelled) setError('Could not load schedule data.');
            });
        return () => {
            cancelled = true;
        };
    }, [seasonKey]);

    if (error) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-[var(--bg)] p-6 text-center text-red-600">
                {error}
            </div>
        );
    }
    if (!series) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-[var(--bg)]">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent opacity-60" />
            </div>
        );
    }
    return <SeriesClient series={series} />;
}
