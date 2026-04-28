import React, { useState } from 'react';
import { motion } from 'motion/react';
import LessonDetail from './LessonDetail';
import type { Phase, Lesson } from '@/data/ai-engineering/types';

interface PhaseDetailProps {
  phase: Phase;
  selectedLessonId?: string | null;
  onSelectLesson: (lessonId: string) => void;
  onBack: () => void;
}

export default function PhaseDetail({
  phase,
  selectedLessonId,
  onSelectLesson,
  onBack,
}: PhaseDetailProps) {
  const [showLessonDetail, setShowLessonDetail] = useState(!!selectedLessonId);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(
    selectedLessonId ? phase.lessons.find(l => l.id === selectedLessonId) || null : null
  );

  const handleSelectLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setShowLessonDetail(true);
    onSelectLesson(lesson.id);
  };

  if (showLessonDetail && currentLesson) {
    return (
      <LessonDetail
        lesson={currentLesson}
        phase={phase}
        onBack={() => {
          setShowLessonDetail(false);
          setCurrentLesson(null);
          onSelectLesson('');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-4 pb-20">
      {/* Header with back button */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 mt-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[var(--color-primary)] font-medium mb-4 active:scale-95 transition-transform"
        >
          <span className="material-symbols-rounded">arrow_back</span>
          Back
        </button>
        <h1 className="text-3xl font-bold text-[var(--color-on-background)] mb-1">
          Phase {phase.number}
        </h1>
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-3">{phase.name}</h2>
        <div className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)]">
          <span className="material-symbols-rounded text-lg">school</span>
          <span>{phase.lessons.length} lessons</span>
        </div>
      </motion.div>

      {/* Lessons List */}
      <div className="space-y-2">
        {phase.lessons.map((lesson, idx) => (
          <motion.button
            key={lesson.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.03 }}
            onClick={() => handleSelectLesson(lesson)}
            className="w-full text-left p-4 rounded-xl bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container-high)] hover:shadow-md transition-all duration-200 active:scale-95"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-1 rounded-md">
                    {lesson.number}
                  </span>
                  <h3 className="font-semibold text-[var(--color-on-surface)]">{lesson.name}</h3>
                </div>
                <p className="text-xs text-[var(--color-on-surface-variant)] mt-2">Click to view lesson</p>
              </div>
              <span className="material-symbols-rounded text-[var(--color-outline)]">chevron_right</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 p-4 rounded-xl bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]"
      >
        <p className="text-xs text-[var(--color-on-surface-variant)] flex items-start gap-2">
          <span className="material-symbols-rounded text-base shrink-0" style={{ color: 'var(--color-warning)' }}>lightbulb</span>
          Tap a lesson to view the markdown documentation and code examples.
        </p>
      </motion.div>
    </div>
  );
}
