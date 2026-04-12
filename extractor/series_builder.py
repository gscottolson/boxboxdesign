from __future__ import annotations

import re
import logging
import json
import os
from .models import SeriesData, WeekData
from .discipline_derive import derive_discipline
from .week_parser import derive_car_group_label, parse_week_row

# PDF header line before cadence/min entries, e.g. "Class C 4.0 --> Pro/WC 4.0" or "Rookie 4.0 --> ...".
# ``Rookie 1.0 -->`` is Rookie license; ``Rookie 4.0 -->`` (and other versions) is D. ``Class X n.n -->`` maps
# X one rung below the series license (C → B, B → A, etc.).
SERIES_CLASS_LINE_RE = re.compile(
    r"^(?:(?P<rook>Rookie)\s+(?P<rver>\d+\.\d+)|Class\s+(?P<letter>[A-Z])\s+(?P<cver>\d+\.\d+))\s*-->",
    re.IGNORECASE,
)

_PDF_CLASS_TO_SERIES_LICENSE: dict[str, str] = {
    "D": "C",
    "C": "B",
    "B": "A",
    "A": "A",
}

logger = logging.getLogger(__name__)

_OVERRIDES_PATH = os.path.join(os.path.dirname(__file__), "car_group_overrides.json")


def _load_overrides() -> dict:
    try:
        with open(_OVERRIDES_PATH) as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {"car_group_labels": {}, "schedule_modes": {}}


# First column of a row that begins the per-week schedule grid (not preamble).
_WEEK_ROW_START = re.compile(r"^\s*Week\s+\d+\b", re.IGNORECASE)

# PDF table often has a header row whose first cell is just "Week" (column title).
_LONE_SCHEDULE_HEADER = frozenset({"week", "track", "weather", "laps"})


def _is_lone_schedule_header_cell(cell: str) -> bool:
    parts = cell.lower().split()
    return len(parts) == 1 and parts[0] in _LONE_SCHEDULE_HEADER


def _series_preamble_text(block: dict) -> str:
    """Full text above the Week rows used to parse cars, class, cadence, min entries.

    `block['header']` is only the first table cell (series title). The PDF often places
    the comma-separated car list on the following row(s) of the same table before
    ``Class X n.n -->`` (e.g. Nürburgring Endurance). Those lines must be merged in
    so `_parse_cars` and same-track `derive_car_group_label` see the full list.
    """
    raw = (block.get("header") or "").strip()
    tables = block.get("tables") or []
    if not tables or not tables[0]:
        return raw
    parts: list[str] = [raw] if raw else []
    for row in tables[0][1:]:
        if not row:
            continue
        cell = str(row[0] or "").strip()
        if not cell:
            continue
        if _WEEK_ROW_START.match(cell):
            break
        if _is_lone_schedule_header_cell(cell):
            continue
        parts.append(cell)
    return "\n".join(parts)


def license_class_from_schedule_header(header_lines: list[str]) -> str | None:
    """Derive competing `license_class` from the PDF schedule header class line.

    ``Rookie 1.0 -->`` → Rookie license; ``Rookie 4.0 -->`` → D license. For ``Class X n.n -->``, X is one rung
    below the series license (e.g. ``Class C 4.0 -->`` → B license).
    """
    for raw in header_lines:
        m = SERIES_CLASS_LINE_RE.match(raw.strip())
        if not m:
            continue
        if m.group("rook"):
            return "Rookie" if m.group("rver") == "1.0" else "D"
        letter = (m.group("letter") or "").upper()
        return _PDF_CLASS_TO_SERIES_LICENSE.get(letter)
    return None


def _parse_cars(lines: list[str]) -> list[str]:
    """Extract car list from the lines between the series title and class line."""
    joined = " ".join(lines)
    return [c.strip() for c in joined.split(",") if c.strip()]


