import os
import json
import requests
from bs4 import BeautifulSoup
import re
import time

BASE_URL = 'https://questions.examside.com'
MAIN_URL = f'{BASE_URL}/past-years/jee/jee-advanced/physics'

def scrape_physics():
    print(f"Fetching main page: {MAIN_URL}")
    try:
        r = requests.get(MAIN_URL)
        r.raise_for_status()
    except Exception as e:
        print(f"Error fetching main page: {e}")
        return

    soup = BeautifulSoup(r.text, 'html.parser')
    
    # Find topic links
    topic_links = soup.find_all('a', href=lambda href: href and href.startswith('/past-years/jee/jee-advanced/physics/'))
    
    topics = {}
    for link in topic_links:
        topic_url = BASE_URL + link['href']
        topic_name = link.text.strip().split('2025:')[0].strip() # Clean up the topic name
        if not topic_name:
            continue
            
        # Ensure unique topics
        if topic_name not in topics:
            topics[topic_name] = topic_url

    print(f"Found {len(topics)} topics")
    
    results = {}
    
    for topic_name, topic_url in topics.items():
        print(f"Scraping topic: {topic_name} -> {topic_url}")
        
        try:
            r_topic = requests.get(topic_url)
            r_topic.raise_for_status()
        except Exception as e:
            print(f"Error fetching {topic_url}: {e}")
            continue
            
        topic_soup = BeautifulSoup(r_topic.text, 'html.parser')
        q_links = topic_soup.find_all('a', href=lambda href: href and '/question/' in href)
        
        questions = []
        for q_link in q_links:
            text = q_link.text.strip()
            # Actual questions usually start with a number followed by space(s)
            if re.match(r'^\d+\s+', text):
                # Clean up the leading number
                clean_text = re.sub(r'^\d+\s+', '', text)
                
                # Extract the exam year from the end if present (e.g. "JEE Advanced 2025 Paper 2 Online")
                exam_info = ""
                exam_match = re.search(r'(JEE Advanced.*|IIT-JEE.*)$', clean_text)
                if exam_match:
                    exam_info = exam_match.group(1).strip()
                    clean_text = clean_text[:exam_match.start()].strip()
                    
                questions.append({
                    'url': BASE_URL + q_link['href'],
                    'text': clean_text,
                    'exam': exam_info
                })
        
        results[topic_name] = questions
        time.sleep(1) # Be nice to the server

    output_file = os.path.join(os.path.dirname(__file__), 'examside_physics.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully saved {sum(len(q) for q in results.values())} questions across {len(results)} topics to {output_file}")

if __name__ == '__main__':
    scrape_physics()
