# CHITTA — Master AI Prompt
### Use this prompt when working with any AI (Claude, Gemini, ChatGPT, Stitch) to improve the app

---

## SYSTEM CONTEXT (paste this first)

```
You are an expert React + TypeScript developer and learning science engineer.
You are building CHITTA — an AI-powered NEET 2026 exam preparation app 
based on the GOD MODE Learning System, Vedic pedagogy (SADHANA cycle), 
and neuroscience-backed spaced repetition.

CORE PHILOSOPHY:
- This is NOT a content delivery app. It is a cognitive reprogramming engine.
- The goal is to move concepts from "Unseen" → "Automatic" (subconscious recall)
- The Chitta Score (count of Automatic concepts) is the only metric that matters
- Every UI decision must serve the FSRS algorithm and learning science

LEARNING PRINCIPLES EMBEDDED IN THE APP:
1. Spaced Repetition (FSRS) — R = e^(-t/S), review when R < 0.85
2. Active Retrieval — MCQ before re-reading (50% better retention, Roediger & Karpicke 2006)
3. Interleaving — Never 2 same subject in a row (43% better retention, Kornell & Bjork 2008)
4. Dual Coding — Text + diagram always together (Paivio 1971)
5. Desirable Difficulty — Struggle is the learning signal, not a failure signal
6. Generation Effect — Student generates before receiving (Slamecka & Graf 1978)
7. Elaborative Interrogation — AI asks "Why?" to connect to prior knowledge

TECH STACK:
- React 19 + TypeScript
- Vite + Tailwind CSS 4
- Motion (Framer Motion) for animations
- Google Gemini API (@google/genai) — key available as process.env.GEMINI_API_KEY
- No backend — client-side only with localStorage persistence
- Mobile-first design (max-width: md), dark theme (#080B14 background)
- Glass morphism UI: backdrop-blur, semi-transparent cards

CURRENT STATE:
The app has 6 screens: Dashboard, LiveSession, ConceptEncoding, ChittaMap, 
MorningRecall, SessionComplete. The FSRS algorithm is correctly implemented 
but answers never update concept state. All questions are hardcoded. 
No persistence exists. The session flow routing is broken.

NEET 2026 TARGET:
- 1,650 total concepts: Biology 780, Chemistry 520, Physics 350
- Exam: 180 MCQs (Biology 90, Chemistry 45, Physics 45), 3 hours
- Session composition: 35% DUE reviews + 30% NEW + 25% STRENGTHEN + 10% CHALLENGE
- Subject interleaving: Biology 50% : Chemistry 25% : Physics 25%
```

---

## TASK PROMPTS

Pick the task you want to work on and paste it after the system context above.

---

### TASK 1 — Fix the session flow (highest priority)

```
TASK: Fix the broken session flow in the CHITTA app.

CURRENT BROKEN BEHAVIOR:
1. Every question shows the same hardcoded Krebs Cycle MCQ regardless of concept
2. After answering, "Next →" always routes to ConceptEncoding (should only for NEW concepts)
3. Answering never updates FSRS state — concept stability/difficulty/stage never change
4. Timer shows static "0:30" / "1:30" text — never counts down
5. Answer reveal always shows "Incorrect" regardless of what was selected

WHAT TO BUILD:
Create a useSession hook at src/hooks/useSession.ts that:
- Holds session items (from buildSession), current index, and answer history
- Exposes onAnswer(selectedOption: number, timeTaken: number) that:
    * Checks correctness against concept.mcq.correct
    * Calls applyFSRS(concept, correct, timeTaken) to update FSRS state
    * Saves updated concept to localStorage
- Exposes advance(setScreen) that:
    * Routes to 'encoding' ONLY when current queue === 'new'
    * Routes to 'complete' when on last question
    * Otherwise advances to next question index

Create a useTimer hook at src/hooks/useTimer.ts that:
- Counts down from limitSeconds using setInterval in useEffect
- Calls onExpire() when it hits 0
- Returns { timeLeft, reset }
- Timer limit: Biology = 30 seconds, Physics/Chemistry = 90 seconds

Fix LiveSession.tsx:
- Import and use useTimer — show real countdown
- Show concept.mcq.question (not hardcoded text)
- Show concept.mcq.options[0-3] (not hardcoded options)
- On CONFIRM: check selected index vs concept.mcq.correct
- Show CheckCircle2 + green "Correct" OR XCircle + red "Incorrect" based on actual answer
- Call onAnswer() then advance() after Next button

The correct session flow is:
Dashboard → [Start Session] → LiveSession 
  → (answer confirmed, queue !== 'new') → next question
  → (answer confirmed, queue === 'new') → ConceptEncoding → back to LiveSession
  → (last question answered) → SessionComplete
  → [Home] → Dashboard with updated Chitta Score

Keep all existing styling. Only fix the logic and routing.
```

