import { useMemo } from 'react';
import { Grid, Nav } from '../ui';
import { Metadata } from 'next';
import { getAllDirtroad } from '../../data/series-util';

export const metadata: Metadata = {
  title: 'Dirt Road',
};

export default function Page() {
  const series = useMemo(() => getAllDirtroad(), []);
  return (
    <>
      <Nav active="Dirt Road" />
      <Grid seriesArray={series} />
    </>
  );
}
