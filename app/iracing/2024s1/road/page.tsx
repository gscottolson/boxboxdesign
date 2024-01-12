import { Grid, Nav } from '../ui';
import { Metadata } from 'next';
import { useMemo } from 'react';
import { getAllRoad } from '../../data/series-util';

export const metadata: Metadata = {
  title: 'Road',
};

export default function Page() {
  const series = useMemo(() => getAllRoad(), []);
  return (
    <>
      <Nav active="Road" />
      <Grid seriesArray={series} />
    </>
  );
}
