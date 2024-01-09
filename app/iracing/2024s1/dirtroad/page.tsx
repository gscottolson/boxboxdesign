import { Grid, Nav } from '../ui';
import { iRacing2024S1DirtRoadSeries } from '../../schedule-list';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dirt Road',
};

export default function Page() {
  return (
    <>
      <Nav active="Dirt Road" />
      <Grid seriesArray={iRacing2024S1DirtRoadSeries} />
    </>
  );
}
