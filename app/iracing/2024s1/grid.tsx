import { getSiteTitle } from '@/app/site';
import LogoVertical from '@/app/ui/logo';
import Link from 'next/link';
import { SeriesCard } from './series-card';
import { OfficialSeries } from '../types';

export function Grid({ seriesArray }: { seriesArray: OfficialSeries[] }) {
    return (
        <div className="m-auto flex max-w-7xl flex-wrap justify-center gap-6 px-2 pb-12 md:px-8">
            {seriesArray.map((series, index) => (
                <SeriesCard key={series.name} series={series} priority={index < 8} />
            ))}
        </div>
    );
}
