'use client';

import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';
import { ModeToggleSwitch } from '../../iracing/mode-toggle-switch';

export default function ModeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    /** Until mounted, match SSR (`theme` is undefined → treat as dark, same as `defaultTheme`). */
    const darkMode = mounted ? theme !== 'light' : true;
    const onToggle = useCallback(() => {
        setTheme(darkMode ? 'light' : 'dark');
    }, [darkMode, setTheme]);

    return (
        <ModeToggleSwitch
            darkMode={darkMode}
            onToggle={onToggle}
            palette="neutral"
            className="absolute top-4 right-6 z-50 rounded-full"
        />
    );
}
