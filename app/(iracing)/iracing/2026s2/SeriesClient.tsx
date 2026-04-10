'use client'
import { useEffect, useLayoutEffect, useMemo, useRef, useState, memo, forwardRef, useCallback } from "react";

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
}

interface TrackInfo {
  name: string | null | undefined;
  layout: string | null | undefined;
  year: string | null;
}

const TRACK_OVERRIDES: Record<string, string> = {
  "Southern National Motorsports Park": "Southern Nat'l",
  "North Wilkesboro Speedway": "N. Wilkesboro",
  "World Wide Technology Raceway (Gateway)": "Gateway",
  "EchoPark Speedway (Atlanta)": "Atlanta",
  "Volusia Speedway Park": "Volusia",
  "Lucas Oil Indianapolis Raceway Park": "Lucas Oil",
  "Kevin Harvick's Kern Raceway": "Kern",
  "Mobility Resort Motegi": "Motegi",
  "Autódromo Hermanos Rodríguez": "Hnos. Rodríguez",
  "Circuit of the Americas": "COTA",
  "Watkins Glen International": "Watkins Glen",
  "Autodromo Internazionale Enzo e Dino Ferrari": "Imola",
  "Shell V-Power Motorsport Park at The Bend": "The Bend",
  "Misano World Circuit Marco Simoncelli": "Misano",
  "Federated Auto Parts Raceway at I-55": "I-55 Raceway",
  "Suzuka International Racing Course": "Suzuka",
  "Circuit de Spa-Francorchamps": "Spa",
  "Circuit Zandvoort": "Zandvoort",
  "Adelaide Street Circuit": "Adelaide",
  "St. Petersburg Grand Prix": "St. Petersburg",
  "Long Beach Street Circuit": "Long Beach",
  "Motorsport Arena Oschersleben": "Oschersleben",
  "WeatherTech Raceway at Laguna Seca": "Laguna Seca",
  "Mid-Ohio Sports Car Course": "Mid-Ohio",
  "Autodromo Internazionale del Mugello": "Mugello",
  "Rudskogen Motorsenter": "Rudskogen",
  "Okayama International Circuit": "Okayama",
  "Chicago Street Course": "Chicago",
  "Chicagoland Speedway": "Chicagoland",
  "Circuit de Nevers Magny-Cours": "Magny-Cours",
  "Miami International Autodrome": "Miami",
  "Autódromo José Carlos Pace": "Interlagos",
  "Hockenheimring Baden-Württemberg": "Hockenheim",
  "Detroit Grand Prix at Belle Isle": "Belle Isle",
  "Sandown International Motor Raceway": "Sandown",
  "MotorLand Aragón": "Aragón",
  "Algarve International Circuit": "Portimão",
  "Autodromo Nazionale Monza": "Monza",
  "Circuit de Barcelona Catalunya": "Barcelona",
  "Circuit Gilles Villeneuve": "Montréal",
  "Nürburgring Grand-Prix-Strecke": "Nürburgring GP",
  "Nürburgring Combined": "Nürburgring",
  "Nürburgring Nordschleife": "Nordschleife",
  "The Dirt Track at Charlotte": "Charlotte Dirt",
  "Canadian Tire Motorsports Park": "Mosport",
  "Circuit des 24 Heures du Mans": "Le Mans",
  "Circuit de Lédenon": "Lédenon",
  "Circuit Zolder": "Zolder",
  "Circuito de Jerez": "Jerez",
  "Circuito de Navarra": "Navarra",
  "Daytona Rallycross and Dirt Road": "Daytona Dirt",
  "Homestead Miami Speedway": "Homestead",
  "LA Coliseum Raceway": "Coliseum",
  "Lånkebanen (Hell RX)": "Hell",
  "The Milwaukee Mile": "Milwaukee",
};

const TRACK_SUFFIXES = [
  " Motorsports Park",
  " Motorsport Park",
  " International Speedway",
  " International Raceway",
  " Motor Speedway",
  " Motor Raceway",
  " Racing Circuit",
  " Superspeedway",
  " Fairgrounds",
  " Speedway",
  " Raceway",
  " Circuit",
];

function shortenTrackName(name: string | null | undefined): string | null | undefined {
  if (!name) return name;
  if (TRACK_OVERRIDES[name]) return TRACK_OVERRIDES[name];
  let s = name;
  let changed = true;
  while (changed) {
    changed = false;
    for (const suffix of TRACK_SUFFIXES) {
      if (s.endsWith(suffix)) { s = s.slice(0, -suffix.length); changed = true; break; }
    }
  }
  return s;
}

// Series where cars mode is active but track is the primary display (car is secondary)
const TRACK_PRIMARY_SERIES = new Set([
  "eNASCAR Coca Cola iRacing Qualifying Series",
]);

const LAYOUT_ABBR: Record<string, string> = {
  "Industriefahrten": "Indus.",
};

const CAR_ABBR: Record<string, string> = {
  "Skip Barber Formula 2000": "Skip Barber F2000",
  "Street Stock": "Street Stocks",
  "GT3": "GT3 Cars",
  "GT4": "GT4 Cars",
  "NASCAR Truck": "NASCAR Trucks",
  "NASCAR O'Reilly": "O'Reilly Cars",
  "NASCAR Cup Series Next Gen": "Next Gen Cars",
  "NASCAR Cup Chevrolet Impala COT - 2009": "Impala COT",
};

function formatLegacyTrack(trackName: string | null | undefined, trackLayout: string | null | undefined): TrackInfo {
  if (!trackName || !trackName.startsWith("[Legacy]")) return { name: shortenTrackName(trackName), layout: trackLayout, year: null };
  const rawName = trackName.replace(/^\[Legacy\]\s*/, "");
  let layout = trackLayout;
  let year: string | null = null;
  if (trackLayout) {
    const m = trackLayout.match(/^(\d{4})\s*-\s*(.+)$/);
    if (m) { year = m[1]; layout = m[2].trim(); }
  }
  return { name: shortenTrackName(rawName), year, layout };
}

const CADENCE_HIGHLIGHT = /(:?\d{1,2}(?::\d{2})?(?:\s*(?:GMT|past|after))?|\bhour(?:ly)?\b|\bhours?\b|\bminutes?\b|\btop of the hour\b|\bhalf past\b|\bon the hour\b)/gi;

