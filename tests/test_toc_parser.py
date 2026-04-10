import logging
import pytest
from extractor.toc_parser import parse_toc, build_index, lookup_series, normalize_for_match

TOC_CONTENT = (
    "OVAL RACING\n"
    "\n"
    "D Class Series\n"
    "Mini Stock Rookie Series - 2026 Season 1\n"
    "Rookie Street Stock Series - 2026 Season 1\n"
    "\n"
    "A Class Series\n"
    "NASCAR Cup Series - 2026 Season 1\n"
)


def test_parse_toc_entries(tmp_path):
    f = tmp_path / "toc.txt"
    f.write_text(TOC_CONTENT)
    entries = parse_toc(str(f))
    assert len(entries) == 3
    assert entries[0] == ("Oval Racing", "D", "Mini Stock Rookie Series")
    assert entries[1] == ("Oval Racing", "D", "Rookie Street Stock Series")
    assert entries[2] == ("Oval Racing", "A", "NASCAR Cup Series")


def test_parse_toc_rookie_license(tmp_path):
    content = "OVAL RACING\n\nR Class Series\nRookie Legends Cup - 2026 Season 1\n"
    f = tmp_path / "toc.txt"
    f.write_text(content)
    entries = parse_toc(str(f))
    assert entries[0][1] == "Rookie"


def test_parse_toc_missing_file():
    with pytest.raises(FileNotFoundError):
        parse_toc("/nonexistent/toc.txt")


def test_build_index_normalized_keys(tmp_path):
    f = tmp_path / "toc.txt"
    f.write_text(TOC_CONTENT)
    index = build_index(str(f))
    assert "mini stock rookie series" in index
    assert index["mini stock rookie series"] == ("Oval Racing", "D")


def test_lookup_series_exact(tmp_path):
    f = tmp_path / "toc.txt"
    f.write_text(TOC_CONTENT)
    index = build_index(str(f))
    d, l = lookup_series("Mini Stock Rookie Series - 2026 Season 1", index)
    assert d == "Oval Racing"
    assert l == "D"


def test_lookup_series_fuzzy(tmp_path, caplog):
    f = tmp_path / "toc.txt"
    f.write_text(TOC_CONTENT)
    index = build_index(str(f))
    with caplog.at_level(logging.WARNING, logger="toc_parser"):
        d, l = lookup_series("Mini-Stock Rookie Series", index)
    assert d == "Oval Racing"
    assert "fuzzy match" in caplog.text


def test_lookup_series_no_match(tmp_path, caplog):
    f = tmp_path / "toc.txt"
    f.write_text(TOC_CONTENT)
    index = build_index(str(f))
    with caplog.at_level(logging.WARNING, logger="toc_parser"):
        d, l = lookup_series("Completely Unknown Racing Series 999", index)
    assert d is None
    assert l is None
    assert "no TOC match" in caplog.text


def test_normalize_for_match_strips_season():
    assert normalize_for_match("NASCAR Cup Series - 2026 Season 1") == "nascar cup series"


def test_normalize_for_match_preserves_fixed_as_suffix():
    assert normalize_for_match("NASCAR Fixed Series") == "nascar series fixed"


def test_build_index_fixed_open_same_base_name(tmp_path, caplog):
    """Fixed and Open variants of the same series must get separate index keys."""
    content = (
        "DIRT ROAD\n\nC Class Series\nRallycross Series - Fixed by Trak Racer - 2026 Season 2\n\n"
        "B Class Series\nRallycross Series by Trak Racer - 2026 Season 2\n"
    )
    f = tmp_path / "toc.txt"
    f.write_text(content)
    with caplog.at_level(logging.WARNING, logger="toc_parser"):
        index = build_index(str(f))
    assert "duplicate TOC key" not in caplog.text
    assert index["rallycross series fixed"] == ("Dirt Road", "C")
    assert index["rallycross series"] == ("Dirt Road", "B")


def test_parse_toc_blank_lines_between_entries(tmp_path):
    """Blank lines between series entries must not drop entries."""
    content = (
        "OVAL RACING\n"
        "\n"
        "D Class Series\n"
        "\n"
        "Mini Stock Rookie Series - 2026 Season 1\n"
        "\n"
        "Rookie Street Stock Series - 2026 Season 1\n"
    )
    f = tmp_path / "toc.txt"
    f.write_text(content)
    entries = parse_toc(str(f))
    assert len(entries) == 2
    assert entries[1][2] == "Rookie Street Stock Series"


def test_normalize_for_match_strips_sponsor():
    assert normalize_for_match("Mini Stock Rookie Series by Thrustmaster - 2026 Season 2") == "mini stock rookie series"
