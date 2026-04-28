import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';


import { Screen } from '../types';
import { Concept } from '../core/types';
import { CONFIG, subjectColor, subjectBg } from '../lib/config';

interface Props { setScreen: (s: Screen) => void; concepts: Concept[]; }

type Rating = 'clean' | 'hint' | 'stuck' | null;

interface InterviewProblem {
  concept: Concept;
  round: number;  // 1–5
}

const TOTAL_INTERVIEW_TIME = 45 * 60; // 45 minutes
const PROBLEMS_PER_MOCK = 10;

const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

const buildPaper = (concepts: Concept[]): InterviewProblem[] => {
  const SUBJECT_ORDER: string[] = CONFIG.subjects.map(s => s.name);
  const problems: InterviewProblem[] = [];

  SUBJECT_ORDER.forEach((subject, roundIdx) => {
    const pool = concepts
      .filter(c => c.subject === subject && c.pyqTier <= 2)
      .sort((a, b) => a.pyqTier - b.pyqTier || b.difficulty - a.difficulty);

    const picks = pool.length >= 2 ? pool.slice(0, 2) : pool;
    picks.forEach(c => {
      problems.push({ concept: c, round: roundIdx + 1 });
    });
  });

  // If fewer than 10 problems, fill from any remaining tier-1/2 concepts
  if (problems.length < PROBLEMS_PER_MOCK) {
    const used = new Set(problems.map(p => p.concept.id));
    const fillers = concepts
      .filter(c => !used.has(c.id) && c.pyqTier <= 2)
      .sort((a, b) => a.pyqTier - b.pyqTier)
      .slice(0, PROBLEMS_PER_MOCK - problems.length);
    fillers.forEach(c => problems.push({ concept: c, round: 5 }));
  }

  return problems.slice(0, PROBLEMS_PER_MOCK);
};

const RATING_OPTIONS = [
  { id: 'clean' as const, label: 'Solved clean',    sub: 'Optimal approach, no hints needed',      color: 'text-[#15803D]',   border: 'border-[#BBF7D0]',   bg: 'bg-[#F0FDF4]'   },
  { id: 'hint'  as const, label: 'Needed a hint',   sub: 'Right direction, but required prompting', color: 'text-[#B45309]',  border: 'border-tertiary/30',  bg: 'bg-[#FFFBEB]'  },
  { id: 'stuck' as const, label: 'Got stuck',       sub: "Couldn't arrive at a working solution",   color: 'text-[#B91C1C]',     border: 'border-[#FECACA]',     bg: 'bg-[#FEF2F2]'     },
];

