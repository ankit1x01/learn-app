const fs = require('fs')
const path = require('path')

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f)
    const isDirectory = fs.statSync(dirPath).isDirectory()
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f))
  })
}

walkDir('src/games/playground/simulations', (filePath) => {
  if (!filePath.endsWith('.tsx')) return
  
  let content = fs.readFileSync(filePath, 'utf8')
  let original = content

  // 1. Fix the system-ui to sans-serif
  content = content.replace(/system-ui/g, 'sans-serif')

  // 2. Fix the W * 0.xxx scaling bug to Math.min(W, H) * 0.xxx
  // This will catch things like W * 0.026, W * 0.03, W * 0.034
  content = content.replace(/W \* (0\.\d+)/g, 'Math.min(W, H) * ($1 * 1.5)')
  
  // Wait, if I multiply the factor by 1.5 because min(W, H) is typically much smaller than W.
  // E.g. if W=800, H=400. W*0.025 = 20. Math.min(W,H)*0.025*1.5 = 400*0.0375 = 15. This is safer.

  if (content !== original) {
    fs.writeFileSync(filePath, content)
    console.log('Fixed', filePath)
  }
})
