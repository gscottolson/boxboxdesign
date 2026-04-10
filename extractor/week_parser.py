from __future__ import annotations

import re
import logging
from .models import WeatherData, WeekData, SegmentData, CarBalance

logger = logging.getLogger(__name__)

SEGMENT_PATTERNS = [
    (r"(?:H|Heat)\s*:?\s*(\d+)\s*[lL](?:aps?)?", "heat"),
    (r"(?:C|Consolation)\s*:?\s*(\d+)\s*[lL](?:aps?)?", "consolation"),
    (r"(?:F|Feature)\s*:?\s*(\d+)\s*[lL](?:aps?)?", "feature"),
]

CAUTION_MAP = [
    ("Full course cautions", "full course"),
    ("Local enforced cautions", "local enforced"),
    ("Local advisory cautions", "local advisory"),
    ("Cautions disabled", "disabled"),
]

_MANUFACTURER_WORDS = {
    "chevrolet", "ford", "toyota", "dodge", "pontiac", "buick", "ram",
    "honda", "bmw", "mercedes", "audi", "porsche", "nissan", "hyundai",
    "subaru", "mazda",
}


def _longest_common_prefix(strings: list[str]) -> str:
    if not strings:
        return ""
    prefix = strings[0]
    for s in strings[1:]:
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix:
                return ""
    return prefix


def derive_car_group_label(cars: list[str]) -> str:
    """Derive a short display label from a list of car names.

    Finds the longest common prefix across all cars, strips trailing
    manufacturer words and punctuation, and appends a shared year if
    all cars carry the same 4-digit year.
    """
    if not cars:
        return ""

    # Strip [Legacy] prefix for processing
    cleaned = [re.sub(r"^\[Legacy\]\s*", "", c).strip() for c in cars]

    if len(cleaned) == 1:
        label = cleaned[0]
    else:
        label = _longest_common_prefix(cleaned).strip()

    # Strip trailing manufacturer words
    words = label.split()
    while words and words[-1].lower() in _MANUFACTURER_WORDS:
        words.pop()
    label = " ".join(words)

    # Strip trailing punctuation and dashes
    label = re.sub(r"[\s\-,]+$", "", label).strip()

    # Fallback: if prefix approach yielded nothing, find the longest token
    # that appears as a substring in every car name (e.g. "GT3", "GT4").
    if not label:
        tokens = re.findall(r"[A-Za-z][A-Za-z0-9]*", cleaned[0])
        common = [t for t in tokens if len(t) >= 2 and all(t in c for c in cleaned)]
        if common:
            label = max(common, key=len)

    # Append shared trailing year if not already in label
    year_matches = [re.search(r"[\-\s](\d{4})(?:\s|$)", c) for c in cleaned]
    if all(year_matches):
        years = {m.group(1) for m in year_matches}
        if len(years) == 1:
            year = next(iter(years))
            if year not in label:
                label = f"{label} {year}"

    return label.strip()


