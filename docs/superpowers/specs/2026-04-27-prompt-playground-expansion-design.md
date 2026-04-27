# Prompt Playground Expansion: Modular Course Packs Design

**Date:** 2026-04-27  
**Status:** Design Document (awaiting approval)  
**Audience:** CHITTA development team + general learners

---

## Overview

The current Prompt Playground teaches 9 Anthropic prompt engineering fundamentals through interactive templates. This expansion extends it with **3 specialty course packs** organized as:
- **Foundation Course** (9 chapters) — existing Anthropic tutorials
- **Patterns Pack** (5 chapters) — real-world prompt techniques
- **Advanced Tactics Pack** (6 chapters) — production-grade strategies
- **Domain Strategies Pack** (4 chapters) — task-specific approaches

**Total:** 24 chapters covering beginner → advanced prompt engineering.

---

## Goals

1. **Breadth** — Cover the full spectrum of prompt engineering from fundamentals to production
2. **Organization** — Modular structure lets users pick learning paths; each pack is independent
3. **Scalability** — New packs/chapters can be added without breaking existing content
4. **Accessibility** — Maintain the current hands-on testing model (share to Claude/ChatGPT)

---

## Solution

### Navigation Model

**Course Pack Selector** (new screen):
- Shows 4 course pack cards with chapter counts and brief descriptions
- User selects a pack → enters chapter list for that pack
- User picks a chapter → editor loads with templates filtered to that chapter
- "Switch Pack" button at any time returns to selector (saves progress per pack)

**Chapter Flow:**
- Foundation Pack: User can jump to any chapter (flexible)
- Specialty Packs: Linear progression (must complete ch1 before ch2, etc.)
- "Next Chapter" button advances within pack
- Chapter progress shown as "Ch X/Y complete"

**Visual hierarchy:**
```
Pack Selector
└─ Selected Pack
   └─ Chapter List
      └─ Editor (Templates | User Input)
         └─ Copy/Share to AI
```

---

## Content Outline

### Foundation Course (9 chapters)
**Existing Anthropic tutorials — no changes**
1. Basic Prompt Structure — User/Assistant prefix, system vs. user turns
2. Being Clear and Direct — Clarity beats cleverness; explicit constraints
3. Assigning Roles — Persona-based priming for tone/accuracy
4. Separating Data with XML — XML tags prevent prompt injection
5. Formatting & Prefilling — Put words in Claude's mouth; control output format
6. Thinking Step by Step — <thinking> tags for explicit reasoning
7. Few-Shot Examples — Examples beat descriptions
8. Avoiding Hallucinations — Grounding with context; explicit "I don't know"
9. Complex System Prompt — Combining all techniques in production scenario

---

### Patterns Pack (5 chapters)
**Real-world techniques for combining prompts and handling complexity**

1. **Prompt Chaining**
   - When to break tasks into sequences vs. single prompt
   - Example: Ask GPT to outline essay, then ask to write each section
   - Trade-offs: Cost/latency vs. quality/control

2. **Error Recovery & Guardrails**
   - Validation: Ask Claude to validate its own output
   - Retries: When to re-prompt vs. give up
   - Constraints: Hard guardrails (block lists, token limits)

3. **Multi-Turn Conversations**
   - Context management: what to include in each turn
   - Memory: when conversation history hurts vs. helps
   - Example: Tutoring session where prior explanations matter

4. **Prompt Injection Prevention**
   - Security basics: sanitizing user input in system prompts
   - XML tag defense: preventing user text from breaking prompt structure
   - Real example: Chatbot that shouldn't ignore safety guidelines

5. **Iterative Refinement**
   - A/B testing prompts: which phrasing works better?
   - Metrics: latency, cost, accuracy, user satisfaction
   - Process: test → measure → adjust

---

### Advanced Tactics Pack (6 chapters)
**Production-grade optimization and sophisticated techniques**

1. **Token Optimization**
   - Understanding token counts and costs
   - Compression tactics: remove filler, use abbreviations
   - Trade-off: brevity vs. clarity
   - Example: Reduce 2000-token system prompt to 1200 without losing quality

2. **Structured Output**
   - JSON schema extraction
   - Markdown parsing (tables, lists)
   - Guaranteed parsing: how to make Claude output reliable structures
   - Example: Extract names/emails from unstructured text

3. **Prompt Caching** (Claude-specific)
   - System prompt caching: reuse expensive context windows
   - Use cases: long docs, repeated queries, expensive preambles
   - Cost/performance trade-offs

4. **Self-Critique & Verification**
   - Meta-prompting: ask Claude to evaluate its own work
   - Verification loops: "Does this output match the requirements?"
   - Example: Coding task where Claude checks its own solution

5. **Cost-Quality Tradeoffs**
   - Model selection: Claude 3.5 Sonnet vs. Haiku
   - Temperature tuning: creativity vs. consistency
   - When cheaper models are sufficient vs. when you need top quality

6. **Scaling to Production**
   - Prompt versioning: tracking changes
   - A/B testing at scale: comparing variants with real users
   - Monitoring: tracking quality metrics over time
   - Batching: processing many items efficiently

---

### Domain Strategies Pack (4 chapters)
**Task-specific approaches for different use cases**

1. **Tutoring & Explanation**
   - Socratic method: asking guiding questions instead of answers
   - Scaffolding: breaking concepts into digestible pieces
   - Encouraging deeper thinking: "Why do you think that?"

2. **Code Generation & Debugging**
   - Technical precision: being specific about language/framework/version
   - Debugging guidance: asking Claude to explain the error, not just fix it
   - Context: providing stack traces, error messages, relevant code excerpts

