import re
import json

def parse_extracted_text(text):
    # Pattern to match a question block: e.g., "1. What is... " followed by "(A) ... (B) ... (C) ... (D) ..."
    # We will split the text by question starts.
    # Question start: newline, maybe some spaces, digits, dot, space.
    
    # Pre-process: sometimes PDF returns newline inside a sentence. We will keep newlines but use them carefully
    
    # Split text into potential question blocks.
    # Look for "^1. " or "\n1. "
    question_blocks = re.split(r'\n(?=\d+\.\s)', "\n" + text)
    
    questions = []
    
    for block in question_blocks:
        block = block.strip()
        if not block:
            continue
            
        # Match the question number
        match = re.match(r'^(\d+)\.\s*(.*)', block, re.DOTALL)
        if not match:
            continue
            
        q_num = match.group(1)
        content = match.group(2)
        
        # Now find the options (A), (B), (C), (D)
        # We will split by "(A)" etc.
        option_pattern = r'\([A-D]\)\s*'
        
        # Find where options start
        opt_matches = list(re.finditer(option_pattern, content))
        
        if not opt_matches:
            q_text = content.strip().replace('\n', ' ')
            options = []
        else:
            first_opt_idx = opt_matches[0].start()
            q_text = content[:first_opt_idx].strip().replace('\n', ' ')
            
            options = []
            for i in range(len(opt_matches)):
                start = opt_matches[i].end()
                if i + 1 < len(opt_matches):
                    end = opt_matches[i+1].start()
                    opt_text = content[start:end].strip().replace('\n', ' ')
                else:
                    opt_text = content[start:].strip().replace('\n', ' ')
                    
                # Clean up any trailing junk on the last option, like page numbers "(3-A)"
                if i == len(opt_matches) - 1:
                    opt_text = re.sub(r'\(\d+-A\).*', '', opt_text, flags=re.IGNORECASE).strip()
                    opt_text = re.sub(r'PE/I/\d+.*', '', opt_text, flags=re.IGNORECASE).strip()
                
                options.append(opt_text)
                
        # Determine type
        q_type = "MCQ"
        if "Assertion" in q_text and "Reason" in q_text:
            q_type = "assertion-reason"
        elif "statements" in q_text.lower():
            q_type = "statement-based"

        questions.append({
            "question_id": int(q_num),
            "question": q_text,
            "options": options,
            "question_type": q_type
        })
        
    return questions

if __name__ == "__main__":
    with open('scratch/deep_extract.txt', 'r', encoding='utf-8') as f:
        text = f.read()
    
    out = parse_extracted_text(text)
    print(json.dumps(out, indent=2))
