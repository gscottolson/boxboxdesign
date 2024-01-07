import { Grid, Nav } from '../ui';
import { iRacing2024S1DirtRoadSeries } from '../../schedule-list';

export default function Page() {
  return (
    <>
      <Nav active="dirtroad" />
      <Grid seriesArray={iRacing2024S1DirtRoadSeries} />
    </>
  );
}
