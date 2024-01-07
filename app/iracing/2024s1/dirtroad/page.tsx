import { Grid2, Nav } from '../ui';
import { iRacing2024S1DirtRoadSeries } from '../../schedule-list';

export default function Page() {
  return (
    <>
      <Nav active="dirtroad" />
      <Grid2 seriesArray={iRacing2024S1DirtRoadSeries} />
    </>
  );
}
