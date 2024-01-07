import { Grid2, Nav } from '../ui';
import { iRacing2024S1RoadSeries } from '../../schedule-list';

export default function Page() {
  return (
    <>
      <Nav active="road" />
      <Grid2 seriesArray={iRacing2024S1RoadSeries} />
    </>
  );
}
