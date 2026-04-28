import React, { useState } from 'react';
import { motion } from 'motion/react';
import { aiEngineeringPhases } from '../data/ai-engineering/course-index';
import PhaseDetail from './PhaseDetail';
import type { Phase } from '../data/ai-engineering/types';
import type { Screen } from '../types';

interface AIEngineeringCourseProps {
  setScreen?: (screen: Screen) => void;
}

export default function AIEngineeringCourse({ setScreen }: AIEngineeringCourseProps) {
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  if (selectedPhase && selectedLessonId) {
    return (
      <PhaseDetail
        phase={selectedPhase}
        selectedLessonId={selectedLessonId}
        onSelectLesson={setSelectedLessonId}
        onBack={() => {
          setSelectedPhase(null);
          setSelectedLessonId(null);
        }}
      />
    );
  }

  if (selectedPhase) {
    return (
      <PhaseDetail
        phase={selectedPhase}
        onSelectLesson={setSelectedLessonId}
        onBack={() => setSelectedPhase(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-4 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 mt-4"
      >
        {setScreen && (
          <button
            onClick={() => setScreen('dashboard')}
            className="flex items-center gap-2 text-[var(--color-primary)] font-medium mb-4 active:scale-95 transition-transform"
          >
          <span className="material-symbols-rounded">arrow_back</span>
          Dashboard
        </button>
        )}
        <h1 className="text-3xl font-bold text-[var(--color-on-background)] mb-2 flex items-center gap-3">
          <span className="material-symbols-rounded text-3xl" style={{ color: '#8B5CF6' }}>psychology</span>
          AI Engineering Path
        </h1>
        <p className="text-[var(--color-on-surface-variant)] text-sm">
          260+ lessons • 20 phases • ~320 hours
        </p>
        <div className="mt-3 flex gap-2">
          <span className="px-3 py-1 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] text-xs font-medium">
            From Scratch
          </span>
          <span className="px-3 py-1 rounded-full bg-[#EC4899]/10 text-[#EC4899] text-xs font-medium">
            Learn + Build
          </span>
        </div>
      </motion.div>

      {/* Phases List */}
      <div className="space-y-3">
        {aiEngineeringPhases.map((phase, idx) => (
          <motion.button
            key={phase.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => setSelectedPhase(phase)}
            className="w-full text-left p-4 rounded-2xl bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container-high)] hover:shadow-md transition-all duration-200 active:scale-95"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-semibold text-[var(--color-primary)]">
                    Phase {phase.number}
                  </span>
                  <h3 className="text-lg font-semibold text-[var(--color-on-surface)]">
                    {phase.name}
                  </h3>
                </div>
                <p className="text-sm text-[var(--color-on-surface-variant)]">
                  {phase.lessons.length} lessons
                </p>
              </div>
              <span className="material-symbols-rounded text-[var(--color-outline)]">chevron_right</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Footer info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 rounded-2xl bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]"
      >
        <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed">
          Learn AI engineering from first principles. Read docs, implement code, test your understanding.
          Built with spaced repetition science for lasting mastery.
        </p>
      </motion.div>
    </div>
  );
}
