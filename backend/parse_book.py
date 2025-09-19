# backend/parse_book.py
import fitz  # The PyMuPDF library

PDF_PATH = "javanotes5.pdf"
OUTPUT_FILE = "book_data.txt"

all_text = ""

print(f"Opening PDF: {PDF_PATH}...")

# Open the PDF file
with fitz.open(PDF_PATH) as doc:
    print(f"PDF has {len(doc)} pages.")

    # Loop through every page in the document
    for page_num, page in enumerate(doc):
        # Extract the raw text from the page
        page_text = page.get_text()
        all_text += page_text + "\n"

        # Print progress every 50 pages
        if (page_num + 1) % 50 == 0:
            print(f"Processed {page_num + 1} pages...")

# Save the combined text to the output file
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write(all_text)

print(f"\nSuccessfully extracted all text to {OUTPUT_FILE}")