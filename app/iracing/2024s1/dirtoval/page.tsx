import { Grid, Nav } from '../ui';
import { iRacing2024S1DirtOvalSeries } from '../../schedule-list';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dirt Oval',
}

export default function Page() {
  return (
    <>
      <Nav active="dirtoval" />
      <Grid seriesArray={iRacing2024S1DirtOvalSeries} />
    </>
  );
}
