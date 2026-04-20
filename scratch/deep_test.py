import pdfplumber
import os

def deep_extract(path, output_file):
    if not os.path.exists(path):
        print(f"File {path} not found")
        return
        
    try:
        with pdfplumber.open(path) as pdf:
            with open(output_file, 'w', encoding='utf-8') as f:
                # Test Pages 3 and 5
                pages_to_test = [2, 4] 
                
                for page_idx in pages_to_test:
                    page = pdf.pages[page_idx]
                    f.write(f"\n================ PAGE {page_idx + 1} (DEEP EXTRACTION) ================\n")
                    
                    mid_x = page.width / 2
                    
                    # Extract words with their bounding boxes
                    words = page.extract_words()
                    
                    # Separate into Left and Right columns
                    left_words = [w for w in words if w['x0'] < mid_x]
                    right_words = [w for w in words if w['x0'] >= mid_x]
                    
                    def reconstruct_column(column_words):
                        if not column_words:
                            return ""
                        
                        # Sort by top (y0) then left (x0)
                        # We use a threshold for y-coordinate to group words into the same line
                        column_words.sort(key=lambda w: (w['top'], w['x0']))
                        
                        lines = []
                        if not column_words:
                            return ""
                            
                        current_line = [column_words[0]]
                        for i in range(1, len(column_words)):
                            prev = column_words[i-1]
                            curr = column_words[i]
                            
                            # If the difference in 'top' is small, they are on the same line
                            if abs(curr['top'] - prev['top']) < 3:
                                current_line.append(curr)
                            else:
                                lines.append(" ".join([w['text'] for w in current_line]))
                                current_line = [curr]
                        lines.append(" ".join([w['text'] for w in current_line]))
                        return "\n".join(lines)

                    f.write("--- LEFT COLUMN ---\n")
                    f.write(reconstruct_column(left_words))
                    f.write("\n\n--- RIGHT COLUMN ---\n")
                    f.write(reconstruct_column(right_words))
                    f.write("\n")
                    
            print(f"Deep extraction saved to {output_file}")
    except Exception as e:
        import traceback
        print(f"Error: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    sample_path = 'mppsc/other_exams/state_service/prelims/2024/state_service_prelims_2024_paper_i.pdf'
    output_path = 'scratch/deep_extract.txt'
    deep_extract(sample_path, output_path)
