import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'iOverlay Identity Project',
};

export default function Page() {
    return (
        <div className="m-auto max-w-[1280px] py-16 text-[#484848]">
            <h1 className="mb-8 text-center text-3xl">iOverlay Identity Project</h1>

            <p className="mx-auto mb-16 max-w-[880px] px-[40px] text-xl">
                BoxBoxDesign had the opportunity to work with Joeri at iOverlay on a new identity for his app. iOverlay
                is an informational overlay that works with the popular online racing simulator iRacing. iOverlay
                provides race information in real-time and allows you to see race standings, your race position relative
                to other drivers, track maps, fuel calculators and more.
            </p>

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

            <h2 className="mb-4 mt-8 text-center text-xl">3d explorations</h2>

            <div className="grid grid-flow-row grid-cols-2 gap-[12px]">
                <Image src="/project/ioverlay/closeup.jpg" width={634} height={634} alt="" />
                <Image src="/project/ioverlay/portrait.jpg" width={634} height={634} alt="" />
                <Image className="col-span-2" src="/project/ioverlay/wordmark.jpg" width={1280} height={634} alt="" />
                <Image src="/project/ioverlay/clay001.jpg" width={634} height={634} alt="" />
                <Image src="/project/ioverlay/clay002.jpg" width={634} height={634} alt="" />
                <Image src="/project/ioverlay/isometric.jpg" width={634} height={634} alt="" />
                <Image src="/project/ioverlay/steps.jpg" width={634} height={634} alt="" />
            </div>

            <h2 className="mb-4 mt-8 text-center text-xl">Concept iteration, round 1</h2>

            <p className="mx-auto mb-16 max-w-[880px] px-[40px] text-xl">
                This first collection of ideas was presented as feedback to Joeri on the iOverlay Discord. These were a
                few options to improve legibility of the icon when viewed at small sizes on Windows.
            </p>

            <div className="m-auto max-w-[1050px]">
                <Image
                    src="/project/ioverlay/round001.png"
                    width={1050}
                    height={524}
                    alt="Visual explorations of lowercase i and capital O and the workmark iOverlay."
                />
            </div>

            <h2 className="mb-4 mt-8 text-center text-xl">Concept iteration, round 2</h2>
            <p className="mx-auto mb-16 max-w-[880px] px-[40px] text-xl">
                A second round of ideas based on input from Joeri. Keeping the forms of a lowercase i and uppercase O.
                Exploring ideas like automobile guages, tunnels, eyeballs and translucent layers. Some of these are
                great, many are rough.
            </p>

            <div className="m-auto max-w-[1050px]">
                <Image
                    src="/project/ioverlay/round002.png"
                    width={1050}
                    height={1284}
                    alt="Identity explorations for iOverlay using various black, white and green shapes."
                />
            </div>

            <h2 className="mb-4 mt-8 text-center text-xl">Concept iteration, round 3</h2>
            <p className="mx-auto mb-16 max-w-[880px] px-[40px] text-xl">
                The third round was about refinement and focus. Color steps, green dots, and wordmarks are starting to
                take final form.
            </p>
            <div className="m-auto max-w-[1050px]">
                <Image
                    src="/project/ioverlay/round003.png"
                    width={1050}
                    height={1020}
                    alt="Focused and refined iOverlay logos with monochromatic and color treatments."
                />
            </div>

            <h2 className="mb-4 mt-8 text-center text-xl">Previous identity</h2>
            <p className="mx-auto mb-16 max-w-[880px] px-[40px] text-xl">
                The original art, featuring the classic typeface Snap ITC Std. Retaining the simplicity of black and
                white while keeping the green accents were key considerations during the design process.
            </p>
            <div className="m-auto max-w-[1014px]">
                <Image
                    src="/project/ioverlay/previous.png"
                    width={1014}
                    height={924}
                    alt="Visuals from the previous identity for iOverlay."
                />
            </div>
        </div>
    );
}
