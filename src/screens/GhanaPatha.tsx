import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, CheckCircle2, XCircle, ArrowRight, Star, Zap, Brain } from 'lucide-react';

import { Screen } from '../types';
import { Concept } from '../core/types';

interface Props {
  setScreen: (s: Screen) => void;
  concepts: Concept[];
  onUpdateConcept: (id: string, updates: Partial<Concept>) => void;
}

const GHANA_TIME = 15;

const SUBJECT_COLORS: Record<string, string> = {
  'Foundations': 'text-[#94A3B8]', 'Arrays & Search': 'text-primary',
  'Strings & Data Structures': 'text-[#0E7490]', 'Trees & Graphs': 'text-[#15803D]', 'DP & Greedy': 'text-[#B45309]'
};

// One-line challenge prompt per chapter (shown under the concept name)
const CHAPTER_PROMPTS: Record<string, string> = {
  'Array Patterns':        'State the template + time/space complexity.',
  'Search Patterns':       'Write the loop invariant. What shrinks the search space?',
  'Linked List Patterns':  'Which pointer moves when? Draw 3-node trace.',
  'Interval Patterns':     'What is the merge condition? What do you sort by?',
  'Stack Patterns':        'What invariant does the stack maintain? When do you pop?',
  'Recursion Patterns':    'What is the base case? What does one recursive call return?',
  'Bit Manipulation':      'Write the bit trick. What is the time complexity?',
  'Hash Patterns':         'What is the key? What is the value? When do you look up?',
  'Heap Patterns':         'Min-heap or max-heap? What property does it maintain?',
  'Binary Trees':          'Which traversal? Pre / In / Post / Level — and why?',
  'Binary Search Trees':   'What BST invariant enables efficient search?',
  'Graph Traversal':       'BFS or DFS? What data structure? Visited set needed?',
  'Shortest Path':         'Which algorithm? Dijkstra / BFS / Bellman-Ford — and when?',
  'Spanning Tree':         'Prim vs Kruskal — when to use each?',
  'Graph Algorithms':      'State the algorithm. What is the time complexity?',
  'Tries':                 'What does each node represent? Insert + Search in O(?)',
  'DP Patterns':           'State: define it. Recurrence: write it. Base case: set it.',
  'Greedy':                'What is the greedy choice? Prove it leads to global optimal.',
};

const getPrompt = (chapter: string): string =>
  CHAPTER_PROMPTS[chapter] ?? 'State the key insight + time complexity of this pattern.';

