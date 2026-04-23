"""
Smart parser for JEE Physics questions.
Extracts structured `given` values and `answer` keys from question text.
Runs over all puzzle TS files and upgrades them with real data.
"""
import os
import re
import json

# ─── patterns to extract common physics values from text ─────────────────────
EXTRACT_PATTERNS = [
    # speed / velocity
    (r'(?:speed|velocity|u|v0?)\s*(?:of|=|is)?\s*(\d+(?:\.\d+)?)\s*m/?s', 'speed_ms', 'm/s'),
    # mass
    (r'mass\s*(?:of|=|is)?\s*(\d+(?:\.\d+)?)\s*k?g', 'mass_kg', 'kg'),
    # height
    (r'height\s*(?:of|=|is)?\s*H?\s*=?\s*(\d+(?:\.\d+)?)\s*m', 'height_m', 'm'),
    # angle
    (r'angle\s*(?:of|=|is)?\s*(\d+(?:\.\d+)?)\s*°', 'angle_deg', '°'),
    # g value
    (r'g\s*=\s*(\d+(?:\.\d+)?)\s*m', 'g_ms2', 'm/s²'),
    # time
    (r'(?:time|t)\s*=\s*(\d+(?:\.\d+)?)\s*s', 'time_s', 's'),
    # wavelength
    (r'wavelength\s*(?:of|=|is)?\s*(\d+(?:\.\d+)?)\s*(?:nm|μm|mm)', 'wavelength', 'nm'),
    # frequency
    (r'frequency\s*(?:of|=|is)?\s*(\d+(?:\.\d+)?)\s*Hz', 'frequency_hz', 'Hz'),
    # resistance
    (r'resistance\s*(?:of|=|is)?\s*(\d+(?:\.\d+)?)\s*(?:Ω|ohm)', 'resistance_ohm', 'Ω'),
    # voltage / emf
    (r'(?:voltage|emf|V|E)\s*=\s*(\d+(?:\.\d+)?)\s*V', 'voltage_v', 'V'),
    # current
    (r'current\s*(?:of|=|is)?\s*(\d+(?:\.\d+)?)\s*A', 'current_a', 'A'),
    # radius
    (r'radius\s*(?:of|=|is)?\s*r?\s*=?\s*(\d+(?:\.\d+)?)\s*(?:m|cm)', 'radius_m', 'm'),
    # temperature
    (r'temperature\s*(?:of|=|is)?\s*T?\s*=?\s*(\d+(?:\.\d+)?)\s*[KkC°]', 'temp_k', 'K'),
    # charge
    (r'charge\s*(?:of|=|is)?\s*q?\s*=?\s*(\d+(?:\.\d+)?)\s*[μm]?C', 'charge_uc', 'μC'),
    # distance / length
    (r'(?:distance|length|L)\s*(?:of|=|is)?\s*(\d+(?:\.\d+)?)\s*m', 'length_m', 'm'),
    # force
    (r'force\s*(?:of|=|is)?\s*(\d+(?:\.\d+)?)\s*N', 'force_n', 'N'),
    # power
    (r'power\s*(?:of|=|is)?\s*(\d+(?:\.\d+)?)\s*W', 'power_w', 'W'),
    # pressure
    (r'pressure\s*(?:of|=|is)?\s*P?\s*=?\s*(\d+(?:\.\d+)?)\s*(?:Pa|atm)', 'pressure_pa', 'Pa'),
]

# ─── patterns to detect answer type from question keywords ────────────────────
ANSWER_PATTERNS = [
    (r'find\s+(?:the\s+)?range', 'range_m', 'm'),
    (r'find\s+(?:the\s+)?height', 'height_m', 'm'),
    (r'find\s+(?:the\s+)?time', 'time_s', 's'),
    (r'find\s+(?:the\s+)?speed', 'speed_ms', 'm/s'),
    (r'find\s+(?:the\s+)?velocity', 'velocity_ms', 'm/s'),
    (r'find\s+(?:the\s+)?(?:angle|θ)', 'angle_deg', '°'),
    (r'find\s+(?:the\s+)?(?:resistance|R)', 'resistance_ohm', 'Ω'),
    (r'find\s+(?:the\s+)?current', 'current_a', 'A'),
    (r'find\s+(?:the\s+)?voltage', 'voltage_v', 'V'),
    (r'find\s+(?:the\s+)?(?:force|F)', 'force_n', 'N'),
    (r'find\s+(?:the\s+)?(?:energy|work|W)', 'energy_j', 'J'),
    (r'find\s+(?:the\s+)?(?:power|P)', 'power_w', 'W'),
    (r'find\s+(?:the\s+)?(?:mass|m)', 'mass_kg', 'kg'),
    (r'find\s+(?:the\s+)?frequency', 'frequency_hz', 'Hz'),
    (r'find\s+(?:the\s+)?wavelength', 'wavelength_m', 'm'),
    (r'find\s+(?:the\s+)?(?:acceleration|a)', 'acceleration_ms2', 'm/s²'),
    (r'find\s+(?:the\s+)?period', 'period_s', 's'),
    (r'find\s+(?:the\s+)?(?:pressure|P)', 'pressure_pa', 'Pa'),
    (r'find\s+(?:the\s+)?(?:charge|q)', 'charge_uc', 'μC'),
    (r'find\s+(?:the\s+)?(?:capacitance|C)', 'capacitance_f', 'F'),
    (r'find\s+(?:the\s+)?(?:flux|φ)', 'flux_wb', 'Wb'),
    (r'find\s+(?:the\s+)?(?:EMF|emf|ε)', 'emf_v', 'V'),
    (r'find\s+(?:the\s+)?(?:temperature|T)', 'temp_k', 'K'),
    (r'(?:range|distance)\s+(?:along|on)\s+(?:the\s+)?slope', 'slope_range_m', 'm'),
    (r'what\s+is\s+(?:the\s+)?(?:value|ratio|answer)', 'answer', ''),
    (r'calculate\s+(?:the\s+)?(?:range|distance)', 'range_m', 'm'),
    (r'calculate\s+(?:the\s+)?(?:time)', 'time_s', 's'),
    (r'find\s+H\b', 'height_m', 'm'),
    (r'is\s+_+', 'answer', ''),  # Fill in the blank questions
    (r'equals?\s+_+', 'answer', ''),
]

