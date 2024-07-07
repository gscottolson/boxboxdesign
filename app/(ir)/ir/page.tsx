import { Metadata } from 'next';
import ModeToggle from '@/app/(iracing)/iracing/2024s3/mode-toggle';
import { SeasonFilter } from './season-filter';

export const metadata: Metadata = {
    title: 'Swiper Test',
};

export default function Page() {
    return (
        <div className="h-full w-full bg-[rgb(230,228,226)] dark:bg-stone-700">
            <ModeToggle />
            <SeasonFilter />
        </div>
    );
}
