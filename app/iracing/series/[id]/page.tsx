import Link from 'next/link';
import { Back } from '../../2024s1/icons';
import { SeriesDetail } from '../../2024s1/series-detail';
import { LogoHorizontal } from '@/app/ui/logo';
import { getRoadSeriesById } from '../../schedule-list';
import { Router } from 'next/router';

export function generateMetadata({ params }: { params: { id: string } }) {
  const series = getRoadSeriesById(params.id);
  return {
    title: series.name,
  };
}

export default function Page({ params }: { params: { id: string } }) {
  const series = getRoadSeriesById(params.id);
  if (series.isEmpty) {
    return <p>404</p>;
  }

  return (
    <div className="m-auto flex h-full max-w-[800px] flex-col place-content-center">

      <div className="pb-4 text-sm ">
          <Credits />
      </div>

      <div className="max-h-[640px] shadow-2xl">
        <SeriesDetail seriesId={params.id} />
      </div>

      <div className="flex justify-center pt-4 text-blue800">
        <BackLink />
      </div>

    </div>
  );
}

function Credits(): React.ReactNode {
  return (
    <div className="flex place-content-center gap-4 uppercase tracking-[.3em] text-gray700">
      <span>Brought to you by </span>
      <Link href="/" target="_blank">
        <LogoHorizontal width={200} height="auto" />
      </Link>
      <span>Established 2023</span>
    </div>
  );
}

function BackLink(): React.ReactNode {
    return (
        <Link href="/iracing/2024s1/road/" className="flex items-center">
            <Back />
            <span className="ml-2 opacity-50">Back to&nbsp;</span>iRacing 2024S1 Schedule Posters
        </Link>
    )
}