import '@/app/ui/global.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { outfit } from '../fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="bg-[#EEEEEE]">
            <body className={outfit.className}>
                {children}
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
