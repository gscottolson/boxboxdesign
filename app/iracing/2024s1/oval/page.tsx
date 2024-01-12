import { Grid, Nav } from '../ui';
import { Metadata } from 'next';
import { useMemo } from 'react';
import { getAllOval } from '../../data/series-util';

export const metadata: Metadata = {
  title: 'Oval',
};

export default function Page() {
  const series = useMemo(() => getAllOval(), []);
  return (
    <>
      <Nav active="Oval" />
      <Grid seriesArray={series} />
    </>
  );
}
