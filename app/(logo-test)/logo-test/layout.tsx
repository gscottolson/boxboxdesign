import '@/app/ui/global.css';

export const metadata = {
    title: 'Logo Test',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}