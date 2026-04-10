from __future__ import annotations

import re
import difflib
import logging
from pathlib import Path

logger = logging.getLogger(__name__)


def _normalize_license_class(raw: str) -> str:
    first = raw.strip()[0].upper() if raw.strip() else ""
    return "Rookie" if first == "R" else first


def normalize_for_match(text: str) -> str:
    if not text:
        return ""
    is_fixed = bool(re.search(r"\bfixed\b", text, re.IGNORECASE))
    text = re.sub(r"-?\s*20\d{2}(?:\s*Season\s*\d*)?", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\bSeason\s*\d*\b", "", text, flags=re.IGNORECASE)  # strip orphaned Season
    text = re.sub(r"\bfixed\b", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\bby\s+[^-–\n]+", "", text, flags=re.IGNORECASE)
    text = re.sub(r"[\s\-]+$", "", text)  # clean trailing hyphens/spaces
    normalized = " ".join(text.lower().split())
    return f"{normalized} fixed" if is_fixed else normalized


def parse_toc(toc_path: str) -> list[tuple[str, str, str]]:
    """Parse toc_extract.txt → list of (discipline, license_class, series_name)."""
    path = Path(toc_path)
    if not path.exists():
        raise FileNotFoundError(f"TOC file not found: {toc_path}")

    with open(path, encoding="utf-8") as f:
        lines = f.readlines()

    cleaned = []
    for line in lines:
        l = re.sub(r"[ .]*\d+$", "", line.rstrip(" ."))
        l = re.sub(r"\s*-\s*20\d{2}\s*Season(\s*\d+)?$", "", l)
        cleaned.append(l)

    result: list[tuple[str, str, str]] = []
    current_discipline: str | None = None
    current_license: str | None = None
    expect_series = False

    for line in cleaned:
        stripped = line.strip()
        if not stripped:
            continue
        if re.match(r"^[A-Z ]+$", stripped) and not any(
            x in stripped for x in ["CLASS", "SERIES", "CUP", "CHALLENGE", "TOUR", "FIXED", "BY", "SEASON"]
        ):
            current_discipline = stripped.title()
            current_license = None
            expect_series = False
        elif re.match(r"^[A-Z] Class Series", stripped):
            current_license = stripped
            expect_series = True
        elif stripped and current_discipline and current_license and expect_series:
            s = re.sub(r"\s*-\s*20\d{2}\s*Season(\s*\d+)?$", "", stripped)
            result.append((current_discipline, _normalize_license_class(current_license), s.strip()))

    return result


def build_index(toc_path: str) -> dict[str, tuple[str, str]]:
    """Build normalized lookup: series_name → (discipline, license_class)."""
    entries = parse_toc(toc_path)
    index: dict[str, tuple[str, str]] = {}
    prev_series: dict[str, str] = {}
    for discipline, license_class, series_name in entries:
        key = normalize_for_match(series_name)
        if key in index:
            logger.warning(
                "duplicate TOC key '%s' — overwriting ('%s' replaces '%s')",
                key, series_name, prev_series[key],
            )
        index[key] = (discipline, license_class)
        prev_series[key] = series_name
    return index


def lookup_series(name: str, index: dict[str, tuple[str, str]]) -> tuple[str | None, str | None]:
    """Return (discipline, license_class), using fuzzy match as fallback."""
    key = normalize_for_match(name)
    if key in index:
        return index[key]

    matches = difflib.get_close_matches(key, index.keys(), n=1, cutoff=0.8)
    if matches:
        match = matches[0]
        score = difflib.SequenceMatcher(None, key, match).ratio()
        logger.warning("fuzzy match: '%s' → '%s' (%.2f)", name, match, score)
        return index[match]

    logger.warning("no TOC match for '%s'", name)
    return (None, None)
