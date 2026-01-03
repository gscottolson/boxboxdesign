import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

import './page.css';

import { getSiteTitle as getiRacingSiteTitle } from '../site';
import { getDisciplineURL as getPostersURL } from '../(iracing)/iracing/data/series-util';
import LogoIcon from './logo-icon';
import LogoText from './logo-text';

export const metadata: Metadata = {
    title: 'BoxBoxDesign, makers of fine digital goods',
};

export default function Page() {
    const formatDate = () => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    return (
        <div className="overflow-x-hidden">
            <main className="flex min-h-dvh flex-col items-center justify-center text-[#304F70] lg:flex-row lg:gap-16">
                <header className="relative flex w-[282px] flex-col items-center justify-center gap-0 pr-[14px] font-thin uppercase">
                    <div className="init-sequence text-right"></div>

                    <div className="flex flex-col items-end">
                        <LogoIcon />

                        <div className="flex h-12 items-center justify-end">
                            <LogoText className="w-[230px]" />
                        </div>
                        <p className="text-right font-medium">Makers of fine digital goods</p>
                        <p>{formatDate()}</p>
                    </div>
                    <div className="footer-sequence relative w-full text-right"></div>
                </header>

                <nav className="text-l flex w-auto flex-col justify-start pb-6">
                    <p className="pb-2 pl-8 pt-0 font-semibold uppercase tracking-[0.15em] lg:pt-48">Projects</p>
                    <ul className="flex flex-col justify-center gap-4 px-8 font-medium sm:flex-row">
                        <li className="w-auto">
                            <Link
                                href={getPostersURL('Formula', '2024s3')}
                                className="inline-block"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <div className="image-container relative inline-block opacity-75 mix-blend-multiply transition-opacity duration-500 ease-in-out hover:opacity-85">
                                    <Image
                                        src="/home/posters-hover.png"
                                        width="280"
                                        height="136"
                                        alt="{getiRacingSiteTitle()}"
                                        className="gb-image relative h-auto opacity-50 brightness-[300%] contrast-[120%] saturate-0"
                                    />
                                    <div className="image-overlay absolute left-0 top-0 h-full w-full bg-[#1a575a] opacity-100 mix-blend-soft-light" />
                                </div>
                                <p className="project-link-text pt-2 text-left font-light uppercase leading-[1.1] hover:border-b hover:border-b-[0.5px] hover:border-[#9bb0a4]">
                                    {getiRacingSiteTitle()}
                                </p>
                            </Link>
                        </li>
                        <li className="w-auto">
                            <Link href="/ioverlay" className="inline-block" target="_blank" rel="noopener noreferrer">
                                <div className="image-container relative inline-block opacity-75 mix-blend-multiply transition-opacity duration-500 ease-in-out hover:opacity-85">
                                    <Image
                                        width="280"
                                        height="136"
                                        alt="iOverlay composition"
                                        src="/home/ioverlay-hover.png"
                                        className="ioverlay-image relative h-auto opacity-50 brightness-[120%] contrast-[90%] saturate-0"
                                    />
                                    <div className="image-overlay absolute left-0 top-0 h-full w-full bg-[#1a575a] opacity-100 mix-blend-soft-light" />
                                </div>
                                <p className="project-link-text pt-2 text-left font-light uppercase leading-[1.1] hover:border-b-[0.5px] hover:border-[#9bb0a4]">
                                    iOverlay
                                </p>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </main>
            <footer className="w-full overflow-x-hidden px-4 pb-8 pt-8 text-center font-light uppercase tracking-[0.15em]">
                <span className="whitespace-nowrap font-medium text-[#9bb0a4]">Get in touch</span>
                <span id="email" className="whitespace-nowrap pl-4">
                    scott<b>nobots</b>
                    <span className="text-xl font-medium text-[#9bb0a4]">@</span>boxbox<b>.nobots</b>.design
                </span>
            </footer>
        </div>
    );
}
