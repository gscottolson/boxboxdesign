from __future__ import annotations

import argparse
import dataclasses
import json
import logging
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import pdfplumber

from .config import PDF_PATH, OUTPUT_PATH
from .models import SeriesData
from .series_builder import build_series
from .validation import validate_series

DEFAULT_FLAGS_BASENAME = "extract-flags.json"

# Repository root (parent of ``extractor/``).
_REPO_ROOT = Path(__file__).resolve().parents[1]

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

# e.g. "D Class Series (OVAL)", "C Class Series (SPORTS CAR)". PDF TOC cells often continue
# with dot leaders and a page number after the closing paren — do not anchor ``$``.
SECTION_HEADING_RE = re.compile(
    r"^(Rookie|[A-Z])\s+Class\s+Series\s*\(\s*([^)]+?)\s*\)",
    re.IGNORECASE,
)

# Discipline in parentheses on section rows, e.g. ``C Class Series (SPORTS CAR)``,
# ``R Class Series (UNRANKED)``. Current schedule PDFs use these labels (not a generic ROAD band).
_PDF_DISCIPLINE_ALIASES: dict[str, str] = {
    "OVAL": "Oval",
    "ROAD": "Road",
    "DIRT OVAL": "Dirt Oval",
    "DIRT ROAD": "Dirt Road",
    "SPORTS CAR": "Sports Car",
    "FORMULA CAR": "Formula Car",
    "UNRANKED": "Unranked",
}


def normalize_pdf_discipline_label(raw: str) -> str:
    key = " ".join(raw.upper().split())
    return _PDF_DISCIPLINE_ALIASES.get(key, raw.strip().title())


def parse_section_heading_cell(text: str) -> tuple[str | None, str | None]:
    """If ``text`` is a PDF section heading, return (license_class, discipline). Else (None, None)."""
    first_line = text.strip().split("\n")[0].strip()
    m = SECTION_HEADING_RE.match(first_line)
    if not m:
        return None, None
    lic = m.group(1)
    raw_disc = m.group(2).strip()
    license_class = "Rookie" if lic.lower() == "rookie" else lic.upper()
    return license_class, normalize_pdf_discipline_label(raw_disc)


# ``C Class Series (SPORTS CAR)`` and similar lines are **plain text** between grouped
# sections of the document — they are not cells in the schedule tables that
# ``find_tables()`` returns, so ``detect_blocks`` never sees them. Discipline/license
# for each series instead come from ``toc_section_assignments`` (early pages via
# ``extract_text()``), merged with blocks by index after ``detect_blocks``.
_TOC_PAGES_FOR_DISCIPLINE = 5


def toc_section_assignments_from_texts(page_texts: list[str]) -> list[tuple[str | None, str | None]]:
    """Parse concatenated TOC page text → one (section_license, section_discipline) per series line."""
    section_license: str | None = None
    section_discipline: str | None = None
    out: list[tuple[str | None, str | None]] = []
    for text in page_texts:
        for raw in text.splitlines():
            line = raw.strip()
            if not line:
                continue
            sl, sd = parse_section_heading_cell(line)
            if sl is not None and sd is not None:
                section_license, section_discipline = sl, sd
                continue
            if re.search(r"\bSeason\b", line) and "Class Series" not in line:
                out.append((section_license, section_discipline))
    return out


def toc_section_assignments(pdf) -> list[tuple[str | None, str | None]]:
    """Parse TOC on early pages — see ``toc_section_assignments_from_texts``."""
    texts = [(page.extract_text() or "") for page in pdf.pages[:_TOC_PAGES_FOR_DISCIPLINE]]
    return toc_section_assignments_from_texts(texts)


