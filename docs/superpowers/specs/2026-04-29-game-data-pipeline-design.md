# Game Data Pipeline Design
**Date:** 2026-04-29  
**Status:** Design Approved  
**Scope:** End-to-end pipeline for game content, performance tracking, and FSRS integration

---

## Overview

Currently, CHITTA has 50+ games (memory, physics simulations, challenge games) but **no content** to power them. This pipeline enables:

1. **Content Management** — Pre-authored + AI-generated game challenges
2. **Performance Tracking** — Capture player success/failure
3. **Learning Integration** — Feed results into FSRS spaced repetition

**Key Principle:** Simple start (pre-authored + generated content in localStorage), extensible later (database, analytics, personalization).

---

## Content Structure

### GameContentData (What games display)

```typescript
type GameContentData = {
  id: string;                          // UUID
  conceptId: string;                   // Links to Concept in store
  content: Record<string, any>;        // Flexible payload
  correctAnswer?: string;              // For games with answers
  difficulty: 'easy' | 'medium' | 'hard';
  source: 'preauthored' | 'generated'; // Tracks origin
  createdAt: number;                   // Timestamp
};
```

**content field examples:**
- **Memory Game:** `{ names: [...], definitions: [...], pairs: [...] }`
- **Challenge Game:** `{ question: string, options: string[], explanation: string }`
- **Simulation:** `{ problemDescription: string, variables: {...}, expectedOutcome: string }`

### GameContentMetadata (What games expect)

```typescript
type GameContentMetadata = {
  gameType: string;              // 'memory' | 'challenge' | 'simulation' | etc.
  requiredFields: string[];      // Fields game needs (e.g., ['question', 'options'])
  expectedDuration: number;      // ms — hint for adaptive difficulty
};
```

### Combined Type

```typescript
type GameContent = GameContentData & { 
  metadata: GameContentMetadata 
};
```

---

## Content Sources

### Pre-Authored Content

**Location:** `src/data/game-content/` — organized by game type

**Example: memory-content.json**
```json
[
  {
    "id": "mem_001",
    "conceptId": "cs_001_variables",
    "difficulty": "easy",
    "content": {
      "names": ["Variable Declaration", "Type Inference", "Scope"],
      "definitions": ["Allocate memory", "Compiler deduces type", "Visibility range"],
      "pairs": [[0, 0], [1, 1], [2, 2]]
    },
    "metadata": {
      "gameType": "memory",
      "requiredFields": ["names", "definitions", "pairs"],
      "expectedDuration": 30000
    }
  }
]
```

**Build Pipeline:**
1. `scripts/bundle-game-content.mjs` — runs at `npm run dev` and `npm run build`
2. Reads all JSON files from `src/data/game-content/`
3. Outputs `src/data/bundled-game-content.ts` (exported object)
4. App loads at startup via `GameContentStore.init()`

### Generated Content

**Trigger:** On-demand when game needs content and cache miss occurs

**Implementation:**
```typescript
// src/lib/game-content-generator.ts
async function generateGameContent(
  concept: Concept,
  gameType: string
): Promise<GameContent> {
  const prompt = buildPromptForGameType(concept, gameType);
  const response = await geminiClient.generateContent(prompt);
  const parsed = parseGameContent(response.text);
  return { ...parsed, source: 'generated', createdAt: Date.now() };
}
```

**Caching:** Result saved to `localStorage['game_content_<conceptId>_<gameType>']`

---

## Content Storage & Retrieval

### GameContentStore API

**File:** `src/lib/game-content-store.ts`

```typescript
type GameContentStore = {
  // Initialize with bundled content
  init(): Promise<void>;

  // Get content for concept + game type
  getGameContent(
    conceptId: string,
    gameType: string,
    options?: { forceGenerate?: boolean }
  ): Promise<GameContent | null>;

  // Bulk load all content for a game type
  loadAllContentForGameType(gameType: string): Promise<GameContent[]>;

  // Save newly generated content to cache
  cacheGameContent(content: GameContent): void;

  // Check availability
  hasContent(conceptId: string, gameType: string): boolean;
};
```

### Fetching Logic

**Sequence:**
1. Check bundled (pre-authored) content → return if found
2. Check localStorage cache → return if found
3. If `forceGenerate=true` or cache TTL expired → call `generateGameContent()`
4. Save to localStorage
5. Return generated content

**In a game component:**
```typescript
const store = useGameContentStore();
const content = await store.getGameContent(conceptId, 'memory');

if (!content) {
  // Fallback: show empty state or skip
  return <EmptyState />;
}

return <MemoryGame {...content.content} />;
```

---

## Performance Tracking

### GamePerformance Record

```typescript
type GamePerformance = {
  id: string;                     // UUID
  gameContentId: string;          // Which content was used
  conceptId: string;              // What concept it tested
  gameType: string;               // Type of game
  
  // Scoring
  score: number;                  // 0-100 percentage
  passed: boolean;                // score >= 75
  
  // Timing
  timeSpent: number;              // milliseconds
  completedAt: number;            // timestamp
};
```

### Storage

**Per-concept log:** `localStorage['game_perf_<conceptId>']`

