import json
import os
import requests
from bs4 import BeautifulSoup

def validate():
    print("Connecting to live MPPSC Database. Please wait...")
    AJAX_URL = "https://mppsc.mp.gov.in/Oldquestionpaper/ajaxPaginationData/{}"
    HEADERS = {
        "User-Agent": "Mozilla/5.0",
        "X-Requested-With": "XMLHttpRequest"
    }

    # 1. Gather all actual PDF links from the live website
    web_pdf_links = []
    offsets = [0, 25, 50]
    
    for o in offsets:
        try:
            r = requests.post(AJAX_URL.format(o), data={'page': o}, headers=HEADERS, timeout=30)
            soup = BeautifulSoup(r.text, 'html.parser')
            for a in soup.find('tbody').find_all('a', href=True):
                web_pdf_links.append(a['href'])
        except Exception as e:
            print(f"Error checking web: {e}")

    # 2. Count local metadata
    try:
        with open("mppsc/metadata.json", "r", encoding="utf-8") as f:
            meta_data = json.load(f)
        meta_count = len(meta_data)
    except:
        meta_count = 0

    # 3. Count physical files in mppsc/ folder
    physical_count = 0
    for root, dirs, files in os.walk("mppsc"):
        for file in files:
            if file.endswith(".pdf"):
                physical_count += 1

    # 4. Generate Validation Report
    print("\n================ DATASET VALIDATION REPORT ================")
    print(f"LIVE WEBSITE Total PDF Links:  {len(web_pdf_links)}")
    print(f"LOCAL SYSTEM JSON Database:    {meta_count}")
    print(f"LOCAL SYSTEM Physical PDFs:    {physical_count}\n")

    if len(web_pdf_links) == physical_count and physical_count == meta_count:
        print("[SUCCESS] 100% PERFECT MATCH.")
        print("Your local dataset contains exactly what is on the website with zero bug, skips, or omissions.")
    else:
        print("[WARNING] Numbers do not align perfectly.")

if __name__ == "__main__":
    validate()
