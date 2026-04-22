import fs from 'fs'

// 1. Fix GamesScreen.tsx
let gs = fs.readFileSync('src/games/GamesScreen.tsx', 'utf8')
gs = gs.replace('setScreen?: (screen: string) => void;', 'setScreen?: any;')
gs = gs.replace('const Icon = game.icon;', 'const Icon = game.icon as any;')
fs.writeFileSync('src/games/GamesScreen.tsx', gs)

// 2. Fix BottomNav.tsx
let bn = fs.readFileSync('src/components/BottomNav.tsx', 'utf8')
bn = bn.replace('const Icon = tab.icon', 'const Icon = tab.icon as any')
fs.writeFileSync('src/components/BottomNav.tsx', bn)

// 3. Fix SharePromptSheet.tsx
let sp = fs.readFileSync('src/components/SharePromptSheet.tsx', 'utf8')
sp = sp.replace(/<tech\.icon ([^>]+) \/>/g, '{ (() => { const I = tech.icon as any; return <I $1 /> })() }')
sp = sp.replace(/<selected\.icon ([^>]+) \/>/g, '{ (() => { const I = selected.icon as any; return <I $1 /> })() }')
fs.writeFileSync('src/components/SharePromptSheet.tsx', sp)

// 4. Fix MatrixMorph.tsx
let mm = fs.readFileSync('src/games/MatrixMorph.tsx', 'utf8')
if (!mm.includes('import { Grid }')) {
  mm = mm.replace("import { Canvas } from '@react-three/fiber'", "import { Canvas } from '@react-three/fiber'\nimport { Grid } from '@react-three/drei'")
}
fs.writeFileSync('src/games/MatrixMorph.tsx', mm)

// 5. Fix Dashboard.tsx
let db = fs.readFileSync('src/screens/Dashboard.tsx', 'utf8')
db = db.replace('const Icon = stat.icon', 'const Icon = stat.icon as any')
db = db.replace('const Icon = item.icon', 'const Icon = item.icon as any')
db = db.replace(/<sub\.icon /g, '<(sub.icon as any) ')
fs.writeFileSync('src/screens/Dashboard.tsx', db)

// 6. Fix DemoSession.tsx
let ds = fs.readFileSync('src/screens/DemoSession.tsx', 'utf8')
ds = ds.replace('const Icon = stageIcons[stage.id]', 'const Icon = stageIcons[stage.id] as any')
fs.writeFileSync('src/screens/DemoSession.tsx', ds)

// 7. Fix SessionComplete.tsx
let sc = fs.readFileSync('src/screens/SessionComplete.tsx', 'utf8')
sc = sc.replace('const Icon = s.icon', 'const Icon = s.icon as any')
fs.writeFileSync('src/screens/SessionComplete.tsx', sc)

// 8. Fix TopicsBank.tsx
let tb = fs.readFileSync('src/screens/TopicsBank.tsx', 'utf8')
tb = tb.replace(/<meta\.icon /g, '<(meta.icon as any) ')
fs.writeFileSync('src/screens/TopicsBank.tsx', tb)

console.log('Fixed typescript errors')
