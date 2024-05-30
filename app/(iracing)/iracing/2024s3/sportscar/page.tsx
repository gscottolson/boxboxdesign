import { Nav } from '../nav';
import { Metadata } from 'next';
import { useMemo } from 'react';
import { Grid2024S3 } from '../grid2024s3';
import { Donate } from '../donate';

import { get2024S3SportsCar } from '../../data/series-util';

export const metadata: Metadata = {
    title: 'Sports Car',
};

export default function Page() {
    const series = useMemo(() => get2024S3SportsCar(), []);
    return (
        <>
            <Nav active="Sports Car" />
            <Grid2024S3 seriesArray={series} />
            <Donate />
        </>
    );
}