def parse_question(text: str):
    """Extract given values and answer keys from question text."""
    text_lower = text.lower()
    
    given = {}
    units = {}
    
    for pattern, key, unit in EXTRACT_PATTERNS:
        matches = re.findall(pattern, text_lower)
        if matches and key not in given:
            try:
                given[key] = float(matches[0])
                if key not in units:
                    units[key] = unit
            except:
                pass
    
    # Detect what to find
    find_keys = []
    find_units = {}
    
    for pattern, key, unit in ANSWER_PATTERNS:
        if re.search(pattern, text_lower):
            if key not in find_keys:
                find_keys.append(key)
                find_units[key] = unit
    
    # Default fallback
    if not find_keys:
        find_keys = ['answer']
        find_units['answer'] = ''
    
    return given, find_keys, find_units


def upgrade_puzzle_file(filepath: str):
    """Parse a .puzzles.ts file and upgrade all questions with real data."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Find all question blocks where given is empty and answer is 0
    def replace_block(match):
        block = match.group(0)
        
        # Extract question text
        q_match = re.search(r"question:\s*'((?:[^'\\]|\\.)*)'", block)
        if not q_match:
            return block
        
        question_text = q_match.group(1).replace("\\'", "'")
        
        # Skip if this question block already has real given data
        given_match = re.search(r'given:\s*\{([^}]*)\}', block)
        if given_match and given_match.group(1).strip() and 'speed_ms' in given_match.group(1):
            return block  # Already upgraded
        
        given, find_keys, find_units = parse_question(question_text)
        
        if not given and find_keys == ['answer']:
            return block  # Nothing useful extracted
        
        # Build replacement given block
        given_str = ', '.join(f'{k}: {v}' for k, v in given.items()) if given else ''
        find_str = ', '.join(f"'{k}'" for k in find_keys)
        
        # Build answer block
        answer_str = ', '.join(f"'{k}': 0" for k in find_keys)
        
        # Build units block
        all_units = {**{k: v for k, v in [(k, u) for k, u in [(k, find_units.get(k, '')) for k in find_keys]]}}
        all_units.update({k: v for k, v in [(k, unit) for pattern, k, unit in EXTRACT_PATTERNS if k in given]})
        units_str = ', '.join(f"'{k}': '{v}'" for k, v in all_units.items())
        
        # Apply replacements selectively
        if given:
            block = re.sub(r'given:\s*\{\}', f'given: {{ {given_str} }}', block)
        block = re.sub(r'find:\s*\[.*?\]', f'find: [{find_str}]', block)
        block = re.sub(r'answer:\s*\{[^}]*\}', f'answer: {{ {answer_str} }}', block)
        if units_str:
            block = re.sub(r'units:\s*\{[^}]*\}', f'units: {{ {units_str} }}', block)
        
        return block
    
    # Match each puzzle config block
    pattern = r'\{[^{}]*?id:\s*\'[^\']+\'.*?units:\s*\{[^}]*\}\s*\}'
    content = re.sub(pattern, replace_block, content, flags=re.DOTALL)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False


def main():
    base_dir = os.getcwd()
    puzzles_dir = os.path.join(base_dir, 'src', 'games', 'playground', 'puzzles')
    
    total_files = 0
    upgraded_files = 0
    
    for fname in os.listdir(puzzles_dir):
        if not fname.endswith('.puzzles.ts'):
            continue
        
        fpath = os.path.join(puzzles_dir, fname)
        total_files += 1
        
        try:
            changed = upgrade_puzzle_file(fpath)
            if changed:
                upgraded_files += 1
                print(f'OK Upgraded: {fname}')
            else:
                print(f'   Skipped (no changes): {fname}')
        except Exception as e:
            print(f'ERR Error in {fname}: {e}')
    
    print(f'\nDone. Upgraded {upgraded_files}/{total_files} puzzle files.')

if __name__ == '__main__':
    main()
