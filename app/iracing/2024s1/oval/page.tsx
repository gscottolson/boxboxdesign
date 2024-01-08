import { Grid, Nav } from '../ui';
import { iRacing2024S1OvalSeries } from '../../schedule-list';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Oval',
}

export default function Page() {
  return (
    <>
      <Nav active="oval" />
      <Grid seriesArray={iRacing2024S1OvalSeries} />
    </>
  );
}
