"""Tests for ``extractor.discipline_derive``."""

from __future__ import annotations

from extractor.discipline_derive import derive_discipline, _classify_week
from extractor.models import WeekData, WeatherData


def _w(track: str, layout=None, name: str = "") -> WeekData:
    return WeekData(
        week=1,
        week_start_gmt="2026-01-01",
        track=track,
        track_name=name or track.split(" - ")[0],
        track_layout=layout,
        weather=WeatherData(),
    )


def test_classify_rallycross():
    assert _classify_week("charlotte motor speedway - rallyx rallyx") == "dirt_road"


def test_classify_limaland():
    assert _classify_week("limaland motorsports park") == "dirt_oval"


def test_derive_majority_oval_when_mixed_with_one_dirt_week():
    weeks = [
        _w("Charlotte Motor Speedway - Oval", "Oval"),
        _w("Charlotte Motor Speedway - Oval", "Oval"),
        _w("Lanier National Speedway - Dirt", "Dirt"),
    ]
    assert derive_discipline(weeks) == "Oval"


def test_derive_road_from_road_course_weeks():
    weeks = [_w("Circuit de Spa-Francorchamps", None), _w("Silverstone Circuit", None)]
    assert derive_discipline(weeks) == "Road"


def test_section_heading_overrides_week_shape_in_series_builder():
    from extractor.series_builder import build_series

    block = {
        "section_discipline": "Road",
        "section_license": "C",
        "header": "Mini Stock Rookie Series - 2026 Season 1",
        "tables": [
            [
                ["Week", "Track", "Weather", "Laps"],
                [
                    "Week 1 (2026-03-17)",
                    "Charlotte Motor Speedway - Oval\n2026-04-01 13:55",
                    "25°C",
                    "35 laps",
                ],
            ]
        ],
    }
    s = build_series(block)
    assert s is not None
    assert s.discipline == "Road"
