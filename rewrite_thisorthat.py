import re

with open('src/games/components/ThisOrThat.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Imports
content = re.sub(
    r"import \{ useState, useRef \} from 'react'",
    "import { useState, useRef, useEffect } from 'react'\nimport { motion, useAnimation, PanInfo } from 'motion/react'",
    content
)

# Insert Drop Zones Logic inside component
# We'll use a hack to add ids to the target columns so we can use bounding rects
content = content.replace(
    '<div className="grid grid-cols-2 gap-3 px-4">',
    '<div className="grid grid-cols-2 gap-3 px-4" id="this-that-columns">'
)

content = content.replace(
    'className="rounded-2xl p-3 min-h-[140px]"',
    'id={`col-${col}`} className="rounded-2xl p-3 min-h-[140px]"'
)

# Refactor the unassigned items to be Draggable
drag_card_component = """
function DraggableCard({ card, assign, configA, configB }: any) {
  const controls = useAnimation()

  async function handleDragEnd(_: any, info: PanInfo) {
    const colA = document.getElementById('col-A')?.getBoundingClientRect()
    const colB = document.getElementById('col-B')?.getBoundingClientRect()

    const dropX = info.point.x
    const dropY = info.point.y

    const isInside = (rect: DOMRect | undefined) => {
      if (!rect) return false
      return dropX >= rect.left && dropX <= rect.right && dropY >= rect.top && dropY <= rect.bottom
    }

    if (isInside(colA)) {
      assign(card.id, 'A')
    } else if (isInside(colB)) {
      assign(card.id, 'B')
    } else {
      controls.start({ x: 0, y: 0 })
    }
  }

  return (
    <motion.div
      drag
      dragSnapToOrigin
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      animate={controls}
      whileHover={{ scale: 1.02 }}
      whileDrag={{ scale: 1.05, zIndex: 50, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      className="flex items-center justify-between px-4 py-3 rounded-2xl cursor-grab active:cursor-grabbing relative bg-white"
      style={{
        background: card.color,
        boxShadow: '0 3px 0 rgba(0,0,0,0.14), 0 4px 10px rgba(0,0,0,0.08)',
        touchAction: 'none'
      }}
    >
      <div className="flex flex-col gap-0.5 opacity-40 px-1 py-1 rounded pointer-events-none absolute left-2">
        <div className="w-1 h-1 rounded-full" style={{ background: '#78716C' }} />
        <div className="w-1 h-1 rounded-full" style={{ background: '#78716C' }} />
        <div className="w-1 h-1 rounded-full" style={{ background: '#78716C' }} />
      </div>
      <span
        className="text-[14px] font-bold ml-4 pointer-events-none select-none"
        style={{ color: 'rgba(0,0,0,0.72)', fontFamily: 'Plus Jakarta Sans, system-ui' }}
      >
        {card.label}
      </span>
      <div className="flex gap-2 pointer-events-none opacity-50">
         <span className="text-[10px] font-bold uppercase">Drag up</span>
      </div>
    </motion.div>
  )
}
"""

# Insert DraggableCard component right before export function ThisOrThat
content = re.sub(r'export function ThisOrThat\(\{ config \}: Props\) \{', drag_card_component + '\nexport function ThisOrThat({ config }: Props) {', content)

# Now replace the map loop inside the unassigned pool
new_pool = """          {unassigned.map(card => (
            <DraggableCard key={card.id} card={card} assign={assign} configA={config.columnA} configB={config.columnB} />
          ))}"""

content = re.sub(
    r'\{unassigned\.map\(card => \(\s*<div\s*key=\{card\.id\}.*?</div>\s*\)\)\}',
    new_pool,
    content,
    flags=re.DOTALL
)

with open('src/games/components/ThisOrThat.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
