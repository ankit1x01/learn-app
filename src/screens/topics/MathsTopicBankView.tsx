// src/screens/topics/MathsTopicBankView.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
// @ts-ignore
import rawResearchData from '../../../docs/research/maths/research.json';

interface MathsTopicBankViewProps {
  subjectName: string;
}

const TIER_LABEL: Record<1|2|3, string> = { 1: '10th', 2: '11th', 3: '12th' };

const ConceptCard = ({ concept }: { concept: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  const isHighYield = concept.importance === 'high' || concept.importance === 'very_high';
  const difficultyColor = 
    concept.difficulty_level === 'easy' ? 'text-green-800 bg-green-100' :
    concept.difficulty_level === 'medium' ? 'text-orange-800 bg-orange-100' :
    'text-red-800 bg-red-100';

  return (
    <div className="border-b border-[var(--color-outline-variant)] last:border-0 hover:bg-[var(--color-surface-container-highest)]/20 transition-colors">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full text-left p-4 flex items-start gap-3"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]">
              Class {concept.class}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${difficultyColor}`}>
              {concept.difficulty_level || 'N/A'}
            </span>
            {isHighYield && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-[#FEF08A] text-[#92400E] flex items-center gap-1">
                <span className="material-symbols-rounded" style={{ fontSize: 12 }}>star</span>
                High Yield
              </span>
            )}
          </div>
          
          <p className="text-[15px] font-bold text-[var(--color-on-surface)] leading-snug">
            {concept.concept_name}
          </p>
          
          {!isOpen && (
            <p className="text-[13px] text-[var(--color-on-surface-variant)] mt-1.5 leading-snug line-clamp-1">
              {concept.definition}
            </p>
          )}
        </div>
        
        <span className="material-symbols-rounded text-[var(--color-on-surface-variant)] transition-transform duration-300 mt-1" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', fontSize: 20 }}>
          expand_more
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden px-4 pb-5"
          >
            <div className="pt-2 space-y-4">
              
              {/* Intuition Box */}
              {concept.intuition && (
                <div className="bg-[var(--color-tertiary-container)] text-[var(--color-on-tertiary-container)] p-3.5 rounded-[16px]">
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-1.5 opacity-80 flex items-center gap-1.5">
                    <span className="material-symbols-rounded" style={{ fontSize: 16 }}>lightbulb</span>
                    Intuition
                  </p>
                  <p className="text-[13.5px] leading-relaxed">{concept.intuition}</p>
                </div>
              )}

              {/* Definition */}
              {concept.definition && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-1">Definition</p>
                  <p className="text-[13.5px] text-[var(--color-on-surface)] leading-relaxed">{concept.definition}</p>
                </div>
              )}

              {/* Formulas */}
              {concept.formulas && concept.formulas.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-2">Formulas</p>
                  <div className="space-y-2">
                    {concept.formulas.map((f: any, i: number) => (
                      <div key={i} className="bg-[var(--color-surface-container)] px-3.5 py-2.5 rounded-[12px] flex flex-col gap-1 border border-[var(--color-outline-variant)]/50">
                        <span className="text-[12px] text-[var(--color-on-surface-variant)] font-medium leading-tight">{f.formula_name}</span>
                        <span className="text-[14px] font-mono text-[var(--color-primary)] overflow-x-auto whitespace-nowrap scrollbar-hide py-1">
                          {f.formula}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Properties */}
              {concept.properties && concept.properties.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-2">Key Properties</p>
                  <ul className="list-disc list-outside pl-4 space-y-1">
                    {concept.properties.map((p: string, i: number) => (
                      <li key={i} className="text-[13px] text-[var(--color-on-surface)] leading-snug">{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Common Mistakes */}
              {concept.common_mistakes && concept.common_mistakes.length > 0 && (
                <div className="bg-[var(--color-error-container)]/30 p-3.5 rounded-[16px] border border-[var(--color-error-container)]">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-error)] mb-1.5 flex items-center gap-1.5">
                    <span className="material-symbols-rounded" style={{ fontSize: 16 }}>warning</span>
                    Common Mistakes
                  </p>
                  <ul className="list-disc list-outside pl-4 space-y-1">
                    {concept.common_mistakes.map((m: string, i: number) => (
                      <li key={i} className="text-[13px] text-[var(--color-on-error-container)] leading-snug">{m}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Real World & Visualization */}
              {(concept.real_world_application || concept.visualization_hint) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {concept.real_world_application && (
                    <div className="bg-[var(--color-surface-container-high)] p-3.5 rounded-[16px]">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-2">
                        <span className="material-symbols-rounded text-[var(--color-primary)]" style={{ fontSize: 18 }}>public</span>
                      </div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-1">Real World</p>
                      <p className="text-[13px] text-[var(--color-on-surface)] leading-snug">{concept.real_world_application}</p>
                    </div>
                  )}
                  {concept.visualization_hint && (
                    <div className="bg-[var(--color-surface-container-high)] p-3.5 rounded-[16px]">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-secondary)]/10 flex items-center justify-center mb-2">
                        <span className="material-symbols-rounded text-[var(--color-secondary)]" style={{ fontSize: 18 }}>visibility</span>
                      </div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-1">Visualization</p>
                      <p className="text-[13px] text-[var(--color-on-surface)] leading-snug">{concept.visualization_hint}</p>
                    </div>
                  )}
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const MathsTopicBankView: React.FC<MathsTopicBankViewProps> = ({ subjectName }) => {
  const [search, setSearch] = useState('');
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set(['10', '11', '12']));
  const [openGroups, setOpenGroups] = useState<Set<number>>(new Set());

  const toggleClass = (c: string) => {
    setSelectedClasses(prev => {
      const n = new Set(prev);
      if (n.has(c)) n.delete(c);
      else n.add(c);
      return n;
    });
  };

  const toggleGroup = (i: number) =>
    setOpenGroups(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });

  const q = search.trim().toLowerCase();

  const groups = useMemo(() => {
    // Process research.json
    const mappedGroups: { group: string; icon: string; concepts: any[] }[] = [];
    rawResearchData.forEach((domainItem: any) => {
      if (domainItem.subdomains) {
        domainItem.subdomains.forEach((sub: any) => {
          if (!sub.subdomain_name || !sub.concepts) return;

          const entries = sub.concepts.filter((concept: any) => {
            const classStr = String(concept.class || '');
            let isIncluded = false;
            if (selectedClasses.has('10') && classStr.includes('10')) isIncluded = true;
            if (selectedClasses.has('11') && classStr.includes('11')) isIncluded = true;
            if (selectedClasses.has('12') && classStr.includes('12')) isIncluded = true;

            const nameMatches = concept.concept_name && concept.concept_name.toLowerCase().includes(q);
            const defMatches = concept.definition && concept.definition.toLowerCase().includes(q);

            return isIncluded && (!q || nameMatches || defMatches);
          });

          if (entries.length > 0) {
            mappedGroups.push({
              group: sub.subdomain_name,
              icon: 'calculate',
              concepts: entries,
            });
          }
        });
      }
    });
    return mappedGroups;
  }, [selectedClasses, q]);

  const effectiveOpenGroups = useMemo(() => {
    if (q) { const s = new Set<number>(); groups.forEach((_, i) => s.add(i)); return s; }
    return openGroups;
  }, [q, groups, openGroups]);

  const totalVisible = groups.reduce((s, f) => s + f.concepts.length, 0);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" style={{ fontSize: 20 }}>search</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search mathematical concepts..."
          className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-full pl-11 pr-11 py-3.5 text-[15px] text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-shadow"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full hover:bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)] transition-colors">
            <span className="material-symbols-rounded" style={{ fontSize: 18 }}>close</span>
          </button>
        )}
      </div>

      {/* Filters & Status */}
      <div className="flex gap-2 flex-wrap items-center bg-[var(--color-surface-container-low)] p-2 rounded-[20px] border border-[var(--color-outline-variant)]">
        {['10', '11', '12'].map(c => {
          const isSelected = selectedClasses.has(c);
          return (
            <button
              key={c}
              onClick={() => toggleClass(c)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
                isSelected 
                  ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm' 
                  : 'bg-transparent text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-highest)]'
              }`}
            >
              <span className="material-symbols-rounded" style={{ fontSize: 18, fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}>
                {isSelected ? 'check_circle' : 'circle'}
              </span>
              Class {c}
            </button>
          );
        })}
        <div className="ml-auto pr-3 text-[12px] font-bold text-[var(--color-primary)] tracking-wide bg-[var(--color-primary-container)] px-3 py-1.5 rounded-full">
          {totalVisible} CONCEPTS
        </div>
      </div>

      {groups.length === 0 && (
        <div className="text-center py-16 text-[var(--color-on-surface-variant)] flex flex-col items-center gap-3">
          <span className="material-symbols-rounded text-[48px] opacity-20">search_off</span>
          <p className="text-[15px] font-medium">No concepts found for "{search}"</p>
        </div>
      )}

      {/* Accordions */}
      <div className="space-y-3 pb-8">
        {groups.map((group, gi) => {
          const isOpen = effectiveOpenGroups.has(gi);

          return (
            <div key={Math.random()} className="rounded-[24px] overflow-hidden bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] shadow-sm">
              <button
                onClick={() => toggleGroup(gi)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-[var(--color-surface-container-highest)]/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] shadow-sm">
                  <span className="material-symbols-rounded block" style={{ fontSize: 22, fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                    {group.icon ?? 'functions'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[15px] text-[var(--color-on-surface)] leading-tight tracking-tight">{group.group}</p>
                  <p className="text-[13px] text-[var(--color-on-surface-variant)] mt-0.5">
                    {group.concepts.length} items
                  </p>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]' : 'text-[var(--color-on-surface-variant)]'}`}>
                  <span className="material-symbols-rounded transition-transform duration-300" style={{ fontSize: 24, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    expand_more
                  </span>
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-[var(--color-outline-variant)] flex flex-col bg-[var(--color-surface)]">
                      {group.concepts.map((concept: any, ti) => (
                        <ConceptCard key={ti} concept={concept} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