---

### TASK 2 — Add real MCQ data to all concepts

```
TASK: Add a real MCQ, explanation, oneLiner, and encodingTip to every concept
in MOCK_CONCEPTS. Currently all 33 concepts have no question data.

Add these fields to the Concept interface in App.tsx:

interface MCQ {
  question: string;
  options: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  explanation: string;  // shown after answer reveal
}

interface Concept {
  // ... existing fields stay the same
  mcq: MCQ;
  explanation: string;      // 100-150 words, shown in ConceptEncoding
  oneLiner: string;         // the COMPRESS step: 1-sentence rule extraction
  encodingTip: string;      // subject + concept specific study tip
  relatedConcepts: string[]; // other concept ids connected to this one
}

Write real NEET-accurate MCQs for all 33 concepts:
Biology (b1-b15): Mendelian Laws, DNA Replication, Lac Operon, Hardy-Weinberg,
  Krebs Cycle, C3/C4 Plants, Light Reactions, Nephron, Cardiac Cycle, Meiosis,
  Endocrine Glands, Ecosystem Energy, Sexual Reproduction Plants, Five Kingdom, rDNA

Chemistry (c1-c10): Markovnikov, SN1/SN2, Electrophilic Aromatic Sub, VSEPR,
  Arrhenius, Nernst, Le Chatelier, Aldol Condensation, p-Block Group 17, Van't Hoff

Physics (p1-p8): Young's Double Slit, Lens Maker's Formula, Gauss's Law,
  LCR Resonance, Faraday's Laws, Projectile Motion, Photoelectric Effect, Bohr Model

Requirements for each MCQ:
- Question style: NEET PYQ style (application, not pure recall)
- 4 options with only 1 correct, other 3 are plausible distractors
- Explanation: why correct is correct + why each wrong option is wrong
- oneLiner: one sentence that contains the essential rule (e.g., "Krebs cycle: 1 turn → 1 ATP + 3 NADH + 1 FADH₂ + 2 CO₂")
- encodingTip: specific to the concept's subject area

Make all answers scientifically accurate and NEET syllabus compliant.
```

---

### TASK 3 — Implement FSRS engine properly

```
TASK: Create src/engine/fsrs.ts with the complete FSRS implementation.

The file must export:

1. calculateR(stability: number, daysSince: number): number
   Formula: R = e^(-t / S)
   Return 0 if daysSince < 0 or stability <= 0

2. isDue(concept: Concept): boolean
   Returns true when stage !== 'Unseen' AND R < 0.85

3. applyFSRS(concept: Concept, correct: boolean, responseTime: number): Concept
   
   Rules:
   - Wrong: S_new = 1, D_new = min(1, D + 0.15)
   - Correct + slow (> optimalTime): S_new = S * 1.2, D_new = max(0, D - 0.05)
   - Correct + fast (≤ optimalTime): S_new = S * 1.5, D_new = max(0, D - 0.10)
   - optimalTime: Biology = 30s, Chemistry/Physics = 90s
   
   Stage transitions:
   - correct + Unseen → Fragile
   - correct + Fragile + S_new > 5 → Conscious
   - correct + Conscious + S_new > 20 → Automatic
   - wrong + Automatic → Conscious
   - wrong + Conscious → Fragile
   
   Return full updated Concept with:
   - stability: parseFloat(sNew.toFixed(2))
   - difficulty: parseFloat(dNew.toFixed(2))
   - stage: updated stage
   - lastTested: 0 (just reviewed = 0 days ago)
   - nextReview: Math.ceil(sNew)

4. buildSession(concepts: Concept[], totalQ: number): SessionItem[]
   
   Move the existing buildSession function from App.tsx to here.
   Ensure interleaving: never 2 same subject OR same chapter in a row.
   Queue composition: 35% DUE, 30% NEW, 25% STRENGTHEN, 10% CHALLENGE
   Subject ratio: Biology 50%, Chemistry 25%, Physics 25%

Export all types needed. Remove duplicates from App.tsx after creating this file.
```

