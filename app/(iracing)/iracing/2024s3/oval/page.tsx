import { Nav } from '../nav';
import { Metadata } from 'next';
import { useMemo } from 'react';
import { Grid2024S3 } from '../grid2024s3';
import { Donate } from '../donate';

import { get2024S3Oval } from '../../data/series-util';

export const metadata: Metadata = {
    title: 'Oval',
};

export default function Page() {
    const series = useMemo(() => get2024S3Oval(), []);
    return (
        <>
            <Nav active="Oval" />
            <Grid2024S3 seriesArray={series} />
            <Donate />
        </>
    );
}
