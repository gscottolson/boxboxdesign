import Link from 'next/link';
import { Back } from '../../2024s1/icons';
import { SeriesDetail } from '../../2024s1/series-detail';
import { LogoHorizontal } from '@/app/ui/logo';
import { getSeriesById } from '../../schedule-list';
import { Metadata } from 'next';

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const [series] = getSeriesById(params.id);
  return {
    title: series.name,
  };
}

export default function Page({ params }: { params: { id: string } }) {
  const [series] = getSeriesById(params.id);
  if (series.isEmpty) {
    return <p>404</p>;
  }

  return (
    <div className="m-auto flex h-full max-w-[800px] flex-col place-content-center">

      <div className="max-h-[640px] shadow-2xl">
        <SeriesDetail seriesId={params.id} />
      </div>

      <div className="flex justify-between pt-8 px-4 text-blue800 subpixel-antialiased">
        <BackLink />
        <Credits />
      </div>

    </div>
  );
}

function Credits(): React.ReactNode {
  return (
    <div className="text-sm opacity-50 hover:scale-105 hover:opacity-100 origin-right transition-all ease-in">
      <Link className="flex items-center gap-2" href="/" target="_blank">
        <span className="uppercase tracking-wide text-gray700">Brought to you by</span>
        <LogoHorizontal width={200} />
      </Link>
    </div>
  );
}

function BackLink(): React.ReactNode {
    return (
        <Link href="/iracing/2024s1/road/" className="flex items-center opacity-50 hover:scale-105 hover:opacity-100 origin-left transition-all ease-in">
            <Back />
            <span className="ml-2 opacity-50">Back to&nbsp;</span>iRacing 2024S1 Schedule Posters
        </Link>
    )
}