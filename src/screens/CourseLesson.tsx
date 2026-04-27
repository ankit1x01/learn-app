import React, { useState, useEffect } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Screen } from '../types';
import { COURSE_LESSONS } from '../data/course/lessons';
import { AI_ROADMAP_LESSONS } from '../data/ai_engineer/roadmap';
import { ACTIVE_SYLLABUS_ID } from '../data';
import { saveCourseDay, loadCourseProgress } from '../db/store';

const JKS = "'Plus Jakarta Sans', system-ui, sans-serif";

interface Props {
  setScreen:    (s: Screen) => void;
  courseDay:    number;
  setCourseDay: (d: number) => void;
}

export const CourseLesson: React.FC<Props> = ({ setScreen, courseDay, setCourseDay }) => {
  const lessons = ACTIVE_SYLLABUS_ID === 'ai_engineer' ? AI_ROADMAP_LESSONS : COURSE_LESSONS;
  const lesson     = lessons.find(l => l.day === courseDay);
  const nextLesson = lessons.find(l => l.day === courseDay + 1);
  const [isDone, setIsDone] = useState(false);
  const [compressNote, setCompressNote] = useState('');
  const isPortfolio = lesson?.title.includes('Portfolio') || lesson?.title.includes('Capstone');

  useEffect(() => {
    loadCourseProgress().then(map => {
      setIsDone(map.has(courseDay));
      setCompressNote(map.get(courseDay)?.compressNote || '');
    });
  }, [courseDay]);

  if (!lesson) return null;

  const handleMarkDone = async () => {
    if (isPortfolio && !compressNote.trim()) {
      alert('Please enter a project or GitHub URL before marking as done.');
      return;
    }
    await saveCourseDay(courseDay, compressNote);
    setIsDone(true);
  };

  const goNext = () => {
    if (nextLesson) {
      setCourseDay(nextLesson.day);
    } else {
      setScreen('course');
    }
  };

  return (
    <div className="pt-14 pb-32 px-4 max-w-md mx-auto min-h-screen">

      {/* ── Top bar ── */}
      <div className="flex items-center gap-3 mt-4 mb-6">
        <button
          onClick={() => setScreen('course')}
          className="w-9 h-9 rounded-xl flex items-center justify-center border"
          style={{ background: 'var(--color-surface-container)', borderColor: 'var(--color-border)' }}
        >
          <ChevronLeft size={18} style={{ color: 'var(--color-on-surface-variant)' }} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] uppercase tracking-[0.2em] font-bold mb-0.5" style={{ color: 'var(--color-on-surface-variant)' }}>
            Day {lesson.day} · Phase {lesson.phase}
          </p>
          <h2 className="font-bold text-[17px] leading-tight truncate" style={{ fontFamily: JKS, color: 'var(--color-on-surface)' }}>
            {lesson.title}
          </h2>
        </div>
        {isDone && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border" style={{ background: 'var(--color-success-container)', borderColor: 'var(--color-success)' }}>
            <CheckCircle2 size={12} style={{ color: 'var(--color-on-success-container)' }} />
            <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: 'var(--color-on-success-container)' }}>Done</span>
          </div>
        )}
      </div>

      {/* ── Core Principle ── */}
      <div className="card rounded-2xl p-4 mb-6 border" style={{ background: 'var(--color-primary-container)', borderColor: 'var(--color-primary)' }}>
        <p className="text-[11px] uppercase tracking-[0.2em] font-bold mb-1.5" style={{ color: 'var(--color-primary)' }}>
          Core Principle
        </p>
        <p className="text-[15px] font-bold leading-snug" style={{ fontFamily: JKS, color: 'var(--color-on-primary-container)' }}>
          {lesson.principle}
        </p>
      </div>

      {/* ── Theory ── */}
      <div className="space-y-4 mb-8">
        {lesson.theory.map((para, i) => (
          <p
            key={i}
            className="text-[15px] leading-[1.78]"
            style={{ fontFamily: "'Nunito', system-ui, sans-serif", color: 'var(--color-on-surface)' }}
          >
            {para}
          </p>
        ))}
      </div>

      {/* ── Portfolio / Apply Input ── */}
      {isPortfolio && (
        <div className="card rounded-2xl p-4 mb-8 border" style={{ background: 'var(--color-warning-container)', borderColor: 'var(--color-warning)' }}>
          <p className="text-[11px] uppercase tracking-[0.2em] font-bold mb-1.5" style={{ color: 'var(--color-warning)' }}>
            Project URL
          </p>
          <p className="text-[13px] mb-3" style={{ color: 'var(--color-on-warning-container)' }}>
            Enter the GitHub link or deployed URL for your project. This will be added to your AI Engineering Portfolio.
          </p>
          <input
            type="url"
            value={compressNote}
            onChange={(e) => setCompressNote(e.target.value)}
            disabled={isDone}
            placeholder="https://github.com/..."
            className="w-full px-3 py-2.5 rounded-xl border text-[14px] focus:outline-none focus:ring-2"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-on-surface)' }}
          />
        </div>
      )}

      {/* ── Bottom actions ── */}
      <div className="space-y-3">
        {!isDone ? (
          <button
            onClick={handleMarkDone}
            className="w-full py-4 rounded-2xl font-bold text-[13px] uppercase tracking-widest flex items-center justify-center gap-2"
            style={{ background: 'var(--color-success)', color: 'var(--color-on-success)', fontFamily: JKS }}
          >
            <CheckCircle2 size={16} />
            Mark as Done
          </button>
        ) : (
          <div className="card rounded-2xl p-4 border text-center" style={{ borderColor: 'var(--color-success)' }}>
            <CheckCircle2 size={24} className="mx-auto mb-1.5" style={{ color: 'var(--color-success)' }} />
            <p className="font-bold text-[14px]" style={{ fontFamily: JKS, color: 'var(--color-success)' }}>
              Day {lesson.day} complete
            </p>
            {nextLesson && (
              <p className="text-[12px] mt-0.5" style={{ color: 'var(--color-on-surface-variant)' }}>
                Next: Day {nextLesson.day} — {nextLesson.title}
              </p>
            )}
          </div>
        )}

        {nextLesson && (
          <button
            onClick={goNext}
            className="w-full py-4 rounded-2xl font-bold text-[13px] uppercase tracking-widest flex items-center justify-center gap-2"
            style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)', fontFamily: JKS }}
          >
            Day {nextLesson.day}: {nextLesson.title}
            <ChevronRight size={16} />
          </button>
        )}

        {!nextLesson && isDone && (
          <button
            onClick={() => setScreen('course')}
            className="w-full py-4 rounded-2xl font-bold text-[13px] uppercase tracking-widest"
            style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)', fontFamily: JKS }}
          >
            Back to Course
          </button>
        )}
      </div>

    </div>
  );
};
