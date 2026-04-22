# Content Generation Strategy: Real Numbers

**Context:** R&D for translating traditional textbook chapters into the CHITTA Neuroscience & FSRS ecosystem. This document outlines how we break down the "Real Numbers" chapter into trackable, measurable, and playable atomic concepts.

## 1. Atomic Concept Extraction (The `Concept` Data Model)
We break the text into micro-nodes. Each node becomes a `Concept` entry in our database with specific FSRS and Stakes tracking, rather than standard Q&A flashcards.

* **Concept 1: Fundamental Theorem of Arithmetic (FTA)**
  * **Core Fact:** Every composite number has a unique prime factorization (ignoring order).
  * **StakesTier:** High (Foundation for everything).
* **Concept 2: HCF vs. LCM Identification**
  * **Core Fact:** HCF = Product of *smallest* power of common primes. LCM = Product of *greatest* power of all primes.
* **Concept 3: The 2-Number Product Rule**
  * **Core Fact:** $HCF(a,b) \times LCM(a,b) = a \times b$
* **Concept 4: Divisibility Theorem (Theorem 1.2)**
  * **Core Fact:** If a prime $p$ divides $a^2$, then $p$ divides $a$.

## 2. Neuroscience Layer Mapping
Our app predicts where the student will make a mistake (Prediction Error). We must deliberately generate content that triggers and resolves these confusions to map accurately to `interferenceScore` and `competingIds`.

* **Interference 1 (HCF vs. LCM Trap):** Students constantly swap "smallest power" with "greatest power" because "Highest" Common Factor conceptually conflicts with "smallest power".
  * *Action:* Create forced-choice flashcards explicitly contrasting these two to lower the `interferenceScore`.
* **Interference 2 (The 3-Number Trap):** The text explicitly notes that $HCF(p,q,r) \times LCM(p,q,r) \neq p \times q \times r$.
  * *Action:* Set this as a High-Interference concept with linked `competingIds` to the 2-number rule.

## 3. Mapping to App Games (Active Recall & Interleaving)
We use specific UI games to build structural and sequential memory.

### A. Chrono Game (Timeline / Sequencing)
Used for mathematical proofs and logical sequences. Students must drag the logical steps of the "Proof by Contradiction" into the correct order.
* **Card 1:** Assume $\sqrt{2}$ is rational ($\sqrt{2} = \frac{a}{b}$, where $a,b$ are coprime).
* **Card 2:** Square both sides ($2b^2 = a^2$).
* **Card 3:** Deduce 2 divides $a^2$, thus 2 divides $a$ ($a = 2c$).
* **Card 4:** Substitute $a$ ($2b^2 = 4c^2 \Rightarrow b^2 = 2c^2$).
* **Card 5:** Deduce 2 divides $b^2$, thus 2 divides $b$.
* **Card 6:** Contradiction reached ($a$ and $b$ have a common factor of 2).

### B. Links Game (Node Connections)
Used to build relationships between facts, conditions, and proofs.
* **Node 1 (Condition):** "$4^n$ ends with the digit zero"
* **Connects to Node 2 (Requirement):** "Prime factorization must contain 2 AND 5"
* **Connects to Node 3 (Fact):** "$4^n = (2^2)^n$, which only contains prime 2"
* **Connects to Node 4 (Conclusion):** "Therefore, $4^n$ can never end in zero"

## 4. Encoding Tips (`encodingDepth`)
For each concept, we generate a Vedic/Memory tag to increase `encodingDepth`.
* *Example (HCF/LCM):* "HCF is the strict bouncer (only accepts common primes, gives them the lowest power). LCM is the party host (invites ALL primes, gives them the highest power)."
* *Example (Contradiction Proofs):* "Proof by contradiction is like assuming the suspect is innocent, then finding their fingerprints everywhere to prove the assumption is impossible."