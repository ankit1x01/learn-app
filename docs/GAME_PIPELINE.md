# Game Data Pipeline Documentation

## Overview

The Game Data Pipeline is a system for managing game content, tracking player performance, and integrating game results into the FSRS spaced repetition engine. It supports:

- **Pre-authored content** (JSON files bundled at build time)
- **Generated content** (Gemini API on-demand)
- **Performance tracking** (localStorage persistence)
- **FSRS integration** (immediate spaced repetition updates)

---

## Architecture

### Three-Layer System

```
┌─────────────────────────────────────────────────┐
│ 1. Content Management                           │
│    - GameContentStore (fetch/cache)             │
│    - Bundled (JSON) + Generated (Gemini)       │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│ 2. Game Rendering                               │
│    - Game components display content            │
│    - Player interacts and completes challenge   │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│ 3. Performance & FSRS                           │
│    - GamePerformanceStore saves results         │
│    - updateFSRSFromGamePerformance updates SR   │
│    - Concept next review is scheduled           │
└─────────────────────────────────────────────────┘
```

---

## Adding Game Content

### Option 1: Pre-Authored Content (Fast)

Create a JSON file in `src/data/game-content/`:

**File: `src/data/game-content/memory.json`**
```json
[
  {
    "id": "mem_123",
    "conceptId": "cs_005",
    "difficulty": "easy",
    "source": "preauthored",
    "createdAt": 1714425600000,
    "content": {
      "items": [
        { "name": "Term 1", "definition": "Definition 1" },
        { "name": "Term 2", "definition": "Definition 2" }
      ]
    },
    "metadata": {
      "gameType": "memory",
      "requiredFields": ["items"],
      "expectedDuration": 30000
    }
  }
]
```

**Then:**
```bash
npm run bundle-game-content  # Auto-includes your new content
npm run dev                   # Content available in app
```

### Option 2: Generate from Concept

Use the generator for dynamic content:

```typescript
import { generateGameContent } from '@/lib/game-content-generator';
import { concepts } from '@/db/useConceptStore';

const concept = concepts.find(c => c.id === 'cs_005');
const gameContent = await generateGameContent(concept, 'memory');
await gameContentStore.cacheGameContent(gameContent);
```

---

## Content Structure

### GameContent Type

```typescript
type GameContent = {
  // Identification
  id: string;                    // Unique ID (e.g., "mem_001")
  conceptId: string;             // Concept this game tests
  
  // Content data (flexible per game type)
  content: Record<string, any>;  // Game-specific payload
  
  // Metadata
  difficulty: 'easy' | 'medium' | 'hard';
  source: 'preauthored' | 'generated';
  createdAt: number;            // Timestamp
  
  // Game info
  metadata: {
    gameType: string;           // 'memory', 'challenge', 'simulation'
    requiredFields: string[];   // What the game needs from content
    expectedDuration: number;   // ms
  };
};
```

### Content Payload Examples

**Memory Game:**
```typescript
{
  items: [
    { name: "Variable", definition: "Named storage location" },
    { name: "Function", definition: "Reusable code block" }
  ]
}
```

**Challenge Game:**
```typescript
{
  question: "What is X?",
  options: ["A", "B", "C", "D"],
  correctIndex: 1,
  explanation: "Because..."
}
```

**Simulation Game:**
```typescript
{
  title: "Projectile Motion",
  variables: {
    velocity: { min: 0, max: 50, unit: "m/s", default: 30 },
    angle: { min: 0, max: 90, unit: "degrees", default: 45 }
  },
  expectedOutcome: "Parabolic trajectory"
}
```

---

## Performance Tracking

### How It Works

1. **Game completes** → Player attempts/masters challenge
2. **Performance saved** → `GamePerformanceStore.save()`
3. **FSRS updated** → `updateFSRSFromGamePerformance()`
4. **Concept scheduled** → Next review based on new stability

### GamePerformance Type

