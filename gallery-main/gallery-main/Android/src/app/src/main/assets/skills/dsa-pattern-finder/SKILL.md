---
name: dsa-pattern-finder
description: Identify the DSA pattern for a coding problem and show the code template with key insight.
---

# DSA Pattern Finder

Given a problem description or pattern name, shows the matching DSA pattern with a code template, key insight, and when to use it.

## Examples

* "What pattern for finding all subarrays of size k?"
* "How do I solve two-sum?"
* "Which pattern for cycle detection in a linked list?"
* "Show me the sliding window template"
* "What approach for N-Queens problem?"
* "Pattern for merging k sorted lists"
* "Which DSA pattern for this: given an array find all pairs that sum to target"
* "Template for BFS level order traversal"
* "How to detect if a linked list has a cycle?"
* "Show fast and slow pointer pattern"

## Instructions

Call the `run_js` tool with the following exact parameters:
- script name: `index.html`
- data: A JSON string with the following field
  - pattern: the DSA pattern name. Must be one of:
    "sliding_window", "two_pointers", "fast_slow_pointers", "merge_intervals",
    "cyclic_sort", "in_place_reversal", "bfs", "dfs", "two_heaps",
    "subsets", "binary_search", "bitwise_xor", "top_k_elements",
    "k_way_merge", "dynamic_programming", "backtracking", "monotonic_stack",
    "prefix_sum", "union_find", "trie"

Map the user's problem to the closest matching pattern. Examples:
- "subarray of size k", "max sum window" → sliding_window
- "pair sum", "two sum", "sorted array" → two_pointers
- "cycle in linked list", "middle of list" → fast_slow_pointers
- "overlapping intervals", "merge ranges" → merge_intervals
- "permutations", "combinations", "subsets" → subsets or backtracking
- "minimum k elements", "top k frequent" → top_k_elements
- "N-Queens", "sudoku" → backtracking
- "longest common subsequence", "coin change" → dynamic_programming
