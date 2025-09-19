# backend/clean_data.py

#INPUT_FILE = "javadocs.txt"
#OUTPUT_FILE = "javadocs_clean.txt"

# In clean_data.py
INPUT_FILE = "book_data.txt"
OUTPUT_FILE = "book_data_clean.txt"

print(f"Reading from {INPUT_FILE}...")

with open(INPUT_FILE, "r", encoding="utf-8") as f:
    lines = f.readlines()

cleaned_lines = []
for line in lines:
    # 1. Remove leading/trailing whitespace from each line
    stripped_line = line.strip()

    # 2. Filter out very short lines that are likely just noise
    if len(stripped_line) > 10:
        cleaned_lines.append(stripped_line)

print(f"Processed {len(lines)} lines, kept {len(cleaned_lines)} clean lines.")

# 3. Join the cleaned lines back together and save to a new file
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write("\n".join(cleaned_lines))

print(f"Clean data saved to {OUTPUT_FILE}")