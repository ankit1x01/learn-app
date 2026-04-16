import React, { useState } from 'react';
import { getSubject, subjectColor, subjectBg } from '../lib/config';
import { TierBadge } from '../components/TierBadge';
import { getInitialStabilityWithEncoding } from '../core/fsrs';
import type { Screen } from '../types';
import type { SessionItem, Concept, EncodingDepth } from '../core/types';
import {
  BookOpen,
  Headphones,
  PenTool,
  Target,
  Zap,
  Brain,
  Eye,
  PenLine,
  Link2,
} from 'lucide-react';

export const ConceptEncoding = ({
  setScreen,
  session,
  onUpdateConcept,
  qIndex,
}: {
  setScreen: (s: Screen) => void;
  session: SessionItem[];
  onUpdateConcept: (id: string, updates: Partial<Concept>) => void;
  qIndex: number;
}) => {
  const current = session[qIndex] ?? session[0];
  const concept = current.concept;
  const subjectCfg = getSubject(concept.subject);

  const modalities = [
    { id: 'read',   icon: BookOpen,   label: 'Read'   },
    { id: 'listen', icon: Headphones, label: 'Listen' },
    { id: 'draw',   icon: PenTool,    label: 'Draw'   },
    { id: 'quiz',   icon: Target,     label: 'Quiz'   },
  ];

  const [activeModality, setActiveModality] = useState('draw');
  // Layer 1 — encoding depth selection
  const [encodingDepth, setEncodingDepth] = useState<EncodingDepth | null>(null);

  return (
    <div className="pt-14 pb-36 px-4 max-w-md mx-auto">
      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-6 mt-4">
        <span className={`px-3 py-1 ${subjectBg(concept.subject)} ${subjectColor(concept.subject)} rounded-full text-[12px] font-bold tracking-widest uppercase flex items-center gap-1.5`}>
          <Zap size={11} fill="currentColor" /> New Concept
        </span>
        <span className="px-3 py-1 rounded-full text-[12px] font-bold tracking-widest uppercase" style={{ background: 'var(--color-surface-container)', color: 'var(--color-on-surface-variant)' }}>
          {concept.subject}
        </span>
        <TierBadge tier={concept.pyqTier} />
      </div>

      <p className="text-[12px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: 'var(--color-on-surface-variant)' }}>{concept.chapter} · Unit {concept.unit}</p>

      {/* Visual area */}
      <div className="aspect-square rounded-[2rem] mb-6 overflow-hidden flex items-center justify-center relative"
           style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.08) 0%, rgba(0,217,126,0.04) 100%)', border: '1px solid rgba(108,99,255,0.12)' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-56 h-56 rounded-full border border-dashed animate-spin-slow" style={{ borderColor: 'rgba(108,99,255,0.2)' }} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span style={{ color: 'var(--color-on-surface-muted)', fontStyle: 'italic', fontSize: '14px' }}>Diagram: {concept.name}</span>
        </div>
        <div className="absolute top-4 right-4 animate-float">
          <Zap size={24} className={subjectColor(concept.subject)} />
        </div>
      </div>

      <h1 className="text-3xl font-ui font-black tracking-tight mb-1">{concept.name}</h1>
      <p className="italic mb-5 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{concept.chapter} · Unit {concept.unit}</p>

      {/* Encoding tip */}
      <div className="p-4 rounded-2xl mb-6 flex items-start gap-3" style={{ background: 'rgba(108,99,255,0.07)', border: '1px solid rgba(108,99,255,0.1)' }}>
        <Brain size={14} className="text-primary mt-0.5 shrink-0" />
        <p className="font-reading text-[13px] leading-relaxed" style={{ color: 'var(--color-on-surface)', letterSpacing: '0.005em' }}>
          {subjectCfg?.encodingTip ?? 'Encode by writing it out from scratch without notes.'}
        </p>
      </div>

      {/* Modality selector */}
      <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
        {modalities.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveModality(m.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all shrink-0`}
            style={m.id === activeModality
              ? { background: 'linear-gradient(135deg, var(--color-subject-chemistry), var(--color-subject-chemistry))', boxShadow: '0 4px 16px rgba(108,99,255,0.35)' }
              : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }
            }
          >
            <m.icon size={14} style={{ color: m.id === activeModality ? 'white' : 'var(--color-on-surface-variant)' }} />
            <span className={`text-[11px] font-bold uppercase tracking-widest ${m.id === activeModality ? 'text-white' : ''}`} style={{ color: m.id === activeModality ? 'white' : 'var(--color-on-surface-variant)' }}>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4 leading-relaxed mb-10" style={{ color: 'var(--color-on-surface-variant)' }}>
        <p className="text-sm leading-relaxed">
          Study the <strong style={{ color: 'var(--color-on-surface)' }}>{concept.name}</strong> pattern deeply. Understand the template,
          identify the trigger conditions, and practice applying it to at least 3 different problems
          before moving on.
        </p>
      </div>

      {/* Layer 1 — Encoding depth selector */}
      <div className="mb-6">
        <p className="text-[12px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: 'var(--color-on-surface-variant)' }}>
          How did you encode this?
        </p>
        <div className="space-y-2">
          {([
            { depth: 'shallow' as EncodingDepth,   Icon: Eye,     label: 'Just read it',             sub: 'Skimmed through — basic exposure',             mult: '×1.0' },
            { depth: 'own-words' as EncodingDepth, Icon: PenLine, label: 'Explained in own words',   sub: 'Wrote it out from scratch, no notes',          mult: '×1.6' },
            { depth: 'connected' as EncodingDepth, Icon: Link2,   label: 'Connected to prior knowledge', sub: 'Linked it to something I already know', mult: '×2.4' },
          ]).map(({ depth, Icon, label, sub, mult }) => (
            <button
              key={depth}
              onClick={() => setEncodingDepth(depth)}
              className="w-full p-3.5 rounded-2xl text-left transition-all duration-200 flex items-center gap-3"
              style={{
                background: encodingDepth === depth ? 'rgba(103, 80, 164, 0.08)' : '#FFFFFF',
                border: `1px solid ${encodingDepth === depth ? 'var(--color-primary-container)' : 'var(--color-border)'}`,
              }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                   style={{ background: encodingDepth === depth ? 'var(--color-primary-container)' : 'var(--color-surface-container)' }}>
                <Icon size={15} style={{ color: encodingDepth === depth ? 'var(--color-primary)' : 'var(--color-on-surface-variant)' }} />
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm leading-tight">{label}</div>
                <div className="text-[11px] mt-0.5" style={{ color: 'var(--color-on-surface-variant)' }}>{sub}</div>
              </div>
              <span className="text-[12px] font-bold shrink-0"
                    style={{ color: encodingDepth === depth ? '#2563EB' : '#C4BFBA' }}>
                {mult}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => {
            const depth = encodingDepth ?? 'shallow';
            const newStability = getInitialStabilityWithEncoding(depth);
            onUpdateConcept(concept.id, { encodingDepth: depth, stability: newStability });
            setScreen('session');
          }}
          className={`btn-primary ${!encodingDepth ? 'opacity-50' : ''}`}
          disabled={!encodingDepth}
        >
          I UNDERSTAND THIS ✓
        </button>
        <button className="w-full py-3.5 text-[#6B7280] font-label font-bold text-[12px] uppercase tracking-[0.2em] hover:text-[#6B7280] transition-colors">
          Explain simpler
        </button>
      </div>
    </div>
  );
};
