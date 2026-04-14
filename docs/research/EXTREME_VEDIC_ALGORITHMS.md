# Extreme Vedic Learning — Core Principles & Definite Algorithms

The previous document covered the practical techniques.
This document goes deeper — to the *extreme* methods the Rishis used and the
precise algorithmic logic that can be extracted from them.

These are not meditation tips. They are cognitive operating system principles.
Each section ends with a concrete algorithm CHITTA can implement.

---

## The Meta-Principle Behind All of It

The Rishis made one claim that modern neuroscience is only beginning to verify:

> **The student already contains all the knowledge. Learning is not addition. It is removal of obstruction.**

The Sanskrit word is `Avidya` — ignorance — literally "that which covers."
The job of the teacher is not to pour knowledge in. It is to remove the veils blocking what is already there.

Modern correlate: Ausubel (1968) — "The most important single factor influencing learning is what the learner already knows. Ascertain this and teach accordingly."

Every algorithm that follows is an application of this principle:
find the obstruction, remove it precisely, let the knowledge surface.

---

## Extreme Technique 1 — Poorva Paksha: Teach the Wrong Answer First

### The method

Before a Vedic student could be taught *any* position, they had to master the strongest argument AGAINST it.

This was called `Poorva Paksha` — the opponent's view.

A student who could not articulate the best case for the wrong answer was not ready to understand why it was wrong.

Shankaracharya's Brahma Sutras: every sutra begins by presenting the opposing view fully, charitably, in its strongest form — then dismantles it.

The student who only knows the right answer is fragile.
The student who knows exactly *why* the wrong answers are wrong is unbreakable.

### Why this works

Encoding a concept as a *contrast* to a prior misconception creates two memory traces:
1. The wrong belief (now suppressed)
2. The correct concept + the mechanism of why the wrong belief fails

This double-encoding is far more durable than encoding the correct concept alone.
The error trace acts as a *permanent retrieval cue* — whenever the wrong intuition surfaces, it triggers the correct concept.

Neuroscience: encoding under prediction error (expected X, got Y) recruits dopaminergic and noradrenergic systems simultaneously → one of the strongest single-event memory formations possible.

### The Algorithm

```
POORVA_PAKSHA(concept):

  1. Before showing concept, surface known misconception:
     "Most students believe: [confusionPair.wrongBelief]"
     "What do YOU believe?" → student taps agree/disagree

  2. Record prior belief.

  3. If student agreed with misconception:
     Show mechanism of why it's wrong FIRST
     Then show correct concept as the resolution

  4. If student disagreed (already knew):
     Skip to direct encoding — no Poorva Paksha needed

  5. Encode the concept with contrast frame:
     "NOT [wrong belief] — BECAUSE [mechanism]
      YES [correct concept] — BECAUSE [mechanism]"

  6. In future sessions, occasionally show the misconception again:
     "Still think [wrong belief]?" → forces active inhibition
     This strengthens the suppression trace
```

**Data needed:** Each concept needs a `confusionPair` field:
```
confusionPair: {
  wrongBelief: string,       // "Mitosis produces haploid cells"
  whyStudentsThinkThis: string,  // "Confused with meiosis — both involve cell division"
  contrastMechanism: string  // "Mitosis = copy, meiosis = halve"
}
```

---

## Extreme Technique 2 — Dharana to Dhyana: Engineering Flow State

### The method

Patanjali's Yoga Sutras define a precise cognitive progression:

```
Dharana   → sustained concentration (effortful)
Dhyana    → unbroken flow (effortless)
Samadhi   → complete absorption (no separation between knower and known)
```

The transition from Dharana to Dhyana (effort to flow) is the most powerful learning state available to a human brain.

In flow: prefrontal cortex quiets (transient hypofrontality), default mode network suppresses, dopamine and norepinephrine peak simultaneously, time distorts.

The Rishis did not achieve this randomly. They engineered it through:
- Precise challenge calibration (not too hard, not too easy)
- Removal of sensory interference (Pratyahara — sense withdrawal)
- Ritualized entry sequence (same conditions = state-dependent priming)

### Why this works

Csikszentmihalyi's flow research confirms: flow state requires challenge 4% above current skill level.
Too easy → boredom (low dopamine). Too hard → anxiety (high cortisol, blocks encoding).

