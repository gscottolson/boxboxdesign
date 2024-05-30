import { SeriesCard } from './series-card';
import { OfficialSeries } from '../types';
import { Fragment } from 'react';

const DEFAULT_INDEX = 3;

export function Grid2024S3({
    seriesArray,
    childGridIndex = DEFAULT_INDEX,
    children,
}: {
    seriesArray: OfficialSeries[];
    childGridIndex?: number | null;
    children?: React.ReactNode;
}) {
    return !seriesArray ? null : (
        <div className="m-auto flex min-h-[480px] max-w-7xl flex-wrap justify-center gap-6 px-2 pb-12 text-base md:px-8">
            {seriesArray.map((series, index) => (
                <Fragment key={series.name}>
                    <SeriesCard series={series} priority={index < 8} />
                    {childGridIndex && index === childGridIndex && <Fragment key="inject">{children}</Fragment>}
                </Fragment>
            ))}
        </div>
    );
}
