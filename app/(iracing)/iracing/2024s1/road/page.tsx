import { Nav } from '../nav';
import { Metadata } from 'next';
import { useMemo } from 'react';
import { getAllRoad } from '../../data/series-util';
import { Donate } from '../donate';
import { Grid } from '../grid';

export const metadata: Metadata = {
    title: 'Road',
};

export default function Page() {
    const series = useMemo(() => getAllRoad(), []);
    return (
        <>
            <Nav active="Road" />
            <Grid seriesArray={series} />
            <Donate />
        </>
    );
}
