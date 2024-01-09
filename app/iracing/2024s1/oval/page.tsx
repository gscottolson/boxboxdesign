import { Grid, Nav } from '../ui';
import { getAllOval } from '../../schedule-list';
import { Metadata } from 'next';
import { useMemo } from 'react';

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
