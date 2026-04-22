import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { TWIN_PAIRS, type TwinPair } from './data/twin-pairs'

type Phase = 'ready' | 'card' | 'result' | 'done'

interface Props {
  onBack: () => void
}

const SUBJECT_COLOR: Record<string, string> = {
  Physics:   '#0891B2',
  Chemistry: '#059669',
  Maths:     '#7C3AED',
}
const SUBJECT_BG: Record<string, string> = {
  Physics:   '#ECFEFF',
  Chemistry: '#ECFDF5',
  Maths:     '#F5F3FF',
}

export function TwinOrNot({ onBack }: Props) {
  const pairs = useMemo(() => [...TWIN_PAIRS].sort(() => Math.random() - 0.5), [])
  const [phase, setPhase]     = useState<Phase>('ready')
  const [index, setIndex]     = useState(0)
  const [selected, setSelected] = useState<boolean | null>(null)
  const [score, setScore]     = useState(0)
  const [correct, setCorrect] = useState(0)
  const startTime             = useState(() => Date.now())[0]

  const pair: TwinPair = pairs[index]
  const color = SUBJECT_COLOR[pair.subject]
  const bg    = SUBJECT_BG[pair.subject]

  const handleAnswer = (isSame: boolean) => {
    if (selected !== null) return
    setSelected(isSame)
    const isCorrect = isSame === pair.sameConcept
    if (isCorrect) {
      setCorrect(c => c + 1)
      setScore(s => s + 100)
    }
    setPhase('result')
  }

  const handleNext = () => {
    if (index + 1 >= pairs.length) {
      setPhase('done')
    } else {
      setIndex(i => i + 1)
      setSelected(null)
      setPhase('card')
    }
  }

  const accuracy = index > 0 || phase === 'done' ? Math.round((correct / (phase === 'done' ? pairs.length : index)) * 100) : 0

  // ── Ready ───────────────────────────────────────────────────────────────
  if (phase === 'ready') {
    return (
      <div className="flex flex-col h-screen max-w-md mx-auto" style={{ background: 'var(--color-background)' }}>
        <div className="flex items-center gap-3 px-4 pt-5 pb-3">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: 'var(--color-surface-container)' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--color-on-surface)' }}>arrow_back</span>
          </button>
          <h1 className="text-[18px] font-black" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Twin or Not</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-7">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-24 h-24 rounded-3xl flex items-center justify-center" style={{ background: '#ECFEFF' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 52, color: '#0891B2', fontVariationSettings: "'FILL' 1" }}>compare</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-center">
            <p className="text-[26px] font-black leading-tight mb-2" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui', letterSpacing: '-0.02em' }}>Same Concept or Different?</p>
            <p className="text-[14px] leading-relaxed" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>
              Two JEE questions shown side by side. Decide if they test the same concept — then explain why.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="w-full flex gap-3">
            <div className="flex-1 p-3 rounded-2xl flex flex-col items-center gap-1" style={{ background: '#ECFDF5' }}>
              <span className="material-symbols-rounded" style={{ fontSize: 20, color: '#059669', fontVariationSettings: "'FILL' 1" }}>join_inner</span>
              <p className="text-[12px] font-bold text-center" style={{ color: '#059669', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Same Concept</p>
              <p className="text-[10px] text-center" style={{ color: '#059669', opacity: 0.7, fontFamily: 'Inter, system-ui' }}>Same method, different numbers</p>
            </div>
            <div className="flex-1 p-3 rounded-2xl flex flex-col items-center gap-1" style={{ background: '#FFF1F2' }}>
              <span className="material-symbols-rounded" style={{ fontSize: 20, color: '#F43F5E', fontVariationSettings: "'FILL' 1" }}>join_full</span>
              <p className="text-[12px] font-bold text-center" style={{ color: '#F43F5E', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Different Concept</p>
              <p className="text-[10px] text-center" style={{ color: '#F43F5E', opacity: 0.7, fontFamily: 'Inter, system-ui' }}>Looks similar, different approach</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full p-3 rounded-2xl" style={{ background: 'var(--color-surface-container)' }}>
            <p className="text-[12px]" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>
              <strong style={{ color: 'var(--color-on-surface)' }}>{pairs.length} pairs</strong> · Physics, Chemistry, Maths · Similarity scores from JEE 2022–2025 analysis
            </p>
          </motion.div>
          <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setPhase('card')}
            className="w-full py-4 rounded-2xl font-black text-[17px]"
            style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
            Start
          </motion.button>
        </div>
      </div>
    )
  }

  // ── Done ────────────────────────────────────────────────────────────────
  if (phase === 'done') {
    const grade = accuracy >= 80 ? { label: 'Sharp Discriminator', color: '#059669', bg: '#ECFDF5', icon: 'psychology' }
      : accuracy >= 60 ? { label: 'Good Instincts', color: '#6750A4', bg: '#F5F3FF', icon: 'thumb_up' }
      : { label: 'Keep Practicing', color: '#DC2626', bg: '#FEF2F2', icon: 'fitness_center' }
    return (
      <div className="flex flex-col h-screen max-w-md mx-auto" style={{ background: 'var(--color-background)' }}>
        <div className="flex items-center gap-3 px-4 pt-5 pb-3">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: 'var(--color-surface-container)' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--color-on-surface)' }}>arrow_back</span>
          </button>
          <h1 className="text-[18px] font-black" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Round Complete</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-28 h-28 rounded-3xl flex items-center justify-center" style={{ background: grade.bg }}>
            <span className="material-symbols-rounded" style={{ fontSize: 60, color: grade.color, fontVariationSettings: "'FILL' 1" }}>{grade.icon}</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center">
            <p className="text-[40px] font-black" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui', letterSpacing: '-0.02em' }}>{correct}/{pairs.length}</p>
            <p className="text-[14px] font-bold mt-1" style={{ color: grade.color, fontFamily: 'Inter, system-ui' }}>{grade.label}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="w-full flex gap-3">
            <button onClick={onBack} className="flex-1 py-3.5 rounded-2xl font-bold text-[15px]"
              style={{ background: 'var(--color-surface-container)', color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Done</button>
            <button onClick={() => { setIndex(0); setSelected(null); setScore(0); setCorrect(0); setPhase('card') }}
              className="flex-1 py-3.5 rounded-2xl font-bold text-[15px]"
              style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Play Again</button>
          </motion.div>
        </div>
      </div>
    )
  }

  // ── Card + Result ────────────────────────────────────────────────────────
  const isCorrect = selected === pair.sameConcept

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto" style={{ background: 'var(--color-background)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: 'var(--color-surface-container)' }}>
          <span className="material-symbols-rounded" style={{ fontSize: 18, color: 'var(--color-on-surface)' }}>close</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: bg }}>
            <span className="text-[9px] font-black" style={{ color }}>{pair.subject[0]}</span>
          </div>
          <span className="text-[13px] font-bold" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>{index + 1}/{pairs.length}</span>
        </div>
        <span className="text-[16px] font-black tabular-nums" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>{score}</span>
      </div>

      {/* Topic badge */}
      <div className="flex justify-center pb-2">
        <span className="px-3 py-1 rounded-full text-[11px] font-semibold" style={{ background: bg, color, fontFamily: 'Inter, system-ui' }}>
          {pair.subject} · {pair.topic}
        </span>
      </div>

      {/* Questions */}
      <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-4">
        <AnimatePresence mode="wait">
          <motion.div key={index} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            {/* Question A */}
            <div className="p-4 rounded-2xl mb-3 border" style={{ background: 'var(--color-surface-container)', borderColor: 'var(--color-outline-variant)' }}>
              <p className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color, fontFamily: 'Inter, system-ui' }}>Question A · {pair.questionA.source}</p>
              <p className="text-[14px] leading-relaxed" style={{ color: 'var(--color-on-surface)', fontFamily: 'Inter, system-ui' }}>{pair.questionA.text}</p>
            </div>
            {/* VS divider */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px" style={{ background: 'var(--color-outline-variant)' }} />
              <span className="text-[11px] font-black px-2" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>VS</span>
              <div className="flex-1 h-px" style={{ background: 'var(--color-outline-variant)' }} />
            </div>
            {/* Question B */}
            <div className="p-4 rounded-2xl mb-3 border" style={{ background: 'var(--color-surface-container)', borderColor: 'var(--color-outline-variant)' }}>
              <p className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color, fontFamily: 'Inter, system-ui' }}>Question B · {pair.questionB.source}</p>
              <p className="text-[14px] leading-relaxed" style={{ color: 'var(--color-on-surface)', fontFamily: 'Inter, system-ui' }}>{pair.questionB.text}</p>
            </div>

            {/* Result explanation */}
            <AnimatePresence>
              {phase === 'result' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="p-4 rounded-2xl mb-3" style={{ background: isCorrect ? '#ECFDF5' : '#FEF2F2' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-rounded" style={{ fontSize: 18, color: isCorrect ? '#059669' : '#DC2626', fontVariationSettings: "'FILL' 1" }}>
                        {isCorrect ? 'check_circle' : 'cancel'}
                      </span>
                      <p className="text-[13px] font-black" style={{ color: isCorrect ? '#059669' : '#DC2626', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
                        {isCorrect ? 'Correct!' : 'Not quite'} · {pair.sameConcept ? 'Same Concept' : 'Different Concepts'}
                      </p>
                    </div>
                    {pair.sameConcept ? (
                      <p className="text-[12px] mb-1" style={{ color: '#059669', fontFamily: 'Inter, system-ui' }}>
                        <strong>Shared concept:</strong> {pair.conceptName}
                      </p>
                    ) : (
                      <p className="text-[12px] mb-1" style={{ color: '#DC2626', fontFamily: 'Inter, system-ui' }}>
                        <strong>Key difference:</strong> {pair.distinguishingFeature}
                      </p>
                    )}
                    <p className="text-[12px] leading-relaxed mt-1" style={{ color: pair.sameConcept ? '#065F46' : '#991B1B', fontFamily: 'Inter, system-ui' }}>
                      {pair.explanation}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="px-4 pb-8 shrink-0">
        {phase === 'card' ? (
          <div className="flex gap-3">
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleAnswer(true)}
              className="flex-1 py-4 rounded-2xl font-black text-[15px] flex items-center justify-center gap-2"
              style={{ background: '#ECFDF5', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
              <span className="material-symbols-rounded" style={{ fontSize: 18, color: '#059669', fontVariationSettings: "'FILL' 1" }}>join_inner</span>
              <span style={{ color: '#059669' }}>Same Concept</span>
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleAnswer(false)}
              className="flex-1 py-4 rounded-2xl font-black text-[15px] flex items-center justify-center gap-2"
              style={{ background: '#FFF1F2', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
              <span className="material-symbols-rounded" style={{ fontSize: 18, color: '#F43F5E', fontVariationSettings: "'FILL' 1" }}>join_full</span>
              <span style={{ color: '#F43F5E' }}>Different</span>
            </motion.button>
          </div>
        ) : (
          <button onClick={handleNext}
            className="w-full py-4 rounded-2xl font-black text-[17px]"
            style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
            {index + 1 >= pairs.length ? 'See Results' : 'Next Pair'}
          </button>
        )}
      </div>
    </div>
  )
}
