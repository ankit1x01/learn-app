import fs from 'fs'

// 1. Fix BottomNav.tsx
let bn = fs.readFileSync('src/components/BottomNav.tsx', 'utf8')
bn = bn.replace(/<Icon\s+size=\{24\}\s+color=\{[^\}]+\}\s+strokeWidth=\{[^\}]+\}\s+style=\{[^\}]+\}\s*\/>/g, 
  '{ (() => { const I = tab.icon as any; return <I size={24} color={active ? tab.color : "#A8A29E"} strokeWidth={active ? 2 : 1.5} style={{ position: "relative", zIndex: 10, color: active ? tab.color : "#A8A29E" }} /> })() }')
fs.writeFileSync('src/components/BottomNav.tsx', bn)

// 2. Fix Dashboard.tsx
let db = fs.readFileSync('src/screens/Dashboard.tsx', 'utf8')
db = db.replace(/<Icon size=\{20\} className=\{sub\.color\} \/>/g, '{ (() => { const I = sub.icon as any; return <I size={20} className={sub.color} /> })() }')
fs.writeFileSync('src/screens/Dashboard.tsx', db)

// 3. Fix DemoSession.tsx
let ds = fs.readFileSync('src/screens/DemoSession.tsx', 'utf8')
ds = ds.replace(/<Icon size=\{16\} style=\{\{ color \}\} \/>/g, '{ (() => { const I = stageIcons[stage.id] as any; return <I size={16} style={{ color }} /> })() }')
fs.writeFileSync('src/screens/DemoSession.tsx', ds)

// 4. Fix SessionComplete.tsx
let sc = fs.readFileSync('src/screens/SessionComplete.tsx', 'utf8')
sc = sc.replace(/<Icon size=\{16\} className=\{s\.color\} \/>/g, '{ (() => { const I = s.icon as any; return <I size={16} className={s.color} /> })() }')
fs.writeFileSync('src/screens/SessionComplete.tsx', sc)

// 5. Fix MatrixMorph.tsx
let mm = fs.readFileSync('src/games/MatrixMorph.tsx', 'utf8')
if (!mm.includes('import { Grid }')) {
  mm = mm.replace("import { Canvas } from '@react-three/fiber'", "import { Canvas } from '@react-three/fiber'\nimport { Grid } from '@react-three/drei'")
}
fs.writeFileSync('src/games/MatrixMorph.tsx', mm)

console.log('Fixed more errors')
