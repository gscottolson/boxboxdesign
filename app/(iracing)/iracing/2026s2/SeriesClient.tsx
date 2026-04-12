'use client';
import clsx from 'clsx';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, memo, forwardRef, useCallback } from 'react';
import ModeToggle from './mode-toggle';
import { SCHEDULE_SEASON_OPTIONS } from '../schedule-seasons';
import { TEMP_UNIT_COOKIE, formatAirTempForDisplay, type TempUnit } from './temp-unit-preference';

interface WeatherData {
    air_temperature_c: number | null;
    chance_of_rain: string | null;
}

interface Segment {
    type: string;
    laps: number;
}

interface CarBalance {
    fuel_pct: number | null;
    ballast_kg: number | null;
    power_pct: number | null;
    tire_sets: number | null;
}

interface Week {
    week: number;
    week_start_gmt: string;
    track: string;
    track_name: string | null;
    track_layout: string | null;
    event_date: string | null;
    event_time: string | null;
    weather: WeatherData | null;
    race_start: string | null;
    cautions: string | null;
    qualifying_scrutiny: string | null;
    grid_by_class: boolean;
    min_drivers: number | null;
    max_drivers: number | null;
    fair_share: string | null;
    lucky_dog: boolean;
    gwc: number | null;
    restart_file: string | null;
    restart_position: string | null;
    start_zone: boolean;
    caution_laps_count: boolean;
    car_balance: Record<string, CarBalance>;
    notes: string[];
    cars_in_use: string[];
    car_group_label: string;
    laps: number | null;
    race_time: string | null;
    segments: Segment[];
}

interface SeriesFlag {
    week: number;
    field: string;
    reason: string;
}

interface Series {
    series: string;
    discipline: string | null;
    license_class: string | null;
    setup: string | null;
    cars: string[];
    schedule_mode: string | null;
    race_cadence: string | null;
    qualifying_cadence: string | null;
    min_entries: number | null;
    split_at: number | null;
    drops: number | null;
    incident_penalty: number | null;
    incident_penalty_repeat: number | null;
    incident_dq: number | null;
    weeks: Week[];
    flags?: SeriesFlag[];
}

interface SeriesWithIndex extends Series {
    _originalIndex: number;
}

export interface SeriesClientProps {
    series: Series[];
    /** From `schedule_temp_unit` cookie (server). */
    initialTempUnit?: TempUnit;
    /** From `theme` cookie (server); must match `<html data-theme>` set in iracing layout. */
    initialDarkMode?: boolean;
}

interface TrackInfo {
    name: string | null | undefined;
    layout: string | null | undefined;
    year: string | null;
}

const TRACK_OVERRIDES: Record<string, string> = {
    'Southern National Motorsports Park': "Southern Nat'l",
    'North Wilkesboro Speedway': 'N. Wilkesboro',
    'World Wide Technology Raceway (Gateway)': 'Gateway',
    'EchoPark Speedway (Atlanta)': 'Atlanta',
    'Volusia Speedway Park': 'Volusia',
    'Lucas Oil Indianapolis Raceway Park': 'Lucas Oil',
    "Kevin Harvick's Kern Raceway": 'Kern',
    'Mobility Resort Motegi': 'Motegi',
    'Autódromo Hermanos Rodríguez': 'Hnos. Rodríguez',
    'Circuit of the Americas': 'COTA',
    'Watkins Glen International': 'Watkins Glen',
    'Autodromo Internazionale Enzo e Dino Ferrari': 'Imola',
    'Shell V-Power Motorsport Park at The Bend': 'The Bend',
    'Misano World Circuit Marco Simoncelli': 'Misano',
    'Federated Auto Parts Raceway at I-55': 'I-55 Raceway',
    'Suzuka International Racing Course': 'Suzuka',
    'Circuit de Spa-Francorchamps': 'Spa',
    'Circuit Zandvoort': 'Zandvoort',
    'Adelaide Street Circuit': 'Adelaide',
    'St. Petersburg Grand Prix': 'St. Petersburg',
    'Long Beach Street Circuit': 'Long Beach',
    'Motorsport Arena Oschersleben': 'Oschersleben',
    'WeatherTech Raceway at Laguna Seca': 'Laguna Seca',
    'Mid-Ohio Sports Car Course': 'Mid-Ohio',
    'Autodromo Internazionale del Mugello': 'Mugello',
    'Rudskogen Motorsenter': 'Rudskogen',
    'Okayama International Circuit': 'Okayama',
    'Chicago Street Course': 'Chicago',
    'Chicagoland Speedway': 'Chicagoland',
    'Circuit de Nevers Magny-Cours': 'Magny-Cours',
    'Miami International Autodrome': 'Miami',
    'Autódromo José Carlos Pace': 'Interlagos',
    'Hockenheimring Baden-Württemberg': 'Hockenheim',
    'Detroit Grand Prix at Belle Isle': 'Belle Isle',
    'Sandown International Motor Raceway': 'Sandown',
    'MotorLand Aragón': 'Aragón',
    'Algarve International Circuit': 'Portimão',
    'Autodromo Nazionale Monza': 'Monza',
    'Circuit de Barcelona Catalunya': 'Barcelona',
    'Circuit Gilles Villeneuve': 'Montréal',
    'Nürburgring Grand-Prix-Strecke': 'Nürburgring GP',
    'Nürburgring Combined': 'Nürburgring',
    'Nürburgring Nordschleife': 'Nordschleife',
    'The Dirt Track at Charlotte': 'Charlotte Dirt',
    'Canadian Tire Motorsports Park': 'Mosport',
    'Circuit des 24 Heures du Mans': 'Le Mans',
    'Circuit de Lédenon': 'Lédenon',
    'Circuit Zolder': 'Zolder',
    'Circuito de Jerez': 'Jerez',
    'Circuito de Navarra': 'Navarra',
    'Daytona Rallycross and Dirt Road': 'Daytona Dirt',
    'Homestead Miami Speedway': 'Homestead',
    'LA Coliseum Raceway': 'Coliseum',
    'Lånkebanen (Hell RX)': 'Hell',
    'The Milwaukee Mile': 'Milwaukee',
};

const TRACK_SUFFIXES = [
    ' Motorsports Park',
    ' Motorsport Park',
    ' International Speedway',
    ' International Raceway',
    ' Motor Speedway',
    ' Motor Raceway',
    ' Racing Circuit',
    ' Superspeedway',
    ' Fairgrounds',
    ' Speedway',
    ' Raceway',
    ' Circuit',
];

function shortenTrackName(name: string | null | undefined): string | null | undefined {
    if (!name) return name;
    if (TRACK_OVERRIDES[name]) return TRACK_OVERRIDES[name];
    let s = name;
    let changed = true;
    while (changed) {
        changed = false;
        for (const suffix of TRACK_SUFFIXES) {
            if (s.endsWith(suffix)) {
                s = s.slice(0, -suffix.length);
                changed = true;
                break;
            }
        }
    }
    return s;
}

// Series where cars mode is active but track is the primary display (car is secondary)
const TRACK_PRIMARY_SERIES = new Set(['eNASCAR Coca Cola iRacing Qualifying Series']);

const LAYOUT_ABBR: Record<string, string> = {
    Industriefahrten: 'Indus.',
};

const CAR_ABBR: Record<string, string> = {
    'Skip Barber Formula 2000': 'Skip Barber F2000',
    'Street Stock': 'Street Stocks',
    GT3: 'GT3 Cars',
    GT4: 'GT4 Cars',
    'NASCAR Truck': 'NASCAR Trucks',
    "NASCAR O'Reilly": "O'Reilly Cars",
    'NASCAR Cup Series Next Gen': 'Next Gen Cars',
    'NASCAR Cup Chevrolet Impala COT - 2009': 'Impala COT',
};

function formatLegacyTrack(trackName: string | null | undefined, trackLayout: string | null | undefined): TrackInfo {
    if (!trackName || !trackName.startsWith('[Legacy]'))
        return { name: shortenTrackName(trackName), layout: trackLayout, year: null };
    const rawName = trackName.replace(/^\[Legacy\]\s*/, '');
    let layout = trackLayout;
    let year: string | null = null;
    if (trackLayout) {
        const m = trackLayout.match(/^(\d{4})\s*-\s*(.+)$/);
        if (m) {
            year = m[1];
            layout = m[2].trim();
        }
    }
    return { name: shortenTrackName(rawName), year, layout };
}

const CADENCE_HIGHLIGHT =
    /(\d{1,2}\s*(?:timeslots?|hours?|minutes?)|\:?\d{1,2}(?::\d{2})?(?:\s*(?:GMT|past|after))?|\bhour(?:ly)?\b|\btop of the hour\b|\bhalf past\b|\bon the hour\b)/gi;

const LICENSE_COLORS: Record<string, { text: string; border: string; bg: string; chipBg?: string }> = {
    Rookie: { text: 'var(--license-rookie)', border: 'var(--license-rookie)', bg: 'var(--bg)' },
    /** PDF ``R Class Series (UNRANKED)`` — section license letter, same lane as rookie. */
    R: { text: 'var(--license-rookie)', border: 'var(--license-rookie)', bg: 'var(--bg)' },
    D: { text: 'var(--license-d)', border: 'var(--license-d)', bg: 'var(--bg)' },
    C: { text: 'var(--license-c)', border: 'var(--license-c)', bg: 'var(--bg)', chipBg: 'var(--license-c-chip-bg)' },
    B: { text: 'var(--license-b)', border: 'var(--license-b)', bg: 'var(--bg)' },
    A: { text: 'var(--license-a)', border: 'var(--license-a)', bg: 'var(--bg)' },
};
const DEFAULT_COLORS = { text: 'var(--license-a)', border: 'var(--license-a)', bg: 'var(--bg)' };

function licenseColors(licenseClass: string | null) {
    return LICENSE_COLORS[licenseClass ?? ''] ?? DEFAULT_COLORS;
}