export const MockTest: React.FC<Props> = ({ setScreen, concepts }) => {
  const [started, setStarted]   = useState(false);
  const [paper]                 = useState(() => buildPaper(concepts));
  const [current, setCurrent]   = useState(0);
  const [ratings, setRatings]   = useState<Record<number, Rating>>({});
  const [flagged, setFlagged]   = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(TOTAL_INTERVIEW_TIME);
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState<Rating>(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!started || submitted) return;
    const id = setInterval(() => setTimeLeft(t => {
      if (t <= 1) { setSubmitted(true); return 0; }
      return t - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [started, submitted]);

  const submit = useCallback(() => setSubmitted(true), []);

  const handleRate = () => {
    if (!selected) return;
    setRatings(r => ({ ...r, [current]: selected }));
    setConfirmed(true);
  };

  const goNext = () => {
    setSelected(null);
    setConfirmed(false);
    if (current < paper.length - 1) setCurrent(c => c + 1);
    else submit();
  };

  if (!started) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center pb-32">
      <div className="w-24 h-24 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center mb-6">
        <span className="material-symbols-rounded text-[#15803D]" style={{ fontSize: 36 }}>description</span>
      </div>
      <h1 className="text-3xl font-ui font-bold mb-2">Mock Interview</h1>
      <p className="text-[#6B7280] text-sm mb-1">{PROBLEMS_PER_MOCK} Problems · 45 Minutes · Final Interview</p>
      <p className="text-[var(--color-on-surface-variant)] text-[11px] mb-8">
        Full Syllabus Integration · High Stakes · Self-rated
      </p>
      <div className="space-y-2 text-left w-full max-w-xs mb-8">
        {[
          "No hints shown. No chapter labels visible.",
          "Timer counts down from 45:00.",
          "Rate each problem: Clean / Hint / Stuck.",
          "Flag problems to review after.",
          "Submit anytime or auto-submit at 0:00.",
        ].map((rule, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#15803D] mt-1.5 shrink-0" />
            <p className="text-sm text-[#6B7280]">{rule}</p>
          </div>
        ))}
      </div>
      {paper.length === 0 ? (
        <p className="text-[#6B7280] text-sm mb-4">No Tier-1/2 concepts loaded. Start a study session first.</p>
      ) : (
        <button onClick={() => setStarted(true)}
          className="w-full max-w-xs py-5 bg-[#15803D] text-background rounded-2xl font-ui font-bold tracking-widest text-sm">
          START INTERVIEW
        </button>
      )}
      <button onClick={() => setScreen('elite')} className="mt-3 text-[11px] text-[var(--color-on-surface-variant)] font-label flex items-center gap-1"><span className="material-symbols-rounded" style={{ fontSize: 12 }}>arrow_back</span> Back to Hub</button>
    </div>
  );

  if (submitted) {
    const cleaned = Object.values(ratings).filter(r => r === 'clean').length;
    const hinted  = Object.values(ratings).filter(r => r === 'hint').length;
    const stuck   = Object.values(ratings).filter(r => r === 'stuck').length;
    const score   = cleaned * 1 + hinted * 0.5;
    const maxScore = paper.length;
    const pct = Math.round((score / maxScore) * 100);

    const bySubject: Record<string, { clean: number; hint: number; stuck: number; total: number }> = {};
    paper.forEach((p, i) => {
      const sub = p.concept.subject;
      if (!bySubject[sub]) bySubject[sub] = { clean: 0, hint: 0, stuck: 0, total: 0 };
      bySubject[sub].total++;
      const r = ratings[i];
      if (r === 'clean') bySubject[sub].clean++;
      else if (r === 'hint') bySubject[sub].hint++;
      else bySubject[sub].stuck++;
    });

    return (
      <div className="pt-16 pb-32 px-6 max-w-md mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-ui font-bold mb-1">
            {cleaned}<span className="text-xl text-[#6B7280]">/{maxScore}</span>
          </h1>
          <p className="text-[#6B7280] text-sm">{cleaned} clean · {hinted} hinted · {stuck} stuck</p>
          <p className="text-[11px] text-[var(--color-on-surface-variant)] mt-1">
            {cleaned >= 8 ? "Strong loop — Production ready" : cleaned >= 6 ? "Good — tighten weak areas" : cleaned >= 4 ? "Building momentum" : "More drilling needed"}
          </p>
        </header>

        {/* Score ring */}
        <div className="flex justify-center mb-8">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
              <circle cx="50" cy="50" r="44" fill="none"
                stroke={pct >= 80 ? '#22C55E' : pct >= 60 ? '#F59E0B' : '#EF4444'}
                strokeWidth="6" strokeDasharray="276" strokeLinecap="round"
                strokeDashoffset={276 * (1 - pct / 100)} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-ui font-bold">{pct}%</span>
              <span className="text-[12px] text-[#6B7280] uppercase tracking-normal">of max</span>
            </div>
          </div>
        </div>

        {/* Per-subject breakdown */}
        <div className="space-y-3 mb-8">
          {Object.entries(bySubject).map(([sub, data]) => {
            const cleanPct = Math.round((data.clean / data.total) * 100);
            return (
              <div key={sub} className="card p-4 rounded-2xl">
                <div className="flex justify-between items-end mb-2">
                  <span className={`text-sm font-medium ${subjectColor(sub)}`}>{sub}</span>
                  <span className="text-xs text-[#6B7280]">{data.clean} clean / {data.total}</span>
                </div>
                <div className="h-1.5 w-full bg-[var(--color-surface-container)] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${subjectBg(sub).replace('/10', '')} transition-all duration-700`}
                    style={{ width: `${cleanPct}%` }}
                  />
                </div>
                <p className="text-[12px] text-[var(--color-on-surface-variant)] mt-1">{cleanPct}% clean solve rate</p>
              </div>
            );
          })}
        </div>

        {/* Problem list */}
        <div className="space-y-2 mb-8">
          <p className="text-[12px] uppercase tracking-widest text-[var(--color-on-surface-variant)] font-bold px-1">Problem Breakdown</p>
          {paper.map((p, i) => {
            const r = ratings[i];
            return (
              <div key={i} className="flex items-center gap-3 px-2 py-2">
                <span className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[12px] font-bold ${
                  r === 'clean' ? 'bg-[#F0FDF4] text-[#15803D]' :
                  r === 'hint' ? 'bg-[#FFFBEB] text-[#B45309]' :
                  flagged.has(i) ? 'bg-[#FEF2F2] text-[#B91C1C]' : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]'
                }`}>{i + 1}</span>
                <span className="text-sm text-[#374151] flex-1 truncate">{p.concept.name}</span>
                <span className={`text-[12px] font-bold uppercase ${
                  r === 'clean' ? 'text-[#15803D]' : r === 'hint' ? 'text-[#B45309]' : 'text-[#B91C1C]'
                }`}>{r ?? '—'}</span>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button onClick={() => setScreen('errors')}
            className="flex-1 py-4 rounded-xl bg-[#F5F3FF] border border-[#F472B6]/20 text-[#7C3AED] font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="material-symbols-rounded" style={{ fontSize: 14 }}>bar_chart</span> Error Analysis
          </button>
          <button onClick={() => setScreen('elite')}
            className="flex-1 py-4 rounded-xl bg-[var(--color-surface-container)] font-bold text-[11px] uppercase tracking-widest">
            <span className="material-symbols-rounded" style={{ fontSize: 16 }}>arrow_back</span> Hub
          </button>
        </div>
      </div>
    );
  }

  const problem = paper[current];
  if (!problem) return null;
  const isFlagged = flagged.has(current);
  const urgentTime = timeLeft < 300;

  return (
    <div className="pt-16 pb-32 px-6 max-w-md mx-auto min-h-screen flex flex-col">
      {/* Interview header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`material-symbols-rounded ${urgentTime ? 'text-[#B91C1C]' : 'text-[#6B7280]'}`} style={{ fontSize: 14 }}>schedule</span>
          <span className={`font-ui font-bold text-lg ${urgentTime ? 'text-[#B91C1C] animate-pulse' : ''}`}>{fmt(timeLeft)}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFlagged(f => { const n = new Set(f); n.has(current) ? n.delete(current) : n.add(current); return n; })}
            className={`p-2 rounded-lg transition-all ${isFlagged ? 'bg-[#FFFBEB] text-[#B45309]' : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]'}`}>
            <span className="material-symbols-rounded" style={{ fontSize: 14 }}>flag</span>
          </button>
          <span className="px-3 py-1.5 rounded-lg bg-[var(--color-surface-container)] text-[12px] font-bold uppercase tracking-widest">
            {current + 1}/{paper.length}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="h-0.5 w-full bg-[var(--color-surface-container)] rounded-full overflow-hidden mb-6">
        <div className="h-full bg-[#15803D] transition-all" style={{ width: `${(Object.keys(ratings).length / paper.length) * 100}%` }} />
      </div>

      {/* Round + subject */}
      <div className="flex gap-2 mb-3">
        <span className="px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-widest bg-[var(--color-surface-container)] text-[#6B7280]">
          Round {problem.round}
        </span>
      </div>

      {/* Problem name — no chapter/subject label shown (interview conditions) */}
      <h2 className="text-2xl font-ui font-bold leading-tight mb-4 flex-1">
        {problem.concept.name}
      </h2>

      {/* Recall prompt */}
      <div className="flex items-start gap-2 mb-10 p-4 rounded-2xl bg-[var(--color-surface-container)] border border-[var(--color-border)]">
        <span className="material-symbols-rounded text-primary mt-0.5 shrink-0" style={{ fontSize: 14 }}>psychology</span>
        <p className="text-sm text-[#6B7280] leading-relaxed">
          Code a working solution. Aim for the optimal approach. State your time and space complexity before submitting.
        </p>
      </div>

      {/* Rating */}
      {!confirmed ? (
        <div className="space-y-3">
          <p className="text-[12px] uppercase tracking-widest text-[var(--color-on-surface-variant)] font-bold mb-2 px-1">Rate your solution</p>
          {RATING_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className={`w-full p-4 rounded-xl text-left border transition-all ${
                selected === opt.id ? `${opt.bg} ${opt.border}` : 'bg-[var(--color-surface-container)] border-[var(--color-border)] hover:bg-[var(--color-surface-container)]'
              }`}
            >
              <div className={`font-bold text-sm ${selected === opt.id ? opt.color : ''}`}>{opt.label}</div>
              <div className="text-[11px] text-[#6B7280] mt-0.5">{opt.sub}</div>
            </button>
          ))}
          <button
            onClick={handleRate}
            className={`w-full mt-2 py-4 rounded-2xl font-ui font-bold tracking-widest text-sm transition-all ${
              selected ? 'bg-primary text-background' : 'bg-[var(--color-surface-container)] text-[var(--color-border)] cursor-not-allowed'
            }`}
          >
            CONFIRM RATING
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className={`flex items-center gap-3 p-4 rounded-2xl ${
            ratings[current] === 'clean' ? 'bg-[#F0FDF4] border border-[#BBF7D0]' :
            ratings[current] === 'hint' ? 'bg-[#FFFBEB] border border-tertiary/20' :
            'bg-[#FEF2F2] border border-[#FECACA]'
          }`}>
            {ratings[current] === 'clean'
              ? <span className="material-symbols-rounded text-[#15803D]" style={{ fontSize: 20 }}>check_circle</span>
              : <span className={`material-symbols-rounded ${ratings[current] === 'hint' ? 'text-[#B45309]' : 'text-[#B91C1C]'}`} style={{ fontSize: 20 }}>bolt</span>}
            <div>
              <p className={`font-bold text-sm ${
                ratings[current] === 'clean' ? 'text-[#15803D]' :
                ratings[current] === 'hint' ? 'text-[#B45309]' : 'text-[#B91C1C]'
              }`}>
                {ratings[current] === 'clean' ? 'Solved clean' : ratings[current] === 'hint' ? 'Needed a hint' : 'Got stuck'}
              </p>
              <p className="text-[12px] text-[#6B7280]">
                {problem.concept.subject} · {problem.concept.chapter}
              </p>
            </div>
          </div>
          <button
            onClick={goNext}
            className="w-full py-4 bg-primary text-background rounded-2xl font-ui font-bold tracking-widest text-sm"
          >
            {current < paper.length - 1 ? <div className="flex items-center justify-center gap-2">NEXT PROBLEM <span className="material-symbols-rounded" style={{ fontSize: 16 }}>chevron_right</span></div> : 'SUBMIT INTERVIEW'}
          </button>
        </motion.div>
      )}
    </div>
  );
};
