import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';


import { Screen } from '../types';
import { Concept } from '../core/types';

interface Props { setScreen: (s: Screen) => void; concepts: Concept[]; }

const STRESS_TIMES = [12, 15, 20, 25, 30, 10, 18, 22, 28, 14];

// Prompts rotate per concept to keep sessions varied
const RECALL_PROMPTS = [
  'State the pattern template + time complexity.',
  'What is the trigger condition for this pattern?',
  'What data structure? Why this one, not another?',
  'Walk through a 5-element example mentally.',
  'What are the edge cases? (empty, single, all same)',
  'Write the key 3–5 lines of code mentally.',
  'What is the space complexity? Can it be reduced?',
  'How do you recognise this problem in an interview?',
];

export const StressMode: React.FC<Props> = ({ setScreen, concepts }) => {
  // Any concept that's been seen at least once
  const pool = concepts.filter(c => c.stage !== 'Unseen');
  const [idx, setIdx] = useState(0);
  const [currentLimit, setCurrentLimit] = useState(STRESS_TIMES[0]);
  const [timeLeft, setTimeLeft] = useState(STRESS_TIMES[0]);
  const [result, setResult] = useState<'clean' | 'partial' | 'fail' | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<{ rating: 'clean' | 'partial' | 'fail'; autoFail: boolean }[]>([]);
  const [done, setDone] = useState(false);
  const [pulse, setPulse] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const concept = pool[idx];
  const promptIdx = idx % RECALL_PROMPTS.length;

  const getRandomTime = () => STRESS_TIMES[Math.floor(Math.random() * STRESS_TIMES.length)];

  const reveal = useCallback((rating: 'clean' | 'partial' | 'fail', autoFail = false) => {
    if (revealed) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setResult(autoFail ? 'fail' : rating);
    setResults(r => [...r, { rating: autoFail ? 'fail' : rating, autoFail }]);
    setRevealed(true);
  }, [revealed]);

  useEffect(() => {
    if (revealed || !concept) return;
    const limit = getRandomTime();
    setCurrentLimit(limit);
    setTimeLeft(limit);
    setPulse(false);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 3) setPulse(true);
        if (t <= 1) { reveal('fail', true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [idx, revealed]);

  const next = () => {
    if (idx >= pool.length - 1 || results.length >= 20) { setDone(true); return; }
    setIdx(i => i + 1);
    setResult(null);
    setRevealed(false);
    setPulse(false);
  };

  const correct = results.filter(r => r.rating === 'clean').length;
  const autoFails = results.filter(r => r.autoFail).length;
  const accuracy = results.length ? Math.round((correct / results.length) * 100) : 0;

  if (pool.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <span className="material-symbols-rounded text-[#B91C1C] mb-4" style={{ fontSize: 40 }}>warning</span>
      <h2 className="text-2xl font-ui font-bold mb-2">No Patterns Available</h2>
      <p className="text-[#6B7280] text-sm mb-6">Complete at least one study session first to unlock Stress Mode.</p>
      <button onClick={() => setScreen('elite')} className="px-6 py-3 bg-primary text-background rounded-xl font-bold text-sm flex items-center gap-2"><span className="material-symbols-rounded" style={{ fontSize: 16 }}>arrow_back</span> Back</button>
    </div>
  );

  if (done) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-32">
      <div className={`w-44 h-44 rounded-full border-2 flex flex-col items-center justify-center mb-8 card ${
        accuracy >= 80 ? 'border-[#BBF7D0]' : accuracy >= 60 ? 'border-tertiary/30' : 'border-[#FECACA]'
      }`}>
        <span className={`text-5xl font-ui font-bold ${accuracy >= 80 ? 'text-[#15803D]' : accuracy >= 60 ? 'text-[#B45309]' : 'text-[#B91C1C]'}`}>
          {accuracy}%
        </span>
        <span className="text-[12px] uppercase tracking-normal text-[#6B7280] mt-1">Under Stress</span>
      </div>
      <h2 className="text-2xl font-ui font-bold mb-2">Stress Session Done</h2>
      <div className="flex gap-6 mb-6 text-center">
        <div><div className="text-xl font-bold text-[#15803D]">{correct}</div><div className="text-[12px] text-[#6B7280] uppercase">Clean</div></div>
        <div><div className="text-xl font-bold text-[#B91C1C]">{autoFails}</div><div className="text-[12px] text-[#6B7280] uppercase">Timed Out</div></div>
        <div><div className="text-xl font-bold text-[var(--color-on-surface)]">{results.length}</div><div className="text-[12px] text-[#6B7280] uppercase">Total</div></div>
      </div>
      <p className="text-sm text-[#6B7280] text-center mb-6 max-w-xs">
        {autoFails > 3
          ? "Multiple timeouts — these patterns need more Ghana Patha drilling."
          : accuracy >= 80
          ? "Strong recall under pressure. Your pattern library is solid."
          : "Keep running stress sessions daily to build retrieval speed."}
      </p>
      <div className="flex gap-3">
        <button onClick={() => { setIdx(0); setDone(false); setResult(null); setRevealed(false); setResults([]); setPulse(false); }}
          className="px-6 py-3 bg-error text-background rounded-xl font-bold text-sm">Again</button>
        <button onClick={() => setScreen('elite')} className="px-6 py-3 bg-[var(--color-surface-container)] rounded-xl font-bold text-sm flex items-center gap-2"><span className="material-symbols-rounded" style={{ fontSize: 16 }}>arrow_back</span> Hub</button>
      </div>
    </div>
  );

  if (!concept) return null;

  const pct = (timeLeft / currentLimit) * 100;

  return (
    <div className={`pt-16 pb-32 px-6 max-w-md mx-auto min-h-screen flex flex-col transition-all duration-300 ${
      pulse && !revealed ? 'bg-[#FEF2F2]' : ''
    }`}>
      {/* Stress header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full bg-error ${!revealed ? 'animate-pulse' : ''}`} />
          <span className="text-[12px] uppercase tracking-widest font-bold text-[#B91C1C]">INTERVIEW IN PROGRESS</span>
        </div>
        <span className="text-[12px] text-[var(--color-on-surface-variant)]">{idx + 1}/20</span>
      </div>

      {/* Stress timer bar */}
      <div className={`h-1.5 w-full rounded-full overflow-hidden mb-6 ${pulse && !revealed ? 'bg-[#FEF2F2]' : 'bg-[var(--color-surface-container)]'}`}>
        <div
          className={`h-full rounded-full transition-all duration-1000 ${pct > 50 ? 'bg-[#15803D]' : pct > 25 ? 'bg-tertiary' : 'bg-error animate-pulse'}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Timer display */}
      <div className="flex justify-end mb-4">
        <span className={`text-3xl font-ui font-bold ${timeLeft <= 5 ? 'text-[#B91C1C] animate-pulse' : 'text-[#6B7280]'}`}>
          {timeLeft}s
        </span>
      </div>

      {/* Subject context */}
      <div className="mb-2">
        <span className="text-[12px] uppercase tracking-normal text-[var(--color-border)] font-bold">
          {concept.subject} · Pattern {idx + 1}
        </span>
      </div>

      {/* Pattern name */}
      <h2 className="text-2xl font-ui font-bold leading-tight mb-4 flex-1">
        {concept.name}
      </h2>

      {/* Recall prompt */}
      <div className="flex items-start gap-2 mb-8 p-3 rounded-xl bg-[var(--color-surface-container)] border border-[var(--color-border)]">
        <span className="material-symbols-rounded text-[#B91C1C] mt-0.5 shrink-0" style={{ fontSize: 12 }}>psychology</span>
        <p className="text-[11px] text-[#6B7280] leading-relaxed">{RECALL_PROMPTS[promptIdx]}</p>
      </div>

      {!revealed ? (
        <div className="space-y-3">
          <button onClick={() => reveal('clean')}
            className="w-full p-4 rounded-xl text-left border bg-[#F0FDF4] border-[#BBF7D0] hover:bg-[#F0FDF4] transition-all">
            <span className="font-bold text-sm text-[#15803D]">Got it clean</span>
          </button>
          <button onClick={() => reveal('partial')}
            className="w-full p-4 rounded-xl text-left border bg-[#FFFBEB] border-tertiary/20 hover:bg-[#FFFBEB] transition-all">
            <span className="font-bold text-sm text-[#B45309]">Partial recall</span>
          </button>
          <button onClick={() => reveal('fail')}
            className="w-full p-4 rounded-xl text-left border bg-[#FEF2F2] border-[#FECACA] hover:bg-[#FEF2F2] transition-all">
            <span className="font-bold text-sm text-[#B91C1C]">Couldn't recall</span>
          </button>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {results[results.length - 1]?.autoFail ? (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FEF2F2]">
                <span className="material-symbols-rounded text-[#B91C1C]" style={{ fontSize: 16 }}>warning</span>
                <span className="text-sm font-bold text-[#B91C1C]">TIMED OUT — Needs more drilling.</span>
              </div>
            ) : (
              <div className={`flex items-center gap-2 p-3 rounded-xl ${
                result === 'clean' ? 'bg-[#F0FDF4]' : result === 'partial' ? 'bg-[#FFFBEB]' : 'bg-[#FEF2F2]'
              }`}>
                {result === 'clean'
                  ? <span className="material-symbols-rounded text-[#15803D]" style={{ fontSize: 16 }}>check_circle</span>
                  : result === 'partial'
                  ? <span className="material-symbols-rounded text-[#B45309]" style={{ fontSize: 16 }}>check_circle</span>
                  : <span className="material-symbols-rounded text-[#B91C1C]" style={{ fontSize: 16 }}>cancel</span>}
                <span className={`text-sm font-bold ${
                  result === 'clean' ? 'text-[#15803D]' : result === 'partial' ? 'text-[#B45309]' : 'text-[#B91C1C]'
                }`}>
                  {result === 'clean' ? `Clean in ${currentLimit - timeLeft}s` : result === 'partial' ? 'Partial recall' : 'Not recalled'}
                </span>
              </div>
            )}
            <button onClick={next}
              className="w-full py-4 bg-error text-background rounded-2xl font-ui font-bold tracking-widest text-sm">
              <div className="flex items-center justify-center gap-2">NEXT PATTERN <span className="material-symbols-rounded" style={{ fontSize: 16 }}>chevron_right</span></div>
            </button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
