# Games Analysis — "Learned" App
**Theme studied:** All Tied Up  
**Source:** WhatsApp screenshots (2026-04-13)

---

## App Overview

A daily themed puzzle app with 4 game modes, all sharing a single topic each day. Clean, warm aesthetic. Subscription gates one mode (Knockout).

**Bottom nav:** Today | Archive | Profile  
**Streak counter** visible on home screen (top right)

---

## Home Screen

- Displays "Today's Theme" with a bold title (e.g., **All Tied Up**)
- 2×2 grid of game mode cards with folded-corner aesthetic
- Each card: color block + illustration + mode name + one-line description
- "Invite friends" share button below the grid

| Mode | Color | Tagline |
|------|-------|---------|
| This or That | Green | Pick a side |
| Chrono | Yellow | Order events |
| Links | Blue | Connect cards |
| Knockout | Orange | Choose a winner (locked) |

---

## Game Mode Breakdown

### 1. This or That
**Mechanic:** Two labeled columns. Drag cards into the correct column.

- Each column has a title + subtitle (e.g., "Tie — has ties or knots" / "Dye — type of ink or dye")
- Cards are color-coded tiles with text labels
- Some cards have a photo thumbnail
- Bottom row shows attempt history: green check = correct slot, red X = wrong
- On wrong guess: "Not quite! Move cards to guess again."
- Guess counter + Hint button (numbered badge showing hints remaining)

**Example round (All Tied Up):**

| Tie (has ties/knots) | Dye (type of ink/dye) |
|----------------------|-----------------------|
| Friendship bracelet | Shoelace |
| Suture | Indigo |
| Macramé | Mauveine |
| Salami | Quipu |
| Cochineal | Henna |

> Note: Quipu and Salami are the tricky ones — Quipu is an Incan recording device made of knotted cords (Tie), and Cochineal is a red dye (Dye).

---

### 2. Chrono
**Mechanic:** Arrange event cards in chronological order on a vertical Before → After timeline.

- Each card has: thumbnail image + date badge + one-line fact
- Cards are draggable; reorder until correct
- Green checkmark = correctly placed, Red X = wrong position
- A "factoid" card scrolls at the bottom giving bonus context on a related item
- No time pressure — puzzle-style

**Example round (All Tied Up — rope/cord history):**

| Order | Date | Event |
|-------|------|-------|
| 1 | c. 48,000 BCE | Neanderthals use cord |
| 2 | c. 1400s | Inca quipu flourishes |
| 3 | 1935 | Nylon is first synthesized |
| 4 | 1953 | Kernmantle rope created |
| 5 | c. 1980s | Friendship bracelets surge in US |

> Factoid shown: "Tug-of-war's Olympic debut — becomes official event at turn-of-the-century Paris Games, rope must be free from knots."

---

### 3. Links
**Mechanic:** Match a card from a deck to a web of 4 attribute bubbles.

- Central empty rectangle = the answer slot
- 4 oval bubbles connected by lines radiate outward with attributes/clues
- Deck of candidate cards shown at the bottom (swipeable stack, shows count)
- Place a card in the center — if correct: success screen
- Hint button reveals one attribute meaning
- Win screen: "That's right! You solved this with X guesses and Y hints."

**Example round (All Tied Up):**

Cards in deck: Standard shoelace, Friendship bracelet, Butcher's twine (+ more)

Attributes shown for the correct answer (Standard shoelace):
- Holds 75+ lbs before snapping
- Often has **aglet** on each end
- Tied or knotted
- Worn on the body *(this one also fits Friendship bracelet — the misdirection)*

**Example round 2 (Butcher's twine):**
- Can be made from nylon
- Tied or knotted
- Commonly used underwater *(misdirect)*
- Snaps at around **10 lbs**
- Shapes salami

---

### 4. Knockout (subscription locked)
**Mechanic:** Binary head-to-head comparison. Pick which card wins based on a question.

- Bold question at top (e.g., "Which can hold more weight before it snaps?")
- Subtitle: "Assume each item's most common everyday form."
- Two face-down cards shown side by side (revealed on tap?)
- Bracket-style elimination implied by name
- Locked behind subscription with "Unlock Knockout and our entire puzzle archive" prompt

---

## Design System

| Element | Detail |
|---------|--------|
| Background | Warm off-white (~`#F5F4F0`) |
| Cards | Rounded rectangles, slight shadow, folded corner on home grid |
| Typography | Bold serif for headlines, clean sans-serif for body |
| Color coding | Green (This or That), Yellow (Chrono), Blue (Links), Orange (Knockout) |
| Icons | Minimal outline illustrations per game mode |
| Navigation | Back arrow (top left) + info icon (top right) per game screen |
| Feedback | Inline green check / red X on cards, no separate result modal mid-game |
| Win state | Full-screen "That's right!" with stats (guesses, hints used) + "Play next round" CTA |

---

## Key UX Patterns Worth Borrowing

1. **Daily theme** — all 4 games share one topic, creates narrative coherence
2. **Progressive difficulty** — This or That (easy sorting) → Chrono (ordering) → Links (attribute matching) → Knockout (comparison judgment)
3. **Attempt history strip** — row of green/red badges lets you see past guesses at a glance
4. **Factoid sidebar** — extra knowledge snippets reward curiosity without blocking gameplay
5. **Hint economy** — numbered hints create light resource management tension
6. **Misdirection design** — attributes intentionally overlap multiple candidates (e.g., "Tied or knotted" fits both shoelace and friendship bracelet)
7. **Win screen stats** — "1 guess, 0 hints" gives a performance score without explicit points
8. **Folded-corner card grid** — tactile, paper-like home screen aesthetic

---

## Relevance to CHITTA

These mechanics map cleanly onto NEET subjects:

| Game Mode | NEET Adaptation |
|-----------|-----------------|
| This or That | Classify compounds as acidic/basic, plant/animal cell features, etc. |
| Chrono | Order biological processes (mitosis stages), historical discoveries, reaction steps |
| Links | Match a molecule/organism to its properties (4 clues, 1 answer) |
| Knockout | Compare two structures/values — "Which has higher electronegativity?" |

All 4 modes test **recognition and retrieval** rather than free recall — low-friction, high-engagement. Works well as a daily warm-up or cooldown alongside spaced repetition sessions.
