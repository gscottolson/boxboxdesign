import { Grid, Nav } from '../ui';
import { getAllDirtoval } from '@/app/iracing/data/series-util';
import { Metadata } from 'next';
import { useMemo } from 'react';

export const metadata: Metadata = {
  title: 'Dirt Oval',
};

export default function Page() {
  const series = useMemo(() => getAllDirtoval(), []);
  return (
    <>
      <Nav active="Dirt Oval" />
      <Grid seriesArray={series} />
    </>
  );
}
