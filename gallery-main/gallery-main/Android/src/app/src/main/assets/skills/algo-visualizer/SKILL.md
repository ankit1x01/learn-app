---
name: algo-visualizer
description: Animate and visualize sorting and searching algorithms step by step.
---

# Algorithm Visualizer

Visualizes DSA algorithms with step-by-step animation — sorting, searching, trees, and graphs.

## Examples

* "Visualize bubble sort"
* "Animate merge sort on [5, 3, 8, 1, 9, 2]"
* "Show me how quick sort works"
* "Animate binary search for 7 in [1, 3, 5, 7, 9, 11]"
* "Visualize insertion sort"
* "Show selection sort animation"
* "How does DFS work on a tree?"
* "Animate BFS"

## Instructions

Call the `run_js` tool with the following exact parameters:
- script name: `index.html`
- data: A JSON string with the following fields
  - algorithm: one of "bubble_sort", "selection_sort", "insertion_sort", "merge_sort", "quick_sort", "binary_search", "bfs", "dfs"
  - array: (optional) an array of up to 12 integers for sorting/searching. If not provided, generate a random array.
  - target: (optional) integer to search for (only for binary_search)

Extract the algorithm name from what the user says. Map "bubble" → "bubble_sort", "merge" → "merge_sort", etc.
