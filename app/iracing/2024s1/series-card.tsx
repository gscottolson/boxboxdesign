import Image from 'next/image';
import { OfficialSeries, getSeriesURL } from '../schedule-list';
import Balancer from 'react-wrap-balancer';
import Link from 'next/link';

interface SeriesCardProps {
  series: OfficialSeries;
  priority: boolean;
}

export function SeriesCard({ series, priority }: SeriesCardProps) {
  const borderColor = {
    Rookie: 'border-[#92342E]',
    D: 'border-[#F98406]',
    C: 'border-[#D3A400]',
    B: 'border-[#3C6D56]',
    A: 'border-[#315187]',
    none: 'border-transparent',
  };

  const seriesBorder = borderColor[series.licenseClass || 'none'];
  const size = 240;

  return (
    <Link href={getSeriesURL(series.seriesId)} passHref scroll={false}>
      <div className="w-card text-teal800">
        {!series.src ? (
          <div className="h-card flex items-center justify-center bg-white300 p-4 align-middle leading-loose text-gray700">
            Coming soon
          </div>
        ) : (
          <Image
            alt={`styled image of a schedule poster for ${series.name}`}
            src={series.src}
            width={size}
            height={size}
            priority={priority}
          />
        )}

        <div
          className={`border-t-4 ${seriesBorder} flex min-h-4 flex-col px-6 `}
        >
          <h2 className="basis-full pt-2 text-center leading-5">
            <Balancer>{series.name}</Balancer>
          </h2>
        </div>
      </div>
    </Link>
  );
}
