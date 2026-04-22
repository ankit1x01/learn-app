import fs from 'fs'

// 1. Fix TopicsBank.tsx
let tb = fs.readFileSync('src/screens/TopicsBank.tsx', 'utf8')
tb = tb.replace(/<\(meta\.icon as any\) ([^>]+) \/>/g, '{ (() => { const I = meta.icon as any; return <I $1 /> })() }')
fs.writeFileSync('src/screens/TopicsBank.tsx', tb)

// 2. Fix Dashboard.tsx
let db = fs.readFileSync('src/screens/Dashboard.tsx', 'utf8')
db = db.replace(/<\(sub\.icon as any\) ([^>]+) \/>/g, '{ (() => { const I = sub.icon as any; return <I $1 /> })() }')
fs.writeFileSync('src/screens/Dashboard.tsx', db)

console.log('Fixed JSX errors')
