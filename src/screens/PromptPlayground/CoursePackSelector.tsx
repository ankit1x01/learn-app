import React from 'react';
import { motion } from 'motion/react';

import { COURSE_PACKS, PACK_ORDER } from './data';
import type { CoursePackId } from '../../types';

interface CoursePackSelectorProps {
  onSelectPack: (packId: CoursePackId) => void;
}

export const CoursePackSelector: React.FC<CoursePackSelectorProps> = ({ onSelectPack }) => {
  return (
    <div className="pt-14 pb-32 max-w-md mx-auto min-h-screen flex flex-col px-4" style={{ background: 'var(--color-background)' }}>
      <div className="mb-8">
        <h1 className="font-bold text-[22px] leading-tight mb-1" style={{ color: 'var(--color-on-surface)' }}>
          Prompt Playground
        </h1>
        <p className="text-[12px] uppercase tracking-[0.18em] font-bold" style={{ color: 'var(--color-on-surface-variant)' }}>
          Choose a Course Pack
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {PACK_ORDER.map((packId, index) => {
          const pack = COURSE_PACKS[packId];
          return (
            <motion.button
              key={packId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              onClick={() => onSelectPack(packId)}
              className="w-full rounded-2xl border p-5 text-left transition-all active:scale-[0.98] hover:shadow-md hover:-translate-y-1"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}>
              <div className="flex items-start gap-3">
                <span className="text-[28px] material-symbols-rounded" style={{ opacity: 0.8 }}>
                  {pack.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[16px] leading-snug" style={{ color: 'var(--color-on-surface)' }}>
                    {pack.name}
                  </p>
                  <p className="text-[12px] leading-relaxed mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {pack.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: pack.color + '20', color: pack.color }}>
                      {pack.chapterCount} chapters
                    </span>
                    <span className="text-[11px] font-bold" style={{ color: 'var(--color-on-surface-variant)' }}>
                      {pack.difficulty}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-rounded shrink-0" style={{ fontSize: 18,  color: 'var(--color-on-surface-variant)', marginTop: 4  }}>chevron_right</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-8 p-4 rounded-xl" style={{ background: 'var(--color-surface-container)' }}>
        <p className="text-[12px]" style={{ color: 'var(--color-on-surface-variant)' }}>
          <strong>Pro tip:</strong> Start with Foundation to learn basics, then explore specialty packs at your own pace.
        </p>
      </div>
    </div>
  );
};
