# R&D Strategy: Statistics & Probability (Class X)

## 1. Core Pedagogical Goals
This document maps Chapters 13 (Statistics) and 14 (Probability) into the CHITTA cognitive engine. The focus here is heavily on formula memorization, procedural execution for grouped data, and combinatorial logic for probability sample spaces.

## 2. Atomic Concepts & FSRS Data

### Chapter 13: Statistics
| Concept ID | Name | FSRS `difficulty` | `interferenceScore` | `encodingDepth` |
| --- | --- | --- | --- | --- |
| `stat_mean_direct` | Mean: Direct Method | 0.3 | 0.2 (low) | `conscious` |
| `stat_mean_assumed` | Mean: Assumed Mean | 0.5 | 0.6 ($d_i$ vs $u_i$) | `fragile` |
| `stat_mean_step` | Mean: Step-Deviation | 0.7 | 0.7 (Formula constants) | `fragile` |
| `stat_mode_group` | Mode of Grouped Data | 0.7 | 0.8 ($f_0, f_1, f_2$ mixups) | `fragile` |
| `stat_median_group` | Median of Grouped Data | 0.8 | 0.9 (Preceding $cf$ confusion) | `fragile` |
| `stat_empirical` | Empirical Relationship | 0.4 | 0.5 (Formula inversion) | `conscious` |

*Interference Notes:*
- High interference in the Median formula where students frequently use the $cf$ of the median class instead of the *preceding* class.
- High interference in Mode formula placement of $f_0$ (preceding) vs $f_2$ (succeeding).

### Chapter 14: Probability
| Concept ID | Name | FSRS `difficulty` | `interferenceScore` | `encodingDepth` |
| --- | --- | --- | --- | --- |
| `prob_theoretical` | Theoretical Probability | 0.2 | 0.1 | `automatic` |
| `prob_complement` | Complementary Events ($P(E)+P(\bar{E})=1$) | 0.2 | 0.1 | `automatic` |
| `prob_bounds` | Probability Bounds ($0 \le P(E) \le 1$) | 0.2 | 0.4 (Exclusive vs Inclusive) | `conscious` |
| `prob_cards` | Playing Cards Sample Space | 0.6 | 0.8 (Ace as Face Card error) | `fragile` |
| `prob_dice_2` | 2-Dice Sum Combinations | 0.7 | 0.6 (Missing pairs) | `fragile` |

*Interference Notes:*
- The most common failure point is treating "Ace" as a Face Card. Face cards are strictly King, Queen, Jack (12 total).
- Miscalculating the sample space for sums on two dice (e.g., forgetting (3,4) and (4,3) are distinct outcomes).

## 3. Game Modality Mappings

### A. Chrono (Sequence & Timeline Mastery)
**Target:** Algorithmic procedure for Step-Deviation and Median.
- **Sequence 1: Step-Deviation Mean Calculation**
  1. Find Class Marks ($x_i$)
  2. Choose Assumed Mean ($a$) from $x_i$
  3. Calculate Deviations ($d_i = x_i - a$)
  4. Calculate Step-Deviations ($u_i = d_i / h$)
  5. Apply Formula $\bar{x} = a + h \frac{\Sigma f_i u_i}{\Sigma f_i}$
- **Sequence 2: Median of Grouped Data**
  1. Calculate Cumulative Frequency ($cf$) column
  2. Find $N / 2$
  3. Identify Median Class (first class with $cf > N/2$)
  4. Identify $l, f,$ and preceding $cf$
  5. Apply Median formula

### B. Links (Relational & Categorical Mastery)
**Target:** Statistical Measure selection, Formula associations, and Card categorisation.
- **Link Set 1: Choosing the right Measure**
  - *Mean* $\leftrightarrow$ When all observations matter, finding average performance.
  - *Median* $\leftrightarrow$ When extreme outliers exist, finding typical productivity.
  - *Mode* $\leftrightarrow$ Establishing most frequent/popular item.
- **Link Set 2: The Deck of Cards**
  - *Red Cards* $\leftrightarrow$ Hearts, Diamonds (26)
  - *Black Cards* $\leftrightarrow$ Spades, Clubs (26)
  - *Face Cards* $\leftrightarrow$ Kings, Queens, Jacks (12)
- **Link Set 3: 2-Dice Sums (Patterns)**
  - *Sum = 2* $\leftrightarrow$ 1 outcome
  - *Sum = 7* $\leftrightarrow$ 6 outcomes
  - *Sum = 12* $\leftrightarrow$ 1 outcome

## Next Steps for Development Pipeline
1. Generate TypeScript definitions for `Chrono.tsx` arrays containing the grouped data calculation sequence.
2. Generate `Links.tsx` nodes representing the deck of cards and statistical formulas.
3. Integrate into `src/games/packs/11-maths/statistics_probability.ts`.


## 1. Cognitive Profile of the Chapter

This chapter (**Probability – Theoretical Approach**) is primarily a mix of:

* **Relational Logic** → Understanding relationships like
  ( P(E) = \frac{\text{favourable}}{\text{total}} ), complement rules, outcome spaces
* **Procedural Memory** → Step-by-step solving:

  * Identify sample space
  * Count favourable outcomes
  * Apply formula
* **Set-based Thinking (Proto-Set Theory)** → Events, complements, unions
* **Combinatorial Enumeration** → Especially in dice/cards problems

### 🧠 How the Brain Chunks This Chapter

