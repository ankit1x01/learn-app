import json
import os

def list_subdomains(filepath):
    if not os.path.exists(filepath):
        print(f"Error: {filepath} not found.")
        return

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        print(f"{'Domain':<15} | {'Subdomain':<70} | {'Concepts'}")
        print("-" * 110)
        
        total_concepts = 0
        for item in data:
            domain = item.get("domain_name", "Unknown")
            subdomains = item.get("subdomains", [])
            for sub in subdomains:
                subdomain_name = sub.get("subdomain_name", "Unnamed")
                concepts = sub.get("concepts", [])
                concept_count = len(concepts)
                total_concepts += concept_count
                
                print(f"{domain:<15} | {subdomain_name:<70} | {concept_count}")
                
        print("-" * 110)
        print(f"Total concepts across all subdomains: {total_concepts}")

    except Exception as e:
        print(f"Error reading or parsing JSON: {e}")

if __name__ == "__main__":
    filepath = os.path.join("docs", "research", "11-maths", "research.json")
    list_subdomains(filepath)
