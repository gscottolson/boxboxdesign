import { Nav } from '../nav';
import { Metadata } from 'next';
import { useMemo } from 'react';
import { get2024S2Oval } from '../../data/series-util';
import { Grid } from '../grid';
import { Donate } from '../donate';

export const metadata: Metadata = {
    title: 'Oval',
};

export default function Page() {
    const series = useMemo(() => get2024S2Oval(), []);
    return (
        <>
            <Nav active="Oval" />
            <Grid seriesArray={series} />
            <Donate />
        </>
    );
}
