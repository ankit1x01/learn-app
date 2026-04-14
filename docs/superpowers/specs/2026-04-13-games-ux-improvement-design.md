# Games UX Improvement — Design Spec
**Date:** 2026-04-13  
**Status:** Approved  
**Scope:** Improve interaction model for all 4 existing games (ThisOrThat, Links, Chrono, Knockout)

---

## Problem

Drag-and-drop mechanics are unreliable and confusing on mobile:
- **ThisOrThat** — card text says "Drag up" but mechanic is drag left/right to columns; drop zones use raw screen coordinates that misfire
- **Links** — deck card is 56px tall (too small to grab); "DRAG CARD TO CENTER" zone gives no interactivity cue; overall mechanic is opaque
- **Chrono** — drag reorder works but has no button fallback; `ArrowUp`/`ArrowDown` icons imported but never rendered
- **Knockout** — "vs" badge is `position: absolute` inside a flex row with no `relative` parent, so it doesn't center correctly

---

## Solution: Tap-to-Assign (Option B)

Replace drag with explicit tap interactions across all games. No drag removed from Chrono (it works); only button fallback added.

---

## Game-by-Game Design

### 1. ThisOrThat

**New flow:**
- Show one card at a time centered on screen (large colored card with label)
- Progress indicator: `Card 3 of 10 sorted`
- Two large tap buttons below the card, labeled with the column names (e.g., "Stack" | "Queue")
- Tapping a button assigns the card and animates it sliding into that column's visible stack at the top
- Column stacks remain visible at the top so the user tracks their placements
- Once all cards are assigned, the existing **Check** button appears
- Cards already placed in a column stack can be tapped to remove them back to the unassigned queue (shown at the end of the sequence)
- **Hint** assigns the current card to its correct column and advances

**Removes:** DraggableCard component, `info.point.x/y` drop detection, "Drag up" text

**State changes:**
- Replace `assigned` field logic: cards are now assigned one at a time sequentially
- `currentIndex` tracks which card is being shown
- Assigned cards tracked in `assignments: Record<string, 'A' | 'B'>`

---

### 2. Links

**New flow:**
- Attribute web (4 clues around center slot) stays exactly as-is
- Below the web, all available cards shown as a **tappable pill grid** (2-column layout)
- Tapping a card immediately attempts it as the answer (same logic as current `handlePlace`)
- Center slot flashes green (correct) or red (wrong) for 600ms, then advances
- Chevron `<` / `>` navigation buttons removed
- "DRAG CARD TO CENTER" dead-zone removed
- `DraggableDeckCard` component removed

**State changes:**
- Remove `deckIndex` state
- `currentCard` is no longer needed; tap directly passes the card to `handlePlace`
- Card grid shows all `availableCards` as buttons; correct one gets highlighted after attempt

---

### 3. Chrono

**New flow (additive only):**
- Keep existing `Reorder.Group` drag-to-reorder (works correctly)
- Add ↑ / ↓ tap buttons on the right side of each card row
- Buttons call the existing `move(index, 'up' | 'down')` function (already implemented, just not rendered)
- Locked cards (already correct) show disabled/greyed buttons
- `ArrowUp` / `ArrowDown` Lucide icons already imported — just wire them up

**No logic changes needed.**

---

### 4. Knockout

**Bug fix only:**
- Add `position: relative` to the flex row wrapping the two matchup cards
- This makes the absolutely-positioned "vs" badge correctly center between the cards
- No mechanic or scoring changes

---

## Files Changed

| File | Change |
|------|--------|
| `src/games/components/ThisOrThat.tsx` | Full rewrite of interaction layer; logic (check/hint/reset) preserved |
| `src/games/components/Links.tsx` | Remove DraggableDeckCard + deck nav; add tap grid |
| `src/games/components/Chrono.tsx` | Add ↑↓ buttons to each card row |
| `src/games/components/Knockout.tsx` | Add `relative` to matchup row wrapper |

**No changes to:** `types.ts`, `GameRunner.tsx`, `GamesScreen.tsx`, `dsa-dummy.ts`, `GameWinScreen.tsx`

---

## Out of Scope

- New game types (separate initiative)
- Timer display / streak counter
- New dummy data / subjects
- Score formula changes
- Win screen redesign
