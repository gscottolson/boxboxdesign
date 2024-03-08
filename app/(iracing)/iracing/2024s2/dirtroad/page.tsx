import { useMemo } from 'react';
import { Nav } from '../nav';
import { Metadata } from 'next';
import { get2024S2Dirtroad } from '../../data/series-util';
import { Grid } from '../grid';
import { Donate } from '../donate';

export const metadata: Metadata = {
    title: 'Dirt Road',
};

export default function Page() {
    const series = useMemo(() => get2024S2Dirtroad(), []);
    return (
        <>
            <Nav active="Dirt Road" />
            <Grid seriesArray={series} />
            <Donate />
        </>
    );
}
