import pdfplumber
import os

def refined_extract(path, output_file):
    if not os.path.exists(path):
        print(f"File {path} not found")
        return
        
    try:
        with pdfplumber.open(path) as pdf:
            with open(output_file, 'w', encoding='utf-8') as f:
                # Page 3 and 5 were the ones with English questions in columns
                pages_to_test = [2, 4] # index 2 is Page 3, index 4 is Page 5
                
                for page_idx in pages_to_test:
                    page = pdf.pages[page_idx]
                    width = page.width
                    height = page.height
                    
                    f.write(f"\n================ PAGE {page_idx + 1} ================\n")
                    
                    # Split the page in the middle vertically
                    mid_x = width / 2
                    
                    # Left column: (x0, y0, x1, y1)
                    left_bbox = (0, 0, mid_x, height)
                    left_text = page.within_bbox(left_bbox).extract_text()
                    
                    # Right column
                    right_bbox = (mid_x, 0, width, height)
                    right_text = page.within_bbox(right_bbox).extract_text()
                    
                    f.write("--- LEFT COLUMN ---\n")
                    f.write(left_text if left_text else "[NO TEXT]")
                    f.write("\n\n--- RIGHT COLUMN ---\n")
                    f.write(right_text if right_text else "[NO TEXT]")
                    f.write("\n")
                    
            print(f"Refined extraction saved to {output_file}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    sample_path = 'mppsc/other_exams/state_service/prelims/2024/state_service_prelims_2024_paper_i.pdf'
    output_path = 'scratch/refined_extract.txt'
    refined_extract(sample_path, output_path)
