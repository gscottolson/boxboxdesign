import Image from 'next/image';
import { License, OfficialSeries, getSeriesURL } from '../schedule-list';
import Balancer from 'react-wrap-balancer';
import Link from 'next/link';

interface SeriesCardProps {
  series: OfficialSeries;
  priority: boolean;
}

function getLicenseBorder(licenseClass: License) {
  if (licenseClass === 'Rookie') return 'border-rookie';
  if (licenseClass === 'D') return 'border-classD';
  if (licenseClass === 'C') return 'border-classC';
  if (licenseClass === 'B') return 'border-classB';
  if (licenseClass === 'A') return 'border-classA';
  return 'border-transparent';
}

export function SeriesCard({ series, priority }: SeriesCardProps) {
  const size = 240;
  const borderColor = getLicenseBorder(series.licenseClass);
  return (
    <Link
      href={getSeriesURL(series.seriesId)}
      passHref
      scroll={false}
      className="group"
    >
      <div className="w-card text-teal800">
        <div
          className={`border-b-2 ${borderColor} group-active:scale-card flex min-h-4 scale-100 flex-col shadow-xl`}
        >
          {!series.src ? (
            <div className="h-card bg-white400 flex items-center justify-center p-4 align-middle leading-loose text-gray700">
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
        </div>

        <h2 className="basis-full pt-2 text-center leading-5">
          <Balancer>{series.name}</Balancer>
        </h2>
      </div>
    </Link>
  );
}
