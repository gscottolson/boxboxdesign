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
        <ul className="m-auto flex flex-wrap items-start justify-center gap-2 px-4 pb-12 pt-4 align-middle font-medium uppercase tracking-widest text-gray700 md:w-full md:items-start">
            <Item key="road" discipline="Road" active={isRoad} />
            <Item key="oval" discipline="Oval" active={isOval} />
            <Item key="dirtoval" discipline="Dirt Oval" active={isDirtOval} />
            <Item key="dirtroad" discipline="Dirt Road" active={isDirtRoad} />
            <Item key="unranked" discipline="Unranked" active={isUnranked} />
        </ul>
    );
}

function Item({ discipline, active }: { discipline: Discipline; active: boolean }) {
    const classes = active ? 'text-white100 bg-teal800/50 inner-shadow' : 'hover:bg-teal800/10';
    return (
        <li key="e" className={`${classes} rounded-md px-4 py-1 transition-all`}>
            <Link
                className={active ? 'cursor-default drop-shadow-sm' : 'cursor-pointer'}
                href={active ? '' : getDisciplineURL(discipline)}
            >
                {discipline}
            </Link>
        </li>
    );
}
