import { getSiteTitle, getSiteTitleTemplate } from '@/app/site';
import { Metadata } from 'next';
import Link from 'next/link';
import Balancer from 'react-wrap-balancer';
import { getDisciplineURL } from '../data/series-util';

export const metadata: Metadata = {
    title: {
        template: getSiteTitleTemplate(),
        default: getSiteTitle(), // a default is required when creating a template
    },
};

export default function Layout(props: { children: React.ReactNode; modal: React.ReactNode }) {
    return (
        <div className="relative min-h-dvh w-full bg-white200">
            <div className="flex-grow bg-[#BDCDD2]">
                <header className="text-center tracking-tighter text-gray700">
                    <div className="bg-slate-100 px-24 pb-6 pt-6 leading-[1.2] tracking-wider">
                        <Balancer>
                            You are viewing schedules for 2024 season 2, a past season of iRacing. The current set is{' '}
                            <Link className="font-medium text-slate-400" href={getDisciplineURL('Formula', '2024s3')}>
                                2024 season 3
                            </Link>
                            .
                        </Balancer>
                    </div>
                    <h1 className=" px-10 pt-12 text-4xl font-light leading-none antialiased">
                        <Balancer>{getSiteTitle()}</Balancer>
                    </h1>
                    <h2 className="p-4 pt-0 text-2xl font-light tracking-wide">2024 Season 1</h2>
                </header>

                {props.children}
            </div>

            {props.modal}
        </div>
    );
}