---

### TASK 4 — Add localStorage persistence

```
TASK: Add persistence so concept FSRS state survives page refresh.

Create src/hooks/usePersistence.ts:

const STORAGE_KEY = 'chitta_concept_states';

export const usePersistence = (initialConcepts: Concept[]) => {
  const loadStates = (): Record<string, Partial<Concept>> => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  };

  const mergeWithSaved = (concepts: Concept[]): Concept[] => {
    const saved = loadStates();
    return concepts.map(c => ({
      ...c,
      ...(saved[c.id] ?? {}),
    }));
  };

  const saveState = (concepts: Concept[]) => {
    const states: Record<string, Partial<Concept>> = {};
    concepts.forEach(c => {
      states[c.id] = {
        stage: c.stage,
        stability: c.stability,
        difficulty: c.difficulty,
        lastTested: c.lastTested,
        nextReview: c.nextReview,
      };
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
  };

  const resetAll = () => localStorage.removeItem(STORAGE_KEY);

  return { mergeWithSaved, saveState, resetAll };
};

In App.tsx:
- Use mergeWithSaved(MOCK_CONCEPTS) as initial state
- Call saveState(concepts) after every onAnswer

Add a "Reset Progress" button somewhere in the Dashboard or SessionComplete
that calls resetAll() and reloads the page. This is needed for testing.
```

---

### TASK 5 — Fix ConceptEncoding to use real concept data

```
TASK: Fix ConceptEncoding screen so it shows actual content for the current concept
instead of hardcoded Biology/Chemistry/Physics paragraphs.

Currently the screen:
- Shows a hardcoded explanation that ignores the actual concept
- Has a modality selector (Read/Listen/Draw/Quiz) with no state
- "I UNDERSTAND THIS" button routes to 'map' instead of back to session

Fix all three:

1. Use actual concept data:
   - Show concept.explanation (the 150-word explanation from the concept object)
   - Show concept.oneLiner in the italic subtitle slot
   - Show concept.encodingTip in the Brain tip box
   - Replace the square visual area placeholder text with "Diagram: {concept.name}"

2. Make modality selector stateful:
   Add: const [activeModality, setActiveModality] = useState(defaultModality)
   Wire each button onClick to setActiveModality(m.id)
   Replace defaultModality check with activeModality === m.id

3. Fix routing:
   "I UNDERSTAND THIS" should call afterEncoding(setScreen) from useSession hook
   This routes to the next session question or SessionComplete if session done
   
   Add a second button below: "Need more time →" which stays on this screen
   (resets modality to 'read' and scrolls to top)

Keep all existing styling exactly. Only fix the logic.
```

---

### TASK 6 — Fix MorningRecall to accept real input

