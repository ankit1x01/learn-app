// src/screens/TopicsScreen.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EXAM_CARDS, TOPIC_BANKS } from '../data/topic-banks/index';
import type { ExamCard, TopicGroup, TopicEntry, TopicProblem } from '../data/topic-banks/index';
import { SYLLABUS_REGISTRY } from '../data/index';
import type { Screen } from '../types/index';
import { m3SpatialDefault } from '../lib/m3-motion';
import { loadTopicsRead, markTopicRead, unmarkTopicRead } from '../db/store';
import { MathsTopicBankView } from './topics/MathsTopicBankView';

interface Props {
  setScreen: (s: Screen) => void;
}

type Level = 'exams' | 'subjects' | 'topics';

export const TopicsScreen: React.FC<Props> = ({ setScreen }) => {
  const [level, setLevel] = useState<Level>('exams');
  const [selectedExam, setSelectedExam] = useState<ExamCard | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1); // 1 = forward, -1 = back

  const navigate = (newLevel: Level, dir: 1 | -1) => {
    setDirection(dir);
    setLevel(newLevel);
  };

  const handleExamSelect = (exam: ExamCard) => {
    if (!TOPIC_BANKS[exam.id] && exam.id !== 'school_maths' && exam.id !== 'iit_jee') return; // coming soon — no action
    setSelectedExam(exam);
    navigate('subjects', 1);
  };

  const handleBack = () => {
    if (level === 'subjects') {
      setSelectedExam(null);
      navigate('exams', -1);
    } else if (level === 'topics') {
      setSelectedSubject(null);
      navigate('subjects', -1);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir * 40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (dir: number) => ({ x: dir * -40, opacity: 0 }),
  };

  return (
    <div className="pt-16 pb-32 max-w-md mx-auto min-h-screen bg-[var(--color-background)]">

      {/* ── Header ── */}
      <div className="sticky top-14 z-30 bg-[var(--color-background)]/95 px-5 pt-4 pb-3 border-b border-[var(--color-outline-variant)]">
        <div className="flex items-center gap-3">
          {level !== 'exams' && (
            <button
              onClick={handleBack}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--color-surface-container)] transition-colors"
            >
              <span className="material-symbols-rounded text-[var(--color-on-surface)]" style={{ fontSize: 22 }}>arrow_back</span>
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold text-[var(--color-on-surface)] leading-tight">
              {level === 'exams' && 'Topics'}
              {level === 'subjects' && selectedExam?.name}
              {level === 'topics' && selectedSubject}
            </h1>
            {level === 'topics' && selectedExam && (
              <p className="text-[12px] text-[var(--color-on-surface-variant)]">{selectedExam.name}</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Level content ── */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={level}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={m3SpatialDefault}
          className="px-4 pt-4"
        >
          {/* Level 1 — Exam Picker */}
          {level === 'exams' && (
            <ExamPickerLevel onSelect={handleExamSelect} />
          )}

          {/* Level 2 — Subject Picker */}
          {level === 'subjects' && selectedExam && (
            <SubjectPickerLevel
              exam={selectedExam}
              onSelect={(subject) => {
                setSelectedSubject(subject);
                navigate('topics', 1);
              }}
            />
          )}

          {/* Level 3 — Topic Bank */}
          {level === 'topics' && selectedExam && selectedSubject && (
            <TopicBankLevel
              examId={selectedExam.id}
              subjectName={selectedSubject}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ── Level 1: Exam Picker ──────────────────────────────────────────────────────

const ExamPickerLevel: React.FC<{ onSelect: (exam: ExamCard) => void }> = ({ onSelect }) => (
  <div className="grid grid-cols-2 gap-3">
    {EXAM_CARDS.map(exam => {
      const available = !!TOPIC_BANKS[exam.id] || exam.id === 'school_maths' || exam.id === 'iit_jee';
      return (
        <button
          key={exam.id}
          onClick={() => available && onSelect(exam)}
          className={`relative flex flex-col items-start gap-3 p-4 rounded-[20px] text-left transition-all
            bg-[var(--color-surface-container)]
            ${available ? 'active:scale-95' : 'opacity-60 cursor-default'}`}
        >
          {/* Icon */}
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: exam.color + '20' }}
          >
            <span
              className="material-symbols-rounded"
              style={{ fontSize: 22, color: exam.color, fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
            >
              {exam.icon}
            </span>
          </div>

          {/* Text */}
          <div className="w-full">
            <p className="text-[14px] font-bold text-[var(--color-on-surface)] leading-tight">{exam.name}</p>
            <p className="text-[11px] text-[var(--color-on-surface-variant)] mt-0.5 leading-snug">{exam.description}</p>
          </div>

          {/* Coming soon chip */}
          {!available && (
            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)]">
              Soon
            </span>
          )}
        </button>
      );
    })}
  </div>
);

// ── Level 2: Subject Picker ───────────────────────────────────────────────────

const SubjectPickerLevel: React.FC<{ exam: ExamCard; onSelect: (subject: string) => void }> = ({ exam, onSelect }) => {
  const config = (SYLLABUS_REGISTRY as Record<string, import('../core/types').SyllabusConfig>)[exam.id];

  if (!config) return (
    <div className="text-center py-16 text-[var(--color-on-surface-variant)] text-[14px]">
      No subjects found for this exam.
    </div>
  );

  return (
    <div className="space-y-2">
      {config.subjects.map(subject => (
        <button
          key={subject.name}
          onClick={() => onSelect(subject.name)}
          className="w-full flex items-center gap-4 p-4 rounded-[20px] text-left bg-[var(--color-surface-container-low)] active:scale-[0.98] transition-all"
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 ${subject.bgColor}`}>
            {subject.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-bold text-[var(--color-on-surface)]">{subject.name}</p>
            <p className="text-[12px] text-[var(--color-on-surface-variant)]">{subject.totalConcepts} topics</p>
          </div>
          <span className="material-symbols-rounded text-[var(--color-on-surface-variant)]" style={{ fontSize: 18 }}>chevron_right</span>
        </button>
      ))}
    </div>
  );
};

// ── Level 3: Topic Bank ───────────────────────────────────────────────────────

const TopicBankLevel: React.FC<{ examId: string; subjectName: string }> = ({ examId, subjectName }) => {
  if (examId === 'school_maths' || examId === 'iit_jee') {
    return <MathsTopicBankView subjectName={subjectName} />;
  }
  const bank = TOPIC_BANKS[examId];
  if (!bank) return null;
  const groups = bank.getGroups(subjectName);
  return <TopicBankView groups={groups} />;
};

// ── Topic Bank View ───────────────────────────────────────────────────────────

const TIER_LABEL: Record<1|2|3, string> = { 1: 'Core', 2: 'Important', 3: 'Advanced' };
const TIER_COLOR: Record<1|2|3, string> = {
  1: 'text-[#B45309] bg-[#FFFBEB]',
  2: 'text-[#1D4ED8] bg-[#EFF6FF]',
  3: 'text-[#6B7280] bg-[#F3F4F6]',
};

const TierPill = ({ tier }: { tier: 1 | 2 | 3 }) => (
  <span className={`px-2 py-0.5 rounded-full text-[12px] font-bold uppercase ${TIER_COLOR[tier]}`}>
    {TIER_LABEL[tier]}
  </span>
);

const TopicBankView: React.FC<{ groups: TopicGroup[] }> = ({ groups }) => {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<1|2|3|0>(0);
  const [openGroups, setOpenGroups] = useState<Set<number>>(new Set());
  const [openTopics, setOpenTopics] = useState<Set<string>>(new Set());
  const [topicsRead, setTopicsRead] = useState<Set<string>>(new Set());
  const [expandedProblem, setExpandedProblem] = useState<string | null>(null);

  useEffect(() => {
    loadTopicsRead().then(s => setTopicsRead(s)).catch(console.error);
  }, []);

  const handleToggleRead = async (key: string) => {
    if (topicsRead.has(key)) {
      await unmarkTopicRead(key);
      setTopicsRead(prev => { const n = new Set(prev); n.delete(key); return n; });
    } else {
      await markTopicRead(key);
      setTopicsRead(prev => new Set([...prev, key]));
    }
  };

  const toggleGroup = (i: number) =>
    setOpenGroups(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });

  const toggleTopic = (key: string) =>
    setOpenTopics(s => { const n = new Set(s); n.has(key) ? n.delete(key) : n.add(key); return n; });

  const q = search.trim().toLowerCase();

  const filtered = useMemo(() => {
    return groups.map((group, gi) => {
      if (tierFilter !== 0 && group.tier !== tierFilter) return null;
      const topics = group.topics.map((topic: TopicEntry) => {
        const problems = topic.problems.filter((p: TopicProblem) =>
          !q || p.name.toLowerCase().includes(q) || topic.topic.toLowerCase().includes(q) || group.group.toLowerCase().includes(q)
        );
        if (problems.length === 0 && q) return null;
        return { ...topic, problems };
      }).filter(Boolean) as (TopicEntry & { problems: TopicProblem[] })[];
      if (topics.length === 0) return null;
      return { group, gi, topics };
    }).filter(Boolean) as { group: TopicGroup; gi: number; topics: (TopicEntry & { problems: TopicProblem[] })[] }[];
  }, [groups, q, tierFilter]);

  const effectiveOpenGroups = useMemo(() => {
    if (q) { const s = new Set<number>(); filtered.forEach(f => s.add(f.gi)); return s; }
    return openGroups;
  }, [q, filtered, openGroups]);

  const effectiveOpenTopics = useMemo(() => {
    if (q) {
      const s = new Set<string>();
      filtered.forEach(f => f.topics.forEach(t => s.add(`${f.gi}-${t.topic}`)));
      return s;
    }
    return openTopics;
  }, [q, filtered, openTopics]);

  const totalVisible = filtered.reduce((s, f) => s + f.topics.reduce((ss, t) => ss + t.problems.length, 0), 0);
  const hasTiers = groups.some(g => g.tier !== undefined);

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" style={{ fontSize: 16 }}>search</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search topics, problems..."
          className="w-full bg-[var(--color-surface-container)] border-0 rounded-2xl pl-10 pr-9 py-3 text-[14px] text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className="material-symbols-rounded text-[var(--color-on-surface-variant)]" style={{ fontSize: 16 }}>close</span>
          </button>
        )}
      </div>

      {/* Tier filter pills — only shown if groups have tier data */}
      {hasTiers && (
        <div className="flex gap-2 flex-wrap">
          {([0, 1, 2, 3] as const).map(t => (
            <button
              key={t}
              onClick={() => setTierFilter(prev => prev === t ? 0 : t)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                tierFilter === t
                  ? t === 0 ? 'bg-[var(--color-on-surface)] text-[var(--color-surface)]'
                  : t === 1 ? 'bg-[#B45309] text-white'
                  : t === 2 ? 'bg-[#1D4ED8] text-white'
                  : 'bg-[#6B7280] text-white'
                  : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]'
              }`}
            >
              {t === 0 ? 'All' : t === 1 ? 'Core' : t === 2 ? 'Important' : 'Advanced'}
            </button>
          ))}
          {(q || tierFilter !== 0) && (
            <span className="ml-auto text-[12px] text-[var(--color-on-surface-variant)] self-center">{totalVisible} shown</span>
          )}
        </div>
      )}

      {/* Groups */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-[var(--color-on-surface-variant)] text-[14px]">
          No results for "{search}"
        </div>
      )}

      {filtered.map(({ group, gi, topics }) => {
        const isOpen = effectiveOpenGroups.has(gi);
        const groupProblemCount = topics.reduce((s, t) => s + t.problems.length, 0);
        const accentColor = group.accentColor ?? 'var(--color-primary)';
        const accentBg = group.accentBg ?? 'var(--color-primary-container)';

        return (
          <div key={gi} className="rounded-[20px] overflow-hidden bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]">
            {/* Group header */}
            <button
              onClick={() => toggleGroup(gi)}
              className="w-full flex items-center gap-3 p-4 text-left"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: accentBg }}>
                <span className="material-symbols-rounded" style={{ fontSize: 18, color: accentColor, fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                  {group.icon ?? 'layers'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[14px] text-[var(--color-on-surface)] leading-tight">{group.group}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[12px] text-[var(--color-on-surface-variant)]">
                    {topics.length} topic{topics.length !== 1 ? 's' : ''} · {groupProblemCount} problems
                  </span>
                  {group.tier && <TierPill tier={group.tier} />}
                </div>
              </div>
              <span className="material-symbols-rounded text-[var(--color-on-surface-variant)] shrink-0" style={{ fontSize: 18 }}>
                {isOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {/* Topics */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-[var(--color-outline-variant)]">
                    {topics.map((topic, ti) => {
                      const topicKey = `${gi}-${topic.topic}`;
                      const isTopicOpen = effectiveOpenTopics.has(topicKey);

                      return (
                        <div key={ti} className="border-b border-[var(--color-outline-variant)] last:border-0">
                          <div className="flex items-center">
                            <button
                              onClick={() => toggleTopic(topicKey)}
                              className="flex-1 flex items-center gap-3 px-4 py-3 text-left"
                            >
                              <span className="material-symbols-rounded shrink-0" style={{ fontSize: 14, color: accentColor }}>layers</span>
                              <span className="flex-1 text-[13px] text-[var(--color-on-surface)] font-medium leading-snug">{topic.topic}</span>
                              <span className="text-[12px] font-bold px-2 py-0.5 rounded-full shrink-0" style={{ color: accentColor, backgroundColor: accentBg }}>
                                {topic.problems.length}
                              </span>
                              <span className="material-symbols-rounded text-[var(--color-on-surface-variant)] shrink-0" style={{ fontSize: 14 }}>
                                {isTopicOpen ? 'expand_less' : 'chevron_right'}
                              </span>
                            </button>
                            <button
                              onClick={() => handleToggleRead(topicKey)}
                              className="shrink-0 px-3 py-3"
                              title={topicsRead.has(topicKey) ? 'Mark unread' : 'Mark as read'}
                            >
                              <span className="material-symbols-rounded" style={{ fontSize: 18, color: topicsRead.has(topicKey) ? '#15803D' : 'var(--color-on-surface-variant)', fontVariationSettings: topicsRead.has(topicKey) ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                                check_circle
                              </span>
                            </button>
                          </div>

                          {/* Problems */}
                          <AnimatePresence>
                            {isTopicOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.18 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-8 pr-4 pb-2 space-y-1">
                                  {topic.problems.map((problem, pi) => {
                                    const isExpanded = expandedProblem === `${topicKey}-${pi}`;
                                    return (
                                      <div key={pi} className="rounded-xl overflow-hidden">
                                        <button
                                          onClick={() => setExpandedProblem(isExpanded ? null : `${topicKey}-${pi}`)}
                                          className="w-full flex items-center gap-2 py-2 px-3 text-left bg-[var(--color-surface-container)] rounded-xl"
                                        >
                                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                                          <span className="flex-1 text-[13px] text-[var(--color-on-surface)]">{problem.name}</span>
                                          {problem.link && (
                                            <span className="material-symbols-rounded text-[var(--color-on-surface-variant)]" style={{ fontSize: 14 }}>
                                              {isExpanded ? 'expand_less' : 'expand_more'}
                                            </span>
                                          )}
                                        </button>

                                        {/* Resources */}
                                        {isExpanded && (problem.resources?.length || problem.link) && (
                                          <div className="px-3 pb-2 pt-1 space-y-1 bg-[var(--color-surface-container)]">
                                            {problem.link && (
                                              <a
                                                href={problem.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-[12px] text-[var(--color-primary)] font-medium py-1"
                                              >
                                                <span className="material-symbols-rounded" style={{ fontSize: 14 }}>open_in_new</span>
                                                Problem link
                                              </a>
                                            )}
                                            {problem.resources?.map((r, ri) => (
                                              <a
                                                key={ri}
                                                href={r}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-[12px] text-[var(--color-on-surface-variant)] py-0.5"
                                              >
                                                <span className="material-symbols-rounded" style={{ fontSize: 12 }}>link</span>
                                                <span className="truncate">{new URL(r).hostname.replace('www.', '')}</span>
                                              </a>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
