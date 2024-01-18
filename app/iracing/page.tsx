import Image from 'next/image';
import Link from 'next/link';
import Balancer from 'react-wrap-balancer';
import { getSiteTitle } from '../site';
import { Back, BoxBoxIconOneColor, BuyMeACoffee, Next } from './2024s1/icons';
import { getDisciplineURL } from './data/series-util';

export default function Page() {
    return (
        <main className="flex min-h-dvh flex-col items-center justify-center bg-[#BDCDD2] bg-siteGradient bg-repeat-x text-base font-light leading-[28px] text-teal800 lg:text-xl">
            <div className="mx-12 mt-12 max-w-[618px] lg:mt-24 lg:max-w-7xl">
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
                        <h1 className="pb-[7px] pt-[11px] text-3xl font-light leading-10 lg:text-4xl lg:leading-[56px]">
                            <Balancer>
                                About the <span className="font-normal">{getSiteTitle()}</span> Project
                            </Balancer>
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
                                I reworked the layout for each series with the goal of making beautiful and easy-to-read
                                schedule posters. Most schedules include twelve official weeks, with the track or car
                                (or both) changing every seven days. Important details about the cars, session date,
                                session time, weather, and splits are included.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-[43px] pb-16 lg:flex-row">
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

                <div className="py-24 text-center text-xl font-normal">
                    <BackLink href={getDisciplineURL('Road')} />
                </div>
            </div>

            <div className="w-full bg-white200 px-8 py-16 text-center text-base font-light text-teal800">
                <div className="m-auto max-w-[360px]">
                    <div className="mb-4 flex justify-center opacity-30">
                        <BoxBoxIconOneColor />
                    </div>

                    <p className="mb-2">
                        I'm an iRacing enthusiast, motorsports fan and lover of well-designed information.
                    </p>

                    <p className="mb-8">
                        If you are finding these schedules useful, consider helping me out with a small donation.
                    </p>

                    <div className="m-auto h-16 w-56">
                        <a
                            href="https://www.buymeacoffee.com/boxboxdesign"
                            className="block translate-y-0 rounded-lg border-b-4 border-white300 bg-white100 px-4 py-2 shadow-md active:translate-y-0.5 active:border-b-2 active:shadow-sm"
                        >
                            <BuyMeACoffee />
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}

function Feature(props: { title: string; src: string; altText: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2 lg:basis-1/3 lg:gap-[42px]">
            <div className="relative h-48 w-full min-w-72 items-center overflow-hidden rounded-sm shadow-2xl lg:h-96">
                <Image className="object-cover object-top" fill src={props.src} alt={props.altText} />
            </div>
            <div className="flex w-full flex-col">
                <h2 className="pb-2 pt-4 text-2xl font-light leading-8 lg:pb-[20px] lg:pt-[8px] lg:text-3xl">
                    {props.title}
                </h2>
                <p>{props.children}</p>
            </div>
        </div>
    );
}

function BackLink(props: { href: string }): React.ReactNode {
    return (
        <Link href={props.href} className="inline-flex origin-left cursor-pointer items-center font-normal md:text-xl">
            <div className="ml-2">
                <span className="font-light opacity-75">Browse the&nbsp;</span>
                {getSiteTitle()}
            </div>
            <Next />
        </Link>
    );
}
