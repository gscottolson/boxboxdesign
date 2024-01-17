import '@/app/ui/global.css';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const outfit = localFont({ src: '../public/Outfit-VariableFont_wght.ttf' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`flex flex-col ${outfit.className} relative min-h-dvh w-full antialiased`} id="site-body">
                {children}
                <div id="modal-root" />

                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