```
TASK: Fix the MorningRecall screen so students can actually type their recall answers.

Currently the blank lines (L851-856) are decorative divs — can't type in them.

Replace each decorative blank line with an actual textarea:

const [recalls, setRecalls] = useState(['', '', '']);
const [revealed, setRevealed] = useState(false);

For each blank slot:
<div className="border-b border-primary/20 min-h-[40px] flex items-start gap-4 py-2">
  <span className="text-[10px] text-on-surface-variant/20 font-bold mt-1">0{i+1}.</span>
  <textarea
    value={recalls[i]}
    onChange={e => setRecalls(prev => { const n=[...prev]; n[i]=e.target.value; return n; })}
    placeholder="type from memory..."
    className="flex-1 bg-transparent text-on-surface resize-none outline-none 
               text-sm leading-relaxed placeholder:text-on-surface-variant/20"
    rows={2}
    disabled={revealed}
  />
</div>

"Reveal Answer" button should:
- Set revealed = true (disables all textareas)
- Show the actual answer below: concept.oneLiner
- Show 3 self-grade buttons:
    "Got it ✓"   → applyFSRS(concept, true, 15)   [fast correct]
    "Almost ~"   → applyFSRS(concept, true, 45)   [slow correct]  
    "Missed ✗"   → applyFSRS(concept, false, 0)   [wrong]
- After grading → advance to next recall concept or to 'complete'

The morning recall concepts are the 5 most due concepts (lowest R).
Show dots at the bottom indicating which recall card you're on (1 of 5).
After all 5 recalled → route to Dashboard.
```

---

### TASK 7 — Fix ChittaMap connections and animations

```
TASK: Fix 2 bugs in ChittaMap and add concept connection lines.

BUG 1 — Fragile animation:
Line 683: stage: 'Fragile' currently has className "animate-ping"
animate-ping creates a ripple that disappears — nodes are invisible at rest
Change to "animate-pulse" — nodes will gently pulse red, visible always

BUG 2 — Positions cluster too tightly:
The getPos function uses radius 0.25-0.40 which packs everything in center
Change radius calculation to: 0.15 + (concept.pyqTier === 1 ? 0.25 : concept.pyqTier === 2 ? 0.15 : 0.05)
This spreads Tier 1 (most important) near the edges, Tier 4 in center

FEATURE — Connection lines between related concepts:
Add SVG lines between concepts that share relatedConcepts:

In the concept nodes rendering section, before the dots, add:
<svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex: 1}}>
  {visible.map((concept, i) => {
    const pos = getPos(concept, i);
    return concept.relatedConcepts
      .map(relId => {
        const relIdx = visible.findIndex(c => c.id === relId);
        if (relIdx === -1) return null;
        const relPos = getPos(visible[relIdx], relIdx);
        return (
          <line
            key={`${concept.id}-${relId}`}
            x1={pos.left} y1={pos.top}
            x2={relPos.left} y2={relPos.top}
            stroke="rgba(124,111,255,0.08)"
            strokeWidth="1"
          />
        );
      });
  })}
</svg>

When a node is selected (selectedNode !== null), highlight its connections:
Change stroke to "rgba(124,111,255,0.4)" for lines connected to selectedNode.
```

---

### TASK 8 — Gemini AI integration for teach-back grading

```
TASK: Add Gemini AI grading to the ConceptEncoding "I UNDERSTAND THIS" flow.

Instead of immediately routing away when student clicks "I UNDERSTAND THIS",
add a teach-back step:

1. Show a textarea: "Explain this concept in your own words (60 seconds)"
   With a 60-second countdown timer above it
   
2. When student submits (or timer expires), send to Gemini:

const gradeTeachBack = async (concept: Concept, studentText: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `
You are grading a NEET student's understanding of: "${concept.name}" (${concept.chapter}, ${concept.subject})

The correct one-liner is: "${concept.oneLiner}"

Student explanation: "${studentText}"

Grade on 3 axes from 0 to 2:
- accuracy: are the key facts correct? (0=wrong facts, 1=partially correct, 2=fully correct)
- completeness: are the key points covered? (0=missing main idea, 1=partial, 2=complete)  
- clarity: would another NEET student understand this? (0=unclear, 1=okay, 2=clear)

