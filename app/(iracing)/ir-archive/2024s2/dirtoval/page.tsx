import { Nav } from '../nav';
import { get2024S2Dirtoval } from '@/app/(iracing)/iracing/data/series-util';
import { Metadata } from 'next';
import { useMemo } from 'react';
import { Donate } from '../donate';
import { Grid } from '../grid';

export const metadata: Metadata = {
    title: 'Dirt Oval',
};

export default function Page() {
    const series = useMemo(() => get2024S2Dirtoval(), []);
    return (
        <>
            <Nav active="Dirt Oval" />
            <Grid seriesArray={series} />
            <Donate />
        </>
    );
}
