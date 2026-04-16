import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, CheckCircle2, XCircle, ChevronRight,
  Flame, BookOpen, Youtube, Layers, BarChart2, Link2, GitBranch, Zap,
  Activity, Wind, Brain, Timer
} from 'lucide-react';
import type { Screen } from '../types';
import { DEMO_SESSION, type DemoConcept } from '../data/demo-session';
import { askLlm } from '../lib/llm';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

import { m3SpatialDefault, m3SpatialFast, m3EffectsEase } from '../lib/m3-motion';

const playSound = (type: 'tick' | 'success' | 'buzzer' | 'chime') => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    if (type === 'tick') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'buzzer') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'chime') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.setValueAtTime(800, now + 0.1);
      osc.frequency.setValueAtTime(1200, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  } catch(e) { /* ignore */ }
};


const SUBJECT_ICON: Record<string, React.ElementType> = {
  'Arrays & Search':           BarChart2,
  'Strings & Data Structures': Link2,
  'Trees & Graphs':            GitBranch,
  'Foundations':               Layers,
  'DP & Greedy':               Zap,
};

const SUBJECT_COLOR: Record<string, string> = {
  'Arrays & Search':           'var(--color-subject-physics)',
  'Strings & Data Structures': 'var(--color-subject-cs)',
  'Trees & Graphs':            'var(--color-success)',
  'Foundations':               'var(--color-on-surface-variant)',
  'DP & Greedy':               'var(--color-warning)',
};

const SUBJECT_BG: Record<string, string> = {
  'Arrays & Search':           'var(--color-subject-physics-container)',
  'Strings & Data Structures': 'var(--color-subject-cs-container)',
  'Trees & Graphs':            'var(--color-success-container)',
  'Foundations':               'var(--color-surface-container)',
  'DP & Greedy':               'var(--color-warning-container)',
};

// ─── Session state persisted in localStorage ──────────────────────────────────
const STORAGE_KEY = 'smriti_demo_session';

interface SessionState {
  conceptIndex: number;
  phase: 'kosha' | 'predict' | 'content' | 'feynman' | 'mcq' | 'metacognition' | 'pause';
  mcqIndex: number;
  answers: Record<string, number[]>; // conceptId → chosen option indices
  correct: Record<string, boolean[]>;
  completed: string[];
}

function loadState(): SessionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { conceptIndex: 0, phase: 'kosha', mcqIndex: 0, answers: {}, correct: {}, completed: [] };
}

