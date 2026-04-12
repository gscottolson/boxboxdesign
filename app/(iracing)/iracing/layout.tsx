import '@/app/ui/global.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { outfit } from '@/app/fonts';
import { Providers } from '@/app/providers';
import { UmamiTracker } from '@/app/UmamiTracker';

/** Runs before paint; keeps pages static (no `cookies()` on the server). */
const themeScript = `(function(){try{var c=document.cookie.split('; ').find(function(r){return r.startsWith('theme=')});if(c&&c.split('=')[1]==='dark'){document.documentElement.dataset.theme='dark';}else{document.documentElement.removeAttribute('data-theme');}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            suppressHydrationWarning
            lang="en"
            className="bg-gradient-to-b from-[#D6DDDF] to-[#C9D2D5] bg-fixed text-base font-light leading-[28px] text-teal800 antialiased"
        >
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body className={`${outfit.className} w-full`}>
                {/** does next-themes provide the right info? **/}
                <Providers>{children}</Providers>

                <div id="modal-root" />
                {process.env.VERCEL && <SpeedInsights />}
                <UmamiTracker />
            </body>
        </html>
    );
}
