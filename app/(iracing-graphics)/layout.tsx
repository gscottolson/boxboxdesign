import '@/app/ui/global.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { openSans } from '@/app/fonts';
import { Metadata } from 'next';
import { UmamiTracker } from '../UmamiTracker';

export const metadata: Metadata = {
    title: 'iRacing Graphics, Explained | BoxBoxDesign',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="bg-gradient-to-b from-[#9D0728] to-[#810823] bg-fixed  text-white100 antialiased">
            <head></head>
            <body className={openSans.className}>
                {children}
                <SpeedInsights />
                <UmamiTracker />
            </body>
        </html>
    );
}