def parse_week_row(row: list) -> WeekData | None:
    if len(row) != 4 or any(cell is None for cell in row):
        logger.warning("skipped malformed row: %r", row)
        return None

    week_info, track_info, weather_info, laps_info = [str(c) for c in row]

    week_match = re.match(r"Week (\d+) \((\d{4}-\d{2}-\d{2})\)", week_info)
    if not week_match:
        logger.warning("skipped row: cannot parse week info from %r", week_info)
        return None

    week_num = int(week_match.group(1))
    week_start_gmt = week_match.group(2)

    # Split track_info into lines; find the event datetime sentinel line.
    # Lines between the track name and the sentinel are car names.
    track_parts = track_info.split("\n")

    dt_line_idx = None
    for i, line in enumerate(track_parts[1:], 1):
        if re.search(r"\d{4}-\d{2}-\d{2} \d{2}:\d{2}", line):
            dt_line_idx = i
            break

    if dt_line_idx is not None:
        candidate_lines = track_parts[1:dt_line_idx]
        event_dt_str = " ".join(track_parts[dt_line_idx:])
    else:
        candidate_lines = []
        event_dt_str = " ".join(track_parts[1:])

    # Consume leading candidate lines that are track-name continuations rather
    # than car names.  Layout names sometimes wrap across lines in the PDF;
    # car-name lists always start with a comma-containing line (multi-car) or
    # a "[Legacy]"-prefixed line (single legacy car).
    #
    # A candidate line is a layout continuation when ALL of:
    #   a) the previous accumulated track line already contains a " - " layout
    #      separator (bare trailing " -" also counts), AND
    #   b) the candidate line has no comma (car lists use commas), AND
    #   c) the candidate line does not start with "[" (Legacy car prefix).
    #
    # Once any candidate line fails condition (b) or (c) — i.e. looks like a
    # car name — the remaining candidates are treated as car lines.
    track_name_lines = [track_parts[0]]
    car_lines: list[str] = []
    in_car_section = False
    for line in candidate_lines:
        if in_car_section:
            car_lines.append(line)
            continue
        prev = track_name_lines[-1].rstrip()
        # Detect that the layout is incomplete — either:
        #   a) the previous line ends with a bare " -" (layout entirely on next line), OR
        #   b) the previous line has " - <fragment>" where the fragment after the
        #      separator is short (≤ 8 chars), suggesting the layout name wraps.
        #      e.g. "Mugello - Grand" → "Prix" continues the layout "Grand Prix".
        # A complete layout like "Track - Industriefahrten" has a long post-sep
        # fragment and does NOT qualify.
        sep_match = re.search(r"\s-\s+(.*)", prev)
        if re.search(r"\s-\s*$", prev):
            # Bare trailing " -": layout is entirely on the next line.
            prev_has_layout_sep = True
        elif sep_match:
            # " - <fragment>": treat as incomplete (wrapping) when the last
            # word of the fragment is short (≤ 13 chars).  Long single words
            # like "Industriefahrten" (15) are self-contained layout names;
            # shorter words ("Grand", "Rallycross", "Extended") likely wrap.
            fragment = sep_match.group(1).strip()
            last_word = fragment.split()[-1] if fragment else ""
            prev_has_layout_sep = len(last_word) <= 13
        else:
            prev_has_layout_sep = False
        if (
            prev_has_layout_sep
            and "," not in line
            and not line.lstrip().startswith("[")
            and len(line.strip()) <= 25
        ):
            track_name_lines.append(line)
        else:
            in_car_section = True
            car_lines.append(line)

    track_raw = re.sub(r"\s*-\s*$", "", " ".join(track_name_lines).strip())

    car_text = " ".join(car_lines).strip()
    cars_in_use = [c.strip() for c in car_text.split(",") if c.strip()] if car_text else []
    car_group_label = derive_car_group_label(cars_in_use)

    if " - " in track_raw:
        track_name, track_layout = track_raw.split(" - ", 1)
        track_name = track_name.strip()
        track_layout = track_layout.strip() or None
    else:
        track_name = track_raw
        track_layout = None

    dt_match = re.search(r"(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})", event_dt_str)
    event_date = dt_match.group(1) if dt_match else None
    event_time = dt_match.group(2) if dt_match else None

    # Split the cell into the comma-phrase section (ends at the first period
    # followed by a newline or end-of-string) and optional per-car lines after.
    sep_m = re.search(r"\.(?=\n|$)", weather_info)
    if sep_m:
        main_section = weather_info[:sep_m.end()].replace("\n", " ")
        car_section = weather_info[sep_m.end():].strip()
    else:
        main_section = weather_info.replace("\n", " ")
        car_section = ""

    if "Constant weather" in main_section:
        air_temperature_c: int | str | None = "Constant weather"
    else:
        temp_match = re.search(r"(?<!\d)(\d{1,3})°C", main_section)
        air_temperature_c = int(temp_match.group(1)) if temp_match else None

    if "Dynamic sky" in main_section:
        chance_of_rain: str | None = "Dynamic sky"
    else:
        rain_match = re.search(r"Rain chance ([^,\n]+)", main_section)
        chance_of_rain = rain_match.group(1).strip() if rain_match else None

    race_start = None
    if re.search(r"\bRolling\b", main_section, re.IGNORECASE):
        race_start = "rolling"
    elif re.search(r"\bStanding\b", main_section, re.IGNORECASE):
        race_start = "standing"

    cautions = None
    for phrase, value in CAUTION_MAP:
        if phrase.lower() in main_section.lower():
            cautions = value
            break

    scrutiny_match = re.search(
        r"\b(Permissive|Moderate|Lenient|Strict)\b.*?\bqualifying\b",
        main_section,
        re.IGNORECASE,
    )
    qualifying_scrutiny = scrutiny_match.group(1).lower() if scrutiny_match else None

    grid_by_class = bool(re.search(r"\bGrid by\s+class\b", main_section, re.IGNORECASE))

    min_drivers: int | None = None
    min_m = re.search(r"\bMin\s+(\d+)\s+drivers?\b", main_section, re.IGNORECASE)
    if min_m:
        min_drivers = int(min_m.group(1))

    max_drivers: int | None = None
    max_m = re.search(r"\bMax\s+(\d+)\s+drivers?\b", main_section, re.IGNORECASE)
    if max_m:
        max_drivers = int(max_m.group(1))

    fair_share: str | None = None
    fs_m = re.search(r"\bDrive Fair Share\s*-\s*([^,\.]+)", main_section, re.IGNORECASE)
    if fs_m:
        fair_share = fs_m.group(1).strip()

    caution_laps_count = not bool(re.search(r"Cautions laps do not count", main_section, re.IGNORECASE))

    lucky_dog = bool(re.search(r"\bLucky dog\b", main_section, re.IGNORECASE))

    gwc: int | None = None
    gwc_m = re.search(r"\b(\d+)-G/W/C\b", main_section, re.IGNORECASE)
    if gwc_m:
        gwc = int(gwc_m.group(1))

    restart_file: str | None = None
    restart_position: str | None = None
    file_m = re.search(r"\b(Double|Single)-\s*file\s+(\w+)\b", main_section, re.IGNORECASE)
    if file_m:
        restart_file = file_m.group(1).lower()
        restart_position = file_m.group(2).lower()

    start_zone = bool(re.search(r"\bStart zone\b", main_section, re.IGNORECASE))

    # Strip all recognized phrases to find leftover notes
    _remainder = main_section
    for pat in [
        r"\d+°F/\d+°C",
        r"(?<!\d)\d{1,3}°C",
        r"Rain chance [^,\.]+",
        r"(?:Rolling|Standing) start",
        r"Detached qual",
        r"(?:Full course|Local enforced|Local advisory) cautions?",
        r"Cautions disabled",
        r"Qual scrutiny\s*-\s*\w+",
        r"Constant weather",
        r"Dynamic sky",
        r"Grid by\s+class",
        r"Min\s+\d+\s+drivers?",
        r"Max\s+\d+\s+drivers?",
        r"Drive Fair Share\s*-\s*[^,\.]+",
        r"Cautions laps do not count",
        r"Lucky dog",
        r"\d+-G/W/C",
        r"(?:Double|Single)-\s*file\s+\w+",
        r"Start zone",
    ]:
        _remainder = re.sub(pat, "", _remainder, flags=re.IGNORECASE)
    notes: list[str] = [
        t.strip(" .,") for t in re.split(r"[,\.]", _remainder)
        if t.strip(" .,")
    ]

    # Parse per-car balance lines: "CODE: fuel: X%, Ykg, pwr: -Z%" or "CODE: N tire sets"
    car_balance: dict[str, CarBalance] = {}
    for line in car_section.splitlines():
        line = line.strip()
        if not line:
            continue
        car_m = re.match(r"^([A-Z0-9]+):\s*(.+)$", line)
        if not car_m:
            continue
        code = car_m.group(1)
        rest = car_m.group(2)
        bal = CarBalance()
        fuel_m = re.search(r"fuel:\s*([\d.]+)%", rest)
        if fuel_m:
            bal.fuel_pct = float(fuel_m.group(1))
        ballast_m = re.search(r"([\d.]+)\s*kg", rest)
        if ballast_m:
            bal.ballast_kg = float(ballast_m.group(1))
        pwr_m = re.search(r"pwr:\s*(-?[\d.]+)%", rest)
        if pwr_m:
            bal.power_pct = float(pwr_m.group(1))
        tire_m = re.search(r"(\d+)\s+tire sets?", rest)
        if tire_m:
            bal.tire_sets = int(tire_m.group(1))
        car_balance[code] = bal

    segments: list[SegmentData] = []
    for pat, seg_type in SEGMENT_PATTERNS:
        for m in re.finditer(pat, laps_info, re.IGNORECASE):
            segments.append(SegmentData(type=seg_type, laps=int(m.group(1))))

    laps = None
    race_time = None
    if not segments:
        dur_match = re.search(r"(\d+)\s*(min|mins|minutes)", laps_info, re.IGNORECASE)
        if dur_match:
            race_time = f"{dur_match.group(1)} {dur_match.group(2)}"
        else:
            laps_match = re.search(r"(\d+)\s+laps", laps_info, re.IGNORECASE)
            laps = int(laps_match.group(1)) if laps_match else None

    return WeekData(
        week=week_num,
        week_start_gmt=week_start_gmt,
        track=track_raw,
        track_name=track_name,
        track_layout=track_layout,
        event_date=event_date,
        event_time=event_time,
        weather=WeatherData(
            air_temperature_c=air_temperature_c,
            chance_of_rain=chance_of_rain,
        ),
        race_start=race_start,
        cautions=cautions,
        qualifying_scrutiny=qualifying_scrutiny,
        grid_by_class=grid_by_class,
        min_drivers=min_drivers,
        max_drivers=max_drivers,
        fair_share=fair_share,
        lucky_dog=lucky_dog,
        gwc=gwc,
        restart_file=restart_file,
        restart_position=restart_position,
        start_zone=start_zone,
        caution_laps_count=caution_laps_count,
        car_balance=car_balance,
        notes=notes,
        cars_in_use=cars_in_use,
        car_group_label=car_group_label,
        laps=laps,
        race_time=race_time,
        segments=segments,
    )
