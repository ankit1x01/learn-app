import json
import re
import requests
from bs4 import BeautifulSoup

AJAX_URL_TEMPLATE = "https://mppsc.mp.gov.in/Oldquestionpaper/ajaxPaginationData/{}"
HEADERS = {
    "User-Agent": "Mozilla/5.0",
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

def generate_report():
    print("Fetching live data to build mapping report...")
    offsets = [0, 25, 50]
    expected_dataset = []

    for offset in offsets:
        url = AJAX_URL_TEMPLATE.format(offset)
        try:
            response = requests.post(url, headers=HEADERS, data={'page': offset}, timeout=30)
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

                cat_type, cat_name = get_category(exam_title)
                prefix = cat_name.upper() if cat_type != "other_exams" else cat_name
                
                clean_label = label_text.strip()
                filename_to_parse = clean_label if clean_label.lower() not in ['download', 'dowload', 'view'] else "paper"
                
                stage = get_stage(filename_to_parse, exam_title, prefix)
                
                if cat_type == "other_exams":
                    target_dir = f"mppsc/{cat_type}/{cat_name}/{stage}/{year}"
                else:
                    target_dir = f"mppsc/{cat_type}/{stage}/{year}"
                    
                safe_label = slugify(filename_to_parse)
                new_filename = f"{prefix}_{stage}_{year}_{safe_label}.pdf"
                target_path = f"{target_dir}/{new_filename}"
                
                expected_dataset.append({
                    "original_exam_title": exam_title,
                    "original_link_label": label_text,
                    "year": year,
                    "assigned_category": cat_type,
                    "assigned_stage": stage,
                    "target_folder": target_dir,
                    "target_filename": new_filename
                })

    # Save to JSON for exact verification
    with open("scratch/expected_mapping.json", "w", encoding="utf-8") as f:
        json.dump(expected_dataset, f, indent=2)

    # Generate a readable Markdown summary grouping by Category -> Stage
    summary = {}
    for item in expected_dataset:
        path_key = item['target_folder']
        if path_key not in summary:
            summary[path_key] = []
        summary[path_key].append(item)

    with open("scratch/expected_mapping.md", "w", encoding="utf-8") as f:
        f.write("# MPPSC Expected Dataset Mapping\n\n")
        f.write("This document maps what is currently on the MPPSC website to where our fetcher will place it.\n\n")
        
        for folder in sorted(summary.keys()):
            f.write(f"## `/{folder}` ({len(summary[folder])} papers)\n")
            for paper in summary[folder]:
                f.write(f"- Website Name: **{paper['original_exam_title']}** -> Link: `{paper['original_link_label']}`\n")
                f.write(f"  - Target Filename: `{paper['target_filename']}`\n")
            f.write("\n")

    print(f"Generated successfully. Found {len(expected_dataset)} papers.")

if __name__ == "__main__":
    generate_report()
