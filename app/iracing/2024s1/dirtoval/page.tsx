import { Grid2, Nav } from '../ui';
import { iRacing2024S1DirtOvalSeries } from '../../schedule-list';

export default function Page() {
  return (
    <>
      <Nav active="dirtoval" />
      <Grid2 seriesArray={iRacing2024S1DirtOvalSeries} />
    </>
  );
}