def detect_blocks(pdf) -> list[dict]:
    """Scan schedule **tables** in document order; each block is one series (``Season`` row + week grids).

    Class/discipline headings between sections are **not** in these tables — see
    ``toc_section_assignments`` + the merge step in ``main``.
    """
    blocks: list[dict] = []
    current_block: dict | None = None
    section_discipline: str | None = None
    section_license: str | None = None

    for page in pdf.pages:
        for t in page.find_tables():
            rows = t.extract()
            if not rows:
                continue
            first_cell = str(rows[0][0] or "")
            # Continuation table: week grid only (separate from series header table).
            if re.search(r"\bWeek\s+\d+\b", first_cell) and current_block is not None:
                current_block["tables"].append(rows)
                continue

            i = 0
            while i < len(rows):
                cell = str(rows[i][0] or "")
                sl, sd = parse_section_heading_cell(cell)
                if sl is not None and sd is not None:
                    section_license, section_discipline = sl, sd
                    logger.debug("PDF section: %s — %s", section_discipline, section_license)
                    i += 1
                    continue
                if re.search(r"\bSeason\b", cell):
                    if current_block is not None:
                        blocks.append(current_block)
                    chunk = [rows[i]]
                    i += 1
                    while i < len(rows):
                        c2 = str(rows[i][0] or "")
                        if parse_section_heading_cell(c2)[0] is not None:
                            break
                        if re.search(r"\bSeason\b", c2):
                            break
                        chunk.append(rows[i])
                        i += 1
                    current_block = {
                        "header": str(chunk[0][0] or ""),
                        "tables": [chunk],
                        "section_discipline": section_discipline,
                        "section_license": section_license,
                    }
                    continue
                i += 1

    if current_block is not None:
        blocks.append(current_block)
    return blocks


def _series_dict_with_flags(series: SeriesData) -> dict:
    """Single series → dict with embedded ``flags`` from ``validate_series``."""
    d = dataclasses.asdict(series)
    d["flags"] = validate_series(d)
    return d


def _build_output(results: list[SeriesData]) -> list[dict]:
    """Convert SeriesData list to dicts with validation flags embedded (tests, reuse)."""
    return [_series_dict_with_flags(s) for s in results]


def _print_series_flags_to_terminal(series_name: str, flags: list[dict]) -> None:
    for fl in flags:
        _progress_line(
            f'  FLAG "{series_name}": week {fl["week"]} {fl["field"]} — {fl["reason"]}',
        )


def _resolve_flags_output_path(schedule_json: str, explicit: str | None) -> Path:
    if explicit:
        return Path(explicit).expanduser().resolve()
    return Path(schedule_json).expanduser().resolve().parent / DEFAULT_FLAGS_BASENAME


def _path_relative_to_repo(path: str | Path) -> str:
    """Stable project-relative path for JSON (POSIX slashes)."""
    resolved = Path(path).expanduser().resolve()
    try:
        return resolved.relative_to(_REPO_ROOT).as_posix()
    except ValueError:
        return resolved.as_posix()


def _load_extract_flags_store(path: Path) -> dict:
    """Load merged flags file: ``{ "sources": { "<source_pdf>": { section... } } }``.

    Migrates legacy flat documents (single ``source_pdf`` + ``entries`` at top level).
    """
    if not path.is_file():
        return {"sources": {}}
    try:
        with open(path, encoding="utf-8") as f:
            raw = json.load(f)
    except (json.JSONDecodeError, OSError):
        return {"sources": {}}
    if not isinstance(raw, dict):
        return {"sources": {}}
    src = raw.get("sources")
    if isinstance(src, dict):
        return {"sources": dict(src)}
    # Legacy: one extract per file
    if "source_pdf" in raw and isinstance(raw.get("entries"), list):
        sp = raw["source_pdf"]
        section = {
            "extracted_at": raw.get("extracted_at"),
            "schedule_json": raw.get("schedule_json"),
            "flagged_series_count": raw.get("flagged_series_count", len(raw["entries"])),
            "entries": raw["entries"],
        }
        return {"sources": {sp: section}}
    return {"sources": {}}


