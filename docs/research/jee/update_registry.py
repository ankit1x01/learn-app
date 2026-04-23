import os
import re

def main():
    base_dir = os.getcwd()
    registry_path = os.path.join(base_dir, 'src', 'games', 'playground', 'registry.ts')
    
    with open(registry_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove duplicate imports
    content = content.replace("import { RELATIVE_MOTION_PUZZLES } from './puzzles/relative_motion.puzzles'\nimport { RELATIVE_MOTION_PUZZLES } from './puzzles/relative_motion.puzzles'", "import { RELATIVE_MOTION_PUZZLES } from './puzzles/relative_motion.puzzles'")
        
    replacements = {
        'pv_diagram': ('GENERIC_PUZZLES', 'THERMODYNAMICS_PUZZLES'),
        'carnot_cycle': ('GENERIC_PUZZLES', 'THERMODYNAMICS_PUZZLES'),
        'kinetic_theory': ('GENERIC_PUZZLES', 'THERMODYNAMICS_PUZZLES'),
        'calorimetry': ('GENERIC_PUZZLES', 'THERMODYNAMICS_PUZZLES'),
        'heat_transfer': ('GENERIC_PUZZLES', 'THERMODYNAMICS_PUZZLES'),
        'orbit': ('GENERIC_PUZZLES', 'GRAVITATION_PUZZLES'),
        'capacitor': ('GENERIC_PUZZLES', 'CAPACITOR_PUZZLES'),
        'gauss_sphere': ('GENERIC_PUZZLES', 'ELECTRIC_FIELD_PUZZLES'),
        'current_electricity': ('GENERIC_PUZZLES', 'CURRENT_ELECTRICITY_PUZZLES'),
        'rc_circuit': ('GENERIC_PUZZLES', 'CURRENT_ELECTRICITY_PUZZLES'),
        'magnetic_force': ('GENERIC_PUZZLES', 'MAGNETISM_PUZZLES'),
        'charged_particle_magnetic': ('GENERIC_PUZZLES', 'MAGNETISM_PUZZLES'),
        'self_inductance': ('GENERIC_PUZZLES', 'EMI_PUZZLES'),
        'lcr_circuit': ('GENERIC_PUZZLES', 'AC_PUZZLES'),
        'photoelectric': ('GENERIC_PUZZLES', 'PHOTOELECTRIC_PUZZLES'),
        'single_slit': ('GENERIC_PUZZLES', 'WAVES_PUZZLES'),
        'standing_wave': ('GENERIC_PUZZLES', 'WAVES_PUZZLES'),
        'superposition': ('GENERIC_PUZZLES', 'WAVES_PUZZLES'),
        'beats': ('GENERIC_PUZZLES', 'WAVES_PUZZLES'),
        'doppler': ('GENERIC_PUZZLES', 'WAVES_PUZZLES'),
    }

    lines = content.split('\n')
    for i, line in enumerate(lines):
        for sim_id, (old, new) in replacements.items():
            if f'  {sim_id}: {{' in line and old in line:
                lines[i] = line.replace(f'puzzles: {old}', f'puzzles: {new}')

    content = '\n'.join(lines)
    
    with open(registry_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Registry updated successfully.")

if __name__ == '__main__':
    main()
