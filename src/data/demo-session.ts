export type ContentType = 'infographic' | 'video' | 'audio';

export interface MCQ {
  question: string;
  options:  string[];
  correct:  number; // index into options
  explanation: string;
}

export interface DemoConcept {
  id:          string;
  title:       string;
  subject:     string;
  tag:         string;          // e.g. "Arrays & Search"
  contentType: ContentType;
  predictOptions?: {
    a: string;
    b: string;
    correct: 'a' | 'b';
    explanation: string;
  };
  // Infographic content
  visual: {
    headline:   string;
    bullets:    string[];
    code?:      string;         // short code snippet
    tip:        string;
  };
  // YouTube ID (used when contentType === 'video')
  youtubeId?:  string;
  mcqs:        MCQ[];
}

export const DEMO_SESSION: DemoConcept[] = [
  {
    id: 'two-pointers',
    title: 'Two Pointers',
    subject: 'Arrays & Search',
    tag: 'Pattern',
    contentType: 'infographic',
    predictOptions: {
      a: 'A technique that requires two distinct variables to compare all nested pairs.',
      b: 'A technique that narrows a search space from opposite ends without nested loops.',
      correct: 'b',
      explanation: 'You predicted correctly! It avoids the slow nested O(n²) comparison entirely.'
    },
    visual: {
      headline: 'Two pointers move toward each other to avoid a nested loop.',
      bullets: [
        'Start one pointer at the left, one at the right',
        'Move them based on a condition — never both at once',
        'Reduces O(n²) brute force to O(n)',
        'Trigger: sorted array + "find pair" or "container" problem',
      ],
      code: `left, right = 0, len(arr) - 1
while left < right:
    s = arr[left] + arr[right]
    if s == target: return [left, right]
    elif s < target: left += 1
    else: right -= 1`,
      tip: 'If the array is not sorted, sort it first — that is always valid.',
    },
    mcqs: [
      {
        question: 'When is the Two Pointers pattern applicable?',
        options: [
          'When the array is unsorted and you need the maximum subarray',
          'When the array is sorted and you need a pair satisfying a condition',
          'When you need to find all permutations of an array',
          'When the problem involves a binary tree',
        ],
        correct: 1,
        explanation: 'Two pointers works on sorted arrays to find pairs in O(n) by moving pointers based on whether the sum is too high or too low.',
      },
      {
        question: 'What is the time complexity of the two-pointer approach for finding a pair with target sum?',
        options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(log n)'],
        correct: 2,
        explanation: 'Each pointer moves at most n times total, so the combined work is O(n).',
      },
      {
        question: 'In the two-pointer template, when do you move the left pointer?',
        options: [
          'When the current sum equals the target',
          'When the current sum is greater than the target',
          'When the current sum is less than the target',
          'Always move left pointer first',
        ],
        correct: 2,
        explanation: 'If the sum is too small, increasing the left pointer increases the sum. If too large, decrease the right pointer.',
      },
    ],
  },

  {
    id: 'binary-search',
    title: 'Binary Search',
    subject: 'Arrays & Search',
    tag: 'Algorithm',
    contentType: 'infographic',
    visual: {
      headline: 'Binary search eliminates half the search space every step.',
      bullets: [
        'Works only on sorted data',
        'mid = left + (right - left) // 2  ← avoid overflow',
        'Three outcomes: found / go left / go right',
        'Trigger: sorted array + O(log n) hint in the problem',
      ],
      code: `left, right = 0, len(arr) - 1
while left <= right:
    mid = left + (right - left) // 2
    if arr[mid] == target: return mid
    elif arr[mid] < target: left = mid + 1
    else: right = mid - 1
return -1`,
      tip: 'Binary search is not just for arrays — apply it on the answer space when brute force is too slow.',
    },
    mcqs: [
      {
        question: 'Why do we compute mid = left + (right - left) // 2 instead of (left + right) // 2?',
        options: [
          'It is faster to compute',
          'It avoids integer overflow when left + right exceeds max int',
          'It gives a different mid value that converges faster',
          'Both formulas are identical in all cases',
        ],
        correct: 1,
        explanation: 'In languages like Java/C++, (left + right) can overflow a 32-bit integer. The safe form avoids this.',
      },
      {
        question: 'What does Binary Search return if the target is NOT found?',
        options: ['0', 'left', '-1', 'right'],
        correct: 2,
        explanation: 'By convention, return -1 to signal that the target does not exist in the array.',
      },
      {
        question: 'Binary Search on an answer space means:',
        options: [
          'Searching a sorted array for an index',
          'Guessing the answer value and checking if it satisfies the problem condition',
          'Using two binary searches simultaneously',
          'Applying binary search only to strings',
        ],
        correct: 1,
        explanation: 'When the answer lies in a range [lo, hi] and you can check "is X a valid answer?" in O(n), binary search that range for O(n log n) total.',
      },
    ],
  },

  {
    id: 'sliding-window',
    title: 'Sliding Window',
    subject: 'Arrays & Search',
    tag: 'Pattern',
    contentType: 'video',
    youtubeId: 'MK-NZ4hPjrs',
    visual: {
      headline: 'A window of elements slides across the array, expanding and shrinking by a rule.',
      bullets: [
        'Fixed window: size never changes',
        'Variable window: shrink from left when condition is violated',
        'Track window state with a hashmap or counter',
        'Trigger: "subarray / substring" + max/min/at-most k',
      ],
      code: `left = 0
for right in range(len(s)):
    # expand window
    window.add(s[right])
    while window_invalid():
        window.remove(s[left])
        left += 1
    result = max(result, right - left + 1)`,
      tip: 'Define what "valid window" means first, then write the shrink condition.',
    },
    mcqs: [
      {
        question: 'What is the trigger condition to use a Sliding Window?',
        options: [
          'The array is sorted and you need a pair',
          'You need all permutations of a string',
          'You need a contiguous subarray/substring with a max/min/count condition',
          'You need to search for an element in O(log n)',
        ],
        correct: 2,
        explanation: 'Sliding window applies when you need to find the best contiguous subarray satisfying a condition — longest, shortest, sum ≤ k, at most k distinct, etc.',
      },
      {
        question: 'In a variable sliding window, when do you move the left pointer?',
        options: [
          'Every iteration, always',
          'Only when the window size exceeds n/2',
          'When the window becomes invalid (violates the constraint)',
          'When right pointer reaches the end',
        ],
        correct: 2,
        explanation: 'Shrink from the left only when the current window breaks the condition. This keeps the window in the largest valid state.',
      },
      {
        question: 'What is the time complexity of the sliding window approach?',
        options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(1)'],
        correct: 2,
        explanation: 'Each element is added to the window once and removed once — total 2n operations = O(n).',
      },
    ],
  },

  {
    id: 'stack',
    title: 'Stack & Monotonic Stack',
    subject: 'Strings & Data Structures',
    tag: 'Data Structure',
    contentType: 'infographic',
    visual: {
      headline: 'A stack processes elements in LIFO order. A monotonic stack keeps elements in sorted order.',
      bullets: [
        'Stack: push / pop / peek — all O(1)',
        'Monotonic stack: pop elements that break the sorted property',
        'Useful for: next greater element, largest rectangle, valid parentheses',
        'Trigger: "next greater/smaller" or nested structure problem',
      ],
      code: `# Next Greater Element
stack = []
result = [-1] * len(nums)
for i, num in enumerate(nums):
    while stack and nums[stack[-1]] < num:
        idx = stack.pop()
        result[idx] = num
    stack.append(i)`,
      tip: 'Store indices in the stack, not values — you often need the position to compute distances.',
    },
    mcqs: [
      {
        question: 'What does a Monotonic Decreasing Stack maintain?',
        options: [
          'Elements in ascending order from bottom to top',
          'Elements in descending order from bottom to top',
          'Elements sorted by insertion time',
          'Only duplicate elements',
        ],
        correct: 1,
        explanation: 'A monotonic decreasing stack pops any element smaller than the incoming one, keeping the stack in descending order.',
      },
      {
        question: 'For the "Next Greater Element" problem, what do you store in the stack?',
        options: ['The values directly', 'The indices of elements', 'The differences between elements', 'Nothing — use recursion'],
        correct: 1,
        explanation: 'Storing indices lets you update the result array at the correct position when you find the next greater element.',
      },
      {
        question: 'Valid Parentheses is solved with a stack. What is the rule for closing brackets?',
        options: [
          'Pop if stack is non-empty',
          'Pop if top of stack is the matching open bracket, else invalid',
          'Always push closing brackets too',
          'Pop twice for every closing bracket',
        ],
        correct: 1,
        explanation: 'On a closing bracket, check if the stack top is the matching opener. Mismatch = invalid. Empty stack on close = invalid.',
      },
    ],
  },

  {
    id: 'bfs-dfs',
    title: 'BFS vs DFS',
    subject: 'Trees & Graphs',
    tag: 'Algorithm',
    contentType: 'infographic',
    visual: {
      headline: 'BFS explores level by level. DFS goes deep before backtracking.',
      bullets: [
        'BFS uses a queue — finds shortest path in unweighted graphs',
        'DFS uses a stack (or recursion) — explores all paths',
        'BFS trigger: shortest path / minimum steps / level-order',
        'DFS trigger: all paths / cycle detection / topological sort',
      ],
      code: `# BFS template
from collections import deque
queue = deque([start])
visited = {start}
while queue:
    node = queue.popleft()
    for neighbor in graph[node]:
        if neighbor not in visited:
            visited.add(neighbor)
            queue.append(neighbor)`,
      tip: 'Always mark visited BEFORE adding to queue, not after popping — prevents duplicate visits.',
    },
    mcqs: [
      {
        question: 'Which algorithm guarantees the shortest path in an unweighted graph?',
        options: ['DFS', 'BFS', 'Both equally', 'Neither — use Dijkstra always'],
        correct: 1,
        explanation: 'BFS explores nodes level by level, so the first time it reaches a node is always via the shortest path in an unweighted graph.',
      },
      {
        question: 'When should you mark a node as visited in BFS?',
        options: [
          'When you pop it from the queue',
          'When you add it to the queue',
          'After processing all its neighbors',
          'Only at the end of traversal',
        ],
        correct: 1,
        explanation: 'Mark visited when enqueuing, not when dequeuing. Otherwise the same node can be added to the queue multiple times before it is processed.',
      },
      {
        question: 'DFS is preferred over BFS when:',
        options: [
          'Finding the shortest path between two nodes',
          'Processing nodes level by level',
          'Detecting cycles or exploring all possible paths',
          'Finding connected components in the minimum number of steps',
        ],
        correct: 2,
        explanation: 'DFS naturally follows one path to completion before backtracking — ideal for cycle detection, topological sort, and exhaustive path exploration.',
      },
    ],
  },
];
