import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { m3SpatialDefault, m3SpatialFast, m3EffectsEase } from '../lib/m3-motion';
import { CONFIG, examReadiness, totalConcepts, totalExamQ, subjectBar } from '../lib/config';
import { ShapePlaced } from '../components/M3Shapes';
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
  const [selectedPill, setSelectedPill] = useState<string | null>(null);

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
          <p className="text-[12px] font-medium mb-0.5 font-ui" style={{ color: 'var(--color-on-surface-muted)' }}>
            Welcome back
          </p>
          <h1 className="text-headline-emphasized leading-tight" style={{ color: 'var(--color-on-surface)' }}>
            नमस्ते, {CONFIG.studentName}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="streak-badge">
            <Flame size={12} />
            <span>7 day</span>
          </div>
          <div
            className="rounded-full px-3 py-1.5 flex items-center gap-1.5"
            style={{ background: 'var(--color-primary-container)', border: '1px solid var(--color-primary-border)' }}
          >
            <Clock size={11} style={{ color: 'var(--color-primary)' }} />
            <span className="text-[12px] font-bold font-ui" style={{ color: 'var(--color-primary)' }}>
              {CONFIG.daysRemaining ?? '—'}d
            </span>
          </div>
        </div>
      </div>

      {/* ── 3 Stat Pills (Interactive) ── */}
      <div className="flex gap-2.5 mb-6 relative">
        {[
          { label: 'Mastered',  value: totalAutomatic, color: 'var(--color-success)', bg: 'var(--color-success-container)', border: 'var(--color-success-container)', help: totalAutomatic === 0 ? '✨ Start your first session to earn mastery' : null, icon: '🏆' },
          { label: 'Learning',  value: totalConscious, color: 'var(--color-primary)', bg: 'var(--color-primary-container)', border: 'var(--color-primary-border)', help: totalConscious === 0 ? '🌱 Complete 2 more sessions to grow' : null, icon: '📚' },
          { label: 'Fading',    value: totalFading,    color: 'var(--color-warning)', bg: 'var(--color-warning-container)', border: 'var(--color-warning-container)', help: totalFading === 0 ? '✓ No concepts due for review yet' : null, icon: '⏰' },
        ].map((s, i) => (
          <motion.button
            key={s.label}
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: selectedPill === s.label ? 1.05 : 1 }}
            transition={{ ...m3SpatialDefault, delay: i * 0.05, scale: { duration: 0.3 } }}
            onClick={() => setSelectedPill(selectedPill === s.label ? null : s.label)}
            className="flex-1 rounded-m3-lg rounded-tl-sm p-3 text-center cursor-pointer transition-all active:scale-95 hover:shadow-md relative overflow-hidden group"
            style={{ 
              background: s.bg, 
              border: `2px solid ${selectedPill === s.label ? s.color : s.border}`,
              opacity: selectedPill === null || selectedPill === s.label ? 1 : 0.65,
              boxShadow: selectedPill === s.label 
                ? `0 8px 16px ${s.color}30, 0 2px 8px ${s.color}20` 
                : 'inset 0 1px 2px rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.08)'
            }}
            title={s.help || undefined}
          >
            {/* Ripple background on hover */}
            <motion.div 
              className="absolute inset-0 opacity-0 group-hover:opacity-20" 
              style={{ background: s.color }}
              initial={{ scale: 0 }}
              whileHover={{ scale: 1.5 }}
              transition={{ duration: 0.4 }}
            />
            
            {/* Content */}
            <div className="relative z-10">
              {s.value > 0 && (
                <div className="absolute -top-1 -right-1 text-[14px]" style={{ lineHeight: 1 }}>
                  {s.icon}
                </div>
              )}
              <motion.span 
                className="text-[24px] font-bold block tabular-nums font-ui"
                animate={{ scale: selectedPill === s.label ? 1.1 : 1, y: selectedPill === s.label ? -2 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ color: s.color }}
              >
                {s.value}
              </motion.span>
              <span className="text-[12px] font-medium font-ui" style={{ color: s.color, opacity: 0.85 }}>{s.label}</span>
              {s.help && selectedPill === s.label && (
                <motion.span 
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-[10px] font-ui mt-1.5 block" 
                  style={{ color: s.color, opacity: 0.8, fontWeight: 500 }}
                >
                  {s.help}
                </motion.span>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* ── Start Session Card (Primary CTA) ── */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...m3SpatialDefault, delay: 0.2 }}
        className="rounded-m3-xl p-5 mb-6 relative overflow-hidden border border-solid transition-all hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1"
        style={{ 
          background: 'var(--color-surface-container-low)', 
          borderColor: 'var(--color-primary-border)',
          boxShadow: '0 8px 24px rgba(103, 80, 164, 0.12), inset 0 1px 2px rgba(255,255,255,0.4)'
        }}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 opacity-30" style={{
          background: 'linear-gradient(135deg, rgba(103, 80, 164, 0.05) 0%, rgba(103, 80, 164, 0) 100%)'
        }} />
        
        <div className="relative z-10 flex items-start justify-between mb-4">
          <div>
            <h3 className="text-title-emphasized" style={{ color: 'var(--color-on-surface)' }}>
              Today's Session
            </h3>
            <p className="text-[13px] mt-0.5 font-body" style={{ color: 'var(--color-on-surface-variant)' }}>
              {session.length === 0 
                ? '🚀 No patterns queued. Start fresh?' 
                : `✓ ${session.length} pattern${session.length === 1 ? '' : 's'} queued`}
            </p>
          </div>
          <motion.div 
            className="w-10 h-10 rounded-m3-lg flex items-center justify-center" 
            style={{ background: 'var(--color-primary-container)' }}
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <Target size={18} style={{ color: 'var(--color-primary)' }} />
          </motion.div>
        </div>

        {/* Session composition bar with stagger animation */}
        <div className="h-2.5 w-full rounded-full overflow-hidden flex mb-2" style={{ background: 'var(--color-border)' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${CONFIG.sessionComposition.review * 100}%` }} 
            transition={{ ...m3SpatialDefault, delay: 0.1 }}
            style={{ background: '#B91C1C' }} 
            className="h-full rounded-l-full"
          />
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${CONFIG.sessionComposition.new * 100}%` }} 
            transition={{ ...m3SpatialDefault, delay: 0.15 }}
            style={{ background: 'var(--color-primary)' }} 
            className="h-full"
          />
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${CONFIG.sessionComposition.strengthen * 100}%` }} 
            transition={{ ...m3SpatialDefault, delay: 0.2 }}
            style={{ background: '#15803D' }} 
            className="h-full rounded-r-full"
          />
        </div>
        <div className="flex gap-4 mb-5">
          {[
            { label: 'Review',    pct: CONFIG.sessionComposition.review,    color: '#B91C1C' },
            { label: 'New',       pct: CONFIG.sessionComposition.new,       color: 'var(--color-primary)' },
            { label: 'Strengthen',pct: CONFIG.sessionComposition.strengthen,color: '#15803D' },
          ].map(q => (
            <div key={q.label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: q.color }} />
              <span className="text-[12px] font-medium font-ui" style={{ color: 'var(--color-on-surface-variant)' }}>
                {q.label} {Math.round(q.pct * 100)}%
              </span>
            </div>
          ))}
        </div>

        <motion.button 
          onClick={onStartSession} 
          className="w-full py-[15px] rounded-m3-xl font-bold font-ui text-[15px] flex justify-center items-center gap-2 transition-all active:scale-[0.98] hover:shadow-lg relative overflow-hidden group"
          style={{ 
            background: 'var(--color-primary)', 
            color: 'var(--color-on-primary)', 
            boxShadow: '0px 4px 8px 1px rgba(103, 80, 164, 0.3), 0px 2px 4px 0px rgba(0, 0, 0, 0.15)'
          }}
          whileHover={{ y: -2 }}
        >
          {/* Button shine effect */}
          <motion.div 
            className="absolute inset-0 opacity-0 group-hover:opacity-20"
            style={{ background: 'rgba(255,255,255,0.3)' }}
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6 }}
          />
          <Play size={17} fill="currentColor" />
          <span className="relative z-10">Start Session</span>
        </motion.button>
      </motion.div>

      {/* ── Mastery Ring Card ── */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={m3SpatialDefault}
        className="rounded-m3-xl p-5 mb-4 relative overflow-hidden border border-solid transition-all hover:shadow-lg hover:-translate-y-1"
        style={{ 
          background: 'var(--color-surface-lowest)', 
          borderColor: 'var(--color-border)',
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5), 0 4px 12px rgba(0,0,0,0.08)'
        }}
      >
        {/* Subtle gradient background */}
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
          background: 'linear-gradient(135deg, rgba(21, 128, 61, 0.03) 0%, rgba(103, 80, 164, 0.03) 100%)'
        }} />
        
        <ShapePlaced position="top-left" shape="blob" color="var(--color-primary)" opacity={0.08} size={40} animate={false} />
        <ShapePlaced position="bottom-right" shape="flower" color="var(--color-success)" opacity={0.08} size={36} animate={false} />
        <div className="flex items-center gap-5 relative z-10">
          {/* Ring */}
          <div className="relative shrink-0" style={{ width: 110, height: 110 }}>
            <svg width="110" height="110" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
              {/* Track */}
              <circle cx="50" cy="50" r={R} fill="none" stroke="var(--color-border)" strokeWidth="7" />
              {/* Conscious fill (primary) */}
              <motion.circle 
                cx="50" cy="50" r={R} fill="none" stroke="var(--color-primary-border)" strokeWidth="7"
                strokeDasharray={`${conscFill} ${C}`} strokeLinecap="round"
                initial={{ strokeDasharray: `0 ${C}` }}
                animate={{ strokeDasharray: `${conscFill} ${C}` }}
                transition={{ ...m3EffectsEase, delay: 0.3 }}
              />
              {/* Auto fill (green) */}
              <motion.circle 
                cx="50" cy="50" r={R} fill="none" stroke="var(--color-success)" strokeWidth="7"
                strokeDasharray={`${autoFill} ${C}`} strokeLinecap="round"
                initial={{ strokeDasharray: `0 ${C}` }}
                animate={{ strokeDasharray: `${autoFill} ${C}` }}
                transition={{ ...m3EffectsEase, delay: 0.2 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <motion.span 
                className="text-[28px] font-bold tabular-nums leading-none font-ui" 
                style={{ color: 'var(--color-on-surface)' }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...m3SpatialDefault, delay: 0.3 }}
              >
                {totalAutomatic}
              </motion.span>
              <span className="text-[11px] font-medium leading-none mt-0.5 font-ui" style={{ color: 'var(--color-on-surface-muted)' }}>
                / {totalConcepts}
              </span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="flex-1 space-y-3">
            <p className="text-[12px] font-semibold font-ui" style={{ color: 'var(--color-on-surface-variant)' }}>
              Mastery Breakdown
            </p>
            {[
              { label: 'Mastered',  value: totalAutomatic, pct: Math.round((totalAutomatic / totalConcepts) * 100), color: 'var(--color-success)', track: 'var(--color-success-container)' },
              { label: 'Learning',  value: totalConscious, pct: Math.round((totalConscious / totalConcepts) * 100),  color: 'var(--color-primary)', track: 'var(--color-primary-container)' },
              { label: 'Fading',    value: totalFading,    pct: Math.round((totalFading / totalConcepts) * 100),     color: 'var(--color-warning)', track: 'var(--color-warning-container)' },
            ].map(s => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-medium text-[var(--color-on-surface-variant)] font-ui">{s.label}</span>
                  <span className="text-[13px] font-bold tabular-nums font-ui" style={{ color: s.color }}>
                    {s.value}
                  </span>
                </div>
                <div className="h-[5px] w-full rounded-full overflow-hidden bg-[var(--color-surface-variant)]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.pct}%` }}
                    transition={m3EffectsEase}
                    className="h-full rounded-full"
                    style={{ background: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Exam Readiness Card (with Progress Ring) ── */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...m3SpatialDefault, delay: 0.1 }}
        className="rounded-m3-xl p-5 mb-4 relative overflow-hidden border border-solid transition-all hover:shadow-lg hover:-translate-y-1"
        style={{ 
          background: 'var(--color-surface-lowest)', 
          borderColor: 'var(--color-border)',
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5), 0 4px 12px rgba(0,0,0,0.08)'
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
          background: 'linear-gradient(135deg, rgba(21, 128, 61, 0.05) 0%, rgba(103, 80, 164, 0.03) 100%)'
        }} />
        
        <ShapePlaced position="bottom-left" shape="clover" color="var(--color-warning)" opacity={0.1} size={44} animate={true} />
        <div className="flex items-center gap-2 mb-4 relative z-10">
          <motion.div 
            className="w-8 h-8 rounded-lg flex items-center justify-center" 
            style={{ background: 'var(--color-success-container)' }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <TrendingUp size={15} style={{ color: 'var(--color-success)' }} />
          </motion.div>
          <span className="text-[13px] font-semibold font-ui" style={{ color: 'var(--color-on-surface-variant)' }}>
            Exam Readiness
          </span>
          <span className="ml-auto text-[12px] font-ui" style={{ color: 'var(--color-on-surface-muted)' }}>/ {totalExamQ} Qs</span>
        </div>

        {/* Progress Ring + Main Stats */}
        <div className="flex items-center gap-5 mb-4 relative z-10">
          <div className="relative shrink-0" style={{ width: 90, height: 90 }}>
            <svg width="90" height="90" viewBox="0 0 90 90" style={{ transform: 'rotate(-90deg)' }}>
              {/* Track */}
              <circle cx="45" cy="45" r="38" fill="none" stroke="var(--color-border)" strokeWidth="5" />
              {/* Progress fill */}
              <motion.circle 
                cx="45" 
                cy="45" 
                r="38" 
                fill="none" 
                stroke="var(--color-success)" 
                strokeWidth="5"
                strokeDasharray={`${(totalReady / CONFIG.examScoreTarget) * (2 * Math.PI * 38)} ${2 * Math.PI * 38}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[24px] font-bold tabular-nums leading-none font-ui" style={{ color: 'var(--color-success)' }}>
                {totalReady}
              </span>
              <span className="text-[10px] font-medium leading-none mt-0.5 font-ui" style={{ color: 'var(--color-on-surface-muted)' }}>
                / {CONFIG.examScoreTarget}
              </span>
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-3">
              <span className="text-[14px] font-body" style={{ color: 'var(--color-on-surface-variant)' }}>estimated correct</span>
              <p className="text-[12px] font-ui mt-0.5" style={{ color: 'var(--color-on-surface-muted)' }}>
                {totalReady >= CONFIG.examScoreTarget ? '✓ Target reached!' : `${CONFIG.examScoreTarget - totalReady} more to goal`}
              </p>
            </div>
          </div>
        </div>

        {/* Subject Progress Pills */}
        <div className="flex gap-2">
          {subjectReadiness.map(s => (
            <div
              key={s.name}
              className="flex-1 text-center py-2.5 rounded-m3-lg border border-solid"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-container)' }}
            >
              <div className="text-[20px] mb-1">{s.emoji}</div>
              <div className="text-[16px] font-bold tabular-nums font-ui" style={{ color: 'var(--color-on-surface)' }}>{s.ready}</div>
              <div className="text-[11px] font-body" style={{ color: 'var(--color-on-surface-muted)' }}>/{s.examQuestions}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Time-of-Day Nudge ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ ...m3SpatialDefault, delay: 0.15 }}
        className="flex items-center gap-3 px-4 py-3.5 rounded-m3-lg mb-4 relative overflow-hidden border border-solid transition-all hover:shadow-md hover:-translate-y-1"
        style={{
          background: isMorning 
            ? 'linear-gradient(135deg, var(--color-success-container) 0%, rgba(21, 128, 61, 0.5) 100%)' 
            : 'linear-gradient(135deg, var(--color-primary-container) 0%, rgba(103, 80, 164, 0.5) 100%)',
          borderColor: isMorning ? 'var(--color-success)' : 'var(--color-primary)',
          borderWidth: '1.5px',
          boxShadow: `inset 0 1px 2px rgba(255,255,255,0.3), 0 4px 12px ${isMorning ? 'rgba(21, 128, 61, 0.15)' : 'rgba(103, 80, 164, 0.15)'}`
        }}
      >
        <ShapePlaced position="bottom-right" shape="star" color={isMorning ? 'var(--color-success)' : 'var(--color-primary)'} opacity={0.2} size={40} animate={true} />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ flexShrink: 0 }}
        >
          <Clock size={16} style={{ color: isMorning ? 'var(--color-success)' : 'var(--color-primary)' }} />
        </motion.div>
        <div className="flex-1 relative z-10">
          <p className="text-[13px] font-medium font-body" style={{ color: isMorning ? 'var(--color-success)' : 'var(--color-primary)' }}>
            <span className="font-bold">💡 Pro tip:</span> {isMorning ? 'Perfect for learning new material' : 'Great for consolidating existing knowledge'}
          </p>
          <p className="text-[12px] font-body mt-0.5" style={{ color: isMorning ? 'rgba(21, 128, 61, 0.8)' : 'rgba(103, 80, 164, 0.8)' }}>
            Best for {nudge}
          </p>
        </div>
      </motion.div>

      {/* ── Demo Session Banner ── */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...m3SpatialDefault, delay: 0.25 }}
        onClick={() => setScreen('demo-session')}
        className="w-full rounded-m3-xl p-4 mb-4 flex items-center gap-4 text-left border border-solid transition-all hover:shadow-md hover:-translate-y-1"
        style={{ background: 'var(--color-primary-container)', borderColor: 'var(--color-primary-border)' }}
      >
        <div className="w-12 h-12 rounded-m3-lg flex items-center justify-center shrink-0" style={{ background: 'var(--color-primary)' }}>
          <Play size={22} fill="white" className="text-white ml-0.5" />
        </div>
        <div className="flex-1">
          <p className="text-[15px] font-bold mb-0.5 font-ui" style={{ color: 'var(--color-primary)' }}>
            DSA Demo Session
          </p>
          <p className="text-[12px] font-body" style={{ color: 'var(--color-on-surface-variant)' }}>
            5 concepts · infographics + MCQs · resumes where you left off
          </p>
        </div>
        <ChevronRight size={18} style={{ color: 'var(--color-primary)' }} className="shrink-0" />
      </motion.button>

      {/* ── Daily Games ── */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...m3SpatialDefault, delay: 0.3 }}
        onClick={() => setScreen('games')}
        className="w-full flex items-center justify-between px-4 py-3.5 rounded-m3-lg mb-4 border border-solid transition-all hover:shadow-md hover:-translate-y-1"
        style={{ background: 'var(--color-surface-lowest)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-m3-lg flex items-center justify-center" style={{ background: 'var(--color-primary-container)' }}>
            <Gamepad2 size={20} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div className="text-left">
            <p className="text-[15px] font-semibold font-ui" style={{ color: 'var(--color-on-surface)' }}>Daily Games</p>
            <p className="text-[12px] font-body" style={{ color: 'var(--color-on-surface-variant)' }}>DSA · 4 games today</p>
          </div>
        </div>
        <ChevronRight size={16} style={{ color: 'var(--color-on-surface-muted)' }} />
      </motion.button>

      {/* ── Courses ── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-[13px] font-semibold font-ui" style={{ color: 'var(--color-on-surface-variant)' }}>
            My Courses
          </p>
          <GraduationCap size={14} style={{ color: 'var(--color-on-surface-muted)' }} />
        </div>

        <div className="space-y-2.5">
          {/* How to Learn Anything */}
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...m3SpatialDefault, delay: 0.35 }}
            onClick={() => setScreen('course')}
            className="w-full rounded-m3-xl p-4 text-left flex items-center gap-3 border border-solid relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-1"
            style={{ background: 'var(--color-surface-container)', borderColor: 'var(--color-primary-border)' }}
          >
            <ShapePlaced position="top-right" shape="flower" color="var(--color-primary)" opacity={0.08} size={28} />
            <div className="w-11 h-11 rounded-m3-lg flex items-center justify-center shrink-0" style={{ background: 'var(--color-primary-container)' }}>
              <Brain size={20} style={{ color: 'var(--color-primary)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold mb-0.5 font-ui" style={{ color: 'var(--color-on-surface)' }}>
                How to Learn Anything
              </p>
              <p className="text-[12px] mb-2 font-body" style={{ color: 'var(--color-on-surface-variant)' }}>
                {courseCompleted}/{COURSE_LESSONS.length} lessons · Meta-learning system
              </p>
              <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--color-primary-border)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${COURSE_LESSONS.length > 0 ? Math.round((courseCompleted / COURSE_LESSONS.length) * 100) : 0}%` }}
                  transition={{ ...m3EffectsEase, delay: 0.2 }}
                  className="h-full rounded-full"
                  style={{ background: 'var(--color-primary)' }}
                />
              </div>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--color-on-surface-muted)' }} className="shrink-0" />
          </motion.button>

          {/* Subject courses */}
          {CONFIG.subjects.map((sub, i) => {
            const subStats = stats[sub.name] ?? { auto: 0, conscious: 0, fragile: 0, unseen: sub.totalConcepts };
            const done = subStats.auto + subStats.conscious;
            const pct  = Math.round((done / sub.totalConcepts) * 100);
            const Icon = SUBJECT_ICONS[sub.name] ?? BookOpen;
            const shapes = ['diamond', 'pill', 'arch', 'wave', 'triangle'] as const;
            const shapeIndex = i % shapes.length;
            return (
              <motion.button
                key={sub.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...m3SpatialDefault, delay: 0.4 + (i * 0.05) }}
                onClick={() => onSubjectClick(sub.name)}
                className="w-full rounded-m3-xl p-4 text-left flex items-center gap-3 border border-solid relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-1"
                style={{ background: 'var(--color-surface-container)', borderColor: 'var(--color-border)' }}
              >
                <ShapePlaced position="top-right" shape={shapes[shapeIndex]} color={sub.color} opacity={0.1} size={32} />
                <div
                  className="w-11 h-11 rounded-m3-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)' }}
                >
                  <Icon size={20} className={sub.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold mb-0.5 font-ui" style={{ color: 'var(--color-on-surface)' }}>
                    {sub.name}
                  </p>
                  <p className="text-[12px] mb-2 font-body" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {done}/{sub.totalConcepts} problems · {sub.examQuestions} exam Qs
                  </p>
                  <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ ...m3EffectsEase, delay: 0.3 }}
                      className={`h-full rounded-full ${sub.barColor}`}
                    />
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--color-on-surface-muted)' }} className="shrink-0" />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Subject Progress ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <p className="text-[13px] font-semibold mb-3 px-1 font-ui" style={{ color: 'var(--color-on-surface-variant)' }}>
          Subject Progress
        </p>
        <div className="overflow-hidden rounded-m3-xl border border-solid" style={{ background: 'var(--color-surface-container-high)', borderColor: 'var(--color-border)' }}>
          {subjectReadiness.map((sub, i) => {
            const autoPC  = Math.round((sub.stats.auto / sub.totalConcepts) * 100);
            const conscPC = Math.round((sub.stats.conscious / sub.totalConcepts) * 100);
            const isLast  = i === subjectReadiness.length - 1;
            const shapes = ['star', 'triangle', 'pill', 'wave', 'arch'] as const;
            const shapeIndex = i % shapes.length;
            return (
              <motion.button
                key={sub.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...m3SpatialDefault, delay: i * 0.05 }}
                onClick={() => onSubjectClick(sub.name)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all hover:opacity-90"
                style={{ 
                  borderBottom: isLast ? 'none' : '1px solid var(--color-outline-variant)', 
                  background: 'var(--color-surface-container-high)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <ShapePlaced position="bottom-right" shape={shapes[shapeIndex]} color="#6750A4" opacity={0.08} size={40} />
                {/* Icon */}
                <div className="w-10 h-10 rounded-m3-lg flex items-center justify-center text-xl shrink-0" style={{ background: 'var(--color-background)', border: '1px solid var(--color-border)' }}>
                  {sub.emoji}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[14px] font-semibold font-ui" style={{ color: 'var(--color-on-surface)' }}>
                      {sub.name}
                    </span>
                    <span className="text-[13px] font-bold tabular-nums text-[#15803D] font-ui">
                      {autoPC}%
                    </span>
                  </div>
                  <p className="text-[12px] mb-1.5 font-body" style={{ color: 'var(--color-on-surface-muted)' }}>
                    {sub.totalConcepts} concepts · ~{sub.ready}/{sub.examQuestions} solved
                  </p>
                  <div className="h-1.5 w-full rounded-full overflow-hidden flex" style={{ background: 'var(--color-border)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${autoPC}%` }}
                      transition={{ ...m3EffectsEase, delay: 0.1 }}
                      className={`h-full ${subjectBar(sub.name)} rounded-l-full`} 
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${conscPC}%` }}
                      transition={{ ...m3EffectsEase, delay: 0.2 }}
                      className="h-full rounded-r-full"
                      style={{ background: 'var(--color-primary-border)' }}
                    />
                  </div>
                </div>

                <ChevronRight size={16} style={{ color: 'var(--color-on-surface-muted)' }} className="shrink-0" />
              </motion.button>
            );
          })}
        </div>
      </motion.div>

    </div>
  );
}
