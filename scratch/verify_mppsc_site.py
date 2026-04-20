import os
import requests
from bs4 import BeautifulSoup

def verify_website():
    print("Fetching directly from the live MPPSC website...")
    AJAX_URL = "https://mppsc.mp.gov.in/Oldquestionpaper/ajaxPaginationData/{}"
    HEADERS = {
        "User-Agent": "Mozilla/5.0",
        "X-Requested-With": "XMLHttpRequest"
    }

    # Fetch all records
    results = []
    offsets = [0, 25, 50]
    for o in offsets:
        r = requests.post(AJAX_URL.format(o), data={'page': o}, headers=HEADERS)
        soup = BeautifulSoup(r.text, 'html.parser')
        rows = soup.find('tbody').find_all('tr')
        for row in rows:
            tds = row.find_all('td')
            if len(tds) < 4: continue
            title = tds[1].get_text(strip=True)
            year = tds[2].get_text(strip=True)
            links = [a.get_text(strip=True) for a in tds[3].find_all('a', href=True)]
            
            # Filter specifically for State Service
            if "state service" in title.lower() and "state forest" not in title.lower():
                results.append((year, title, links))

    # Print results to console nicely
    print("\n--- Live Website Data for SSE ---")
    for year, title, links in sorted(results, key=lambda x: str(x[0]), reverse=True):
        print(f"\nYear: {year}")
        print(f"Title: {title}")
        for link in links:
            print(f"  -> {link}")

if __name__ == "__main__":
    verify_website()
