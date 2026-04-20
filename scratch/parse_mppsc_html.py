import os
from bs4 import BeautifulSoup
import json

def extract_mppsc_data(html_file):
    if not os.path.exists(html_file):
        return f"File {html_file} not found"
        
    with open(html_file, 'r', encoding='utf-8') as f:
        html_content = f.read()
        
    soup = BeautifulSoup(html_content, 'html.parser')
    table = soup.find('table', class_='result_table')
    if not table:
        return "Table with class 'result_table' not found"
    
    rows = table.find('tbody').find_all('tr')
    all_data = []
    
    for row in rows:
        cols = row.find_all('td')
        if len(cols) < 4:
            continue
            
        s_no = cols[0].get_text(strip=True)
        title = cols[1].get_text(strip=True)
        year = cols[2].get_text(strip=True)
        
        links = []
        # Links are in the 4th column (index 3)
        link_tags = cols[3].find_all('a', href=True)
        for a in link_tags:
            name = a.get_text(strip=True)
            url = a['href']
            # Make URL absolute if needed
            if not url.startswith('http'):
                url = "https://mppsc.mp.gov.in" + url
            links.append({
                'label': name,
                'url': url
            })
            
        all_data.append({
            's_no': s_no,
            'title': title,
            'year': year,
            'links': links
        })
        
    return all_data

if __name__ == "__main__":
    html_path = r"c:\Users\Ankit\Desktop\learn app\scratch\mppsc_papers.html"
    result = extract_mppsc_data(html_path)
    print(json.dumps(result, indent=2))
