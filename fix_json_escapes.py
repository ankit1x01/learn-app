import re
import sys
import os

def fix_invalid_escapes(filepath):
    if not os.path.exists(filepath):
        print(f"Error: {filepath} not found.")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex explanation:
    # (?<!\\) : Negative lookbehind to ensure we are not already looking at an escaped backslash
    # \\      : Matches a single backslash
    # (?!["\\/bfnrtu]) : Negative lookahead to ensure the next character is not a valid JSON escape char
    fixed_content = re.sub(r'(?<!\\)\\(?!["\\/bfnrtu])', r'\\\\', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(fixed_content)
        
    print(f"Fixed invalid escapes in {filepath}")

if __name__ == "__main__":
    filepath = os.path.join("docs", "research", "11-maths", "research.json")
    fix_invalid_escapes(filepath)
