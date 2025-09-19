# backend/scraper.py

import requests
from bs4 import BeautifulSoup

# A list of several important Java documentation pages
URLS = [
    "https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/String.html",
    "https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Object.html",
    "https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/ArrayList.html",
    "https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Integer.html"
]

all_text = ""

# Loop through each URL in our list
for url in URLS:
    print(f"Fetching content from {url}...")
    response = requests.get(url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        main_content = soup.find('main')
        
        if main_content:
            # Add the text from this page to our collection
            all_text += main_content.get_text(separator='\n', strip=True) + "\n"
            print(f"Successfully scraped {url}")
        else:
            print(f"Could not find main content at {url}")
    else:
        print(f"Failed to download page {url}. Status code: {response.status_code}")

# Save all the combined text to our file
with open("javadocs.txt", "w", encoding="utf-8") as f:
    f.write(all_text)
    
print("\nScraping complete. All text saved to javadocs.txt")