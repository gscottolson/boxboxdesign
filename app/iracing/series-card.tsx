import Image from 'next/image';
import TestImage from '../../public/test-image.png';
import { OfficialSeries } from './schedule-list';
import Balancer from 'react-wrap-balancer';

export function SeriesCard({ series, priority = false }: { series: OfficialSeries, priority?: boolean }) {
  let color = "";

  switch(series.licenseClass) {
    case 'Rookie': color = "border-[#92342E]"; break;
    case 'D': color = "border-[#F98406]"; break;
    case 'C': color = "border-[#D3A400]"; break;
    case 'B': color = "border-[#3C6D56]"; break;
    default: color = "border-[#315187]";
  }

  return (    
      <div className="text-copy bg-white">
        {series.url || series.src ? <PosterImage series={series} priority={priority} /> : <PosterPlaceholder />}
        <div className={`border-t-4 ${color} min-h-[92px] flex flex-col place-content-center`}>
          <h2 className="p-2 leading-5 text-center basis-full">
            <Balancer>{series.name}</Balancer>
          </h2>
        </div>
      </div>
  );
}

function PosterImage(props: {series: OfficialSeries, priority: boolean}) {
  return (
      <div className="h-36 overflow-hidden sm:h-48 lg:h-60 relative" style={{transition: 'height 300ms ease-in-out'}}>
        <Image
          className="w-[384px] relative left-[25%] top-[25%] translate-x-[-25%] translate-y-[-25%]"
          alt={`styled image of a schedule poster for ${props.series.name}`}
          src={props.series.src || TestImage}
          width={384}
          height={384}
          priority={props.priority}
        />
      </div>
  )
}

function PosterPlaceholder() {
  return (
    <div className="border-8 border-[#CCC] bg-[#DDD] opacity-50">
      <div className="text-[#999] overflow-hidden shadow-inner w-full flex align-middle justify-center leading-loose p-4">
        Coming soon
      </div>
    </div>
  )
}