import '@/app/ui/global.css';

export const metadata = {
    title: 'Logo Test',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <script
                    defer
                    src="https://analytics.us.umami.is/script.js"
                    data-website-id="ea42990e-0591-454e-b494-416a0703ceef"
                ></script>
            </head>
            <body>{children}</body>
        </html>
    );
}