function saveState(s: SessionState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

function resetState(): SessionState {
  const s: SessionState = { conceptIndex: 0, phase: 'kosha', mcqIndex: 0, answers: {}, correct: {}, completed: [] };
  saveState(s);
  return s;
}

const KoshaCard = ({ onNext }: { onNext: () => void }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={m3SpatialDefault}>
      <div className="flex items-center gap-2 mb-4 font-bold uppercase tracking-widest text-[12px]" style={{ color: 'var(--color-on-surface-muted)' }}>
        <Activity size={14} style={{ color: 'var(--color-subject-cs)' }} /> Pre-Session Kosha Check
      </div>
      <h2 className="text-display-large-emphasized mb-2 leading-tight" style={{ color: 'var(--color-on-surface)' }}>
        How are you feeling right now?
      </h2>
      <p className="text-[15px] mb-6 leading-relaxed font-body" style={{ color: 'var(--color-on-surface-variant)' }}>
        Your mental state primes your brain for the optimal learning band.
      </p>

      <div className="grid grid-cols-1 gap-3 mb-8">
        {[
          { label: 'Highly Focused', desc: 'Ready for deep logical work', icon: Brain, color: 'var(--color-primary)' },
          { label: 'A bit fatigued', desc: 'Need shorter, high-impact notes', icon: Wind, color: 'var(--color-warning)' },
          { label: 'Exam Stressed', desc: 'Time pressure is high currently', icon: Timer, color: 'var(--color-error)' }
        ].map((btn, i) => (
          <button 
            key={i}
            onClick={onNext}
            className="w-full p-4 rounded-m3-lg text-left hover:bg-gray-50 flex items-center gap-4 transition-colors"
            style={{ border: '1px solid var(--color-border)' }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: `${btn.color}15`, color: btn.color }}>
              <btn.icon size={20} />
            </div>
            <div>
              <p className="font-bold text-[16px] font-ui" style={{ color: 'var(--color-on-surface)' }}>{btn.label}</p>
              <p className="text-[13px] font-body" style={{ color: 'var(--color-on-surface-variant)' }}>{btn.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

const PauseCard = ({ onNext }: { onNext: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    if (timeLeft <= 0) {
      onNext();
      return;
    }
    const t = setInterval(() => {
      setTimeLeft(prev => prev - 1);
      // Somatic Anchoring: A soft pulse every 4 seconds mimicking deep breathing rhythm
      if (timeLeft % 4 === 0) {
        Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
      }
    }, 1000);
    return () => clearInterval(t);
  }, [timeLeft, onNext]);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }}>
      <div className="flex flex-col items-center justify-center text-center py-10 min-h-[400px]">
        <motion.div 
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-8 relative"
        >
          <div className="absolute inset-0 rounded-full bg-blue-200" style={{ animation: 'ping 4s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
          <div className="w-16 h-16 rounded-full bg-blue-500 opacity-20 relative z-10" />
        </motion.div>
        
        <h2 className="text-[24px] font-black mb-2 leading-tight" style={{ fontFamily: 'var(--font-ui)', color: 'var(--color-on-surface)' }}>
          Nididhyasanam Pause
        </h2>
        <p className="text-[15px] mb-8 leading-relaxed max-w-[260px]" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-on-surface-variant)' }}>
          Take a deep breath. Allowing your mind to rest for {timeLeft}s spikes BDNF levels to consolidate the memory you just learned.
        </p>

        <button
          onClick={onNext}
          className="px-8 py-3 rounded-full font-bold text-[13px] uppercase tracking-widest transition-colors"
          style={{ color: 'var(--color-primary)', background: 'var(--color-primary-container)', border: '1px solid var(--color-primary-border)' }}
        >
          Skip Rest ({timeLeft}s)
        </button>
      </div>
    </motion.div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const PredictCard = ({ concept, onNext }: { concept: DemoConcept; onNext: () => void }) => {
  const [selected, setSelected] = useState<'a' | 'b' | null>(null);
  const color = SUBJECT_COLOR[concept.subject] ?? 'var(--color-primary)';
  const opts = concept.predictOptions || {
    a: 'It involves caching subproblems to avoid redundant recalculation.',
    b: 'It involves walking sequence from left and right simultaneously.',
    correct: 'b',
    explanation: 'By moving from ends, we shrink the search space directly.'
  };

  const handleSelect = (choice: 'a' | 'b') => {
    setSelected(choice);
    // Somatic anchoring on guess
    Haptics.impact({ style: choice === opts.correct ? ImpactStyle.Light : ImpactStyle.Medium }).catch(() => {});
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.28 }}>
      <div className="flex items-center gap-2 mb-4 font-bold uppercase tracking-widest text-[12px]" style={{ color: 'var(--color-on-surface-muted)' }}>
        <Zap size={14} style={{ color: 'var(--color-warning)' }} /> Prediction Error Phase
      </div>
      <h2 className="text-[28px] font-black mb-2 leading-tight" style={{ fontFamily: 'var(--font-ui)', color: 'var(--color-on-surface)' }}>
        Before you learn about <span style={{ color }}>{concept.title}</span>...
      </h2>
      <p className="text-[15px] mb-6 leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-on-surface-variant)' }}>
        Pick the statement that you think is true. (Don't overthink it!)
      </p>
      
      <div className="grid grid-cols-1 gap-3 mb-6">
        {(['a', 'b'] as const).map(choice => {
          const isSelected = selected === choice;
          return (
            <button
              key={choice}
              onClick={() => handleSelect(choice)}
              disabled={selected !== null}
              className={`p-4 rounded-2xl border text-left flex items-start gap-4 transition-all duration-200 ${
                isSelected ? 'border-2 ring-2 ring-opacity-20' : 'hover:bg-gray-50'
              } ${selected !== null && !isSelected ? 'opacity-50 grayscale' : 'opacity-100'}`}
              style={isSelected
                ? { borderColor: color, ['--tw-ring-color' as string]: color }
                : { border: '1.5px solid var(--color-border)' }}
            >
              <div className="w-6 h-6 rounded-full border border-current font-bold uppercase shrink-0 flex items-center justify-center text-[12px]" style={{ color: isSelected ? color : 'var(--color-on-surface-muted)' }}>
                {choice}
              </div>
              <p className="text-[14px] pt-0.5 leading-relaxed font-bold" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-on-surface)' }}>
                {opts[choice]}
              </p>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className={`p-4 rounded-xl mb-2 flex gap-3 items-start ${selected === opts.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              {selected === opts.correct ? <CheckCircle2 className="text-green-600 shrink-0 mt-0.5" size={18} /> : <XCircle className="text-red-500 shrink-0 mt-0.5" size={18} />}
              <div>
                <p className={`text-[14px] font-bold ${selected === opts.correct ? 'text-green-800' : 'text-red-800'}`} style={{ fontFamily: 'var(--font-ui)' }}>
                  {selected === opts.correct ? 'Correct Intuition!' : 'Not Quite!'}
                </p>
                <p className={`text-[13px] leading-relaxed mt-1 ${selected === opts.correct ? 'text-green-700' : 'text-red-700'}`} style={{ fontFamily: 'var(--font-body)' }}>
                  {opts.explanation}
                </p>
              </div>
            </div>
            {selected !== opts.correct && (
              <div className="p-3 rounded-lg flex items-center gap-2" style={{ background: 'var(--color-error-container)', color: 'var(--color-on-error-container)' }}>
                <Flame size={16} />
                <p className="text-[12px] font-bold">Neuroscience: Guessing wrong creates dopamine which locks the correct answer in next.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={onNext}
        disabled={selected === null}
        className="w-full py-4 rounded-2xl font-bold text-[13px] uppercase tracking-widest text-white flex items-center justify-center transition-all disabled:opacity-50"
        style={{ background: color, fontFamily: 'var(--font-ui)' }}
      >
        Continue <ChevronRight size={16} className="ml-1" />
      </button>
    </motion.div>
  );
};

const FeynmanCard = ({ concept, onNext }: { concept: DemoConcept; onNext: () => void }) => {
  const [text, setText] = useState('');
  const [simulating, setSimulating] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [streamText, setStreamText] = useState('');
  const color = SUBJECT_COLOR[concept.subject] ?? 'var(--color-primary)';

  const handleSimulate = async () => {
    setSimulating(true);
    setStreamText(''); // Initialize the streaming display
    
    let fullText = '';
    const prompt = `You are an expert tutor. Grade this student's 1-sentence explanation of ${concept.title}: "${text}". First line must be exactly "Score: X/100" (where X is 0-100). Second line must be a 1-sentence feedback explaining why. Ignore JSON format. Just raw text.`;
    
    try {
      await askLlm(prompt, (partial) => {
        fullText += partial;
        setStreamText(prev => prev + partial); // Display the stream typed out live
      });
      // Parsing the non-JSON text stream
      const scoreMatch = fullText.match(/Score:\s*(\d+)/i);
      const parsedScore = scoreMatch ? parseInt(scoreMatch[1], 10) : 75;
      setScore(parsedScore);
      setFeedback(fullText.split('\n').pop() || "Great attempt. Let's move forward.");
      
      // Play a victory chime once grading completely arrives
      if (parsedScore > 60) playSound('chime');
      else playSound('buzzer');
      Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
      
    } catch {
      setScore(80);
      setFeedback("Great explanation! That shows conscious understanding of the core loop.");
      setStreamText("Score: 80/100\nGreat explanation! That shows conscious understanding of the core loop.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.28 }}>
      <div className="flex items-center gap-2 mb-4 font-bold uppercase tracking-widest text-[12px]" style={{ color: 'var(--color-on-surface-muted)' }}>
        <Layers size={14} style={{ color: 'var(--color-subject-cs)' }} /> Active Processing
      </div>
      <h2 className="text-[28px] font-black mb-2 leading-tight" style={{ fontFamily: 'var(--font-ui)', color: 'var(--color-on-surface)' }}>
        The Feynman Technique
      </h2>
      <p className="text-[15px] mb-6 leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-on-surface-variant)' }}>
        Explain the exact trick or formula for <strong>{concept.title}</strong> back to the AI in one sentence.
      </p>
      
      {!score && !simulating ? (
        <>
          <textarea
            className="w-full p-4 rounded-2xl mb-5 min-h-[120px] text-[15px] resize-none outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{ fontFamily: 'var(--font-body)', '--tw-ring-color': color, border: '1px solid var(--color-border)' } as React.CSSProperties}
            placeholder="So basically, you just have to..."
            value={text}
            onChange={e => setText(e.target.value)}
            disabled={simulating}
          />
          <button
            onClick={handleSimulate}
            disabled={text.trim().length < 10 || simulating}
            className="w-full py-4 rounded-2xl font-bold text-[13px] uppercase tracking-widest text-white flex items-center justify-center transition-all disabled:opacity-50"
            style={{ background: color, fontFamily: 'var(--font-ui)' }}
          >
            Submit to AI
          </button>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-4">
          <div className="p-5 rounded-2xl mb-6 bg-green-50 border border-green-200">
            {simulating ? (
               <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-green-700">
                    <Activity size={14} className="animate-spin" /> <span className="text-xs uppercase tracking-widest font-bold">Grading Live...</span>
                  </div>
                  <p className="text-[14px] text-green-900 leading-relaxed font-mono whitespace-pre-wrap">{streamText}</p>
               </div>
            ) : (
              <>
                 <h3 className="text-xl font-bold text-green-800 mb-2">Score: {score}%</h3>
                 <p className="text-[14px] font-medium text-green-900 leading-relaxed">{feedback}</p>
              </>
            )}
          </div>
          
          {!simulating && (
            <button
              onClick={onNext}
              className="w-full py-4 rounded-2xl font-bold text-[13px] uppercase tracking-widest text-white flex items-center justify-center transition-all"
              style={{ background: color, fontFamily: 'var(--font-ui)' }}
            >
              Continue <ChevronRight size={16} className="ml-1" />
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

const MetacogCard = ({ concept, onNext }: { concept: DemoConcept; onNext: () => void }) => {
  const color = SUBJECT_COLOR[concept.subject] ?? 'var(--color-primary)';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.28 }}>
      <div className="flex items-center gap-2 mb-4 font-bold uppercase tracking-widest text-[12px]" style={{ color: 'var(--color-on-surface-muted)' }}>
        <BarChart2 size={14} style={{ color: 'var(--color-subject-chemistry)' }} /> Solidification Phase
      </div>
      <h2 className="text-[28px] font-black mb-6 leading-tight" style={{ fontFamily: 'var(--font-ui)', color: 'var(--color-on-surface)' }}>
        How confident do you feel about this now?
      </h2>

      <div className="grid grid-cols-1 gap-3 mb-8">
        {[
          { label: 'Automatic', desc: 'Can apply it in my sleep', val: 'var(--color-success)' },
          { label: 'Conscious', desc: 'I get it, but need to think', val: 'var(--color-warning)' },
          { label: 'Fragile', desc: 'Still a bit confused', val: 'var(--color-error)' }
        ].map((btn, i) => (
          <button 
            key={i}
            onClick={onNext}
            className="w-full p-4 rounded-m3-lg text-left hover:bg-gray-50 flex items-center justify-between transition-colors"
            style={{ border: '1px solid var(--color-border)' }}
          >
            <div>
              <p className="font-bold text-[16px] font-ui" style={{ color: 'var(--color-on-surface)' }}>{btn.label}</p>
              <p className="text-[13px] font-body" style={{ color: 'var(--color-on-surface-variant)' }}>{btn.desc}</p>
            </div>
            <div className="w-3 h-3 rounded-full" style={{ background: btn.val }} />
          </button>
        ))}
      </div>

      <div className="text-center">
        <p className="text-[12px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-on-surface-muted)' }}>Calculates next Spaced Repetition interval</p>
      </div>
    </motion.div>
  );
};

const CodeBlock = ({ code }: { code: string }) => (
  <div className="rounded-xl overflow-hidden mt-3" style={{ background: '#1E1E2E' }}>
    <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/5">
      {['#FF5F57','#FEBC2E','#28C840'].map(c => (
        <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
      ))}
    </div>
    <pre className="px-4 py-3 text-[12px] leading-relaxed overflow-x-auto text-[#CDD6F4]"
         style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
      {code}
    </pre>
  </div>
);

const ContentCard = ({ concept, onDone }: { concept: DemoConcept; onDone: () => void }) => {
  const Icon = SUBJECT_ICON[concept.subject] ?? BookOpen;
  const color = SUBJECT_COLOR[concept.subject] ?? 'var(--color-primary)';
  const bg    = SUBJECT_BG[concept.subject]   ?? 'var(--color-primary-container)';
  const [revealed, setRevealed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Subject + tag row */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: bg }}>
          <Icon size={16} style={{ color }} />
        </div>
        <span className="text-[12px] font-bold uppercase tracking-widest" style={{ color }}>{concept.subject}</span>
        <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide" style={{ background: 'var(--color-background)', color: 'var(--color-on-surface-variant)' }}>
          {concept.tag}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-[24px] font-black mb-1 leading-tight" style={{ fontFamily: 'var(--font-ui)', color: 'var(--color-on-surface)' }}>
        {concept.title}
      </h2>
      <p className="text-[12px] mb-5 uppercase tracking-widest font-bold" style={{ color: 'var(--color-on-surface-muted)' }}>
        {concept.contentType === 'video' ? 'Watch · then answer MCQs' : 'Read · then answer MCQs'}
      </p>

      {/* Video embed */}
      {concept.contentType === 'video' && concept.youtubeId && (
        <div className="rounded-2xl overflow-hidden mb-5" style={{ aspectRatio: '16/9', border: '1px solid var(--color-border)' }}>
          <iframe
            width="100%" height="100%"
            src={`https://www.youtube.com/embed/${concept.youtubeId}?rel=0&modestbranding=1`}
            title={concept.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: 'none' }}
          />
        </div>
      )}

      {/* Infographic card */}
      <div className="card rounded-2xl p-5 mb-4 border" style={{ borderColor: `${color}25` }}>
        {/* Headline */}
        <p className="text-[15px] font-bold mb-4 leading-snug" style={{ fontFamily: 'var(--font-ui)', color: 'var(--color-on-surface)' }}>
          {concept.visual.headline}
        </p>

        {/* Bullets */}
        <div className="space-y-2.5 mb-4">
          {concept.visual.bullets.map((b, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-black"
                   style={{ background: bg, color }}>
                {i + 1}
              </div>
              <p className="text-[14px] leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-on-surface)' }}>
                {b}
              </p>
            </div>
          ))}
        </div>

        {/* Code block */}
        {concept.visual.code && <CodeBlock code={concept.visual.code} />}
      </div>

      {/* Tip */}
      <div className="flex flex-col p-4 rounded-xl mb-6 relative overflow-hidden group"
           style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
        <div className="flex gap-3 items-start relative z-10 w-full">
          <Zap size={14} className="text-[#B45309] shrink-0 mt-0.5" />
          <div className="w-full">
            <p className="text-[13px] text-[#92400E] leading-relaxed font-bold mb-1" style={{ fontFamily: 'var(--font-body)' }}>
              Elaborative Interrogation 
            </p>
            <p className={`text-[13px] leading-relaxed transition-all duration-500 ease-in-out ${revealed ? 'text-[#92400E] blur-none' : 'text-transparent select-none blur-[4px]'}`} style={{ fontFamily: 'var(--font-body)' }}>
              <span className="font-bold">Why it works: </span>{concept.visual.tip}
            </p>
          </div>
        </div>

        {!revealed && (
          <button 
            onClick={() => setRevealed(true)}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm transition-all hover:bg-white/50"
          >
            <div className="px-4 py-2 bg-white rounded-full shadow-sm border border-[#FDE68A] text-[#B45309] text-[11px] font-bold tracking-widest uppercase flex flex-col items-center">
              <span>Why does this work?</span>
              <span className="text-[9px] opacity-70 mt-0.5">Tap to Reveal</span>
            </div>
          </button>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={onDone}
        className="w-full py-4 rounded-2xl font-bold text-[13px] uppercase tracking-widest text-white flex items-center justify-center gap-2"
        style={{ background: color, fontFamily: 'var(--font-ui)' }}
      >
        I've read this — Start MCQs <ChevronRight size={16} />
      </button>
    </motion.div>
  );
};

const MCQCard = ({
  concept, mcqIdx, chosen, revealed, onChoose, onNext, isLast,
}: {
  concept: DemoConcept;
  mcqIdx:  number;
  chosen:  number | null;
  revealed: boolean;
  onChoose: (i: number | null) => void;
  onNext:   () => void;
  isLast:   boolean;
}) => {
  const mcq   = concept.mcqs[mcqIdx];
  const color = SUBJECT_COLOR[concept.subject] ?? '#2563EB';

  const TIMER_TIME = 15;
  const [timeLeft, setTimeLeft] = useState(TIMER_TIME);

  useEffect(() => {
    if (revealed || timeLeft <= 0) return;
    const t = setInterval(() => {
      setTimeLeft(prev => prev - 1);
      // Somatic Anchoring: A heartbeat pulse every second pushing mild stress (Norepinephrine)
      Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
      playSound('tick'); // Audio tension cue
    }, 1000);
    return () => clearInterval(t);
  }, [revealed, timeLeft]);

  const handleChooseLocal = (i: number | null) => {
    if (revealed) return;
    if (i !== null && i === mcq.correct) {
      playSound('success');
      Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {});
    } else {
      playSound('buzzer');
      Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => {});
    }
    onChoose(i);
  };

  useEffect(() => {
    if (timeLeft === 0 && !revealed) {
      handleChooseLocal(null); // timeout trigger
    }
  }, [timeLeft, revealed, onChoose]);

  const isChosen = (i: number) => chosen === i;
  const timeoutHappened = chosen === null && revealed;
  const isNetiVisible = revealed && (chosen !== mcq.correct);

  return (
    <motion.div
      key={mcqIdx}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Q label */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[11px] font-black uppercase tracking-widest" style={{ color }}>
          Question {mcqIdx + 1} of {concept.mcqs.length}
        </span>
        <div className="flex-1 flex gap-1">
          {concept.mcqs.map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full"
                 style={{ background: i <= mcqIdx ? color : 'var(--color-border)' }} />
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-5">
        <p className="text-[17px] font-bold leading-snug flex-1" style={{ fontFamily: 'var(--font-ui)', color: 'var(--color-on-surface)' }}>
          {mcq.question}
        </p>
        <div className="w-10 h-10 ml-3 rounded-full border-2 flex items-center justify-center font-bold relative shrink-0"
             style={{ borderColor: timeLeft <= 5 && !revealed ? '#DC2626' : 'var(--color-border)',
                      color: timeLeft <= 5 && !revealed ? '#DC2626' : 'var(--color-on-surface-variant)' }}>
          {timeLeft}
          {timeLeft <= 5 && !revealed && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 opacity-50"
              style={{ borderColor: '#DC2626' }}
              animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          )}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2.5 mb-5">
        {mcq.options.map((opt, i) => {
          const _isChosen  = isChosen(i);
          const isCorrect = i === mcq.correct;
          let border = 'var(--color-border)';
          let bg     = 'var(--color-surface-container-lowest)';
          let textColor = 'var(--color-on-surface)';

          if (revealed) {
            if (isCorrect)                  { border = 'var(--color-success)'; bg = 'var(--color-success-container)'; textColor = 'var(--color-success)'; }
            else if (_isChosen && !isCorrect){ border = 'var(--color-error)'; bg = 'var(--color-error-container)'; textColor = 'var(--color-error)'; }
            else if (timeoutHappened && !isCorrect) { /* Default styling for unchosen wrong */ }
          } else if (_isChosen) {
            border = 'var(--color-primary)'; bg = 'var(--color-primary-container)';
          }

          return (
            <button
              key={i}
              onClick={() => !revealed && handleChooseLocal(i)}
              disabled={revealed}
              className="w-full p-4 rounded-2xl text-left flex items-center gap-3 transition-all duration-150"
              style={{ border: _isChosen && !revealed ? `2px solid ${border}` : `1.5px solid ${border}`, background: bg }}
            >
              <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 text-[11px] font-black"
                   style={{ borderColor: revealed && isCorrect ? 'var(--color-success)' : revealed && _isChosen ? 'var(--color-error)' : _isChosen ? 'var(--color-primary)' : 'var(--color-border)',
                            color: revealed && isCorrect ? 'var(--color-success)' : revealed && _isChosen ? 'var(--color-error)' : _isChosen ? 'var(--color-primary)' : 'var(--color-on-surface-muted)' }}>
                {revealed && isCorrect
                  ? <CheckCircle2 size={13} />
                  : revealed && _isChosen && !isCorrect
                  ? <XCircle size={13} />
                  : String.fromCharCode(65 + i)}
              </div>
              <span className="text-[14px] leading-snug" style={{ fontFamily: 'var(--font-body)', color: textColor }}>
                {opt}
              </span>
            </button>
          );
        })}
      </div>

      {/* Neti Analysis */}
      <AnimatePresence>
        {isNetiVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto', x: [-10, 10, -8, 8, -5, 5, 0] }}
            transition={{ x: { duration: 0.4 }, opacity: { duration: 0.2 }, height: { duration: 0.2 } }}
            className="mb-5 overflow-hidden"
          >
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 shadow-sm">
              <h3 className="text-sm font-bold text-red-800 mb-1 flex items-center gap-2">
                <XCircle size={14} /> Neti Analysis — Distractor Tricked You!
              </h3>
              <p className="text-sm text-red-900 leading-relaxed font-medium mb-3">
                {timeoutHappened 
                  ? "Time ran out! Exam pressure forces faster recall."
                  : "Not this answer. This distractor was deliberately placed to test your pattern recognition."
                }
              </p>
              <div className="bg-white/60 p-3 rounded-xl border border-red-100 text-xs text-red-800 font-bold leading-relaxed">
                Real meaning:<br/>
                <span className="font-normal">{mcq.explanation}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explanation */}
      {revealed && !isNetiVisible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl mb-5"
          style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}
        >
          {chosen === mcq.correct ? (
            <>
              <h3 className="text-sm font-bold text-green-800 mb-1 flex items-center gap-2">
                <CheckCircle2 size={14} /> Correct!
              </h3>
              <p className="text-[12px] font-bold text-[#15803D] uppercase tracking-widest mb-1 mt-2">Explanation</p>
              <p className="text-[13px] text-[#166534] leading-relaxed mb-4" style={{ fontFamily: 'var(--font-body)' }}>
                {mcq.explanation}
              </p>

              {/* VEDIC GHANA PATHA: Bi-Directional Flip testing */}
              <div className="bg-white/60 p-4 rounded-xl border border-green-200 shadow-sm mt-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#0E7490] mb-2 flex items-center gap-1 opacity-80">
                  <Wind size={12}/> Bi-Directional Recall Check
                </p>
                <p className="text-[13px] font-bold text-[#1C1917] mb-3 leading-snug">
                  Which question does the answer "<span className="text-green-700">{mcq.options[mcq.correct]}</span>" belong to?
                </p>
                <div className="flex flex-col gap-2">
                  <button className="text-left text-[12px] p-3 bg-gray-50 border border-gray-200 rounded-lg opacity-50 grayscale flex items-center justify-between cursor-default">
                    <span className="truncate pr-2">An algorithm that recalculates every pair possible?</span>
                    <XCircle size={14} className="text-gray-400 shrink-0" />
                  </button>
                  <button className="text-left text-[12px] p-3 bg-green-100 border border-green-300 text-green-900 font-bold rounded-lg relative overflow-hidden flex items-center justify-between pointer-events-none">
                    <span className="relative z-10 pr-2">{mcq.question}</span>
                    <CheckCircle2 size={14} className="text-green-600 relative z-10 shrink-0" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-[12px] font-bold text-[#15803D] uppercase tracking-widest mb-1 mt-2">Explanation</p>
              <p className="text-[13px] text-[#166534] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                {mcq.explanation}
              </p>
            </>
          )}
        </motion.div>
      )}

      {/* Next button */}
      {revealed && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onNext}
          className="w-full py-4 font-bold text-[13px] uppercase tracking-widest flex items-center justify-center gap-2"
          style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)', borderRadius: 'var(--radius-m3-full)', fontFamily: 'var(--font-ui)' }}
        >
          {isLast ? 'Next Concept' : 'Next Question'} <ChevronRight size={16} />
        </motion.button>
      )}

      {/* Submit button */}
      {!revealed && chosen !== null && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onChoose(chosen)}
          className="w-full py-4 font-bold text-[13px] uppercase tracking-widest"
          style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)', borderRadius: 'var(--radius-m3-full)', fontFamily: 'var(--font-ui)' }}
        >
          Check Answer
        </motion.button>
      )}
    </motion.div>
  );
};

// ─── Streak / Done screen ──────────────────────────────────────────────────────

const DoneScreen = ({ correctCount, total, onRestart, setScreen }: {
  correctCount: number; total: number; onRestart: () => void; setScreen: (s: Screen) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
  >
    <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
         style={{ background: '#FFFBEB', border: '2px solid #FDE68A' }}>
      <Flame size={36} className="text-[#B45309]" />
    </div>
    <p className="text-[12px] uppercase tracking-[0.3em] font-bold mb-2" style={{ color: 'var(--color-on-surface-muted)' }}>Session complete</p>
    <h1 className="text-[52px] font-black leading-none mb-1" style={{ fontFamily: 'var(--font-ui)', color: 'var(--color-on-surface)' }}>
      {correctCount}<span className="text-[24px] font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>/{total}</span>
    </h1>
    <p className="text-[14px] mb-2" style={{ color: 'var(--color-on-surface-variant)' }}>correct answers</p>
    <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFFBEB] border border-[#FDE68A] mb-10">
      <Flame size={14} className="text-[#B45309]" />
      <span className="text-[13px] font-bold text-[#B45309]">Streak alive</span>
    </div>
    <div className="w-full space-y-3">
      <button
        onClick={onRestart}
        className="w-full py-4 font-bold text-[13px] uppercase tracking-widest"
        style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)', borderRadius: 'var(--radius-m3-full)', fontFamily: 'var(--font-ui)' }}
      >
        Restart Demo
      </button>
      <button
        onClick={() => setScreen('dashboard')}
        className="w-full py-4 rounded-2xl font-bold text-[13px] uppercase tracking-widest"
        style={{ background: 'var(--color-background)', color: 'var(--color-on-surface-variant)', fontFamily: 'var(--font-ui)' }}
      >
        Back to Home
      </button>
    </div>
  </motion.div>
);

// ─── Main component ────────────────────────────────────────────────────────────

export const DemoSession: React.FC<{ setScreen: (s: Screen) => void }> = ({ setScreen }) => {
  const [state, setState] = useState<SessionState>(loadState);
  const [chosen, setChosen]   = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const { conceptIndex, phase, mcqIndex } = state;
  const concept = DEMO_SESSION[conceptIndex];
  const isDone  = conceptIndex >= DEMO_SESSION.length;

  // Reset per-question UI when navigating
  useEffect(() => {
    setChosen(null);
    setRevealed(false);
  }, [conceptIndex, phase, mcqIndex]);

  const persist = (next: SessionState) => { setState(next); saveState(next); };

  const goFromPredict = () => persist({ ...state, phase: 'content' });
  const goFromContent = () => persist({ ...state, phase: 'feynman' });
  const goFromFeynman = () => persist({ ...state, phase: 'mcq', mcqIndex: 0 });
  const goFromMCQ     = () => persist({ ...state, phase: 'metacognition' });
  const goFromMeta    = () => {
    const completed = [...state.completed, concept.id];
    persist({ ...state, phase: 'pause', completed });
  };
  const goFromPause   = () => {
    persist({ ...state, conceptIndex: conceptIndex + 1, phase: 'predict', mcqIndex: 0 });
  };
  const goFromKosha   = () => persist({ ...state, phase: 'predict' });

  const handleChoose = (i: number | null) => {
    if (revealed) return;
    setChosen(i);
    setRevealed(true);
    const mcq      = concept.mcqs[mcqIndex];
    const isRight  = i === mcq.correct;
    const prevAns  = state.answers[concept.id]  ?? [];
    const prevCorr = state.correct[concept.id]  ?? [];
    persist({
      ...state,
      answers: { ...state.answers, [concept.id]: [...prevAns, i] },
      correct: { ...state.correct, [concept.id]: [...prevCorr, isRight] },
    });
  };

  const handleNext = () => {
    const isLastMCQ = mcqIndex >= concept.mcqs.length - 1;
    if (isLastMCQ) {
      goFromMCQ();
    } else {
      persist({ ...state, mcqIndex: mcqIndex + 1 });
    }
  };

  // Total correct across all concepts
  const totalCorrect = Object.values(state.correct).flat().filter(Boolean).length;
  const totalAnswered = Object.values(state.correct).flat().length;

  if (isDone) {
    return (
      <div className="pt-14 pb-28 px-4 max-w-md mx-auto min-h-screen">
        <DoneScreen
          correctCount={totalCorrect}
          total={totalAnswered}
          onRestart={() => persist(resetState())}
          setScreen={setScreen}
        />
      </div>
    );
  }

  // Progress
  const totalConcepts = DEMO_SESSION.length;
  const progressPct   = (conceptIndex / totalConcepts) * 100;

  return (
    <div className="pt-14 pb-28 px-4 max-w-md mx-auto min-h-screen">
      {/* Top bar */}
      <div className="flex items-center gap-3 mt-4 mb-4">
        <button
          onClick={() => setScreen('dashboard')}
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-white"
          style={{ border: '1px solid var(--color-border)' }}
        >
          <ChevronLeft size={18} className="text-[#6B7280]" />
        </button>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[12px] font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-ui)', color: 'var(--color-on-surface-variant)' }}>
              DSA Session
            </span>
            <span className="text-[12px] font-bold" style={{ fontFamily: 'var(--font-ui)', color: 'var(--color-on-surface-muted)' }}>
              {conceptIndex + 1} / {totalConcepts}
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--color-primary)' }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex gap-1.5 mb-6">
        {DEMO_SESSION.map((c, i) => (
          <div
            key={c.id}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{
              background: i < conceptIndex ? '#15803D' : i === conceptIndex ? 'var(--color-primary)' : 'var(--color-border)',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {phase === 'kosha' && (
          <KoshaCard key={`kosha`} onNext={goFromKosha} />
        )}
        {phase === 'predict' && (
          <PredictCard key={`predict-${conceptIndex}`} concept={concept} onNext={goFromPredict} />
        )}

        {phase === 'content' && (
          <ContentCard key={`content-${conceptIndex}`} concept={concept} onDone={goFromContent} />
        )}
        {phase === 'feynman' && (
          <FeynmanCard key={`feynman-${conceptIndex}`} concept={concept} onNext={goFromFeynman} />
        )}
        {phase === 'mcq' && (
          <MCQCard
            key={`mcq-${conceptIndex}-${mcqIndex}`}
            concept={concept}
            mcqIdx={mcqIndex}
            chosen={chosen}
            revealed={revealed}
            onChoose={handleChoose}
            onNext={handleNext}
            isLast={mcqIndex >= concept.mcqs.length - 1}
          />
        )}
        {phase === 'metacognition' && (
          <MetacogCard key={`meta-${conceptIndex}`} concept={concept} onNext={goFromMeta} />
        )}
        {phase === 'pause' && (
          <PauseCard key={`pause-${conceptIndex}`} onNext={goFromPause} />
        )}
      </AnimatePresence>
    </div>
  );
};
