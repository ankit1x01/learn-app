import type { Concept } from '../../core/types';

export const SENIOR_FS_CONCEPTS: Concept[] = [
  // ── React 19 & Next.js Architecture ──────────────────────────────────────────────
  {
    id: 'sfs_react_1', subject: 'React 19 & Next.js Architecture', chapter: 'Internals', unit: 1, name: 'React Fiber & Reconciliation Deep Dive',
    difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'sfs_react_2', subject: 'React 19 & Next.js Architecture', chapter: 'Next.js', unit: 2, name: 'Server Components & App Router',
    difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'sfs_react_3', subject: 'React 19 & Next.js Architecture', chapter: 'Concurrency', unit: 3, name: 'Concurrent Features & Suspense',
    difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2
  },
  {
    id: 'sfs_react_4', subject: 'React 19 & Next.js Architecture', chapter: 'State', unit: 4, name: 'Advanced State Management (Zustand, Jotai limits)',
    difficulty: 3, pyqTier: 2, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2
  },
  {
    id: 'sfs_react_5', subject: 'React 19 & Next.js Architecture', chapter: 'Performance', unit: 5, name: 'SSR/SSG/ISR Trade-offs & Streaming',
    difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },

  // ── Node.js Internals & V8 ──────────────────────────────────────────────
  {
    id: 'sfs_node_1', subject: 'Node.js Internals & V8', chapter: 'Core Engine', unit: 1, name: 'V8 Engine & Garbage Collection',
    difficulty: 5, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'sfs_node_2', subject: 'Node.js Internals & V8', chapter: 'Concurrency', unit: 2, name: 'Event Loop Phases & libuv',
    difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'sfs_node_3', subject: 'Node.js Internals & V8', chapter: 'Scaling', unit: 3, name: 'IPC & Worker Threads',
    difficulty: 4, pyqTier: 2, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2
  },
  {
    id: 'sfs_node_4', subject: 'Node.js Internals & V8', chapter: 'I/O', unit: 4, name: 'Streams, Buffers & Backpressure',
    difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'sfs_node_5', subject: 'Node.js Internals & V8', chapter: 'Debugging', unit: 5, name: 'Memory Leaks & CPU Profiling',
    difficulty: 5, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },

  // ── Angular Enterprise Architecture ──────────────────────────────────────────────
  {
    id: 'sfs_ng_1', subject: 'Angular Enterprise Architecture', chapter: 'Internals', unit: 1, name: 'Ivy Compiler & DOM Rendering',
    difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'sfs_ng_2', subject: 'Angular Enterprise Architecture', chapter: 'Performance', unit: 2, name: 'Zone.js & OnPush Change Detection',
    difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'sfs_ng_3', subject: 'Angular Enterprise Architecture', chapter: 'State', unit: 3, name: 'Angular Signals & Fine-Grained Reactivity',
    difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'sfs_ng_4', subject: 'Angular Enterprise Architecture', chapter: 'Architecture', unit: 4, name: 'Micro-frontends with Module Federation',
    difficulty: 4, pyqTier: 2, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2
  },
  {
    id: 'sfs_ng_5', subject: 'Angular Enterprise Architecture', chapter: 'Data Flow', unit: 5, name: 'RxJS Advanced Patterns (Higher-Order Mapping)',
    difficulty: 5, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },

  // ── Advanced Databases & Storage ──────────────────────────────────────────────
  {
    id: 'sfs_db_1', subject: 'Advanced Databases & Storage', chapter: 'Internals', unit: 1, name: 'B-Trees vs LSM Trees',
    difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'sfs_db_2', subject: 'Advanced Databases & Storage', chapter: 'Transactions', unit: 2, name: 'MVCC, Isolation Levels & Locks',
    difficulty: 5, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'sfs_db_3', subject: 'Advanced Databases & Storage', chapter: 'Scaling', unit: 3, name: 'Sharding & Consistent Hashing',
    difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'sfs_db_4', subject: 'Advanced Databases & Storage', chapter: 'Caching', unit: 4, name: 'Redis Internals & Eviction Policies',
    difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2
  },
  {
    id: 'sfs_db_5', subject: 'Advanced Databases & Storage', chapter: 'Optimization', unit: 5, name: 'Query Optimization & Explain Plans (PostgreSQL)',
    difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },

  // ── System Design & Scalability ──────────────────────────────────────────────
  {
    id: 'sfs_sys_1', subject: 'System Design & Scalability', chapter: 'Theory', unit: 1, name: 'CAP Theorem & PACELC',
    difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'sfs_sys_2', subject: 'System Design & Scalability', chapter: 'Async', unit: 2, name: 'Event-Driven Architecture (Kafka/RabbitMQ)',
    difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'sfs_sys_3', subject: 'System Design & Scalability', chapter: 'Observability', unit: 3, name: 'Distributed Tracing & Metrics',
    difficulty: 3, pyqTier: 2, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2
  },
  {
    id: 'sfs_sys_4', subject: 'System Design & Scalability', chapter: 'Traffic', unit: 4, name: 'Rate Limiting Algorithms',
    difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'sfs_sys_5', subject: 'System Design & Scalability', chapter: 'Networking', unit: 5, name: 'Load Balancing & Service Discovery',
    difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  }
];
