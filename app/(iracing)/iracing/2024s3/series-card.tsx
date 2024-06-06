import Image from 'next/image';
import Balancer from 'react-wrap-balancer';
import Link from 'next/link';
import { License, OfficialSeries } from '../types';
import { getSeriesURL } from '../data/series-util';
import { Open, Fixed } from './icons';
import { CardImage } from './card-image';

interface SeriesCardProps {
    series: OfficialSeries;
    priority: boolean;
}

function getClassCard(licenseClass: License) {
    if (licenseClass === 'Rookie') return 'border-[#DA0229] dark:border-[#FF7373]  border-t-4 shadow-xl';
    if (licenseClass === 'D') return 'border-[#F77600] dark:border-[#FA9352] border-t-4 shadow-xl';
    if (licenseClass === 'C') return 'border-[#F3AF00] dark:border-[#FFE14D] border-t-4 shadow-xl';
    if (licenseClass === 'B') return 'border-[#019751] dark:border-[#80FF85] border-t-4 shadow-xl';
    if (licenseClass === 'A') return 'border-[#064ABD] dark:border-[#66B6FF] border-t-4 shadow-xl';
    return 'shadow-inner';
}

export function SeriesCard({ series, priority }: SeriesCardProps) {
    const size = 240;
    const cardStyles = getClassCard(series.licenseClass || null);
    const iconTitle = series.setup === 'fixed' ? 'Fixed setup' : 'Open setup';
    const hasImage = series.srcLight?.endsWith('png') || series.srcDark?.endsWith('png');

    return (
        <CardWrap series={series}>
            <div className="relative w-responsiveCard text-teal800 md:w-card dark:text-gray-200">
                <div
                    className={`${cardStyles} flex h-[160px] scale-100 flex-col overflow-hidden rounded-sm group-active:scale-card md:h-full`}
                >
                    {hasImage ? <CardImage series={series} priority={priority} /> : <ComingSoon />}
                </div>

                <div className="flex gap-3 px-2 py-2 text-xl md:py-1 md:text-base">
                    <h2 className="basis-full pt-2 leading-5">
                        <Balancer>{series.name}</Balancer>
                    </h2>
                    <div className="w-[20px] pt-2 opacity-75 md:opacity-50" title={iconTitle}>
                        {series.setup === 'open' && <Open />}
                    </div>
                </div>
            </div>
        </CardWrap>
    );
}

function ComingSoon() {
    return (
        <div className="flex h-card select-none items-center justify-center bg-gray700/20 p-4 align-middle leading-loose text-gray-700 dark:bg-gray-500/20 dark:text-gray-400">
            Coming soon
        </div>
    );
}

function CardWrap({ series, children }: { series: OfficialSeries; children: React.ReactNode }) {
    const hasPDF = !!series.pdfLight || !!series.pdfDark;
    if (series.seriesId && hasPDF) {
        return (
            <Link
                href={getSeriesURL(series.seriesId)}
                passHref
                scroll={false}
                className="group" //required to use group-active on nested children
            >
                {children}
            </Link>
        );
    } else {
        return <div>{children}</div>;
    }
}
