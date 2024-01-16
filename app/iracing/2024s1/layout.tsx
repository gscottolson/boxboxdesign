import { getSiteTitle, getSiteTitleTemplate } from '@/app/site';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        template: getSiteTitleTemplate(),
        default: getSiteTitle(), // a default is required when creating a template
    },
};

export default function Layout(props: { children: React.ReactNode; modal: React.ReactNode }) {
    return (
        <div className="relative lg:pt-16">
            <div className="flex-grow">
                <header className="text-center tracking-tighter text-gray700">
                    <h1 className=" pt-12 text-4xl font-light leading-none antialiased">{getSiteTitle()}</h1>
                    <h2 className="p-4 pt-0 text-2xl font-light tracking-wide">2024 Season 1</h2>
                </header>

                {props.children}
            </div>

            {props.modal}
        </div>
    );
}
