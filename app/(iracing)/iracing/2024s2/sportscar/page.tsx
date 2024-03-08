import { Nav } from '../nav';
import { Metadata } from 'next';
import { useMemo } from 'react';
import { get2024S2SportsCar } from '../../data/series-util';
import { Donate } from '../donate';
import { Grid } from '../grid';

export const metadata: Metadata = {
    title: 'Sports Car',
};

export default function Page() {
    const series = useMemo(() => get2024S2SportsCar(), []);
    return (
        <>
            <Nav active="Sports Car" />
            <Grid seriesArray={series} />
            <Donate />
        </>
    );
}
