import '@/app/ui/global.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { outfit } from '@/app/fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            lang="en"
            className="bg-gradient-to-b from-[#D6DDDF] to-[#C9D2D5] bg-fixed text-base font-light leading-[28px] text-teal800 antialiased lg:text-xl"
        >
            <body className={outfit.className}>
                {children}

                <div id="modal-root" />
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
