import Link from 'next/link';
import { SeriesCard } from './series-card';
import { Discipline, OfficialSeries } from '../types';
import { getDisciplineURL } from '../data/series-util';

export function Nav({ active }: { active: Discipline }) {
    const isRoad = active === 'Road';
    const isOval = active === 'Oval';
    const isDirtOval = active === 'Dirt Oval';
    const isDirtRoad = active === 'Dirt Road';
    const isUnranked = active === 'Unranked';

    return (
        <ul className="flex w-full flex-wrap justify-center gap-x-8 gap-y-2 px-4 pb-12 pt-4 align-middle font-medium uppercase text-gray700">
            <li key="a" style={{ textDecoration: isRoad ? 'underline' : 'none' }}>
                <Link href={getDisciplineURL('Road')}>Road</Link>
            </li>

            <li key="b" style={{ textDecoration: isOval ? 'underline' : 'none' }}>
                <Link href={getDisciplineURL('Oval')}>Oval</Link>
            </li>

            <li key="c" style={{ textDecoration: isDirtOval ? 'underline' : 'none' }}>
                <Link href={getDisciplineURL('Dirt Oval')}>Dirt Oval</Link>
            </li>

            <li key="d" style={{ textDecoration: isDirtRoad ? 'underline' : 'none' }}>
                <Link href={getDisciplineURL('Dirt Road')}>Dirt Road</Link>
            </li>

            <li key="e" style={{ textDecoration: isUnranked ? 'underline' : 'none' }}>
                <Link href={getDisciplineURL('Unranked')}>Unranked</Link>
            </li>
        </ul>
    );
}
