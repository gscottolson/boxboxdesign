import Link from 'next/link';
import Image from 'next/image';

import { getSiteTitle as getiRacingSiteTitle } from './site';
import { getDisciplineURL } from './iracing/data/series-util';

export default function Page() {
    const background = 'linear-gradient(180deg, #EEF5DA 0%, #DFEDD5 100%), #DFEDD5';

    return (
        <main
            className="flex min-h-dvh flex-col items-center justify-center gap-16 p-6 text-[#304F70]"
            style={{ background }}
        >
            <Image width={420} height={420} alt="BoxBoxDesign logo" src="/home/boxbox-circle.svg" />

            <div className="flex flex-col items-center justify-center text-xl leading-[24px]">
                <p className="pb-2 font-light">Current projects:</p>
                <ul className="text-center font-medium ">
                    <li>
                        <Link href={getDisciplineURL('Road')} className="hover:underline">
                            {getiRacingSiteTitle()}
                        </Link>
                    </li>
                </ul>
            </div>
        </main>
    );
}
