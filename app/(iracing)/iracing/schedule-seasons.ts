/** Routes that use `SeriesClient` + extracted schedule JSON. Add rows as new seasons ship. */
export interface ScheduleSeasonOption {
    label: string;
    href: string;
}

export const SCHEDULE_SEASON_OPTIONS: ScheduleSeasonOption[] = [
    { label: '2026 Season 2', href: '/iracing/2026s2' },
];
