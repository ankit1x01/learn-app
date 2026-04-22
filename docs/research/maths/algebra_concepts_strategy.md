# Content Generation Strategy: Algebra (Polynomials, Linear & Quadratic Equations)

**Context:** R&D for translating textbook chapters (Polynomials, Linear Equations in Two Variables, Quadratic Equations) into the CHITTA Neuroscience & FSRS ecosystem. 

## 1. Atomic Concept Extraction

### A. Polynomials
* **Concept 1: Geometrical Zeroes**
  * **Core Fact:** The zeroes of a polynomial $p(x)$ are the x-coordinates of the points where the graph intersects the x-axis.
* **Concept 2: Quadratic Roots Relationship**
  * **Core Fact:** Sum of zeroes ($\alpha + \beta$) = $-b/a$. Product of zeroes ($\alpha\beta$) = $c/a$.

### B. Pair of Linear Equations in Two Variables
* **Concept 3: Ratio Conditions & Graphical Behavior**
  * **Core Fact:** Intersecting lines ($a_1/a_2 \neq b_1/b_2$), Coincident lines ($a_1/a_2 = b_1/b_2 = c_1/c_2$), Parallel lines ($a_1/a_2 = b_1/b_2 \neq c_1/c_2$).
* **Concept 4: Consistency**
  * **Core Fact:** Consistent = at least one solution (intersecting or coincident). Inconsistent = no solution (parallel).

### C. Quadratic Equations
* **Concept 5: Standard Form**
  * **Core Fact:** $ax^2 + bx + c = 0$, where $a \neq 0$.
* **Concept 6: The Discriminant**
  * **Core Fact:** $D = b^2 - 4ac$. Determines the nature of roots.
  * **Rules:** $D > 0$ (two distinct real), $D = 0$ (two equal real), $D < 0$ (no real roots).

## 2. Neuroscience Layer Mapping (`interferenceScore`)
* **Interference 1 (Coefficients Formula Trap):** Students frequently drop the negative sign in $\alpha + \beta = -b/a$, confusing it with the positive product $c/a$.
  * *Action:* Create Prediction Error flashcards specifically testing the sign of the sum of roots.
* **Interference 2 (Linear Equations Ratios):** Parallel vs Coincident conditions look almost identical to the brain.
  * *Action:* High `competingIds` linking between parallel ($c_1/c_2$ is unequal) and coincident ($c_1/c_2$ is equal).

## 3. Mapping to App Games (Active Recall & Interleaving)

### A. Links Game (Node Connections)
Perfect for testing the relationship between Algebraic Condition, Graphical Representation, and Number of Solutions.
* **Node Group 1 (Linear Equations):** 
  * Node A: "$a_1/a_2 \neq b_1/b_2$" -> Connects to -> "Intersecting Lines" -> Connects to -> "Unique Solution" & "Consistent"
  * Node B: "$a_1/a_2 = b_1/b_2 \neq c_1/c_2$" -> Connects to -> "Parallel Lines" -> Connects to -> "No Solution" & "Inconsistent"
* **Node Group 2 (Discriminant):**
  * "$b^2 - 4ac = 0$" -> Connects to -> "Two Equal Real Roots" -> Connects to -> "Parabola touches x-axis at exactly one point"

### B. Chrono Game (Timeline / Sequencing)
Used for process-based algorithms (Elimination Method).
* **Card 1:** Multiply equations to make one variable's coefficients numerically equal.
* **Card 2:** Add or subtract the equations to eliminate that variable.
* **Card 3:** Solve the resulting 1-variable equation.
* **Card 4:** Substitute that value back into an original equation to find the second variable.

## 4. Encoding Tips (`encodingDepth`)
* *Example (Discriminant):* "Think of $b^2 - 4ac$ as the DNA test of a quadratic. If it's positive, you get two distinct children. If it's zero, you get identical twins. If it's negative, it's a ghost (imaginary/no real roots)."
* *Example (Polynomial Zeroes):* "Zeroes are exactly where the polynomial runs out of gas and hits the ground (x-axis)."