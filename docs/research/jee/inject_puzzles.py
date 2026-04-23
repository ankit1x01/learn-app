import json
import os
import re

MAPPING = {
    "Motion": ["projectile.puzzles.ts"],
    "Laws of Motion": ["inclined_plane.puzzles.ts"],
    "Work Power & Energy": ["work_energy.puzzles.ts"],
    "Impulse & Momentum": ["collision.puzzles.ts"],
    "Rotational Motion": ["rolling.puzzles.ts"],
    "Properties of Matter": ["fluids.puzzles.ts"],
    "Heat and Thermodynamics": ["thermodynamics.puzzles.ts"],
    "Simple Harmonic Motion": ["spring_mass.puzzles.ts"],
    "Waves": ["waves.puzzles.ts"],
    "Gravitation": ["gravitation.puzzles.ts"],
    "Electrostatics": ["electric_field.puzzles.ts"],
    "Current Electricity": ["current_electricity.puzzles.ts"],
    "Capacitor": ["capacitor.puzzles.ts"],
    "Magnetism": ["magnetism.puzzles.ts"],
    "Electromagnetic Induction": ["emi.puzzles.ts"],
    "Alternating Current": ["ac.puzzles.ts"],
    "Electromagnetic Waves": ["em_waves.puzzles.ts"],
    "Geometrical Optics": ["lens.puzzles.ts"],
    "Wave Optics": ["ydse.puzzles.ts"],
    "Atoms and Nuclei": ["bohr_atom.puzzles.ts"],
    "Dual Nature of Radiation": ["photoelectric.puzzles.ts"],
    "Units & Measurements": ["generic.puzzles.ts"],
    "Vector Algebra": ["generic.puzzles.ts"],
    "Motion in a Straight Line": ["projectile.puzzles.ts"],
    "Motion in a Plane": ["projectile.puzzles.ts"],
    "Circular Motion": ["circular_motion.puzzles.ts"],
    "Center of Mass and Collision": ["collision.puzzles.ts"],
    "Magnetic Effect of Current": ["magnetism.puzzles.ts"],
    "Magnetic Properties of Matter": ["magnetism.puzzles.ts"],
    "Semiconductor": ["semiconductor.puzzles.ts"]
}

def escape_string(s):
    if not s: return ""
    return s.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n')

def get_complexity(exam_text):
    if not exam_text:
        return 'jee_main'
    exam_text = exam_text.lower()
    if 'advanced' in exam_text or 'iit' in exam_text:
        return 'jee_advanced'
    return 'jee_main'

def main():
    base_dir = os.getcwd()
    json_path = os.path.join(base_dir, 'docs', 'research', 'jee', 'examside_physics_main.json')
    puzzles_dir = os.path.join(base_dir, 'src', 'games', 'playground', 'puzzles')
    
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    created_files = []
    
    for raw_topic, questions in data.items():
        # Clean the topic string:
        # e.g., "Motion in One Dimension Syllabus Reduced 2026: Total: 47..."
        # or "Laws of Motion  2026: Total:..."
        topic = re.split(r'Syllabus|2025:|2026:|2024:', raw_topic)[0].strip()
        
        # We need to map some new JEE Main specific topics if they differ
        # E.g. "Motion in One Dimension", "Motion in Two Dimensions"
        if topic == "Motion in One Dimension" or topic == "Motion in Two Dimensions" or topic == "Motion":
            topic = "Motion"
        elif topic == "Electronic Devices" or topic == "Semiconductor":
            topic = "Semiconductor"
            if "Semiconductor" not in MAPPING:
                MAPPING["Semiconductor"] = ["semiconductor.puzzles.ts"]
        
        if topic not in MAPPING:
            # Let's map any unknown to generic if we want, or just skip
            print(f"Skipping unmapped topic: {topic} (from {raw_topic})")
            continue
            
        target_files = MAPPING[topic]
        target_file = target_files[0]
        file_path = os.path.join(puzzles_dir, target_file)
        
        var_name = target_file.replace('.puzzles.ts', '').upper() + '_PUZZLES'
        
        file_exists = os.path.exists(file_path)
        content = ""
        if file_exists:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            last_bracket = content.rfind(']')
            if last_bracket == -1:
                print(f"Error: Could not find array end in {target_file}")
                continue
        else:
            content = f"import {{ PuzzleConfig }} from '../types'\n\nexport const {var_name}: PuzzleConfig[] = [\n]"
            file_exists = True
            created_files.append((target_file, var_name))
            
        new_blocks = []
        for i, q in enumerate(questions):
            q_id = f"{topic.lower().replace(' ', '_').replace('&', 'and')}_main_{i}"
            
            if q_id in content:
                continue
                
            complexity = get_complexity(q['exam'])
            text = escape_string(q['text'] + f" ({q['exam']})")
            
            block = f"""  {{
    id: '{q_id}',
    complexity: '{complexity}',
    question: '{text}',
    given: {{}},
    find: ['answer'],
    answer: {{ answer: 0 }},
    tolerance: 5,
    hints: ['Refer to original text for values.'],
    formula: 'N/A',
    units: {{ answer: '' }}
  }}"""
            new_blocks.append(block)
            
        if not new_blocks:
            continue
            
        blocks_str = ",\n".join(new_blocks)
        
        last_bracket = content.rfind(']')
        before_bracket = content[:last_bracket].strip()
        if before_bracket.endswith('['):
            content = content[:last_bracket] + blocks_str + "\n]" + content[last_bracket+1:]
        else:
            content = content[:last_bracket] + ",\n" + blocks_str + "\n]" + content[last_bracket+1:]
            
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
            
        print(f"Injected {len(questions)} questions into {target_file}")
        
    print(f"Created new files: {created_files}")

if __name__ == '__main__':
    main()
