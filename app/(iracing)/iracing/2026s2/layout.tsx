import './series-ui.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'iRacing 2026 Season 2 | BoxBoxDesign',
    description: 'iRacing official series schedule browser for 2026 Season 2',
};

// Inline script prevents flash-of-theme by setting data-theme before React hydrates.
// SeriesClient reads document.documentElement.dataset.theme on mount.
const themeScript = `(function(){try{var c=document.cookie.split('; ').find(function(r){return r.startsWith('theme=')});if(c&&c.split('=')[1]==='dark'){document.documentElement.dataset.theme='dark';}}catch(e){}})();`;

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            {children}
        </>
    );
}
