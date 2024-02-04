import { Nav } from '../nav';
import { getAllDirtoval } from '@/app/(iracing)/iracing/data/series-util';
import { Metadata } from 'next';
import { useMemo } from 'react';
import { Donate } from '../donate';
import { Grid } from '../grid';

export const metadata: Metadata = {
    title: 'Dirt Oval',
};

export default function Page() {
    const series = useMemo(() => getAllDirtoval(), []);
    return (
        <>
            <Nav active="Dirt Oval" />
            <Grid seriesArray={series} />
            <Donate />
        </>
    );
}
