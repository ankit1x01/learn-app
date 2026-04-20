import os
import re
import json
import requests
from bs4 import BeautifulSoup

TARGET_ROOT = "mppsc"
AJAX_URL_TEMPLATE = "https://mppsc.mp.gov.in/Oldquestionpaper/ajaxPaginationData/{}"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest"
}

MAPPING = {
    "state service": "SSE",
    "state forest": "SFS",
    "state engineering": "SES",
    "state eligibility": "SET",
    "assistant professor": "Assistant_Professor",
    "dental surgeon": "Dental_Surgeon"
}

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '_', text)
    return text.strip('_')

def get_category(title):
    t_lower = title.lower()
    if "state forest" in t_lower:
        return "SFS", "SFS"
    for key, val in MAPPING.items():
        if key in t_lower:
            return val, val
    
    match = re.split(r'Exam|Examination', title, flags=re.IGNORECASE)
    exam_name = match[0].strip() if match else "general"
    return "other_exams", slugify(exam_name)

def get_stage(filename, title, exam_prefix):
    combined = (filename + " " + title).lower()
    
    if "prelim" in combined:
        return "prelims"
        
    explicit_mains = ["main", "mains", "gs-i", "gs-ii", "gs-iii", "gs-iv", "gs-v", "gs-vi", "question answer", "quetion_answer"]
    if any(k in combined for k in explicit_mains):
        return "mains"
        
    if exam_prefix in ["SSE", "SFS"] and "paper" in combined:
        return "mains"
        
    return "na"

def download_and_structure():
    if not os.path.exists(TARGET_ROOT):
        os.makedirs(TARGET_ROOT)

    metadata = []
    metadata_file = os.path.join(TARGET_ROOT, "metadata.json")
    
    if os.path.exists(metadata_file):
        try:
            with open(metadata_file, "r", encoding="utf-8") as f:
                metadata = json.load(f)
        except:
            metadata = []
    
    existing_paths = {p['file_path'] for p in metadata}

    offsets = [0, 25, 50]
    total_found = 0
    successful_downloads = 0

    for offset in offsets:
        url = AJAX_URL_TEMPLATE.format(offset)
        print(f"Fetching records from offset {offset}...")
        
        try:
            response = requests.post(url, headers=HEADERS, data={'page': offset}, timeout=30)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            rows = soup.find('tbody').find_all('tr')
        except Exception as e:
            print(f"Error fetching offset {offset}: {e}")
            continue

        for row in rows:
            cols = row.find_all('td')
            if len(cols) < 4: continue
            
            exam_title = cols[1].get_text(strip=True).replace('/', '_')
            year = cols[2].get_text(strip=True)
            link_tags = cols[3].find_all('a', href=True)
            
            for a in link_tags:
                label_text = a.get_text(strip=True)
                pdf_url = a['href']
                if not pdf_url.startswith('http'):
                    pdf_url = "https://mppsc.mp.gov.in" + pdf_url
                
                cat_type, cat_name = get_category(exam_title)
                prefix = cat_name.upper() if cat_type != "other_exams" else cat_name
                
                # If label is just "Download", use "paper" instead so it isn't named "download.pdf"
                clean_label = label_text.strip()
                filename_to_parse = clean_label if clean_label.lower() not in ['download', 'dowload', 'view'] else "paper"
                
                stage = get_stage(filename_to_parse, exam_title, prefix)
                
                if cat_type == "other_exams":
                    target_dir = os.path.join(TARGET_ROOT, cat_type, cat_name, stage, year)
                else:
                    target_dir = os.path.join(TARGET_ROOT, cat_type, stage, year)
                    
                if not os.path.exists(target_dir):
                    os.makedirs(target_dir)

                safe_label = slugify(filename_to_parse)
                new_filename = f"{prefix}_{stage}_{year}_{safe_label}.pdf"
                target_path = os.path.join(target_dir, new_filename).replace("\\", "/")
                
                total_found += 1
                
                if os.path.exists(target_path) and os.path.getsize(target_path) > 0:
                    # Skip download, already exists
                    if target_path not in existing_paths:
                        metadata.append({
                            "year": int(year) if year.isdigit() else year,
                            "exam": prefix,
                            "stage": stage,
                            "label": filename_to_parse,
                            "file_path": target_path
                        })
                        existing_paths.add(target_path)
                    continue

                try:
                    print(f"  [DOWNLOADING] {target_path}")
                    r = requests.get(pdf_url, stream=True, timeout=30, headers=HEADERS)
                    r.raise_for_status()
                    with open(target_path, 'wb') as f:
                        for chunk in r.iter_content(chunk_size=8192):
                            f.write(chunk)
                    successful_downloads += 1
                    
                    if target_path not in existing_paths:
                        metadata.append({
                            "year": int(year) if year.isdigit() else year,
                            "exam": prefix,
                            "stage": stage,
                            "label": filename_to_parse,
                            "file_path": target_path
                        })
                        existing_paths.add(target_path)
                except Exception as e:
                    print(f"  [ERROR] Failed to fetch {pdf_url}: {e}")

        # Update index on the fly
        with open(metadata_file, "w", encoding="utf-8") as f:
            json.dump(metadata, f, indent=2)

    print(f"\n--- Unified Fetch Process Completed ---")
    print(f"Total Papers Scanned: {total_found}")
    print(f"New Downloads: {successful_downloads}")
    print(f"Metadata index refreshed securely at {metadata_file}")

if __name__ == "__main__":
    download_and_structure()
