import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { CONFIG } from '../lib/config';
import type { Screen } from '../types';

interface Props { setScreen: (s: Screen) => void; }

type BreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2' | 'done';

const EXAM_DATE = CONFIG.examDate ? new Date(CONFIG.examDate) : new Date('2026-12-01');
const daysLeft = Math.max(0, Math.ceil((EXAM_DATE.getTime() - Date.now()) / 86400000));
const inFinal30 = daysLeft <= 30;

const DAILY_SCHEDULE = [
  { id: 'pranayama', icon: 'air',     title: 'Pranayama',    subtitle: '5 min · Box breathing', time: '5:55 AM', color: 'text-[#0E7490]',  bg: 'bg-[#ECFEFF]', screen: null as Screen | null },
  { id: 'recall',   icon: 'psychology',     title: 'Morning Recall', subtitle: '10 min · No notes',  time: '6:00 AM', color: 'text-primary',     bg: 'bg-primary/10',   screen: 'recall' as Screen },
  { id: 'ghana',    icon: 'local_fire_department',  title: 'Ghana Patha',  subtitle: '30 min · Stage 4 drill', time: '6:15 AM', color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10', screen: 'ghana' as Screen },
  { id: 'mock',     icon: 'description',  title: 'Mock Interview',  subtitle: '45 min · FAANG Loop', time: '10:00 AM', color: 'text-[#15803D]',   bg: 'bg-[#F0FDF4]',   screen: 'mock' as Screen },
  { id: 'errors',   icon: 'local_fire_department',     title: 'Error Review', subtitle: '1 hr · Fix clusters',   time: '2:00 PM', color: 'text-[#7C3AED]', bg: 'bg-[#F5F3FF]', screen: 'errors' as Screen },
  { id: 'seed',     icon: 'bedtime',      title: 'Night Seed',   subtitle: '5 min · Pre-sleep',     time: '9:55 PM', color: 'text-primary',    bg: 'bg-primary/10',   screen: null as Screen | null },
];

const AFFIRMATIONS = [
  { sanskrit: "अहम् ब्रह्मास्मि", english: "I am the unbounded intelligence" },
  { sanskrit: "तत् त्वम् असि", english: "That knowledge — thou art that" },
  { sanskrit: "प्रज्ञानम् ब्रह्म", english: "Pure consciousness is mastery" },
  { sanskrit: "सत्यम् शिवम् सुन्दरम्", english: "Truth. Clarity. Excellence." },
];

// Box breathing: 4 counts each
const BREATH_SEQUENCE: { phase: BreathPhase; label: string; duration: number; scale: number }[] = [
  { phase: 'inhale', label: 'Inhale',  duration: 4, scale: 1.4 },
  { phase: 'hold1',  label: 'Hold',    duration: 4, scale: 1.4 },
  { phase: 'exhale', label: 'Exhale',  duration: 4, scale: 0.7 },
  { phase: 'hold2',  label: 'Hold',    duration: 4, scale: 0.7 },
];
const TOTAL_ROUNDS = 4;

const PranayamaSession: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [round, setRound] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [count, setCount] = useState(BREATH_SEQUENCE[0].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!isRunning || finished) return;
    if (count <= 0) {
      const nextStep = (stepIdx + 1) % BREATH_SEQUENCE.length;
      if (nextStep === 0) {
        const nextRound = round + 1;
        if (nextRound >= TOTAL_ROUNDS) { setFinished(true); return; }
        setRound(nextRound);
      }
      setStepIdx(nextStep);
      setCount(BREATH_SEQUENCE[nextStep].duration);
      return;
    }
    const id = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(id);
  }, [count, isRunning, stepIdx, round, finished]);

  const step = BREATH_SEQUENCE[stepIdx];

  if (finished) return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="material-symbols-rounded text-[#15803D] mb-4" style={{ fontSize: 48 }}>check_circle</span>
      <h3 className="text-2xl font-ui font-bold mb-2">Complete</h3>
      <p className="text-[#6B7280] text-sm mb-6">4 rounds of box breathing done. Nervous system is calm.</p>
      <button onClick={onDone} className="px-8 py-4 bg-[#38BDF8] text-background rounded-2xl font-bold flex items-center gap-2">Continue <span className="material-symbols-rounded" style={{ fontSize: 16 }}>chevron_right</span></button>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <p className="text-[12px] uppercase tracking-[0.3em] text-[var(--color-on-surface-variant)] font-bold mb-8">
        Round {round + 1} of {TOTAL_ROUNDS} · Box Breathing 4-4-4-4
      </p>

      {/* Breathing circle */}
      <div className="relative w-56 h-56 flex items-center justify-center mb-8">
        <motion.div
          animate={{ scale: isRunning ? step.scale : 1 }}
          transition={{ duration: step.duration, ease: 'easeInOut' }}
          className="absolute w-40 h-40 rounded-full bg-[#ECFEFF] border border-[#A5F3FC]"
        />
        <motion.div
          animate={{ scale: isRunning ? step.scale * 0.85 : 0.85 }}
          transition={{ duration: step.duration, ease: 'easeInOut' }}
          className="absolute w-28 h-28 rounded-full bg-[#ECFEFF] border border-[#A5F3FC]"
        />
        <div className="z-10 text-center">
          <p className="text-4xl font-ui font-bold text-[#0E7490]">{isRunning ? count : '4'}</p>
          <p className="text-[11px] uppercase tracking-widest text-[#6B7280] mt-1">
            {isRunning ? step.label : 'Ready'}
          </p>
        </div>
      </div>

      {/* Phase indicators */}
      <div className="flex gap-2 mb-8">
        {BREATH_SEQUENCE.map((s, i) => (
          <div key={s.phase} className={`px-3 py-1 rounded-full text-[12px] font-bold uppercase transition-all ${
            isRunning && i === stepIdx ? 'bg-[#38BDF8] text-background' : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]'
          }`}>{s.label}</div>
        ))}
      </div>

      {!isRunning && (
        <button onClick={() => setIsRunning(true)}
          className="px-8 py-4 bg-[#38BDF8] text-background rounded-2xl font-ui font-bold tracking-widest">
          BEGIN PRANAYAMA
        </button>
      )}
    </div>
  );
};

