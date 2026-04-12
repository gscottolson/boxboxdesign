import { cookies } from 'next/headers';
import SeriesClient, { type SeriesClientProps } from '../2026s2/SeriesClient';
import seriesData from '../data/2026s1.json';
import { TEMP_UNIT_COOKIE, parseTempUnitCookie } from '../2026s2/temp-unit-preference';

export default function Page() {
    const jar = cookies();
    const series = seriesData as unknown as SeriesClientProps['series'];
    const initialTempUnit = parseTempUnitCookie(jar.get(TEMP_UNIT_COOKIE)?.value);
    const initialDarkMode = jar.get('theme')?.value === 'dark';
    return (
        <SeriesClient series={series} initialTempUnit={initialTempUnit} initialDarkMode={initialDarkMode} />
    );
}
