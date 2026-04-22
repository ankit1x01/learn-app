import json
import re
import os
import argparse

def extract_paper_metadata(lines):
    # Try to find "JEE (Advanced) 2025 Paper 1" in the first 20 lines
    title = "Unknown Paper"
    year = 2025
    paper_num = 1
    
    metadata_pattern = re.compile(r"JEE \(Advanced\)\s+(\d{4})\s+Paper\s+(\d+)", re.IGNORECASE)
    
    for line in lines[:20]:
        match = metadata_pattern.search(line)
        if match:
            title = line.strip()
            year = int(match.group(1))
            paper_num = int(match.group(2))
            return title, year, paper_num

    return title, year, paper_num

def parse_paper(text):
    lines = text.split('\n')
    title, year, paper_num = extract_paper_metadata(lines)
    
    paper_json = {
        "title": title,
        "year": year,
        "paperNumber": paper_num,
        "subjects": []
    }

    subjects_names = ["Mathematics", "Physics", "Chemistry"]
    current_subject_idx = -1
    
    current_section = None
    current_question = None
    
    section_pattern = re.compile(r"SECTION\s+(\d+)\s*\(Maximum Marks:\s*(\d+)\)")
    question_pattern = re.compile(r"^Q\.(\d+)\s+(.*)")
    full_marks_pattern = re.compile(r"Full Marks\s*:\s*\+?(\d+)")
    zero_marks_pattern = re.compile(r"Zero Marks\s*:\s*(-?\d+)")
    negative_marks_pattern = re.compile(r"Negative Marks\s*:\s*(-?\d+)")
    
    list1_item_pattern = re.compile(r"^\(([PQRS])\)\s+(.*)")
    list2_item_pattern = re.compile(r"^\(([12345])\)\s+(.*)")
    option_pattern = re.compile(r"^\(([ABCD])\)\s+(.*)")

    for i in range(len(lines)):
        line = lines[i].strip()
        if not line:
            continue

        sec_match = section_pattern.search(line)
        if sec_match:
            sec_num = int(sec_match.group(1))
            max_marks = int(sec_match.group(2))
            
            if sec_num == 1:
                current_subject_idx += 1
                if current_subject_idx < len(subjects_names):
                    paper_json["subjects"].append({
                        "name": subjects_names[current_subject_idx],
                        "sections": []
                    })
            
            q_type = "UNKNOWN"
            if sec_num == 1: q_type = "SINGLE_CHOICE"
            elif sec_num == 2: q_type = "MULTIPLE_CHOICE"
            elif sec_num == 3: q_type = "NUMERICAL_VALUE"
            elif sec_num == 4: q_type = "MATCHING_LIST"

            current_section = {
                "sectionNumber": sec_num,
                "sectionTitle": f"SECTION {sec_num}",
                "maximumMarks": max_marks,
                "questionType": q_type,
                "markingScheme": {
                    "fullMarks": 0,
                    "partialMarks": None,
                    "zeroMarks": 0,
                    "negativeMarks": 0
                },
                "questions": []
            }
            
            if current_subject_idx < len(subjects_names):
                paper_json["subjects"][current_subject_idx]["sections"].append(current_section)
            current_question = None
            continue

        if not current_section:
            continue

        fm_match = full_marks_pattern.search(line)
        if fm_match: current_section["markingScheme"]["fullMarks"] = int(fm_match.group(1))
        zm_match = zero_marks_pattern.search(line)
        if zm_match: current_section["markingScheme"]["zeroMarks"] = int(zm_match.group(1))
        nm_match = negative_marks_pattern.search(line)
        if nm_match: current_section["markingScheme"]["negativeMarks"] = int(nm_match.group(1))

        q_match = question_pattern.search(line)
        if q_match:
            subject_name = subjects_names[current_subject_idx] if 0 <= current_subject_idx < len(subjects_names) else "Unknown"
            current_question = {
                "questionNumber": int(q_match.group(1)),
                "subject": subject_name,
                "questionText": q_match.group(2) + "\n",
                "images": [],
                "options": [],
            }
            if current_section["questionType"] == "MATCHING_LIST":
                current_question["matchingData"] = {"list1": [], "list2": []}
                
            current_section["questions"].append(current_question)
            continue

        if current_question:
            # Look for Options inline
            opt_match = option_pattern.match(line)
            if opt_match and current_section["questionType"] in ["SINGLE_CHOICE", "MULTIPLE_CHOICE", "MATCHING_LIST"]:
                parts = re.split(r'\(([ABCD])\)', line)
                if len(parts) > 1:
                    for p_idx in range(1, len(parts), 2):
                        opt_id = parts[p_idx]
                        opt_text = parts[p_idx+1].strip()
                        current_question["options"].append({"id": opt_id, "text": opt_text})
                continue
            
            if current_section["questionType"] == "MATCHING_LIST":
                l1_match = list1_item_pattern.match(line)
                if l1_match:
                    current_question["matchingData"]["list1"].append({"id": l1_match.group(1), "text": l1_match.group(2)})
                    continue
                                    
                if "(P)" in line or "(Q)" in line or "(R)" in line or "(S)" in line or "(1)" in line or "(2)" in line or "(3)" in line or "(4)" in line or "(5)" in line:
                    p1 = re.split(r'\(([PQRS])\)', line)
                    if len(p1) > 1:
                        inner_text = p1[2].split('(1)')[0].split('(2)')[0].split('(3)')[0].split('(4)')[0].split('(5)')[0].strip()
                        current_question["matchingData"]["list1"].append({"id": p1[1], "text": inner_text})
                    
                    p2 = re.split(r'\(([12345])\)', line)
                    if len(p2) > 1:
                        current_question["matchingData"]["list2"].append({"id": p2[1], "text": p2[2].strip()})
                    
                    if len(p1) > 1 or len(p2) > 1:
                        continue

            if "JEE (Advanced) " in line or re.match(r"^\d+\/\d+$", line):
                continue
                
            current_question["questionText"] += line + "\n"

    return {"paper": paper_json}

def append_to_json_file(new_paper_data, output_file):
    # Initialize the structure if file doesn't exist
    if not os.path.exists(output_file):
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump({"papers": []}, f, indent=2, ensure_ascii=False)
            
    # Load existing
    try:
        with open(output_file, 'r', encoding='utf-8') as f:
            existing_data = json.load(f)
    except json.JSONDecodeError:
        existing_data = {"papers": []}
        
    # Ensure it's the correct list format
    if "papers" not in existing_data:
        existing_data = {"papers": []}
        
    # Append the new paper
    existing_data["papers"].append(new_paper_data["paper"])
    
    # Write back
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(existing_data, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully appended '{new_paper_data['paper']['title']}' to {output_file}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Parse JEE Advanced paper texts into JSON structure.")
    parser.add_argument("input_file", help="Path to the markdown/text file containing the paper.")
    parser.add_argument("--output", "-o", default="all_papers.json", help="Path to the output JSON file. The script will append to this file.")
    
    args = parser.parse_args()
    
    if not os.path.exists(args.input_file):
        print(f"Error: Input file '{args.input_file}' not found.")
        exit(1)
        
    with open(args.input_file, 'r', encoding='utf-8') as f:
        text = f.read()
        
    result_json = parse_paper(text)
    append_to_json_file(result_json, args.output)

