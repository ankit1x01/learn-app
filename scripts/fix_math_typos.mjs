import fs from 'fs'
import path from 'path'

const filesToFix = [
  'src/games/playground/simulations/fields/FaradayInduction.sim.tsx',
  'src/games/playground/simulations/fields/RCCircuit.sim.tsx',
  'src/games/playground/simulations/mechanics/PseudoForce.sim.tsx',
  'src/games/playground/simulations/mechanics/RelativeMotion.sim.tsx',
  'src/games/playground/simulations/mechanics/SurfaceTension.sim.tsx',
  'src/games/playground/simulations/optics/StandingWave.sim.tsx',
]

for (const f of filesToFix) {
  let content = fs.readFileSync(f, 'utf8')
  // Undo the weird Math replacements
  content = content.replace(/coilMath\.min/g, 'Math.min')
  content = content.replace(/cMath\.min/g, 'Math.min')
  content = content.replace(/elevMath\.min/g, 'Math.min')
  content = content.replace(/halfMath\.min/g, 'Math.min')
  content = content.replace(/waveMath\.min/g, 'Math.min')
  
  if (f.includes('RelativeMotion.sim.tsx')) {
    // Add back the panelX variable
    if (!content.includes('const panelX = axisX0')) {
      content = content.replace('const boxHeight =', 'const panelX = axisX0\n    const boxHeight =')
    }
  }

  fs.writeFileSync(f, content)
  console.log('Fixed', f)
}
