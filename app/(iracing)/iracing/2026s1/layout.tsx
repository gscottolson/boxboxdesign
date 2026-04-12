import '../2026s2/series-ui.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'iRacing 2026 Season 1 | BoxBoxDesign',
    description: 'iRacing official series schedule browser for 2026 Season 1',
};

// Backup: parent `iracing/layout` sets `data-theme` from the `theme` cookie on SSR; this
// aligns the document if the cookie changes before hydration (e.g. another tab).
const themeScript = `(function(){try{var c=document.cookie.split('; ').find(function(r){return r.startsWith('theme=')});if(c&&c.split('=')[1]==='dark'){document.documentElement.dataset.theme='dark';}else{document.documentElement.removeAttribute('data-theme');}}catch(e){}})();`;

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            {children}
        </>
    );
}
