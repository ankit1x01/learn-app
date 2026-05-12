import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, unquote
import urllib3
import re

# Suppress insecure request warnings if verify=False is needed
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

BASE_URL = "https://www.cbse.gov.in/cbsenew/"
START_URL = urljoin(BASE_URL, "question-paper.html")
BASE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs", "exams")

def clean_subject_name(filename):
    name = unquote(filename)
    name = name.replace('.zip', '').replace('.pdf', '')
    # Remove leading numbers and underscores (e.g., '086_Science' -> 'Science')
    name = re.sub(r'^\d+_?', '', name)
    name = name.replace('_', ' ').strip().upper()
    return name

def download_file(url, target_dir, file_name):
    if not os.path.exists(target_dir):
        os.makedirs(target_dir, exist_ok=True)
    
    file_path = os.path.join(target_dir, file_name)
    if os.path.exists(file_path):
        print(f"Skipping (Already exists): {file_path}")
        return

    print(f"Downloading -> {file_path}")
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }
    try:
        response = requests.get(url, headers=headers, verify=False, stream=True, timeout=20)
        response.raise_for_status()
        with open(file_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
    except Exception as e:
        print(f"Failed to download {url}: {e}")

def process_links(soup):
    links = soup.find_all('a')
    for a in links:
        href = a.get('href', '')
        # Filter for question paper files
        if not href.startswith('question-paper/'):
            continue
            
        parts = href.split('/')
        if len(parts) < 4:
            continue
            
        # e.g., href: question-paper/2025-COMPTT/XII/086_Science.zip
        year_part = parts[1]
        class_part = parts[2]
        filename = parts[-1]
        
        # Parse Year and Exam Type
        if '-COMPTT' in year_part:
            year = year_part.replace('-COMPTT', '')
            exam_type = 'Compartment'
        else:
            year = year_part
            exam_type = 'Main'
            
        # Parse Class
        if class_part == 'X':
            cls = '10'
        elif class_part == 'XII':
            cls = '12'
        else:
            continue # Unexpected class level
            
        subject = clean_subject_name(filename)
        
        target_dir = os.path.join(BASE_DIR, cls, subject, year, exam_type)
        download_url = urljoin(BASE_URL, href)
        
        download_file(download_url, target_dir, filename)

def main():
    print(f"Fetching: {START_URL}")
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    try:
        response = requests.get(START_URL, headers=headers, verify=False, timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")
    except Exception as e:
        print(f"Error fetching MAIN page: {e}")
        return

    process_links(soup)

if __name__ == "__main__":
    main()
