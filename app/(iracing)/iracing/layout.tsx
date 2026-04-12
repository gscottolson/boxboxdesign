import '@/app/ui/global.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { outfit } from '@/app/fonts';
import { Providers } from '@/app/providers';
import { UmamiTracker } from '@/app/UmamiTracker';
import { cookies } from 'next/headers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const themeCookie = cookies().get('theme')?.value;
    const dataTheme = themeCookie === 'dark' ? 'dark' : undefined;

    return (
        <html
            suppressHydrationWarning
            lang="en"
            data-theme={dataTheme}
            className="bg-gradient-to-b from-[#D6DDDF] to-[#C9D2D5] bg-fixed text-base font-light leading-[28px] text-teal800 antialiased"
        >
            <head></head>
            <body className={`${outfit.className} w-full`}>
                {/** does next-themes provide the right info? **/}
                <Providers>{children}</Providers>

                <div id="modal-root" />
                {process.env.VERCEL && <SpeedInsights />}
                <UmamiTracker />
            </body>
        </html>
    );
}
