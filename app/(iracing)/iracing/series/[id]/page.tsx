import { getDisciplineURL, getSeriesById, getAllForBuildPaths, getSeriesURL } from '../../data/series-util';
import { Metadata } from 'next';
import { getDetailTitle, getSiteTitle } from '@/app/site';
import { notFound } from 'next/navigation';
import { TemplateMono } from './template-mono';
import { TemplateLightDark } from './template-lightdark';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const [series] = getSeriesById(id);
    const description = `https://boxbox.design/${series.srcDark}`;
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
        metadataBase: new URL('https://boxbox.design'),
        openGraph: {
            title,
            description,
            url: getSeriesURL(series.seriesId),
            siteName: getSiteTitle(),
            images: [
                {
                    url: `https://boxbox.design/${series.srcDark}`, // Must be an absolute URL
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
            images: [`https://boxbox.design/${series.srcDark}`], // Must be an absolute URL
        },
    };
}

export const dynamicParams = false;
export function generateStaticParams() {
    return getAllForBuildPaths().map((series) => {
        return series.seriesId ? { id: series.seriesId } : null;
    });
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const result = getSeriesById(id);
    const series = result[0];
    const { season } = series;
    const href = getDisciplineURL(series.discipline, season);

    if (series.isEmpty) {
        notFound();
    } else if (season === '2024s1') {
        return <TemplateMono series={series} href={href} />;
    } else {
        return <TemplateLightDark series={series} href={href} />;
    }
}