def _parse_min_entries(line: str) -> tuple[int | None, int | None, int | None]:
    """Parse 'Min entries for official: N | Split at: M | Drops: P'."""
    m = re.search(
        r"Min entries for official:\s*(\d+)\s*\|\s*Split at:\s*(\d+)\s*\|\s*Drops:\s*(\d+)",
        line,
    )
    if m:
        return int(m.group(1)), int(m.group(2)), int(m.group(3))
    return None, None, None


def _parse_incidents(line: str) -> tuple[int | None, int | None, int | None]:
    """Parse incident penalty line → (penalty, penalty_repeat, dq).

    Handles all four observed variants:
      No incident DT penalties. DQ at N incidents.
      No incident DT penalties. No incident DQ.
      Penalty every N incidents. DQ at M incidents.
      Penalty at N incidents, and every M after. No incident DQ.
    """
    penalty: int | None = None
    repeat: int | None = None
    dq: int | None = None

    m = re.search(r"Penalty every (\d+) incidents", line)
    if m:
        penalty = int(m.group(1))

    m = re.search(r"Penalty at (\d+) incidents", line)
    if m:
        penalty = int(m.group(1))
        r = re.search(r"every (\d+) after", line)
        if r:
            repeat = int(r.group(1))

    m = re.search(r"DQ at (\d+) incidents", line)
    if m:
        dq = int(m.group(1))

    return penalty, repeat, dq


# When every consecutive race week uses the same venue (e.g. Nürburgring Endurance),
# the schedule is car-differentiated like multi-car draft series — use cars schedule mode.
SAME_TRACK_SERIES_LABEL_FALLBACK = "Multi-class"


def _week_track_key(w: WeekData) -> str:
    """Stable venue string for comparing weeks (matches JSON `track` when set)."""
    t = (w.track or "").strip()
    if t:
        return t
    name = (w.track_name or "").strip()
    layout = (w.track_layout or "").strip()
    if not name and not layout:
        return ""
    return f"{name} - {layout}" if layout else name


def _consecutive_weeks_same_track(weeks: list[WeekData]) -> bool:
    """True when sorted by week number, every adjacent pair uses the same track/layout."""
    if len(weeks) < 2:
        return False
    ordered = sorted(weeks, key=lambda w: w.week)
    keys = [_week_track_key(w) for w in ordered]
    if not all(keys):
        return False
    return all(keys[i] == keys[i + 1] for i in range(len(keys) - 1))


def _backfill_car_group_labels_for_same_track_series(weeks: list[WeekData], series_cars: list[str]) -> None:
    """UI needs `car_group_label` when schedule_mode is cars; PDF may list no per-week cars."""
    derived = derive_car_group_label(series_cars).strip()
    label = derived if derived else SAME_TRACK_SERIES_LABEL_FALLBACK
    for w in weeks:
        if not (w.car_group_label or "").strip():
            w.car_group_label = label


def _override_key(series_name: str) -> str:
    """Strips sponsor/fixed markers for stable override dict keys."""
    text = re.sub(r"\bFixed\b[\s\-]*", "", series_name, flags=re.IGNORECASE)
    text = re.sub(r"\bby \S+", "", text, flags=re.IGNORECASE)
    text = re.sub(r"(\s*-\s*)+$", "", text)
    return " ".join(text.split())


