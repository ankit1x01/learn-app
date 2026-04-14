/**
 * Generates src/syllabus/dsa/concepts.ts from dsa_data.json
 * Run: node scripts/generate-dsa-concepts.js
 */
const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../dsa_data.json'), 'utf8'));

// Map each group index to a subject
const GROUP_TO_SUBJECT = {
  0:  'Foundations',          // Learn the basics
  1:  'Foundations',          // Sorting
  2:  'Arrays & Search',      // Arrays
  3:  'Arrays & Search',      // Binary Search
  9:  'Arrays & Search',      // Sliding Window & Two Pointer
  4:  'Strings & Data Structures', // Strings basic
  5:  'Strings & Data Structures', // Linked List
  6:  'Strings & Data Structures', // Recursion
  7:  'Strings & Data Structures', // Bit Manipulation
  8:  'Strings & Data Structures', // Stack & Queues
  10: 'Trees & Graphs',       // Heaps
  12: 'Trees & Graphs',       // Binary Trees
  13: 'Trees & Graphs',       // BST
  14: 'Trees & Graphs',       // Graphs
  16: 'Trees & Graphs',       // Tries
  11: 'DP & Greedy',          // Greedy
  15: 'DP & Greedy',          // DP
  17: 'DP & Greedy',          // Strings advanced
};

// pyqTier per group (1=core must-know, 4=rare/competitive)
const GROUP_TIER = {
  0:  1,  // basics
  1:  1,  // sorting
  2:  1,  // arrays
  3:  1,  // binary search
  9:  1,  // sliding window/two pointer
  4:  2,  // strings basic
  5:  2,  // linked list
  6:  2,  // recursion
  7:  2,  // bit manipulation
  8:  2,  // stack & queues
  10: 2,  // heaps
  12: 1,  // binary trees
  13: 2,  // BST
  14: 1,  // graphs
  16: 3,  // tries
  11: 2,  // greedy
  15: 1,  // dp
  17: 3,  // strings advanced
};

// ID prefix per subject
const SUBJECT_PREFIX = {
  'Foundations':               'f',
  'Arrays & Search':           'a',
  'Strings & Data Structures': 's',
  'Trees & Graphs':            't',
  'DP & Greedy':               'd',
};

const subjectCounters = { f: 0, a: 0, s: 0, t: 0, d: 0 };

const concepts = [];

data.forEach((group, groupIdx) => {
  const subject = GROUP_TO_SUBJECT[groupIdx];
  const tier = GROUP_TIER[groupIdx];
  const prefix = SUBJECT_PREFIX[subject];

  group.topics.forEach((topic) => {
    const chapter = topic.topic;

    topic.problems.forEach((problem) => {
      subjectCounters[prefix]++;
      const id = `${prefix}${String(subjectCounters[prefix]).padStart(2, '0')}`;

      concepts.push({
        id,
        name: problem.name,
        subject,
        chapter,
        unit: groupIdx + 1,
        pyqTier: tier,
        link: problem.link || '',
        resources: problem.resources || [],
        stage: 'Unseen',
        stability: 0,
        difficulty: 0.5,
        lastTested: -1,
        nextReview: -1,
      });
    });
  });
});

// Count per subject
const subjectCounts = {};
concepts.forEach(c => {
  subjectCounts[c.subject] = (subjectCounts[c.subject] || 0) + 1;
});
console.log('Total concepts:', concepts.length);
console.log('Per subject:', subjectCounts);

// Generate TypeScript
const lines = [
  `import type { Concept } from '../../core/types';`,
  ``,
  `/**`,
  ` * DSA Problem-Solving Methodologies — Concept Bank`,
  ` * Auto-generated from dsa_data.json (Striver A2Z DSA Sheet)`,
  ` *`,
  ` * Subjects:`,
  ` *   Foundations                  — basics, sorting`,
  ` *   Arrays & Search              — arrays, binary search, sliding window`,
  ` *   Strings & Data Structures    — strings, LL, recursion, bit manipulation, stacks`,
  ` *   Trees & Graphs               — heaps, binary trees, BST, graphs, tries`,
  ` *   DP & Greedy                  — greedy, dynamic programming, advanced strings`,
  ` *`,
  ` * pyqTier maps to interview frequency:`,
  ` *   1 = Core must-know (asked in every loop)`,
  ` *   2 = Asked frequently`,
  ` *   3 = Asked occasionally`,
  ` *   4 = Rare / competitive`,
  ` */`,
  ``,
  `export const DSA_CONCEPTS: Concept[] = [`,
];

const subjectOrder = [
  'Foundations',
  'Arrays & Search',
  'Strings & Data Structures',
  'Trees & Graphs',
  'DP & Greedy',
];

subjectOrder.forEach(subject => {
  const group = concepts.filter(c => c.subject === subject);
  if (!group.length) return;
  lines.push(`  // ── ${subject} ${'─'.repeat(Math.max(0, 60 - subject.length))}`);
  lines.push(``);

  group.forEach(c => {
    // Escape quotes in name/chapter
    const name = c.name.replace(/'/g, "\\'").replace(/"/g, '\\"');
    const chapter = c.chapter.replace(/'/g, "\\'").replace(/"/g, '\\"');
    lines.push(
      `  { id: '${c.id}', name: "${name}", subject: '${c.subject}', chapter: "${chapter}", unit: ${c.unit}, pyqTier: ${c.pyqTier}, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 },`
    );
  });
  lines.push(``);
});

lines.push(`];`);
lines.push(``);

const outPath = path.join(__dirname, '../src/syllabus/dsa/concepts.ts');
fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log('Written to', outPath);
console.log('Subject counts:', subjectCounts);
