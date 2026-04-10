from __future__ import annotations

import re
import logging
import json
import os
from .models import SeriesData
from .toc_parser import lookup_series
from .week_parser import parse_week_row

logger = logging.getLogger(__name__)

_OVERRIDES_PATH = os.path.join(os.path.dirname(__file__), "car_group_overrides.json")


def _load_overrides() -> dict:
    try:
        with open(_OVERRIDES_PATH) as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {"car_group_labels": {}, "schedule_modes": {}}


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


def build_series(block: dict, toc_index: dict) -> SeriesData | None:
    header_lines = block.get("header", "").splitlines()

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
    discipline, license_class = lookup_series(series_name_raw, toc_index)

    # Parse metadata from header lines
    cars: list[str] = []
    race_cadence: str | None = None
    min_entries: int | None = None
    split_at: int | None = None
    drops: int | None = None
    incident_penalty: int | None = None
    incident_penalty_repeat: int | None = None
    incident_dq: int | None = None

    class_pattern = re.compile(r"^(Rookie|Class [A-Z])\s+\d+\.\d+\s*-->", re.IGNORECASE)
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
    if override_series_key in mode_overrides or series_name in mode_overrides:
        schedule_mode = mode_overrides[series_name]
    elif any(len(w.cars_in_use) > 0 for w in weeks):
        schedule_mode = "cars"

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
