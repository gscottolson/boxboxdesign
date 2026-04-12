"""Infer iRacing ``discipline`` when the PDF section heading was not captured.

Uses only **track / layout / venue** text from schedule weeks — not the series title.
``Sports Car``, ``Formula Car``, and ``Unranked`` come from PDF section lines such as
``C Class Series (SPORTS CAR)`` or ``R Class Series (UNRANKED)`` via ``section_discipline``,
not from heuristics here.
"""

from __future__ import annotations

import re
from collections import Counter

from .models import WeekData

# iRacing PDF / app labels (match ``normalize_pdf_discipline_label`` outcomes).
_DISCIPLINES = frozenset(
    {"Oval", "Road", "Dirt Oval", "Dirt Road", "Sports Car", "Formula Car", "Unranked"}
)


def _week_blob(w: WeekData) -> str:
    parts = [w.track or "", w.track_layout or "", w.track_name or ""]
    return " ".join(parts).lower()


# iRacing dirt ovals that PDF week text may not label with "dirt" / "Dirt Oval".
_KNOWN_DIRT_VENUE_MARKERS = (
    "limaland",
    "eldora",
    "knoxville",
    "volusia",
    "williams grove",
    "usa international",
    "western springs",
    "the dirt track at charlotte",
    "lucas oil speedway",
)


def _classify_week(blob: str) -> str:
    """Bucket each week into coarse groups before majority vote."""
    b = blob
    # Dirt Road (rallycross) — check before generic "dirt"
    if re.search(r"rallyx|rallycross", b):
        return "dirt_road"
    if "dirt road" in b and "rally" not in b:
        return "dirt_road"

    if any(m in b for m in _KNOWN_DIRT_VENUE_MARKERS):
        return "dirt_oval"

    # Dirt oval / clay
    if "dirt" in b or "clay" in b:
        return "dirt_oval"

    # Road course / street circuit (before oval heuristics catch "speedway" road layouts)
    if any(
        x in b
        for x in (
            "road course",
            "street circuit",
            "grand prix",
            " gp",
            " autodromo",
            "circuit de",
            "circuito ",
            "international circuit",
            "motorsports park",  # e.g. Canadian Tire Motorsports Park
            "mountain course",
        )
    ):
        return "road"
    if re.search(
        r"\b(street course|city circuit|coliseum|long beach|detroit|chicago street|adelaide|st\.? petersburg)\b",
        b,
    ):
        return "road"

    # Paved oval-ish layouts
    if re.search(r"\b(oval|legends oval|open wheel oval)\b", b):
        return "oval"
    if "superspeedway" in b or "motor speedway" in b:
        return "oval"
    if "speedway" in b and "street" not in b:
        return "oval"
    if re.search(r"\braseway\b", b) and "street" not in b:
        return "oval"

    # Short-track asphalt (e.g. Lanier - Asphalt) — oval in iRacing
    if re.search(r"\basphalt\b", b) and "road" not in b:
        return "oval"

    return "road"


def derive_discipline(weeks: list[WeekData]) -> str | None:
    """Return Oval / Road / Dirt Oval / Dirt Road from week rows, or ``None`` if empty.

    Does **not** inspect series names. Coarse ``road`` stays ``Road`` (never upgraded to
    Sports Car / Formula Car here — those labels must come from the PDF section heading).
    """
    if not weeks:
        return None

    counts = Counter(_classify_week(_week_blob(w)) for w in weeks)
    total = sum(counts.values())

    if counts["dirt_road"] > 0 and counts["dirt_road"] >= max(
        counts["dirt_oval"], counts["oval"], counts["road"]
    ):
        return "Dirt Road"

    primary, n = counts.most_common(1)[0]
    if n < total * 0.5:
        if primary in ("dirt_oval", "dirt_road"):
            primary = "dirt_oval" if counts["dirt_oval"] >= counts["dirt_road"] else "dirt_road"
        elif counts["oval"] >= counts["road"]:
            primary = "oval"
        else:
            primary = "road"

    coarse_to_label = {
        "dirt_road": "Dirt Road",
        "dirt_oval": "Dirt Oval",
        "oval": "Oval",
        "road": "Road",
    }
    label = coarse_to_label[primary]
    assert label in _DISCIPLINES, label
    return label