**Structure:**
```typescript
type GamePerformanceLog = GamePerformance[];
```

### Saving Performance

```typescript
// In game completion handler (LiveSession or GameRunner)
const performance: GamePerformance = {
  id: generateUUID(),
  gameContentId: content.id,
  conceptId: concept.id,
  gameType: content.metadata.gameType,
  score: calculateScore(userAnswer, correctAnswer),
  passed: calculateScore(...) >= 75,
  timeSpent: endTime - startTime,
  completedAt: Date.now(),
};

await gamePerformanceStore.save(performance);
```

---

## FSRS Integration

### Performance → FSRS Update

```typescript
// src/core/fsrs.ts — extend existing logic
export function updateFSRSFromGamePerformance(
  concept: Concept,
  performance: GamePerformance
): Concept {
  // Normalize to 0-1 scale
  const score = performance.score / 100;
  
  // Simple rule: passed (≥75%) = perfect recall (1.0), else failed (0.0)
  const fsrsScore = performance.passed ? 1.0 : 0.0;
  
  // Reuse existing quiz update logic
  return updateFSRSFromQuiz(concept, fsrsScore);
}
```

### Timing

**Immediate Update (Recommended):**
- Game completes → save performance → update FSRS → next review scheduled
- Keeps learning loop tight and responsive
- Called in LiveSession.tsx where games already integrate

**Implementation:**
```typescript
// In LiveSession or GameRunner, after game finishes
const updatedConcept = updateFSRSFromGamePerformance(concept, performance);
await onUpdateConcept(updatedConcept);
```

---

## File Structure

```
src/
├── lib/
│   ├── game-content-store.ts          ← Fetch/cache API
│   ├── game-content-generator.ts      ← Gemini integration
│   └── game-performance-store.ts      ← Track perf
├── data/
│   ├── game-content/                  ← Pre-authored source
│   │   ├── memory-content.json
│   │   ├── challenge-content.json
│   │   └── simulation-content.json
│   └── bundled-game-content.ts        ← Auto-generated from JSON
├── core/
│   └── fsrs.ts                        ← Add updateFSRSFromGamePerformance
└── games/
    └── GameRunner.tsx / LiveSession.tsx ← Wire performance tracking

scripts/
└── bundle-game-content.mjs            ← Build-time bundler
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│ App Startup                                                 │
├─────────────────────────────────────────────────────────────┤
│ 1. Load bundled pre-authored content (GameContentStore.init) │
│ 2. Store in memory + available for games                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Game Needs Content                                          │
├─────────────────────────────────────────────────────────────┤
│ 1. Check bundled ✓ → serve                                  │
│ 2. OR check localStorage ✓ → serve                          │
│ 3. OR generate with Gemini → cache → serve                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Game Renders & Player Completes                             │
├─────────────────────────────────────────────────────────────┤
│ 1. Capture: score, timeSpent, passed/failed                 │
│ 2. Create GamePerformance record                            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Save & Update Learning                                      │
├─────────────────────────────────────────────────────────────┤
│ 1. Save to localStorage['game_perf_<conceptId>']            │
│ 2. updateFSRSFromGamePerformance(concept, perf)             │
│ 3. Save updated concept                                     │
│ 4. Next review scheduled via FSRS                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Phases

### Phase 1: Core Pipeline (2-3h)
- [ ] Create `GameContentStore` API
- [ ] Create `GamePerformanceStore` for tracking
- [ ] Write build script to bundle pre-authored content
- [ ] Wire FSRS update into game completion
- [ ] Create empty `src/data/game-content/` folder structure

### Phase 2: Content Creation (2-4h)
- [ ] Author sample content for 3-5 game types
- [ ] Test content delivery to games
- [ ] Validate FSRS updates
- [ ] Document content schema per game type

### Phase 3: Generation (1-2h)
- [ ] Implement `generateGameContent()` with Gemini
- [ ] Add caching logic
- [ ] Test on 2-3 concepts
- [ ] Measure generation latency

### Phase 4: Integration (1h)
- [ ] Wire into LiveSession game completion handler
- [ ] Test end-to-end: play game → see FSRS update
- [ ] Update BUILD_STATE.md

---

## Success Criteria

✅ Games can fetch content (pre-authored or generated)  
✅ Game performance is recorded  
✅ FSRS updates immediately after game completion  
✅ Content is cached (no re-generation on replay)  
✅ Build succeeds with zero TypeScript errors  
✅ Bundle size reasonable (<50KB for content)

---

## Future Extensions

- **Difficulty Adaptation:** Use `performance.timeSpent` to adjust difficulty on replay
- **Content Analytics:** Track which content is most effective (highest pass rate)
- **Personalization:** Recommend games based on weak concepts
- **Database:** Move from localStorage to Supabase for multi-device sync
- **Community Content:** User-authored game content sharing

---

## Notes

- **Storage Limits:** localStorage has ~5-10MB limit; monitor bundle size as content grows
- **Offline Support:** Pipeline works fully offline (cached content + localStorage)
- **Privacy:** No analytics transmitted — all data stays on device
- **Caching TTL:** Can add expiration to force regeneration of stale content (future)
