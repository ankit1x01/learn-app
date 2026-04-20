import pdfplumber
import os

def test_extract(path, output_file):
    if not os.path.exists(path):
        print(f"File {path} not found")
        return
        
    try:
        with pdfplumber.open(path) as pdf:
            print(f"Page Count: {len(pdf.pages)}")
            with open(output_file, 'w', encoding='utf-8') as f:
                # Extract first 5 pages for a good sample
                for i in range(min(5, len(pdf.pages))):
                    text = pdf.pages[i].extract_text()
                    f.write(f"\n--- Page {i+1} ---\n")
                    if text:
                        f.write(text)
                    else:
                        f.write("[NO TEXT EXTRACTED]\n")
            print(f"Extraction saved to {output_file}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    sample_path = 'mppsc/other_exams/state_service/prelims/2024/state_service_prelims_2024_paper_i.pdf'
    output_path = 'scratch/sample_extract.txt'
    test_extract(sample_path, output_path)
