import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFocusTrap } from '../lib/useFocusTrap';
import { askLlm, stopLlm, initLlm, getRateLimitStatus } from '../lib/llm';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Technique {
  id: string;
  icon: string;
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

interface DsaTopicProfile {
  topic: string;
  useCases: string[];
  coreSteps: string[];
  mistakes: string[];
  relatedPatterns: string[];
  complexityFocus: string;
}

const detectDsaTopicProfile = (concept: string, chapter: string): DsaTopicProfile => {
  const text = `${concept} ${chapter}`.toLowerCase();

  if (/(graph|bfs|dfs|dijkstra|topo|union[- ]?find|mst)/.test(text)) {
    return {
      topic: 'Graph Algorithms',
      useCases: ['Traversal in networks/grids', 'Shortest path or connectivity', 'Dependencies / ordering'],
      coreSteps: ['Model graph', 'Choose traversal', 'Track visited/state', 'Return path/count/order'],
      mistakes: ['Not resetting visited', 'Wrong queue vs stack choice', 'Ignoring disconnected components'],
      relatedPatterns: ['Topological sort', 'Disjoint set union', 'Multi-source BFS'],
      complexityFocus: 'V and E based complexity (O(V + E) or O(E log V)).',
    };
  }

  if (/(dp|dynamic programming|knapsack|lis|lcs|memo)/.test(text)) {
    return {
      topic: 'Dynamic Programming',
      useCases: ['Overlapping subproblems', 'Optimal substructure', 'Count/min/max optimization'],
      coreSteps: ['Define state', 'Write transition', 'Set base cases', 'Choose memo or tabulation'],
      mistakes: ['Wrong state definition', 'Missing base case', 'Incorrect transition order'],
      relatedPatterns: ['1D/2D DP', 'Digit DP', 'State compression DP'],
      complexityFocus: 'State count x transition work drives total complexity.',
    };
  }

  if (/(tree|bst|binary tree|trie|segment tree|fenwick)/.test(text)) {
    return {
      topic: 'Tree Data Structures',
      useCases: ['Hierarchical data', 'Range query/update', 'Prefix/search operations'],
      coreSteps: ['Define node/invariant', 'Traverse recursively/iteratively', 'Aggregate child results', 'Handle null/leaf cases'],
      mistakes: ['Null edge cases', 'Wrong recursion return value', 'Unbalanced tree assumptions'],
      relatedPatterns: ['DFS preorder/inorder/postorder', 'Binary lifting', 'Tree DP'],
      complexityFocus: 'Depth/height affects recursion and runtime.',
    };
  }

  if (/(sliding window|two pointer|two pointers)/.test(text)) {
    return {
      topic: 'Sliding Window / Two Pointers',
      useCases: ['Subarray/substring constraints', 'Pair sum/sorted array problems', 'Linear optimization over ranges'],
      coreSteps: ['Initialize pointers', 'Expand window', 'Shrink by condition', 'Update answer'],
      mistakes: ['Infinite pointer loop', 'Wrong shrink condition', 'Not updating answer at right time'],
      relatedPatterns: ['Prefix sum', 'Monotonic queue', 'Hash map frequency windows'],
      complexityFocus: 'Amortized pointer movement gives near O(N).',
    };
  }

  if (/(binary search|lower bound|upper bound)/.test(text)) {
    return {
      topic: 'Binary Search',
      useCases: ['Sorted lookup', 'Boundary finding', 'Binary search on answer'],
      coreSteps: ['Pick low/high', 'Compute mid safely', 'Move boundary by predicate', 'Return boundary/index'],
      mistakes: ['Off-by-one bounds', 'Overflow in mid', 'Wrong loop condition'],
      relatedPatterns: ['Monotonic predicate search', 'Search in rotated array', 'Parametric search'],
      complexityFocus: 'Halving search space yields O(log N).',
    };
  }

  return {
    topic: 'General DSA Pattern',
    useCases: ['Pattern identification from constraints', 'Time-space tradeoff decisions', 'Interview style problem solving'],
    coreSteps: ['Clarify input/output', 'Pick data structure', 'Design algorithm', 'Validate with edge cases'],
    mistakes: ['Ignoring constraints', 'Unclear invariants', 'No edge-case check'],
    relatedPatterns: ['Hashing', 'Greedy', 'Recursion and backtracking'],
    complexityFocus: 'Explain best, average, and worst case with justification.',
  };
};

const buildDynamicMindMapPrompt = (concept: string, subject: string, chapter: string): string => {
  const profile = detectDsaTopicProfile(concept, chapter);

  return `Create a high-resolution portrait educational infographic IMAGE for DSA topic "${concept}".

TITLE AT TOP (exact):
"${concept}: DSA Mind Map"

STYLE (must follow exactly):
- Hand-drawn explainer style, soft pastel palette
- Cream background, rounded boxes, subtle shadows
- Friendly rounded sans-serif typography
- Doodle icons and arrows
- Clean vertical storytelling layout (top to bottom)

CANVAS:
- Portrait 1024x1792 or higher

LAYOUT (use exact section order and headings):

1. Section 1 (Orange label):
"1. When to Use"
- ${profile.useCases[0]}
- ${profile.useCases[1]}
- ${profile.useCases[2]}

2. Section 2 (Blue label):
"2. Time Complexity"
- Best case for ${profile.topic}
- Average case for ${profile.topic}
- Worst case for ${profile.topic}
- Add one line: ${profile.complexityFocus}

3. Section 3 (Green label):
"3. Space Complexity"
- Auxiliary space overview
- Input/storage overhead

4. Section 4 (Purple label):
"4. Core Steps"
Flow with arrows:
${profile.coreSteps.join(' -> ')}

5. Section 5 (Red label):
"5. Common Mistakes"
- ${profile.mistakes[0]}
- ${profile.mistakes[1]}
- ${profile.mistakes[2]}

6. Section 6 (Teal label):
"6. Related Patterns"
- ${profile.relatedPatterns[0]}
- ${profile.relatedPatterns[1]}
- ${profile.relatedPatterns[2]}

7. Section 7 (Bottom row):
"7. Practice Problems"
- Include exactly 3 relevant LeetCode problems for ${concept}
- Show each as a small badge with problem number + short title

IMPORTANT OUTPUT RULES:
- Generate an IMAGE only (no markdown, no code block, no plain text explanation)
- Keep labels exactly as written above
- Keep spacing clean and readable
- Add arrows between logical sections`;
};

const buildDynamicInfographicPrompt = (concept: string, subject: string, chapter: string): string => {
  const profile = detectDsaTopicProfile(concept, chapter);

  return `Create a high-resolution portrait educational infographic IMAGE for "${concept}" in DSA (${subject}).

Use this exact structure and headings:

Title at top:
"${concept}: DSA Basics"

1. When to Use
2. Time Complexity
3. Space Complexity
4. Core Steps
5. Common Mistakes
6. Related Patterns
7. Practice Problems

Inject topic-specific content:
- Topic family: ${profile.topic}
- When to Use: ${profile.useCases.join('; ')}
- Core Steps: ${profile.coreSteps.join(' -> ')}
- Common Mistakes: ${profile.mistakes.join('; ')}
- Related Patterns: ${profile.relatedPatterns.join('; ')}
- Time/Space focus: ${profile.complexityFocus}
- Practice Problems: add exactly 3 relevant LeetCode problems

Design requirements:
- Soft pastel colors, cream background
- Rounded boxes, subtle shadows
- Friendly rounded sans-serif
- Hand-drawn doodle icon style
- Vertical storytelling layout
- Portrait 1024x1792 or higher

Output rule:
- Return IMAGE only.
- No markdown, no code block, no plain text explanation.`;
};

// ─── Prompt Templates ─────────────────────────────────────────────────────────

const TECHNIQUES: Technique[] = [
  {
    id: 'mindmap',
    icon: 'account_tree',
    label: 'Mind Map',
    tag: 'VISUAL',
    color: 'text-primary',
    bg: 'bg-primary/10',
    description: 'Hierarchical branch map of the concept',
    generatePrompt: (concept, subject, chapter) => buildDynamicMindMapPrompt(concept, subject, chapter),
  },
  {
    id: 'flashcard',
    icon: 'credit_card',
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
    icon: 'help',
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
    icon: 'bar_chart',
    label: 'Infographic',
    tag: 'VISUAL',
    color: 'text-[#7C3AED]',
    bg: 'bg-[#F5F3FF]',
    description: 'Single-page visual cheat sheet',
    generatePrompt: (concept, subject, chapter) => buildDynamicInfographicPrompt(concept, subject, chapter),
  },
  {
    id: 'mnemonic',
    icon: 'lightbulb',
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
    icon: 'chat',
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
    icon: 'code',
    label: 'Code Template',
    tag: 'CODE',
    color: 'text-[#292524]',
    bg: 'bg-[var(--color-surface-container)]',
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
  const containerRef = useFocusTrap(true);

  // Local Gemma state
  const [gemmaResponse, setGemmaResponse] = useState('');
  const [gemmaLoading, setGemmaLoading]   = useState(false);
  const [gemmaError, setGemmaError]       = useState('');
  const responseRef = useRef<HTMLDivElement>(null);
  const isInFlight   = useRef(false);

  // Countdown for circuit-breaker rate limit
  const [rateLimitSecs, setRateLimitSecs] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      const { remainingMs } = getRateLimitStatus();
      setRateLimitSecs(Math.ceil(remainingMs / 1000));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  const handleSelect = async (tech: Technique) => {
    const p = tech.generatePrompt(conceptName, subject, chapter || '');
    setPrompt(p);
    setSelected(tech);
    setCopied(false);
    setShared(false);
    setGemmaResponse('');
    setGemmaError('');
  };

  const handleAskGemma = async () => {
    // If already streaming — stop it
    if (gemmaLoading || isInFlight.current) {
      await stopLlm();
      setGemmaLoading(false);
      isInFlight.current = false;
      return;
    }
    setGemmaResponse('');
    setGemmaError('');
    setGemmaLoading(true);
    isInFlight.current = true;
    try {
      await initLlm();
      await askLlm(prompt, (partial) => {
        // APPEND each chunk — do NOT overwrite
        setGemmaResponse(prev => prev + partial);
        setTimeout(() => {
          responseRef.current?.scrollTo({ top: responseRef.current.scrollHeight, behavior: 'smooth' });
        }, 10);
      });
    } catch (e: any) {
      setGemmaError(e?.message ?? 'AI request failed. Please try again.');
    } finally {
      setGemmaLoading(false);
      isInFlight.current = false;
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
      <div className="absolute inset-0" style={{ background: 'var(--color-scrim)' }} />

      {/* Sheet */}
      <motion.div
        ref={containerRef}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 31 }}
        onClick={e => e.stopPropagation()}
        className="relative z-10 max-h-[85vh] flex flex-col focus:outline-none"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        style={{
          background: 'var(--color-surface-container-low)',
          borderRadius: '28px 28px 0 0',
          borderTop: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-elevation-1)',
        }}
      >
        {/* M3 Drag Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div style={{ width: 32, height: 4, borderRadius: 9999, background: 'var(--color-surface-variant)' }} />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-6 pb-4 pt-2 shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-rounded text-primary" style={{ fontSize: 12, fontVariationSettings: "'FILL' 1" }}>bolt</span>
              <span className="text-[12px] uppercase tracking-widest text-primary font-bold">Learn with AI</span>
            </div>
            <h2 id="sheet-title" className="font-ui font-bold text-lg leading-tight truncate">{conceptName}</h2>
            <p className="text-[11px] text-[#6B7280] mt-0.5">{subject} · {chapter}</p>
          </div>
          <button onClick={onClose} className="btn-icon mt-1 shrink-0">
            <span className="material-symbols-rounded" style={{ fontSize: 16 }}>close</span>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-6 pb-8">

          {!selected ? (
            <>
              {/* Technique grid */}
              <p className="text-[12px] uppercase tracking-widest font-bold mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
                Choose a learning technique — prompt copies to clipboard
              </p>
              <div className="grid grid-cols-2 gap-3">
                {TECHNIQUES.map(tech => (
                  <button
                    key={tech.id}
                    onClick={() => handleSelect(tech)}
                    className={`p-4 rounded-2xl text-left transition-all active:scale-[0.97] ${tech.bg}`}
                    style={{ border: '1px solid var(--color-border)' }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="p-2 rounded-xl" style={{ background: 'var(--color-surface-container)' }}>
                        <span className={`material-symbols-rounded ${tech.color}`} style={{ fontSize: 16 }}>{tech.icon}</span>
                      </div>
                      <span className={`text-[12px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--color-surface-container)] text-[#6B7280] uppercase tracking-wider`}>
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
              <div className={`flex items-center gap-3 p-4 rounded-2xl ${selected.bg} border border-[var(--color-border)] mb-4`}>
                <div className="p-2 rounded-xl bg-[var(--color-surface-container)]">
                  <span className={`material-symbols-rounded ${selected.color}`} style={{ fontSize: 18 }}>{selected.icon}</span>
                </div>
                <div>
                  <p className={`font-bold text-sm ${selected.color}`}>{selected.label}</p>
                  <p className="text-[11px] text-[#6B7280]">{selected.description}</p>
                </div>
              </div>

              {/* Prompt preview */}
              <div className="rounded-2xl p-4 mb-4 max-h-48 overflow-y-auto" style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border)' }}>
                <p className="text-[11px] text-[#6B7280] font-mono leading-relaxed whitespace-pre-wrap">
                  {prompt}
                </p>
              </div>

              {/* Copy + Share row */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={handleCopy}
                  className="flex-1 py-4 rounded-2xl font-ui font-bold tracking-widest text-sm flex items-center justify-center gap-2 transition-all"
                  style={copied
                    ? { background: 'var(--color-success)', color: 'var(--color-on-success)' }
                    : { background: 'var(--color-primary)', color: 'var(--color-on-primary)' }
                  }
                >
                  {copied ? <span className="material-symbols-rounded" style={{ fontSize: 18 }}>check</span> : <span className="material-symbols-rounded" style={{ fontSize: 18 }}>content_copy</span>}
                  {copied ? 'COPIED!' : 'COPY PROMPT'}
                </button>

                {canShare && (
                  <button
                    onClick={handleShare}
                    className="px-4 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border"
                  style={shared
                    ? { background: 'var(--color-success-container)', borderColor: 'var(--color-success)', color: 'var(--color-on-success-container)' }
                    : { background: 'var(--color-surface-container)', borderColor: 'var(--color-border)', color: 'var(--color-on-surface)' }
                  }
                    title="Share via Android share sheet"
                  >
                    {shared ? <span className="material-symbols-rounded" style={{ fontSize: 18 }}>check</span> : <span className="material-symbols-rounded" style={{ fontSize: 18 }}>share</span>}
                  </button>
                )}
              </div>

              {/* Gemma Local button */}
              <div className="mb-4">
                <p className="text-[12px] text-center text-[var(--color-on-surface-variant)] uppercase tracking-widest font-bold mb-3">
                  Ask on-device · no internet needed
                </p>
                <button
                  onClick={handleAskGemma}
                  disabled={rateLimitSecs > 0}
                  className={`w-full py-4 rounded-2xl font-ui font-bold tracking-widest text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.97] ${
                    rateLimitSecs > 0
                      ? 'bg-[#F3F4F6] border border-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                      : gemmaLoading
                      ? 'bg-[#bc8cff]/20 border border-[#bc8cff]/40 text-[#bc8cff]'
                      : 'bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] text-white shadow-lg shadow-[#7c3aed]/20'
                  }`}
                >
                  {rateLimitSecs > 0 ? (
                    <>
                      <span className="material-symbols-rounded" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>timer</span>
                      WAIT {rateLimitSecs}s — RATE LIMITED
                    </>
                  ) : gemmaLoading ? (
                    <><span className="material-symbols-rounded" style={{ fontSize: 16 }}>stop_circle</span> STOP GEMMA</>
                  ) : (
                    <><span className="material-symbols-rounded" style={{ fontSize: 16 }}>memory</span> ASK GEMMA (LOCAL)</>
                  )}
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
                          <span className="material-symbols-rounded text-[#bc8cff]" style={{ fontSize: 10 }}>memory</span>
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
                          className="mt-2 w-full py-2 rounded-xl bg-[var(--color-surface-container)] border border-[var(--color-border)] text-[12px] uppercase tracking-widest text-[#6B7280] font-bold flex items-center justify-center gap-2"
                        >
                          <span className="material-symbols-rounded" style={{ fontSize: 10 }}>content_copy</span> Copy Gemma's Response
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
                <p className="text-[12px] text-center text-[var(--color-on-surface-variant)] uppercase tracking-widest font-bold mb-3">
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
                      <span className="material-symbols-rounded" style={{ fontSize: 12 }}>open_in_new</span>
                      {app.label}
                    </button>
                  ))}
                </div>
                {canShare && (
                  <button
                    onClick={handleShare}
                    className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-surface-container)] border border-[var(--color-border)] text-[#6B7280] font-bold text-[11px] uppercase tracking-widest hover:bg-[var(--color-surface-container)] transition-all"
                  >
                    <span className="material-symbols-rounded" style={{ fontSize: 12 }}>share</span>
                    Share via Android…
                  </button>
                )}
                <p className="text-[12px] text-center text-[var(--color-border)] mt-2 leading-relaxed">
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
