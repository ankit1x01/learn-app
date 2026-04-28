import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';


import { Screen } from '../types';
import { Concept } from '../core/types';

interface Props { setScreen: (s: Screen) => void; concepts: Concept[]; }

interface DistractorQ {
  concept: string;
  subject: string;
  question: string;
  correctAnswer: string;
  wrongAnswer: string;
  whyWrong: string[];
  correctWhyIdx: number;
  correctExplanation: string;
}

const DISTRACTOR_BANK: DistractorQ[] = [
  {
    concept: "Binary Search", subject: "Arrays & Search",
    question: "Binary search can only be applied to arrays that are sorted in ascending order.",
    correctAnswer: "False — any monotonic condition (ascending or descending) works",
    wrongAnswer: "True — binary search strictly requires ascending order",
    whyWrong: [
      "Binary search works on any monotonic predicate — the condition just needs to be consistently true on one side and false on the other",
      "Ascending is the only order computers support for binary search",
      "Descending arrays need to be reversed first before binary search",
      "Binary search requires both sorted order AND no duplicates"
    ],
    correctWhyIdx: 0,
    correctExplanation: "Binary search works whenever you have a monotonic predicate — true on the left, false on the right (or vice versa). A descending sorted array, or 'binary search on answer' over a search space, all work without being ascending. The key invariant is that the condition partitions the space into two halves."
  },
  {
    concept: "BFS vs DFS", subject: "Trees & Graphs",
    question: "DFS always finds the shortest path between two nodes in an unweighted graph.",
    correctAnswer: "False — BFS guarantees shortest path; DFS does not",
    wrongAnswer: "True — DFS explores all paths and can return the shortest",
    whyWrong: [
      "DFS goes deep along one path before backtracking — it may find A→C→B before A→B, returning a longer path first",
      "Both BFS and DFS guarantee shortest path in unweighted graphs",
      "DFS is faster than BFS so it finds the shortest path more efficiently",
      "DFS uses a stack which processes nodes in optimal order for shortest path"
    ],
    correctWhyIdx: 0,
    correctExplanation: "BFS explores level by level, so the first time it reaches a node is via the shortest path. DFS follows one branch to the end before backtracking — it can reach a node via a long path before exploring the short one. For shortest path in an unweighted graph, always use BFS."
  },
  {
    concept: "Two Pointer Technique", subject: "Arrays & Search",
    question: "The two-pointer technique requires the input array to be sorted.",
    correctAnswer: "False — two pointers work on unsorted arrays too (e.g., fast/slow on linked list)",
    wrongAnswer: "True — two pointers only work on sorted arrays",
    whyWrong: [
      "Two pointers is a strategy for maintaining two indices; sorting is only required when the convergence logic depends on order (e.g., pair sum). Fast/slow pointers on a linked list, or read/write pointers for in-place modification, don't need sorting.",
      "Without sorting, the two pointers cannot move in a predictable direction",
      "All two-pointer problems on LeetCode have sorted input",
      "Two pointers on unsorted input degrades to O(n²) anyway"
    ],
    correctWhyIdx: 0,
    correctExplanation: "Two pointers is a broad technique: sorted pair-sum needs sorted input, but fast/slow pointer for cycle detection, read/write pointer for removing duplicates in-place, or Dutch National Flag — none require pre-sorting. The technique is about maintaining two positions, not about sorted order."
  },
  {
    concept: "Dynamic Programming", subject: "DP & Greedy",
    question: "Every problem with overlapping subproblems can be solved optimally with a greedy algorithm.",
    correctAnswer: "False — overlapping subproblems signal DP, not greedy",
    wrongAnswer: "True — overlapping subproblems mean greedy works optimally",
    whyWrong: [
      "Overlapping subproblems is a hallmark of DP (memoisation/tabulation), not greedy. Greedy makes one local choice at each step without revisiting — it doesn't handle overlapping subproblems.",
      "Greedy is always faster than DP for the same problem",
      "Both DP and Greedy are equivalent for problems with overlapping subproblems",
      "Overlapping subproblems reduce to a base case that greedy handles directly"
    ],
    correctWhyIdx: 0,
    correctExplanation: "DP applies when a problem has both overlapping subproblems AND optimal substructure. Greedy requires optimal substructure but NOT overlapping subproblems — it makes an irreversible local choice and never revisits. If subproblems overlap (same subproblem computed multiple times), you need memoisation or tabulation (DP), not greedy."
  },
  {
    concept: "Sliding Window", subject: "Arrays & Search",
    question: "A fixed-size sliding window and a variable-size sliding window use the same template.",
    correctAnswer: "False — variable-size uses expand/shrink logic; fixed-size just slides by one step",
    wrongAnswer: "True — both templates are identical, only the window size constant changes",
    whyWrong: [
      "Fixed window: add right element, remove left element on every step. Variable window: expand right until condition violated, then shrink left until valid — completely different control flow.",
      "Both windows expand and shrink using the same while-loop logic",
      "The only difference is the condition in the inner while loop",
      "Fixed windows are just a special case of variable windows with the same code path"
    ],
    correctWhyIdx: 0,
    correctExplanation: "Fixed-size window: add incoming element (right), remove outgoing element (left) on every iteration. Variable-size window: expand right pointer until the window violates the constraint, then shrink left pointer until valid again. These are fundamentally different patterns — mixing them up is a major source of bugs."
  },
  {
    concept: "Monotonic Stack", subject: "Strings & Data Structures",
    question: "A monotonic stack is needed for the 'next greater element' problem because a regular stack is too slow.",
    correctAnswer: "False — a monotonic stack gives O(n) vs O(n²) brute force; the issue is algorithm design, not speed of stack operations",
    wrongAnswer: "True — stack.push() and stack.pop() are O(log n) for monotonic stacks",
    whyWrong: [
      "Stack push/pop is O(1) for both. The improvement from O(n²) to O(n) comes from the insight that each element is pushed and popped at most once — the total work is O(n), not from faster operations.",
      "Monotonic stacks use a balanced BST internally which gives O(log n) operations",
      "Regular stacks are O(n) per operation while monotonic stacks are O(1)",
      "The stack size is smaller for monotonic stacks, which is why it's faster"
    ],
    correctWhyIdx: 0,
    correctExplanation: "Both stack implementations have O(1) push/pop. The O(n) total complexity of the monotonic stack solution comes from the amortised analysis: each element is pushed once and popped at most once, so across all iterations the total operations are O(n). The speed gain is algorithmic, not from the data structure's operation cost."
  },
  {
    concept: "Union-Find", subject: "Trees & Graphs",
    question: "Union-Find (Disjoint Set Union) can detect cycles in a directed graph.",
    correctAnswer: "False — Union-Find detects cycles in undirected graphs; use DFS coloring for directed graphs",
    wrongAnswer: "True — Union-Find works for both directed and undirected graphs",
    whyWrong: [
      "Union-Find tracks connected components by merging sets. In a directed graph, A→B and B→A are different edges — the direction matters. Union-Find ignores direction. For directed cycle detection, use DFS with three colors (white/gray/black).",
      "Union-Find internally handles direction through the parent pointer",
      "Directed cycles always contain an undirected cycle, so Union-Find catches them",
      "The path compression in Union-Find handles directed edges correctly"
    ],
    correctWhyIdx: 0,
    correctExplanation: "Union-Find treats edges as undirected — it just asks 'are these two nodes connected?'. A directed edge A→B doesn't imply B→A. In a directed graph, you can have A→B→C and C→A (a directed cycle) but if you also have edges going the other way in the undirected sense, Union-Find may or may not flag it. For directed cycle detection, use DFS with visited states: unvisited (white), in-stack (gray), done (black)."
  },
  {
    concept: "Recursion & Memoisation", subject: "DP & Greedy",
    question: "Top-down DP (memoisation) is always more efficient than bottom-up DP (tabulation).",
    correctAnswer: "False — bottom-up avoids recursion overhead and stack overflow risk",
    wrongAnswer: "True — memoisation skips subproblems that aren't needed",
    whyWrong: [
      "Memoisation does skip unneeded states, which can help. But bottom-up has no function-call overhead, no risk of stack overflow, and often has better cache locality. For most interview problems, tabulation is preferred for its predictable performance.",
      "Memoisation always has better time complexity than tabulation",
      "Top-down is always faster because it prunes the search space",
      "Tabulation always computes all O(n²) states while memoisation computes only reachable ones"
    ],
    correctWhyIdx: 0,
    correctExplanation: "Both have the same asymptotic complexity when all states are reachable. Memoisation's advantage: only computes reachable states. Tabulation's advantages: no recursion call stack (no stack overflow), no function-call overhead, better cache locality. In interviews, memoisation is faster to write; in production, tabulation is safer. Neither is universally better."
  },
];

