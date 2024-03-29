import { BoxBoxDesign } from '@/app/logos';
import { BuyMeACoffee } from './icons';

export function Donate() {
    return (
        <div className="bg-white200 px-8 py-16 text-center text-base font-light text-teal800">
            <div className="m-auto max-w-[360px]">
                <div className="mb-8 mt-2 flex justify-center opacity-75">
                    <BoxBoxDesign.DarkVertical scale={0.1} />
                </div>

                <p className="mb-2 font-medium">Hello, I’m Scott…</p>

                <p className="mb-2">
                    iRacing enthusiast, motorsports fan and lover of well-designed information. I’m a one-man pit crew
                    over here at BoxBoxDesign.
                </p>

                <p className="mb-8">If you are finding these schedules useful, help me out with a small donation.</p>

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
    );
}
