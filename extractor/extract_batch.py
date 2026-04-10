from __future__ import annotations

import argparse
import dataclasses
import json
import logging
import re

import pdfplumber
from tqdm import tqdm

from .config import TOC_PATH, PDF_PATH, OUTPUT_PATH
from .toc_parser import build_index
from .series_builder import build_series
from .validation import validate_series

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)


def detect_blocks(pdf) -> list[dict]:
    """Scan PDF tables and group into per-series blocks.

    Creates a new block whenever a table's first row contains 'Season'
    (the series header cell). This naturally handles multiple series per page
    and series whose season number wraps to a new line.
    """
    blocks = []
    current_block = None
    for page in pdf.pages:
        for t in page.find_tables():
            rows = t.extract()
            if not rows:
                continue
            first_cell = str(rows[0][0] or "")
            if re.search(r"\bSeason\b", first_cell):
                if current_block is not None:
                    blocks.append(current_block)
                current_block = {"header": first_cell, "tables": [rows]}
            elif re.search(r"\bWeek\s+\d+\b", first_cell) and current_block is not None:
                current_block["tables"].append(rows)
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
    parser.add_argument("--toc", default=TOC_PATH, help="Path to TOC text file")
    parser.add_argument("--output", default=OUTPUT_PATH, help="Path to output JSON")
    parser.add_argument("--dry-run", action="store_true", help="Print summary, skip writing output")
    args = parser.parse_args()

    toc_index = build_index(args.toc)
    logger.info("TOC index built: %d entries", len(toc_index))

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
        series = build_series(block, toc_index)
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
