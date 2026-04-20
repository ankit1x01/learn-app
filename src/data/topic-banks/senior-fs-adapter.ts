import type { ExamTopicBank, TopicGroup } from './types';

const REACT_GROUPS: TopicGroup[] = [
  {
    group: 'Architecture & Internals', icon: 'account_tree', tier: 1, accentColor: '#61DAFB', accentBg: '#61DAFB20',
    topics: [
      { topic: 'Core rendering', problems: [{ name: 'React Fiber & Reconciliation Deep Dive' }, { name: 'Concurrent Features & Suspense' }] },
      { topic: 'Next.js', problems: [{ name: 'Server Components & App Router' }, { name: 'SSR/SSG/ISR Trade-offs & Streaming' }] },
      { topic: 'State', problems: [{ name: 'Advanced State Management (Zustand, Jotai limits)' }] }
    ]
  }
];

const NODE_GROUPS: TopicGroup[] = [
  {
    group: 'V8 & Execution', icon: 'memory', tier: 1, accentColor: '#68A063', accentBg: '#68A06320',
    topics: [
      { topic: 'Engine Mechanics', problems: [{ name: 'V8 Engine & Garbage Collection' }, { name: 'Event Loop Phases & libuv' }] },
      { topic: 'Advanced I/O', problems: [{ name: 'Streams, Buffers & Backpressure' }, { name: 'IPC & Worker Threads' }] },
      { topic: 'Profiling', problems: [{ name: 'Memory Leaks & CPU Profiling' }] }
    ]
  }
];

const ANGULAR_GROUPS: TopicGroup[] = [
  {
    group: 'Enterprise Architecture', icon: 'shield', tier: 1, accentColor: '#DD0031', accentBg: '#DD003120',
    topics: [
      { topic: 'Compiler & Rendering', problems: [{ name: 'Ivy Compiler & DOM Rendering' }, { name: 'Zone.js & OnPush Change Detection' }] },
      { topic: 'Reactivity', problems: [{ name: 'RxJS Advanced Patterns' }, { name: 'Angular Signals' }] },
      { topic: 'Micro-frontends', problems: [{ name: 'Module Federation' }] }
    ]
  }
];

const DB_GROUPS: TopicGroup[] = [
  {
    group: 'Storage & Distributed Data', icon: 'storage', tier: 1, accentColor: '#336791', accentBg: '#33679120',
    topics: [
      { topic: 'Disk & Memory', problems: [{ name: 'B-Trees vs LSM Trees' }, { name: 'Redis Internals & Eviction Policies' }] },
      { topic: 'Transactions', problems: [{ name: 'MVCC, Isolation Levels & Locks' }] },
      { topic: 'Scaling', problems: [{ name: 'Sharding & Consistent Hashing' }, { name: 'Query Optimization' }] }
    ]
  }
];

const SYSTEM_GROUPS: TopicGroup[] = [
  {
    group: 'System Design', icon: 'architecture', tier: 1, accentColor: '#8B5CF6', accentBg: '#8B5CF620',
    topics: [
      { topic: 'Distributed Systems', problems: [{ name: 'CAP Theorem & PACELC' }, { name: 'Event-Driven Architecture (Kafka/RabbitMQ)' }] },
      { topic: 'Traffic & Scale', problems: [{ name: 'Rate Limiting Algorithms' }, { name: 'Load Balancing & Service Discovery' }] },
      { topic: 'Observability', problems: [{ name: 'Distributed Tracing & Metrics' }] }
    ]
  }
];

export const seniorFsAdapter: ExamTopicBank = {
  examId: 'senior_fs',
  getGroups: (subjectName: string) => {
    switch (subjectName) {
      case 'React 19 & Next.js Architecture': return REACT_GROUPS;
      case 'Node.js Internals & V8': return NODE_GROUPS;
      case 'Angular Enterprise Architecture': return ANGULAR_GROUPS;
      case 'Advanced Databases & Storage': return DB_GROUPS;
      case 'System Design & Scalability': return SYSTEM_GROUPS;
      default: return [...REACT_GROUPS, ...NODE_GROUPS, ...ANGULAR_GROUPS, ...DB_GROUPS, ...SYSTEM_GROUPS];
    }
  }
};
