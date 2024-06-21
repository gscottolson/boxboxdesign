import { Metadata } from 'next';
import SwiperView from './swiper';

export const metadata: Metadata = {
    title: 'Swiper Test',
};

export default function Page() {
    return (
        <>
            <SwiperView />
        </>
    );
}
