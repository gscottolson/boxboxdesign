import Grid from '../grid';
import Nav from '../nav';
import { iRacing2024S1RoadSeries } from '../schedule-list';
import { SeriesCard } from '../series-card';

export default function Page() {
  return (
    <div>
      <Nav active="road" />

      <Grid>
        {iRacing2024S1RoadSeries.map(
          (series, index) => (<SeriesCard key={series.name} series={series} priority={index < 8} />)
        )}
      </Grid>
    </div>
  );
}
