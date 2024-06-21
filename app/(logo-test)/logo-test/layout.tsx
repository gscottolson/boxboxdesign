import '@/app/ui/global.css';
import { UmamiTracker } from '@/app/UmamiTracker';

export const metadata = {
    title: 'Logo Test',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head></head>
            <body>
                {children}
                <UmamiTracker />
            </body>
        </html>
    );
}
