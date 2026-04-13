import type { SeriesClientProps } from './SeriesClient';
import type { ScheduleSeasonKey } from './SeriesClientSeason';

/** Next.js 16 requires a string literal here (no `NODE_ENV` branching). */
export const dynamic = 'force-static';

async function ProdPage() {
    const [{ default: SeriesClient }, { default: seriesJson }] = await Promise.all([
        import('./SeriesClient'),
        import('../data/2026s2.json'),
    ]);
    return <SeriesClient series={seriesJson as unknown as SeriesClientProps['series']} />;
}

export default async function Page() {
    if (process.env.NODE_ENV === 'development') {
        const { SeriesClientSeason } = await import('./SeriesClientSeason');
        const seasonKey = '2026s2' satisfies ScheduleSeasonKey;
        return <SeriesClientSeason seasonKey={seasonKey} />;
    }
    return ProdPage();
}
