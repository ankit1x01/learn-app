import fs from 'fs'
import path from 'path'

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

  // Fix the system-ui to sans-serif
  content = content.replace(/system-ui/g, 'sans-serif')
  content = content.replace(/Inter, sans-serif/g, "'Inter', sans-serif")
  content = content.replace(/Roboto, sans-serif/g, "'Roboto', sans-serif")

  // Fix the W * 0.xxx scaling bug to Math.min(W, H) * 0.xxx * 1.5
  // Also look for W * 0.xxx inside Math.max or outside. 
  // Let's do a replace that captures W * (0.\d+)
  content = content.replace(/W \* (0\.\d+)/g, 'Math.min(W, H) * ($1 * 1.5)')

  if (content !== original) {
    fs.writeFileSync(filePath, content)
    console.log('Fixed', filePath)
  }
})
