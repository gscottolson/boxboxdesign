import { Nav } from '../nav';
import { Metadata } from 'next';
import { useMemo } from 'react';
import { getAllUnranked } from '../../data/series-util';
import { Grid } from '../grid';
import { Donate } from '../donate';

export const metadata: Metadata = {
    title: 'Unranked',
};

export default function Page() {
    const series = useMemo(() => getAllUnranked(), []);
    return (
        <>
            <Nav active="Unranked" />
            <Grid seriesArray={series} />
            <Donate />
        </>
    );
}