In flow, the hippocampus encodes at maximum efficiency because:
- Norepinephrine (LC activation) is high → LTP threshold lowered
- Cortisol is optimal → hippocampal dendrites fully extended
- Attention is complete → no divided encoding

### The Algorithm

```
FLOW_ENGINEERING(student, concept):

  targetDifficulty = concept.difficulty + 0.04  // 4% above current mastery

  // Select question variant at target difficulty
  questionVariant = selectVariant(concept, targetDifficulty)

  // Track time-in-zone (flow indicator)
  // Flow signals: response time in 15-45s range, accuracy 70-85%
  // Below 70%: too hard → reduce difficulty
  // Above 85%: too easy → increase difficulty (tapas mode)
  // Response time < 10s: guessing or trivial → increase
  // Response time > 60s: overwhelmed → reduce

  FLOW_SCORE(session):
    accuracy = recentAccuracy(last10)
    avgTime   = avgResponseTime(last10)
    inZone    = (0.70 ≤ accuracy ≤ 0.85) AND (15 ≤ avgTime ≤ 45)
    return inZone

  // Adaptive difficulty per question
  if tooEasy: increase distractor difficulty, reduce hint availability
  if tooHard: simplify distractor, allow partial reveal
  if inFlow:  maintain current level, do not interrupt with UI noise
```

**Key insight:** Never interrupt flow state with notifications, encouragement messages, or visual celebrations. The Rishi who interrupted a student in deep Dharana was considered to have committed a serious error. CHITTA's UI should go *silent* when flow is detected.

---

## Extreme Technique 3 — Yoga Nidra: Hypnagogic State Installation

### The method

`Yoga Nidra` = yogic sleep — a precisely guided state between waking and sleeping.

It is not relaxation. It is a *specific brainwave state* (theta/alpha border, 4-8 Hz) that the Rishis used deliberately for memory installation.

The protocol: after learning, lie down, close eyes, guide attention through the body systematically (rotation of consciousness), then present concepts in the hypnagogic state.

Ancient texts describe this as "planting seeds in fertile soil" — the hypnagogic brain is unusually receptive to new associations.

### Why this works

MIT study (Stickgold & Haar, 2021): subjects who entered Stage 1 sleep (hypnagogic) for even 30-60 seconds after learning, then were woken, showed 32% better retention than subjects who stayed awake.

Mechanism: in the theta state, the hippocampus is still actively replaying recent experiences AND the cortical inhibition of waking is partially lifted — new associations form more easily.

This is the same state responsible for:
- Hypnagogic hallucinations
- Creative breakthroughs (Edison, Einstein both used nap chairs)
- The "morning insight" effect — answers that appear upon waking

### The Algorithm

```
YOGA_NIDRA_PROTOCOL(session):

  // Triggered: after any session with 5+ new concepts
  // Duration: 8-12 minutes

  PHASE 1 — Pratyahara (sense withdrawal, 2 min):
    Screen: pure black, no sound
    Text fades in: "Close your eyes. Let your body be heavy."
    App goes completely silent.

  PHASE 2 — Body rotation (3 min):
    Guided attention through body parts (audio optional)
    Purpose: shift brainwave state from beta to alpha/theta
    Marker of success: breathing slows, body still

  PHASE 3 — Sankalpa (2 min):
    Present the 3 most important concepts from this session
    As single-sentence seeds, not full explanations:
    "Mitosis. Two identical daughter cells. Diploid preserved."
    Present slowly, with 20s silence between each.
    No questions, no interaction — pure Shravanam in receptive state.

  PHASE 4 — Return (1 min):
    Gentle return prompt: "Wiggle fingers. Open eyes slowly."

  PHASE 5 — Immediate free recall (2 min):
    "Without checking, what do you remember from today's session?"
    Student types freely.
    This is the consolidation event — the Yoga Nidra primed it.
```

**Effect on FSRS:** Concepts presented in Yoga Nidra phase get `nididhyasanamBonus = true` → `initialStability *= 1.5` on first review.

---

## Extreme Technique 4 — Anusandhana: The Always-On Algorithm

### The method

`Anusandhana` = unbroken thread of inquiry.

