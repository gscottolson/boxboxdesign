'use client';

import { Modal } from './modal';
import { SeriesDetail } from '../../../series-detail';

export default function Page( {params}: { params: { id: string } }) {
  return (
    <Modal>
        <SeriesDetail seriesId={params.id} />
    </Modal>
  );
}