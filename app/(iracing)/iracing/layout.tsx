import '@/app/ui/global.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { outfit } from '@/app/fonts';
import { Providers } from '@/app/providers';
import { UmamiTracker } from '@/app/UmamiTracker';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            suppressHydrationWarning
            lang="en"
            className="bg-gradient-to-b from-[#D6DDDF] to-[#C9D2D5] bg-fixed text-base font-light leading-[28px] text-teal800 antialiased"
        >
            <head></head>
            <body className={`${outfit.className} w-full`}>
                {/** does next-themes provide the right info? **/}
                <Providers>{children}</Providers>

                <div id="modal-root" />
                <SpeedInsights />
                <UmamiTracker />
            </body>
        </html>
    );
}
