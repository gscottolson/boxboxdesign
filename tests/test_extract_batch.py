from extractor.extract_batch import _build_output
from extractor.series_builder import build_series


MINIMAL_BLOCK = {
    "header": "Mini Stock Rookie Series - 2026 Season 1",
    "tables": [
        [
            ["Week", "Track", "Weather", "Laps"],
            [
                "Week 1 (2026-03-17)",
                "Charlotte Motor Speedway - Oval\n2026-04-01 13:55",
                "25°C, Rain chance 10%, Rolling start, Cautions disabled",
                "35 laps",
            ],
        ]
    ],
}

TOC_INDEX = {"mini stock rookie series": ("Oval Racing", "D")}


def test_flags_embedded_on_series_output():
    """flags from validate_series appear on each series dict in the output."""
    series = build_series(MINIMAL_BLOCK, TOC_INDEX)
    result = _build_output([series])
    assert len(result) == 1
    assert "flags" in result[0]
    assert isinstance(result[0]["flags"], list)


def test_valid_series_has_empty_flags():
    """A series with no validation issues has an empty flags list."""
    series = build_series(MINIMAL_BLOCK, TOC_INDEX)
    result = _build_output([series])
    # MINIMAL_BLOCK has valid data — flags should be empty
    assert result[0]["flags"] == []
