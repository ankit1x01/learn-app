import os

def summarize_structure(directory):
    total_pdfs = 0
    structure = {}
    
    for root, dirs, files in os.walk(directory):
        pdfs = [f for f in files if f.endswith('.pdf')]
        if pdfs:
            total_pdfs += len(pdfs)
            # Create a relative path
            rel_path = os.path.relpath(root, directory)
            structure[rel_path] = len(pdfs)
            
    print(f"Total PDFs found: {total_pdfs}\n")
    print("Files by Folder:")
    for path, count in sorted(structure.items()):
        print(f"- {path.replace(os.sep, '/')}: {count} papers")

if __name__ == "__main__":
    summarize_structure('mppsc')
