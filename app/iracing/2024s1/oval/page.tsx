import Grid from '../grid';
import Nav from '../nav';
import { iRacing2024S1OvalSeries } from '../../schedule-list';
import { SeriesCard } from '../series-card';

export default function Page() {
  return (
    <>
      <Nav active="oval" />

      <Grid>
        {iRacing2024S1OvalSeries.map(
          (series, index) => (<SeriesCard key={series.name} series={series} priority={index < 8} />)
        )}
      </Grid>
    </>
  );
}
