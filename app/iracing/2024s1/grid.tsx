import { getSiteTitle } from '@/app/site';
import LogoVertical from '@/app/ui/logo';
import Link from 'next/link';
import { SeriesCard } from './series-card';
import { OfficialSeries } from '../types';

export function Grid({ seriesArray }: { seriesArray: OfficialSeries[] }) {
    return (
        <div>
            <div className="m-auto flex max-w-7xl flex-wrap justify-center gap-6 px-2 pb-12 md:px-8">
                {seriesArray.map((series, index) => (
                    <SeriesCard key={series.name} series={series} priority={index < 8} />
                ))}
            </div>

            <div className="m-auto flex flex-col items-center justify-center py-12 text-teal800">
                <hr className="border-1 mb-8 w-3/4 rounded-md border-teal800 opacity-25" />
                <span className="pb-2 text-xl font-light">{getSiteTitle()}</span>
                <span className="pb-2 text-sm uppercase opacity-50">Brought to you by</span>
                <Link href="/" className="opacity-60 transition-opacity hover:opacity-80">
                    <LogoVertical width={140} singleColor={true} />
                </Link>
            </div>
        </div>
    );
}
