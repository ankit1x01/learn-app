import React from 'react';
import { motion } from 'motion/react';
import { Zap, Timer, Shield, BarChart3, FileText, Moon, ChevronRight, Flame, Brain } from 'lucide-react';
import type { Screen } from '../types';

interface Props { setScreen: (s: Screen) => void; chittaScore: number; }

const INTERVIEW_DATE = new Date('2026-10-01');
const daysLeft = Math.ceil((INTERVIEW_DATE.getTime() - Date.now()) / 86400000);
const TOTAL_CONCEPTS = 454;

const MODES = [
  {
    id: 'ghana' as Screen,
    icon: Flame,
    title: 'Ghana Patha',
    subtitle: 'Stage 4 — Interview Ready Drill',
    desc: '15-second hard cutoff. No hints. Pure automatic pattern recall.',
    color: 'text-[#F59E0B]',
    bg: 'bg-[#F59E0B]/10',
    border: 'border-[#F59E0B]/20',
    badge: 'STAGE 4',
  },
  {
    id: 'stress' as Screen,
    icon: Zap,
    title: 'Stress Inoculation',
    subtitle: 'Interview Pressure Simulation',
    desc: 'Random timer. Auto-submit. Train pattern recall under cortisol.',
    color: 'text-[#B91C1C]',
    bg: 'bg-[#FEF2F2]',
    border: 'border-[#FECACA]',
    badge: 'PRESSURE',
  },
  {
    id: 'distractor' as Screen,
    icon: Shield,
    title: 'Trap Immunity',
    subtitle: 'Kill Off-By-One Thinking',
    desc: 'Identify WHY common DSA traps seem right. Kills Stage 2 illusions.',
    color: 'text-[#0E7490]',
    bg: 'bg-[#ECFEFF]',
    border: 'border-[#A5F3FC]',
    badge: 'IMMUNITY',
  },
  {
    id: 'errors' as Screen,
    icon: BarChart3,
    title: 'Error Clusters',
    subtitle: 'AI Pattern Analysis',
    desc: 'Your recurring mistake patterns. Targeted 20-min deep dives.',
    color: 'text-[#7C3AED]',
    bg: 'bg-[#F5F3FF]',
    border: 'border-[#F472B6]/20',
    badge: 'AI',
  },
  {
    id: 'mock' as Screen,
    icon: FileText,
    title: 'Mock Interview',
    subtitle: '10 Problems · 45 Min · FAANG Pattern',
    desc: 'Full interview loop simulation. Real time pressure. Error report after.',
    color: 'text-[#15803D]',
    bg: 'bg-[#F0FDF4]',
    border: 'border-[#BBF7D0]',
    badge: 'FAANG',
  },
  {
    id: 'preexam' as Screen,
    icon: Moon,
    title: 'Pre-Interview Protocol',
    subtitle: 'Final 30-Day System',
    desc: 'Pranayama + Ghana Patha + Mock. Zero new patterns. Pure retrieval.',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    badge: 'FINAL',
  },
  {
    id: 'course' as Screen,
    icon: Brain,
    title: 'How to Learn Anything',
    subtitle: '28-Day Cognitive Architecture Course',
    desc: 'Memory, retrieval, representation, feedback loops, compression. The science behind CHITTA.',
    color: 'text-[#7C3AED]',
    bg: 'bg-[#F5F3FF]',
    border: 'border-[#F472B6]/20',
    badge: 'COURSE',
  },
];

export const EliteHub: React.FC<Props> = ({ setScreen, chittaScore }) => (
  <div className="pt-16 pb-32 px-6 max-w-md mx-auto">
    <header className="mb-8">
      <div className="flex items-center gap-2 mb-1">
        <Flame size={14} className="text-[#F59E0B]" />
        <span className="text-[12px] uppercase tracking-[0.3em] text-[#6B7280] font-bold">Pro Mode</span>
      </div>
      <h1 className="text-4xl font-ui font-bold tracking-tight mb-1">
        FAANG <span className="text-[#F59E0B]">Ready</span>
      </h1>
      <p className="text-[#6B7280] text-xs font-label">
        {daysLeft} days to interview · {chittaScore} patterns automatic
      </p>
    </header>

    {/* Readiness bar */}
    <div className="card rounded-2xl p-4 mb-8 border border-[#F59E0B]/10">
      <div className="flex justify-between items-end mb-2">
        <span className="text-[12px] uppercase tracking-widest text-[#6B7280] font-bold">Interview Readiness</span>
        <span className="text-[12px] text-[#F59E0B] font-bold">{Math.round((chittaScore / TOTAL_CONCEPTS) * 100)}% automatic</span>
      </div>
      <div className="h-1.5 w-full bg-[#F0EEE9] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#F59E0B] to-[#F472B6] transition-all duration-700"
          style={{ width: `${Math.min((chittaScore / TOTAL_CONCEPTS) * 100, 100)}%` }}
        />
      </div>
      <p className="text-[12px] text-[#78716C] mt-2">
        Need {TOTAL_CONCEPTS} / {TOTAL_CONCEPTS} patterns at Stage 3+ for a clean FAANG loop
      </p>
    </div>

    {/* Mode cards */}
    <div className="space-y-3">
      {MODES.map((mode, i) => (
        <motion.button
          key={mode.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.07 }}
          onClick={() => setScreen(mode.id)}
          className={`w-full card rounded-2xl p-5 border ${mode.border} text-left flex items-center gap-4 active:scale-[0.98] transition-transform`}
        >
          <div className={`${mode.bg} p-3 rounded-xl shrink-0`}>
            <mode.icon size={20} className={mode.color} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-ui font-bold text-sm">{mode.title}</span>
              <span className={`px-1.5 py-0.5 rounded text-[12px] font-bold ${mode.bg} ${mode.color}`}>
                {mode.badge}
              </span>
            </div>
            <p className="text-[12px] text-[#6B7280] font-label uppercase tracking-widest mb-1">{mode.subtitle}</p>
            <p className="text-[11px] text-[#6B7280] leading-snug truncate">{mode.desc}</p>
          </div>
          <ChevronRight size={16} className="text-[#A8A29E] shrink-0" />
        </motion.button>
      ))}
    </div>

    <div className="mt-8 text-center">
      <p className="text-[12px] text-[#A8A29E] font-label uppercase tracking-widest">
        गुरुकुल · Ghana Patha Method · DSA Methodology
      </p>
    </div>
  </div>
);