export const GhanaPatha: React.FC<Props> = ({ setScreen, concepts, onUpdateConcept }) => {
  const queue = concepts.filter(c => c.stage === 'Automatic' || c.stage === 'ExamReady');
  const [idx, setIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GHANA_TIME);
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<'clean' | 'partial' | 'fail' | null>(null);
  const [streak, setStreak] = useState(0);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0, examReady: 0 });
  const [done, setDone] = useState(false);

  const concept = queue[idx];

  const submit = useCallback((rating: 'clean' | 'partial' | 'fail', autoFail = false) => {
    if (revealed || !concept) return;
    const correct = rating === 'clean';
    const fast = timeLeft > 5;

    let sNew = concept.stability;
    if (correct && fast) sNew = concept.stability * 2.0;
    else if (correct) sNew = concept.stability * 1.5;
    else if (rating === 'partial') sNew = concept.stability * 0.8;
    else sNew = 1;

    const consecutive = correct && fast ? streak + 1 : 0;
    const nowExamReady = consecutive >= 3;

    onUpdateConcept(concept.id, {
      stability: parseFloat(sNew.toFixed(2)),
      difficulty: correct ? Math.max(0, concept.difficulty - 0.1) : Math.min(1, concept.difficulty + 0.12),
      stage: nowExamReady ? 'ExamReady' : concept.stage,
      lastTested: 0,
    });

    setStreak(consecutive);
    setSessionStats(s => ({
      correct: s.correct + (correct ? 1 : 0),
      total: s.total + 1,
      examReady: s.examReady + (nowExamReady ? 1 : 0),
    }));
    setResult(autoFail ? 'fail' : rating);
    setRevealed(true);
  }, [concept, revealed, streak, timeLeft, onUpdateConcept]);

  useEffect(() => {
    if (revealed || !concept) return;
    setTimeLeft(GHANA_TIME);
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(id); submit('fail', true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [idx, revealed]);

  const next = () => {
    if (idx >= queue.length - 1) { setDone(true); return; }
    setIdx(i => i + 1);
    setResult(null);
    setRevealed(false);
  };

  if (queue.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <Flame size={40} className="text-[#F59E0B] mb-4" />
      <h2 className="text-2xl font-ui font-bold mb-2">No Automatic Patterns Yet</h2>
      <p className="text-[#6B7280] text-sm mb-6">Complete study sessions to advance patterns to Stage 3 first.</p>
      <button onClick={() => setScreen('elite')} className="px-6 py-3 bg-primary text-background rounded-xl font-bold text-sm">← Back</button>
    </div>
  );

  if (done) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center pb-32">
      <div className="w-40 h-40 rounded-full border-2 border-[#F59E0B]/30 flex flex-col items-center justify-center mb-8 card">
        <span className="text-5xl font-ui font-bold text-[#F59E0B]">{Math.round((sessionStats.correct / sessionStats.total) * 100)}%</span>
        <span className="text-[12px] uppercase tracking-normal text-[#6B7280] mt-1">Accuracy</span>
      </div>
      <h2 className="text-2xl font-ui font-bold mb-1">Ghana Patha Complete</h2>
      <p className="text-[#6B7280] text-sm mb-6">{sessionStats.correct}/{sessionStats.total} correct · {sessionStats.examReady} patterns → Interview Ready</p>
      <div className="flex gap-3">
        <button onClick={() => { setIdx(0); setDone(false); setResult(null); setRevealed(false); setStreak(0); setSessionStats({ correct: 0, total: 0, examReady: 0 }); }}
          className="px-6 py-3 bg-[#F59E0B] text-background rounded-xl font-bold text-sm">Again</button>
        <button onClick={() => setScreen('elite')} className="px-6 py-3 bg-[#F0EEE9] rounded-xl font-bold text-sm">← Hub</button>
      </div>
    </div>
  );

  if (!concept) return null;

  const pct = (timeLeft / GHANA_TIME) * 100;
  const urgent = timeLeft <= 5;

  return (
    <div className="pt-16 pb-32 px-6 max-w-md mx-auto min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Flame size={16} className="text-[#F59E0B]" />
          <span className="text-[12px] uppercase tracking-widest font-bold text-[#6B7280]">Ghana Patha</span>
          {streak >= 2 && <span className="px-2 py-0.5 bg-[#F59E0B]/10 text-[#F59E0B] text-[12px] font-bold rounded-full">{streak} streak</span>}
        </div>
        <span className="text-[12px] text-[#78716C]">{idx + 1}/{queue.length}</span>
      </div>

      {/* Timer ring */}
      <div className="flex justify-center mb-8">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
            <circle cx="18" cy="18" r="15" fill="none"
              stroke={urgent ? '#EF4444' : '#F59E0B'}
              strokeWidth="2.5" strokeDasharray="94.2" strokeLinecap="round"
              strokeDashoffset={94.2 * (1 - pct / 100)}
              className={urgent ? 'transition-none' : 'transition-all duration-1000'}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-ui font-bold ${urgent ? 'text-[#B91C1C] animate-pulse' : 'text-[#F59E0B]'}`}>
              {timeLeft}
            </span>
          </div>
        </div>
      </div>

      {/* Subject badge */}
      <div className="flex gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-widest bg-[#F0EEE9] ${SUBJECT_COLORS[concept.subject]}`}>
          {concept.subject}
        </span>
        {concept.stage === 'ExamReady' && (
          <span className="px-3 py-1 rounded-full text-[12px] font-bold bg-[#F59E0B]/10 text-[#F59E0B] flex items-center gap-1">
            <Star size={8} fill="currentColor" /> INTERVIEW READY
          </span>
        )}
      </div>

      {/* Pattern name — no chapter context */}
      <h2 className="text-2xl font-ui font-bold leading-tight mb-3 flex-1">{concept.name}</h2>

      {/* Challenge prompt */}
      <div className="flex items-start gap-2 mb-8 p-3 rounded-xl bg-[#F0EEE9] border border-[#E8E5DF]">
        <Brain size={13} className="text-[#F59E0B] mt-0.5 shrink-0" />
        <p className="text-[11px] text-[#6B7280] leading-relaxed">{getPrompt(concept.chapter)}</p>
      </div>

      {!revealed ? (
        <div className="space-y-3">
          <button onClick={() => submit('clean')}
            className="w-full p-4 rounded-xl text-left border bg-[#F0FDF4] border-[#BBF7D0] hover:bg-[#F0FDF4] transition-all">
            <div className="font-bold text-sm text-[#15803D]">Got it clean</div>
            <div className="text-[11px] text-[#6B7280] mt-0.5">Full recall, correct approach, no hesitation</div>
          </button>
          <button onClick={() => submit('partial')}
            className="w-full p-4 rounded-xl text-left border bg-[#FFFBEB] border-tertiary/20 hover:bg-[#FFFBEB] transition-all">
            <div className="font-bold text-sm text-[#B45309]">Partially recalled</div>
            <div className="text-[11px] text-[#6B7280] mt-0.5">Got the idea but missed details / complexity</div>
          </button>
          <button onClick={() => submit('fail')}
            className="w-full p-4 rounded-xl text-left border bg-[#FEF2F2] border-[#FECACA] hover:bg-[#FEF2F2] transition-all">
            <div className="font-bold text-sm text-[#B91C1C]">Couldn't recall</div>
            <div className="text-[11px] text-[#6B7280] mt-0.5">Blank. Needs re-encoding.</div>
          </button>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className={`flex items-center gap-2 p-3 rounded-xl ${
              result === 'clean' ? 'bg-[#F0FDF4]' : result === 'partial' ? 'bg-[#FFFBEB]' : 'bg-[#FEF2F2]'
            }`}>
              {result === 'clean'
                ? <CheckCircle2 size={18} className="text-[#15803D]" />
                : result === 'partial'
                ? <CheckCircle2 size={18} className="text-[#B45309]" />
                : <XCircle size={18} className="text-[#B91C1C]" />}
              <span className={`text-sm font-bold ${
                result === 'clean' ? 'text-[#15803D]' : result === 'partial' ? 'text-[#B45309]' : 'text-[#B91C1C]'
              }`}>
                {result === 'clean'
                  ? `Clean recall · S → ${(concept.stability * (timeLeft > 5 ? 2.0 : 1.5)).toFixed(1)}d`
                  : result === 'partial'
                  ? 'Partial · S slightly reduced'
                  : 'Not recalled · S reset to 1d'}
              </span>
              {streak >= 3 && result === 'clean' && <span className="ml-auto text-[12px] text-[#F59E0B] font-bold">→ INTERVIEW READY</span>}
            </div>
            <button onClick={next}
              className="w-full py-4 bg-[#F59E0B] text-background rounded-2xl font-ui font-bold tracking-widest text-sm">
              NEXT <Zap size={14} className="inline ml-1" fill="currentColor" />
            </button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
