import os
import re
import requests
from bs4 import BeautifulSoup

BASE_URL = "https://mppsc.mp.gov.in/Oldquestionpaper"
AJAX_URL_TEMPLATE = "https://mppsc.mp.gov.in/Oldquestionpaper/ajaxPaginationData/{}"
SAVE_BASE_DIR = os.path.join("docs", "exams", "mppsc", "question papers")
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest"
}

def sanitize_filename(name):
    name = re.sub(r'[<>:"/\\|?*]', '_', name)
    return name.strip()[:200]

def get_expected_path(year, title, label):
    clean_label = label.strip()
    if clean_label.lower() in ['download', 'dowload', 'paper', 'view']:
        filename = f"{title}.pdf"
    else:
        filename = f"{title} - {clean_label}.pdf"
    
    filename = sanitize_filename(filename)
    year_dir = os.path.join(SAVE_BASE_DIR, sanitize_filename(year))
    return os.path.join(year_dir, filename)

def verify():
    print("Fetching records from site...")
    all_papers = []
    offsets = [0, 25, 50]
    
    for offset in offsets:
        url = AJAX_URL_TEMPLATE.format(offset)
        try:
            response = requests.post(url, headers=HEADERS, data={'page': offset}, timeout=30)
            soup = BeautifulSoup(response.text, 'html.parser')
            rows = soup.find('tbody').find_all('tr')
            for row in rows:
                cols = row.find_all('td')
                if len(cols) >= 4:
                    title = cols[1].get_text(strip=True)
                    year = cols[2].get_text(strip=True)
                    link_tags = cols[3].find_all('a', href=True)
                    for a in link_tags:
                        all_papers.append({
                            'year': year,
                            'title': title,
                            'label': a.get_text(strip=True),
                            'url': a['href']
                        })
        except Exception as e:
            print(f"Error fetching offset {offset}: {e}")

    print(f"Total links found on site: {len(all_papers)}")
    
    missing = []
    duplicates = {}
    
    for p in all_papers:
        expected = get_expected_path(p['year'], p['title'], p['label'])
        if expected in duplicates:
            duplicates[expected].append(p['url'])
        else:
            duplicates[expected] = [p['url']]
            
        if not os.path.exists(expected):
            missing.append(p)

    print(f"Unique filenames expected: {len(duplicates)}")
    print(f"Missing files: {len(missing)}")
    
    collision_count = 0
    for path, urls in duplicates.items():
        if len(urls) > 1:
            collision_count += len(urls) - 1
            print(f"Filename Collision: {path}")
            for u in urls:
                print(f"  - {u}")
                
    if missing:
        print("\nMissing Papers Details:")
        for m in missing:
            print(f"  Year: {m['year']} | Title: {m['title']} | Label: {m['label']} | URL: {m['url']}")
    else:
        print("\nAll expected files are present (considering potential name collisions).")

if __name__ == "__main__":
    verify()