```typescript
type GamePerformance = {
  id: string;              // UUID
  gameContentId: string;   // Which content was used
  conceptId: string;       // What concept it tested
  gameType: string;        // Type of game
  score: number;           // 0-100 percentage
  passed: boolean;         // score >= 75
  timeSpent: number;       // milliseconds
  completedAt: number;     // timestamp
};
```

### Storage

Stored in localStorage at key: `game_perf_<conceptId>`

```typescript
const perf = await gamePerformanceStore.getForConcept('cs_001');
// Returns array of all performance records for this concept
```

---

## FSRS Integration

### Scoring Rule

```
If score >= 75: treat as perfect recall (100%) → advance stage
If score < 75:  treat as failed (0%)         → regress stage
```

### Stability Update

```
Success (≥75%):
  newStability = currentStability × e^(0.1 * (1 - retrievability))

Failure (<75%):
  newStability = currentStability × 0.4  (reset)
```

### Example

```typescript
const updateResult = updateFSRSFromGamePerformance(
  'Fragile',  // current stage
  2,          // current stability (days)
  0.5,        // current difficulty
  85          // game score (%)
);

// Result:
// {
//   stage: 'Conscious',
//   stability: 3.2,
//   difficulty: 0.45,
//   quizScore: 100,
//   nextReviewDays: 3
// }
```

---

## API Reference

### GameContentStore

```typescript
gameContentStore.init(bundledData)           // Initialize at app startup
gameContentStore.getGameContent(
  conceptId, 
  gameType,
  options?: { forceGenerate?: boolean }
)                                            // Get content for a concept
gameContentStore.loadAllContentForGameType(gameType)
                                            // Bulk load all of a type
gameContentStore.cacheGameContent(content)  // Save generated content
gameContentStore.hasContent(conceptId, gameType)
                                            // Check availability
```

### GamePerformanceStore

```typescript
gamePerformanceStore.save(performance)       // Save a performance record
gamePerformanceStore.getForConcept(conceptId)
                                            // Get all perf for concept
gamePerformanceStore.createPerformance(
  gameContentId,
  conceptId,
  gameType,
  score,
  timeSpent
)                                           // Create + save in one call
gamePerformanceStore.getLatest(conceptId, gameType)
                                            // Get most recent perf
```

---

## Development & Testing

### Test the Pipeline

In browser console:
```javascript
await testGamePipeline();
```

Outputs:
- Content loaded count
- Performance tracking verification
- FSRS integration check

### Add New Game Type

1. Create content JSON: `src/data/game-content/<type>.json`
2. Update prompt template in `game-content-generator.ts`
3. Run `npm run bundle-game-content`
4. Games automatically detect and use new type

### Common Patterns

**Fetch content for a concept:**
```typescript
const content = await gameContentStore.getGameContent('cs_001', 'memory');
if (content) {
  renderGame(content.content); // Use content.content payload
}
```

**Record performance:**
```typescript
const perf = await gamePerformanceStore.createPerformance(
  contentId, conceptId, gameType, userScore, timeTaken
);
```

**Update concept FSRS:**
```typescript
const updated = updateFSRSFromGamePerformance(
  concept.stage, concept.stability, concept.difficulty, perf.score
);
await onUpdateConcept(concept.id, updated);
```

---

## Current Status

| Component | Status | Location |
|-----------|--------|----------|
| Content Store | ✅ Complete | `src/lib/game-content-store.ts` |
| Performance Store | ✅ Complete | `src/lib/game-performance-store.ts` |
| FSRS Integration | ✅ Complete | `src/core/fsrs.ts` |
| Content Bundler | ✅ Complete | `scripts/bundle-game-content.mjs` |
| Gemini Generator | 🔄 Ready | `src/lib/game-content-generator.ts` |
| Sample Content | ✅ 12 items | `src/data/game-content/` |
| LiveSession Wiring | ✅ Complete | `src/screens/LiveSession.tsx` |

---

## Future Extensions

- **Difficulty Adaptation:** Use time spent to adjust game difficulty on replay
- **Content Analytics:** Track which content is most effective
- **Personalization:** Recommend games based on weak concepts
- **Database Sync:** Migrate from localStorage to Supabase
- **Community Content:** User-authored game content sharing