3. **Creative Writing & Content**
   - Tone and style: specifying voice (formal/casual/humorous)
   - Constraint-based generation: "Write a poem with X syllables per line"
   - Examples matter more: show good/bad examples rather than describe style

4. **Data Analysis & Research**
   - Working with documents: best practices for feeding PDFs/papers to Claude
   - Extraction vs. analysis: when to ask for facts vs. interpretation
   - Synthesis: combining multiple sources into coherent summaries

---

## Data Model

**Template interface (extend existing):**
```typescript
interface Template {
  id: string;
  pack: 'foundation' | 'patterns' | 'advanced' | 'domain';
  chapter: number;                    // Chapter number within pack (1-N)
  chapterTitle: string;               // e.g., "Prompt Chaining"
  title: string;                      // e.g., "Breaking Tasks Into Sequences"
  technique: string;                  // e.g., "Patterns"
  techniqueColor: string;             // Hex color for visual identification
  lesson: string;                     // Explanation paragraph
  system: string;                     // System prompt example
  user: string;                       // User message example
  highlight?: string;                 // Key insight callout
}
```

**Pack metadata (new):**
```typescript
interface CoursePack {
  id: 'foundation' | 'patterns' | 'advanced' | 'domain';
  name: string;                       // Display name
  description: string;                // Brief description
  chapterCount: number;               // Total chapters
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string;                       // Material Symbols icon name
  color: string;                      // M3 color token
  linearProgress: boolean;            // Can user skip chapters?
}
```

**Progress tracking (new, per pack):**
```typescript
interface PackProgress {
  packId: string;
  currentChapter: number;             // Current chapter in pack
  chaptersCompleted: number[];        // Which chapters viewed
  lastAccessed: Date;
}
```

---

## Component Structure

**Current:**
```
PromptPlayground.tsx (one component, ~420 lines)
├─ TEMPLATES array
├─ Editor UI (tabs, inputs, share)
└─ Navigation (back to Elite Hub)
```

**New:**
```
PromptPlayground.tsx (parent component)
├─ CoursePackSelector.tsx (new)
│  └─ Shows pack cards, picks a pack
│
└─ PromptPlaygroundEditor.tsx (refactored from current)
   ├─ ChapterList.tsx (new)
   │  └─ Shows chapters in selected pack
   │
   └─ Editor UI (unchanged)
      ├─ Templates filtered by pack + chapter
      ├─ System/User inputs
      └─ Copy/Share buttons
```

**Data flow:**
1. PromptPlayground → CoursePackSelector: Show all packs
2. CoursePackSelector → PromptPlayground: User picks pack
3. PromptPlayground → PromptPlaygroundEditor: Load templates for pack
4. PromptPlaygroundEditor → Editor: Load chapter + templates

---

## Implementation Scope

### Phase 1: Infrastructure (MVP)
- Restructure TEMPLATES data by pack/chapter
- Create CoursePackSelector component
- Refactor current PromptPlayground into PromptPlaygroundEditor
- Add pack/chapter filtering to templates
- Progress tracking (localStorage/Capacitor Preferences)

### Phase 2: Content (Post-MVP)
- Write 15 new chapter lessons (Patterns, Advanced, Domain packs)
- Create 15 new template examples
- Design pack cards with icons/colors
- Add domain-specific icons per pack

### Phase 3: Polish (Optional)
- Animated transitions between packs
- Bookmark/resume feature
- "Recommended path" recommendations
- Export chapters as shareable notes

---

## Success Criteria

- ✅ Users can navigate between 4 course packs smoothly
- ✅ Each pack shows independent chapter list
- ✅ Progress tracked per pack (survives refresh)
- ✅ Templates load filtered by pack + chapter
- ✅ Share-to-AI feature works unchanged
- ✅ Zero TypeScript errors, M3 design compliance
- ✅ Mobile-responsive (current phone-first layout maintained)

---

## Future Enhancements (Out of Scope)

- Community-contributed templates
- Quizzes/assessments per chapter
- Video explanations alongside templates
- Prompt performance benchmarks (timing, cost)
- Integration with CHITTA courses (link exam concepts to relevant templates)
- Search across all packs and chapters

---

## Design Decisions & Rationale

| Decision | Rationale |
|----------|-----------|
| **Modular packs** | New chapters can be added without disrupting existing content; users aren't forced to take all 24 |
| **Linear progression in specialty packs** | Sequences build on each other (e.g., understand patterns before advanced tactics) |
| **Foundation pack remains flexible** | Anthropic fundamentals are standalone; users can jump to what interests them |
| **Keep share-to-AI unchanged** | Users learn by testing; live AI responses are the best feedback |
| **No built-in assessment** | Assessment happens naturally when users test prompts in Claude/ChatGPT |
| **Capacitor Preferences for progress** | Offline-first; no backend required, consistent with CHITTA architecture |

---

## Open Questions for User Approval

1. ✅ Should each pack be independent (no prerequisites between packs)?
   - *Decision: Yes, but within specialty packs, chapters are sequential*

2. ✅ Should progress carry over when switching packs?
   - *Decision: Yes, each pack tracks its own progress independently*

3. Should we show a "recommended path" (Foundation → Patterns → Advanced → Domain)?
   - *Current: Not MVP, but easy to add as a badge*

4. Should Foundation pack allow skipping chapters?
   - *Current: Yes, Anthropic fundamentals are standalone; specialty packs are linear*

---

## References

- Current implementation: `src/screens/PromptPlayground.tsx`
- Design tokens: `DESIGN_SYSTEM.md`
- Architecture: `docs/project/APP_BLUEPRINT.md`
