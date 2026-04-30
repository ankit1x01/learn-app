/**
 * ConceptBrief: Shows concept name, subject, definition, stakes, and key triggers
 * Displayed before prediction MCQ to prime the learner
 */

import React from 'react';
import { subjectColor, subjectBg } from '../lib/config';
import type { Concept } from '../core/types';

export const ConceptBrief = ({ concept }: { concept: Concept }) => {
  return (
    <div className="pt-4 pb-6 space-y-5">
      {/* Subject + Tier Badge */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`px-3 py-1 ${subjectBg(concept.subject)} ${subjectColor(concept.subject)} rounded-full text-[12px] font-bold tracking-widest uppercase`}>
          {concept.subject}
        </span>
        <span className={`px-3 py-1 rounded-full text-[12px] font-bold tracking-widest uppercase ${
          concept.stage === 'Unseen' ? 'bg-blue-100 text-blue-700' :
          concept.stage === 'Fragile' ? 'bg-red-100 text-red-700' :
          concept.stage === 'Conscious' ? 'bg-amber-100 text-amber-700' :
          concept.stage === 'Automatic' ? 'bg-green-100 text-green-700' :
          'bg-purple-100 text-purple-700'
        }`}>
          {concept.stage}
        </span>
      </div>

      {/* Concept Name */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">
          {concept.name}
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
          {concept.chapter} • Unit {concept.unit}
        </p>
      </div>

      {/* Stakes (Emotional motivation) */}
      {concept.stakesFact && (
        <div className="p-4 rounded-2xl" style={{ background: 'rgba(108,99,255,0.07)', border: '1px solid rgba(108,99,255,0.1)' }}>
          <div className="flex gap-2">
            <span className="material-symbols-rounded text-[18px] shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }}>
              lightning_bolt
            </span>
            <p className="text-[13px] leading-relaxed break-words" style={{ color: 'var(--color-on-surface)', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
              <strong>Why this matters:</strong> {concept.stakesFact}
            </p>
          </div>
        </div>
      )}

      {/* Key Triggers / Tags */}
      {concept.tags && concept.tags.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-on-surface-variant)' }}>
            Key Triggers
          </p>
          <div className="flex flex-wrap gap-2">
            {concept.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-[12px] font-medium"
                style={{
                  background: 'var(--color-surface-container)',
                  color: 'var(--color-on-surface-variant)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
