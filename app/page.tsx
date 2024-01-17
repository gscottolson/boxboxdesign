import Link from 'next/link';
import Image from 'next/image';

import { getSiteTitle as getiRacingSiteTitle } from './site';
import { getDisciplineURL } from './iracing/data/series-util';

export default function Page() {
    const background = 'url(/home/speckled.png), linear-gradient(180deg, #C7BEA610 0%, #A3988880 100%), #E5E3E1';
    const backgroundBlendMode = 'multiply, normal, normal';
    const backgroundSize = '50%';

    return (
        <main
            className="flex min-h-dvh flex-col items-center justify-center gap-16 p-6 text-[#211F1F]"
            style={{ background, backgroundBlendMode, backgroundSize }}
        >
            <Image width={420} height={420} alt="BoxBoxDesign logo" src="/home/boxbox-circle.svg" />

            <div className="flex flex-col items-center justify-center">
                <p className="font-light">Current projects:</p>
                <ul className="font-medium">
                    <li>
                        <Link href={getDisciplineURL('Road')} className=" hover:underline">
                            {getiRacingSiteTitle()}
                        </Link>
                    </li>
                </ul>
            </div>
        </main>
    );
}
