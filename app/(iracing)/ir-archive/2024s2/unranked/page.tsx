import { Nav } from '../nav';
import { Metadata } from 'next';
import { useMemo } from 'react';
import { get2024S2Unranked } from '@/app/(iracing)/iracing/data/series-util';
import { Grid } from '../grid';
import { Donate } from '../donate';

export const metadata: Metadata = {
    title: 'Unranked',
};

export default function Page() {
    const series = useMemo(() => get2024S2Unranked(), []);
    return (
        <>
            <Nav active="Unranked" />
            <Grid seriesArray={series} />
            <Donate />
        </>
    );
}
