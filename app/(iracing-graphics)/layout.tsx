import '@/app/ui/global.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { openSans } from '@/app/fonts';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'iRacing Graphics, Explained | BoxBoxDesign',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="bg-gradient-to-b from-[#9D0728] to-[#810823] bg-fixed  text-white100 antialiased">
            <body className={openSans.className}>
                {children}
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}

// #graphics-layout {
//     margin-left: calc(100vw - 100%);
// }