Return ONLY valid JSON, no other text:
{"accuracy": 0-2, "completeness": 0-2, "clarity": 0-2, "feedback": "one sentence of specific feedback", "score": 0-6}
  `;
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });
  return JSON.parse(response.text);
};

3. Map score to FSRS response quality:
   score 5-6 → applyFSRS(concept, true, 20)   [fast correct — deep understanding]
   score 3-4 → applyFSRS(concept, true, 60)   [slow correct — partial understanding]
   score 0-2 → applyFSRS(concept, false, 0)   [wrong — re-encode from scratch]

4. Show the result with:
   - Score ring (score/6)
   - AI feedback text
   - The correct oneLiner shown in full
   - "Continue →" button to advance session

Show a loading state ("Chitta is thinking...") while Gemini responds.
Add error handling — if Gemini fails, fall back to self-grade (Got it / Almost / Missed).
```

---

### TASK 9 — AI-powered session complete insights

```
TASK: Replace the hardcoded AI Insight text in SessionComplete with real Gemini analysis.

Currently SessionComplete shows:
"Error Pattern: ATP yield counting in Krebs (Bio, Tier 1). 3 questions re-queued..."
This is hardcoded text that never changes.

Replace with dynamic Gemini analysis of actual wrong answers from the session.

The useSession hook exposes answers: SessionAnswer[] — use this.

const generateInsight = async (answers: SessionAnswer[], concepts: Concept[]) => {
  const wrongAnswers = answers
    .filter(a => !a.correct)
    .map(a => {
      const c = concepts.find(x => x.id === a.conceptId);
      return `${c?.name} (${c?.chapter}, ${c?.subject}) — stability was ${a.sBefore}d`;
    });

  if (wrongAnswers.length === 0) return "Perfect session. No errors to analyze.";

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `
A NEET 2026 student just completed a study session and got these wrong:
${wrongAnswers.join('\n')}

In 2-3 sentences, identify:
1. The dominant error pattern (what type of mistake is recurring?)
2. One specific action they should take tomorrow

Be direct, specific, and encouraging. No generic advice. Max 60 words.
  `;
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });
  return response.text;
};

In SessionComplete:
- Call generateInsight on mount (useEffect)
- Show a loading shimmer in the AI Insight card while waiting
- Replace hardcoded text with the result
- If Gemini fails, show: "Analyze your wrong answers manually today."

Keep the existing card layout and Sparkles icon. Only replace the text content.
```

---

### TASK 10 — Split App.tsx into component files

```
TASK: Split the monolithic App.tsx (1030 lines) into separate files.

Create this exact structure:

src/
  data/
    concepts.ts          ← MOCK_CONCEPTS array (all concept data)
    constants.ts         ← NEET_TOTALS, SUBJECT_WEIGHTS, NEET_QUESTIONS, GLOBAL_STATS,
                            SUBJECT_COLORS, SUBJECT_BG, SUBJECT_EMOJI, QUEUE_LABELS,
                            ENCODING_TIPS
  engine/
    fsrs.ts              ← calculateR, isDue, applyFSRS, buildSession
  components/
    screens/
      Dashboard.tsx      ← Dashboard component
      LiveSession.tsx    ← LiveSession component  
      ConceptEncoding.tsx ← ConceptEncoding component
      ChittaMap.tsx      ← ChittaMap component
      MorningRecall.tsx  ← MorningRecall component
      SessionComplete.tsx ← SessionComplete component
    ui/
      GlassCard.tsx      ← GlassCard component
      BottomNav.tsx      ← BottomNav component
      StatusBar.tsx      ← StatusBar component
      TierBadge.tsx      ← TierBadge component
  hooks/
    useSession.ts        ← session state management
    useTimer.ts          ← countdown timer
    usePersistence.ts    ← localStorage read/write
  types/
    index.ts             ← all TypeScript interfaces and types
  App.tsx                ← routing only, ~50 lines

Rules:
- Do not change any existing logic or styling during this split
- Each component file gets its own imports
- All types go in src/types/index.ts and are imported from there
- App.tsx after split should only contain: useState for screen, useMemo for session, 
  AnimatePresence routing, BottomNav, StatusBar
- Verify every import resolves correctly before finishing

Start with types/index.ts, then constants.ts, then engine/fsrs.ts, 
then ui components, then screens, then App.tsx last.
```

