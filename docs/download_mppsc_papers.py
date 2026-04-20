import os
import re
import requests
from bs4 import BeautifulSoup
import time

# Configuration
BASE_URL = "https://mppsc.mp.gov.in/Oldquestionpaper"
AJAX_URL_TEMPLATE = "https://mppsc.mp.gov.in/Oldquestionpaper/ajaxPaginationData/{}"
SAVE_BASE_DIR = os.path.join("docs", "exams", "mppsc", "question papers")
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest"
}

def sanitize_filename(name):
    """Remove invalid characters from filename."""
    name = re.sub(r'[<>:"/\\|?*]', '_', name)
    return name.strip()[:200]

def download_file(url, year, original_title, link_label):
    """Download a file and save it in a year-based directory."""
    # Construct filename: Exam Name - Subject Label.pdf
    # If link_label is just "Download" or "Paper", only use original_title
    clean_label = link_label.strip()
    if clean_label.lower() in ['download', 'dowload', 'paper', 'view']:
        filename = f"{original_title}.pdf"
    else:
        filename = f"{original_title} - {clean_label}.pdf"
    
    filename = sanitize_filename(filename)
    
    year_dir = os.path.join(SAVE_BASE_DIR, sanitize_filename(year))
    if not os.path.exists(year_dir):
        os.makedirs(year_dir)
        
    filepath = os.path.join(year_dir, filename)
    
    if os.path.exists(filepath):
        print(f"  [SKIPPED] Already exists: {filename}")
        return True

    try:
        response = requests.get(url, stream=True, timeout=30, headers=HEADERS)
        response.raise_for_status()
        
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"  [DONE] Downloaded: {filename}")
        return True
    except Exception as e:
        print(f"  [ERROR] Failed to download {url}: {e}")
        return False

def extract_links_from_html(html_content):
    """Extract paper names, years, and all PDF links from the HTML table."""
    soup = BeautifulSoup(html_content, 'html.parser')
    papers = []
    
    table = soup.find('table', class_='result_table')
    if not table:
        return papers
        
    tbody = table.find('tbody')
    if not tbody:
        return papers
        
    rows = tbody.find_all('tr')
    for row in rows:
        cols = row.find_all('td')
        if len(cols) >= 4:
            # Structure: 0: S.No, 1: Title, 2: Year, 3: Downloads
            title = cols[1].get_text(strip=True)
            year = cols[2].get_text(strip=True)
            
            # Find all links in the Downloads column
            link_tags = cols[3].find_all('a', href=True)
            for a in link_tags:
                label = a.get_text(strip=True)
                url = a['href']
                
                if not url.startswith('http'):
                    url = "https://mppsc.mp.gov.in" + url
                
                # Check for PDF or just assume it's a download if it's in this column
                papers.append({
                    'title': title,
                    'year': year,
                    'label': label,
                    'url': url
                })
    return papers

def main():
    if not os.path.exists(SAVE_BASE_DIR):
        os.makedirs(SAVE_BASE_DIR)
        print(f"Created base directory: {SAVE_BASE_DIR}")

    all_papers = []

    # 1. Fetch all records via AJAX
    # The site uses offsets of 25. Total records: 66.
    # Offsets: 0 (first page), 25 (second page), 50 (third page)
    offsets = [0, 25, 50]
    
    for offset in offsets:
        url = AJAX_URL_TEMPLATE.format(offset)
        print(f"Fetching AJAX page (offset {offset}): {url}")
        try:
            # The site uses POST for searchFilter
            response = requests.post(url, headers=HEADERS, data={'page': offset}, timeout=30)
            response.raise_for_status()
            new_papers = extract_links_from_html(response.text)
            if not new_papers:
                print(f"No papers found at offset {offset}.")
                continue
            all_papers.extend(new_papers)
            print(f"Found {len(new_papers)} papers at offset {offset}.")
        except Exception as e:
            print(f"Error fetching offset {offset}: {e}")
        
        # Politeness delay
        time.sleep(1)

    print(f"\nTotal links found: {len(all_papers)}")

    # 3. Download all papers
    successful = 0
    for i, paper in enumerate(all_papers, 1):
        print(f"[{i}/{len(all_papers)}] Processing: {paper['title']} ({paper['year']})")
        if download_file(paper['url'], paper['year'], paper['title'], paper['label']):
            successful += 1

    print(f"\nProcess completed!")
    print(f"Successfully downloaded/verified {successful} out of {len(all_papers)} total links.")

if __name__ == "__main__":
    main()
