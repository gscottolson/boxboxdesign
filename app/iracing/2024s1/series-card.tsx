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

  return (
    <Link href={getSeriesURL(series.seriesId)} passHref scroll={false}>
      <div
        className="text-teal800"
        style={{ opacity: series.pdf?.endsWith('pdf') ? 1 : 0.7 }}
      >
        <PosterImage series={series} priority={priority} />

        <div className={`border-t-4 ${seriesBorder} flex min-h-4 flex-col`}>
          <h2 className="basis-full px-6 py-2 text-center leading-5">
            <Balancer>{series.name}</Balancer>
          </h2>
        </div>
      </div>
    </Link>
  );
}

function PosterImage(props: { series: OfficialSeries; priority: boolean }) {
  return !props.series.src ? (
    <div className="flex h-36 items-center justify-center bg-white300 p-4 align-middle leading-loose text-[#999] shadow-inner sm:h-48 lg:h-60">
      Coming soon
    </div>
  ) : (
    <div className="relative h-36 overflow-hidden transition-all sm:h-48 lg:h-60">
      <Image
        className="relative left-[25%] top-[25%] w-[384px] translate-x-[-25%] translate-y-[-25%]"
        alt={`styled image of a schedule poster for ${props.series.name}`}
        src={props.series.src || ''}
        width={384}
        height={384}
        priority={props.priority}
      />
    </div>
  );
}
