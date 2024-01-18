import Image from 'next/image';

import { getSiteTitle as getiRacingSiteTitle } from '../site';
import Balancer from 'react-wrap-balancer';

export default function Page() {
    return (
        <main className="flex min-h-dvh flex-row items-center justify-center bg-[#BDCDD2] bg-siteGradient bg-repeat-x pb-24 text-base leading-[28px] text-[#304F70] lg:flex-col lg:text-xl">
            <div className="mx-8 my-12 max-w-[618px] lg:my-48 lg:max-w-7xl">
                <div className="mb-12 flex flex-col gap-4 lg:mb-24 lg:flex-row lg:gap-[44px]">
                    <div className="h-64 overflow-hidden rounded-sm shadow-2xl lg:h-fit lg:basis-1/2">
                        <Image
                            src="/iracing/poster-grid.png"
                            width={1236 / 2}
                            height={1008 / 2}
                            alt="An image depicting a grid of designed racing posters with one poster being highlighted and lifted out of the grid."
                        />
                    </div>

                    <div className="m-auto flex flex-col lg:basis-1/2 ">
                        <h1 className="pb-[7px] pt-[11px] text-2xl font-light leading-8 lg:text-4xl lg:leading-[56px]">
                            <Balancer>About the iRacing Official Series Posters Project</Balancer>
                        </h1>
                        <div>
                            <p className="pb-[28px] pt-[6px]">
                                I’m Scott. I’m passionate about sim racing and I love using information design to make
                                things more human.
                            </p>
                            <p className="pb-[28px]">
                                Every three months, the online racing service iRacing releases schedules for the
                                official series. These schedules arrive as a bundled collection of Word docs smashed
                                into a PDF. While they are functional, they are not pretty and the design is…lacking.
                            </p>
                            <p>
                                I reworked the layout for each schedule with a goal of making them beautiful and
                                easy-to-read. Most schedules include twelve official weeks, with the track or car (or
                                both) changing every seven days. Important details about the session date / time,
                                weather, and splits are included.{' '}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-[43px] lg:flex-row">
                    <Feature
                        title="The starting grid"
                        src="/iracing/grid-blue.png"
                        altText="Stylied image showing the typographic grid used to during layout for each poster."
                    >
                        Improving the visual rhythm of the schedules involves typesetting on a grid. By aligning the
                        text to an underlying grid, the spacing and cadence feel harmonious.
                    </Feature>

                    <Feature
                        title="The perfect outfit"
                        src="/iracing/outfit.png"
                        altText="An image showing different font weight of the typeface Outfit."
                    >
                        The official schedule posters are set in <span className="font-medium">Outfit</span>, a
                        beautiful typeface with loads of flexibility. Monospace numerals help keep numbers aligned and
                        tidy.
                    </Feature>
                    <Feature
                        title="The upgrade package"
                        src="/iracing/oldvsnew.png"
                        altText="An image showing an unformatted schedule and the poster made using the schedule data."
                    >
                        All the information from the official schedules has been retained. The text in each poster is
                        searchable, so you can quickly find a track or car.
                    </Feature>
                </div>
            </div>
        </main>
    );
}

function Feature(props: { title: string; src: string; altText: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2 lg:basis-1/3 lg:gap-[42px]">
            <div className="relative h-48 w-4/6 min-w-72 items-center overflow-hidden rounded-sm shadow-2xl lg:h-96 lg:w-full">
                <Image className="object-cover object-top" fill src={props.src} alt={props.altText} />
            </div>
            <div className="flex w-full flex-col">
                <h2 className="pb-2 text-xl font-light leading-8 lg:pb-[20px] lg:pt-[8px] lg:text-3xl">
                    {props.title}
                </h2>
                <p>{props.children}</p>
            </div>
        </div>
    );
}
