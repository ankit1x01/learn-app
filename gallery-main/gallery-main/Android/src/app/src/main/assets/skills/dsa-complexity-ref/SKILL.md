---
name: dsa-complexity-ref
description: Show a Big O time and space complexity reference card for DSA algorithms and data structures.
---

# DSA Complexity Reference

Shows a beautiful Big O complexity cheat sheet organized by category.

## Examples

* "Show me Big O complexity table"
* "What is the time complexity of sorting algorithms?"
* "Big O cheat sheet"
* "Complexity reference for trees"
* "Show time and space complexity of graph algorithms"
* "What are complexities of hash map operations?"
* "Complexity cheat sheet for arrays"

## Instructions

Call the `run_js` tool with the following exact parameters:
- script name: `index.html`
- data: A JSON string with the following field
  - category: one of "all", "sorting", "searching", "array", "linked_list", "tree", "graph", "heap", "hash"

Map user's intent: if they mention sorting → "sorting", trees → "tree", graphs → "graph", hash/map/dict → "hash", otherwise → "all".
