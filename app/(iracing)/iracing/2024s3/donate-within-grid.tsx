import { BuyMeACoffee } from './icons';

export function DonateWithinGrid() {
    return (
        <div className="group mx-24 w-2/3 rounded-2xl bg-white300 px-8 py-16 text-center text-base font-light text-teal800 dark:bg-gray-950 dark:text-gray-400">
            <div className="m-auto text-xl">
                <p className="m-auto mb-8 w-[70%] max-w-[560px]">
                    Hello. <span className="font-medium"> I’m Scott</span>, a one-man pit crew at BoxBoxDesign.
                    <span className="font-medium"> Please donate</span> to help keep these schedules free.
                </p>
                <div className="m-auto h-16 w-56 text-[#32545B] hover:text-gray-950 dark:text-gray-300 hover:dark:text-gray-100">
                    <a
                        href="https://www.buymeacoffee.com/boxboxdesign"
                        className="block translate-y-0 scale-90 rounded-lg border-b-4 border-white300 bg-white100 px-4 py-2 shadow-md transition-transform focus:scale-100 active:translate-y-0.5 active:border-b-2 active:shadow-sm group-hover:scale-100 dark:border-[#222222] dark:bg-[#333333]"
                    >
                        <BuyMeACoffee />
                    </a>
                </div>
            </div>
        </div>
    );
}