---

## COMBINING TASKS

To do multiple tasks in one session, stack them:

```
[SYSTEM CONTEXT from above]

I need you to do Tasks 1 and 4 together:
[TASK 1 text]
[TASK 4 text]

Do Task 1 first (session flow fix), then Task 4 (persistence).
After each task, show me the complete updated file before moving to the next.
```

---

## CONTENT GENERATION PROMPT

Use this to generate MCQ content for any concept:

```
You are a NEET 2026 expert. Generate accurate content for this concept:

Concept: [CONCEPT NAME]
Subject: [Biology / Chemistry / Physics]
Chapter: [CHAPTER NAME]
PYQ Tier: [1 = asked 15+ times in 20 years / 2 = asked 8-14 times]

Generate:

1. MCQ (NEET PYQ style — application, not pure recall):
   - Question (one sentence)
   - 4 options (A, B, C, D) — 1 correct, 3 plausible distractors
   - Correct answer index (0=A, 1=B, 2=C, 3=D)
   - Explanation (why correct is correct + why each wrong is wrong, ~60 words)

2. explanation: 120-150 word explanation a student can understand in 2 minutes
   Start with the core idea, then mechanism, then exam relevance

3. oneLiner: single sentence rule extraction (the COMPRESS step)
   Format: "[Concept]: [essential rule with numbers/specifics]"
   Example: "Krebs cycle (1 turn): 1 ATP + 3 NADH + 1 FADH₂ + 2 CO₂"

4. encodingTip: specific study advice for THIS concept
   Should reference the best modality (draw/derive/visualize/mnemonic)
   2 sentences max

5. relatedConcepts: list 2-3 concept names this connects to in the NEET syllabus

Return as a TypeScript object literal that fits this interface:
{
  mcq: { question, options: [string,string,string,string], correct: 0|1|2|3, explanation },
  explanation: string,
  oneLiner: string,
  encodingTip: string,
  relatedConcepts: string[]  // use concept names, not IDs
}
```

---

## DESIGN RULES (never break these)

When generating any UI code:

```
1. Background: #080B14 (never white, never light)
2. Glass cards: className="glass-card rounded-[2rem] p-6"
3. Colors in use:
   - Primary (purple): text-primary, bg-primary
   - Success (green): text-success, bg-success  
   - Error (red): text-error, bg-error
   - Tertiary (amber): text-tertiary, bg-tertiary
4. Typography:
   - Headlines: font-headline font-bold
   - Labels/caps: font-label uppercase tracking-widest text-[10px]
   - Body: text-on-surface-variant leading-relaxed
5. Animations: always use Motion (not CSS transitions for screen changes)
6. Mobile first: max-w-md mx-auto, pb-32 for bottom nav clearance, pt-16 for status bar
7. Buttons: rounded-2xl py-4 or py-5, font-headline font-bold tracking-widest
8. Never use white backgrounds inside cards
9. Spacing: prefer gap-based layouts, not margin soup
10. Icons: always from lucide-react, size={16} or size={20} standard
```

---

## QUICK FIXES PROMPT

For small isolated bugs, use this:

```
Context: CHITTA is a React + TypeScript NEET exam prep app with dark glass morphism UI.
File: [FILENAME]
Lines: [LINE RANGE]

Bug: [DESCRIBE THE BUG]
Expected: [WHAT SHOULD HAPPEN]
Current code: [PASTE THE BROKEN CODE]

Fix only the specific bug. Do not refactor surrounding code. 
Keep all styling identical. Show the corrected code block.
```

---

*This prompt file is the bridge between the R&D vision (RND_PLANNING.md) and actual code.*
*Each task prompt is self-contained — paste system context + one task prompt to any AI.*
