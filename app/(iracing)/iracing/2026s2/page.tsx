import { cookies } from 'next/headers';
import SeriesClient, { type SeriesClientProps } from './SeriesClient';
import seriesData from '../../../../public/data/2026s2.json';
import { TEMP_UNIT_COOKIE, parseTempUnitCookie } from './temp-unit-preference';

export default function Page() {
    const series = seriesData as unknown as SeriesClientProps['series'];
    const initialTempUnit = parseTempUnitCookie(cookies().get(TEMP_UNIT_COOKIE)?.value);
    return <SeriesClient series={series} initialTempUnit={initialTempUnit} />;
}