def _write_extract_flags_store(path: Path, store: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(store, f, indent=2)
        f.write("\n")


def _configure_stderr_for_live_progress() -> None:
    """Reduce buffering so progress lines show up immediately (TTY \\r-only updates often batch until exit)."""
    err = sys.stderr
    try:
        err.reconfigure(line_buffering=True, write_through=True)
    except (AttributeError, OSError, ValueError, TypeError):
        try:
            err.reconfigure(line_buffering=True)
        except (AttributeError, OSError, ValueError, TypeError):
            pass


def _progress_line(message: str) -> None:
    print(message, file=sys.stderr, flush=True)


def _report_series_progress(i: int, total: int, *, final: bool = False) -> None:
    """One line per step (newline-terminated) so IDEs and line-buffered stderr show incremental output."""
    if final:
        _progress_line(f"Processing series {i} of {total} — done")
        return
    _progress_line(f"Processing series {i} of {total}…")


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract series schedule from PDF")
    parser.add_argument("--pdf", default=PDF_PATH, help="Path to input PDF")
    parser.add_argument("--output", default=OUTPUT_PATH, help="Path to output JSON")
    parser.add_argument(
        "--flags-output",
        default=None,
        metavar="PATH",
        help=f"Validation flags summary JSON (default: {DEFAULT_FLAGS_BASENAME} next to --output)",
    )
    parser.add_argument("--dry-run", action="store_true", help="Print summary, skip writing output")
    args = parser.parse_args()

    _configure_stderr_for_live_progress()

    try:
        _progress_line("Opening PDF…")
        pdf_file = pdfplumber.open(args.pdf)
    except FileNotFoundError:
        logger.error("PDF not found: %s", args.pdf)
        return

    _progress_line("Scanning pages and tables for series blocks (can take a bit)…")
    with pdf_file:
        blocks = detect_blocks(pdf_file)
        toc_assign = toc_section_assignments(pdf_file)
    n_blocks = len(blocks)
    if len(toc_assign) == n_blocks:
        for block, (sl, sd) in zip(blocks, toc_assign):
            block["section_license"] = sl
            block["section_discipline"] = sd
    elif toc_assign:
        logger.warning(
            "TOC series count %d != table blocks %d — section discipline may be wrong",
            len(toc_assign),
            n_blocks,
        )
    logger.info("Detected %d series blocks", n_blocks)
    _progress_line(f"Found {n_blocks} series blocks. Building schedule JSON…")

    output: list[dict] = []
    extract_flag_entries: list[dict] = []
    skipped = 0
    for i, block in enumerate(blocks, start=1):
        _report_series_progress(i, n_blocks)
        series = build_series(block)
        if series is not None:
            d = _series_dict_with_flags(series)
            if d["flags"]:
                extract_flag_entries.append({"series": d["series"], "flags": d["flags"]})
                _print_series_flags_to_terminal(d["series"], d["flags"])
            output.append(d)
        else:
            skipped += 1
    _report_series_progress(n_blocks, n_blocks, final=True)

    flagged_count = len(extract_flag_entries)
    print(f"\nExtracted {len(output)} series, skipped {skipped} blocks")

    if args.dry_run:
        print("Dry run — no output written")
        if flagged_count:
            print(f"  {flagged_count} series would have validation flags (see stderr above)")
        return

    schedule_path = Path(args.output).expanduser().resolve()
    flags_path = _resolve_flags_output_path(args.output, args.flags_output)
    schedule_path.parent.mkdir(parents=True, exist_ok=True)

    _progress_line(f"Writing JSON to {schedule_path}…")
    with open(schedule_path, "w") as f:
        json.dump(output, f, indent=2)
    print(f"Written to {schedule_path}")

    pdf_rel = _path_relative_to_repo(Path(args.pdf).expanduser().resolve())
    section = {
        "extracted_at": datetime.now(timezone.utc).isoformat(),
        "schedule_json": _path_relative_to_repo(schedule_path),
        "flagged_series_count": flagged_count,
        "entries": extract_flag_entries,
    }
    store = _load_extract_flags_store(flags_path)
    store["sources"][pdf_rel] = section
    _progress_line(f"Merging flags summary into {flags_path} (source {pdf_rel})…")
    _write_extract_flags_store(flags_path, store)
    print(f"Updated {flags_path} (entry for {pdf_rel})")

    if flagged_count:
        print(
            f"  {flagged_count} series have validation flags — see {flags_path.name}, stderr above, and each series in the JSON",
        )


if __name__ == "__main__":
    main()
