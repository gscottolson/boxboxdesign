import '@/app/ui/global.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { outfit } from '../fonts';
import { UmamiTracker } from '../UmamiTracker';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="bg-gradient-to-b from-[#EEF5DA] to-[#DFEDD5] bg-fixed antialiased">
            <head></head>
            <body className={outfit.className}>
                {children}
                <SpeedInsights />
                <UmamiTracker />
            </body>
        </html>
    );
}
