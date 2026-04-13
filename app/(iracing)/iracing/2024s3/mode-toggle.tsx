'use client';

import { useTheme } from 'next-themes';
import { useCallback } from 'react';
import { ModeToggleSwitch } from '../mode-toggle-switch';

export default function ModeToggle() {
    const { theme, setTheme } = useTheme();
    /** `theme` is undefined during SSR; default matches `ThemeProvider defaultTheme="dark"`. */
    const darkMode = theme !== 'light';
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
