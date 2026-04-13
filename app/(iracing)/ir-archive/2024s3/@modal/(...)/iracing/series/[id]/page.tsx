import { Modal } from './modal';
import { SeriesDetail } from '../../../../../series-detail';
import { getSiteTitle } from '@/app/site';
import { getSeriesById } from '@/app/(iracing)/iracing/data/series-util';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [series, resultIndex] = getSeriesById(id, {
        limitToDiscipline: true,
    });
    const title = getSiteTitle(series.name);
    return (
        <Modal title={title} next={resultIndex.next} prev={resultIndex.prev}>
            <SeriesDetail series={series} />
        </Modal>
    );
}
