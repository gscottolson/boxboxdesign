import SeriesClient, { type SeriesClientProps } from './SeriesClient';
import seriesData from '../../../../public/data/2026s2.json';

export default function Page() {
    const series = seriesData as unknown as SeriesClientProps['series'];
    return <SeriesClient series={series} />;
}
