import { Modal } from './modal';
import { SeriesDetail } from '../../../series-detail';
import { getSeriesById } from '@/app/iracing/schedule-list';

export default function Page({ params }: { params: { id: string } }) {
  const [series, resultIndex] = getSeriesById(params.id, {
    limitToDiscipline: true,
  });
  const title = series.name + ' | iRacing 2024S1 Schedule Posters';

  return (
    <Modal title={title} next={resultIndex.next} prev={resultIndex.prev}>
      <SeriesDetail seriesId={params.id} />
    </Modal>
  );
}
