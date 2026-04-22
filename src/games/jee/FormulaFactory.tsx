import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FORMULA_BANK, type FormulaQuestion } from './data/formulas'

const SECONDS_PER_QUESTION = 8

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

export function FormulaFactory({ onBack }: Props) {
  const questions: FormulaQuestion[] = useMemo(() => [...FORMULA_BANK].sort(() => Math.random() - 0.5), [])

  const [phase, setPhase]     = useState<'ready' | 'playing' | 'done'>('ready')
  const [index, setIndex]     = useState(0)
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore]     = useState(0)
  const [correct, setCorrect] = useState(0)
  const [streak, setStreak]   = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [subjectFilter, setSubjectFilter] = useState<'All' | 'Physics' | 'Chemistry' | 'Maths'>('All')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const filtered = useMemo(() =>
    subjectFilter === 'All' ? questions : questions.filter(q => q.subject === subjectFilter),
    [questions, subjectFilter])

  const q = filtered[index]

  const stopTimer = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null } }
  useEffect(() => stopTimer, [])

  const moveNext = () => {
    stopTimer()
    if (index + 1 >= filtered.length) { setPhase('done'); return }
    setIndex(i => i + 1)
    setSelected(null)
    setTimeLeft(SECONDS_PER_QUESTION)
    startTimer()
  }

  const startTimer = () => {
    stopTimer()
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { handleTimeout(); return 0 }
        return t - 1
      })
    }, 1000)
  }

  const handleTimeout = () => {
    stopTimer()
    setSelected('__timeout__')
    setStreak(0)
    setTimeout(moveNext, 1400)
  }

  const handleStart = () => {
    setPhase('playing')
    setIndex(0); setScore(0); setCorrect(0); setStreak(0); setMaxStreak(0)
    setSelected(null); setTimeLeft(SECONDS_PER_QUESTION)
    startTimer()
  }

  const handleSelect = (option: string) => {
    if (selected !== null || !q) return
    stopTimer()
    setSelected(option)

    const isCorrect = option === q.answer
    const speedBonus = Math.round(timeLeft * 5)
    if (isCorrect) {
      const newStreak = streak + 1
      const pts = 100 + speedBonus + newStreak * 10
      setScore(s => s + pts)
      setCorrect(c => c + 1)
      setStreak(newStreak)
      setMaxStreak(m => Math.max(m, newStreak))
    } else {
      setStreak(0)
    }
    setTimeout(moveNext, 1200)
  }

  const accuracy = index > 0 || phase === 'done' ? Math.round((correct / (phase === 'done' ? filtered.length : Math.max(1, index))) * 100) : 0
  const timerPct  = (timeLeft / SECONDS_PER_QUESTION) * 100
  const timerColor = timeLeft > 4 ? '#7C3AED' : timeLeft > 2 ? '#D97706' : '#DC2626'

  // ── Ready ────────────────────────────────────────────────────────────────
  if (phase === 'ready') {
    return (
      <div className="flex flex-col h-screen max-w-md mx-auto" style={{ background: 'var(--color-background)' }}>
        <div className="flex items-center gap-3 px-4 pt-5 pb-3">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: 'var(--color-surface-container)' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--color-on-surface)' }}>arrow_back</span>
          </button>
          <h1 className="text-[18px] font-black" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Formula Factory</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-7">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-24 h-24 rounded-3xl flex items-center justify-center" style={{ background: '#F5F3FF' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 52, color: '#7C3AED', fontVariationSettings: "'FILL' 1" }}>calculate</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-center">
            <p className="text-[26px] font-black leading-tight mb-2" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui', letterSpacing: '-0.02em' }}>Fill the Blank</p>
            <p className="text-[14px] leading-relaxed" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>
              NCERT formula shown with a blank. Pick the correct part. {SECONDS_PER_QUESTION}s per question — speed adds bonus points.
            </p>
          </motion.div>

          {/* Subject filter */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="w-full">
            <p className="text-[12px] font-bold px-1 mb-2" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Subject</p>
            <div className="flex gap-2">
              {(['All', 'Physics', 'Chemistry', 'Maths'] as const).map(s => (
                <button key={s} onClick={() => setSubjectFilter(s)}
                  className="flex-1 py-2 rounded-xl text-[12px] font-bold"
                  style={{
                    background: subjectFilter === s ? (s === 'All' ? '#7C3AED' : SUBJECT_BG[s]) : 'var(--color-surface-container)',
                    color: subjectFilter === s ? (s === 'All' ? '#FFFFFF' : SUBJECT_COLOR[s]) : 'var(--color-on-surface-variant)',
                    fontFamily: 'Plus Jakarta Sans, system-ui',
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="w-full p-3 rounded-2xl" style={{ background: 'var(--color-surface-container)' }}>
            <p className="text-[12px]" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>
              <strong style={{ color: 'var(--color-on-surface)' }}>{filtered.length} formulas</strong> · Streak bonus: +10 pts per consecutive correct
            </p>
          </motion.div>

          <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={handleStart}
            className="w-full py-4 rounded-2xl font-black text-[17px]"
            style={{ background: '#7C3AED', color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
            Start
          </motion.button>
        </div>
      </div>
    )
  }

  // ── Done ─────────────────────────────────────────────────────────────────
  if (phase === 'done') {
    const grade = accuracy >= 80 ? { label: 'Formula Master', color: '#7C3AED', icon: 'workspace_premium' }
      : accuracy >= 60 ? { label: 'Getting There', color: '#059669', icon: 'thumb_up' }
      : { label: 'Keep Drilling', color: '#DC2626', icon: 'fitness_center' }
    return (
      <div className="flex flex-col h-screen max-w-md mx-auto" style={{ background: 'var(--color-background)' }}>
        <div className="flex items-center gap-3 px-4 pt-5 pb-3">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: 'var(--color-surface-container)' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--color-on-surface)' }}>arrow_back</span>
          </button>
          <h1 className="text-[18px] font-black" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Factory Done</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-28 h-28 rounded-3xl flex items-center justify-center" style={{ background: '#F5F3FF' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 60, color: grade.color, fontVariationSettings: "'FILL' 1" }}>{grade.icon}</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center">
            <p className="text-[36px] font-black" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui', letterSpacing: '-0.02em' }}>{score.toLocaleString()}</p>
            <p className="text-[14px] font-bold mt-1" style={{ color: grade.color, fontFamily: 'Inter, system-ui' }}>{grade.label} · {accuracy}% accuracy</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="w-full grid grid-cols-2 gap-3">
            {[
              { label: 'Correct', value: `${correct}/${filtered.length}`, icon: 'check_circle', color: '#059669' },
              { label: 'Best Streak', value: maxStreak.toString(), icon: 'local_fire_department', color: '#D97706' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: 'var(--color-surface-container)' }}>
                <span className="material-symbols-rounded" style={{ fontSize: 22, color: s.color, fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                <div>
                  <p className="text-[18px] font-black leading-none" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>{s.value}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>{s.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="w-full flex gap-3">
            <button onClick={onBack} className="flex-1 py-3.5 rounded-2xl font-bold text-[15px]"
              style={{ background: 'var(--color-surface-container)', color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Done</button>
            <button onClick={handleStart} className="flex-1 py-3.5 rounded-2xl font-bold text-[15px]"
              style={{ background: '#7C3AED', color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans, system-ui' }}>Play Again</button>
          </motion.div>
        </div>
      </div>
    )
  }

  // ── Playing ───────────────────────────────────────────────────────────────
  if (!q) return null

  const color = SUBJECT_COLOR[q.subject]
  const bg    = SUBJECT_BG[q.subject]
  const isTimeout = selected === '__timeout__'

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto" style={{ background: 'var(--color-background)' }}>
      {/* Timer bar */}
      <div className="h-2 w-full" style={{ background: 'var(--color-surface-container)' }}>
        <motion.div className="h-full" style={{ background: timerColor, width: `${timerPct}%` }} transition={{ duration: 0.4 }} />
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => { stopTimer(); setPhase('done') }} className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: 'var(--color-surface-container)' }}>
          <span className="material-symbols-rounded" style={{ fontSize: 18, color: 'var(--color-on-surface)' }}>close</span>
        </button>
        <div className="flex items-center gap-2">
          {streak >= 2 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-black" style={{ background: '#FFFBEB', color: '#D97706', fontFamily: 'Plus Jakarta Sans, system-ui' }}>
              ×{streak}
            </span>
          )}
          <span className="text-[13px] font-bold" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>{index + 1}/{filtered.length}</span>
        </div>
        <span className="text-[18px] font-black tabular-nums" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui' }}>{score.toLocaleString()}</span>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-5">
        <AnimatePresence mode="wait">
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }} className="w-full">
            {/* Subject + topic */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold" style={{ background: bg, color, fontFamily: 'Inter, system-ui' }}>
                {q.subject} · {q.topic}
              </span>
              <span className="text-[14px] font-black tabular-nums" style={{ color: timerColor, fontFamily: 'Plus Jakarta Sans, system-ui' }}>{timeLeft}s</span>
            </div>

            {/* Formula with blank */}
            <div className="w-full p-5 rounded-3xl text-center mb-4" style={{ background: 'var(--color-surface-container)', minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p className="text-[20px] font-black" style={{ color: 'var(--color-on-surface)', fontFamily: 'Plus Jakarta Sans, system-ui', letterSpacing: '0.01em' }}>
                {q.blankFormula.split('___').map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span style={{ color, borderBottom: `2px solid ${color}`, padding: '0 12px', marginInline: 4 }}>
                        {selected && selected !== '__timeout__' ? (selected === q.answer ? q.answer : selected) : '?'}
                      </span>
                    )}
                  </span>
                ))}
              </p>
            </div>

            {/* Hint */}
            {q.hint && (
              <p className="text-center text-[11px] mb-3" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>{q.hint}</p>
            )}

            {/* Options */}
            <div className="grid grid-cols-2 gap-2">
              {q.options.map(opt => {
                const isCorrectOpt  = opt === q.answer
                const isSelectedOpt = opt === selected
                let optBg = 'var(--color-surface-container)'
                let textColor = 'var(--color-on-surface)'
                let border = 'transparent'
                if (selected && selected !== '__timeout__') {
                  if (isCorrectOpt)  { optBg = '#ECFDF5'; textColor = '#059669'; border = '#059669' }
                  else if (isSelectedOpt) { optBg = '#FEF2F2'; textColor = '#DC2626'; border = '#DC2626' }
                }
                if (isTimeout && isCorrectOpt) { optBg = '#ECFDF5'; textColor = '#059669'; border = '#059669' }

                return (
                  <motion.button key={opt} whileTap={{ scale: 0.95 }} onClick={() => handleSelect(opt)}
                    disabled={selected !== null}
                    className="p-4 rounded-2xl text-[18px] font-black border"
                    style={{ background: optBg, color: textColor, borderColor: border, fontFamily: 'Plus Jakarta Sans, system-ui' }}>
                    {opt}
                  </motion.button>
                )
              })}
            </div>

            {/* Full formula reveal */}
            <AnimatePresence>
              {selected && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden mt-3">
                  <p className="text-center text-[12px] font-medium py-2" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'Inter, system-ui' }}>
                    {q.fullFormula}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