The brain does NOT store this as formulas. It chunks into:

1. **Outcome Space Model** (mental simulation of possibilities)
2. **Counting Engine** (how many favourable vs total)
3. **Rule Constraints**

   * Probability ∈ [0,1]
   * Complement = 1 – P(E)
4. **Pattern Templates**

   * Coin → 2 outcomes
   * Die → 6 outcomes
   * Cards → 52 outcomes
   * Two dice → 36 ordered pairs

👉 Mastery = **instant mental simulation + counting without confusion**

---

## 2. Atomic Extraction & Interferences

### **Core Vocabulary / Key Terms**

* Experiment
* Outcome
* Sample Space
* Event
* Elementary Event
* Equally Likely Outcomes
* Favourable Outcomes
* Theoretical Probability
* Complementary Event (E')
* Impossible Event (P = 0)
* Sure Event (P = 1)
* Ordered Pair (for multi-dice)

---

### **Cognitive Interferences (Traps)**

#### ⚠️ Interference 1: Sample Space Miscount

* Students confuse:

  * 2 dice → 11 outcomes ❌
  * Actual → 36 ordered pairs ✅
* Brain compresses combinations incorrectly

---

#### ⚠️ Interference 2: Complement Misuse

* Forget:
  [
  P(E') = 1 - P(E)
  ]
* Especially in “at least one”, “not”, “none” problems 

---

#### ⚠️ Interference 3: Equally Likely Assumption

* Real-world bias confusion:

  * “4 red, 1 blue” → not equal
* Students apply formula blindly

---

#### ⚠️ Interference 4: Outcome vs Event Confusion

* Event = set of outcomes
* Students treat event as single outcome

---

#### ⚠️ Interference 5: Impossible vs Low Probability

* P = 0 ≠ “very unlikely”
* P = 1 ≠ “very likely”

---

#### ⚠️ Interference 6: Ordered Pair Identity

* (1,4) ≠ (4,1)
* Brain collapses symmetry incorrectly

---

## 3. Novel Game Modality Blueprints

---

### 🎮 Game Concept 1: **“Outcome Simulator”**

* **Target Material:**
  Sample space, equally likely outcomes, ordered pairs, event definition

* **Psychological Principle:**
  **Mental Simulation + Spatial Enumeration + Active Generation**

* **Core Interaction:**

  * Screen shows an experiment (e.g., 2 dice, coin toss, cards)
  * Student must **generate outcomes manually**:

    * Drag dice faces to create ordered pairs
    * Build full sample space grid
  * Then:

    * Highlight/select favourable outcomes

👉 Example:

* Build all outcomes for 2 dice

* Then tap all pairs where sum = 8

* **Mastery Condition:**

  * Generates correct sample space without missing/duplicate entries
  * Identifies favourable outcomes in <3 sec
  * No confusion between (a,b) and (b,a)

---

### 🎮 Game Concept 2: **“Complement Strike”**

* **Target Material:**
  Complementary events, “at least”, “none”, “not” logic

* **Psychological Principle:**
  **Interference Resolution + Cognitive Inversion + Error Prediction**

* **Core Interaction:**

  * Player sees a scenario:

    * “At least one head in 2 tosses”
  * Two paths appear:

    1. Direct calculation
    2. Complement route

* Player must:

  * Choose fastest valid path
  * Or “attack via complement”

👉 Example:

* “At least one head”

* Player selects:

  * Complement → “no head”
  * Calculates → subtract from 1

* UI:

  * Like a **decision battle tree**
  * Wrong path → instant feedback

* **Mastery Condition:**

  * Automatically chooses complement for complex events
  * Solves in <2 steps mentally

---

### 🎮 Game Concept 3: **“Reality vs Assumption”**

* **Target Material:**
  Equally likely outcomes, theoretical vs real-world probability

* **Psychological Principle:**
  **Conceptual Contrast + Bias Correction + Cognitive Dissonance**

* **Core Interaction:**

  * Player is shown scenarios:

    * Bag with 4 red, 1 blue
    * Coin toss
    * Basketball shot

* Must classify:

  * ✅ Equally Likely
  * ❌ Not Equally Likely

Then:

* If valid → compute probability

* If invalid → explain why formula fails

* **Mastery Condition:**

  * Instantly rejects invalid probability setups
  * No blind formula application

---

## 4. FSRS Data Hooks

These games generate **high-resolution cognitive signals**:

---

### 📊 Difficulty Tracking

* Increases when:

  * Student miscounts sample space (Outcome Simulator)
  * Chooses wrong solving path (Complement Strike)
  * Applies formula in non-equal scenarios

---

### ⚠️ Interference Score Triggers

* High spikes when:

  * Confuses ordered vs unordered outcomes
  * Mixes complement logic
  * Treats event as single outcome

```json
{
  "concept": "SAMPLE_SPACE_2_DICE",
  "interferenceScore": 0.85,
  "competingIds": ["COMBINATION_LOGIC", "ORDERED_PAIR_LOGIC"]
}
```

---

### 🔁 Stability & Retrieval Signals

* Fast correct generation → increase stability
* Hesitation → reduce retrievability
* Repeated complement errors → shorten FSRS interval

---

### 🧠 Meta Insight

These games don’t test memory.
They track:

> **How the brain constructs reality models under uncertainty**

---

If you want next level:

* I can convert this into **full JSON schema for your CHITTA backend**
* Or design **UI wireframes for each game (React-based, your domain)**
