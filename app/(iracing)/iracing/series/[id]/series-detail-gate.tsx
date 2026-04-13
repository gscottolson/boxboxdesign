'use client';

import dynamic from 'next/dynamic';
import type { OfficialSeries } from '../../types';

const SeriesDetailMono = dynamic(
    () => import('../../2024s2/series-detail').then((m) => ({ default: m.SeriesDetail })),
    { ssr: false },
);

const SeriesDetailLightDark = dynamic(
    () => import('../../2024s3/series-detail').then((m) => ({ default: m.SeriesDetail })),
    { ssr: false },
);

export function SeriesDetailGate({
    series,
    variant,
}: {
    series: OfficialSeries;
    variant: 'mono' | 'lightdark';
}) {
    if (variant === 'mono') {
        return <SeriesDetailMono series={series} />;
    }
    return <SeriesDetailLightDark series={series} />;
}
