import Image from 'next/image';
import Balancer from 'react-wrap-balancer';
import Link from 'next/link';
import { License, OfficialSeries } from '../types';
import { getSeriesURL } from '../data/series-util';

interface SeriesCardProps {
  series: OfficialSeries;
  priority: boolean;
}

function getClassCard(licenseClass: License) {
  if (licenseClass === 'Rookie') return 'border-rookie border-b-2 shadow-xl';
  if (licenseClass === 'D') return 'border-classD border-b-2 shadow-xl';
  if (licenseClass === 'C') return 'border-classC border-b-2 shadow-xl';
  if (licenseClass === 'B') return 'border-classB border-b-2 shadow-xl';
  if (licenseClass === 'A') return 'border-classA border-b-2 shadow-xl';
  return 'shadow-inner';
}

export function SeriesCard({ series, priority }: SeriesCardProps) {
  const size = 240;
  const cardStyles = getClassCard(series.pdf ? series.licenseClass : null);

  return (
    <CardWrap series={series}>
      <div className="w-card text-teal800">
        <div
          className={`${cardStyles} group-active:scale-card flex scale-100 flex-col overflow-hidden rounded-sm`}
        >
          {!series.src?.endsWith('png') ? (
            <div className="h-card flex select-none items-center justify-center bg-gray700/20 p-4 align-middle leading-loose text-gray700">
              Coming soon
            </div>
          ) : (
            <Image
              style={{ opacity: series.pdf === '' ? 0.8 : 1 }}
              alt={`stylized image of a schedule poster for ${series.name} on iRacing.com`}
              src={series.src}
              width={size}
              height={size}
              priority={priority}
            />
          )}
        </div>

        <h2 className="basis-full pt-2 text-center leading-5">
          <Balancer>{series.name}</Balancer>
        </h2>
      </div>
    </CardWrap>
  );
}

function CardWrap({
  series,
  children,
}: {
  series: OfficialSeries;
  children: React.ReactNode;
}) {
  if (series.seriesId && series.pdf) {
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
  }
  return <div>{children}</div>;
}
