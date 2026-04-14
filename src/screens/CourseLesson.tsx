import React, { useState, useEffect } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Screen } from '../types';
import { COURSE_LESSONS } from '../data/course/lessons';
import { saveCourseDay, loadCourseProgress } from '../db/store';

const JKS = "'Plus Jakarta Sans', system-ui, sans-serif";

interface Props {
  setScreen:    (s: Screen) => void;
  courseDay:    number;
  setCourseDay: (d: number) => void;
}

export const CourseLesson: React.FC<Props> = ({ setScreen, courseDay, setCourseDay }) => {
  const lesson     = COURSE_LESSONS.find(l => l.day === courseDay);
  const nextLesson = COURSE_LESSONS.find(l => l.day === courseDay + 1);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    loadCourseProgress().then(map => setIsDone(map.has(courseDay)));
  }, [courseDay]);

  if (!lesson) return null;

  const handleMarkDone = async () => {
    await saveCourseDay(courseDay, '');
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
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-[#E8E5DF]"
        >
          <ChevronLeft size={18} className="text-[#6B7280]" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#A8A29E] font-bold mb-0.5">
            Day {lesson.day} · Phase {lesson.phase}
          </p>
          <h2 className="font-bold text-[17px] text-[#1C1917] leading-tight truncate" style={{ fontFamily: JKS }}>
            {lesson.title}
          </h2>
        </div>
        {isDone && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
            <CheckCircle2 size={12} className="text-[#15803D]" />
            <span className="text-[11px] font-bold text-[#15803D] uppercase tracking-wide">Done</span>
          </div>
        )}
      </div>

      {/* ── Core Principle ── */}
      <div className="card rounded-2xl p-4 mb-6 border border-[#BFDBFE]" style={{ background: '#EFF6FF' }}>
        <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#2563EB] mb-1.5">
          Core Principle
        </p>
        <p className="text-[15px] font-bold text-[#1D4ED8] leading-snug" style={{ fontFamily: JKS }}>
          {lesson.principle}
        </p>
      </div>

      {/* ── Theory ── */}
      <div className="space-y-4 mb-8">
        {lesson.theory.map((para, i) => (
          <p
            key={i}
            className="text-[15px] text-[#292524] leading-[1.78]"
            style={{ fontFamily: "'Nunito', system-ui, sans-serif" }}
          >
            {para}
          </p>
        ))}
      </div>

      {/* ── Bottom actions ── */}
      <div className="space-y-3">
        {!isDone ? (
          <button
            onClick={handleMarkDone}
            className="w-full py-4 rounded-2xl font-bold text-[13px] uppercase tracking-widest text-white flex items-center justify-center gap-2"
            style={{ background: '#15803D', fontFamily: JKS }}
          >
            <CheckCircle2 size={16} />
            Mark as Done
          </button>
        ) : (
          <div className="card rounded-2xl p-4 border border-[#BBF7D0] text-center">
            <CheckCircle2 size={24} className="text-[#15803D] mx-auto mb-1.5" />
            <p className="font-bold text-[14px] text-[#15803D]" style={{ fontFamily: JKS }}>
              Day {lesson.day} complete
            </p>
            {nextLesson && (
              <p className="text-[12px] text-[#78716C] mt-0.5">
                Next: Day {nextLesson.day} — {nextLesson.title}
              </p>
            )}
          </div>
        )}

        {nextLesson && (
          <button
            onClick={goNext}
            className="w-full py-4 rounded-2xl font-bold text-[13px] uppercase tracking-widest text-white flex items-center justify-center gap-2"
            style={{ background: '#2563EB', fontFamily: JKS }}
          >
            Day {nextLesson.day}: {nextLesson.title}
            <ChevronRight size={16} />
          </button>
        )}

        {!nextLesson && isDone && (
          <button
            onClick={() => setScreen('course')}
            className="w-full py-4 rounded-2xl font-bold text-[13px] uppercase tracking-widest text-white"
            style={{ background: '#2563EB', fontFamily: JKS }}
          >
            Back to Course
          </button>
        )}
      </div>

    </div>
  );
};
