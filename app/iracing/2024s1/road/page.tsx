'use client'

import Grid from '../grid';
import Nav from '../nav';
import { iRacing2024S1RoadSeries } from '../../schedule-list';
import { SeriesCard } from '../series-card';
import React from 'react';

export default function Page() {
  return (
    <>
      <Nav active="road" />

      <Grid>
        {iRacing2024S1RoadSeries.map(
          (series, index) => (<SeriesCard key={series.name} series={series} priority={index < 8} />)
        )}
      </Grid>
    </>
  );
}
