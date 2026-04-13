import { getSiteTitle } from '@/app/site';
import Link from 'next/link';
import { SeriesCard } from './series-card';
import { OfficialSeries } from '@/app/(iracing)/iracing/types';

export function Grid({ seriesArray }: { seriesArray: OfficialSeries[] }) {
    return !seriesArray ? null : (
        <div className="m-auto flex min-h-[480px] max-w-7xl flex-wrap justify-center gap-6 px-2 pb-12 text-base md:px-8">
            {seriesArray.map((series, index) => (
                <SeriesCard
                    key={series.seriesId ?? `${series.season ?? 's'}-${index}`}
                    series={series}
                    priority={index < 8}
                />
            ))}
        </div>
    );
}
