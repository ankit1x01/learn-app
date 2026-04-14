import re
import sys

with open('src/games/components/Links.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
content = content.replace(
    "import { useState, useRef } from 'react'",
    "import { useState, useRef } from 'react'\nimport { motion, useAnimation, PanInfo } from 'motion/react'"
)

# 2. Add an ID to the center slot so we can drop there
content = content.replace(
    '          {/* Center card slot */}',
    '          {/* Center card slot */}\n          <div id="links-center-slot" className="absolute" style={{ top: \'50%\', left: \'50%\', transform: \'translate(-50%, -50%)\', width: 108, height: 136, zIndex: 0 }} />'
)

# 3. Add drag functionality. We will use a DraggableCard component instead of the `currentCard` rendering in place
draggable_card = """
function DraggableDeckCard({ card, color, index, total, onAttemptPlace }: any) {
  const controls = useAnimation()
  
  async function handleDragEnd(_: any, info: PanInfo) {
    const slot = document.getElementById('links-center-slot')?.getBoundingClientRect()
    
    // basic center of screen collision check
    const dropX = info.point.x
    const dropY = info.point.y
    
    const isInside = (rect: DOMRect | undefined) => {
      if (!rect) return false
      return dropX >= rect.left && dropX <= rect.right && dropY >= rect.top && dropY <= rect.bottom
    }
    
    if (isInside(slot)) {
      onAttemptPlace(card)
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
      whileTap={{ scale: 1.05, zIndex: 50, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      className="absolute inset-0 rounded-3xl flex items-center justify-center px-4 cursor-grab active:cursor-grabbing border-[2.5px] border-black/5 bg-white transition-all transform origin-bottom"
      style={{
        background: color,
        boxShadow: '0 6px 0 rgba(0,0,0,0.18), 0 8px 16px rgba(0,0,0,0.08)',
        zIndex: 10
      }}
    >
      <p className="text-[15px] font-black text-center" style={{ color: 'rgba(0,0,0,0.72)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
        {card?.label}
      </p>
      <span className="absolute bottom-2 right-3 text-[11px] font-bold" style={{ color: 'rgba(0,0,0,0.30)', fontFamily: 'Inter, system-ui' }}>
        {index + 1}/{total}
      </span>
      <div className="absolute top-2 left-0 right-0 flex justify-center opacity-30 pointer-events-none">
        <div className="w-8 h-1 rounded-full bg-black/40" />
      </div>
    </motion.div>
  )
}
"""

content = re.sub(r'export function Links\(\{ config \}: Props\) \{', draggable_card + '\nexport function Links({ config }: Props) {', content)


# 4. Modify handlePlace
# Current `handlePlace()` is parameterless and checks `currentCard`.
# We change it to `function handlePlace(attemptedCard: any) { ... }`
content = content.replace('function handlePlace() {', 'function handlePlace(attemptedCard?: any) {')
content = content.replace('if (!currentCard) return', 'const cardToCheck = attemptedCard || currentCard;\n    if (!cardToCheck) return')
content = content.replace('if (currentCard.id === round.cardId) {', 'if (cardToCheck.id === round.cardId) {')


# 5. Remove Place button and old top card in deck block, and use DraggableDeckCard
old_deck_card = """            {/* Top card */}
            <div
              className="absolute inset-0 rounded-xl flex items-center justify-center px-4"
              style={{
                background: cardColor,
                boxShadow: '0 3px 0 rgba(0,0,0,0.18)',
              }}
            >
              <p className="text-[14px] font-black text-center" style={{ color: 'rgba(0,0,0,0.72)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
                {currentCard?.label}
              </p>
              <span className="absolute bottom-1 right-2 text-[10px] font-semibold" style={{ color: 'rgba(0,0,0,0.35)', fontFamily: 'Inter, system-ui' }}>
                {deckIndex + 1}/{availableCards.length}
              </span>
            </div>"""

new_deck_card = """            {/* Top card (Draggable) */}
            <DraggableDeckCard
              card={currentCard}
              color={cardColor}
              index={deckIndex}
              total={availableCards.length}
              onAttemptPlace={handlePlace}
            />"""

content = content.replace(old_deck_card, new_deck_card)


# Make backgrounds 3d and consistent
content = content.replace(
    '''            <div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: DECK_COLORS[(deckIndex + 2) % DECK_COLORS.length],
                  transform: 'rotate(2.5deg)',
                  boxShadow: '0 2px 0 rgba(0,0,0,0.10)',
                }}
              />''',
    '''            <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: DECK_COLORS[(deckIndex + 2) % DECK_COLORS.length],
                  transform: 'rotate(5.5deg) scale(0.9)',
                  boxShadow: '0 4px 0 rgba(0,0,0,0.15)',
                }}
              />'''
)

content = content.replace(
    '''              <div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: DECK_COLORS[(deckIndex + 1) % DECK_COLORS.length],
                  transform: 'rotate(1.2deg)',
                  boxShadow: '0 2px 0 rgba(0,0,0,0.10)',
                }}
              />''',
    '''              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: DECK_COLORS[(deckIndex + 1) % DECK_COLORS.length],
                  transform: 'rotate(2.5deg) scale(0.95)',
                  boxShadow: '0 4px 0 rgba(0,0,0,0.15)',
                }}
              />'''
)

content = content.replace(
    '''          <button
            onClick={() => setDeckIndex(i => (i - 1 + availableCards.length) % availableCards.length)}
            className="w-10 h-10 flex items-center justify-center rounded-xl"
            style={{ background: '#F0EEE9' }}
          >''',
    '''          <button
            onClick={() => setDeckIndex(i => (i - 1 + availableCards.length) % availableCards.length)}
            className="w-12 h-12 flex items-center justify-center rounded-2xl active:translate-y-1 transition-transform"
            style={{ background: '#F0EEE9', border: '2px solid #E3DDD5', boxShadow: '0 4px 0 #D4CFC8' }}
          >'''
)

content = content.replace(
    '''          <button
            onClick={() => setDeckIndex(i => (i + 1) % availableCards.length)}
            className="w-10 h-10 flex items-center justify-center rounded-xl"
            style={{ background: '#F0EEE9' }}
          >''',
    '''          <button
            onClick={() => setDeckIndex(i => (i + 1) % availableCards.length)}
            className="w-12 h-12 flex items-center justify-center rounded-2xl active:translate-y-1 transition-transform"
            style={{ background: '#F0EEE9', border: '2px solid #E3DDD5', boxShadow: '0 4px 0 #D4CFC8' }}
          >'''
)

content = content.replace(
    '''          <button
            onClick={handleHint}
            disabled={!round.hints || revealedHints >= (round.hints?.length ?? 0)}
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-[13px] font-bold disabled:opacity-40"
            style={{ background: '#F0EEE9', color: '#78716C', fontFamily: 'Plus Jakarta Sans, system-ui' }}
          >''',
    '''          <button
            onClick={handleHint}
            disabled={!round.hints || revealedHints >= (round.hints?.length ?? 0)}
            className="flex items-center gap-1.5 px-4 py-3 rounded-2xl text-[14px] font-bold disabled:opacity-40 active:translate-y-1 transition-transform"
            style={{ background: '#F0EEE9', color: '#78716C', fontFamily: 'Plus Jakarta Sans, system-ui', border: '2px solid #E3DDD5', boxShadow: '0 4px 0 #D4CFC8' }}
          >'''
)

# And remove the Place button entirely and replace with an instructions bar
content = content.replace(
    '''          <button
            onClick={handlePlace}
            disabled={feedback !== null}
            className="flex-1 py-3 rounded-xl text-[15px] font-black disabled:opacity-50"
            style={{
              background: '#1C1917',
              color: '#FFFFFF',
              fontFamily: 'Plus Jakarta Sans, system-ui',
              boxShadow: '0 3px 0 rgba(0,0,0,0.25)',
            }}
          >
            Place
          </button>''',
    '''          <div className="flex-1 py-3 px-4 rounded-2xl flex items-center justify-center border-dashed border-2 border-black/10" style={{ background: 'transparent' }}>
            <span className="text-[14px] font-black text-black/30 tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>DRAG CARD TO CENTER</span>
          </div>'''
)


with open('src/games/components/Links.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
