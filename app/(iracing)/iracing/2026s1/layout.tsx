import '../2026s2/series-ui.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'iRacing 2026 Season 1 | BoxBoxDesign',
    description: 'iRacing official series schedule browser for 2026 Season 1',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
