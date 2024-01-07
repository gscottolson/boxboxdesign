import { Grid, Nav } from '../ui';
import { iRacing2024S1OvalSeries } from '../../schedule-list';

export default function Page() {
  return (
    <>
      <Nav active="oval" />
      <Grid seriesArray={iRacing2024S1OvalSeries} />
    </>
  );
}
