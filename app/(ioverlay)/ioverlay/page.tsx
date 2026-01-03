import Image from 'next/image';
import { Metadata } from 'next';
import Link from 'next/link';
import LogoText from '../../(home)/logo-text';

export const metadata: Metadata = {
    title: 'iOverlay Identity Project',
};

export default function Page() {
    return (
        <div>
            <div className="m-auto max-w-[1280px] py-16 text-xl text-[#484848]">
                <ContentWrap>
                    <h1 className="mb-1 text-3xl leading-snug">iOverlay Identity Project</h1>
                    <h2 className="mb-8 text-2xl uppercase">Fall 2023</h2>
                    <p className="mb-16">
                        BoxBoxDesign partnered with Joeri to develop a new visual identity for iOverlay, a real-time
                        informational overlay app for the iRacing simulator. iOverlay displays race standings,
                        positional data, track maps, fuel calculations, and other live race metrics.
                    </p>
                </ContentWrap>

                <Image
                    src="/project/ioverlay/ioverlay-dark.png"
                    width={1280}
                    height={700}
                    alt="iOverlay identity on a dark background"
                />
                <Image
                    src="/project/ioverlay/ioverlay-light.png"
                    width={1280}
                    height={700}
                    alt="iOverlay identity on a light background"
                />
                <Image
                    src="/project/ioverlay/windows-icon.jpg"
                    width={1280}
                    height={640}
                    alt="iOverlay search results in Windows OS"
                />

                <ContentWrap>
                    <h2 className="mb-4 mt-32 text-2xl font-medium uppercase">3d explorations</h2>
                    <p className="mb-16">Refining an understanding of how form influences emotional tone.</p>
                </ContentWrap>
                <div className="grid grid-flow-row grid-cols-2 gap-[12px]">
                    <Image src="/project/ioverlay/closeup.jpg" width={634} height={634} alt="" />
                    <Image src="/project/ioverlay/portrait.jpg" width={634} height={634} alt="" />
                    <Image
                        className="col-span-2"
                        src="/project/ioverlay/wordmark.jpg"
                        width={1280}
                        height={634}
                        alt=""
                    />
                    <Image src="/project/ioverlay/clay001.jpg" width={634} height={634} alt="" />
                    <Image src="/project/ioverlay/clay002.jpg" width={634} height={634} alt="" />
                    <Image src="/project/ioverlay/isometric.jpg" width={634} height={634} alt="" />
                    <Image src="/project/ioverlay/steps.jpg" width={634} height={634} alt="" />
                </div>

                <ContentWrap>
                    <h2 className="mb-4 mt-32 text-2xl font-medium uppercase">Round 1: Initial concepts</h2>

                    <p className="mb-16">
                        Early logo explorations focused on improving icon legibility at small sizes on Windows.
                    </p>
                </ContentWrap>

                <div className="m-auto max-w-[1050px]">
                    <Image
                        src="/project/ioverlay/round001.png"
                        width={1050}
                        height={524}
                        alt="Visual explorations of lowercase i and capital O and the workmark iOverlay."
                    />
                </div>

                <ContentWrap>
                    <h2 className="mb-4 mt-32 text-2xl font-medium uppercase">Round 2: Refined ideas</h2>
                    <p className="mx-auto mb-16">
                        Based on feedback from the iOverlay Discord community, we refined the lowercase “i” and
                        uppercase “O,” and explored visual motifs inspired by automotive gauges, tunnels, eyes, and
                        layered transparencies.
                    </p>
                </ContentWrap>

                <div className="m-auto max-w-[1050px]">
                    <Image
                        src="/project/ioverlay/round002.png"
                        width={1050}
                        height={1284}
                        alt="Identity explorations for iOverlay using various black, white and green shapes."
                    />
                </div>

                <ContentWrap>
                    <h2 className="mb-4 mt-32 text-2xl font-medium uppercase">Round 3: Final development</h2>
                    <p className="mx-auto mb-16">
                        In the final stage, we sharpened the forms, introduced color steps and accent dots, and
                        finalized wordmark treatments.
                    </p>
                </ContentWrap>

                <div className="m-auto max-w-[1050px]">
                    <Image
                        src="/project/ioverlay/round003.png"
                        width={1050}
                        height={1020}
                        alt="Focused and refined iOverlay logos with monochromatic and color treatments."
                    />
                </div>

                <ContentWrap>
                    <h2 className="mb-4 mt-32 text-2xl font-medium uppercase">Previous identity</h2>
                    <p className="mx-auto mb-16">
                        The original logo used a simple black-and-white palette with green accents and the Snap ITC Std
                        typeface. Our redesign builds on that simplicity while enhancing clarity and visual cohesion.
                    </p>
                </ContentWrap>
                <div className="m-auto max-w-[1014px]">
                    <Image
                        src="/project/ioverlay/previous.png"
                        width={1014}
                        height={924}
                        alt="Visuals from the previous identity for iOverlay."
                    />
                </div>
            </div>
            <footer className="mt-24 bg-[#E4EDE6] py-20 text-center font-light uppercase tracking-[0.15em]">
                <Link
                    href="/"
                    className="mt-8 flex items-center justify-center gap-2 text-xl text-slate-500 opacity-50 transition-opacity duration-150 hover:opacity-100"
                >
                    ← Back to <LogoText className="h-5 w-44 " />
                </Link>
            </footer>
        </div>
    );
}

const ContentWrap = ({ children }: { children: React.ReactNode }) => {
    return <div className="mx-auto mb-8 max-w-[880px] px-[40px]">{children}</div>;
};
