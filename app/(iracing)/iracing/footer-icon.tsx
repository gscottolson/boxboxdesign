import { BoxBoxDesign } from '@/app/logos';

export function FooterIcon() {
    return (
        <div className="flex items-center justify-center gap-12 py-8 opacity-50">
            <hr className="h-[2px] w-1/4 border-none bg-current dark:bg-slate-100" />
            <div className="hidden dark:block">
                <BoxBoxDesign.LightVertical scale={0.1} />
            </div>
            <div className="block dark:hidden">
                <BoxBoxDesign.DarkVertical scale={0.1} />
            </div>
            <hr className="h-[2px] w-1/4 border-none bg-current dark:bg-slate-100" />
        </div>
    );
}
