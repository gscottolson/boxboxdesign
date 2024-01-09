import Link from 'next/link';
import { Back } from '../../2024s1/icons';
import { SeriesDetail } from '../../2024s1/series-detail';
import { LogoHorizontal } from '@/app/ui/logo';
import { getDisciplineURL, getSeriesById } from '../../schedule-list';
import { Metadata } from 'next';

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
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
        <SeriesDetail series={series} />
      </div>

      <div className="flex justify-between px-4 pt-8 text-blue800 subpixel-antialiased">
        <BackLink href={getDisciplineURL(series.discipline)} />
        <Credits />
      </div>
    </div>
  );
}

function Credits(): React.ReactNode {
  return (
    <div className="origin-right text-sm opacity-50 transition-all ease-in hover:scale-105 hover:opacity-100">
      <Link className="flex items-center gap-2" href="/" target="_blank">
        <span className="uppercase tracking-wide text-gray700">
          Brought to you by
        </span>
        <LogoHorizontal width={200} />
      </Link>
    </div>
  );
}

function BackLink(props: { href: string }): React.ReactNode {
  return (
    <Link
      href={props.href}
      className="flex origin-left items-center opacity-50 transition-all ease-in hover:scale-105 hover:opacity-100"
    >
      <Back />
      <span className="ml-2 opacity-50">Back to&nbsp;</span>iRacing 2024S1
      Schedule Posters
    </Link>
  );
}