The extreme Gurukul practice: the Guru would ask questions at *random, unexpected moments*.
During meals. During walks. While the student was doing chores.

This was not cruelty. It was the most powerful retrieval practice schedule known:
**variable ratio reinforcement** — random reward schedule produces the most durable behavior, in both rats and humans.

The student who can only recall during "study time" has context-dependent memory.
The student who can recall while washing dishes has genuine knowledge.

The Rishis called this `Sthitaprajna` — the stable-minded one — knowledge available in *any* state.

### Why this works

Context-dependent memory (Godden & Baddeley, 1975): encoding and retrieval in the same context produces 40-50% better recall.
The corollary: encoding across *many* contexts produces context-independent memory — the most robust form.

Random retrieval practice produces better long-term retention than scheduled practice, even with fewer total trials.
This is the behavioral psychology finding about variable ratio schedules — the schedule that makes slot machines addictive is the same schedule that makes knowledge permanent.

### The Algorithm

```
ANUSANDHANA_SCHEDULER(concepts, studentProfile):

  // Select 1-3 concepts for micro-tests throughout the day
  microTestCandidates = getDueToday(concepts)
    .filter(c => c.stage >= 'Conscious')
    .slice(0, 3)

  // Schedule at genuinely random times (not predictable)
  morningWindow  = randomMinute(between: 09:00-11:30)
  afternoonWindow = randomMinute(between: 13:30-16:00)
  eveningWindow  = randomMinute(between: 18:00-20:30)

  // Micro-test format: single question, 30s, no session UI
  // Just a notification → full-screen question → answer → dismiss
  // No stats, no encouragement, no animation — pure signal

  // The randomness IS the feature.
  // Student cannot predict when the question comes → cannot "prepare" → genuine retrieval

  // FSRS update: micro-test answers count as full review events
  // Random-context correct answer → stability boost * 1.2 (context-independence signal)
```

**UI principle:** Micro-test notification looks different from all other notifications.
No color, no animation — a plain text push. The plainness signals "this is real, not a game."

---

## Extreme Technique 5 — Sadhana Chatushtaya: The Four Prerequisites

### The method

Shankaracharya identified four prerequisites (`Sadhana Chatushtaya`) that must be present before serious learning can occur. He was not listing virtues. He was listing *cognitive prerequisites* discovered empirically through centuries of Gurukul failure analysis.

```
1. Viveka        — discrimination (metacognition)
2. Vairagya      — dispassion toward outcomes (growth mindset)
3. Shat Sampat   — six inner instruments:
   a. Shama      — mastery of mental fluctuations (attention control)
   b. Dama       — mastery of sensory input (distraction resistance)
   c. Uparama    — cessation of outward activity (single-tasking)
   d. Titiksha   — tolerance of difficulty (grit)
   e. Shraddha   — trust in the system (compliance)
   f. Samadhana  — equanimity (emotional regulation)
4. Mumukshutva  — burning desire (intrinsic motivation)
```

The Guru's first job was to assess these four prerequisites — NOT to teach content.
A student without Mumukshutva (genuine desire) is unteachable regardless of technique.
A student without Shraddha (trust in the system) will abandon spaced repetition when it "feels slow."

### The Algorithm

**Student profile assessment** — not a quiz, but inferred from behavior:

```
SADHANA_PROFILE(student, sessionHistory):

  viveka        = globalVivekaScore                    // metacog accuracy
  vairagya      = learningVsPerformanceRatio           // does student study even after failures?
  shama         = avgSessionCompletionRate             // starts vs finishes sessions
  dama          = avgDistractorResponseTime            // time spent on wrong options (curiosity vs impulsiveness)
  uparama       = sessionInterruptionRate              // how often sessions are quit mid-way
  titiksha      = tapasAcceptanceRate                  // how often student chooses harder mode
  shraddha      = fsrsComplianceRate                   // reviews done on scheduled day vs delayed
  samadhana     = performanceVarianceAfterFailure      // does accuracy drop after wrong answer? (emotional)
  mumukshutva   = intrinsicMotivationScore             // sessions started without reminder

  // Generate profile: which prerequisites are underdeveloped?
  weakPrerequisites = filter(prerequisites, score < 0.5)
```

**Adaptive interventions per weak prerequisite:**

