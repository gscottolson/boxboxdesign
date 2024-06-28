import { Metadata } from 'next';
import { PosterSwiper } from './swiper';

export const metadata: Metadata = {
    title: 'Swiper Test',
};

export default function Page() {
    return (
        <>
            <PosterSwiper />
        </>
    );
}
