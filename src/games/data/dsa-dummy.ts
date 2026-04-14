// src/games/data/dsa-dummy.ts
import { ThisOrThatConfig, ChronoConfig, LinksConfig, KnockoutConfig } from '../types'

export const dsaThisOrThat: ThisOrThatConfig = {
  type: 'this-or-that',
  theme: 'Stack vs Queue',
  subject: 'DSA',
  columnA: { label: 'Stack', description: 'LIFO — Last In, First Out' },
  columnB: { label: 'Queue', description: 'FIFO — First In, First Out' },
  cards: [
    { id: 'c1', label: 'LIFO principle',          correct: 'A' },
    { id: 'c2', label: 'FIFO principle',           correct: 'B' },
    { id: 'c3', label: 'Push & Pop operations',    correct: 'A' },
    { id: 'c4', label: 'Enqueue & Dequeue ops',    correct: 'B' },
    { id: 'c5', label: 'Browser back button',      correct: 'A' },
    { id: 'c6', label: 'Printer spooler',          correct: 'B' },
    { id: 'c7', label: 'DFS traversal',            correct: 'A' },
    { id: 'c8', label: 'BFS traversal',            correct: 'B' },
    { id: 'c9', label: 'Recursion call frames',    correct: 'A' },
    { id: 'c10', label: 'OS process scheduling',   correct: 'B' },
  ],
}

export const dsaChrono: ChronoConfig = {
  type: 'chrono',
  theme: 'Sorting Algorithm History',
  subject: 'DSA',
  events: [
    {
      id: 'e1',
      label: 'Merge Sort invented by John von Neumann',
      dateLabel: '1945',
      sortKey: 1945,
      factoid: 'Von Neumann described merge sort as part of his work on the EDVAC computer — one of the first stored-program computers.',
    },
    {
      id: 'e2',
      label: 'Bubble Sort first described',
      dateLabel: '1956',
      sortKey: 1956,
      factoid: 'Despite being inefficient at O(n²), bubble sort remains one of the most taught algorithms due to its simplicity.',
    },
    {
      id: 'e3',
      label: 'Quicksort invented by Tony Hoare',
      dateLabel: '1959',
      sortKey: 1959,
      factoid: 'Hoare invented Quicksort at age 25 while working on a machine translation project. Still the fastest in practice for most datasets.',
    },
    {
      id: 'e4',
      label: 'Heapsort invented by J.W.J. Williams',
      dateLabel: '1964',
      sortKey: 1964,
      factoid: 'Heapsort introduced the heap data structure and guarantees O(n log n) worst-case — unlike Quicksort.',
    },
    {
      id: 'e5',
      label: 'Timsort created by Tim Peters',
      dateLabel: '2002',
      sortKey: 2002,
      factoid: 'Timsort is a hybrid of Merge Sort and Insertion Sort. It powers Python\'s sorted() and Java\'s Arrays.sort() for objects.',
    },
  ],
}

export const dsaLinks: LinksConfig = {
  type: 'links',
  theme: 'Data Structure Properties',
  subject: 'DSA',
  cards: [
    { id: 'bst',         label: 'Binary Search Tree' },
    { id: 'hashtable',   label: 'Hash Table' },
    { id: 'minheap',     label: 'Min Heap' },
    { id: 'linkedlist',  label: 'Linked List' },
  ],
  rounds: [
    {
      cardId: 'bst',
      attributes: [
        'O(log n) average search',
        'Left child < root < right child',
        'In-order traversal gives sorted output',
        'Can degrade to O(n) when unbalanced',
      ],
      hints: ['Think about how binary search works on a tree', 'The order property is in the name'],
    },
    {
      cardId: 'hashtable',
      attributes: [
        'O(1) average lookup',
        'Uses a key-value pair structure',
        'Needs a collision resolution strategy',
        'Load factor affects performance',
      ],
      hints: ['Fastest lookup of any structure', 'Python dictionaries use this'],
    },
    {
      cardId: 'minheap',
      attributes: [
        'Root is always the smallest element',
        'Parent is always ≤ its children',
        'Used in Dijkstra\'s algorithm',
        'Extract-min runs in O(log n)',
      ],
      hints: ['Priority queues are built on this', 'Think about what "heap property" means'],
    },
    {
      cardId: 'linkedlist',
      attributes: [
        'O(1) insertion at head',
        'O(n) random access',
        'Each node stores a pointer to next',
        'No contiguous memory required',
      ],
      hints: ['No indexing — you must traverse', 'Memory is scattered, not sequential'],
    },
  ],
}

export const dsaKnockout: KnockoutConfig = {
  type: 'knockout',
  question: 'Which is faster on average?',
  subtitle: 'Assume average-case, random input, no special conditions.',
  theme: 'Algorithm Showdowns',
  subject: 'DSA',
  cards: [
    { id: 'bubble',    label: 'Bubble Sort' },
    { id: 'merge',     label: 'Merge Sort' },
    { id: 'linear',    label: 'Linear Search' },
    { id: 'binary',    label: 'Binary Search' },
    { id: 'insertion', label: 'Insertion Sort' },
    { id: 'quick',     label: 'Quick Sort' },
    { id: 'dfs',       label: 'DFS' },
    { id: 'bfs',       label: 'BFS (shortest path)' },
  ],
  answers: {
    'bubble_vs_merge':     'merge',
    'linear_vs_binary':    'binary',
    'insertion_vs_quick':  'quick',
    'dfs_vs_bfs':          'bfs',
    'merge_vs_binary':     'binary',
    'quick_vs_bfs':        'quick',
    'binary_vs_quick':     'binary',
  },
}