export const PreExamProtocol: React.FC<Props> = ({ setScreen }) => {
  const [activeSection, setActiveSection] = useState<'schedule' | 'pranayama' | 'affirmations' | 'rules'>('schedule');
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const todayAffirmation = AFFIRMATIONS[new Date().getDay() % AFFIRMATIONS.length];

  const toggleDone = (id: string) => {
    setCompleted(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  return (
    <div className="pt-16 pb-32 px-6 max-w-md mx-auto">
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-rounded text-primary" style={{ fontSize: 14 }}>bedtime</span>
          <span className="text-[12px] uppercase tracking-[0.3em] text-[#6B7280] font-bold">Pre-Exam Protocol</span>
        </div>
        <h1 className="text-3xl font-ui font-bold mb-1">Final {inFinal30 ? daysLeft : 30} Days</h1>
        <p className={`text-xs font-label uppercase tracking-widest ${inFinal30 ? 'text-[#B91C1C]' : 'text-[#6B7280]'}`}>
          {daysLeft} days to interview · {inFinal30 ? 'PROTOCOL ACTIVE' : 'Protocol activates at 30 days'}
        </p>
      </header>

      {/* Section tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {(['schedule', 'pranayama', 'affirmations', 'rules'] as const).map(s => (
          <button key={s} onClick={() => setActiveSection(s)}
            className={`px-4 py-2 rounded-full text-[12px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
              activeSection === s ? 'bg-primary text-background' : 'bg-[var(--color-surface-container)] text-[#6B7280]'
            }`}>
            {s}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeSection === 'schedule' && (
          <motion.div key="schedule" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="text-[12px] uppercase tracking-widest text-[var(--color-on-surface-variant)] font-bold mb-4 px-1">Today's Protocol</p>
            <div className="space-y-3">
              {DAILY_SCHEDULE.map((item) => (
                <div key={item.id} className={`card rounded-2xl p-4 flex items-center gap-4 border ${
                  completed.has(item.id) ? 'border-[#BBF7D0] opacity-60' : 'border-[var(--color-border)]'
                }`}>
                  <div className={`${item.bg} p-3 rounded-xl shrink-0`}>
                    <span className={`material-symbols-rounded ${item.color}`} style={{ fontSize: 18 }}>{item.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-[12px] text-[#6B7280] font-label">{item.time} · {item.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.screen && (
                      <button onClick={() => setScreen(item.screen!)}
                        className={`p-2 rounded-lg ${item.bg} ${item.color} text-[12px] font-bold`}>
                        <span className="material-symbols-rounded" style={{ fontSize: 12 }}>arrow_forward</span>
                      </button>
                    )}
                    <button onClick={() => toggleDone(item.id)}>
                      {completed.has(item.id)
                        ? <span className="material-symbols-rounded text-[#15803D]" style={{ fontSize: 20 }}>check_circle</span>
                        : <span className="material-symbols-rounded text-[var(--color-border)]" style={{ fontSize: 20 }}>radio_button_unchecked</span>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-2xl bg-[var(--color-surface-container)] border border-[var(--color-border)] text-center">
              <p className="text-[12px] uppercase tracking-widest text-[var(--color-on-surface-variant)] font-bold mb-1">Today's Progress</p>
              <p className="text-2xl font-ui font-bold">{completed.size}/{DAILY_SCHEDULE.length}</p>
              <div className="h-1 w-full bg-[var(--color-surface-container)] rounded-full overflow-hidden mt-2">
                <div className="h-full bg-[#15803D] transition-all" style={{ width: `${(completed.size / DAILY_SCHEDULE.length) * 100}%` }} />
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === 'pranayama' && (
          <motion.div key="pranayama" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="card rounded-2xl p-6 border border-[#A5F3FC]">
              <p className="text-[12px] uppercase tracking-widest text-[#0E7490] font-bold mb-1">Pranayama — Box Breathing</p>
              <p className="text-sm text-[#6B7280] mb-6">
                4-4-4-4 pattern. Activates parasympathetic system. Reduces cortisol before study session. Used by Navy SEALs before high-performance operations.
              </p>
              <PranayamaSession onDone={() => { toggleDone('pranayama'); setActiveSection('schedule'); }} />
            </div>
          </motion.div>
        )}

        {activeSection === 'affirmations' && (
          <motion.div key="affirmations" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="space-y-4">
              <div className="card rounded-3xl p-8 border border-primary/10 text-center">
                <p className="text-[12px] uppercase tracking-[0.3em] text-primary/40 font-bold mb-4">Today's Sankalpa</p>
                <p className="text-3xl font-ui font-bold text-primary mb-3">{todayAffirmation.sanskrit}</p>
                <p className="text-[#6B7280] italic mb-6">"{todayAffirmation.english}"</p>
                <p className="text-[12px] text-[var(--color-border)]">Repeat 3 times before your session begins</p>
              </div>
              <div className="card rounded-2xl p-5 border border-[var(--color-border)]">
                <p className="text-[12px] uppercase tracking-widest text-[var(--color-on-surface-variant)] font-bold mb-3">Ahamkara Programming</p>
                <div className="space-y-3">
                  {[
                    { time: "Morning", text: "I am a pattern-extractor. I see what others miss." },
                    { time: "Before session", text: "I study as worship. This knowledge serves all." },
                    { time: "During struggle", text: "Struggle is the signal of my neural rewiring." },
                    { time: "After session", text: "This is now part of my chitta." },
                  ].map(a => (
                    <div key={a.time} className="flex gap-3">
                      <span className="text-[12px] text-[var(--color-border)] font-bold uppercase tracking-normal w-16 shrink-0 pt-0.5">{a.time}</span>
                      <p className="text-sm text-[#6B7280] leading-relaxed italic">"{a.text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === 'rules' && (
          <motion.div key="rules" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="space-y-3">
              <p className="text-[12px] uppercase tracking-widest text-[var(--color-on-surface-variant)] font-bold px-1 mb-4">30-Day Rules</p>
              {[
                { rule: "Zero new concepts", why: "All 454 patterns are already seeded. New input = cognitive overload now." },
                { rule: "Mock interview every day", why: "Stress inoculation. Interview state must feel normal." },
                { rule: "Ghana Patha first thing", why: "Morning is when chitta is closest to surface. Use it." },
                { rule: "Sleep 8 hours — non-negotiable", why: "Hippocampus consolidates during sleep. No sleep = memories don't stick." },
                { rule: "No social media before 10 AM", why: "Dopamine spike from scrolling kills the low-arousal state needed for deep recall." },
                { rule: "Fix errors same day", why: "Errors from today's mock = tomorrow's first review. Never carry them over." },
                { rule: "Eat light before exam simulation", why: "Heavy food triggers parasympathetic dominance — brain slows down." },
                { rule: "Lock interview sleep schedule now", why: "Your peak alertness must align with the interview slot. Sleep by 10 PM, wake by 6 AM." },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="card rounded-2xl p-4 border border-[var(--color-border)]">
                  <p className="font-bold text-sm mb-1">{i + 1}. {item.rule}</p>
                  <p className="text-[11px] text-[#6B7280] leading-relaxed">{item.why}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
