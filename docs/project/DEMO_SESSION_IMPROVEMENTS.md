# Demo Session "God Mode" Improvements

This document tracks the ultimate neuroscience, Vedic, and UX improvements to be integrated into `src/screens/DemoSession.tsx` to finalize the highest-intensity learning circuit.

## Todo List

- [x] **Add Capacitor Haptics to Timer & Pause**
  - Use device haptics (`@capacitor/haptics`) for a "heartbeat" during the 15s MCQ countdown to induce mild stress (Norepinephrine release).
  - Use swelling gentle haptics for the inhalation/exhalation phases of the Nididhyasanam pause to anchor the somatic state.

- [x] **Change PredictCard to Boundary Match (A/B)**
  - Replace the free-form text area with a side-by-side A vs B choice.
  - *Why:* Reduces mobile typing friction while preserving the Dopamine Reward Prediction Error (forcing a guess and discovering if it's right/wrong).

- [x] **Implement Bi-Directional MCQ (Ghana Patha)**
  - After answering a question correctly, immediately flip the script: show the answer alone and force the user to pick the question that generated it.
  - *Why:* Creates structural invincibility through two-way neural pathway traversal.

- [x] **Add Elaborative Interrogation to Content (Blur Why)**
  - Hide the deepest reasoning/constraints in the theory phase behind a blurred "Tap to reveal Why".
  - *Why:* Maintains the curiosity gap instead of dumping all text at once.

- [x] **Stream LLM Feedback in FeynmanCard**
  - Connect the Gemini LLM call to a streaming response.
  - *Why:* The user sees the AI typing the grade and feedback instantly, removing perceived loading latency and preserving the flow state.

- [x] **Add Audio Cues for Success/Failure/Timer**
  - Add native ticking tension sounds for the MCQ and a rewarding chime for the Feynman technique success.

- [x] **Add Shake Animation to Wrong Neti MCQ**
  - Use Framer Motion (`x: [-10, 10, -10, 10, 0]`) to violently "shake" the button and the Neti Analysis box when they fall for a distractor.
  - *Why:* Deepens the somatic anchor of the mistake to ensure it isn't repeated.

---

## Advanced Neurological & Vedic Techniques

### 1. Elaborative Interrogation (The "Why" Protocol)
*   **The Science:** Just asking a student *what* a concept is doesn't build deep neural pathways. Forcing them to answer *why* a specific fact is true connects the new concept to their existing knowledge graph.
*   **How to add it:** In the `Content` phase, we can hide the core explanation and add a prompt: *"Why do you think this array needs to be sorted first?"*. The user has to click to reveal the *Why*.

### 2. Bi-Directional Recall (Vedic *Ghana Patha*)
*   **The Science/Vedic principle:** The Vedic *Ghana Patha* chanting method involves repeating patterns forwards and backwards (A-B, B-A, A-B-C, C-B-A) to make the memory structurally invincible.
*   **How to add it:** During the MCQ phase, instead of just *"Here is the question, find the answer"*, we do a rapid double-test. 
    1. Question -> Find the Answer.
    2. Answer -> Find the original Question that matches it.

### 3. Somatic & Sensory Anchoring (Embodied Cognition)
*   **The Science:** The brain remembers physical sensations better than abstract text. Tying a physical action or feeling to a memory creates a "somatic anchor".
*   **How to add it:** We can use **Capacitor Haptics** (`@capacitor/haptics`). 
    *   In the `MCQ` phase, the phone pulses slightly every second as the timer counts down (mimicking a heartbeat).
    *   During the `PauseCard` breathing sequence, the phone gives a smooth, swelling vibration as you inhale. 

### 4. Boundary Testing (Interference Resistance)
*   **The Science:** You don't truly know a concept until you know what it is *not*.
*   **How to add it:** Before the `MCQ` phase, show the user two identical-looking pieces of code or text. One is the correct concept, the other is a common distractor (e.g., `O(N)` vs `O(N log N)` logic side-by-side). Ask them: *"Tap the one that is WRONG"*.

### 5. The "Generation Effect" via Dual Coding
*   **The Science:** Creating a visual representation of text (Dual Coding Theory) forces the brain to process the information in two distinct regions (visual cortex + language centers).
*   **How to add it:** In the `Feynman` card, instead of just typing a sentence, we could give them a tiny drag-and-drop block space where they have to arrange 3-4 visual blocks into the correct flowchart order before they hit submit.
