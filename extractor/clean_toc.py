import re

with open('toc_extract.txt', 'r') as f:
    lines = f.readlines()

cleaned = []
for line in lines:
    # Remove all trailing dots, spaces, and page numbers
    cleaned.append(re.sub(r'[ .]*\d+$', '', line.rstrip(' .')))

with open('toc_extract.txt', 'w') as f:
    for line in cleaned:
        f.write(line + '\n')
