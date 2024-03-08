import { Nav } from '../nav';
import { Metadata } from 'next';
import { useMemo } from 'react';
import { get2024S2Formula } from '../../data/series-util';
import { Donate } from '../donate';
import { Grid } from '../grid';

export const metadata: Metadata = {
    title: 'Formula',
};

export default function Page() {
    const series = useMemo(() => get2024S2Formula(), []);
    return (
        <>
            <Nav active="Formula" />
            <Grid seriesArray={series} />
            <Donate />
        </>
    );
}
