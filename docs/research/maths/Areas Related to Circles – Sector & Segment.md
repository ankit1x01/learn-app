## 1. Cognitive Profile of the Chapter

This chapter (**Areas Related to Circles – Sector & Segment**) is a **relational-visual hybrid system**:

* **Relational Logic (🔥 core)**
  → Sector = fraction of circle
  → Segment = sector – triangle
* **Spatial Visualization**
  → Understanding arc, chord, angle relationships
* **Proportional Reasoning (Unitary Method)**
  → 360° → full circle → scale down to θ
* **Geometric Decomposition**
  → Breaking segment into known shapes

---

### 🧠 How the Brain Chunks This Chapter

The brain encodes this as:

1. **Fraction Model**

   * Sector = (θ / 360) × full circle

2. **Arc-Length Link**

   * Angle ↔ arc length ↔ area

3. **Subtraction Model**

   * Segment = sector – triangle

4. **Dual Representation**

   * Same shape → multiple interpretations

---

👉 Core Insight:

> This chapter is about **“how much of a circle” + “what part is removed”** 

---

## 2. Atomic Extraction & Interferences

### **Core Vocabulary / Key Terms**

* Circle
* Radius (r)
* Sector (minor / major)
* Segment (minor / major)
* Central Angle (θ)
* Arc Length
* Chord
* Triangle (OAB)
* Area of Sector
* Area of Segment
* Unitary Method

---

### **Cognitive Interferences (Traps)**

#### ⚠️ Interference 1: Sector vs Segment Confusion

* Sector = bounded by radii
* Segment = bounded by chord

👉 Students mix both visually

---

#### ⚠️ Interference 2: Formula Swap

* Arc length vs area formula confusion

---

#### ⚠️ Interference 3: Degree Scaling Failure

* Forget dividing by 360

---

#### ⚠️ Interference 4: Segment Formula Miss

* Students forget:
  Segment = Sector – Triangle

---

#### ⚠️ Interference 5: Major vs Minor Confusion

* Forget:
  Major = 360° – θ

---

#### ⚠️ Interference 6: Triangle Area Calculation Error

* Especially when angle-based trig involved

---

## 3. Novel Game Modality Blueprints

---

### 🎮 Game Concept 1: **“Circle Fraction Engine”**

* **Target Material:**
  Sector area, arc length, θ scaling

* **Psychological Principle:**
  **Proportional Reasoning + Visual Scaling**

* **Core Interaction:**

  * Full circle shown (360°)
  * Player drags angle slider (θ)
  * System dynamically shows:

    * Sector area
    * Arc length

👉 Tasks:

* Match given area by adjusting θ

* Predict arc length visually

* **Mastery Condition:**

  * Instantly maps angle ↔ fraction ↔ area
  * No formula recall needed

---

### 🎮 Game Concept 2: **“Sector vs Segment Splitter”**

* **Target Material:**
  Difference between sector and segment

* **Psychological Principle:**
  **Visual Discrimination + Interference Resolution**

* **Core Interaction:**

  * Shape appears
  * Player must:

    * Swipe to separate into:

      * Sector
      * Triangle

👉 If wrong:

* System shows overlay correction

* **Mastery Condition:**

  * Zero confusion between segment/sector
  * Instant recognition

---

### 🎮 Game Concept 3: **“Segment Builder”**

* **Target Material:**
  Segment = sector – triangle

* **Psychological Principle:**
  **Constructive Reasoning + Subtraction Logic**

* **Core Interaction:**

  * Player builds segment step-by-step:

    1. Create sector
    2. Overlay triangle
    3. Remove triangle

👉 Visual:

* Triangle fades out → segment remains

* **Mastery Condition:**

  * Predict segment area before calculation
  * No confusion about subtraction

---

## 4. FSRS Data Hooks

---

### 📊 Difficulty Signals

Increase when:

* Student confuses sector vs segment
* Forgets θ/360 scaling
* Applies wrong formula

---

### ⚠️ Interference Tracking

```json
{
  "concept": "SECTOR_vs_SEGMENT",
  "interferenceScore": 0.89,
  "competingIds": ["ARC_LENGTH", "AREA_SECTOR"]
}
```

---

### 🔁 Retrieval Signals

* Fast angle-area mapping → high stability
* Repeated formula confusion → lower retrievability
* Visual hesitation → increase review frequency

---

### 🧠 Behavioral Signals Captured

* Whether student thinks in:

  * Fractions vs formulas
  * Shapes vs symbols
* Ability to:

  * Decompose geometry
  * Handle proportional reasoning

---

# 🚀 Final Insight

This chapter is NOT about formulas.

👉 It is:

> **Understanding how a circle can be sliced, scaled, and reshaped**

---

If you want next level:

* I can unify **all geometry chapters into one visual cognition system**
* Or design **Three.js interactive circle engine (for your platform)**
* Or build **full CHITTA JSON schema + FSRS integration**