const LICENSE_COLORS: Record<string, { text: string; border: string; bg: string; textShadow?: string }> = {
  Rookie: { text: "var(--license-rookie)", border: "var(--license-rookie)", bg: "var(--bg)" },
  D:      { text: "var(--license-d)",      border: "var(--license-d)",      bg: "var(--bg)" },
  C:      { text: "var(--license-c)",      border: "var(--license-c)",      bg: "var(--bg)", textShadow: "var(--license-c-text-shadow)" },
  B:      { text: "var(--license-b)",      border: "var(--license-b)",      bg: "var(--bg)" },
  A:      { text: "var(--license-a)",      border: "var(--license-a)",      bg: "var(--bg)" },
};
const DEFAULT_COLORS = { text: "var(--license-a)", border: "var(--license-a)", bg: "var(--bg)" };

function licenseColors(licenseClass: string | null) {
  return LICENSE_COLORS[licenseClass ?? ""] ?? DEFAULT_COLORS;
}

function CarItem({ car }: { car: string }) {
  return (
    <div className="car-item">
      <span style={{ color: "var(--fg-body)", fontSize: "calc(18px * var(--scale))", fontStyle: "italic", textWrap: "balance" } as React.CSSProperties}>{car}</span>
      <div className="car-decoration" />
    </div>
  );
}