/** Sidebar section label: with discipline from legacy data, or license only (PDF order extract). */
function navSectionHeading(discipline: string | null, license: string): string {
    if (discipline === 'Unranked') return 'Unranked';
    if (discipline) return `${discipline} ${license}`;
    return license;
}

function CarItem({ car }: { car: string }) {
    return (
        <div className="car-item">
            <span
                style={
                    {
                        color: 'var(--fg-body)',
                        fontSize: 'calc(18px * var(--scale))',
                        fontStyle: 'italic',
                        textWrap: 'balance',
                    } as React.CSSProperties
                }
            >
                {car}
            </span>
            <div className="car-decoration" />
        </div>
    );
}

/** PDF line when eligibility is per week — not a real car name in the header list. */
const HEADER_CARS_PLACEHOLDER = /^see race week for cars in use/i;

/** Car-featured series usually list cars per week; same-venue series (e.g. NEC) only have header `cars`. */
function carsForSeriesTail(weeks: Week[] | undefined, headerCars: string[] | undefined): string[] {
    const seen = new Set<string>();
    const fromWeeks = (weeks || [])
        .filter((w) => w.cars_in_use && w.cars_in_use.length > 0)
        .flatMap((w) => w.cars_in_use)
        .filter((car) => (seen.has(car) ? false : (seen.add(car), true)));
    if (fromWeeks.length > 0) return fromWeeks;
    return (headerCars || []).filter((c) => !HEADER_CARS_PLACEHOLDER.test(c.trim()));
}

function highlightCadence(text: string) {
    text = text.replace(/(\d+)\s*Timeslots?\s*Per\s*Week/gi, (_, n) => `${n} timeslots per week`);
    const parts = text.split(CADENCE_HIGHLIGHT);
    return parts.map((part, i) => {
        if (i % 2 === 1)
            return (
                <span key={i} style={{ fontWeight: 600 }}>
                    {part}
                </span>
            );
        return part;
    });
}

// Walks the offsetParent chain from innerEl up to scrollEl, accumulating
// position. Assumes scrollEl is the offsetParent ancestor of innerEl — i.e.,
// no intermediate element between them has position: relative/absolute/fixed.
// If any wrapper gains positioning in the future, the loop will exit early
// and pill coordinates will be wrong.
function getNavInnerGeometry(
    innerEl: HTMLSpanElement,
    scrollEl: HTMLElement,
): { x: number; y: number; w: number; h: number } {
    let x = 0,
        y = 0;
    let current: HTMLElement | null = innerEl;
    while (current && current !== scrollEl) {
        x += current.offsetLeft;
        y += current.offsetTop;
        current = current.offsetParent as HTMLElement | null;
    }
    const w = innerEl.offsetWidth;
    const h = innerEl.offsetHeight;
    return { x, y, w, h };
}

const FILLER = new Set(['series', 'iracing', 'racing', 'official', 'the', 'championship', 'season']);

function toSlug(name: string): string {
    return name
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => !FILLER.has(word))
        .join(' ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function buildSlugMap(series: SeriesWithIndex[]): Map<number, string> {
    // First pass: generate base slugs
    const slugs = series.map((s) => toSlug(s.series));

    // Resolve collisions
    const slugToIndices = new Map<string, number[]>();
    slugs.forEach((slug, i) => {
        if (!slugToIndices.has(slug)) slugToIndices.set(slug, []);
        slugToIndices.get(slug)!.push(i);
    });

    slugToIndices.forEach((indices) => {
        if (indices.length <= 1) return;
        // Multiple series share the same base slug — try adding filler words back
        // Process in array order; first member to find a unique candidate claims it.
        // Later members see already-assigned slugs and must find different ones.
        for (const idx of indices) {
            const name = series[idx].series;
            const words = name.toLowerCase().split(/\s+/);
            const fillerWords = words.filter((w) => FILLER.has(w));
            let resolved = false;
            for (const filler of fillerWords) {
                // Insert filler back at its original position
                const candidate = words
                    .filter((w) => !FILLER.has(w) || w === filler)
                    .join(' ')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');
                // Check if this candidate is unique across all series
                const taken = slugs.some((s, i) => s === candidate && !indices.includes(i));
                if (!taken && !indices.some((i2) => i2 !== idx && slugs[i2] === candidate)) {
                    slugs[idx] = candidate;
                    resolved = true;
                    break;
                }
            }
            if (!resolved) {
                // toSlug without filler stripping — intentionally keeps all words
                slugs[idx] = name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');
            }
        }
    });

    // Keys are flatSeries positions (0..N-1), same index space as selectedIndex.
    return new Map(slugs.map((slug, i) => [i, slug]));
}

interface NavItemProps {
    s: SeriesWithIndex;
    flatIdx: number;
    active: boolean;
    navInnerRefs: React.MutableRefObject<Record<number, HTMLSpanElement | null>>;
    onNavClick: (flatIdx: number) => void;
}

function NavSetupDot({ setup }: { setup: string | null }) {
    return (
        <span className="nav-setup-dot col-start-1 row-start-1 flex shrink-0 items-center justify-center self-center text-[var(--fg-dim)] transition-colors duration-150">
            <svg width="8" height="8" viewBox="0 0 10 10" className="block shrink-0">
                {setup === 'Fixed' ? (
                    <circle cx="5" cy="5" r="3.5" fill="currentColor" />
                ) : (
                    <circle cx="5" cy="5" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                )}
            </svg>
        </span>
    );
}

const NavItem = memo(
    forwardRef<HTMLDivElement, NavItemProps>(function NavItem({ s, flatIdx, active, navInnerRefs, onNavClick }, ref) {
        const splitIdx = s.series ? s.series.indexOf(' - ') : -1;
        const hasSubtitle = splitIdx >= 0;

        return (
            <div
                className={clsx(
                    'series-nav-item flex min-w-0 cursor-pointer p-0 text-[0.82em] font-normal text-[var(--fg)] transition-colors duration-150',
                    active && 'series-nav-item--active',
                )}
                ref={ref}
                onClick={() => onNavClick(flatIdx)}
            >
                <span
                    className="nav-inner grid min-w-0 flex-[0_1_auto] grid-cols-[auto_minmax(0,1fr)] gap-x-[0.3rem] gap-y-0 overflow-hidden py-[0.2rem] px-1.5"
                    ref={(el) => {
                        navInnerRefs.current[flatIdx] = el;
                    }}
                >
                    <NavSetupDot setup={s.setup} />
                    {s.series ? (
                        hasSubtitle ? (
                            <>
                                <span className="nav-label col-start-2 row-start-1 min-w-0 overflow-hidden leading-[1.15]">
                                    {s.series.slice(0, splitIdx)}
                                </span>
                                <span className="nav-label nav-label--subtitle col-start-2 row-start-2 min-w-0 overflow-hidden font-light leading-[1.15]">
                                    {s.series.slice(splitIdx + 3).replace(/ - /g, ' ')}
                                </span>
                            </>
                        ) : (
                            <span className="nav-label col-start-2 row-start-1 min-w-0">{s.series}</span>
                        )
                    ) : (
                        <span className="nav-label col-start-2 row-start-1 min-w-0 text-[var(--fg-dim)]">(Unnamed)</span>
                    )}
                </span>
            </div>
        );
    }),
);

interface SeriesCardProps {
    s: SeriesWithIndex;
    idx: number;
    showGrid: boolean;
    tempUnit: TempUnit;
}

