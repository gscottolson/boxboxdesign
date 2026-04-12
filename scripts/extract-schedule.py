#!/usr/bin/env python3
"""Interactive picker: choose a PDF under schedules/ and run the series extractor."""

from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
SCHEDULES_DIR = REPO_ROOT / "schedules"
DEFAULT_OUTPUT_DIR = REPO_ROOT / "app" / "(iracing)" / "iracing" / "data"


def list_pdfs() -> list[Path]:
    if not SCHEDULES_DIR.is_dir():
        return []
    return sorted(SCHEDULES_DIR.glob("*.pdf"), key=lambda p: p.name.lower())


def main() -> None:
    pdfs = list_pdfs()
    if not pdfs:
        print(f"No PDF files found in {SCHEDULES_DIR}", file=sys.stderr)
        sys.exit(1)

    print("Schedule PDFs:\n")
    for i, p in enumerate(pdfs, start=1):
        print(f"  {i}) {p.name}")
    print()

    raw = input(f"Select 1–{len(pdfs)} (q to quit): ").strip()
    if raw.lower() in ("q", "quit", ""):
        print("Aborted.")
        sys.exit(0)

    try:
        n = int(raw)
    except ValueError:
        print("Invalid number.", file=sys.stderr)
        sys.exit(1)

    if not 1 <= n <= len(pdfs):
        print("Out of range.", file=sys.stderr)
        sys.exit(1)

    pdf = pdfs[n - 1]
    out = DEFAULT_OUTPUT_DIR / f"{pdf.stem}.json"
    flags_out = DEFAULT_OUTPUT_DIR / "extract-flags.json"
    DEFAULT_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    cmd = [
        sys.executable,
        "-u",
        "-m",
        "extractor.extract_batch",
        "--pdf",
        str(pdf),
        "--output",
        str(out),
    ]
    env = {**os.environ, "PYTHONUNBUFFERED": "1"}
    print(f"\nPDF:    {pdf.relative_to(REPO_ROOT)}")
    print(f"Output: {out.relative_to(REPO_ROOT)}")
    print(f"Flags:  {flags_out.relative_to(REPO_ROOT)} (merges entry for this PDF; other sources kept)\n")

    # Replace this process so stderr stays attached to your terminal (reliable progress from extract_batch).
    os.chdir(REPO_ROOT)
    try:
        os.execve(sys.executable, cmd, env)
    except OSError as exc:
        print(f"Could not exec extractor ({exc}); falling back to subprocess.", file=sys.stderr)
        r = subprocess.run(cmd, cwd=REPO_ROOT, env=env)
        sys.exit(r.returncode)


if __name__ == "__main__":
    main()
