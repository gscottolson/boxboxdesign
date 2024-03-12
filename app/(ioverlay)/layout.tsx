import '@/app/ui/global.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { outfit } from '../fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="bg-[#EEEEEE]">
            <head>
                <script
                    defer
                    src="https://analytics.us.umami.is/script.js"
                    data-website-id="ea42990e-0591-454e-b494-416a0703ceef"
                ></script>
            </head>
            <body className={outfit.className}>
                {children}
                {/* <Analytics /> */}
                <SpeedInsights />
            </body>
        </html>
    );
}
