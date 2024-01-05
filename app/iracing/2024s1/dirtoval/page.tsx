import Grid from '../grid';
import Nav from '../nav';
import { iRacing2024S1DirtOvalSeries } from '../../schedule-list';
import { SeriesCard } from '../series-card';

export default function Page() {
  return (
    <>
      <Nav active="dirtoval" />

      <Grid>
        {iRacing2024S1DirtOvalSeries.map(
          (series, index) => (<SeriesCard key={series.name} series={series} priority={index < 8} />)
        )}
      </Grid>
    </>
  );
}
