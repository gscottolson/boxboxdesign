import { Grid, Nav } from '../ui';
import { iRacing2024S1RoadSeries } from '../../schedule-list';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Road',
}

export default function Page() {
  return (
    <>
      <Nav active="road" />
      <Grid seriesArray={iRacing2024S1RoadSeries} />
    </>
  );
}
