import { Grid, Nav } from '../ui';
import { getAllRoad } from '../../schedule-list';
import { Metadata } from 'next';
import { useMemo } from 'react';

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
