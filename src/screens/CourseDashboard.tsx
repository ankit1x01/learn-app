import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, CheckCircle2, ChevronRight, Brain } from 'lucide-react';
import type { Screen } from '../types';
import { COURSE_LESSONS, PHASE_META } from '../data/course/lessons';
import { loadCourseProgress } from '../db/store';

interface Props {
  setScreen:      (s: Screen) => void;
  setCourseDay:   (day: number) => void;
}

export const CourseDashboard: React.FC<Props> = ({ setScreen, setCourseDay }) => {
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadCourseProgress().then(map => {
      setCompleted(new Set(map.keys()));
    });
  }, []);

  const totalDone     = completed.size;
  const totalLessons  = COURSE_LESSONS.length;
  const progress      = Math.round((totalDone / totalLessons) * 100);

  // Next lesson = first not completed (1-indexed)
  const nextDay = (() => {
    for (let d = 1; d <= totalLessons; d++) {
      if (!completed.has(d)) return d;
    }
    return null;
  })();

  const handleLessonClick = (day: number) => {
    setCourseDay(day);
    setScreen('course-lesson');
  };

  return (
    <div className="pt-14 pb-36 px-4 max-w-md mx-auto min-h-screen">

      {/* ── Header ── */}
      <div className="mt-4 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Brain size={14} className="text-primary" />
          <span className="text-[12px] uppercase tracking-[0.3em] font-bold" style={{ color: 'var(--color-on-surface-variant)' }}>28-Day Course</span>
        </div>
        <h1 className="text-3xl font-ui font-black tracking-tight mb-1">
          How to <span className="text-primary">Learn</span> Anything
        </h1>
        <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>Cognitive Architecture · Meta-Learning System · 1 concept/day</p>
      </div>

      {/* ── Progress ring ── */}
      <div className="card rounded-2xl p-5 mb-6 flex items-center gap-5 border border-primary/10">
        <div className="relative shrink-0" style={{ width: 72, height: 72 }}>
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
            <circle
              cx="36" cy="36" r="30" fill="none"
              stroke="var(--color-subject-chemistry)" strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 30}`}
              strokeDashoffset={`${2 * Math.PI * 30 * (1 - progress / 100)}`}
              transform="rotate(-90 36 36)"
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-ui font-black text-primary">{progress}%</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="font-ui font-bold text-base mb-0.5">
            {totalDone === 0 ? 'Not started' : totalDone === totalLessons ? 'Complete!' : `Day ${totalDone} done`}
          </p>
          <p className="text-[11px] leading-snug" style={{ color: 'var(--color-on-surface-variant)' }}>
            {totalDone}/{totalLessons} lessons · {totalLessons - totalDone} remaining
          </p>
          {nextDay && (
            <button
              onClick={() => handleLessonClick(nextDay)}
              className="mt-2 px-3 py-1.5 rounded-xl text-[12px] font-bold uppercase tracking-widest text-background"
              style={{ background: 'linear-gradient(135deg, var(--color-subject-chemistry), #4A42D0)' }}
            >
              Continue → Day {nextDay}
            </button>
          )}
        </div>
      </div>

      {/* ── Phases ── */}
      {PHASE_META.map((phase) => {
        const phaseLessons = COURSE_LESSONS.filter(l => l.phase === phase.phase);
        const phaseDone    = phaseLessons.filter(l => completed.has(l.day)).length;

        return (
          <div key={phase.phase} className="mb-6">
            {/* Phase header */}
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: phase.color }} />
              <div>
                <span className="font-ui font-bold text-sm" style={{ color: phase.color }}>
                  Phase {phase.phase} — {phase.title}
                </span>
                <span className="text-[12px] ml-2" style={{ color: 'var(--color-on-surface-muted)' }}>Days {phase.days}</span>
              </div>
              <span className="ml-auto text-[12px] font-bold" style={{ color: phase.color }}>
                {phaseDone}/{phaseLessons.length}
              </span>
            </div>
            <p className="text-[12px] mb-3 px-1" style={{ color: 'var(--color-on-surface-muted)' }}>{phase.desc}</p>

            {/* Lesson rows */}
            <div className="space-y-2">
              {phaseLessons.map((lesson) => {
                const isDone = completed.has(lesson.day);
                const isNext = lesson.day === nextDay || (nextDay === null && lesson.day === totalLessons);

                return (
                  <motion.button
                    key={lesson.day}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: lesson.day * 0.02 }}
                    onClick={() => handleLessonClick(lesson.day)}
                    className={`w-full card rounded-2xl p-4 text-left flex items-center gap-3 transition-all duration-200 border ${
                      isDone ? 'border-[var(--color-success-container)]'
                      : isNext ? 'border-[var(--color-primary-container)]'
                      : 'border-[var(--color-border)]'
                    }`}
                  >
                    {/* Status icon */}
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: isDone ? 'var(--color-success-container)' : isNext ? 'var(--color-primary-container)' : 'var(--color-surface-container)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      {isDone
                        ? <CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} />
                        : <BookOpen size={15} style={{ color: 'var(--color-primary)' }} />
                      }
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[12px] font-bold uppercase tracking-normal" style={{ color: 'var(--color-on-surface-muted)' }}>Day {lesson.day}</span>
                        {isNext && (
                          <span className="px-1.5 py-0.5 rounded text-[11px] font-bold" style={{ background: 'var(--color-primary-container)', color: 'var(--color-primary)' }}>NEXT</span>
                        )}
                      </div>
                      <p className="font-ui font-bold text-sm leading-tight truncate">{lesson.title}</p>
                      <p className="text-[12px] mt-0.5 truncate" style={{ color: 'var(--color-on-surface-muted)' }}>{lesson.principle}</p>
                    </div>

                    <ChevronRight size={14} className="text-[#A8A29E] shrink-0" />
                  </motion.button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
