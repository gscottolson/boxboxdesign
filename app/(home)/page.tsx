import Link from 'next/link';
import Image from 'next/image';
import './page.css';

import { getSiteTitle as getiRacingSiteTitle } from '../site';
import { getDisciplineURL } from '../(iracing)/iracing/data/series-util';

export default function Page() {
    return (
        <main className="flex min-h-dvh flex-col items-center justify-center gap-16 p-6 text-[#304F70]">
            <Image width={420} height={420} alt="BoxBoxDesign logo" src="/home/boxbox-circle.svg" />

            <div className="flex flex-col items-center justify-center text-xl leading-[24px]">
                <p className="pb-2 font-light">Current projects:</p>
                <ul className="pb-16 text-center font-medium">
                    <li>
                        <Link href={getDisciplineURL('Formula', '2024s2')} className="hover:underline">
                            {getiRacingSiteTitle()}
                        </Link>
                    </li>
                </ul>
                <p className="pb-2 font-light">
                    Get in touch:
                    <span id="email" className="pl-2 font-medium">
                        scott<b>nobots</b>@boxbox<b>.nobots</b>.design
                    </span>
                </p>
            </div>
        </main>
    );
}
