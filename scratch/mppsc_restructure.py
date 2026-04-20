import os
import shutil
import re
import json

SOURCE_DIR = r"docs/exams/mppsc/question papers"
TARGET_ROOT = r"mppsc"

MAPPING = {
    "state service": "SSE",
    "state forest": "SFS",
    "state engineering": "SES",
    "state eligibility": "SET"
}

PRELIMS_KEYWORDS = ["preliminary", "prelims", "paper-i", "paper-ii", "paper - i", "paper - ii", "paper_i", "paper_ii"]
MAINS_KEYWORDS = ["main", "mains", "gs-i", "gs-ii", "gs-iii", "gs-iv", "gs-v", "gs-vi", "question answer booklet"]

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
    
    # Other exams: take the part before "Examination" or "Exam"
    match = re.split(r'Exam|Examination', title, flags=re.IGNORECASE)
    exam_name = match[0].strip() if match else "general"
    return "other_exams", slugify(exam_name)

def get_stage(filename, title, exam_prefix):
    combined = (filename + " " + title).lower()
    
    # 1. Obvious Prelims
    if "prelim" in combined:
        return "prelims"
        
    # 2. Obvious Mains
    explicit_mains = ["main", "mains", "gs-i", "gs-ii", "gs-iii", "gs-iv", "gs-v", "gs-vi", "question answer", "quetion_answer"]
    if any(k in combined for k in explicit_mains):
        return "mains"
        
    # 3. Inferred Mains for SSE/SFS (If it says "paper" but didn't say prelim, it's mains)
    if exam_prefix in ["SSE", "SFS"] and "paper" in combined:
        return "mains"
        
    return "na"

def restructure():
    if not os.path.exists(TARGET_ROOT):
        os.makedirs(TARGET_ROOT)

    metadata = []
    
    for year_folder in os.listdir(SOURCE_DIR):
        year_path = os.path.join(SOURCE_DIR, year_folder)
        if not os.path.isdir(year_path):
            continue
            
        year = year_folder
        
        for filename in os.listdir(year_path):
            file_path = os.path.join(year_path, filename)
            if not os.path.isfile(file_path):
                continue
                
            # Filename structure from previous step: "Exam Title - Label.pdf"
            # Or just "Exam Title.pdf"
            if " - " in filename:
                exam_title, label_with_ext = filename.rsplit(" - ", 1)
                label = label_with_ext.replace(".pdf", "")
            else:
                exam_title = filename.replace(".pdf", "")
                label = "paper"

            cat_type, cat_name = get_category(exam_title)
            
            prefix = cat_name.upper() if cat_type != "other_exams" else cat_name
            stage = get_stage(filename, exam_title, prefix)
            
            # Build target path: TARGET_ROOT / [cat_type] / [cat_name (if other)] / [stage] / [year]
            if cat_type == "other_exams":
                target_dir = os.path.join(TARGET_ROOT, cat_type, cat_name, stage, year)
            else:
                target_dir = os.path.join(TARGET_ROOT, cat_type, stage, year)
                
            if not os.path.exists(target_dir):
                os.makedirs(target_dir)

            # Build new filename: CATNAME_STAGE_YEAR_LABEL.pdf
            new_filename = f"{prefix}_{stage}_{year}_{slugify(label)}.pdf"
            target_path = os.path.join(target_dir, new_filename)
            
            # Copy file (using copy2 to preserve metadata)
            shutil.copy2(file_path, target_path)
            
            # Add to metadata
            metadata.append({
                "year": int(year) if year.isdigit() else year,
                "exam": prefix,
                "stage": stage,
                "label": label,
                "file_path": target_path.replace("\\", "/") # Use forward slashes for JSON
            })

    # Save metadata index
    with open(os.path.join(TARGET_ROOT, "metadata.json"), "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print(f"Restructuring complete. Processed {len(metadata)} files.")
    print(f"Metadata saved to {os.path.join(TARGET_ROOT, 'metadata.json')}")

if __name__ == "__main__":
    restructure()
