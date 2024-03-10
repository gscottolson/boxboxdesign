import Image from 'next/image';
import Balancer from 'react-wrap-balancer';
import Link from 'next/link';
import { License, OfficialSeries } from '../types';
import { getSeriesURL } from '../data/series-util';
import { Open, Fixed } from './icons';

interface SeriesCardProps {
    series: OfficialSeries;
    priority: boolean;
}

function getClassCard(licenseClass: License) {
    if (licenseClass === 'Rookie') return 'border-[#92342E] border-t-4 shadow-xl';
    if (licenseClass === 'D') return 'border-[#F98406] border-t-4 shadow-xl';
    if (licenseClass === 'C') return 'border-[#D3A400] border-t-4 shadow-xl';
    if (licenseClass === 'B') return 'border-[#3C6D56] border-t-4 shadow-xl';
    if (licenseClass === 'A') return 'border-[#315187] border-t-4 shadow-xl';
    return 'shadow-inner';
}

export function SeriesCard({ series, priority }: SeriesCardProps) {
    const size = 240;
    const hasPDF = !!series.pdfLight || !!series.pdfDark;
    const cardStyles = getClassCard(hasPDF ? series.licenseClass : null);
    const iconTitle = series.setup === 'fixed' ? 'Fixed setup' : 'Open setup';

    return (
        <CardWrap series={series}>
            <div className="w-card text-teal800">
                <div
                    className={`${cardStyles} flex scale-100 flex-col overflow-hidden rounded-sm group-active:scale-card`}
                >
                    {!series.src?.endsWith('png') ? (
                        <div className="flex h-card select-none items-center justify-center bg-gray700/20 p-4 align-middle leading-loose text-gray700">
                            Coming soon
                        </div>
                    ) : (
                        <Image
                            style={{ opacity: hasPDF ? 1 : 0.8 }}
                            alt={`stylized image of a schedule poster for ${series.name} on iRacing.com`}
                            src={series.src}
                            width={size}
                            height={size}
                            priority={priority}
                        />
                    )}
                </div>

                <div className="flex gap-3 px-2">
                    <h2 className="basis-full pt-2 leading-5">
                        <Balancer>{series.name}</Balancer>
                    </h2>
                    <div className="w-[20px] pt-2 opacity-50" title={iconTitle}>
                        {series.setup === 'fixed' ? <Fixed /> : <Open />}
                    </div>
                </div>
            </div>
        </CardWrap>
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
