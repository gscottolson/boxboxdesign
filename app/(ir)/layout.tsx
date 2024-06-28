import '@/app/ui/global.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { outfit } from '@/app/fonts';
import { UmamiTracker } from '@/app/UmamiTracker';
import { Providers } from '@/app/providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head></head>
            <body className={outfit.className}>
                <Providers>{children}</Providers>
                <SpeedInsights />
                <UmamiTracker />
            </body>
        </html>
    );
}