export const DistractorTraining: React.FC<Props> = ({ setScreen }) => {
  const [idx, setIdx] = useState(0);
  const [selectedWhy, setSelectedWhy] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);

  const q = DISTRACTOR_BANK[idx];

  const confirm = () => {
    if (selectedWhy === null) return;
    const correct = selectedWhy === q.correctWhyIdx;
    if (correct) setScore(s => s + 1);
    setRevealed(true);
  };

  const next = () => {
    if (idx >= DISTRACTOR_BANK.length - 1) {
      setIdx(0); setScore(0);
    } else {
      setIdx(i => i + 1);
    }
    setSelectedWhy(null);
    setRevealed(false);
  };

  return (
    <div className="pt-16 pb-32 px-6 max-w-md mx-auto min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-rounded text-[#0E7490]" style={{ fontSize: 16 }}>security</span>
          <span className="text-[12px] uppercase tracking-widest font-bold text-[#6B7280]">Trap Immunity</span>
        </div>
        <span className="text-[12px] text-[#15803D] font-bold">{score} correct</span>
      </div>

      {/* Progress */}
      <div className="h-1 w-full bg-[var(--color-surface-container)] rounded-full overflow-hidden mb-8">
        <div className="h-full bg-[#38BDF8] transition-all duration-500"
          style={{ width: `${((idx + 1) / DISTRACTOR_BANK.length) * 100}%` }} />
      </div>

      {/* Concept badge */}
      <div className="flex gap-2 mb-4">
        <span className="px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-widest bg-[#ECFEFF] text-[#0E7490]">
          {q.subject}
        </span>
        <span className="px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-widest bg-[var(--color-surface-container)] text-[#6B7280]">
          {q.concept}
        </span>
      </div>

      {/* Question */}
      <h2 className="text-lg font-ui font-medium leading-tight mb-6">{q.question}</h2>

      {/* Correct answer shown */}
      <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] mb-4">
        <p className="text-[12px] uppercase tracking-widest text-[#15803D] font-bold mb-1">Correct Answer</p>
        <p className="text-sm text-[var(--color-on-surface)]">{q.correctAnswer}</p>
      </div>

      {/* The trap */}
      <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] mb-6">
        <p className="text-[12px] uppercase tracking-widest text-[#B91C1C] font-bold mb-1">Common Trap Answer</p>
        <p className="text-sm font-bold text-[#B91C1C]">{q.wrongAnswer}</p>
      </div>

      {/* The challenge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-rounded text-[#0E7490]" style={{ fontSize: 14 }}>psychology</span>
        <p className="text-sm text-[#6B7280] font-medium">
          Why is the trap answer <span className="text-[#B91C1C] font-bold">wrong</span>?
        </p>
      </div>

      <div className="space-y-3 mb-6 flex-1">
        {q.whyWrong.map((reason, i) => {
          let cls = 'bg-[var(--color-surface-container)] border-[var(--color-border)]';
          if (revealed) {
            if (i === q.correctWhyIdx) cls = 'bg-[#F0FDF4] border-[#BBF7D0]';
            else if (i === selectedWhy && i !== q.correctWhyIdx) cls = 'bg-[#FEF2F2] border-[#FECACA]';
          } else if (selectedWhy === i) cls = 'bg-[#ECFEFF] border-[#38BDF8]';
          return (
            <button key={i} onClick={() => !revealed && setSelectedWhy(i)}
              className={`w-full p-4 rounded-xl text-left border text-sm transition-all ${cls}`}>
              {reason}
            </button>
          );
        })}
      </div>

      {!revealed ? (
        <button onClick={confirm}
          className={`w-full py-4 rounded-2xl font-ui font-bold tracking-widest text-sm transition-all ${
            selectedWhy !== null ? 'bg-[#38BDF8] text-background' : 'bg-[var(--color-surface-container)] text-[var(--color-border)] cursor-not-allowed'
          }`}>
          CONFIRM <span className="material-symbols-rounded inline ml-1" style={{ fontSize: 16 }}>arrow_forward</span>
        </button>
      ) : (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className={`flex items-start gap-2 p-3 rounded-xl ${selectedWhy === q.correctWhyIdx ? 'bg-[#F0FDF4]' : 'bg-[#FEF2F2]'}`}>
              {selectedWhy === q.correctWhyIdx
                ? <span className="material-symbols-rounded text-[#15803D] mt-0.5 shrink-0" style={{ fontSize: 16 }}>check_circle</span>
                : <span className="material-symbols-rounded text-[#B91C1C] mt-0.5 shrink-0" style={{ fontSize: 16 }}>cancel</span>}
              <p className="text-sm text-[#6B7280] leading-relaxed">{q.correctExplanation}</p>
            </div>
            <button onClick={next}
              className="w-full py-4 bg-[#38BDF8] text-background rounded-2xl font-ui font-bold tracking-widest text-sm">
              <div className="flex items-center justify-center gap-2">{idx >= DISTRACTOR_BANK.length - 1 ? 'RESTART' : 'NEXT TRAP'} <span className="material-symbols-rounded" style={{ fontSize: 16 }}>chevron_right</span></div>
            </button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
