import json
from pathlib import Path

from extractor.extract_batch import (
    _build_output,
    _load_extract_flags_store,
    _write_extract_flags_store,
    normalize_pdf_discipline_label,
    parse_section_heading_cell,
    toc_section_assignments_from_texts,
)
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

def test_parse_section_heading_cell_d_oval():
    lic, disc = parse_section_heading_cell("D Class Series (OVAL)")
    assert lic == "D"
    assert disc == "Oval"


def test_parse_section_heading_cell_rookie_sports_car():
    lic, disc = parse_section_heading_cell("Rookie Class Series (SPORTS CAR)")
    assert lic == "Rookie"
    assert disc == "Sports Car"


def test_parse_section_heading_cell_r_unranked():
    lic, disc = parse_section_heading_cell("R Class Series (UNRANKED)")
    assert lic == "R"
    assert disc == "Unranked"


def test_toc_section_assignments_follows_headings():
    text = """R Class Series (OVAL) . . . . 1
Mini Stock - 2026 Season 2 . . . . 2
D Class Series (SPORTS CAR) . . . 3
BMW M2 Cup - 2026 Season 2 . . . 4
"""
    rows = toc_section_assignments_from_texts([text])
    assert rows == [("R", "Oval"), ("D", "Sports Car")]


def test_parse_section_heading_cell_toc_dot_leaders_after_paren():
    """Schedule PDF table of contents rows include dot leaders before the page column."""
    lic, disc = parse_section_heading_cell(
        "C Class Series (SPORTS CAR) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 85"
    )
    assert lic == "C"
    assert disc == "Sports Car"


def test_parse_section_heading_cell_non_heading():
    assert parse_section_heading_cell("Mini Stock Rookie Series - 2026 Season 1") == (None, None)


def test_normalize_pdf_discipline_dirt_oval():
    assert normalize_pdf_discipline_label("DIRT OVAL") == "Dirt Oval"


def test_flags_embedded_on_series_output():
    """flags from validate_series appear on each series dict in the output."""
    series = build_series(MINIMAL_BLOCK)
    result = _build_output([series])
    assert len(result) == 1
    assert "flags" in result[0]
    assert isinstance(result[0]["flags"], list)


def test_valid_series_has_empty_flags():
    """A series with no validation issues has an empty flags list."""
    series = build_series(MINIMAL_BLOCK)
    result = _build_output([series])
    # MINIMAL_BLOCK has valid data — flags should be empty
    assert result[0]["flags"] == []


def test_load_extract_flags_store_migrates_legacy_flat_doc(tmp_path: Path):
    p = tmp_path / "extract-flags.json"
    p.write_text(
        json.dumps(
            {
                "extracted_at": "2026-01-01T00:00:00+00:00",
                "source_pdf": "schedules/foo.pdf",
                "schedule_json": "app/data/out.json",
                "flagged_series_count": 0,
                "entries": [],
            }
        ),
        encoding="utf-8",
    )
    store = _load_extract_flags_store(p)
    assert store == {
        "sources": {
            "schedules/foo.pdf": {
                "extracted_at": "2026-01-01T00:00:00+00:00",
                "schedule_json": "app/data/out.json",
                "flagged_series_count": 0,
                "entries": [],
            }
        }
    }


def test_extract_flags_store_roundtrip_sources(tmp_path: Path):
    p = tmp_path / "extract-flags.json"
    doc = {
        "sources": {
            "a.pdf": {"extracted_at": "t", "entries": [{"series": "X", "flags": []}]},
            "b.pdf": {"extracted_at": "t2", "entries": []},
        }
    }
    _write_extract_flags_store(p, doc)
    assert _load_extract_flags_store(p) == doc
