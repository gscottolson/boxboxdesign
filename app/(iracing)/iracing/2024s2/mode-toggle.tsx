'use client';

import { useTheme } from 'next-themes';

export default function ModeToggle() {
    const { theme, setTheme } = useTheme();

    const handleClick = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return <div onClick={handleClick}>toggle</div>;
}
