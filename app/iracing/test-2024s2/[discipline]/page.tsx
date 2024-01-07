// import Grid from '../grid';
// import Nav from '../nav';
import {iRacing2024S1DirtRoadSeries } from '@/app/iracing/schedule-list';
// import { SeriesCard } from '../series-card';

export default function Page({params}: {params: {discipline: string}}) {
  return (
    <>
      <div>discipline: {params.discipline}</div>
      {/* <Nav active="dirtroad" /> */}

      {/* <Grid> */}
        {/* {iRacing2024S1DirtRoadSeries.map(
          (series, index) => (<SeriesCard key={series.name} series={series} priority={index < 8} />)
        )} */}
      {/* </Grid> */}
    </>
  );
}
