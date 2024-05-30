import { Nav2024S3 } from '../nav2024s3';
import { Metadata } from 'next';
import { useMemo } from 'react';
import { Grid2024S3 } from '../grid2024s3';
import { Donate } from '../donate';

import { get2024S3Dirtoval } from '@/app/(iracing)/iracing/data/series-util';

export const metadata: Metadata = {
    title: 'Dirt Oval',
};

export default function Page() {
    const series = useMemo(() => get2024S3Dirtoval(), []);
    return (
        <>
            <Nav2024S3 active="Dirt Oval" />
            <Grid2024S3 seriesArray={series} />
            <Donate />
        </>
    );
}
