import pdfplumber
import os

PDF_PATH = "output/SeasonSchedule.pdf"  # Adjust if needed

if not os.path.exists(PDF_PATH):
    print(f"PDF not found at {PDF_PATH}")
    exit(1)

with pdfplumber.open(PDF_PATH) as pdf:
    for i, page in enumerate(pdf.pages):
        print(f"\n--- Page {i+1} ---")
        text = page.extract_text()
        print("[TEXT SECTION]\n", text)
        tables = page.extract_tables()
        for t_idx, table in enumerate(tables):
            print(f"[TABLE {t_idx+1}]\n")
            for row in table:
                print(row)
            print()
        print("-"*40)
