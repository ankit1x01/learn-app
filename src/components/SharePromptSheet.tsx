import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Copy, Check, ExternalLink, Share2,
  GitBranch,   // mind map
  CreditCard,  // flashcard
  HelpCircle,  // quiz
  BarChart2,   // infographic
  Lightbulb,   // mnemonic
  MessageSquare, // feynman
  Code2,       // code template
  Zap, Cpu, StopCircle,
} from 'lucide-react';
import { askLlm, stopLlm, initLlm } from '../lib/llm';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Technique {
  id: string;
  icon: React.ElementType;
  label: string;
  tag: string;
  color: string;
  bg: string;
  description: string;
  generatePrompt: (concept: string, subject: string, chapter: string) => string;
}

interface Props {
  conceptName: string;
  subject: string;
  chapter: string;
  onClose: () => void;
}

// ─── Prompt Templates ─────────────────────────────────────────────────────────

const TECHNIQUES: Technique[] = [
  {
    id: 'mindmap',
    icon: GitBranch,
    label: 'Mind Map',
    tag: 'VISUAL',
    color: 'text-primary',
    bg: 'bg-primary/10',
    description: 'Hierarchical branch map of the concept',
    generatePrompt: (concept, subject, chapter) =>
      `Create a detailed mind map for "${concept}" (DSA — ${subject}, ${chapter}).

Structure it as a text-based hierarchical tree:

Central Node: ${concept}
├── When to Use (trigger conditions — 3 bullet points)
├── Time Complexity (best / average / worst)
├── Space Complexity
├── Core Template / Algorithm Steps (numbered)
├── Common Mistakes (3 traps to avoid)
├── Related Patterns (2–3 similar patterns and how they differ)
└── Practice Problems (3 LeetCode problems — number + title)

Format each branch clearly with ├── and └── symbols. Be concise — each leaf should be one line.`,
  },
  {
    id: 'flashcard',
    icon: CreditCard,
    label: 'Flashcards',
    tag: 'RECALL',
    color: 'text-[#0E7490]',
    bg: 'bg-[#ECFEFF]',
    description: '5 spaced-repetition Q&A cards',
    generatePrompt: (concept, subject, chapter) =>
      `Create 5 spaced-repetition flashcards for "${concept}" (DSA — ${subject}).

Format each card exactly as:
CARD 1
FRONT: [question]
BACK: [concise answer — max 2 lines]

The 5 cards must test these aspects in order:
1. Recognition — "What pattern/algorithm is this?"
2. Trigger — "When should you use ${concept}?"
3. Complexity — "What is the time and space complexity?"
4. Template — "Write the key 3–5 lines of the code template"
5. Edge Case — "What edge case commonly breaks this pattern?"

Keep each BACK answer short enough to fit on a flashcard.`,
  },
  {
    id: 'quiz',
    icon: HelpCircle,
    label: 'Quiz',
    tag: 'TEST',
    color: 'text-[#B45309]',
    bg: 'bg-[#FFFBEB]',
    description: '5 MCQs with explanations',
    generatePrompt: (concept, subject, chapter) =>
      `Generate 5 multiple-choice quiz questions for "${concept}" in DSA (${subject}).

Format each question as:
Q1. [question text]
A) [option]
B) [option]
C) [option]
D) [option]
✓ Answer: [letter]) [brief explanation of why this is correct]
✗ Why others are wrong: [1 line each]

Questions must progressively test:
1. Basic definition / identification
2. Time complexity
3. Apply the pattern to a new problem scenario
4. Compare with a similar pattern (e.g., DFS vs BFS)
5. Identify the bug/mistake in a code snippet

Make the wrong answers plausible traps, not obviously incorrect.`,
  },
  {
    id: 'infographic',
    icon: BarChart2,
    label: 'Infographic',
    tag: 'VISUAL',
    color: 'text-[#7C3AED]',
    bg: 'bg-[#F5F3FF]',
    description: 'Single-page visual cheat sheet',
    generatePrompt: (concept, subject, chapter) =>
      `Design a text-based infographic / cheat sheet for "${concept}" (DSA — ${subject}).

Lay it out as a structured single-page reference:

━━━━━━━━━━━━━━━━━━━━━━━━
  ${concept.toUpperCase()}
  ${subject} · ${chapter}
━━━━━━━━━━━━━━━━━━━━━━━━

WHAT IT IS:
[One sentence definition]

WHEN TO USE:
• [Trigger 1]
• [Trigger 2]
• [Trigger 3]

ALGORITHM:
Step 1: ...
Step 2: ...
Step 3: ...

COMPLEXITY:
Time:  O(?)  | Why: ...
Space: O(?)  | Why: ...

CODE TEMPLATE (Python):
\`\`\`python
[5–10 line template with comments]
\`\`\`

COMMON MISTAKE:
⚠ [The most common bug and how to avoid it]

PRACTICE PROBLEMS:
LC-XXX: [Title] (Easy/Medium/Hard)
LC-XXX: [Title]
LC-XXX: [Title]
━━━━━━━━━━━━━━━━━━━━━━━━`,
  },
  {
    id: 'mnemonic',
    icon: Lightbulb,
    label: 'Mnemonic',
    tag: 'MEMORY',
    color: 'text-[#F59E0B]',
    bg: 'bg-[#F59E0B]/10',
    description: 'Acronym + story + real-world analogy',
    generatePrompt: (concept, subject, chapter) =>
      `Create memory aids to remember "${concept}" in DSA (${subject}).

Provide ALL THREE of these:

1. REAL-WORLD ANALOGY
Connect ${concept} to an everyday object or situation that makes the algorithm intuitive. Explain the mapping (what maps to what).

2. ACRONYM / MNEMONIC PHRASE
Create a short acronym or phrase that encodes the key steps or properties of ${concept}. Explain what each letter or word represents.

3. MINI STORY (Method of Loci)
Write a 3–5 sentence story that places the algorithm in a memorable scene. Each plot point should map to a step in the algorithm. Make it vivid and slightly absurd so it sticks.

End with: "To recall this pattern, think of ___"`,
  },
  {
    id: 'feynman',
    icon: MessageSquare,
    label: 'Feynman',
    tag: 'DEEP',
    color: 'text-[#15803D]',
    bg: 'bg-[#F0FDF4]',
    description: 'Explain simply, then build to mastery',
    generatePrompt: (concept, subject, chapter) =>
      `Teach "${concept}" (DSA — ${subject}) using the Feynman Technique.

Step 1 — SIMPLE EXPLANATION (for a 10-year-old)
Explain ${concept} without jargon. Use a toy example with 4–5 elements. No Big-O notation yet.

Step 2 — BUILD UP (for a CS student)
Now explain the same concept with proper terminology. Introduce the time/space complexity. Show why the naive approach is worse.

Step 3 — IDENTIFY GAPS
List 3 questions that would expose gaps in a student's understanding of ${concept}. These should be questions that "seem easy but aren't."

Step 4 — EDGE CASES THAT TRIP PEOPLE UP
List the 3 most common places where a ${concept} solution breaks. For each, show the input that causes the bug and how to fix it.

Step 5 — ONE-LINE SUMMARY
End with: "In one sentence, ${concept} is ___"`,
  },
  {
    id: 'codetemplate',
    icon: Code2,
    label: 'Code Template',
    tag: 'CODE',
    color: 'text-[#292524]',
    bg: 'bg-[#F0EEE9]',
    description: 'Reusable template in Python + JS',
    generatePrompt: (concept, subject, chapter) =>
      `Give me the production-quality code template for "${concept}" in DSA (${subject}).

Provide:

1. PYTHON TEMPLATE
\`\`\`python
# ${concept} Template
# Time: O(?) | Space: O(?)
# Trigger: [when to reach for this template]

[full reusable template with clear variable names and inline comments]
\`\`\`

2. JAVASCRIPT TEMPLATE
\`\`\`javascript
// ${concept} Template
[same template in JS]
\`\`\`

3. TEMPLATE WALKTHROUGH
- What does each variable represent?
- What invariant does the main loop maintain?
- What condition triggers the key action?

4. FILLED EXAMPLE
Apply the template to one canonical LeetCode problem (give number + title). Show the filled-in code, not just the template.

5. VARIATIONS
List 2–3 common variations of this template and how to adapt it for each.`,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

// ─── AI app targets ────────────────────────────────────────────────────────────

const AI_APPS = [
  { id: 'chatgpt', label: 'ChatGPT', color: '#10a37f', url: 'https://chatgpt.com/' },
  { id: 'claude',  label: 'Claude',  color: '#D97706', url: 'https://claude.ai/new' },
  { id: 'gemini',  label: 'Gemini',  color: '#4285F4', url: 'https://gemini.google.com/' },
  { id: 'grok',    label: 'Grok',    color: '#A855F7', url: 'https://grok.x.com/' },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export const SharePromptSheet: React.FC<Props> = ({ conceptName, subject, chapter, onClose }) => {
  const [selected, setSelected]   = useState<Technique | null>(null);
  const [copied, setCopied]       = useState(false);
  const [shared, setShared]       = useState(false);
  const [prompt, setPrompt]       = useState('');

  // Local Gemma state
  const [gemmaResponse, setGemmaResponse] = useState('');
  const [gemmaLoading, setGemmaLoading]   = useState(false);
  const [gemmaError, setGemmaError]       = useState('');
  const responseRef = useRef<HTMLDivElement>(null);

  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  const handleSelect = async (tech: Technique) => {
    const p = tech.generatePrompt(conceptName, subject, chapter);
    setPrompt(p);
    setSelected(tech);
    setCopied(false);
    setShared(false);
    setGemmaResponse('');
    setGemmaError('');
  };

  const handleAskGemma = async () => {
    if (gemmaLoading) {
      await stopLlm();
      setGemmaLoading(false);
      return;
    }
    setGemmaResponse('');
    setGemmaError('');
    setGemmaLoading(true);
    try {
      await initLlm();
      await askLlm(prompt, (partial) => {
        setGemmaResponse(partial);
        // auto-scroll to bottom
        setTimeout(() => {
          responseRef.current?.scrollTo({ top: responseRef.current.scrollHeight, behavior: 'smooth' });
        }, 10);
      });
    } catch (e: any) {
      setGemmaError(e?.message ?? 'Gemma inference failed');
    } finally {
      setGemmaLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      const el = document.createElement('textarea');
      el.value = prompt;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Web Share API — opens Android native share sheet
  const handleShare = async () => {
    try {
      await navigator.share({ title: `Learn ${conceptName}`, text: prompt });
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      // user cancelled or not supported — silently ignore
    }
  };

  // Open AI app URL directly (Android routes to installed app if registered)
  const openApp = (url: string) => window.open(url, '_blank');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex flex-col justify-end"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#F7F6F3]/95 " />

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        className="relative z-10 bg-surface rounded-t-[2.5rem] border-t border-[#E8E5DF] shadow-[0_-20px_60px_rgba(0,0,0,0.5)] max-h-[85vh] flex flex-col"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-[#F0EEE9]" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-6 pb-4 pt-2 shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={12} className="text-primary" fill="currentColor" />
              <span className="text-[12px] uppercase tracking-widest text-primary font-bold">Learn with AI</span>
            </div>
            <h2 className="font-ui font-bold text-lg leading-tight truncate">{conceptName}</h2>
            <p className="text-[11px] text-[#6B7280] mt-0.5">{subject} · {chapter}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-[#F0EEE9] hover:bg-[#F0EEE9] transition-colors mt-1 shrink-0">
            <X size={16} className="text-[#6B7280]" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-6 pb-8">

          {!selected ? (
            <>
              {/* Technique grid */}
              <p className="text-[12px] uppercase tracking-widest text-[#78716C] font-bold mb-4">
                Choose a learning technique — prompt copies to clipboard
              </p>
              <div className="grid grid-cols-2 gap-3">
                {TECHNIQUES.map(tech => (
                  <button
                    key={tech.id}
                    onClick={() => handleSelect(tech)}
                    className={`p-4 rounded-2xl border border-[#E8E5DF] text-left transition-all active:scale-[0.97] ${tech.bg} hover:border-[#E8E5DF]`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className={`p-2 rounded-xl bg-[#F0EEE9]`}>
                        <tech.icon size={16} className={tech.color} />
                      </div>
                      <span className={`text-[12px] font-bold px-1.5 py-0.5 rounded-full bg-[#F0EEE9] text-[#6B7280] uppercase tracking-wider`}>
                        {tech.tag}
                      </span>
                    </div>
                    <p className={`font-bold text-sm mb-1 ${tech.color}`}>{tech.label}</p>
                    <p className="text-[11px] text-[#6B7280] leading-snug">{tech.description}</p>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Back button */}
              <button
                onClick={() => setSelected(null)}
                className="flex items-center gap-2 text-[11px] text-[#6B7280] mb-4 hover:text-[#374151] transition-colors"
              >
                ← All techniques
              </button>

              {/* Selected technique header */}
              <div className={`flex items-center gap-3 p-4 rounded-2xl ${selected.bg} border border-[#E8E5DF] mb-4`}>
                <div className="p-2 rounded-xl bg-[#F0EEE9]">
                  <selected.icon size={18} className={selected.color} />
                </div>
                <div>
                  <p className={`font-bold text-sm ${selected.color}`}>{selected.label}</p>
                  <p className="text-[11px] text-[#6B7280]">{selected.description}</p>
                </div>
              </div>

              {/* Prompt preview */}
              <div className="bg-[#F0EEE9] border border-[#E8E5DF] rounded-2xl p-4 mb-4 max-h-48 overflow-y-auto">
                <p className="text-[11px] text-[#6B7280] font-mono leading-relaxed whitespace-pre-wrap">
                  {prompt}
                </p>
              </div>

              {/* Copy + Share row */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={handleCopy}
                  className={`flex-1 py-4 rounded-2xl font-ui font-bold tracking-widest text-sm flex items-center justify-center gap-2 transition-all ${
                    copied
                      ? 'bg-[#15803D] text-background'
                      : 'bg-primary text-background hover:opacity-90'
                  }`}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? 'COPIED!' : 'COPY PROMPT'}
                </button>

                {canShare && (
                  <button
                    onClick={handleShare}
                    className={`px-4 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border ${
                      shared
                        ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D]'
                        : 'bg-[#F0EEE9] border-[#E8E5DF] text-[#374151] hover:bg-[#F0EEE9]'
                    }`}
                    title="Share via Android share sheet"
                  >
                    {shared ? <Check size={18} /> : <Share2 size={18} />}
                  </button>
                )}
              </div>

              {/* Gemma Local button */}
              <div className="mb-4">
                <p className="text-[12px] text-center text-[#78716C] uppercase tracking-widest font-bold mb-3">
                  Ask on-device · no internet needed
                </p>
                <button
                  onClick={handleAskGemma}
                  className={`w-full py-4 rounded-2xl font-ui font-bold tracking-widest text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.97] ${
                    gemmaLoading
                      ? 'bg-[#bc8cff]/20 border border-[#bc8cff]/40 text-[#bc8cff]'
                      : 'bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] text-white shadow-lg shadow-[#7c3aed]/20'
                  }`}
                >
                  {gemmaLoading ? <StopCircle size={16} /> : <Cpu size={16} />}
                  {gemmaLoading ? 'STOP GEMMA' : 'ASK GEMMA 4 (LOCAL)'}
                </button>

                {/* Streaming response */}
                <AnimatePresence>
                  {(gemmaResponse || gemmaLoading) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3"
                    >
                      <div
                        ref={responseRef}
                        className="bg-[#7c3aed]/5 border border-[#7c3aed]/20 rounded-2xl p-4 max-h-64 overflow-y-auto"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Cpu size={10} className="text-[#bc8cff]" />
                          <span className="text-[12px] uppercase tracking-normal text-[#bc8cff] font-bold">
                            Gemma 4 · On-device
                          </span>
                          {gemmaLoading && (
                            <span className="ml-auto flex gap-0.5">
                              {[0,1,2].map(i => (
                                <motion.span
                                  key={i}
                                  animate={{ opacity: [0.3,1,0.3] }}
                                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                  className="w-1 h-1 rounded-full bg-[#bc8cff] inline-block"
                                />
                              ))}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#374151] leading-relaxed whitespace-pre-wrap font-mono">
                          {gemmaResponse || ' '}
                        </p>
                      </div>
                      {gemmaResponse && !gemmaLoading && (
                        <button
                          onClick={async () => {
                            try { await navigator.clipboard.writeText(gemmaResponse); } catch {}
                          }}
                          className="mt-2 w-full py-2 rounded-xl bg-[#F0EEE9] border border-[#E8E5DF] text-[12px] uppercase tracking-widest text-[#6B7280] font-bold flex items-center justify-center gap-2"
                        >
                          <Copy size={10} /> Copy Gemma's Response
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {gemmaError && (
                  <p className="mt-2 text-[11px] text-[#B91C1C]/70 text-center">{gemmaError}</p>
                )}
              </div>

              {/* AI app direct buttons */}
              <div>
                <p className="text-[12px] text-center text-[#78716C] uppercase tracking-widest font-bold mb-3">
                  Open AI · prompt copies on tap
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {AI_APPS.map(app => (
                    <button
                      key={app.id}
                      onClick={async () => { await handleCopy(); openApp(app.url); }}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all active:scale-[0.97]"
                      style={{
                        backgroundColor: `${app.color}15`,
                        border: `1px solid ${app.color}25`,
                        color: app.color,
                      }}
                    >
                      <ExternalLink size={12} />
                      {app.label}
                    </button>
                  ))}
                </div>
                {canShare && (
                  <button
                    onClick={handleShare}
                    className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#F0EEE9] border border-[#E8E5DF] text-[#6B7280] font-bold text-[11px] uppercase tracking-widest hover:bg-[#F0EEE9] transition-all"
                  >
                    <Share2 size={12} />
                    Share via Android…
                  </button>
                )}
                <p className="text-[12px] text-center text-[#A8A29E] mt-2 leading-relaxed">
                  Tap any app — prompt is auto-copied, then paste with long-press
                </p>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
