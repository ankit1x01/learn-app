// src/games/data/dsa-dummy.ts
import { ThisOrThatConfig, ChronoConfig, LinksConfig, KnockoutConfig, BalloonTapConfig, RetentionConfig, AudioLectureConfig, BubbleMatchConfig } from '../types'

export const dsaAudioLecture: AudioLectureConfig = {
  type: 'audio-lecture',
  theme: 'Sorting Algorithm History',
  subject: 'DSA',
  title: 'History of Sorting',
  concepts: ['Merge Sort', 'Quicksort', 'Timsort'],
  passage:
    'In 1945, John von Neumann invented Merge Sort as part of his work on early computers. ' +
    'In 1959, Tony Hoare invented Quicksort at age 25 — it remains the fastest sorting algorithm in practice for most datasets. ' +
    'In 2002, Tim Peters created Timsort, a hybrid of Merge Sort and Insertion Sort, now used in Python and Java.',
  displayPassage:
    'In ___, John von Neumann invented ___ as part of his work on early computers. ' +
    'In 1959, Tony Hoare invented Quicksort at age 25 — it remains the fastest sorting algorithm in practice for most datasets. ' +
    'In 2002, Tim Peters created ___, a hybrid of Merge Sort and Insertion Sort, now used in Python and Java.',
  blanks: [
    { id: 'b1', answer: '1945' },
    { id: 'b2', answer: 'Merge Sort' },
    { id: 'b3', answer: 'Timsort' },
  ],
  chips: ['1945', 'Merge Sort', 'Timsort', '1964', 'Heapsort'],
  questions: [
    {
      id: 'q1',
      prompt: 'Who invented Quicksort?',
      options: ['Tony Hoare', 'Von Neumann', 'Tim Peters', 'J.W.J. Williams'],
      answer: 'Tony Hoare',
    },
    {
      id: 'q2',
      prompt: 'Which language uses Timsort natively?',
      options: ['Python', 'C', 'Rust', 'Go'],
      answer: 'Python',
    },
    {
      id: 'q3',
      prompt: 'What year was Merge Sort invented?',
      options: ['1945', '1959', '1964', '2002'],
      answer: '1945',
    },
  ],
}

export const dsaBalloonTap: BalloonTapConfig = {
  type: 'balloon-tap',
  theme: 'DSA Concept Pairs',
  subject: 'DSA',
  pairs: [
    { id: 1, a: 'Stack',    b: 'LIFO'       },
    { id: 2, a: 'Queue',    b: 'FIFO'       },
    { id: 3, a: 'BFS',      b: 'Level-order'},
    { id: 4, a: 'DFS',      b: 'Depth-first'},
    { id: 5, a: 'O(1)',     b: 'Constant'   },
    { id: 6, a: 'O(n)',     b: 'Linear'     },
    { id: 7, a: 'Heap',     b: 'Priority Q' },
    { id: 8, a: 'HashMap',  b: 'O(1) lookup'},
  ],
}

export const dsaRetention: RetentionConfig = {
  type: 'retention',
  theme: 'DSA Memory Training',
  subject: 'DSA',
  pool: [
    { id: 'r1',  label: 'Stack'     },
    { id: 'r2',  label: 'Queue'     },
    { id: 'r3',  label: 'O(1)'      },
    { id: 'r4',  label: 'O(n)'      },
    { id: 'r5',  label: 'BFS'       },
    { id: 'r6',  label: 'DFS'       },
    { id: 'r7',  label: 'Heap'      },
    { id: 'r8',  label: 'Graph'     },
    { id: 'r9',  label: 'Tree'      },
    { id: 'r10', label: 'Hash Map'  },
    { id: 'r11', label: 'Binary'    },
    { id: 'r12', label: 'Recursion' },
  ],
}

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

export const dsaBubbleMatch: BubbleMatchConfig = {
  type: 'bubble-match',
  theme: 'Data Structure Fundamentals',
  subject: 'DSA',
  entities: [
    {
      id: 'stack',
      name: 'STACK',
      color: 'hsl(280, 60%, 78%)',     // soft purple
      facts: [
        'LIFO order',
        'push & pop',
        'DFS uses it',
        'call frames',
        'browser back',
      ],
    },
    {
      id: 'queue',
      name: 'QUEUE',
      color: 'hsl(210, 65%, 75%)',     // soft blue
      facts: [
        'FIFO order',
        'enqueue / dequeue',
        'BFS uses it',
        'printer spool',
        'O(1) insert',
      ],
    },
    {
      id: 'heap',
      name: 'HEAP',
      color: 'hsl(340, 65%, 75%)',     // soft pink
      facts: [
        'root = min/max',
        'priority queue',
        'O(log n) insert',
        "Dijkstra's algo",
        'heapify O(n)',
      ],
    },
  ],
}
