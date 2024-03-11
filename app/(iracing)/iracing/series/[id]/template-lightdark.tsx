import { SeriesDetail } from '../../2024s2/series-detail';
import Link from 'next/link';
import { getSiteTitle } from '@/app/site';
import { Back } from '../../2024s2/icons';
import { BoxBoxDesign } from '@/app/logos';
import { OfficialSeries } from '../../types';
import ModeToggle from '../../2024s2/mode-toggle';

export default function TemplateLightDark({ series, href }: { series: OfficialSeries; href: string }) {
    return (
        <div className="m-auto flex h-full flex-col place-content-center">
            <ModeToggle />

            <div className="mt-20 md:max-h-[640px] md:bg-white400/50 md:shadow-2xl dark:bg-gray-900/80">
                <SeriesDetail series={series} />
            </div>

            <div className="m-auto flex flex-col items-center gap-8 px-4 py-6 subpixel-antialiased md:m-0 md:flex-row md:justify-between md:gap-0 dark:text-gray-100">
                <div className="order-last md:order-none">
                    <Link
                        href={href}
                        className="flex items-center text-sm opacity-50 transition-all ease-in hover:scale-105 hover:opacity-100 md:origin-left md:text-base"
                    >
                        <Back />
                        <div className="ml-2">
                            <span className="opacity-50">Back to&nbsp;</span>
                            {getSiteTitle()}
                        </div>
                    </Link>
                </div>

                {/** Credits **/}
                <div className="text-sm opacity-50 transition-all ease-in hover:scale-105 hover:opacity-100 md:origin-right">
                    <Link className="flex items-center gap-4" href="/" target="_blank">
                        <span className="text-right uppercase tracking-wide text-gray700 dark:text-gray-200">
                            Brought to you by
                        </span>
                        <div className="block dark:hidden">
                            <BoxBoxDesign.DarkHorizontal scale={0.08} />
                        </div>
                        <div className="hidden dark:block">
                            <BoxBoxDesign.LightHorizontal scale={0.08} />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
