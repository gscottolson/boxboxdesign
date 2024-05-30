import Link from 'next/link';
import { UpdatedDiscipline } from '../types';
import { getDisciplineURL } from '../data/series-util';

export function Nav2024S3({ active }: { active: UpdatedDiscipline }) {
    const isFormula = active === 'Formula';
    const isSportsCar = active === 'Sports Car';
    const isOval = active === 'Oval';
    const isDirtOval = active === 'Dirt Oval';
    const isDirtRoad = active === 'Dirt Road';
    const isUnranked = active === 'Unranked';

    return (
        <ul className=" m-auto flex max-w-3xl flex-wrap items-start justify-center gap-2 px-4 pb-12 pt-4 align-middle text-base font-medium uppercase tracking-widest text-gray700 md:w-full md:items-start dark:text-gray-300">
            <Item key="formula" label="Formula" active={isFormula} />
            <Item key="sportscar" label="Sports Car" active={isSportsCar} />
            <Item key="oval" label="Oval" active={isOval} />
            <Item key="dirtoval" label="Dirt Oval" active={isDirtOval} />
            <Item key="dirtroad" label="Dirt Road" active={isDirtRoad} />
            <Item key="unranked" label="Unranked" active={isUnranked} />
            <Item key="about" label="About the project" />
        </ul>
    );
}

function Item({
    label,
    active,
    url,
}: {
    label: UpdatedDiscipline | 'About the project';
    active?: boolean;
    url?: string;
}) {
    const classes = active
        ? 'text-gray-100 bg-teal800/50 dark:bg-gray-900/50 inner-shadow cursor-default drop-shadow-sm'
        : 'hover:bg-teal800/10 cursor-pointer';
    const itemURL = label === 'About the project' ? '/iracing' : url || getDisciplineURL(label, '2024s3'); // otherwise set it to the provided URL or the mapped discipline URL
    return (
        <li>
            <Link className={`${classes} whitespace-nowrap rounded-md px-4 py-1 transition-all`} href={itemURL}>
                {label}
            </Link>
        </li>
    );
}