const SeriesCard = memo(
    forwardRef<HTMLDivElement, SeriesCardProps>(function SeriesCard({ s, idx, showGrid, tempUnit }, ref) {
        const lc = licenseColors(s.license_class);
        const weeks = s.weeks || [];
        const durations = weeks.map((w) => (w.laps != null ? `${w.laps} laps` : w.race_time ?? null));
        const uniqueDurations = new Set(durations.filter(Boolean));
        const uniformDuration =
            uniqueDurations.size === 1 && durations.every((d) => d !== null) ? [...uniqueDurations][0] : null;

        const segmentKey = (segs: Segment[]) => segs.map((s) => `${s.type}:${s.laps}`).join('|');
        const weeksWithSegs = weeks.filter((w) => Array.isArray(w.segments) && w.segments.length > 0);
        const uniformSegments =
            weeksWithSegs.length > 0 && new Set(weeksWithSegs.map((w) => segmentKey(w.segments))).size === 1
                ? weeksWithSegs[0].segments
                : null;

        const uniformFuel = (() => {
            const allWeekCodes = [...new Set(weeks.flatMap((w) => Object.keys(w.car_balance || {})))];
            if (!allWeekCodes.length) return null;
            const fuelVals = allWeekCodes
                .map((c) => weeks.map((w) => w.car_balance?.[c]?.fuel_pct ?? null).find((v) => v != null) ?? null)
                .filter((v) => v != null) as number[];
            if (!fuelVals.length) return null;
            const unique = new Set(fuelVals);
            if (unique.size !== 1) return null;
            const hasOtherBop = allWeekCodes.some((c) =>
                weeks.some((w) => {
                    const b = w.car_balance?.[c];
                    return b && (b.ballast_kg != null || b.power_pct != null);
                }),
            );
            return hasOtherBop ? null : [...unique][0];
        })();

        const uniformTireSets = (() => {
            const allWeekCodes = [...new Set(weeks.flatMap((w) => Object.keys(w.car_balance || {})))];
            if (!allWeekCodes.length) return null;
            const hasOtherBop = allWeekCodes.some((c) =>
                weeks.some((w) => {
                    const b = w.car_balance?.[c];
                    return b && (b.fuel_pct != null || b.ballast_kg != null || b.power_pct != null);
                }),
            );
            if (hasOtherBop) return null;
            const tireCounts = allWeekCodes
                .map((c) => weeks.map((w) => w.car_balance?.[c]?.tire_sets ?? null).find((v) => v != null) ?? null)
                .filter((v) => v != null);
            if (!tireCounts.length) return null;
            const unique = new Set(tireCounts);
            return unique.size === 1 ? [...unique][0] : null;
        })();

        // Matches extractor fallback label for same-venue car mode — use track-first rows instead of repeating the label.
        const seriesIsGenericMultiClassVenue =
            s.schedule_mode === 'cars' &&
            !TRACK_PRIMARY_SERIES.has(s.series) &&
            weeks.length > 0 &&
            weeks.every((w) => (w.car_group_label || '').trim().toLowerCase() === 'multi-class');

        return (
            <div
                ref={ref}
                data-series-idx={idx}
                style={{
                    ['--accent' as string]: lc.text,
                    marginTop: 0,
                    marginBottom: 0,
                    minHeight: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    paddingTop: '4rem',
                    paddingBottom: '4rem',
                    scrollSnapAlign: 'start',
                    backgroundImage: showGrid
                        ? 'repeating-linear-gradient(to bottom, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, transparent 1px, transparent 26px)'
                        : 'none',
                }}
            >
                <div className="series-body">
                    <div className="series-meta series-meta-lead">
                        <h2
                            style={{
                                margin: '0 0 1rem',
                                fontSize: 'calc(40px * var(--scale))',
                                lineHeight: '0.975',
                                fontWeight: 900,
                                fontStyle: 'italic',
                                color: 'var(--fg)',
                            }}
                        >
                            {(() => {
                                const idx = s.series?.indexOf(' - ');
                                if (idx != null && idx >= 0) {
                                    return (
                                        <>
                                            {s.series.slice(0, idx)}
                                            <span style={{ fontWeight: 300 }}>
                                                {' '}
                                                {s.series.slice(idx + 3).replace(/ - /g, ' ')}
                                            </span>
                                        </>
                                    );
                                }
                                return s.series;
                            })()}
                        </h2>
                        {process.env.NODE_ENV === 'development' && s.flags && s.flags.length > 0 && (
                            <div
                                style={{
                                    marginBottom: '1rem',
                                    padding: '0.5rem 0.75rem',
                                    background: 'rgba(242, 127, 27, 0.1)',
                                    border: '1px solid var(--license-d)',
                                    borderRadius: 6,
                                    fontSize: 'calc(13px * var(--scale))',
                                    lineHeight: 1.5,
                                }}
                            >
                                <span style={{ fontWeight: 700, color: 'var(--license-d)' }}>Validation flags</span>
                                <ul
                                    style={{
                                        margin: '0.25rem 0 0',
                                        padding: '0 0 0 1.25rem',
                                        color: 'var(--fg-secondary)',
                                    }}
                                >
                                    {s.flags.map((f) => (
                                        <li key={`${f.week}-${f.field}`}>
                                            Week {f.week} · <span style={{ fontWeight: 600 }}>{f.field}</span> —{' '}
                                            {f.reason}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                            {(s.discipline || s.license_class || s.setup) && (() => {
                                const lcRow = licenseColors(s.license_class);
                                const discItems = [
                                    s.discipline,
                                    s.license_class &&
                                        (s.license_class === 'Rookie' ? 'Rookie' : `${s.license_class} License`),
                                    s.setup,
                                ]
                                    .filter(Boolean)
                                    .flatMap((item, i, arr) =>
                                        i < arr.length - 1
                                            ? [
                                                  <span key={i}>{item}</span>,
                                                  <span
                                                      key={`sep-${i}`}
                                                      style={{
                                                          color: 'var(--fg-dim)',
                                                          opacity: 0.25,
                                                          fontStyle: 'normal',
                                                      }}
                                                  >
                                                      {'//'}
                                                  </span>,
                                              ]
                                            : [<span key={i}>{item}</span>],
                                    );
                                const rowTypography = {
                                    display: 'flex' as const,
                                    alignItems: 'baseline' as const,
                                    gap: '8px',
                                    fontSize: 'calc(18px * var(--scale))',
                                    lineHeight: '1.44',
                                    fontWeight: 600,
                                    fontStyle: 'italic' as const,
                                    color: lcRow.text,
                                    flexWrap: 'wrap' as const,
                                };
                                if (s.license_class === 'C') {
                                    return (
                                        <div
                                            className="disc-row license-c-chip-shape"
                                            style={{
                                                marginBottom: '1.44em',
                                                background: lcRow.chipBg,
                                                padding: lcRow.chipBg ? '2px 8px' : undefined,
                                            }}
                                        >
                                            <div
                                                className="license-c-chip-shape__inner license-c-chip-shape__inner--flex"
                                                style={rowTypography}
                                            >
                                                {discItems}
                                            </div>
                                        </div>
                                    );
                                }
                                return (
                                    <div
                                        className="disc-row"
                                        style={{
                                            ...rowTypography,
                                            marginBottom: '1.44em',
                                            background: lcRow.chipBg,
                                            borderRadius: lcRow.chipBg ? '4px' : undefined,
                                            padding: lcRow.chipBg ? '2px 8px' : undefined,
                                        }}
                                    >
                                        {discItems}
                                    </div>
                                );
                            })()}
                    </div>

                    {/* Schedule */}
                    <div className="series-schedule">
                        <div>
                            {(s.weeks || []).map((w, wi) => {
                                const isLast = wi === (s.weeks || []).length - 1;
                                const {
                                    name: displayName,
                                    year: legacyYear,
                                    layout: displayLayout,
                                } = formatLegacyTrack(w.track_name || w.track, w.track_layout);
                                const carsFeatured =
                                    s.schedule_mode === 'cars' &&
                                    !!w.car_group_label &&
                                    !TRACK_PRIMARY_SERIES.has(s.series) &&
                                    !seriesIsGenericMultiClassVenue;
                                return (
                                    <div
                                        key={w.week ?? wi}
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'calc(42px * var(--scale)) 1fr',
                                            columnGap: 'calc(8px * var(--scale))',
                                            gridTemplateRows: `calc(30px * var(--scale)) calc(14px * var(--scale)) calc(8px * var(--scale))`,
                                            overflow: 'visible',
                                        }}
                                    >
                                        {/* Week number */}
                                        <div
                                            style={{
                                                gridColumn: 1,
                                                gridRow: 1,
                                                color: 'var(--fg-dim)',
                                                fontWeight: 300,
                                                fontStyle: 'italic',
                                                fontSize: 'calc(38px * var(--scale))',
                                                lineHeight: 'calc(30px * var(--scale))',
                                                letterSpacing: '-0.04em',
                                                textAlign: 'left',
                                                fontVariantNumeric: 'tabular-nums',
                                            }}
                                        >
                                            {String(w.week).padStart(2, '0')}
                                        </div>
                                        {/* Primary label: car group (car-featured) or track name (default) */}
                                        <div style={{ gridColumn: 2, gridRow: 1, whiteSpace: 'nowrap' }}>
                                            <span
                                                style={{
                                                    fontWeight: 800,
                                                    fontStyle: 'italic',
                                                    fontSize: 'calc(38px * var(--scale))',
                                                    lineHeight: 'calc(30px * var(--scale))',
                                                    letterSpacing: '-0.02em',
                                                    textTransform: 'uppercase',
                                                    color: 'var(--fg)',
                                                }}
                                            >
                                                {carsFeatured
                                                    ? CAR_ABBR[w.car_group_label] ?? w.car_group_label
                                                    : displayName}
                                            </span>
                                            {!carsFeatured && legacyYear && (
                                                <span
                                                    style={{
                                                        fontWeight: 300,
                                                        fontStyle: 'italic',
                                                        fontSize: 'calc(38px * var(--scale))',
                                                        lineHeight: 'calc(30px * var(--scale))',
                                                        color: 'var(--fg-dim)',
                                                        opacity: 0.5,
                                                        letterSpacing: '-0.03em',
                                                    }}
                                                >
                                                    {' '}
                                                    {legacyYear}
                                                </span>
                                            )}
                                        </div>
                                        {/* Date */}
                                        <div
                                            style={{
                                                gridColumn: 1,
                                                gridRow: 2,
                                                fontSize: 'calc(12px * var(--scale))',
                                                lineHeight: '1.17',
                                                fontStyle: 'italic',
                                                fontWeight: 600,
                                                fontVariantNumeric: 'tabular-nums',
                                                color: 'var(--fg-dim)',
                                                opacity: 0.5,
                                                textAlign: 'left',
                                                letterSpacing: '0.08em',
                                            }}
                                        >
                                            {w.event_date &&
                                                (() => {
                                                    const d = new Date(w.event_date + 'T00:00:00');
                                                    const mon = d
                                                        .toLocaleDateString('en-US', { month: 'short' })
                                                        .toUpperCase();
                                                    const day = d.toLocaleDateString('en-US', { day: '2-digit' });
                                                    return `${mon}${day}`;
                                                })()}
                                        </div>
                                        {/* Metadata */}
                                        <div
                                            style={{
                                                gridColumn: 2,
                                                gridRow: 2,
                                                fontSize: 'calc(12px * var(--scale))',
                                                lineHeight: '1.17',
                                                fontStyle: 'italic',
                                                color: 'var(--fg)',
                                                display: 'flex',
                                                flexWrap: 'nowrap',
                                                gap: 'calc(4px * var(--scale))',
                                                alignItems: 'baseline',
                                                minWidth: 0,
                                                overflow: 'visible',
                                            }}
                                        >
                                            {(() => {
                                                const parts: React.ReactNode[] = [];
                                                if (carsFeatured) {
                                                    const trackLabel = displayName ?? '';
                                                    const layoutAbbr = displayLayout
                                                        ? LAYOUT_ABBR[displayLayout]
                                                        : undefined;
                                                    const trackWithLayout = layoutAbbr
                                                        ? `${trackLabel} ${layoutAbbr}`
                                                        : displayLayout
                                                        ? `${trackLabel} ${displayLayout}`
                                                        : trackLabel;
                                                    if (trackWithLayout) {
                                                        const hasLayout = !!displayLayout;
                                                        const trackMainStyle: React.CSSProperties = {
                                                            fontWeight: 800,
                                                            color: hasLayout ? lc.text : 'var(--fg)',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.02em',
                                                            whiteSpace: 'nowrap',
                                                            flexShrink: 0,
                                                        };
                                                        parts.push(
                                                            <span
                                                                key="track"
                                                                style={{
                                                                    whiteSpace: 'nowrap',
                                                                    flexShrink: 0,
                                                                    display: 'inline-flex',
                                                                    alignItems: 'baseline',
                                                                }}
                                                            >
                                                                {hasLayout && lc.chipBg ? (
                                                                    <span
                                                                        className="license-c-chip-shape"
                                                                        style={{
                                                                            background: lc.chipBg,
                                                                            padding: '0 5px',
                                                                        }}
                                                                    >
                                                                        <span
                                                                            className="license-c-chip-shape__inner license-c-chip-shape__inner--flex"
                                                                            style={{ alignItems: 'baseline' }}
                                                                        >
                                                                            <span style={trackMainStyle}>
                                                                                {trackWithLayout}
                                                                            </span>
                                                                        </span>
                                                                    </span>
                                                                ) : (
                                                                    <span style={trackMainStyle}>{trackWithLayout}</span>
                                                                )}
                                                                {legacyYear && (
                                                                    <span
                                                                        style={{ color: 'var(--fg-dim)', opacity: 0.5 }}
                                                                    >
                                                                        {' '}
                                                                        {legacyYear}
                                                                    </span>
                                                                )}
                                                            </span>,
                                                        );
                                                    }
                                                } else {
                                                    const trackPrimaryCarLabel =
                                                        s.schedule_mode === 'cars' &&
                                                        !!w.car_group_label &&
                                                        TRACK_PRIMARY_SERIES.has(s.series)
                                                            ? CAR_ABBR[w.car_group_label] ?? w.car_group_label
                                                            : null;
                                                    const secondaryLabel =
                                                        trackPrimaryCarLabel ?? displayLayout ?? null;
                                                    if (secondaryLabel) {
                                                        const isLayoutSecondary =
                                                            !trackPrimaryCarLabel && !!displayLayout;
                                                        const layoutLineStyle: React.CSSProperties = {
                                                            fontWeight: 800,
                                                            color: isLayoutSecondary ? lc.text : 'var(--fg)',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.02em',
                                                            whiteSpace: 'nowrap',
                                                            flexShrink: 0,
                                                        };
                                                        parts.push(
                                                            <span
                                                                key="layout"
                                                                style={{
                                                                    whiteSpace: 'nowrap',
                                                                    flexShrink: 0,
                                                                    display: 'inline-flex',
                                                                    alignItems: 'baseline',
                                                                }}
                                                            >
                                                                {isLayoutSecondary && lc.chipBg ? (
                                                                    <span
                                                                        className="license-c-chip-shape"
                                                                        style={{
                                                                            background: lc.chipBg,
                                                                            padding: '0 5px',
                                                                        }}
                                                                    >
                                                                        <span
                                                                            className="license-c-chip-shape__inner license-c-chip-shape__inner--flex"
                                                                            style={{ alignItems: 'baseline' }}
                                                                        >
                                                                            <span style={layoutLineStyle}>
                                                                                {secondaryLabel}
                                                                            </span>
                                                                        </span>
                                                                    </span>
                                                                ) : (
                                                                    <span style={layoutLineStyle}>{secondaryLabel}</span>
                                                                )}
                                                            </span>,
                                                        );
                                                    }
                                                }
                                                const nowrap = (key: string, content: string) => (
                                                    <span
                                                        key={key}
                                                        style={{ whiteSpace: 'nowrap', flexShrink: 0, fontWeight: 600 }}
                                                    >
                                                        {content}
                                                    </span>
                                                );
                                                if (!uniformDuration) {
                                                    if (w.laps != null) parts.push(nowrap('laps', `${w.laps} laps`));
                                                    else if (w.race_time) parts.push(nowrap('race_time', w.race_time));
                                                }
                                                if (
                                                    w.weather &&
                                                    (w.weather.air_temperature_c != null || w.weather.chance_of_rain) &&
                                                    !(
                                                        (w.weather.air_temperature_c as unknown) ===
                                                            'Constant weather' &&
                                                        w.weather.chance_of_rain === 'Dynamic sky'
                                                    )
                                                ) {
                                                    const tempC =
                                                        typeof w.weather.air_temperature_c === 'number'
                                                            ? w.weather.air_temperature_c
                                                            : null;
                                                    const hasTemp = tempC != null;
                                                    const rain =
                                                        w.weather.chance_of_rain && w.weather.chance_of_rain !== 'None'
                                                            ? w.weather.chance_of_rain
                                                            : null;
                                                    if (hasTemp || rain) {
                                                        const weatherGap = hasTemp && rain
                                                            ? 'calc(10px * var(--scale))'
                                                            : '0px';
                                                        const weatherChildren = (
                                                            <>
                                                                {hasTemp && tempC != null && (
                                                                    <span
                                                                        style={{
                                                                            color: 'var(--fg)',
                                                                            fontWeight: 400,
                                                                            fontVariantNumeric: 'tabular-nums',
                                                                        }}
                                                                    >
                                                                        {formatAirTempForDisplay(tempC, tempUnit)}
                                                                    </span>
                                                                )}
                                                                {rain && (
                                                                    <span
                                                                        style={{
                                                                            display: 'inline-flex',
                                                                            alignItems: 'center',
                                                                            gap: '2px',
                                                                            color: '#0BA5EC',
                                                                            fontWeight: 400,
                                                                        }}
                                                                    >
                                                                        <svg
                                                                            width="6"
                                                                            height="8"
                                                                            viewBox="0 0 22 30"
                                                                            fill="currentColor"
                                                                            style={{
                                                                                flexShrink: 0,
                                                                                display: 'block',
                                                                                transform: 'translateY(calc(1.5px - 1px * var(--scale)))',
                                                                            }}
                                                                        >
                                                                            <path d="M1.71313 24.2173C-0.96344 20.1073 -0.462191 14.6962 2.9238 11.1478L13.4318 0.135688C13.6479 -0.0907149 14.0247 -0.0242619 14.1503 0.262377L20.2583 14.2043C22.2264 18.6968 20.8467 23.953 16.9259 26.8998C12.0341 30.5761 5.05248 29.3451 1.71313 24.2173Z" />
                                                                        </svg>
                                                                        <span>{rain}</span>
                                                                    </span>
                                                                )}
                                                            </>
                                                        );
                                                        parts.push(
                                                            <span
                                                                key="weather"
                                                                style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        gap: weatherGap,
                                                                    }}
                                                                >
                                                                    {weatherChildren}
                                                                </span>
                                                            </span>,
                                                        );
                                                    }
                                                }
                                                if (w.event_date)
                                                    parts.push(
                                                        <span
                                                            key="date"
                                                            style={{
                                                                whiteSpace: 'nowrap',
                                                                flexShrink: 0,
                                                                opacity: 0.65,
                                                            }}
                                                        >{`${w.event_date}${
                                                            w.event_time ? ` · ${w.event_time}` : ''
                                                        }`}</span>,
                                                    );
                                                return parts.flatMap((p, i) =>
                                                    i === 0
                                                        ? [p]
                                                        : [
                                                              <span
                                                                  key={`sep-${i}`}
                                                                  style={{
                                                                      opacity: 0.4,
                                                                      flexShrink: 0,
                                                                      fontStyle: 'normal',
                                                                  }}
                                                              >
                                                                  {'//'}
                                                              </span>,
                                                              p,
                                                          ],
                                                );
                                            })()}
                                        </div>
                                        <div
                                            style={{
                                                gridColumn: 2,
                                                gridRow: 3,
                                                paddingBottom: isLast ? 0 : 'calc(7px * var(--scale))',
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {/* end series-schedule */}


                    <div className="series-meta series-meta-tail">
                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1.75rem' }}>
                            {(() => {
                                const list =
                                    s.schedule_mode === 'cars'
                                        ? carsForSeriesTail(s.weeks, s.cars)
                                        : (s.cars || []).filter(
                                              (c) => !HEADER_CARS_PLACEHOLDER.test(c.trim()),
                                          );
                                return list.length > 0 ? (
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 'calc(8px * var(--scale))',
                                            marginBottom: '1.44em',
                                        }}
                                    >
                                        {list.map((car, i) => (
                                            <CarItem key={`${car}-${i}`} car={car} />
                                        ))}
                                    </div>
                                ) : null;
                            })()}
                            {uniformFuel != null && (
                                <div className="series-uniform-fuel" style={{ marginBottom: '1.44em' }}>
                                    <span
                                        style={{
                                            fontSize: 'calc(16px * var(--scale))',
                                            fontStyle: 'italic',
                                            fontWeight: 600,
                                            color: 'var(--series-bop-meta)',
                                            letterSpacing: '0.04em',
                                            textTransform: 'uppercase',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4em',
                                        }}
                                    >
                                        Cars start with
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 0 }}>
                                            <span
                                                style={{
                                                    position: 'relative',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '32px',
                                                    height: '32px',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {(() => {
                                                    const size = 32;
                                                    const c = size / 2;
                                                    const r = 12.5;
                                                    const circ = 2 * Math.PI * r;
                                                    const filled = (uniformFuel / 100) * circ;
                                                    return (
                                                        <svg
                                                            width={size}
                                                            height={size}
                                                            style={{
                                                                position: 'absolute',
                                                                inset: 0,
                                                                transform: 'rotate(-90deg)',
                                                            }}
                                                        >
                                                            <circle
                                                                cx={c}
                                                                cy={c}
                                                                r={r}
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeOpacity={0.2}
                                                                strokeWidth="2.5"
                                                            />
                                                            <circle
                                                                cx={c}
                                                                cy={c}
                                                                r={r}
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeOpacity={0.8}
                                                                strokeWidth="2.5"
                                                                strokeDasharray={`${filled} ${circ}`}
                                                                strokeLinecap="round"
                                                            />
                                                        </svg>
                                                    );
                                                })()}
                                                <span
                                                    style={{
                                                        position: 'relative',
                                                        zIndex: 1,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: '100%',
                                                        height: '100%',
                                                        fontWeight: 800,
                                                        fontSize: '0.75em',
                                                        letterSpacing: 0,
                                                        textTransform: 'none',
                                                        lineHeight: 1,
                                                        fontStyle: 'normal',
                                                        fontVariantNumeric: 'tabular-nums',
                                                    }}
                                                >
                                                    {uniformFuel}
                                                </span>
                                            </span>
                                            <span>% fuel</span>
                                        </span>
                                    </span>
                                </div>
                            )}
                            {uniformTireSets != null && (
                                <div
                                    style={{
                                        fontSize: 'calc(16px * var(--scale))',
                                        lineHeight: '1.625',
                                        fontStyle: 'italic',
                                        color: 'var(--fg-body)',
                                        marginBottom: '1.44em',
                                    }}
                                >
                                    {`${uniformTireSets} tire set${uniformTireSets !== 1 ? 's' : ''}`}
                                </div>
                            )}
                            {s.race_cadence && (
                                <div
                                    className="cadence-highlight"
                                    style={{
                                        fontSize: 'calc(16px * var(--scale))',
                                        lineHeight: '1.625',
                                        fontStyle: 'italic',
                                        color: 'var(--fg-body)',
                                    }}
                                >
                                    {highlightCadence(s.race_cadence)}
                                </div>
                            )}
                            {s.qualifying_cadence && (
                                <div
                                    className="cadence-highlight"
                                    style={{
                                        fontSize: 'calc(16px * var(--scale))',
                                        lineHeight: '1.625',
                                        fontStyle: 'italic',
                                        color: 'var(--fg-body)',
                                    }}
                                >
                                    {highlightCadence(s.qualifying_cadence)}
                                </div>
                            )}
                            {uniformDuration && (
                                <div
                                    style={{
                                        fontSize: 'calc(16px * var(--scale))',
                                        lineHeight: '1.625',
                                        fontStyle: 'italic',
                                        color: 'var(--fg-body)',
                                    }}
                                >
                                    All races are <span style={{ fontWeight: 600 }}>{uniformDuration}</span>
                                </div>
                            )}
                            {uniformSegments && (
                                <div
                                    style={{
                                        fontSize: 'calc(16px * var(--scale))',
                                        lineHeight: '1.625',
                                        fontStyle: 'italic',
                                        color: 'var(--fg-body)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    {uniformSegments.map((seg, i) => {
                                        const label =
                                            seg.type === 'heat'
                                                ? 'Heat'
                                                : seg.type === 'consolation'
                                                ? 'Consolation'
                                                : seg.type === 'feature'
                                                ? 'Feature'
                                                : seg.type.charAt(0).toUpperCase() + seg.type.slice(1);
                                        return (
                                            <span key={i} style={{ fontWeight: 600 }}>
                                                {label}: {seg.laps} laps
                                            </span>
                                        );
                                    })}
                                </div>
                            )}
                            <div
                                className="entries-info"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    fontSize: 'calc(16px * var(--scale))',
                                    lineHeight: '1.625',
                                    fontStyle: 'italic',
                                    color: 'var(--fg-body)',
                                    marginTop: '1.625em',
                                }}
                            >
                                {s.min_entries != null && (
                                    <>
                                        <span>{`Official at ${s.min_entries} entries, splits at ${s.split_at}`}</span>
                                        <span>{`${s.drops} drop weeks allowed`}</span>
                                    </>
                                )}
                                {s.incident_penalty != null && (
                                    <span>
                                        {s.incident_penalty_repeat != null
                                            ? `Drive-through at ${s.incident_penalty} incidents, then every ${s.incident_penalty_repeat}`
                                            : `Drive-through every ${s.incident_penalty} incidents`}
                                    </span>
                                )}
                                {s.incident_dq != null && <span>{`Disqualified at ${s.incident_dq} incidents`}</span>}
                            </div>
                        </div>
                    </div>


                    {/* Race info block */}
                    {(() => {
                        const weeks = s.weeks || [];
                        if (!weeks.length) return null;

                        function seriesVal<T>(key: keyof Week): { value: T; exceptions: number[] } {
                            const counts = new Map<string, number[]>();
                            for (const w of weeks) {
                                const v = JSON.stringify(w[key]);
                                if (!counts.has(v)) counts.set(v, []);
                                counts.get(v)!.push(w.week);
                            }
                            const dominant = [...counts.entries()].sort((a, b) => b[1].length - a[1].length)[0];
                            const value = JSON.parse(dominant[0]) as T;
                            const exceptions = weeks
                                .filter((w) => JSON.stringify(w[key]) !== dominant[0])
                                .map((w) => w.week);
                            return { value, exceptions };
                        }

                        function exc(exceptions: number[], label: (w: Week) => string) {
                            if (!exceptions.length) return '';
                            const parts = exceptions.map((wk) => {
                                const w = weeks.find((w) => w.week === wk);
                                return `wk ${wk}: ${w ? label(w) : '?'}`;
                            });
                            return ` (${parts.join('; ')})`;
                        }

                        const gridByClass = seriesVal<boolean>('grid_by_class');
                        const minDrivers = seriesVal<number | null>('min_drivers');
                        const maxDrivers = seriesVal<number | null>('max_drivers');
                        const fairShare = seriesVal<string | null>('fair_share');
                        const luckyDog = seriesVal<boolean>('lucky_dog');
                        const gwc = seriesVal<number | null>('gwc');
                        const restartFile = seriesVal<string | null>('restart_file');
                        const restartPos = seriesVal<string | null>('restart_position');
                        const startZone = seriesVal<boolean>('start_zone');
                        const cautionLaps = seriesVal<boolean>('caution_laps_count');
                        const allCodes = [...new Set(weeks.flatMap((w) => Object.keys(w.car_balance || {})))];

                        const restartParts: string[] = [];
                        if (startZone.value) restartParts.push('start zone');
                        if (luckyDog.value) restartParts.push('lucky dog');
                        if (gwc.value != null) restartParts.push(`${gwc.value}-G/W/C`);
                        if (restartFile.value && restartPos.value) {
                            restartParts.push(`${restartFile.value}-file ${restartPos.value}`);
                        }
                        const restartExceptions = [
                            ...new Set([
                                ...luckyDog.exceptions,
                                ...gwc.exceptions,
                                ...restartFile.exceptions,
                                ...restartPos.exceptions,
                                ...startZone.exceptions,
                            ]),
                        ].sort((a, b) => a - b);

                        const statements: React.ReactNode[] = [];

                        const allDynSky = weeks.every(
                            (w) =>
                                w.weather?.chance_of_rain === 'Dynamic sky' &&
                                (w.weather?.air_temperature_c as unknown) === 'Constant weather',
                        );
                        if (allDynSky) statements.push(<span key="dynsky">Dynamic sky, constant weather</span>);

                        if (gridByClass.value)
                            statements.push(
                                <span key="grid">
                                    Grid by class
                                    {exc(gridByClass.exceptions, (w) =>
                                        w.grid_by_class ? 'grid by class' : 'no grid by class',
                                    )}
                                </span>,
                            );
                        if (minDrivers.value != null) {
                            const driverExc = [...new Set([...minDrivers.exceptions, ...maxDrivers.exceptions])];
                            statements.push(
                                <span key="drivers">
                                    {minDrivers.value}–{maxDrivers.value} drivers
                                    {exc(driverExc, (w) => `${w.min_drivers ?? '?'}–${w.max_drivers ?? '?'} drivers`)}
                                </span>,
                            );
                        }
                        if (fairShare.value)
                            statements.push(
                                <span key="fs">
                                    Fair share — {fairShare.value}
                                    {exc(fairShare.exceptions, (w) => w.fair_share ?? 'none')}
                                </span>,
                            );
                        if (cautionLaps.value === false)
                            statements.push(
                                <span key="cl">
                                    Caution laps don&apos;t count
                                    {exc(cautionLaps.exceptions, (w) =>
                                        w.caution_laps_count ? 'caution laps count' : "caution laps don't count",
                                    )}
                                </span>,
                            );
                        if (restartParts.length)
                            statements.push(
                                <span key="restart">
                                    Restarts — {restartParts.join(', ')}
                                    {restartExceptions.length
                                        ? ` (${restartExceptions
                                              .map((wk) => {
                                                  const w = weeks.find((w) => w.week === wk);
                                                  if (!w) return `wk ${wk}: ?`;
                                                  const parts: string[] = [];
                                                  if (w.start_zone) parts.push('start zone');
                                                  if (w.lucky_dog) parts.push('lucky dog');
                                                  if (w.gwc != null) parts.push(`${w.gwc}-G/W/C`);
                                                  if (w.restart_file && w.restart_position)
                                                      parts.push(`${w.restart_file}-file ${w.restart_position}`);
                                                  return `wk ${wk}: ${parts.length ? parts.join(', ') : 'none'}`;
                                              })
                                              .join('; ')})`
                                        : ''}
                                </span>,
                            );

                        const tireGroups = new Map<number, string[]>();
                        for (const code of allCodes) {
                            const domFuel =
                                weeks.map((w) => w.car_balance?.[code]?.fuel_pct ?? null).find((v) => v != null) ??
                                null;
                            const domBallast =
                                weeks.map((w) => w.car_balance?.[code]?.ballast_kg ?? null).find((v) => v != null) ??
                                null;
                            const domPower =
                                weeks.map((w) => w.car_balance?.[code]?.power_pct ?? null).find((v) => v != null) ??
                                null;
                            const domTires =
                                weeks.map((w) => w.car_balance?.[code]?.tire_sets ?? null).find((v) => v != null) ??
                                null;
                            const bopParts: string[] = [];
                            if (domFuel != null && uniformFuel == null) bopParts.push(`fuel ${domFuel}%`);
                            if (domBallast != null) bopParts.push(`+${domBallast}kg`);
                            if (domPower != null) bopParts.push(`${domPower > 0 ? '+' : ''}${domPower}% pwr`);
                            if (bopParts.length)
                                statements.push(
                                    <span key={`bop-${code}`}>
                                        <span style={{ fontWeight: 700 }}>{code}</span> {bopParts.join(', ')}
                                    </span>,
                                );
                            if (domTires != null && uniformTireSets == null) {
                                if (!tireGroups.has(domTires)) tireGroups.set(domTires, []);
                                tireGroups.get(domTires)!.push(code);
                            }
                        }
                        for (const [count, codes] of [...tireGroups.entries()].sort((a, b) => a[0] - b[0])) {
                            statements.push(
                                <span key={`tires-${count}`}>
                                    {`${count} tire set${count !== 1 ? 's' : ''}`}
                                    {': '}
                                    <span style={{ fontWeight: 700 }}>{codes.join(' ')}</span>
                                </span>,
                            );
                        }

                        if (!statements.length) return null;

                        const proseStyle: React.CSSProperties = {
                            fontSize: 'calc(14px * var(--scale))',
                            lineHeight: '1.7',
                            color: 'var(--fg-secondary)',
                            fontStyle: 'italic',
                        };

                        return (
                            <div className="race-info" style={{ marginTop: '0.5rem' }}>
                                <div
                                    className="race-info-inner"
                                    style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}
                                >
                                    <p className="race-info-prose" style={proseStyle}>
                                        {statements.map((stmt, i) => (
                                            <span key={i}>
                                                {stmt}
                                                {i < statements.length - 1 ? '. ' : '.'}
                                            </span>
                                        ))}
                                    </p>
                                </div>
                            </div>
                        );
                    })()}
                </div>
                {/* end series-body */}
            </div>
        );
    }),
);

export default function SeriesClient({ series, initialTempUnit, initialDarkMode }: SeriesClientProps) {
    const router = useRouter();
    const pathname = usePathname() ?? '';
    const currentSeason = useMemo(
        () => SCHEDULE_SEASON_OPTIONS.find((o) => o.href === pathname) ?? SCHEDULE_SEASON_OPTIONS[0],
        [pathname],
    );

    const [seasonMenuOpen, setSeasonMenuOpen] = useState(false);
    const seasonMenuRef = useRef<HTMLDivElement | null>(null);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showGrid, setShowGrid] = useState(false);
    const [navOpen, setNavOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [overlayMounted, setOverlayMounted] = useState(true);
    const seriesRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const detailPaneRef = useRef<HTMLDivElement | null>(null);
    const navItemRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const navRef = useRef<HTMLDivElement | null>(null);
    const navToggleRef = useRef<HTMLButtonElement | null>(null);
    const selectedIndexRef = useRef(0);
    const selectionTrigger = useRef<'click' | 'scroll'>('scroll');
    const navScrollRef = useRef<HTMLDivElement | null>(null);
    const navInnerRefs = useRef<Record<number, HTMLSpanElement | null>>({});
    const flatSeriesRef = useRef<SeriesWithIndex[]>([]);
    const slugMapRef = useRef<Map<number, string>>(new Map());
    const suppressScroll = useRef(false);
    const navRafRef = useRef<{ id: number } | null>(null);
    const hasMountedRef = useRef(false);
    const [pillGeometry, setPillGeometry] = useState<{
        x: number;
        y: number;
        w: number;
        h: number;
        radius: number;
        color: string;
    } | null>(null);
    const [pillAnimated, setPillAnimated] = useState(false);
    const [darkMode, setDarkMode] = useState<boolean>(initialDarkMode ?? false);
    const [tempUnit, setTempUnit] = useState<TempUnit>(initialTempUnit ?? 'C');

    const toggleTheme = () => {
        const next = !darkMode;
        document.documentElement.dataset.theme = next ? 'dark' : 'light';
        document.cookie = `theme=${next ? 'dark' : 'light'};path=/;max-age=31536000`;
        setDarkMode(next);
    };

    const toggleTempUnit = useCallback(() => {
        setTempUnit((u) => {
            const next: TempUnit = u === 'C' ? 'F' : 'C';
            document.cookie = `${TEMP_UNIT_COOKIE}=${next};path=/;max-age=31536000;SameSite=Lax`;
            return next;
        });
    }, []);

    useEffect(() => {
        if (!seasonMenuOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSeasonMenuOpen(false);
        };
        const onPointerDown = (e: PointerEvent) => {
            const el = seasonMenuRef.current;
            if (el && !el.contains(e.target as Node)) setSeasonMenuOpen(false);
        };
        document.addEventListener('keydown', onKey);
        document.addEventListener('pointerdown', onPointerDown, true);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('pointerdown', onPointerDown, true);
        };
    }, [seasonMenuOpen]);

    useEffect(() => {
        setSeasonMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        const pane = detailPaneRef.current;
        if (!pane) return;

        let resizing = false;
        let resizeTimer: ReturnType<typeof setTimeout>;
        const handleResize = () => {
            resizing = true;
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                resizing = false;
                requestAnimationFrame(() => {
                    seriesRefs.current[selectedIndexRef.current]?.scrollIntoView({
                        behavior: 'instant',
                        block: 'start',
                    });
                });
            }, 150);
        };
        window.addEventListener('resize', handleResize);

        const handleScroll = () => {
            if (resizing || suppressScroll.current) return;
            const trigger = pane.getBoundingClientRect().top + pane.clientHeight * 0.4;
            let activeIdx = 0;
            Object.entries(seriesRefs.current).forEach(([key, el]) => {
                if (el && el.getBoundingClientRect().top <= trigger) {
                    activeIdx = Math.max(activeIdx, parseInt(key, 10));
                }
            });
            selectionTrigger.current = 'scroll';
            setSelectedIndex(activeIdx);
            selectedIndexRef.current = activeIdx;
        };

        pane.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            pane.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimer);
        };
    }, []);

    useEffect(() => {
        if (selectionTrigger.current !== 'scroll') return;

        const el = navItemRefs.current[selectedIndex];
        const scroll = navScrollRef.current;
        if (!el || !scroll) return;

        const THRESHOLD = 3; // items from edge before nav nudges
        const getEl = (idx: number) => navItemRefs.current[idx] ?? null;

        // Measure combined height of up to THRESHOLD items above/below active
        const measure = (dir: 1 | -1) => {
            let h = 0;
            for (let i = 1; i <= THRESHOLD; i++) {
                const ref = getEl(selectedIndex + dir * i);
                if (!ref) break;
                h += ref.offsetHeight;
            }
            return h;
        };

        const elTop = el.offsetTop;
        const elBottom = elTop + el.offsetHeight;
        const scrollTop = scroll.scrollTop;
        const viewBottom = scrollTop + scroll.clientHeight;

        let target: number | null = null;

        if (elTop - scrollTop < measure(-1)) {
            // Within threshold of top — nudge up by one item's height
            const prevEl = getEl(selectedIndex - 1);
            target = Math.max(0, scrollTop - (prevEl?.offsetHeight ?? el.offsetHeight));
        } else if (viewBottom - elBottom < measure(1)) {
            // Within threshold of bottom — nudge down by one item's height
            const nextEl = getEl(selectedIndex + 1);
            target = scrollTop + (nextEl?.offsetHeight ?? el.offsetHeight);
        }

        if (target === null || Math.abs(target - scrollTop) < 1) return;

        const delta = target - scrollTop;
        const duration = Math.min(700, Math.max(300, Math.abs(delta) * 0.6));
        const startTime = performance.now();
        const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
        const raf = { id: 0 };
        const step = (now: number) => {
            const t = Math.min(1, (now - startTime) / duration);
            scroll.scrollTop = scrollTop + delta * ease(t);
            if (t < 1) raf.id = requestAnimationFrame(step);
        };
        raf.id = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf.id);
    }, [selectedIndex]);

    useEffect(() => {
        if (!hasMountedRef.current) {
            hasMountedRef.current = true;
            return;
        }
        const slug = slugMapRef.current.get(selectedIndex);
        if (slug) history.replaceState(null, '', '#' + slug);
    }, [selectedIndex]);

    useLayoutEffect(() => {
        const itemEl = navItemRefs.current[selectedIndex];
        const scrollEl = navScrollRef.current;
        if (!itemEl || !scrollEl) return;
        const series = flatSeriesRef.current[selectedIndex];
        const color = licenseColors(series?.license_class ?? null).border;
        const raw = getNavInnerGeometry(itemEl, scrollEl);
        const geom = {
            x: 6,
            y: raw.y + raw.h * 0.1,
            w: 2,
            h: raw.h * 0.8,
            radius: 0.5,
            color,
        };
        if (!pillAnimated) {
            setPillGeometry(geom);
            requestAnimationFrame(() => setPillAnimated(true));
        } else {
            setPillGeometry(geom);
        }
    }, [selectedIndex, pillAnimated]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (e.altKey) setShowGrid((v) => !v);
        };
        window.addEventListener('click', handler);
        return () => window.removeEventListener('click', handler);
    }, []);

    const [showColumns, setShowColumns] = useState(false);
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (
                e.key === 'g' &&
                !e.metaKey &&
                !e.ctrlKey &&
                !e.altKey &&
                (e.target as HTMLElement).tagName !== 'INPUT'
            ) {
                setShowColumns((v) => !v);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    useEffect(() => {
        if (!navOpen) return;
        const handler = (e: MouseEvent) => {
            if (navRef.current?.contains(e.target as Node)) return;
            if (navToggleRef.current?.contains(e.target as Node)) return;
            setNavOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [navOpen]);

    const { navSections, flatSeries } = useMemo(() => {
        const useDiscipline = series.some((s) => s.discipline);
        const sections: { discipline: string | null; license: string; items: SeriesWithIndex[] }[] = [];
        series.forEach((s, i) => {
            const item: SeriesWithIndex = { ...s, _originalIndex: i };
            const license = s.license_class || 'Other';
            const discipline = useDiscipline ? s.discipline || 'Other' : null;
            const last = sections[sections.length - 1];
            const breakSection =
                !last ||
                last.license !== license ||
                (useDiscipline && last.discipline !== discipline);
            if (breakSection) {
                sections.push({ discipline, license, items: [item] });
            } else {
                last.items.push(item);
            }
        });
        return {
            navSections: sections,
            flatSeries: sections.flatMap((sec) => sec.items),
        };
    }, [series]);

    // Map from _originalIndex → flatSeries position, used by nav item click handler
    const originalIndexToFlatIdx = useMemo(() => {
        const map = new Map<number, number>();
        flatSeries.forEach((s, i) => map.set(s._originalIndex, i));
        return map;
    }, [flatSeries]);

    // Stable click handler — all captured values are refs or stable state setters
    const handleNavClick = useCallback((flatIdx: number) => {
        const delta = Math.abs(flatIdx - selectedIndexRef.current);
        selectionTrigger.current = 'click';
        selectedIndexRef.current = flatIdx;
        setSelectedIndex(flatIdx);
        setNavOpen(false);
        const targetEl = seriesRefs.current[flatIdx];
        if (!targetEl) return;
        suppressScroll.current = true;
        const pane = detailPaneRef.current;
        if (navRafRef.current && pane) {
            cancelAnimationFrame(navRafRef.current.id);
            navRafRef.current = null;
            pane.style.scrollSnapType = 'y mandatory';
        }
        if (delta <= 3 && pane) {
            const targetScrollTop = targetEl.offsetTop;
            const startScrollTop = pane.scrollTop;
            const duration = 280;
            const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
            const raf = { id: 0 };
            navRafRef.current = raf;
            let startTime = -1;
            pane.style.scrollSnapType = 'none';
            const step = (now: number) => {
                if (startTime < 0) startTime = now;
                const t = Math.min(1, (now - startTime) / duration);
                pane.scrollTop = startScrollTop + (targetScrollTop - startScrollTop) * ease(t);
                if (t < 1) {
                    raf.id = requestAnimationFrame(step);
                } else {
                    navRafRef.current = null;
                    pane.style.scrollSnapType = 'y mandatory';
                    suppressScroll.current = false;
                }
            };
            raf.id = requestAnimationFrame(step);
        } else {
            targetEl.scrollIntoView({ behavior: 'instant', block: 'start' });
            suppressScroll.current = false;
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useLayoutEffect(() => {
        flatSeriesRef.current = flatSeries;
        slugMapRef.current = buildSlugMap(flatSeries);
    }, [flatSeries]);

    useLayoutEffect(() => {
        const hash = window.location.hash.slice(1); // strip leading #

        const entry = hash ? [...slugMapRef.current.entries()].find(([, slug]) => slug === hash) : undefined;

        if (entry) {
            const [targetIndex] = entry;
            suppressScroll.current = true;
            selectionTrigger.current = 'click';
            setSelectedIndex(targetIndex);
            selectedIndexRef.current = targetIndex;
            seriesRefs.current[targetIndex]?.scrollIntoView({ behavior: 'instant', block: 'start' });
            suppressScroll.current = false;
            let cancelled = false;
            Promise.all([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 1100))]).then(() => {
                if (!cancelled) setLoading(false);
            });
            return () => {
                cancelled = true;
            };
        } else {
            // No hash — wait for fonts + minimum hold so the loading state is visible
            let cancelled = false;
            Promise.all([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 1100))]).then(() => {
                if (!cancelled) setLoading(false);
            });
            return () => {
                cancelled = true;
            };
        }
    }, []);

    return (
        <div className="fixed inset-0 flex flex-col bg-[var(--bg)]">
            {/* Page header */}
            <div className="page-header box-border flex h-[4.5rem] shrink-0 items-center gap-2 bg-[var(--bg)] px-4 py-3 z-20">
                <button
                    className="series-nav-toggle pointer-events-auto shrink-0"
                    ref={navToggleRef}
                    onClick={() => setNavOpen((v) => !v)}
                    aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
                >
                    {navOpen ? (
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <line
                                x1="3"
                                y1="3"
                                x2="15"
                                y2="15"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <line
                                x1="15"
                                y1="3"
                                x2="3"
                                y2="15"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <line
                                x1="3"
                                y1="5"
                                x2="15"
                                y2="5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <line
                                x1="3"
                                y1="9"
                                x2="15"
                                y2="9"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <line
                                x1="3"
                                y1="13"
                                x2="15"
                                y2="13"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    )}
                </button>
                <div className="min-w-0 flex-1 text-[1.1em] font-bold leading-tight text-[var(--fg)]">
                    iRacing Official Schedule
                    <br />
                    <div className="relative inline-flex max-w-full align-top" ref={seasonMenuRef}>
                        <button
                            type="button"
                            id="schedule-season-trigger"
                            aria-label="Schedule season"
                            aria-expanded={seasonMenuOpen}
                            aria-haspopup="listbox"
                            aria-controls="schedule-season-menu"
                            className="season-menu-trigger flex max-w-[min(100%,28ch)] cursor-pointer items-center gap-1 border-0 bg-transparent py-0.5 pl-0 pr-0 text-left text-[0.8em] font-normal text-[var(--fg-muted)] underline decoration-transparent outline-none hover:underline hover:decoration-[var(--fg-muted)] focus-visible:ring-2 focus-visible:ring-[var(--fg-muted)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
                            onClick={() => setSeasonMenuOpen((o) => !o)}
                        >
                            <span className="min-w-0 truncate">{currentSeason?.label ?? 'Season'}</span>
                            <svg
                                className="pointer-events-none size-3.5 shrink-0 text-[var(--fg-muted)]"
                                viewBox="0 0 12 8"
                                fill="none"
                                aria-hidden
                            >
                                <path
                                    d="M2 2.5l4 3 4-3"
                                    stroke="currentColor"
                                    strokeWidth="1.35"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                        {seasonMenuOpen && (
                            <ul
                                id="schedule-season-menu"
                                role="listbox"
                                aria-labelledby="schedule-season-trigger"
                                className="absolute left-0 top-[calc(100%+4px)] z-[200] m-0 min-w-[12rem] list-none rounded border border-[var(--border)] bg-[var(--bg)] py-1 shadow-[var(--shadow-nav)]"
                            >
                                {SCHEDULE_SEASON_OPTIONS.map((opt) => {
                                    const selected = opt.href === pathname;
                                    return (
                                        <li key={opt.href} role="presentation" className="m-0 p-0">
                                            <button
                                                type="button"
                                                role="option"
                                                aria-selected={selected}
                                                className={clsx(
                                                    'w-full border-0 bg-transparent px-3 py-2 text-left text-[0.8em] text-[var(--fg-body)] hover:bg-[var(--border)]',
                                                    selected && 'font-semibold text-[var(--fg)]',
                                                )}
                                                onClick={() => {
                                                    setSeasonMenuOpen(false);
                                                    if (opt.href !== pathname) router.push(opt.href);
                                                }}
                                            >
                                                {opt.label}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="flex shrink-0 items-start gap-2">
                    <button
                        type="button"
                        onClick={toggleTempUnit}
                        className="temp-unit-toggle relative block size-8 shrink-0 overflow-hidden rounded-[4px] border-none bg-[var(--mode-toggle-track)] p-0 text-[0.8em] font-bold tabular-nums leading-none tracking-tight text-[var(--mode-toggle-icon)] hover:text-[var(--fg-body)]"
                        aria-label={tempUnit === 'F' ? 'Show temperatures in Celsius' : 'Show temperatures in Fahrenheit'}
                    >
                        <span
                            className={clsx(
                                'flex w-full flex-col transition-transform duration-300 ease-out motion-reduce:transition-none',
                                tempUnit === 'C' ? 'translate-y-0' : '-translate-y-8',
                            )}
                        >
                            <span className="flex h-8 w-full shrink-0 items-center justify-center" aria-hidden={tempUnit !== 'C'}>
                                °C
                            </span>
                            <span className="flex h-8 w-full shrink-0 items-center justify-center" aria-hidden={tempUnit !== 'F'}>
                                °F
                            </span>
                        </span>
                    </button>
                    <ModeToggle darkMode={darkMode} onToggle={toggleTheme} />
                </div>
            </div>

            {/* Content grid */}
            <div className="page-root grid min-h-0 min-w-0 flex-1 grid-cols-[32ch_minmax(0,2fr)_minmax(0,3fr)] grid-rows-1 gap-x-8">
                {/* Modal backdrop (mobile only) */}
                {navOpen && <div className="nav-backdrop" onClick={() => setNavOpen(false)} />}

                {/* Sidebar */}
                <div className={`series-nav-wrap${navOpen ? ' series-nav-wrap--open' : ''}`} ref={navRef}>
                    <div className={clsx('series-nav relative min-w-0', navOpen && 'series-nav--open')}>
                        <div
                            className="series-nav-scroll absolute inset-0 overflow-y-auto pl-2.5"
                            ref={navScrollRef}
                        >
                            {pillGeometry && (
                                <div
                                    className="nav-pill"
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: pillGeometry.w,
                                        height: pillGeometry.h,
                                        borderRadius: pillGeometry.radius,
                                        transform: `translate(${pillGeometry.x}px, ${pillGeometry.y}px)`,
                                        background: pillGeometry.color,
                                        pointerEvents: 'none',
                                        zIndex: 0,
                                        willChange: 'transform',
                                        transition: pillAnimated
                                            ? 'transform 0.2s ease, height 0.2s ease, background-color 0.2s ease'
                                            : 'none',
                                    }}
                                />
                            )}
                            <ul className="m-0 list-none pb-6">
                                {navSections.map((sec, si) => {
                                    const heading = navSectionHeading(sec.discipline, sec.license);
                                    const lcNav = licenseColors(sec.license);
                                    return (
                                        <li key={`${sec.discipline ?? '—'}-${sec.license}-${si}`}>
                                            <div>
                                                <div
                                                    className="sticky top-0 z-[2] -ml-2 bg-[var(--bg)] pt-1.5 pr-2 pb-0.5 pl-[calc(0.5rem+8px)] text-[0.8em] font-semibold uppercase tracking-[0.08em]"
                                                    style={{ color: lcNav.text }}
                                                >
                                                    {lcNav.chipBg ? (
                                                        <span
                                                            className="license-c-chip-shape"
                                                            style={{
                                                                background: lcNav.chipBg,
                                                                padding: '0 6px',
                                                            }}
                                                        >
                                                            <span
                                                                className="license-c-chip-shape__inner"
                                                                style={{ display: 'inline-block' }}
                                                            >
                                                                {heading}
                                                            </span>
                                                        </span>
                                                    ) : (
                                                        <span>{heading}</span>
                                                    )}
                                                </div>
                                                {sec.items.map((s) => {
                                                    const flatIdx = originalIndexToFlatIdx.get(s._originalIndex) ?? 0;
                                                    const active = flatIdx === selectedIndex;
                                                    return (
                                                        <NavItem
                                                            key={s.series || flatIdx}
                                                            ref={(el) => {
                                                                navItemRefs.current[flatIdx] = el;
                                                            }}
                                                            s={s}
                                                            flatIdx={flatIdx}
                                                            active={active}
                                                            navInnerRefs={navInnerRefs}
                                                            onNavClick={handleNavClick}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Detail pane — full list */}
                <div className="series-detail relative overflow-visible">
                    {overlayMounted && (
                        <div
                            role="status"
                            aria-label="Loading"
                            className="loading-overlay"
                            style={{ opacity: loading ? 1 : 0, pointerEvents: loading ? 'auto' : 'none' }}
                            onTransitionEnd={(e) => {
                                if (!loading && e.target === e.currentTarget) setOverlayMounted(false);
                            }}
                        >
                            <div className="loading-spinner-wrap">
                                <svg
                                    className="loading-spinner"
                                    viewBox="0 0 200 200"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 80C111.046 80 120 88.9543 120 100C120 111.046 111.046 120 100 120C88.9543 120 80 111.046 80 100C80 88.9543 88.9543 80 100 80Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M100 0C150.267 0 191.87 37.0893 198.939 85.3945C198.955 85.5039 198.972 85.6132 198.987 85.7227C199.024 85.9805 199.06 86.2386 199.095 86.4971C199.114 86.6428 199.133 86.7887 199.152 86.9346C199.179 87.1398 199.205 87.3452 199.23 87.5508C199.255 87.7463 199.279 87.9419 199.302 88.1377C199.324 88.3263 199.346 88.5151 199.367 88.7041C199.395 88.9499 199.421 89.196 199.447 89.4424C199.463 89.594 199.479 89.7457 199.494 89.8975C199.518 90.1358 199.541 90.3744 199.563 90.6133C199.627 91.2981 199.684 91.985 199.733 92.6738C199.752 92.9246 199.77 93.1755 199.786 93.4268C199.798 93.6076 199.809 93.7886 199.819 93.9697C199.832 94.1828 199.844 94.396 199.855 94.6094C199.867 94.8227 199.877 95.0363 199.887 95.25C199.895 95.4253 199.903 95.6008 199.91 95.7764C199.919 95.9966 199.928 96.2169 199.936 96.4375C199.942 96.6203 199.948 96.8033 199.953 96.9863C199.959 97.1929 199.966 97.3996 199.971 97.6064C199.976 97.8494 199.98 98.0926 199.984 98.3359C199.987 98.4872 199.99 98.6386 199.992 98.79C199.997 99.1905 199.999 99.5916 199.999 99.9932C199.999 99.9954 200 99.9977 200 100C200 100.516 199.995 101.031 199.987 101.545C199.985 101.665 199.983 101.785 199.98 101.904C199.973 102.324 199.962 102.742 199.949 103.16C199.947 103.246 199.944 103.331 199.941 103.417C199.888 105.015 199.795 106.604 199.667 108.183C199.66 108.265 199.654 108.347 199.647 108.43C195.367 159.713 152.389 200 100 200C49.3452 200 7.48782 162.337 0.902356 113.486L0.901379 113.485C0.887521 113.382 0.875875 113.279 0.862317 113.176C0.81441 112.812 0.768602 112.447 0.724621 112.082C0.708315 111.947 0.69058 111.811 0.674817 111.676C0.618346 111.19 0.565124 110.704 0.515637 110.216C0.498089 110.043 0.483474 109.87 0.466809 109.696C0.434308 109.359 0.402191 109.02 0.373059 108.682C0.355944 108.483 0.3392 108.283 0.323254 108.084C0.300106 107.795 0.278504 107.505 0.257824 107.215C0.243288 107.011 0.228167 106.807 0.214856 106.603C0.148729 105.588 0.0981576 104.569 0.062512 103.547C0.0580234 103.418 0.0547941 103.289 0.0507932 103.16C0.0376561 102.737 0.0264295 102.313 0.0185666 101.889C0.0168198 101.794 0.0151692 101.7 0.0136838 101.605C0.00527622 101.071 1.19576e-05 100.536 1.19576e-05 100C1.19576e-05 99.9697 -1.4947e-05 99.9394 1.19576e-05 99.9092C0.000328044 99.5559 0.0028747 99.203 0.0068479 98.8506C0.00944574 98.6199 0.0134329 98.3895 0.0175901 98.1592C0.0210209 97.9693 0.0238437 97.7795 0.0283323 97.5898C0.0332176 97.3833 0.0397744 97.1769 0.0459104 96.9707C0.0518457 96.7713 0.0583405 96.5721 0.0654416 96.373C0.0723403 96.1795 0.0799059 95.9862 0.0879026 95.793C0.0972105 95.5682 0.106409 95.3435 0.117199 95.1191C0.125889 94.9383 0.135871 94.7577 0.14552 94.5771C0.157504 94.353 0.170147 94.129 0.183606 93.9053C0.193456 93.7414 0.203241 93.5777 0.213879 93.4141C0.231875 93.1374 0.251255 92.861 0.271496 92.585C0.280711 92.4592 0.290138 92.3336 0.299817 92.208C0.320547 91.9391 0.34337 91.6706 0.366223 91.4023C0.420645 90.7632 0.4805 90.1258 0.546887 89.4902C0.578857 89.1842 0.610796 88.8784 0.64552 88.5732C0.655046 88.4895 0.66606 88.4059 0.675793 88.3223C0.712496 88.0068 0.749442 87.6916 0.789074 87.377C0.815843 87.1644 0.844959 86.9523 0.873059 86.7402C0.891135 86.6038 0.908145 86.4673 0.92677 86.3311C0.963355 86.0634 1.00233 85.7963 1.04103 85.5293C1.05821 85.4108 1.07519 85.2922 1.09279 85.1738C1.12776 84.9385 1.1636 84.7035 1.20021 84.4688C1.22546 84.3068 1.25133 84.1451 1.27736 83.9834C1.31276 83.7635 1.34794 83.5437 1.38478 83.3242C1.41175 83.1636 1.44005 83.0032 1.46779 82.8428C9.60373 35.7893 50.6216 0 100 0ZM27.957 108.244C26.2626 108.244 24.5843 108.302 22.9248 108.414C20.586 108.572 18.9114 110.692 19.2813 113.007C24.4656 145.432 48.7175 171.491 80.1777 179.327C82 179.781 83.8972 178.924 84.7002 177.227C87.4032 171.513 88.8886 165.292 88.8887 158.782C88.8887 156.122 88.6402 153.509 88.1621 150.96C87.8708 149.406 86.653 148.224 85.1436 147.755C69.3238 142.839 56.8704 130.279 52.1035 114.394C51.6863 113.003 50.664 111.852 49.2774 111.423C42.6415 109.367 35.4574 108.244 27.957 108.244ZM172.76 108.244C164.94 108.244 157.465 109.466 150.596 111.691C149.241 112.13 148.243 113.259 147.827 114.621C143.081 130.164 130.967 142.492 115.555 147.532C114.083 148.014 112.899 149.175 112.605 150.695C112.094 153.328 111.828 156.03 111.828 158.782C111.828 165.225 113.283 171.386 115.933 177.053C116.736 178.77 118.656 179.632 120.492 179.158C151.642 171.117 175.594 145.176 180.726 112.959C181.097 110.629 179.398 108.503 177.043 108.367C175.628 108.286 174.2 108.244 172.76 108.244ZM100 75C86.1929 75 75 86.1929 75 100C75 113.807 86.1929 125 100 125C113.807 125 125 113.807 125 100C125 86.1929 113.807 75 100 75ZM100 18.251C66.3482 18.251 37.4458 38.5847 24.9082 67.6357C23.5513 70.7801 26.5061 73.9013 29.834 73.0928C39.3934 70.7703 49.6507 68.9105 60.4385 67.584C61.5079 67.4525 62.4867 66.9253 63.2168 66.1328C72.3538 56.2143 85.4512 50 100 50C114.593 50 127.725 56.2531 136.865 66.2246C137.593 67.0187 138.571 67.5483 139.64 67.6826C150.432 69.0392 160.687 70.9306 170.235 73.2852C173.562 74.1055 176.528 70.9924 175.18 67.8428C162.69 38.6816 133.732 18.251 100 18.251Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </div>
                        </div>
                    )}
                    <div
                        ref={detailPaneRef}
                        className="series-detail-pane absolute inset-0 overflow-y-auto [container-name:detail] [container-type:inline-size] snap-y snap-mandatory"
                    >
                        {showColumns && (
                            <div className="col-overlay pointer-events-none fixed inset-0 z-[100] grid grid-cols-[32ch_minmax(0,2fr)_minmax(0,3fr)] gap-x-8 pr-8">
                                {[0, 1, 2].map((i) => (
                                    <div
                                        key={i}
                                        className="border-x border-[rgba(255,0,128,0.25)] bg-[rgba(255,0,128,0.08)]"
                                    />
                                ))}
                            </div>
                        )}
                        {flatSeries.map((s, idx) => (
                            <SeriesCard
                                key={s.series || idx}
                                ref={(el) => {
                                    seriesRefs.current[idx] = el;
                                }}
                                s={s}
                                idx={idx}
                                showGrid={showGrid}
                                tempUnit={tempUnit}
                            />
                        ))}
                    </div>
                </div>
            </div>
            {/* end page-root grid */}
        </div>
    );
}
