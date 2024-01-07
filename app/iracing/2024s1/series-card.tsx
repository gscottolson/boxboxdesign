import Image from 'next/image';
import { OfficialSeries } from '../schedule-list';
import Balancer from 'react-wrap-balancer';
import Link from 'next/link';

interface SeriesCardProps {
  series: OfficialSeries
  priority: boolean
}

export function SeriesCard(props: SeriesCardProps) {
  const borderColor = {
    Rookie: 'border-[#92342E]',
    D: "border-[#F98406]",
    C: "border-[#D3A400]",
    B: "border-[#3C6D56]",
    A: "border-[#315187]",
  }

  return (
      <Link href={props.series.seriesId ? `/iracing/series/${props.series.seriesId}` : ''} passHref scroll={false}>
        <div className="teal800 bg-white" style={{opacity: props.series.pdf?.endsWith('pdf') ? 1 : 0.2}}>
          {props.series.src ? 
            <PosterImage series={props.series} priority={props.priority} /> :
            <div className="bg-white300 text-[#999] shadow-inner w-full flex align-middle justify-center leading-loose p-4">
              Coming soon
            </div>
          }
          <div className={`border-t-4 ${borderColor[props.series.licenseClass]} min-h-[92px] flex flex-col place-content-center`}>
            <h2 className="p-2 leading-5 text-center basis-full">
              <Balancer>{props.series.name}</Balancer>
            </h2>
          </div>
        </div>
      </Link>  
  );
}

function PosterImage(props: {series: OfficialSeries, priority: boolean}) {
  return (
      <div className="h-36 overflow-hidden sm:h-48 lg:h-60 relative" style={{transition: 'height 300ms ease-in-out'}}>
        <Image
          className="w-[384px] relative left-[25%] top-[25%] translate-x-[-25%] translate-y-[-25%]"
          alt={`styled image of a schedule poster for ${props.series.name}`}
          src={props.series.src || ''}
          width={384}
          height={384}
          priority={props.priority}
        />
      </div>
  )
}