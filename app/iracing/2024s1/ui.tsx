import Link from 'next/link';
import { SeriesCard } from './series-card';
import { OfficialSeries } from '../schedule-list';

export function Nav({active}: {active: string}) {
  return (
        <ul className="flex w-full justify-center align-middle pt-4 pb-12 gap-8 text-gray700">
            <li key="road" className="teal800" style={{textDecoration: active === 'road' ? 'underline' : 'none'}}>
                <Link href="/iracing/2024s1/road">Road</Link>
            </li>
            <li key="oval" className="teal800" style={{textDecoration: active === 'oval' ? 'underline' : 'none'}}>
                <Link href="/iracing/2024s1/oval">Oval</Link>
            </li>
            <li key="dirtoval" className="teal800" style={{textDecoration: active === 'dirtoval' ? 'underline' : 'none'}}>
                <Link href="/iracing/2024s1/dirtoval" className="">Dirt Oval</Link>
            </li>
            <li key="dirtroad" className="teal800" style={{textDecoration: active === 'dirtroad' ? 'underline' : 'none'}}>
                <Link href="/iracing/2024s1/dirtroad">Dirt Road</Link>
            </li>
        </ul>
  );
}

export function Grid2({ seriesArray }: { seriesArray: OfficialSeries[] }) {
    return (
        <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
            {seriesArray.map((series, index) => (
                <SeriesCard key={series.name} series={series} priority={index < 8} />
            ))}
        </div>
    );
  }
