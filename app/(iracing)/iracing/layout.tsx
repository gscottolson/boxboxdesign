import '@/app/ui/global.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { outfit } from '@/app/fonts';
import { Providers } from '@/app/providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            suppressHydrationWarning
            lang="en"
            className="bg-gradient-to-b from-[#D6DDDF] to-[#C9D2D5] bg-fixed text-base font-light leading-[28px] text-teal800 antialiased"
        >
            <head>
                <script
                    defer
                    src="https://analytics.us.umami.is/script.js"
                    data-website-id="ea42990e-0591-454e-b494-416a0703ceef"
                ></script>
            </head>
            <body className={`${outfit.className} w-full`}>
                {/** does next-themes provide the right info? **/}
                <Providers>{children}</Providers>

                <div id="modal-root" />
                {/* <Analytics /> */}
                <SpeedInsights />
            </body>
        </html>
    );
}