| Weak prerequisite | CHITTA intervention |
|---|---|
| Low Viveka | Force confidence ratings, show calibration graph |
| Low Vairagya | Show progress graph over 30 days (not session score) |
| Low Shama | Shorten sessions to 5 questions, build up |
| Low Titiksha | Never show Tapas mode — build confidence first |
| Low Shraddha | Show forgetting curve projection: "if you skip today, you'll forget X concepts by Thursday" |
| Low Mumukshutva | Show stakes: "Last year's NEET: 2 questions from this exact concept" |

---

## Extreme Technique 6 — Ritambhara Prajna: Direct Pattern Perception

### The method

Patanjali Yoga Sutras 1.48-49:
> "Ritambhara tatra prajna" — in the state of Samadhi, the intellect perceives truth-bearing knowledge directly.

This sutra describes something radical: at deep levels of absorption, the student stops *reasoning* toward a conclusion and starts *perceiving* the pattern directly — without inference.

Expert mathematicians describe this. Einstein described it. Chess grandmasters describe it.
The Rishis called it Ritambhara Prajna — truth-bearing insight.

The modern name is **expert intuition** (Kahneman's System 1 operating at expert level).
The neurological name is **pattern completion via sparse coding** — the neocortex fires the complete pattern from a fragment.

It is not mystical. It is the end state of deep learning — when knowledge no longer requires effortful retrieval.

### What this tells us about the learning endpoint

The Rishis defined the learning endpoint not as "can answer questions correctly" but as "perceives the answer before the question is complete."

This maps to: the concept is fully encoded in neocortical pattern networks, no longer requiring hippocampal retrieval.
At this point, the knowledge is permanent — Samskara is complete.

### The Algorithm

**Detecting Ritambhara Prajna moments:**

```
PATTERN_PERCEPTION_DETECTOR(sessionItem):

  // Signal: student answers in < 3 seconds with high accuracy
  // This indicates direct pattern perception, not deliberate recall

  if responseTime < 3000ms AND correct:
    ritambharaEvent = true
    concept.patternPerceptionCount += 1

  // Track across sessions
  if concept.patternPerceptionCount >= 5:
    concept.stage = 'ExamReady'
    // This is more reliable than stage advancement from accuracy alone
    // A student who answers in 2 seconds 5 times in a row KNOWS this

  // Expose fragments to test pattern completion:
  FRAGMENT_TEST(concept):
    // Show only the first 3 words of the question
    // If student answers correctly → pattern completion firing
    // Harder than full question → higher signal
```

---

## Extreme Technique 7 — Krama: Sequence is Everything

### The method

`Krama` = ordered sequence, step.

The Vedic insight that the Upanishads return to repeatedly:
**The order in which concepts are introduced determines whether they can be learned at all.**

Taittirriya Upanishad on teaching order: gross before subtle, concrete before abstract, known before unknown, simple before complex — but always with the end destination visible.

The Gurukul never introduced concept B before concept A was at `Conscious` stage.
Not `Automatic` — `Conscious` was sufficient. But B before A = wasted effort.

### Why this works

Cognitive load theory: intrinsic load is non-compressible — a concept that requires 3 prior concepts to understand will always consume 3 concept-slots of working memory. If those 3 prior concepts are not automatized, they each consume working memory while being retrieved, leaving nothing for the new concept.

The Rishis' rule: automatize prerequisites before introducing dependents.
Modern equivalent: mastery-based progression (Bloom's mastery learning, 1968 — same principle, 2,500 years later).

### The Algorithm

```
KRAMA_PREREQUISITE_ENGINE(concept, studentProfile):

  // Each concept has prerequisiteIds
  // Before introducing concept C, check:

  KRAMA_READY(concept):
    prerequisites = concept.prerequisiteIds.map(id => getConcept(id))
    return prerequisites.every(p => p.stage >= 'Conscious')

  // In session-builder, never include concept C as 'new' if KRAMA_READY returns false
  // Instead: surface the blocking prerequisite first

  FIND_BLOCKER(concept):
    prerequisites = concept.prerequisiteIds.map(id => getConcept(id))
    return prerequisites.filter(p => p.stage < 'Conscious')
                        .sort by (p.pyqTier, p.difficulty)  // prioritize most critical
    // Return the first blocker — student must clear this first

  // Dashboard message:
  "Before you can learn [Concept C], you need to master [Blocker B].
   Your session today focuses on [Blocker B]."
```

**Data needed:** `prerequisiteIds: string[]` on each concept.
For NEET: Glycolysis → Krebs Cycle, Cell Division basics → Mitosis, Newton's Laws → Work-Energy.

---

## Extreme Technique 8 — Mantra as Compression Algorithm

### The method

A mantra is not a prayer. It is a *compressed representation* of a complex conceptual network.

The Gayatri Mantra (24 syllables) was understood by Vedic scholars as containing the entire astronomy, cosmology, and spiritual framework of the Vedic tradition.
The student who knew the mantra had a 24-syllable key that unlocked thousands of interconnected concepts.

This is the most extreme form of chunking in the history of human knowledge transmission.

The technique: attach a short phonological anchor (sound, rhythm, pattern) to a complex conceptual cluster. When the student recalls the anchor, the entire cluster activates.

### Why this works

**Phonological loop** (Baddeley's working memory model): the inner voice rehearsal system has a ~2-second capacity — approximately 7 syllables. But a phonological anchor that is *well-learned* acts as a single chunk, not multiple items.

**Encoding specificity** (Tulving, 1983): a retrieval cue that was present during encoding is the most reliable retrieval trigger. A rhythm, a sound, a physical gesture — these are more robust retrieval cues than visual or verbal reminders because they bypass the declarative system and hit procedural/implicit memory directly.

This is why jingles are remembered for decades. The Rishis weaponized this effect deliberately.

### The Algorithm

```
MANTRA_COMPRESSION(conceptCluster):

  // A concept cluster = 5-15 related concepts that are always tested together
  // Examples: Krebs Cycle steps, Mendel's laws, Newton's three laws, PCR steps

  // Generate a compression anchor:
  ACRONYM_ANCHOR: first letter of each concept in order → memorable word/phrase
  RHYTHM_ANCHOR:  concept names set to a rhythm pattern (4/4 time works best)
  STORY_ANCHOR:   concepts as characters in a minimal narrative (Method of Loci)

  // Display: before introducing the cluster, show the anchor
  // After learning the cluster, the anchor = the retrieval trigger

  // In future sessions:
  CLUSTER_TEST_MODE:
    show only the anchor (rhythm, acronym, first letter)
    student must reconstruct the full cluster from the anchor
    this tests: anchor → full network reconstruction
    higher signal than testing each concept individually
```

**Example:** Krebs Cycle 8 steps → rhythm anchor → when student hears/recalls the rhythm, all 8 steps activate in sequence. This is how Vedic students recalled 10,000+ lines of Sanskrit — not word by word, but chunk by chunk via metrical anchors.

---

## Extreme Technique 9 — Guru Function: Multi-Signal State Reading

### The method

The Gurukul's most extreme advantage was not its content or methods.
It was the Guru's continuous real-time reading of the student's complete state.

The Guru watched:
- Breath pattern (shallow = anxiety, slow = calm = optimal encoding)
- Posture (collapsed = fatigue, upright = engaged)
- Eye movement (darting = distracted, steady = concentrated)
- Pace of response (slowing = fatigue, accelerating = flow)
- Emotional tone (fear = encoding block, curiosity = encoding open)

And adjusted everything: pace, difficulty, subject, method, length — in real time.

No modern educational technology does this. All current apps adapt only to answer accuracy.
The Guru adapted to the *entire state vector* of the student.

### The Algorithm

This is the **Master Adaptive Algorithm** — the Guru function:

```
GURU_FUNCTION(student) → SessionParameters:

  // Signal collection
  signals = {
    accuracy:       recentAccuracy(last5),
    velocity:       avgResponseTime(last5),
    velocityTrend:  velocityChange(last10),     // getting faster or slower?
    completionRate: sessionCompletionRate,
    timeOfDay:      currentHour(),
    koshaState:     preSessionState,            // body/breath/mind self-report
    streakDays:     consecutiveStudyDays(),
    vivekaScore:    globalVivekaScore,
    samskaraAvg:    avgSamskaraDepth(allConcepts),
    fatigueIndex:   (1 - accuracy) * (avgResponseTime / 30),  // combined fatigue signal
  }

  // State classification
  state = classify(signals):
    'peak'       → accuracy > 0.80, velocity optimal, koshaState good, morning window
    'flow'       → accuracy 0.70-0.85, velocity steady, session uninterrupted
    'tiring'     → accuracy dropping, velocity slowing over last 5 questions
    'fatigued'   → accuracy < 0.60 OR velocity > 60s average
    'anxious'    → accuracy low + velocity fast (rushing = anxiety signal)
    'overconfident' → vivekaScore < 0.5 AND accuracy > 0.80 (dangerous state)
    'blocked'    → consecutive failures on same concept (3+)

  // Adaptive response
  PEAK:
    → introduce new concepts, increase challenge, allow Tapas mode
    → full Mananam questions, full Nididhyasanam pauses

  FLOW:
    → do not interrupt, maintain current difficulty
    → suppress ALL notifications, UI noise, encouragement messages
    → let the session run longer than planned

  TIRING:
    → shift to review queue only
    → reduce session length to remaining 5 questions
    → prompt: "3 more questions, then a rest"

  FATIGUED:
    → end session, mandatory Yoga Nidra / Nididhyasanam
    → no new material regardless of schedule

  ANXIOUS:
    → reduce difficulty immediately
    → show easiest available concepts (highest stability, highest familiarity)
    → confidence-building before exam-readiness

  OVERCONFIDENT:
    → force Tapas mode on the concepts with highest stated confidence
    → surface Viveka risk concepts first
    → no encouragement — show calibration data

  BLOCKED:
    → switch retrieval mode (if forward → try reverse or elimination)
    → surface Poorva Paksha for the blocking concept
    → if still failing after all modes: Mananam phase — re-encode from scratch
```

---

## Extreme Technique 10 — The Transmission Paradox (Shakti-Pata)

### The method

The most extreme Vedic claim: a fully realized Guru can transmit knowledge to a student through direct contact — `Shakti-pata` — without words, without questions, without method.

This sounds mystical. The mechanism is real.

What actually happens in Shakti-pata:
- Student is in a highly receptive state (post-meditation, emotionally open)
- Guru demonstrates — not explains — with full embodied presence and emotional engagement
- Student's mirror neuron system fires, simulating the Guru's neural patterns
- The emotional charge (devotion, trust, presence) activates amygdala → maximum consolidation signal

The Guru does not teach. The Guru *is* the knowledge in front of the student.
The student's brain entrains to the Guru's brain state.

### Why this works

Mirror neurons (Rizzolatti, 1996): observation of skilled action fires the same motor patterns in the observer as execution. The brain simulates expertise.

Emotional entrainment (Hatfield, 2009): being in close proximity to a highly engaged expert causes involuntary synchronization of brain oscillations. Two people in deep conversation literally synchronize their theta and gamma rhythms.

The amygdala modulation effect: learning in the presence of someone the student deeply trusts and feels emotionally connected to produces measurably stronger memory traces (norepinephrine release via social bonding circuits).

### The Algorithm

CHITTA cannot be a Guru. But it can simulate the conditions:

```
TRANSMISSION_CONDITIONS(concept):

  // 1. Expert demonstration before student attempt
  //    Not animation — actual expert working through the problem
  //    Showing their confusion, their process, their resolution
  //    The struggle must be visible — not a polished explanation

  VIDEO_ENCODING(concept):
    expertVideo: 90-second clip of expert THINKING through concept
    key: expert verbalizes their uncertainty and resolution
    student watches first → mirror neuron activation
    then student attempts → contrast between their attempt and expert's process

  // 2. Emotional priming before high-stakes concepts
  //    Brief story of a student who failed this concept on the exam
  //    Stakes made human and personal — not statistical

  STAKES_STORY(concept):
    realStudentStory: "Arjun missed this in NEET 2024 by 1 question. This was it."
    amygdala activation → norepinephrine → maximum encoding readiness

  // 3. The presence simulation
  //    Student is alone with the concept for 10 seconds before the question appears
  //    No UI, no buttons — just the concept name and a silence
  //    This simulates the Guru sitting with the student in silence before speaking
```

---

## The Unified Extreme Algorithm

All ten techniques resolve into one master principle:

```
EXTREME_LEARNING_ALGORITHM(student, concept):

  // PRECONDITION CHECK (Sadhana Chatushtaya)
  prerequisites = KRAMA_READY(concept)           // Krama
  studentState  = GURU_FUNCTION(student)         // Guru function
  if !prerequisites: return surfaceBlocker()
  if studentState == 'fatigued': return endSession()

  // POORVA PAKSHA — surface obstruction first
  misconception = concept.confusionPair
  if misconception: POORVA_PAKSHA(concept)       // remove Avidya

  // TRANSMISSION — expert demonstration
  if concept.stage == 'Unseen':
    show STAKES_STORY + VIDEO_ENCODING            // Shakti-pata conditions

  // SHRAVANAM — receptive intake
  show concept content (30s, no interaction)

  // MANANAM — forced questioning
  MANANAM_PHASE(concept)                          // 3 questions

  // FIRST RETRIEVAL — confidence first
  statedConfidence = CONFIDENCE_TAP()             // Viveka tracking
  show question in appropriate RETRIEVAL_MODE     // Ghana-patha mode selection

  // ANSWER + ADAPTATION
  result = student answers

  if correct AND ritambhara (< 3s):
    concept.patternPerceptionCount += 1           // Ritambhara Prajna

  if wrong:
    POORVA_PAKSHA follow-up: "Why was your answer wrong?"
    NETI_ANALYSIS: eliminate wrong options mechanistically

  // FSRS UPDATE with all modifiers
  newStability = updateFSRS(
    base:           updateStabilityOnAnswer(result),
    encodingBonus:  getEncodingMultiplier(concept.encodingDepth),
    confidenceBonus: getConfidenceBonus(statedConfidence, result),
    tapasBonus:     inTapasMode ? 1.4 : 1.0,
    transmissionBonus: concept.expertVideoWatched ? 1.2 : 1.0,
    nididhyasanamBonus: concept.nididhyasanamCount > 0 ? 1.15 : 1.0,
    randomContextBonus: isMicroTest ? 1.2 : 1.0
  )

  // UPDATE COMPOSITE DEPTH
  concept.samskaraDepth = SAMSKARA_DEPTH(concept)  // full composite

  // NIDIDHYASANAM — after 5 new concepts
  if session.newConceptsCount % 5 == 0:
    NIDIDHYASANAM_PAUSE()

  // ANUSANDHANA — schedule random micro-test
  ANUSANDHANA_SCHEDULER(concept)
```

---

## What This Produces

A student trained on this system does not just "know" the material.

They have the concept encoded through:
- Multiple retrieval pathways (Ghana-patha)
- Multiple contexts (Anusandhana random tests)
- Misconception inhibition (Poorva Paksha + Neti)
- Deep elaborative encoding (Mananam)
- Wakeful + sleep consolidation (Nididhyasanam + pre-sleep set)
- Emotional charge (Stakes story + Tapas)
- Accurate self-model (Viveka)
- Prerequisite structure (Krama)
- Pattern completion capacity (Ritambhara Prajna tracking)

This is not a student who "studied" the concept.
This is a student for whom the concept has become part of their cognitive structure.

The Rishis called this `Jnana` — knowledge that has become being.
CHITTA's goal is to operationalize that state for every concept, systematically, at scale.

---

## New Data Fields Summary

All new fields required across the system:

```typescript
// Concept additions
confusionPair:           { wrongBelief, whyStudentsThinkThis, contrastMechanism }
prerequisiteIds:         string[]
retrievalModesCleared:   Set<'forward'|'reverse'|'lateral'|'elimination'|'connection'>
patternPerceptionCount:  number    // ritambhara events
mantraAnchor:            string    // compression anchor for cluster retrieval
expertVideoWatched:      boolean
samskaraDepth:           number    // composite 0-1

// SessionItem additions
statedConfidence:        1 | 2 | 3
responseTimeMs:          number
isMicroTest:             boolean
retrievalMode:           RetrievalMode
poorvaPakshaShown:       boolean

// Student profile additions
sadhanaProfile:          SadhanaProfile    // four prerequisites scores
mumukshutvaScore:        number            // intrinsic motivation index
```