function highlightCadence(text: string, color: string, textShadow?: string) {
  const parts = text.split(CADENCE_HIGHLIGHT);
  return parts.map((part, i) => {
    if (i % 2 === 1) return <span key={i} style={{ color, fontWeight: 700, textShadow }}>{part}</span>;
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
  let x = 0, y = 0;
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

const FILLER = new Set(["series", "iracing", "racing", "official", "the", "championship", "season"]);

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .split(/\s+/)
    .filter(word => !FILLER.has(word))
    .join(" ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildSlugMap(series: SeriesWithIndex[]): Map<number, string> {
  // First pass: generate base slugs
  const slugs = series.map(s => toSlug(s.series));

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
      const fillerWords = words.filter(w => FILLER.has(w));
      let resolved = false;
      for (const filler of fillerWords) {
        // Insert filler back at its original position
        const candidate = words
          .filter(w => !FILLER.has(w) || w === filler)
          .join(" ")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        // Check if this candidate is unique across all series
        const taken = slugs.some((s, i) => s === candidate && !indices.includes(i));
        if (!taken && !indices.some(i2 => i2 !== idx && slugs[i2] === candidate)) {
          slugs[idx] = candidate;
          resolved = true;
          break;
        }
      }
      if (!resolved) {
        // toSlug without filler stripping — intentionally keeps all words
        slugs[idx] = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
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

const NavItem = memo(forwardRef<HTMLDivElement, NavItemProps>(function NavItem(
  { s, flatIdx, active, navInnerRefs, onNavClick }, ref
) {
  return (
    <div
      className={`series-nav-item${active ? " series-nav-item--active" : ""}`}
      ref={ref}
      onClick={() => onNavClick(flatIdx)}
      style={{
        padding: 0,
        cursor: "pointer",
        fontSize: "0.88em",
        color: "var(--fg)",
        fontWeight: 400,
        display: "flex",
        minWidth: 0,
        transition: "color 0.15s",
      }}
    >
      <span
        className="nav-inner"
        ref={(el) => { navInnerRefs.current[flatIdx] = el; }}
        style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem", padding: "0.45rem 0.5rem", minWidth: 0, flex: "0 1 auto", overflow: "hidden" }}>
        <span style={{ flexShrink: 0, display: "flex", alignItems: "center", height: "1.4em", color: "var(--fg-dim)", transition: "color 0.15s" }}>
          <svg width="10" height="10" viewBox="0 0 10 10">
            {s.setup === "Fixed"
              ? <circle cx="5" cy="5" r="3.5" fill="currentColor" />
              : <circle cx="5" cy="5" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />}
          </svg>
        </span>
        {s.series ? (() => {
          const idx = s.series.indexOf(" - ");
          if (idx >= 0) {
            return (
              <span className="nav-label" style={{ display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
                <span>{s.series.slice(0, idx)}</span>
                <span style={{ fontWeight: 300 }}>{s.series.slice(idx + 3).replace(/ - /g, " ")}</span>
              </span>
            );
          }
          return <span className="nav-label">{s.series}</span>;
        })() : <span className="nav-label" style={{ color: "var(--fg-dim)" }}>(Unnamed)</span>}
      </span>
    </div>
  );
}));

interface SeriesCardProps {
  s: SeriesWithIndex;
  idx: number;
  showGrid: boolean;
}

const SeriesCard = memo(forwardRef<HTMLDivElement, SeriesCardProps>(function SeriesCard({ s, idx, showGrid }, ref) {
  const lc = licenseColors(s.license_class);
  const weeks = s.weeks || [];
  const durations = weeks.map(w => w.laps != null ? `${w.laps} laps` : w.race_time ?? null);
  const uniqueDurations = new Set(durations.filter(Boolean));
  const uniformDuration = uniqueDurations.size === 1 && durations.every(d => d !== null) ? [...uniqueDurations][0] : null;

  const segmentKey = (segs: Segment[]) => segs.map(s => `${s.type}:${s.laps}`).join("|");
  const weeksWithSegs = weeks.filter(w => Array.isArray(w.segments) && w.segments.length > 0);
  const uniformSegments = weeksWithSegs.length > 0 && new Set(weeksWithSegs.map(w => segmentKey(w.segments))).size === 1
    ? weeksWithSegs[0].segments : null;

  const uniformFuel = (() => {
    const allWeekCodes = [...new Set(weeks.flatMap(w => Object.keys(w.car_balance || {})))];
    if (!allWeekCodes.length) return null;
    const fuelVals = allWeekCodes
      .map(c => weeks.map(w => w.car_balance?.[c]?.fuel_pct ?? null).find(v => v != null) ?? null)
      .filter(v => v != null) as number[];
    if (!fuelVals.length) return null;
    const unique = new Set(fuelVals);
    if (unique.size !== 1) return null;
    const hasOtherBop = allWeekCodes.some(c =>
      weeks.some(w => {
        const b = w.car_balance?.[c];
        return b && (b.ballast_kg != null || b.power_pct != null);
      })
    );
    return hasOtherBop ? null : [...unique][0];
  })();

  const uniformTireSets = (() => {
    const allWeekCodes = [...new Set(weeks.flatMap(w => Object.keys(w.car_balance || {})))];
    if (!allWeekCodes.length) return null;
    const hasOtherBop = allWeekCodes.some(c =>
      weeks.some(w => {
        const b = w.car_balance?.[c];
        return b && (b.fuel_pct != null || b.ballast_kg != null || b.power_pct != null);
      })
    );
    if (hasOtherBop) return null;
    const tireCounts = allWeekCodes
      .map(c => weeks.map(w => w.car_balance?.[c]?.tire_sets ?? null).find(v => v != null) ?? null)
      .filter(v => v != null);
    if (!tireCounts.length) return null;
    const unique = new Set(tireCounts);
    return unique.size === 1 ? [...unique][0] : null;
  })();

  return (
    <div
      ref={ref}
      data-series-idx={idx}
      style={{
        ["--accent" as string]: lc.text,
        marginTop: 0,
        marginBottom: 0,
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        paddingTop: "4rem",
        paddingBottom: "4rem",
        scrollSnapAlign: "start",
        backgroundImage: showGrid ? "repeating-linear-gradient(to bottom, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, transparent 1px, transparent 26px)" : "none",
      }}
    >
      <div className="series-body">
      {/* Meta */}
      <div className="series-meta">
      <h2 style={{ margin: "0 0 1rem", fontSize: "calc(40px * var(--scale))", lineHeight: "0.975", fontWeight: 900, fontStyle: "italic", color: "var(--fg)" }}>
        {(() => {
          const idx = s.series?.indexOf(" - ");
          if (idx != null && idx >= 0) {
            return (<>{s.series.slice(0, idx)}<span style={{ fontWeight: 300 }}>{" "}{s.series.slice(idx + 3).replace(/ - /g, " ")}</span></>);
          }
          return s.series;
        })()}
      </h2>
      {process.env.NODE_ENV === 'development' && s.flags && s.flags.length > 0 && (
        <div style={{ marginBottom: "1rem", padding: "0.5rem 0.75rem", background: "rgba(242, 127, 27, 0.1)", border: "1px solid var(--license-d)", borderRadius: 6, fontSize: "calc(13px * var(--scale))", lineHeight: 1.5 }}>
          <span style={{ fontWeight: 700, color: "var(--license-d)" }}>Validation flags</span>
          <ul style={{ margin: "0.25rem 0 0", padding: "0 0 0 1.25rem", color: "var(--fg-secondary)" }}>
            {s.flags.map((f) => (
              <li key={`${f.week}-${f.field}`}>Week {f.week} · <span style={{ fontWeight: 600 }}>{f.field}</span> — {f.reason}</li>
            ))}
          </ul>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", marginBottom: "1.75rem" }}>
        {(s.discipline || s.license_class || s.setup) && (
          <div className="disc-row" style={{ display: "flex", alignItems: "baseline", gap: "8px", fontSize: "calc(18px * var(--scale))", lineHeight: "1.44", fontWeight: 600, fontStyle: "italic", color: licenseColors(s.license_class).text, textShadow: licenseColors(s.license_class).textShadow, marginBottom: "1.44em", flexWrap: "wrap" }}>
            {[s.discipline, s.license_class && (s.license_class === "Rookie" ? "Rookie" : `${s.license_class} Class`), s.setup].filter(Boolean).flatMap((item, i, arr) =>
              i < arr.length - 1 ? [<span key={i}>{item}</span>, <span key={`sep-${i}`} style={{ color: "var(--fg)", opacity: 0.4 }}>{"//"}</span>] : [<span key={i}>{item}</span>]
            )}
          </div>
        )}
        {s.schedule_mode === "cars" ? (
          (() => {
            const weeksWithCars = (s.weeks || []).filter(w => w.cars_in_use && w.cars_in_use.length > 0);
            const seen = new Set<string>();
            const allCars = weeksWithCars.flatMap(w => w.cars_in_use).filter(car => seen.has(car) ? false : (seen.add(car), true));
            return allCars.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "calc(8px * var(--scale))", marginBottom: "1.44em" }}>
                {allCars.map((car, i) => (
                  <CarItem key={`${car}-${i}`} car={car} />
                ))}
              </div>
            ) : null;
          })()
        ) : (s.cars || []).length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "calc(8px * var(--scale))", marginBottom: "1.44em" }}>
            {s.cars.map((car) => (
              <CarItem key={car} car={car} />
            ))}
          </div>
        )}
        {uniformFuel != null && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.44em" }}>
            <span style={{ fontSize: "calc(15px * var(--scale))", fontStyle: "italic", fontWeight: 600, color: "var(--fg-subtle)", letterSpacing: "0.04em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.4em" }}>
              Cars start with
              <span style={{ display: "inline-flex", alignItems: "center", gap: 0 }}>
                <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", flexShrink: 0 }}>
                  {(() => {
                    const r = 12;
                    const circ = 2 * Math.PI * r;
                    const filled = (uniformFuel / 100) * circ;
                    return (
                      <svg width="28" height="28" style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
                        <circle cx="14" cy="14" r={r} fill="none" stroke="currentColor" strokeOpacity={0.2} strokeWidth="2.5" />
                        <circle cx="14" cy="14" r={r} fill="none" stroke="currentColor" strokeOpacity={0.8} strokeWidth="2.5"
                          strokeDasharray={`${filled} ${circ}`} strokeLinecap="round" />
                      </svg>
                    );
                  })()}
                  <span style={{ position: "relative", fontWeight: 800, fontSize: "0.75em", letterSpacing: 0, textTransform: "none", lineHeight: 1 }}>
                    <span style={{ width: 0, overflow: "visible", display: "inline-flex", justifyContent: "center" }}>{uniformFuel}</span>
                  </span>
                </span>
                <span>% fuel</span>
              </span>
            </span>
          </div>
        )}
        {uniformTireSets != null && (
          <div style={{ fontSize: "calc(16px * var(--scale))", lineHeight: "1.625", fontStyle: "italic", color: "var(--fg-body)", marginBottom: "1.44em" }}>
            {`${uniformTireSets} tire set${uniformTireSets !== 1 ? "s" : ""}`}
          </div>
        )}
        {s.race_cadence && (
          <div className="cadence-highlight" style={{ fontSize: "calc(16px * var(--scale))", lineHeight: "1.625", fontStyle: "italic", color: "var(--fg-body)" }}>
            {highlightCadence(s.race_cadence, licenseColors(s.license_class).text, licenseColors(s.license_class).textShadow)}
          </div>
        )}
        {s.qualifying_cadence && (
          <div className="cadence-highlight" style={{ fontSize: "calc(16px * var(--scale))", lineHeight: "1.625", fontStyle: "italic", color: "var(--fg-body)" }}>
            {highlightCadence(s.qualifying_cadence, licenseColors(s.license_class).text, licenseColors(s.license_class).textShadow)}
          </div>
        )}
        {uniformDuration && (
          <div style={{ fontSize: "calc(16px * var(--scale))", lineHeight: "1.625", fontStyle: "italic", color: "var(--fg-body)" }}>
            All races are <span style={{ fontWeight: 700, color: lc.text, textShadow: lc.textShadow }}>{uniformDuration}</span>
          </div>
        )}
        {uniformSegments && (
          <div style={{ fontSize: "calc(16px * var(--scale))", lineHeight: "1.625", fontStyle: "italic", color: "var(--fg-body)", display: "flex", flexDirection: "column" }}>
            {uniformSegments.map((seg, i) => {
              const label = seg.type === "heat" ? "Heat" : seg.type === "consolation" ? "Consolation" : seg.type === "feature" ? "Feature" : seg.type.charAt(0).toUpperCase() + seg.type.slice(1);
              return <span key={i}>{label}: {seg.laps} laps</span>;
            })}
          </div>
        )}
        <div className="entries-info" style={{ display: "flex", flexDirection: "column", fontSize: "calc(16px * var(--scale))", lineHeight: "1.625", fontStyle: "italic", color: "var(--fg-body)", marginTop: "1.625em" }}>
          {s.min_entries != null && <>
            <span>{`Official at ${s.min_entries} entries, splits at ${s.split_at}`}</span>
            <span>{`${s.drops} drop weeks allowed`}</span>
          </>}
          {s.incident_penalty != null && (
            <span>{s.incident_penalty_repeat != null ? `Drive-through at ${s.incident_penalty} incidents, then every ${s.incident_penalty_repeat}` : `Drive-through every ${s.incident_penalty} incidents`}</span>
          )}
          {s.incident_dq != null && (
            <span>{`Disqualified at ${s.incident_dq} incidents`}</span>
          )}
        </div>
      </div>
      </div>{/* end series-meta */}

      {/* Schedule */}
      <div className="series-schedule">
      <div>
        {(s.weeks || []).map((w, wi) => {
          const isLast = wi === (s.weeks || []).length - 1;
          const { name: displayName, year: legacyYear, layout: displayLayout } = formatLegacyTrack(w.track_name || w.track, w.track_layout);
          const carsFeatured = s.schedule_mode === "cars" && !!w.car_group_label && !TRACK_PRIMARY_SERIES.has(s.series);
          return (
            <div key={w.week ?? wi} style={{ display: "grid", gridTemplateColumns: "calc(42px * var(--scale)) 1fr", columnGap: "calc(8px * var(--scale))", gridTemplateRows: "30px 14px 8px", height: "52px", overflow: "visible" }}>
              {/* Week number */}
              <div
                style={{
                  gridColumn: 1, gridRow: 1,
                  color: "var(--fg-dim)",
                  fontWeight: 300, fontStyle: "italic", fontSize: "calc(38px * var(--scale))", lineHeight: "30px", letterSpacing: "-0.04em",
                  textAlign: "left",
                }}
              >
                {String(w.week).padStart(2, "0")}
              </div>
              {/* Primary label: car group (car-featured) or track name (default) */}
              <div style={{ gridColumn: 2, gridRow: 1, whiteSpace: "nowrap" }}>
                <span style={{ fontWeight: 800, fontStyle: "italic", fontSize: "calc(38px * var(--scale))", lineHeight: "30px", letterSpacing: "-0.02em", textTransform: "uppercase", color: "var(--fg)" }}>
                  {carsFeatured ? (CAR_ABBR[w.car_group_label] ?? w.car_group_label) : displayName}
                </span>{!carsFeatured && legacyYear && <span style={{ fontWeight: 300, fontStyle: "italic", fontSize: "calc(38px * var(--scale))", lineHeight: "30px", color: "var(--fg-dim)", opacity: 0.5, letterSpacing: "-0.03em" }}>{" "}{legacyYear}</span>}
              </div>
              {/* Date */}
              <div style={{
                gridColumn: 1, gridRow: 2,
                fontSize: "calc(12px * var(--scale))", lineHeight: "1.17", fontStyle: "italic", color: "var(--fg-dim)",  opacity: 0.5,
                textAlign: "left", letterSpacing: "0.08em",
              }}>
                {w.event_date && (() => {
                  const d = new Date(w.event_date + "T00:00:00");
                  const mon = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
                  const day = d.toLocaleDateString("en-US", { day: "2-digit" });
                  return `${mon}${day}`;
                })()}
              </div>
              {/* Metadata */}
              <div style={{ gridColumn: 2, gridRow: 2, fontSize: "calc(12px * var(--scale))", lineHeight: "1.17", fontStyle: "italic", color: "var(--fg)", display: "flex", flexWrap: "nowrap", gap: "4px", alignItems: "baseline", overflow: "hidden" }}>
                  {(() => {
                    const parts: React.ReactNode[] = [];
                    if (carsFeatured) {
                      const trackLabel = displayName ?? "";
                      const layoutAbbr = displayLayout ? LAYOUT_ABBR[displayLayout] : undefined;
                      const trackWithLayout = layoutAbbr
                        ? `${trackLabel} ${layoutAbbr}`
                        : displayLayout ? `${trackLabel} ${displayLayout}` : trackLabel;
                      if (trackWithLayout) parts.push(
                        <span key="track" style={{ fontWeight: 800, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.02em", whiteSpace: "nowrap", flexShrink: 0 }}>
                          {trackWithLayout}{legacyYear && <span style={{ color: "var(--fg-dim)", opacity: 0.5 }}>{" "}{legacyYear}</span>}
                        </span>
                      );
                    } else {
                      const trackPrimaryCarLabel = s.schedule_mode === "cars" && !!w.car_group_label && TRACK_PRIMARY_SERIES.has(s.series)
                        ? (CAR_ABBR[w.car_group_label] ?? w.car_group_label)
                        : null;
                      const secondaryLabel = trackPrimaryCarLabel ?? displayLayout ?? null;
                      if (secondaryLabel) parts.push(
                        <span key="layout" style={{ fontWeight: 800, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.02em", whiteSpace: "nowrap", flexShrink: 0 }}>
                          {secondaryLabel}
                        </span>
                      );
                    }
                    if (w.weather && (w.weather.air_temperature_c != null || w.weather.chance_of_rain)) {
                      const hasTemp = w.weather.air_temperature_c != null;
                      const rain = w.weather.chance_of_rain && w.weather.chance_of_rain !== "None" ? w.weather.chance_of_rain : null;
                      if (hasTemp || rain) {
                        parts.push(
                          <span key="weather" style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
                            {hasTemp && <span style={{ color: lc.text, fontWeight: 800, textShadow: lc.textShadow }}>{w.weather.air_temperature_c}°C</span>}
                            {rain && <span style={{ display: "inline-flex", alignItems: "center", gap: "2px", color: "var(--license-a)", marginLeft: hasTemp ? "4px" : undefined }}>
                              <svg width="6" height="8" viewBox="0 0 22 30" fill="currentColor" style={{ flexShrink: 0, position: "relative", top: "-1px" }}><path d="M1.71313 24.2173C-0.96344 20.1073 -0.462191 14.6962 2.9238 11.1478L13.4318 0.135688C13.6479 -0.0907149 14.0247 -0.0242619 14.1503 0.262377L20.2583 14.2043C22.2264 18.6968 20.8467 23.953 16.9259 26.8998C12.0341 30.5761 5.05248 29.3451 1.71313 24.2173Z"/></svg>
                              <span style={{ fontWeight: 800 }}>{rain}</span>
                            </span>}
                          </span>
                        );
                      }
                    }
                    const nowrap = (key: string, content: string) => <span key={key} style={{ whiteSpace: "nowrap", flexShrink: 0 }}>{content}</span>;
                    if (!uniformDuration) {
                      if (w.laps != null) parts.push(nowrap("laps", `${w.laps} laps`));
                      else if (w.race_time) parts.push(nowrap("race_time", w.race_time));
                    }
                    if (w.event_date) parts.push(<span key="date" style={{ whiteSpace: "nowrap", flexShrink: 0, opacity: 0.65 }}>{`${w.event_date}${w.event_time ? ` · ${w.event_time}` : ""}`}</span>);
                    return parts.flatMap((p, i) => i === 0 ? [p] : [<span key={`sep-${i}`} style={{ opacity: 0.4, flexShrink: 0 }}>{"//"}</span>, p]);
                  })()}
                </div>
              <div style={{ gridColumn: 2, gridRow: 3, paddingBottom: isLast ? 0 : "7px" }} />
            </div>
          );
        })}
      </div>
      </div>{/* end series-schedule */}

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
          const exceptions = weeks.filter(w => JSON.stringify(w[key]) !== dominant[0]).map(w => w.week);
          return { value, exceptions };
        }

        function exc(exceptions: number[]) {
          if (!exceptions.length) return "";
          return ` (wk ${exceptions.join(", ")} differ)`;
        }

        const gridByClass = seriesVal<boolean>("grid_by_class");
        const minDrivers = seriesVal<number | null>("min_drivers");
        const maxDrivers = seriesVal<number | null>("max_drivers");
        const fairShare = seriesVal<string | null>("fair_share");
        const luckyDog = seriesVal<boolean>("lucky_dog");
        const gwc = seriesVal<number | null>("gwc");
        const restartFile = seriesVal<string | null>("restart_file");
        const restartPos = seriesVal<string | null>("restart_position");
        const startZone = seriesVal<boolean>("start_zone");
        const cautionLaps = seriesVal<boolean>("caution_laps_count");
        const allCodes = [...new Set(weeks.flatMap(w => Object.keys(w.car_balance || {})))];

        const restartParts: string[] = [];
        if (startZone.value) restartParts.push("start zone");
        if (luckyDog.value) restartParts.push("lucky dog");
        if (gwc.value != null) restartParts.push(`${gwc.value}-G/W/C`);
        if (restartFile.value && restartPos.value) {
          restartParts.push(`${restartFile.value}-file ${restartPos.value}`);
        }
        const restartExceptions = [...new Set([
          ...luckyDog.exceptions, ...gwc.exceptions,
          ...restartFile.exceptions, ...restartPos.exceptions, ...startZone.exceptions,
        ])].sort((a, b) => a - b);

        const statements: React.ReactNode[] = [];

        if (gridByClass.value) statements.push(<span key="grid">Grid by class{exc(gridByClass.exceptions)}</span>);
        if (minDrivers.value != null) {
          const driverExc = [...new Set([...minDrivers.exceptions, ...maxDrivers.exceptions])];
          statements.push(<span key="drivers">{minDrivers.value}–{maxDrivers.value} drivers{exc(driverExc)}</span>);
        }
        if (fairShare.value) statements.push(<span key="fs">Fair share — {fairShare.value}{exc(fairShare.exceptions)}</span>);
        if (cautionLaps.value === false) statements.push(<span key="cl">Caution laps don&apos;t count{exc(cautionLaps.exceptions)}</span>);
        if (restartParts.length) statements.push(<span key="restart">Restarts — {restartParts.join(", ")}{exc(restartExceptions)}</span>);

        const tireGroups = new Map<number, string[]>();
        for (const code of allCodes) {
          const domFuel = weeks.map(w => w.car_balance?.[code]?.fuel_pct ?? null).find(v => v != null) ?? null;
          const domBallast = weeks.map(w => w.car_balance?.[code]?.ballast_kg ?? null).find(v => v != null) ?? null;
          const domPower = weeks.map(w => w.car_balance?.[code]?.power_pct ?? null).find(v => v != null) ?? null;
          const domTires = weeks.map(w => w.car_balance?.[code]?.tire_sets ?? null).find(v => v != null) ?? null;
          const bopParts: string[] = [];
          if (domFuel != null && uniformFuel == null) bopParts.push(`fuel ${domFuel}%`);
          if (domBallast != null) bopParts.push(`+${domBallast}kg`);
          if (domPower != null) bopParts.push(`${domPower > 0 ? "+" : ""}${domPower}% pwr`);
          if (bopParts.length) statements.push(<span key={`bop-${code}`}><span style={{ fontWeight: 700 }}>{code}</span> {bopParts.join(", ")}</span>);
          if (domTires != null && uniformTireSets == null) {
            if (!tireGroups.has(domTires)) tireGroups.set(domTires, []);
            tireGroups.get(domTires)!.push(code);
          }
        }
        for (const [count, codes] of [...tireGroups.entries()].sort((a, b) => a[0] - b[0])) {
          statements.push(
            <span key={`tires-${count}`}>
              {`${count} tire set${count !== 1 ? "s" : ""}`}
              {": "}
              <span style={{ fontWeight: 700 }}>{codes.join(" ")}</span>
            </span>
          );
        }

        if (!statements.length) return null;

        const proseStyle: React.CSSProperties = {
          fontSize: "calc(14px * var(--scale))",
          lineHeight: "1.7",
          color: "var(--fg-secondary)",
          fontStyle: "italic",
        };

        return (
          <div className="race-info" style={{ marginTop: "0.5rem" }}>
            <div className="race-info-inner" style={{ borderTop: "1px solid var(--border)", paddingTop: "0.75rem" }}>
              <p style={proseStyle}>
                {statements.map((stmt, i) => (
                  <span key={i}>{stmt}{i < statements.length - 1 ? ". " : "."}</span>
                ))}
              </p>
            </div>
          </div>
        );
      })()}
      </div>{/* end series-body */}
    </div>
  );
}));

export default function SeriesClient({ series }: SeriesClientProps) {
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
  const selectionTrigger = useRef<"click" | "scroll">("scroll");
  const navScrollRef = useRef<HTMLDivElement | null>(null);
  const navInnerRefs = useRef<Record<number, HTMLSpanElement | null>>({});
  const flatSeriesRef = useRef<SeriesWithIndex[]>([]);
  const slugMapRef = useRef<Map<number, string>>(new Map());
  const suppressScroll = useRef(false);
  const navRafRef = useRef<{ id: number } | null>(null);
  const hasMountedRef = useRef(false);
  const [pillGeometry, setPillGeometry] = useState<{ x: number; y: number; w: number; h: number; radius: number; color: string } | null>(null);
  const [pillAnimated, setPillAnimated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.dataset.theme === "dark";
    setDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    document.cookie = `theme=${next ? "dark" : "light"};path=/;max-age=31536000`;
  };


  useEffect(() => {
    const pane = detailPaneRef.current;
    if (!pane) return;

    const computeScale = () => {
      const scale = Math.min(1.00, Math.max(0.70, 0.70 + (window.innerWidth - 375) / 825 * 0.30));
      pane.style.setProperty("--scale", scale.toFixed(4));
    };
    computeScale();

    let resizing = false;
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      resizing = true;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizing = false;
        computeScale();
        requestAnimationFrame(() => {
          seriesRefs.current[selectedIndexRef.current]?.scrollIntoView({ behavior: "instant", block: "start" });
        });
      }, 150);
    };
    window.addEventListener("resize", handleResize);

    const handleScroll = () => {
      if (resizing || suppressScroll.current) return;
      const trigger = pane.getBoundingClientRect().top + pane.clientHeight * 0.4;
      let activeIdx = 0;
      Object.entries(seriesRefs.current).forEach(([key, el]) => {
        if (el && el.getBoundingClientRect().top <= trigger) {
          activeIdx = Math.max(activeIdx, parseInt(key, 10));
        }
      });
      selectionTrigger.current = "scroll";
      setSelectedIndex(activeIdx);
      selectedIndexRef.current = activeIdx;
    };

    pane.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      pane.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  useEffect(() => {
    if (selectionTrigger.current !== "scroll") return;

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
    const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
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
    if (!hasMountedRef.current) { hasMountedRef.current = true; return; }
    const slug = slugMapRef.current.get(selectedIndex);
    if (slug) history.replaceState(null, "", "#" + slug);
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
    const handler = (e: MouseEvent) => { if (e.altKey) setShowGrid((v) => !v); };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  const [showColumns, setShowColumns] = useState(false);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "g" && !e.metaKey && !e.ctrlKey && !e.altKey && (e.target as HTMLElement).tagName !== "INPUT") {
        setShowColumns((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!navOpen) return;
    const handler = (e: MouseEvent) => {
      if (navRef.current?.contains(e.target as Node)) return;
      if (navToggleRef.current?.contains(e.target as Node)) return;
      setNavOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [navOpen]);

  const hierarchy = useMemo(() => {
    const h: Record<string, Record<string, SeriesWithIndex[]>> = {};
    series.forEach((s, i) => {
      const d = s.discipline || "Other";
      const l = s.license_class || "Other";
      if (!h[d]) h[d] = {};
      if (!h[d][l]) h[d][l] = [];
      h[d][l].push({ ...s, _originalIndex: i });
    });
    return h;
  }, [series]);

  const flatSeries = useMemo(() => {
    const flat: SeriesWithIndex[] = [];
    Object.values(hierarchy).forEach((licenses) => {
      Object.values(licenses).forEach((seriesArr) => {
        seriesArr.forEach((s) => flat.push(s));
      });
    });
    return flat;
  }, [hierarchy]);

  // Map from _originalIndex → flatSeries position, used by nav item click handler
  const originalIndexToFlatIdx = useMemo(() => {
    const map = new Map<number, number>();
    flatSeries.forEach((s, i) => map.set(s._originalIndex, i));
    return map;
  }, [flatSeries]);

  // Stable click handler — all captured values are refs or stable state setters
  const handleNavClick = useCallback((flatIdx: number) => {
    const delta = Math.abs(flatIdx - selectedIndexRef.current);
    selectionTrigger.current = "click";
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
      pane.style.scrollSnapType = "y mandatory";
    }
    if (delta <= 3 && pane) {
      const targetScrollTop = targetEl.offsetTop;
      const startScrollTop = pane.scrollTop;
      const duration = 280;
      const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const raf = { id: 0 };
      navRafRef.current = raf;
      let startTime = -1;
      pane.style.scrollSnapType = "none";
      const step = (now: number) => {
        if (startTime < 0) startTime = now;
        const t = Math.min(1, (now - startTime) / duration);
        pane.scrollTop = startScrollTop + (targetScrollTop - startScrollTop) * ease(t);
        if (t < 1) {
          raf.id = requestAnimationFrame(step);
        } else {
          navRafRef.current = null;
          pane.style.scrollSnapType = "y mandatory";
          suppressScroll.current = false;
        }
      };
      raf.id = requestAnimationFrame(step);
    } else {
      targetEl.scrollIntoView({ behavior: "instant", block: "start" });
      suppressScroll.current = false;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    flatSeriesRef.current = flatSeries;
    slugMapRef.current = buildSlugMap(flatSeries);
  }, [flatSeries]);

  useLayoutEffect(() => {
    const hash = window.location.hash.slice(1); // strip leading #

    const entry = hash
      ? [...slugMapRef.current.entries()].find(([, slug]) => slug === hash)
      : undefined;

    if (entry) {
      const [targetIndex] = entry;
      suppressScroll.current = true;
      selectionTrigger.current = "click";
      setSelectedIndex(targetIndex);
      selectedIndexRef.current = targetIndex;
      seriesRefs.current[targetIndex]?.scrollIntoView({ behavior: "instant", block: "start" });
      suppressScroll.current = false;
      let cancelled = false;
      Promise.all([
        document.fonts.ready,
        new Promise(resolve => setTimeout(resolve, 600)),
      ]).then(() => { if (!cancelled) setLoading(false); });
      return () => { cancelled = true; };
    } else {
      // No hash — wait for fonts + minimum hold so the loading state is visible
      let cancelled = false;
      Promise.all([
        document.fonts.ready,
        new Promise(resolve => setTimeout(resolve, 600)),
      ]).then(() => { if (!cancelled) setLoading(false); });
      return () => { cancelled = true; };
    }
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      {/* Page header */}
      <div className="page-header" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem", background: "var(--bg)", zIndex: 20, flexShrink: 0, height: "4.5rem", boxSizing: "border-box" }}>
        <button className="series-nav-toggle" ref={navToggleRef} style={{ pointerEvents: "auto", flexShrink: 0 }} onClick={() => setNavOpen((v) => !v)} aria-label={navOpen ? "Close navigation" : "Open navigation"}>
          {navOpen
            ? <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><line x1="3" y1="3" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="15" y1="3" x2="3" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            : <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><line x1="3" y1="5" x2="15" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="9" x2="15" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="13" x2="15" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          }
        </button>
        <div style={{ flex: 1, fontWeight: 700, fontSize: "1.1em", color: "var(--fg)", lineHeight: 1.2 }}>
          iRacing Official Schedule<br /><span style={{ fontWeight: 400, fontSize: "0.8em", color: "var(--fg-muted)" }}>2026 Season 2</span>
        </div>
        <button
          onClick={toggleTheme}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", color: "var(--fg-body)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px" }}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode
            ? <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="4" stroke="currentColor" strokeWidth="1.5"/><line x1="9" y1="1" x2="9" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="9" y1="15" x2="9" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="1" y1="9" x2="3" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="15" y1="9" x2="17" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="3.05" y1="3.05" x2="4.46" y2="4.46" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="13.54" y1="13.54" x2="14.95" y2="14.95" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="3.05" y1="14.95" x2="4.46" y2="13.54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="13.54" y1="4.46" x2="14.95" y2="3.05" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            : <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M15 10.5A6.5 6.5 0 0 1 7.5 3a6.5 6.5 0 1 0 7.5 7.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          }
        </button>
      </div>

      {/* Content grid */}
      <div className="page-root" style={{ display: "grid", gridTemplateColumns: "32ch minmax(0, 2fr) minmax(0, 3fr)", gridTemplateRows: "1fr", columnGap: "32px", flex: 1, minHeight: 0 }}>

      {/* Modal backdrop (mobile only) */}
      {navOpen && <div className="nav-backdrop" onClick={() => setNavOpen(false)} />}

      {/* Sidebar */}
      <div className={`series-nav-wrap${navOpen ? " series-nav-wrap--open" : ""}`} ref={navRef}>
      <div className={`series-nav${navOpen ? " series-nav--open" : ""}`} style={{ minWidth: 0, position: "relative" }}>
        <div className="series-nav-scroll" ref={navScrollRef} style={{ position: "absolute", inset: 0, overflowY: "auto", paddingLeft: "8px" }}>
        {pillGeometry && (
          <div
            className="nav-pill"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: pillGeometry.w,
              height: pillGeometry.h,
              borderRadius: pillGeometry.radius,
              transform: `translate(${pillGeometry.x}px, ${pillGeometry.y}px)`,
              background: pillGeometry.color,
              pointerEvents: "none",
              zIndex: 0,
              willChange: "transform",
              transition: pillAnimated
                ? "transform 0.2s ease, height 0.2s ease, background-color 0.2s ease"
                : "none",
            }}
          />
        )}
        <ul style={{ listStyle: "none", padding: "0 0 3rem 0", margin: 0 }}>
          {Object.entries(hierarchy).map(([discipline, licenses]) => (
              <li key={discipline}>
                {Object.entries(licenses).map(([license, seriesArr]) => (
                  <div key={license}>
                    <div style={{ padding: "1rem 0.5rem 0.2rem 0.5rem", marginLeft: "-8px", paddingLeft: "calc(0.5rem + 8px)", fontSize: "0.85em", fontWeight: 600, color: licenseColors(license).text, textShadow: licenseColors(license).textShadow, letterSpacing: "0.08em", textTransform: "uppercase", position: "sticky", top: 0, background: "var(--bg)", zIndex: 2 }}>
                      <span>{discipline} {license}</span>
                    </div>
                    {seriesArr.map((s) => {
                      const flatIdx = originalIndexToFlatIdx.get(s._originalIndex) ?? 0;
                      const active = flatIdx === selectedIndex;
                      return (
                        <NavItem
                          key={s.series || flatIdx}
                          ref={(el) => { navItemRefs.current[flatIdx] = el; }}
                          s={s}
                          flatIdx={flatIdx}
                          active={active}
                          navInnerRefs={navInnerRefs}
                          onNavClick={handleNavClick}
                        />
                      );
                    })}
                  </div>
                ))}
              </li>
            ))}
        </ul>
        </div>
      </div>
      </div>

      <style suppressHydrationWarning>{`
        .series-nav-wrap { display: flex; flex-direction: column; }
        .series-nav { background: var(--bg); flex: 1; min-height: 0; }
        .series-detail { grid-column: 2 / 4; }
        .series-detail { --scale: clamp(0.70, calc(0.70 + (100vw - 375px) / 825px * 0.30), 1.00); transition: opacity 0.2s ease; }
        .series-nav-scroll > ul, .series-nav-scroll ul { width: 32ch; box-sizing: border-box; }
        .series-nav .nav-label { white-space: nowrap; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
        .series-nav-scroll { scrollbar-width: none; }
        .series-nav-scroll::-webkit-scrollbar { display: none; }
        .series-nav:hover .series-nav-scroll { scrollbar-width: thin; }
        .series-nav:hover .series-nav-scroll::-webkit-scrollbar { display: block; }
        .series-nav-item .nav-inner { position: relative; }
        .series-nav-item:not(.series-nav-item--active):hover .nav-label { text-decoration: underline; }
        .series-nav::after { content: ""; position: absolute; bottom: 0; left: 0; right: 0; height: 3rem; background: linear-gradient(to bottom, transparent, var(--bg)); pointer-events: none; z-index: 3; }
        .series-nav-toggle { display: none; }
        .nav-backdrop { display: none; }
        @media (max-width: 760px) {
          .page-root { grid-template-columns: 1fr !important; column-gap: 0 !important; padding: 0 32px !important; }
          .col-overlay { grid-template-columns: 1fr !important; column-gap: 0 !important; padding: 0 32px !important; }
          .nav-backdrop { display: block; position: fixed; inset: 0; background: var(--backdrop-bg); backdrop-filter: blur(4px); z-index: 9; }
          .series-nav-wrap { width: 32ch !important; position: fixed !important; top: calc(4.5rem + 5vh) !important; bottom: 5vh !important; left: 50% !important; transform: translateX(-50%) !important; visibility: hidden !important; z-index: 10; border-radius: 8px; box-shadow: var(--shadow-nav); background: var(--bg); }
          .series-nav-wrap--open { visibility: visible !important; padding: 2rem; }
          .series-nav { flex: 1 !important; min-height: 0 !important; overflow: hidden; border-radius: 8px; }
          .series-nav-scroll { visibility: hidden; }
          .series-nav--open .series-nav-scroll { visibility: visible; }
          .page-header { padding-left: 0.75rem !important; }
          .series-nav-toggle { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; flex-shrink: 0; background: none; border: none; cursor: pointer; padding: 0; color: var(--fg-body); }
          .series-detail { grid-column: 1; padding: 2rem 1rem; max-width: 440px; margin: 0 auto; width: 100%; }
        }
        .entries-info { text-wrap: pretty; }
        .series-body { display: flex; flex-direction: column; gap: 1.5rem; }
        .car-item { display: flex; align-items: stretch; }
        .car-item span { line-height: 20px; align-self: center; text-wrap: pretty; }
        .car-decoration { display: none; }
        @container detail (min-width: 70ch) {
          .series-body { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 3fr); gap: 32px; align-items: flex-start; }
          .series-meta { text-align: right; }
          .series-meta h2 { text-wrap: pretty; }
          .series-meta .cadence-highlight { justify-content: flex-end; }
          .series-meta .disc-row { justify-content: flex-end; }
          .series-schedule { flex: 1; }
          .car-item { justify-content: flex-end; }
          .car-decoration { display: block; width: 2px; border-radius: 0.5px; background: var(--accent); margin-top: 1px; margin-bottom: 1px; margin-left: 6px; flex-shrink: 0; }
          .race-info { grid-column: 1 / -1; display: flex; justify-content: center; }
          .race-info-inner { max-width: 40ch; width: 100%; text-align: center; }
        }
        .loading-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg);
          transition: opacity 200ms ease-out;
        }
        .loading-spinner {
          width: 64px;
          height: 64px;
          animation: steer 1s ease-in-out infinite alternate;
          background-color: var(--fg-dim);
          opacity: 0.4;
          mask-image: url('/wheel-improved.svg');
          -webkit-mask-image: url('/wheel-improved.svg');
          mask-size: contain;
          -webkit-mask-size: contain;
          mask-repeat: no-repeat;
          -webkit-mask-repeat: no-repeat;
        }
        @keyframes steer {
          0%, 20%   { transform: rotate(20deg); }
          80%, 100% { transform: rotate(-20deg); }
        }
      `}</style>

      {/* Detail pane — full list */}
      <div className="series-detail" ref={detailPaneRef} style={{ overflowY: "auto", padding: "0 32px 2rem 0", scrollSnapType: "y mandatory", containerType: "inline-size", containerName: "detail", position: "relative" }}>
        {overlayMounted && (
          <div
            role="status"
            aria-label="Loading"
            className="loading-overlay"
            style={{ opacity: loading ? 1 : 0, pointerEvents: loading ? "auto" : "none" }}
            onTransitionEnd={(e) => { if (!loading && e.target === e.currentTarget) setOverlayMounted(false); }}
          >
            <div className="loading-spinner" />
          </div>
        )}
        {showColumns && (
          <div className="col-overlay" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 100, display: "grid", gridTemplateColumns: "32ch minmax(0, 2fr) minmax(0, 3fr)", columnGap: "32px", paddingRight: "32px" }}>
            {[0, 1, 2].map((i) => <div key={i} style={{ background: "rgba(255,0,128,0.08)", borderLeft: "1px solid rgba(255,0,128,0.25)", borderRight: "1px solid rgba(255,0,128,0.25)" }} />)}
          </div>
        )}
        {flatSeries.map((s, idx) => (
          <SeriesCard
            key={s.series || idx}
            ref={(el) => { seriesRefs.current[idx] = el; }}
            s={s}
            idx={idx}
            showGrid={showGrid}
          />
        ))}
      </div>
      </div>{/* end page-root grid */}
    </div>
  );
}
