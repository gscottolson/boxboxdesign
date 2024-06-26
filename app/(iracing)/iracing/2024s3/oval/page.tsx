import { Nav2024S3 } from '../nav2024s3';
import { Metadata } from 'next';
import { useMemo } from 'react';
import { Grid2024S3 } from '../grid2024s3';
import { DonateWithinGrid } from '../donate-within-grid';
import { FooterIcon } from '../../footer-icon';

import { get2024S3Oval } from '../../data/series-util';

export const metadata: Metadata = {
    title: 'Oval',
};

export default function Page() {
    const series = useMemo(() => get2024S3Oval(), []);
    return (
        <>
            <Nav2024S3 active="Oval" />
            <Grid2024S3 seriesArray={series}>
                <DonateWithinGrid />
            </Grid2024S3>
            <FooterIcon />
        </>
    );
}
