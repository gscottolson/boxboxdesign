export type TempUnit = 'C' | 'F';

export const TEMP_UNIT_COOKIE = 'schedule_temp_unit';

export function parseTempUnitCookie(value: string | undefined | null): TempUnit {
    return value === 'F' ? 'F' : 'C';
}

export function cToF(c: number): number {
    return (c * 9) / 5 + 32;
}

/** Integer display for schedule air temps. */
export function formatAirTempForDisplay(celsius: number, unit: TempUnit): string {
    if (unit === 'C') return `${Math.round(celsius)}°C`;
    return `${Math.round(cToF(celsius))}°F`;
}
