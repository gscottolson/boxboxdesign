from __future__ import annotations

import argparse
import dataclasses
import json
import logging
import re
import pdfplumber
from tqdm import tqdm

from .config import PDF_PATH, OUTPUT_PATH
from .series_builder import build_series
from .validation import validate_series

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

# e.g. "D Class Series (OVAL)", "Rookie Class Series (OVAL)" — applies to following series until the next heading.
SECTION_HEADING_RE = re.compile(
    r"^(Rookie|[A-Z])\s+Class\s+Series\s*\(\s*([^)]+?)\s*\)\s*$",
    re.IGNORECASE | re.MULTILINE,
)

_PDF_DISCIPLINE_ALIASES: dict[str, str] = {
    "OVAL": "Oval",
    "ROAD": "Road",
    "DIRT OVAL": "Dirt Oval",
    "DIRT ROAD": "Dirt Road",
    "SPORTS CAR": "Sports Car",
    "FORMULA CAR": "Formula Car",
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


def detect_blocks(pdf) -> list[dict]:
    """Scan PDF tables in order: section headings set discipline/license for following series blocks."""
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


def _build_output(results) -> list[dict]:
    """Convert SeriesData list to dicts with validation flags embedded."""
    output = []
    for series in results:
        d = dataclasses.asdict(series)
        d["flags"] = validate_series(d)
        output.append(d)
    return output


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract series schedule from PDF")
    parser.add_argument("--pdf", default=PDF_PATH, help="Path to input PDF")
    parser.add_argument("--output", default=OUTPUT_PATH, help="Path to output JSON")
    parser.add_argument("--dry-run", action="store_true", help="Print summary, skip writing output")
    args = parser.parse_args()

    try:
        pdf_file = pdfplumber.open(args.pdf)
    except FileNotFoundError:
        logger.error("PDF not found: %s", args.pdf)
        return

    with pdf_file:
        blocks = detect_blocks(pdf_file)
    logger.info("Detected %d series blocks", len(blocks))

    results = []
    skipped = 0
    for block in tqdm(blocks, desc="Processing series"):
        series = build_series(block)
        if series is not None:
            results.append(series)
        else:
            skipped += 1

    print(f"\nExtracted {len(results)} series, skipped {skipped} blocks")

    if args.dry_run:
        print("Dry run — no output written")
        return

    output = _build_output(results)
    flagged_count = sum(1 for s in output if s["flags"])
    with open(args.output, "w") as f:
        json.dump(output, f, indent=2)
    print(f"Written to {args.output}")
    if flagged_count:
        print(f"  {flagged_count} series have validation flags — check the 'flags' field in the JSON")


if __name__ == "__main__":
    main()
