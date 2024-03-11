'use client';

import { ThemeProvider } from 'next-themes';

export function Providers(props: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" enableSystem={false} defaultTheme="dark">
            {props.children}
        </ThemeProvider>
    );
}
