import { Modal } from './modal';
import { SeriesDetail } from '../../../series-detail';
import { getSeriesById } from '@/app/iracing/schedule-list';
import { getSiteTitle } from '@/app/site';

export default function Page({ params }: { params: { id: string } }) {
  const [series, resultIndex] = getSeriesById(params.id, {
    limitToDiscipline: true,
  });
  const title = getSiteTitle(series.name);
  return (
    <Modal title={title} next={resultIndex.next} prev={resultIndex.prev}>
      <SeriesDetail series={series} />
    </Modal>
  );
}
