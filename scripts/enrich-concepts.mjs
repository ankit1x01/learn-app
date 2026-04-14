/**
 * enrich-concepts.mjs
 * Adds stakesTier, stakesFact, relatedIds, competingIds, interferenceScore
 * to all concepts in both syllabus files.
 *
 * Run: node scripts/enrich-concepts.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const root  = join(__dir, '..');

// ─── stakesFact ───────────────────────────────────────────────────────────────
// Visceral real-world consequence for each concept (amygdala tagging, Layer 9).

const STAKES_FACTS = {
  // ── DSA foundations ──
  f25: "Factorial with wrong base case crashes production code that recurses on user input — interviewers catch this instantly",
  f28: "Fibonacci memoization vs naive recursion is the entry question for DP — blank mind here closes every DP interview",
  f32: "Selection Sort is asked to see if you can explain in-place swaps — O(n²) always, no best case, wrong complexity = instant flag",
  f33: "Bubble Sort vs Insertion Sort is a classic FAANG screen question — not knowing the stability difference fails you at the comparison step",
  f34: "Insertion Sort runs O(n) on nearly-sorted data — this is why Java uses TimSort in production and interviewers ask about it",
  f35: "Merge Sort is stable with guaranteed O(n log n) — Java's Arrays.sort uses this for objects; wrong complexity in an SDE-2 round ends the conversation",
  f38: "Quick Sort is O(n²) on sorted input without pivot randomisation — production engineers who don't know this ship code that hangs under load",
  f16: "GCD Euclidean algorithm is used in every fraction operation, cryptography, and scheduling system — not knowing it reveals gaps in fundamentals",

  // ── DSA arrays ──
  a10: "Missing number using XOR is the Amazon phone screen warm-up — O(n) time O(1) space or the interviewer asks why you used extra space",
  a13: "Sliding window for subarray sum is the pattern interviewers use to see if you think in O(n) — brute force O(n²) means no follow-up question",
  a15: "Two Sum is the single most-asked interview question globally — O(n²) vs O(n) hash map is the exact distinction that separates offers from rejections",
  a16: "Dutch National Flag — sort 0s 1s 2s in one pass — Wipro and Infosys mass hiring drives have included this exact problem every year since 2020",
  a17: "Boyer-Moore voting for majority element is asked because O(1) space matters in production — sorting answer gets partial credit only",
  a18: "Kadane's Algorithm for maximum subarray sum appears in 90% of product company first rounds — not knowing it ends the DSA interview on the spot",
  a20: "Stock Buy and Sell with one pass greedy appears in Amazon coding rounds as the opener — O(n²) brute force with nested loops signals poor problem decomposition",
  a22: "Next Permutation in-place requires understanding three-step reversal — interviewers at Microsoft use this to test whether you can implement without extra space",
  a24: "Longest Consecutive Sequence in O(n) uses hash sets — O(n log n) sorting solution gets you filtered at Flipkart senior rounds",
  a28: "Prefix sum plus hash map for subarray count is the O(n) solution — TLE on brute force at this stage of a loop means automatic rejection",
  a30: "Majority Element II with Boyer-Moore extended voting catches every student who only memorised the simpler version — real interviews always ask the harder variant",
  a33: "Count Inversions via merge sort is asked at fintech companies because it maps to trade ordering problems — O(n²) brute force fails every time limit",

  // ── Trees ──
  t22: "Pre-order traversal is the first tree question every interviewer asks — confusing it with in-order order is disqualifying at any level",
  t23: "In-order traversal gives sorted output on BST — Microsoft and Atlassian test this property explicitly; not knowing it signals you studied trees without understanding them",
  t24: "Post-order traversal is used in expression evaluation and file system deletion — wrong order cascades into every subsequent tree question",
  t25: "Level-order BFS traversal is used in real pathfinding and shortest-path systems — this is the baseline for every graph interview at product companies",
  t28: "Height of Binary Tree is asked in every campus placement technical round — wrong recursion structure here signals weak tree intuition",
  t29: "Check Balanced Binary Tree in O(n) requires a single-pass DFS — two-pass O(n²) solution fails follow-up questions about large trees",
  t34: "Lowest Common Ancestor appears in every Google and Flipkart on-site — brute force path-based solution fails on trees with 10⁵ nodes",
  t41: "Diameter of Binary Tree in one DFS pass — two-pass solution exists but interviewers ask for the optimised version as a follow-up instantly",
  t45: "Right View of Binary Tree is asked because it tests if you understand level-order vs DFS approaches — wrong traversal direction = wrong answer",

  // ── DP ──
  d17: "Introduction to DP — memoisation vs tabulation distinction is the gateway question — not knowing the difference means you are coding recursion not DP",
  d18: "Climbing Stairs is the canonical DP warm-up problem — every company from TCS to Google uses it to verify you understand overlapping subproblems",
  d21: "Maximum Sum of Non-Adjacent Elements is the House Robber problem — Flipkart and Swiggy use this to test 1D DP in under 15 minutes",
  d22: "House Robber appears in every product company DP round — solving the circular variant correctly signals you understand state transitions fully",
  d24: "Grid Unique Paths is in 80% of Amazon and Infosys DP question banks — wrong state definition leads to off-by-one answers that look plausible but fail on edge cases",
  d34: "Longest Common Subsequence is asked in Infosys Specialist Programmer and TCS Digital rounds — it is the parent pattern for edit distance and diff algorithms",
  d40: "0/1 Knapsack is the canonical capacity DP problem — every variant (subset sum, partition equal sum) traces back to knowing this template cold",
  d44: "Coin Change minimum coins problem appears in fintech and e-commerce interviews — brute force exponential solution triggers an immediate follow-up about greedy failures",
  d50: "Longest Increasing Subsequence in O(n log n) is asked at Microsoft and Adobe — O(n²) DP solution exists but binary search version is expected in senior rounds",
  d54: "Edit Distance (Levenshtein) is used in spell-checkers, diff tools, and genome alignment — interviewers at product companies ask it to see if you can derive the recurrence yourself",

  // ─────────────────────────────────────────────────────────────────────────────
  // ── IT Placement — DSA & Coding ──
  c01: "Two-Pointer pattern solves 30% of array interview questions — not recognising the trigger when a problem says 'sorted array and target sum' loses you FAANG-level offers",
  c02: "Variable Sliding Window is the O(n) answer interviewers expect — submitting O(n²) nested loops signals you never studied the pattern and gets your resume rejected",
  c03: "Maximum subarray sum has appeared in Google, Amazon, Microsoft, and TCS Digital every year — blank mind on Kadane's Algorithm ends the coding round immediately",
  c04: "Prefix sum makes range queries O(1) after O(n) build — database query optimisation interviews at Oracle and SAP always test this thinking",
  c05: "Off-by-one in Binary Search boundary conditions is the #1 reason candidates fail on-site rounds after clearing the phone screen — wrong lo/hi update causes infinite loops",
  c06: "Dutch National Flag appears in Infosys mass hiring drives every year — O(n) three-pointer or brute force O(n²) is the exact filter question",
  c07: "Array rotation in-place using reversal trick is O(n) O(1) space — extra-array copy solution shows you haven't studied in-place techniques",
  c08: "Stock Buy Sell in one greedy pass appears as the opener in Amazon coding rounds — solving it in O(n) vs O(n²) reveals whether you see the greedy structure",
  c09: "Longest Substring Without Repeating Characters is the canonical sliding window string problem — wrong window expansion logic gives TLE on every large input",
  c10: "Anagram detection using frequency maps is asked at Accenture and Capgemini in-person rounds — sorting-based O(n log n) solution versus O(n) hash map is the key question",
  c14: "Reverse Linked List is the most-asked linked list question globally — recursion vs iteration trade-off plus space complexity is the standard follow-up",
  c15: "Floyd's Cycle Detection runs in O(n) O(1) space — hash set solution exists but interviewers always ask for the two-pointer version as the optimal answer",
  c16: "Merge Two Sorted Lists is used in Merge Sort and in database join implementations — wrong pointer handling corrupts the list and fails test cases silently",
  c17: "Remove Nth Node From End using two-pointer in one pass is a clean interview question — two-pass solution works but signals you haven't practised the pattern",
  c20: "Balanced Parentheses using a stack is the most-asked stack question in placement tests — wrong pop order fails all nested cases",
  c21: "Next Greater Element with monotonic stack reduces O(n²) brute force to O(n) — this exact problem appeared in Paytm and PhonePe coding rounds in 2024",
  c26: "Binary Tree traversal orders are the first question every tree interview starts with — confusing pre/in/post signals you studied names not mechanisms",
  c27: "Level Order BFS traversal is the foundation of every graph shortest-path algorithm — not knowing it means you cannot implement Dijkstra or Prim's from scratch",
  c28: "Tree height and diameter in a single DFS pass is asked to separate O(n) thinkers from O(n²) thinkers — two-pass solution loses points at senior level",
  c29: "Lowest Common Ancestor in BST vs Binary Tree are two different problems — interviewers at Google and Flipkart ask both back-to-back to test your understanding",
  c31: "BST insertion and deletion are asked because wrong parent-pointer updates corrupt the structure — every database B-tree implementation relies on this logic",
  c35: "BFS gives shortest path in unweighted graphs — using DFS here gives a wrong answer that looks plausible and wastes 20 minutes of your interview",
  c36: "DFS with cycle detection and connected components is the base of topological sort — wrong visited-state handling gives wrong cycle detection results",
  c37: "Topological Sort using Kahn's BFS algorithm is asked in every system design adjacent coding round — wrong ordering breaks build systems and task schedulers",
  c38: "Number of Islands using BFS/DFS on a grid is the most-asked graph interview question at product companies — missing the visited-marking logic gives wrong count",
  c41: "Merge Sort stability and O(n log n) worst case are tested at SDE-2 level — confusing its complexity with Quick Sort's average case fails a classic comparison question",
  c42: "Quick Sort with wrong pivot choice gives O(n²) worst case on sorted arrays — this is why production systems use randomised Quick Sort or Introsort",
  c46: "Fibonacci with memoisation vs tabulation is the gateway DP question — not explaining the overlapping subproblems concept means you will fail every subsequent DP problem",
  c47: "Climbing Stairs is asked in 60% of placement tests as the DP warm-up — wrong recurrence relation means you are building an array but not understanding DP",
  c49: "0/1 Knapsack is the template for Subset Sum, Partition Equal Subset Sum, and Target Sum — not knowing it cold means you cannot recognise the DP pattern in disguise",
  c50: "Coin Change minimum coins problem is asked in fintech companies because it maps to payment denomination problems — greedy fails on certain coin sets; knowing why is the question",

  // ── IT Placement — Quantitative ──
  q01: "LCM and HCF questions appear in every TCS NQT and Wipro NLTH aptitude round — slow calculation here burns time that cascades into failing subsequent questions",
  q06: "Percentage change is the most fundamental aptitude formula — wrong application under time pressure fails banking and fintech first-round assessments",
  q09: "Profit and Loss with CP/SP/Markup appears in 80% of Indian IT company aptitude tests — confusing markup and profit percentage fails entire question sets",
  q15: "Simple Interest formula confusion costs 5-10 marks in placement aptitude rounds — wrong answer on a straightforward question signals poor preparation",
  q16: "Compound Interest vs Simple Interest distinction is tested in every banking recruitment and IT aptitude round — mixing up formulas fails all CI variants",
  q22: "Speed-Distance-Time is the most-applied aptitude concept in placement tests — wrong formula under timed pressure cascades into wrong answers for train and boat problems",
  q23: "Relative speed for trains is a classic trap in Infosys and Wipro assessments — adding vs subtracting speeds for same vs opposite direction is the exact confusion point",
  q30: "Factorial, nPr and nCr formula confusion is the #1 reason students lose marks in the P&C section — wrong formula selection on a 5-question set loses all 5 marks",
  q35: "Basic probability with sample spaces is asked in every Cognizant, TCS, and Accenture round — wrong sample space enumeration gives plausible-looking wrong answers",
  q57: "Seating arrangement problems are timed at 2 minutes each in placement tests — slow table setup means you run out of time and score zero on the entire set",
  q60: "Syllogisms with All/Some/No quantifiers are given 8 minutes for 5 questions in TCS Ninja — missing the contrapositive rule fails every 'some' conclusion question",

  // ── IT Placement — English ──
  e01: "Reading comprehension carries 20-25 marks in every IT placement test — wrong main idea identification cascades into wrong answers on all 4-5 sub-questions",
  e06: "Subject-verb agreement errors are the most common reason for low English scores in Accenture and Capgemini assessments — one rule violation flags weak grammar fundamentals",
  e07: "Tense errors in error-spotting are the most frequent grammar question type — wrong perfect continuous vs simple past identification loses clusters of marks",
  e14: "Error spotting in TCS Digital and Infosys Specialist rounds gives 10 questions with negative marking — each wrong answer subtracts 0.33 marks from your score",
  e22: "Para-jumbles appear in every major IT placement test — wrong ordering on a 5-sentence set gives zero marks for the entire question regardless of partial correctness",

  // ── IT Placement — Databases ──
  db01: "SELECT with WHERE and ORDER BY is the first SQL screen question at every company — unable to write a basic query live signals you have never used SQL in practice",
  db02: "LEFT JOIN vs INNER JOIN distinction is the most-failed SQL interview question — wrong join type silently drops rows and gives plausible but incorrect results",
  db03: "GROUP BY with HAVING filters aggregate results — confusing WHERE with HAVING is the classic SQL error that interviewers use to filter candidates who copy-paste queries",
  db04: "Aggregate functions COUNT vs SUM vs AVG are asked in every database technical round — wrong function on a NULL-containing column gives surprising results that you must explain",
  db09: "1NF 2NF 3NF normalisation is asked in every campus placement technical interview — inability to spot partial and transitive dependencies signals you studied definitions not reasoning",
  db11: "Primary, Candidate, and Foreign Key distinctions plus functional dependencies are the basis of all schema design questions — wrong definition fails every ERD design question",
  db15: "ACID properties are asked in every backend and database interview — not being able to give a real example for each property signals you memorised acronyms without understanding",
  db22: "SQL vs NoSQL trade-off question appears in 70% of system design interviews at product companies — wrong choice for a use case signals you cannot make architectural decisions",

  // ── IT Placement — OS ──
  os01: "Process vs Thread distinction is the first OS question in every campus placement technical round — wrong memory isolation answer reveals you studied the surface definition only",
  os02: "Context switching overhead is why Go uses goroutines and Node uses event loops — not understanding this means you cannot explain why concurrency models differ",
  os04: "Process state machine with Ready, Running, Waiting transitions is asked in TCS and Infosys technical rounds — drawing wrong transitions fails all scheduling follow-up questions",
  os05: "FCFS vs SJF vs Round Robin Gantt chart calculation is the standard OS numerical question in campus placements — wrong waiting time calculation loses all marks on the numerical set",
  os08: "Paging with TLB and address translation is asked at companies building systems software — unable to calculate physical address from virtual address fails every OS numerical",

  // ── IT Placement — OOP ──
  oo01: "Encapsulation vs Abstraction is the most confused OOP question — mixing up hiding implementation from hiding data fails every Java and Python OOP interview at service companies",
  oo03: "Polymorphism with compile-time vs runtime distinction is asked in every Java role interview — wrong overloading vs overriding example signals you know OOP vocabulary but not mechanics",
  oo06: "Inheritance vs Composition trade-off is the most important OOP design principle — always choosing inheritance over composition is the classic mistake that gets you rejected at senior level",
};

// ─── relatedIds ───────────────────────────────────────────────────────────────
// Mechanistically related concepts — studying these together within 2h
// triggers synaptic tagging and improves retention of both by 30-40% (Layer 5).

const RELATED_IDS = {
  // DSA foundations — sorting pairs
  f32: ['f33', 'f34'],           // Selection ↔ Bubble ↔ Insertion (all O(n²) comparison sorts)
  f33: ['f32', 'f34', 'f35'],    // Bubble ↔ Selection, Insertion, Merge
  f34: ['f32', 'f33'],           // Insertion ↔ Selection, Bubble
  f35: ['f38'],                  // Merge Sort ↔ Quick Sort (both divide-and-conquer)
  f38: ['f35'],                  // Quick Sort ↔ Merge Sort

  // DSA arrays — pattern clusters
  a13: ['a14', 'a28'],           // Longest subarray sum K ↔ negatives variant ↔ count subarrays
  a14: ['a13', 'a28'],
  a15: ['a28', 'a16'],           // Two Sum ↔ Count subarrays ↔ Sort 0s1s2s (hash + two-pointer)
  a16: ['a07'],                  // Dutch National Flag ↔ Move Zeros (both multiple pointers)
  a07: ['a16'],
  a18: ['a19', 'a20'],           // Kadane's ↔ Print subarray ↔ Stock Buy Sell (greedy on array)
  a19: ['a18'],
  a20: ['a18'],
  a28: ['a13', 'a14', 'a15'],    // Count subarrays ↔ Longest subarray variants ↔ Two Sum

  // DSA DP clusters
  d17: ['d18', 'd19'],           // Intro to DP ↔ Climbing Stairs ↔ Frog Jump (both 1D DP intro)
  d18: ['d17', 'd19', 'd24'],    // Climbing Stairs ↔ Frog Jump ↔ Grid Unique Paths
  d19: ['d18', 'd20'],           // Frog Jump ↔ Climbing Stairs ↔ K-distances variant
  d20: ['d19'],
  d21: ['d22'],                  // Max sum non-adjacent ↔ House Robber (same recurrence)
  d22: ['d21'],
  d24: ['d25', 'd18'],           // Grid Unique Paths ↔ Obstacles variant ↔ Climbing Stairs
  d25: ['d24'],

  // IT placement — DSA & Coding clusters
  c01: ['c02', 'c06'],           // Two-Pointer ↔ Sliding Window ↔ Dutch National Flag
  c02: ['c01', 'c09'],           // Sliding Window ↔ Two-Pointer ↔ Longest Substring
  c03: ['c04', 'c08'],           // Kadane's ↔ Prefix Sum ↔ Stock Buy Sell
  c04: ['c03'],                  // Prefix Sum ↔ Kadane's
  c08: ['c03'],                  // Stock Buy Sell ↔ Kadane's
  c09: ['c02'],                  // Longest Substring ↔ Sliding Window
  c14: ['c15', 'c16'],           // Reverse LL ↔ Cycle Detection ↔ Merge Sorted LL
  c15: ['c14'],                  // Cycle Detection ↔ Reverse LL
  c16: ['c14', 'c17'],           // Merge Sorted LL ↔ Reverse LL ↔ Remove Nth Node
  c17: ['c16'],
  c26: ['c27', 'c28'],           // Tree traversals ↔ Level Order ↔ Height/Diameter
  c27: ['c26', 'c35'],           // Level Order ↔ Tree traversals ↔ BFS on Graph
  c28: ['c26', 'c30'],           // Height/Diameter ↔ Tree traversals ↔ Balanced check
  c30: ['c28'],
  c31: ['c29'],                  // BST ↔ LCA (both use BST ordering property)
  c29: ['c31'],
  c35: ['c36', 'c27'],           // BFS ↔ DFS ↔ Level Order
  c36: ['c35', 'c37'],           // DFS ↔ BFS ↔ Topological Sort
  c37: ['c36', 'c38'],           // Topological Sort ↔ DFS ↔ Number of Islands
  c38: ['c35', 'c36'],           // Number of Islands ↔ BFS/DFS
  c41: ['c42'],                  // Merge Sort ↔ Quick Sort
  c42: ['c41'],                  // Quick Sort ↔ Merge Sort
  c46: ['c47', 'c48'],           // Fibonacci DP ↔ Climbing Stairs ↔ Unique Paths
  c47: ['c46', 'c48'],           // Climbing Stairs ↔ Fibonacci ↔ Unique Paths
  c48: ['c47', 'c49'],           // Unique Paths ↔ Climbing Stairs ↔ Knapsack
  c49: ['c50', 'c48'],           // 0/1 Knapsack ↔ Coin Change ↔ Unique Paths
  c50: ['c49'],                  // Coin Change ↔ 0/1 Knapsack

  // IT placement — Quantitative clusters
  q15: ['q16', 'q17'],           // Simple Interest ↔ Compound Interest ↔ CI vs SI diff
  q16: ['q15', 'q17'],
  q17: ['q15', 'q16'],
  q30: ['q31', 'q32'],           // nPr / nCr ↔ Arrangements ↔ Combinations
  q31: ['q30', 'q32'],
  q32: ['q30', 'q31'],
  q35: ['q36', 'q38'],           // Basic Probability ↔ Complementary ↔ Cards/Coins/Dice
  q36: ['q35', 'q38'],
  q38: ['q35', 'q36'],
  q39: ['q41'],                  // Linear Equations ↔ Simultaneous Equations
  q41: ['q39'],
  q22: ['q23', 'q24'],           // Speed-Distance-Time ↔ Trains ↔ Boats & Streams
  q23: ['q22', 'q24'],
  q24: ['q22', 'q23'],
  q06: ['q07', 'q08'],           // Percentage Increase ↔ Successive % Change ↔ % to Fraction
  q07: ['q06', 'q08'],
  q08: ['q06', 'q07'],
  q09: ['q10', 'q11'],           // Profit & Loss ↔ Discount & Marked Price ↔ Dishonest Dealer
  q10: ['q09', 'q11'],
  q26: ['q27'],                  // Average basic ↔ Adding/Removing members

  // IT placement — DB clusters
  db01: ['db02', 'db03', 'db04'], // SELECT/WHERE ↔ JOINs ↔ GROUP BY ↔ Aggregates
  db02: ['db01', 'db07', 'db08'], // JOINs ↔ SELECT ↔ UNION/INTERSECT ↔ Self Join
  db03: ['db01', 'db04'],         // GROUP BY ↔ SELECT ↔ Aggregates
  db04: ['db03'],
  db09: ['db10', 'db11'],         // 1NF-3NF ↔ BCNF ↔ Functional Dependencies
  db10: ['db09'],
  db11: ['db09'],
  db15: ['db16', 'db17', 'db18'], // ACID ↔ Isolation Levels ↔ Locking ↔ Deadlock
  db16: ['db15', 'db17'],
  db17: ['db15', 'db16'],

  // IT placement — OS clusters
  os01: ['os02', 'os04'],         // Process vs Thread ↔ Context Switch ↔ Process States
  os02: ['os01'],
  os04: ['os01', 'os05'],         // Process States ↔ Process vs Thread ↔ CPU Scheduling
  os05: ['os06'],                 // FCFS/SJF/RR ↔ Priority Scheduling
  os06: ['os05'],

  // IT placement — OOP clusters
  oo01: ['oo03', 'oo02'],         // Encapsulation ↔ Abstraction ↔ Inheritance
  oo02: ['oo01', 'oo06'],         // Inheritance ↔ Encapsulation ↔ Composition
  oo03: ['oo01'],                 // Abstraction ↔ Encapsulation
  oo06: ['oo02'],                 // Composition ↔ Inheritance
};

// ─── competingIds + interferenceScore ────────────────────────────────────────
// Concepts that actively interfere with each other's retrieval (Layer 6).
// interferenceScore: 0–1, how strongly the competition suppresses this concept.

const COMPETING = {
  // DSA foundations
  f33: { ids: ['f34'], score: 0.45 },   // Bubble vs Insertion Sort — mechanism confusion
  f34: { ids: ['f33'], score: 0.45 },
  f35: { ids: ['f38'], score: 0.55 },   // Merge vs Quick Sort — stability/complexity confusion
  f38: { ids: ['f35'], score: 0.55 },

  // DSA arrays
  a18: { ids: ['a28'], score: 0.30 },   // Kadane's (max subarray) vs Count subarrays
  a28: { ids: ['a18'], score: 0.30 },
  a13: { ids: ['a14'], score: 0.40 },   // Longest subarray positive-only vs with negatives
  a14: { ids: ['a13'], score: 0.40 },

  // IT placement — DSA
  c01: { ids: ['c02'], score: 0.50 },   // Two-Pointer vs Sliding Window trigger confusion
  c02: { ids: ['c01'], score: 0.50 },
  c03: { ids: ['c04'], score: 0.35 },   // Kadane's vs Prefix Sum — both subarray patterns
  c04: { ids: ['c03'], score: 0.35 },
  c35: { ids: ['c36'], score: 0.60 },   // BFS vs DFS — traversal confusion is the most common graph error
  c36: { ids: ['c35'], score: 0.60 },
  c41: { ids: ['c42'], score: 0.50 },   // Merge Sort vs Quick Sort
  c42: { ids: ['c41'], score: 0.50 },
  c49: { ids: ['c50'], score: 0.40 },   // Knapsack vs Coin Change — both unbounded/bounded DP confusion
  c50: { ids: ['c49'], score: 0.40 },
  c26: { ids: ['c27'], score: 0.35 },   // Tree traversals vs Level Order (DFS vs BFS framing)
  c27: { ids: ['c26'], score: 0.35 },

  // IT placement — Quant
  q15: { ids: ['q16'], score: 0.70 },   // SI vs CI formula confusion is the most-failed quant topic
  q16: { ids: ['q15'], score: 0.70 },
  q30: { ids: ['q32'], score: 0.65 },   // nPr vs nCr — arrangement vs selection confusion
  q32: { ids: ['q30'], score: 0.65 },
  q09: { ids: ['q10'], score: 0.45 },   // Profit & Loss vs Discount & Marked Price
  q10: { ids: ['q09'], score: 0.45 },
  q23: { ids: ['q24'], score: 0.50 },   // Trains (same direction) vs Boats & Streams
  q24: { ids: ['q23'], score: 0.50 },

  // IT placement — DB
  db02: { ids: ['db08'], score: 0.40 }, // Regular JOIN vs Self Join
  db08: { ids: ['db02'], score: 0.40 },
  db09: { ids: ['db10'], score: 0.50 }, // 3NF vs BCNF — the subtle distinction always fails candidates
  db10: { ids: ['db09'], score: 0.50 },
  db15: { ids: ['db16'], score: 0.45 }, // ACID properties vs Isolation Levels
  db16: { ids: ['db15'], score: 0.45 },

  // IT placement — OS
  os01: { ids: ['os02'], score: 0.40 }, // Process vs Thread vs Context Switch
  os02: { ids: ['os01'], score: 0.40 },
  os05: { ids: ['os06'], score: 0.45 }, // FCFS/SJF/RR — algorithms confused under time pressure
  os06: { ids: ['os05'], score: 0.45 },

  // IT placement — OOP
  oo01: { ids: ['oo03'], score: 0.55 }, // Encapsulation vs Abstraction — classic confusion
  oo03: { ids: ['oo01'], score: 0.55 },
  oo02: { ids: ['oo06'], score: 0.45 }, // Inheritance vs Composition
  oo06: { ids: ['oo02'], score: 0.45 },
};

// ─── Transform a single concepts file ────────────────────────────────────────

function enrichFile(filePath) {
  const src = readFileSync(filePath, 'utf8');
  const lines = src.split('\n');

  const out = lines.map(line => {
    // Only process concept lines (contains `id: '`)
    if (!line.includes("id: '") || !line.includes('nextReview:')) return line;

    // Extract id
    const idMatch = line.match(/id:\s*'([^']+)'/);
    if (!idMatch) return line;
    const id = idMatch[1];

    // Extract pyqTier
    const tierMatch = line.match(/pyqTier:\s*(\d)/);
    const pyqTier = tierMatch ? parseInt(tierMatch[1]) : 2;
    const stakesTier = Math.min(pyqTier, 3);

    // Build extra fields string
    const extras = [];

    // stakesTier always
    extras.push(`stakesTier: ${stakesTier}`);

    // stakesFact
    if (STAKES_FACTS[id]) {
      extras.push(`stakesFact: ${JSON.stringify(STAKES_FACTS[id])}`);
    }

    // relatedIds
    if (RELATED_IDS[id]) {
      extras.push(`relatedIds: ${JSON.stringify(RELATED_IDS[id])}`);
    }

    // competingIds + interferenceScore
    if (COMPETING[id]) {
      extras.push(`competingIds: ${JSON.stringify(COMPETING[id].ids)}`);
      extras.push(`interferenceScore: ${COMPETING[id].score}`);
    }

    // Inject before the closing `}` on the line
    // Pattern: `nextReview: -1 }` or `nextReview: -1 },`
    return line.replace(/(nextReview:\s*-1\s*)(},?)/, `$1, ${extras.join(', ')} $2`);
  });

  writeFileSync(filePath, out.join('\n'), 'utf8');
  console.log(`✓ Enriched: ${filePath}`);
}

// ─── Run ──────────────────────────────────────────────────────────────────────

enrichFile(join(root, 'src/syllabus/dsa/concepts.ts'));
enrichFile(join(root, 'src/syllabus/itplacement/concepts.ts'));

console.log('\nDone. Fields added:');
console.log(`  stakesTier   → all concepts (auto-derived from pyqTier)`);
console.log(`  stakesFact   → ${Object.keys(STAKES_FACTS).length} concepts`);
console.log(`  relatedIds   → ${Object.keys(RELATED_IDS).length} concepts`);
console.log(`  competingIds → ${Object.keys(COMPETING).length} concepts`);
