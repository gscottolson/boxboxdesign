import { BoxBoxDesign } from '../../logos';

export default function Page() {
    return (
        <main className="flex min-h-dvh flex-col items-center justify-center gap-16 p-6 text-[#304F70]">
            <BoxBoxDesign.DarkWordmark scale={0.15} fillColor="#2B3C59" />
            <BoxBoxDesign.DarkHorizontal scale={0.15} fillColor="#2B3C59" />
            <BoxBoxDesign.DarkVertical scale={0.15} fillColor="#2B3C59" />
            <BoxBoxDesign.DarkIcon scale={0.15} fillColor="#2B3C59" />

            <div className="bg-[#2B3C59] p-4">
                <BoxBoxDesign.LightWordmark scale={0.15} />
            </div>

            <div className="bg-[#2B3C59] p-4">
                <BoxBoxDesign.LightHorizontal scale={0.15} />
            </div>

            <div className="bg-[#2B3C59] p-4">
                <BoxBoxDesign.LightVertical scale={0.15} />
            </div>

            <div className="bg-[#2B3C59] p-4">
                <BoxBoxDesign.LightIcon scale={0.15} />
            </div>
        </main>
    );
}
