import Link from 'next/link';
import { Back } from '../../2024s1/icons';
import { SeriesDetail } from '../../2024s1/series-detail';
import { LogoHorizontal } from '@/app/ui/logo';
import { getDisciplineURL, getSeriesById, getAll, getSeriesURL } from '../../data/series-util';
import { Metadata } from 'next';
import { getDetailTitle, getSiteTitle } from '@/app/site';
import { notFound } from 'next/navigation';

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
    const [series] = getSeriesById(params.id);
    const description = `https://boxbox.design/${series.src}`;
    const title = getDetailTitle(series.name);
    return {
        title,
        description,
        keywords: ['iRacing', 'official series', 'race schedule'],
        creator: 'G. Scott Olson',
        publisher: 'G. Scott Olson',
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        openGraph: {
            title,
            description,
            url: getSeriesURL(series.seriesId),
            siteName: getSiteTitle(),
            images: [
                {
                    url: `https://boxbox.design/${series.src}`, // Must be an absolute URL
                    width: 480,
                    height: 480,
                },
            ],
            locale: 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            siteId: '15408255',
            creator: '@gscottolson',
            creatorId: '15408255',
            images: [`https://boxbox.design/${series.src}`], // Must be an absolute URL
        },
    };
}

export const dynamicParams = false;
export function generateStaticParams() {
    return getAll().map((series) => {
        return series.seriesId ? { id: series.seriesId } : null;
    });
}

export default function Page({ params }: { params: { id: string } }) {
    const [series] = getSeriesById(params.id);

    if (series.isEmpty) {
        notFound();
    }

    return (
        <div className="m-auto flex h-full max-w-[800px] flex-col place-content-center">
            <div className="mt-20 md:max-h-[640px] md:bg-white400/50 md:shadow-2xl">
                <SeriesDetail series={series} />
            </div>

            <div className="m-auto flex flex-col items-center gap-8 px-4 pt-6 text-blue800 subpixel-antialiased md:m-0 md:flex-row md:justify-between md:gap-0">
                <BackLink href={getDisciplineURL(series.discipline)} />
                <Credits />
            </div>
        </div>
    );
}

function Credits(): React.ReactNode {
    return (
        <div className="text-sm opacity-50 transition-all ease-in hover:scale-105 hover:opacity-100 md:origin-right">
            <Link className="flex items-center gap-4" href="/" target="_blank">
                <span className="text-right uppercase tracking-wide text-gray700">Brought to you by</span>
                <LogoHorizontal width={200} />
            </Link>
        </div>
    );
}

function BackLink(props: { href: string }): React.ReactNode {
    return (
        <div className="order-last md:order-none">
            <Link
                href={props.href}
                className="flex items-center text-sm opacity-50 transition-all ease-in hover:scale-105 hover:opacity-100 md:origin-left md:text-base"
            >
                <Back />
                <div className="ml-2">
                    <span className="opacity-50">Back to&nbsp;</span>
                    {getSiteTitle()}
                </div>
            </Link>
        </div>
    );
}
