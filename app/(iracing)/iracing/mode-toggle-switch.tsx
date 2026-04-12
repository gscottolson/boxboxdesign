'use client';

import { ThemeMoonToggleIcon, ThemeSunToggleIcon } from './mode-toggle-icons';

const THUMB_PX = 26;
const TRACK_PAD = 3;
/** Total track width (border box, `border-box`). */
const TRACK_W = 68;
const THUMB_TRAVEL = TRACK_W - THUMB_PX - TRACK_PAD * 2;

export type ModeTogglePalette = 'css-vars' | 'neutral';

type ModeToggleSwitchProps = {
    /** When true, dark theme is active (knob left, moon visible). */
    darkMode: boolean;
    onToggle: () => void;
    className?: string;
    palette?: ModeTogglePalette;
};

export function ModeToggleSwitch({
    darkMode,
    onToggle,
    className = '',
    palette = 'neutral',
}: ModeToggleSwitchProps) {
    const track =
        palette === 'css-vars'
            ? 'bg-[var(--mode-toggle-track)]'
            : 'bg-gray-200 dark:bg-gray-500';
    const thumb =
        palette === 'css-vars'
            ? 'bg-[var(--mode-toggle-thumb)]'
            : 'bg-white dark:bg-gray-700';
    const icon = palette === 'css-vars' ? 'text-[var(--mode-toggle-icon)]' : 'text-gray-500 dark:text-gray-400';

    return (
        <button
            type="button"
            role="switch"
            aria-checked={darkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={onToggle}
            className={`inline-flex h-8 cursor-pointer items-center border-none p-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${palette === 'css-vars' ? 'focus-visible:ring-[var(--fg-muted)]' : 'focus-visible:ring-gray-400 dark:focus-visible:ring-gray-500'} ${className}`}
        >
            <span
                className={`relative isolate inline-flex h-8 w-[68px] shrink-0 items-stretch overflow-hidden rounded-full ${track}`}
                style={{ padding: TRACK_PAD }}
            >
                {/* Icons sit under the thumb; only the uncovered half is visible. */}
                <span className="pointer-events-none absolute inset-0 z-0 flex">
                    <span className="flex w-1/2 items-center justify-center">
                        <ThemeSunToggleIcon className={`h-4 w-4 shrink-0 ${icon}`} />
                    </span>
                    <span className="flex w-1/2 items-center justify-center">
                        <ThemeMoonToggleIcon className={`h-4 w-4 shrink-0 ${icon}`} />
                    </span>
                </span>
                <span
                    className={`pointer-events-none absolute z-10 rounded-full ${thumb}`}
                    style={{
                        left: TRACK_PAD,
                        top: '50%',
                        width: THUMB_PX,
                        height: THUMB_PX,
                        transform: `translateY(-50%) translateX(${darkMode ? 0 : THUMB_TRAVEL}px)`,
                        transition: 'transform 200ms ease-in-out',
                    }}
                />
            </span>
        </button>
    );
}
