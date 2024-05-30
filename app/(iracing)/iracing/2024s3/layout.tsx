import { getSiteTitle, getSiteTitleTemplate } from '@/app/site';
import { Metadata } from 'next';
import Balancer from 'react-wrap-balancer';
import ModeToggle from './mode-toggle';

export const metadata: Metadata = {
    title: {
        template: getSiteTitleTemplate(),
        default: getSiteTitle(), // a default is required when creating a template
    },
};

export default function Layout(props: { children: React.ReactNode; modal: React.ReactNode }) {
    return (
        <div className="relative min-h-dvh w-full bg-white200 dark:bg-gray-900">
            <div className="relative flex-grow bg-[#BDCDD2] pt-16 dark:bg-[#282C2D]">
                <ModeToggle />
                <header className="text-center tracking-tighter text-gray700 dark:text-gray-200">
                    <h1 className=" px-10 pt-12 text-4xl font-light leading-none antialiased">
                        <Balancer>{getSiteTitle()}</Balancer>
                    </h1>
                    <h2 className="p-4 pt-0 text-2xl font-light tracking-wide">2024 Season 3</h2>
                </header>

                {props.children}
            </div>

            {props.modal}
        </div>
    );
}