def _clean_series_name(text: str) -> str:
    text = re.sub(r"-?\s*20\d{2}(?:\s*Season\s*\d*)?", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\bSeason\s*\d*\b", "", text, flags=re.IGNORECASE)  # strip orphaned Season
    # Normalise "by X Fixed" → "Fixed by X" so sponsor always trails the fixed marker
    text = re.sub(r"\bby (\S+)\s+Fixed\b", r"Fixed by \1", text, flags=re.IGNORECASE)
    text = " ".join(text.split())
    text = re.sub(r"\b(\w+) \1\b", r"\1", text)  # remove consecutive duplicate words
    # Collapse repeated Fixed tokens (e.g. "- Fixed - Fixed")
    text = re.sub(r"(\bFixed\b[\s\-]*)(\bFixed\b)", r"\1", text, flags=re.IGNORECASE)
    text = re.sub(r"(\s*-\s*)+$", "", text)
    return text


def build_series(block: dict) -> SeriesData | None:
    header_lines = _series_preamble_text(block).splitlines()

    series_name_raw = None
    for line in header_lines:
        line = line.strip()
        if re.search(r"\bSeason\b", line) and not re.match(
            r"^[A-Z] Class|Group|Series \(OVAL\)", line
        ):
            series_name_raw = line
            break

    if not series_name_raw:
        logger.warning("skipped block: no valid series name found in header")
        return None

    setup = "Fixed" if re.search(r"\bFixed\b", series_name_raw, re.IGNORECASE) else "Open"
    series_name = _clean_series_name(series_name_raw)

    discipline: str | None = block.get("section_discipline")
    section_license = block.get("section_license")
    license_from_header_line = license_class_from_schedule_header(header_lines)
    license_class = license_from_header_line if license_from_header_line is not None else section_license

    # Parse metadata from header lines
    cars: list[str] = []
    race_cadence: str | None = None
    min_entries: int | None = None
    split_at: int | None = None
    drops: int | None = None
    incident_penalty: int | None = None
    incident_penalty_repeat: int | None = None
    incident_dq: int | None = None

    class_pattern = SERIES_CLASS_LINE_RE
    car_lines: list[str] = []
    past_title = False
    past_class = False

    for line in header_lines:
        line = line.strip()
        if not line:
            continue
        if re.search(r"\bSeason\b", line):
            past_title = True
            continue
        if not past_title:
            continue
        if class_pattern.match(line):
            if car_lines:
                cars = _parse_cars(car_lines)
            past_class = True
            continue
        if not past_class:
            car_lines.append(line)
            continue
        if re.match(r"Min entries", line):
            min_entries, split_at, drops = _parse_min_entries(line)
        elif re.search(r"(Penalty|incident DT|DQ)", line, re.IGNORECASE):
            incident_penalty, incident_penalty_repeat, incident_dq = _parse_incidents(line)
        elif race_cadence is None:
            race_cadence = line

    weeks = []
    for table in block.get("tables", []):
        for row in table:
            if not (row and row[0] and re.search(r"Week\s+\d+", str(row[0]))):
                continue  # skip header/metadata rows, keep only week data rows
            week = parse_week_row(row)
            if week is not None:
                weeks.append(week)

    if not weeks:
        logger.warning("skipped series '%s': no valid weeks parsed", series_name)
        return None

    overrides = _load_overrides()
    label_overrides: dict = overrides.get("car_group_labels", {})
    mode_overrides: dict = overrides.get("schedule_modes", {})

    # Apply car_group_label overrides (keyed by stable name without sponsor/fixed markers)
    override_series_key = _override_key(series_name)
    for week in weeks:
        key = f"{override_series_key}/week_{week.week}"
        if key in label_overrides:
            week.car_group_label = label_overrides[key]

    # Determine schedule_mode
    schedule_mode: str | None = None
    mode_val = mode_overrides.get(override_series_key) or mode_overrides.get(series_name)
    if mode_val is not None:
        schedule_mode = mode_val
    elif any(len(w.cars_in_use) > 0 for w in weeks):
        schedule_mode = "cars"
    elif _consecutive_weeks_same_track(weeks):
        schedule_mode = "cars"
        _backfill_car_group_labels_for_same_track_series(weeks, cars)

    if discipline is None:
        discipline = derive_discipline(weeks)

    return SeriesData(
        series=series_name,
        discipline=discipline,
        license_class=license_class,
        setup=setup,
        cars=cars,
        schedule_mode=schedule_mode,
        race_cadence=race_cadence,
        min_entries=min_entries,
        split_at=split_at,
        drops=drops,
        incident_penalty=incident_penalty,
        incident_penalty_repeat=incident_penalty_repeat,
        incident_dq=incident_dq,
        weeks=weeks,
    )
