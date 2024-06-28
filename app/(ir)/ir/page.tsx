import { Metadata } from 'next';
import { PosterSwiper } from './swiper';
import ModeToggle from '@/app/(iracing)/iracing/2024s3/mode-toggle';

export const metadata: Metadata = {
    title: 'Swiper Test',
};

export default function Page() {
    return (
        <div className="h-full w-full bg-slate-100 dark:bg-slate-950">
            <ModeToggle />
            <div className="flex h-dvh flex-col justify-center">
                <PosterSwiper />
            </div>
        </div>
    );
}
