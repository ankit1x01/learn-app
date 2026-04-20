import os
import glob
import json
import re
import traceback

def safe_extract_text(pdf_path):
    text_content = ""
    try:
        import pdfplumber
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                # Try simple extract first. If it's messy, we will fix via regex later.
                # Layout=True preserves columns reasonably well
                text = page.extract_text(x_tolerance=2, y_tolerance=2)
                if text:
                    text_content += "\n" + text
    except Exception as e:
        print(f"Error reading {pdf_path}: {e}")
    return text_content

def parse_questions_from_text(text, year):
    # Regex designed to catch multi-line question blocks 
    # Match lines starting with a number and dot/dash, optionally prefixed by Q: "1. ", "01.", "Q1. ", "1 - "
    question_blocks = re.split(r'\n(?=\s*(?:[Qq]\.?\s*)?\d+\s*[.\-]\s)', "\n" + text)
    
    questions = []
    seen_ids = set()
    
    for block in question_blocks:
        block = block.strip()
        if not block:
            continue
            
        match = re.search(r'^(?:[Qq]\.?\s*)?(\d+)\s*[.\-]\s*(.*)', block, re.DOTALL)
        if not match:
            continue
            
        q_num = int(match.group(1))
        content = match.group(2)
        
        # We need to filter out pure Hindi blocks.
        english_chars = len(re.findall(r'[a-zA-Z]', content))
        if english_chars < 8:
            continue
            
        # Extract options (A), (B), (C), (D) or (a), (b), (c), (d)
        opt_matches = list(re.finditer(r'\([A-Da-d]\)\s*', content))
        
        q_text = content
        options = []
        if opt_matches:
            first_opt_idx = opt_matches[0].start()
            q_text = content[:first_opt_idx]
            
            for i in range(len(opt_matches)):
                start = opt_matches[i].end()
                if i + 1 < len(opt_matches):
                    end = opt_matches[i+1].start()
                    opt_text = content[start:end].strip()
                else:
                    opt_text = content[start:].strip()
                
                # Clean footers
                opt_text = re.sub(r'PE/I/\d+.*', '', opt_text, flags=re.IGNORECASE).strip()
                opt_text = opt_text.replace('\n', ' ')
                options.append(opt_text)
                
        q_text = q_text.replace('\n', ' ').strip()
        
        # Additional cleanup
        q_text = re.sub(r'PE/I/\d+.*', '', q_text, flags=re.IGNORECASE)
        
        # Determine type
        q_type = "MCQ"
        if "Assertion" in q_text and "Reason" in q_text:
            q_type = "assertion-reason"
        elif "statements" in q_text.lower():
            q_type = "statement-based"

        # Validate English string content presence and avoid duplicates immediately
        if re.search(r'[a-zA-Z]{5,}', q_text) and q_num not in seen_ids:
            seen_ids.add(q_num)
            questions.append({
                "year": year,
                "question_id": q_num,
                "question": q_text.strip(),
                "options": options,
                "question_type": q_type
            })
            
    return questions

def extract_all():
    print("Initiating Mass Deep Extraction Pipeline...")
    master_qbank = []
    
    # Target GS Paper 1 for SSE Prelims
    base_dir = "mppsc/SSE/prelims"
    if not os.path.exists(base_dir):
        print("Base directory not found.")
        return

    years = sorted(os.listdir(base_dir))
    for year in years:
        year_path = os.path.join(base_dir, year)
        if not os.path.isdir(year_path): continue
        
        # Look for the GS Paper 1
        # It's usually labeled 'paper_i.pdf' or 'paper_1.pdf' or 'exam_paper_i'
        papers = glob.glob(os.path.join(year_path, "*paper_i.pdf")) + \
                 glob.glob(os.path.join(year_path, "*paper_1.pdf")) + \
                 glob.glob(os.path.join(year_path, "*paper i.pdf"))
                 
        if not papers:
            print(f"[{year}] No GS-1 Paper found.")
            continue
            
        target_pdf = papers[0]
        print(f"[{year}] Extracting: {os.path.basename(target_pdf)}")
        
        raw_text = safe_extract_text(target_pdf)
        extracted_qs = parse_questions_from_text(raw_text, year)
        
        # We might grab duplicates due to Hindi/English pairs if regex fails,
        # so lets deduplicate by question_id
        unique_qs = {}
        for q in extracted_qs:
            # Prefer questions with valid options
            if q['question_id'] not in unique_qs or len(q['options']) > len(unique_qs[q['question_id']]['options']):
                unique_qs[q['question_id']] = q
                
        final_qs_for_year = list(unique_qs.values())
        print(f"  -> Extracted {len(final_qs_for_year)} unique English questions.")
        master_qbank.extend(final_qs_for_year)

    print(f"\n=====================================")
    print(f"Total Database Size: {len(master_qbank)} questions extracted.")
    
    out_path = "scratch/master_qbank.json"
    print(f"Saving safely to {out_path}...")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(master_qbank, f, indent=2)

if __name__ == "__main__":
    extract_all()
