import { BoxBoxIconOneColor, BuyMeACoffee } from './icons';

export function Donate() {
    return (
        <div className="bg-white200 px-8 py-16 text-center text-base font-light text-teal800">
            <div className="m-auto max-w-[360px]">
                <div className="mb-4 flex justify-center opacity-30">
                    <BoxBoxIconOneColor />
                </div>
                <p className="mb-4 font-medium">Hello, I’m Scott…</p>

                <p className="mb-2">iRacing enthusiast, motorsports fan and lover of well-designed information.</p>

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
    );
}
