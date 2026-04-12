'use client';

import { ModeToggleSwitch } from '../mode-toggle-switch';

export default function ModeToggle({ darkMode, onToggle }: { darkMode: boolean; onToggle: () => void }) {
    return (
        <ModeToggleSwitch
            darkMode={darkMode}
            onToggle={onToggle}
            palette="css-vars"
            className="shrink-0 rounded-full"
        />
    );
}
