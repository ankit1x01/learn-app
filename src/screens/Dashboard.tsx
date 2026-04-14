import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CONFIG, examReadiness, totalConcepts, totalExamQ, subjectBar } from '../lib/config';
import type { Screen } from '../types';
import type { SessionItem, SubjectStats } from '../core/types';
import { getTimeOfDayNudge } from '../core/scheduler';
import { loadCourseProgress } from '../db/store';
import { COURSE_LESSONS } from '../data/course/lessons';
import {
  Flame,
  Clock,
  TrendingUp,
  ChevronRight,
  Play,
  BookOpen,
  Target,
  Brain,
  Layers,
  BarChart2,
  Link2,
  GitBranch,
  Zap,
  GraduationCap,
  Gamepad2,
} from 'lucide-react';

const SUBJECT_ICONS: Record<string, React.ElementType> = {
  'Foundations':               Layers,
  'Arrays & Search':           BarChart2,
  'Strings & Data Structures': Link2,
  'Trees & Graphs':            GitBranch,
  'DP & Greedy':               Zap,
};

const JKS = "'Plus Jakarta Sans', system-ui, sans-serif";

export const Dashboard = ({
  setScreen,
  session,
  onSubjectClick,
  onStartSession,
  globalStats,
}: {
  setScreen: (s: Screen) => void;
  session: SessionItem[];
  onSubjectClick: (s: string) => void;
  onStartSession: () => void;
  globalStats: Record<string, SubjectStats>;
}) => {
  const stats = globalStats;
  const [courseCompleted, setCourseCompleted] = useState(0);

  useEffect(() => {
    loadCourseProgress().then(map => setCourseCompleted(map.size));
  }, []);
  const totalAutomatic = Object.values(stats).reduce((sum, s) => sum + s.auto, 0);
  const totalConscious = Object.values(stats).reduce((sum, s) => sum + s.conscious, 0);
  const totalFading    = Object.values(stats).reduce((sum, s) => sum + s.fragile, 0);

  const subjectReadiness = CONFIG.subjects.map(sub => ({
    ...sub,
    stats: stats[sub.name] ?? { auto: 0, conscious: 0, fragile: 0, unseen: sub.totalConcepts },
    ready: examReadiness(
      stats[sub.name] ?? { auto: 0, conscious: 0, fragile: 0, unseen: sub.totalConcepts },
      sub.totalConcepts,
      sub.examQuestions
    ),
  }));
  const totalReady = subjectReadiness.reduce((s, x) => s + x.ready, 0);

  // SVG ring math
  const R = 44;
  const C = 2 * Math.PI * R;
  const autoFill  = totalConcepts > 0 ? (totalAutomatic / totalConcepts) * C : 0;
  const conscFill = totalConcepts > 0 ? ((totalAutomatic + totalConscious) / totalConcepts) * C : 0;

  const hour = new Date().getHours();
  const nudge = getTimeOfDayNudge(hour);
  const isMorning = hour >= 6 && hour < 12;

  return (
    <div className="pt-14 pb-28 px-4 max-w-md mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center justify-between pt-5 pb-4">
        <div>
          <p className="text-[12px] text-[#A8A29E] font-medium mb-0.5" style={{ fontFamily: JKS }}>
            Welcome back
          </p>
          <h1 className="text-[22px] font-bold text-[#1C1917] leading-tight" style={{ fontFamily: JKS }}>
            नमस्ते, {CONFIG.studentName}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="streak-badge">
            <Flame size={12} />
            <span>7 day</span>
          </div>
          <div
            className="rounded-full px-3 py-1.5 flex items-center gap-1.5 bg-[#EFF6FF] border border-[#BFDBFE]"
          >
            <Clock size={11} className="text-[#2563EB]" />
            <span className="text-[12px] font-bold text-[#2563EB]" style={{ fontFamily: JKS }}>
              {CONFIG.daysRemaining ?? '—'}d
            </span>
          </div>
        </div>
      </div>

      {/* ── 3 Stat Pills ── */}
      <div className="flex gap-2.5 mb-4">
        {[
          { label: 'Mastered',  value: totalAutomatic, color: '#15803D', bg: '#F0FDF4', border: '#BBF7D0' },
          { label: 'Learning',  value: totalConscious, color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
          { label: 'Fading',    value: totalFading,    color: '#B45309', bg: '#FFFBEB', border: '#FDE68A' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.2 }}
            className="flex-1 rounded-xl p-3 text-center"
            style={{ background: s.bg, border: `1px solid ${s.border}` }}
          >
            <span className="text-[24px] font-bold block tabular-nums" style={{ color: s.color, fontFamily: JKS }}>{s.value}</span>
            <span className="text-[12px] font-medium" style={{ color: s.color, fontFamily: JKS, opacity: 0.8 }}>{s.label}</span>
          </motion.div>
        ))}
      </div>

      {/* ── Mastery Ring Card ── */}
      <div className="card p-5 mb-4">
        <div className="flex items-center gap-5">
          {/* Ring */}
          <div className="relative shrink-0" style={{ width: 110, height: 110 }}>
            <svg width="110" height="110" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
              {/* Track */}
              <circle cx="50" cy="50" r={R} fill="none" stroke="#E8E5DF" strokeWidth="7" />
              {/* Conscious fill (blue) */}
              <circle cx="50" cy="50" r={R} fill="none" stroke="#BFDBFE" strokeWidth="7"
                strokeDasharray={`${conscFill} ${C}`} strokeLinecap="round" />
              {/* Auto fill (green) */}
              <circle cx="50" cy="50" r={R} fill="none" stroke="#15803D" strokeWidth="7"
                strokeDasharray={`${autoFill} ${C}`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[28px] font-bold text-[#1C1917] tabular-nums leading-none" style={{ fontFamily: JKS }}>
                {totalAutomatic}
              </span>
              <span className="text-[11px] text-[#A8A29E] font-medium leading-none mt-0.5">
                / {totalConcepts}
              </span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="flex-1 space-y-3">
            <p className="text-[12px] font-semibold text-[#78716C]" style={{ fontFamily: JKS }}>
              Mastery Breakdown
            </p>
            {[
              { label: 'Mastered',  value: totalAutomatic, pct: Math.round((totalAutomatic / totalConcepts) * 100), color: '#15803D', track: '#BBF7D0' },
              { label: 'Learning',  value: totalConscious, pct: Math.round((totalConscious / totalConcepts) * 100),  color: '#2563EB', track: '#BFDBFE' },
              { label: 'Fading',    value: totalFading,    pct: Math.round((totalFading / totalConcepts) * 100),     color: '#B45309', track: '#FDE68A' },
            ].map(s => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-medium text-[#78716C]">{s.label}</span>
                  <span className="text-[13px] font-bold tabular-nums" style={{ color: s.color, fontFamily: JKS }}>
                    {s.value}
                  </span>
                </div>
                <div className="h-[5px] w-full rounded-full overflow-hidden" style={{ background: s.track }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${s.pct}%`, background: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Exam Readiness Card ── */}
      <div className="card p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#F0FDF4]">
            <TrendingUp size={15} className="text-[#15803D]" />
          </div>
          <span className="text-[13px] font-semibold text-[#78716C]" style={{ fontFamily: JKS }}>
            Exam Readiness
          </span>
          <span className="ml-auto text-[12px] text-[#A8A29E]">/ {totalExamQ} Qs</span>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-[44px] font-bold text-[#15803D] tabular-nums leading-none" style={{ fontFamily: JKS }}>
            {totalReady}
          </span>
          <div>
            <span className="text-[14px] text-[#78716C]">estimated correct</span>
            <br />
            <span className="text-[12px] text-[#A8A29E]">Target: {CONFIG.examScoreTarget}+</span>
          </div>
        </div>

        <div className="flex gap-2">
          {subjectReadiness.map(s => (
            <div
              key={s.name}
              className="flex-1 text-center py-2.5 rounded-xl border border-[#E8E5DF] bg-[#F7F6F3]"
            >
              <div className="text-[20px] mb-1">{s.emoji}</div>
              <div className="text-[16px] font-bold text-[#1C1917] tabular-nums" style={{ fontFamily: JKS }}>{s.ready}</div>
              <div className="text-[11px] text-[#A8A29E]">/{s.examQuestions}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Time-of-Day Nudge ── */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl mb-4"
        style={{
          background: isMorning ? '#F0FDF4' : '#EFF6FF',
          border: `1px solid ${isMorning ? '#BBF7D0' : '#BFDBFE'}`,
        }}
      >
        <Clock size={14} style={{ color: isMorning ? '#15803D' : '#2563EB', flexShrink: 0 }} />
        <p className="text-[13px] font-medium font-reading" style={{ color: isMorning ? '#166534' : '#1D4ED8' }}>
          <span className="font-bold">Right now:</span> best for {nudge}
        </p>
      </div>

      {/* ── Start Session Card ── */}
      <div className="card p-5 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-[17px] font-bold text-[#1C1917]" style={{ fontFamily: JKS }}>
              Today's Session
            </h3>
            <p className="text-[13px] text-[#78716C] mt-0.5">{session.length} patterns queued</p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#EFF6FF]">
            <Target size={18} className="text-[#2563EB]" />
          </div>
        </div>

        {/* Session composition bar */}
        <div className="h-2 w-full rounded-full overflow-hidden flex mb-2" style={{ background: '#E8E5DF' }}>
          <div style={{ width: `${CONFIG.sessionComposition.review * 100}%`,    background: '#B91C1C' }} className="h-full" />
          <div style={{ width: `${CONFIG.sessionComposition.new * 100}%`,       background: '#2563EB' }} className="h-full" />
          <div style={{ width: `${CONFIG.sessionComposition.strengthen * 100}%`,background: '#15803D' }} className="h-full rounded-r-full" />
        </div>
        <div className="flex gap-4 mb-5">
          {[
            { label: 'Review',    pct: CONFIG.sessionComposition.review,    color: '#B91C1C' },
            { label: 'New',       pct: CONFIG.sessionComposition.new,       color: '#2563EB' },
            { label: 'Strengthen',pct: CONFIG.sessionComposition.strengthen,color: '#15803D' },
          ].map(q => (
            <div key={q.label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: q.color }} />
              <span className="text-[12px] font-medium text-[#78716C]" style={{ fontFamily: JKS }}>
                {q.label} {Math.round(q.pct * 100)}%
              </span>
            </div>
          ))}
        </div>

        <button onClick={onStartSession} className="btn-primary">
          <Play size={17} fill="currentColor" />
          Start Session
        </button>
      </div>

      {/* ── Demo Session Banner ── */}
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setScreen('demo-session')}
        className="w-full card rounded-2xl p-4 mb-4 flex items-center gap-4 text-left"
        style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}
      >
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#2563EB] shrink-0">
          <Play size={22} fill="white" className="text-white ml-0.5" />
        </div>
        <div className="flex-1">
          <p className="text-[15px] font-bold text-[#1D4ED8] mb-0.5" style={{ fontFamily: JKS }}>
            DSA Demo Session
          </p>
          <p className="text-[12px] text-[#3B82F6]">
            5 concepts · infographics + MCQs · resumes where you left off
          </p>
        </div>
        <ChevronRight size={18} className="text-[#3B82F6] shrink-0" />
      </motion.button>

      {/* ── Daily Games ── */}
      <button
        onClick={() => setScreen('games')}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-white border border-[#E8E5DF] rounded-2xl mb-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
            <Gamepad2 size={20} className="text-[#2563EB]" />
          </div>
          <div className="text-left">
            <p className="text-[15px] font-semibold text-[#1C1917]" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>Daily Games</p>
            <p className="text-[12px] text-[#78716C]">DSA · 4 games today</p>
          </div>
        </div>
        <ChevronRight size={16} className="text-[#A8A29E]" />
      </button>

      {/* ── Courses ── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-[13px] font-semibold text-[#78716C]" style={{ fontFamily: JKS }}>
            My Courses
          </p>
          <GraduationCap size={14} className="text-[#A8A29E]" />
        </div>

        <div className="space-y-2.5">
          {/* How to Learn Anything */}
          <motion.button
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            onClick={() => setScreen('course')}
            className="w-full card rounded-2xl p-4 text-left flex items-center gap-3"
            style={{ border: '1px solid #BFDBFE' }}
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#EFF6FF] shrink-0">
              <Brain size={20} className="text-[#2563EB]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-[#1C1917] mb-0.5" style={{ fontFamily: JKS }}>
                How to Learn Anything
              </p>
              <p className="text-[12px] text-[#78716C] mb-2">
                {courseCompleted}/{COURSE_LESSONS.length} lessons · Meta-learning system
              </p>
              <div className="h-1.5 w-full rounded-full overflow-hidden bg-[#BFDBFE]">
                <div
                  className="h-full rounded-full bg-[#2563EB] transition-all duration-700"
                  style={{ width: `${COURSE_LESSONS.length > 0 ? Math.round((courseCompleted / COURSE_LESSONS.length) * 100) : 0}%` }}
                />
              </div>
            </div>
            <ChevronRight size={16} className="text-[#A8A29E] shrink-0" />
          </motion.button>

          {/* Subject courses */}
          {CONFIG.subjects.map((sub, i) => {
            const subStats = stats[sub.name] ?? { auto: 0, conscious: 0, fragile: 0, unseen: sub.totalConcepts };
            const done = subStats.auto + subStats.conscious;
            const pct  = Math.round((done / sub.totalConcepts) * 100);
            const Icon = SUBJECT_ICONS[sub.name] ?? BookOpen;
            return (
              <motion.button
                key={sub.name}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i + 1) * 0.05 }}
                onClick={() => onSubjectClick(sub.name)}
                className="w-full card rounded-2xl p-4 text-left flex items-center gap-3"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#F7F6F3', border: '1px solid #E8E5DF' }}
                >
                  <Icon size={20} className={sub.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-[#1C1917] mb-0.5" style={{ fontFamily: JKS }}>
                    {sub.name}
                  </p>
                  <p className="text-[12px] text-[#78716C] mb-2">
                    {done}/{sub.totalConcepts} problems · {sub.examQuestions} exam Qs
                  </p>
                  <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: '#E8E5DF' }}>
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${sub.barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <ChevronRight size={16} className="text-[#A8A29E] shrink-0" />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Subject Progress ── */}
      <div>
        <p className="text-[13px] font-semibold text-[#78716C] mb-3 px-1" style={{ fontFamily: JKS }}>
          Subject Progress
        </p>
        <div className="card overflow-hidden">
          {subjectReadiness.map((sub, i) => {
            const autoPC  = Math.round((sub.stats.auto / sub.totalConcepts) * 100);
            const conscPC = Math.round((sub.stats.conscious / sub.totalConcepts) * 100);
            const isLast  = i === subjectReadiness.length - 1;
            return (
              <motion.button
                key={sub.name}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => onSubjectClick(sub.name)}
                className="subject-card w-full flex items-center gap-3 px-4 py-3.5 text-left"
                style={{ borderBottom: isLast ? 'none' : '1px solid #F0EEE9' }}
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 bg-[#F7F6F3] border border-[#E8E5DF]">
                  {sub.emoji}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[14px] font-semibold text-[#1C1917]" style={{ fontFamily: JKS }}>
                      {sub.name}
                    </span>
                    <span className="text-[13px] font-bold tabular-nums text-[#15803D]" style={{ fontFamily: JKS }}>
                      {autoPC}%
                    </span>
                  </div>
                  <p className="text-[12px] text-[#A8A29E] mb-1.5">
                    {sub.totalConcepts} concepts · ~{sub.ready}/{sub.examQuestions} solved
                  </p>
                  <div className="h-1.5 w-full rounded-full overflow-hidden flex" style={{ background: '#E8E5DF' }}>
                    <div className={`h-full ${subjectBar(sub.name)} transition-all duration-700 rounded-full`} style={{ width: `${autoPC}%` }} />
                    <div className="h-full transition-all duration-700" style={{ width: `${conscPC}%`, background: '#BFDBFE' }} />
                  </div>
                </div>

                <ChevronRight size={16} className="text-[#A8A29E] shrink-0" />
              </motion.button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
