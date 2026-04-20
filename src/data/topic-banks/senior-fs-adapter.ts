import type { ExamTopicBank, TopicGroup } from './types';

const PHASE_1_GROUPS: TopicGroup[] = [
  {
    group: 'Web Fundamentals', icon: 'html', tier: 1, accentColor: '#E34F26', accentBg: '#E34F2620',
    topics: [
      { topic: 'HTML & CSS', problems: [{ name: 'HTML5 Semantic Tags & Accessibility (a11y)' }, { name: 'CSS Flexbox, Grid & Responsive Design' }] }
    ]
  },
  {
    group: 'JS & TS Core', icon: 'data_object', tier: 1, accentColor: '#F7DF1E', accentBg: '#F7DF1E20',
    topics: [
      { topic: 'JavaScript Internals', problems: [{ name: 'Closures, Prototypes & Execution Context' }, { name: 'Promises, Async/Await & Event Loop' }] },
      { topic: 'TypeScript', problems: [{ name: 'TS Interfaces, Generics & Utility Types' }] }
    ]
  }
];

const PHASE_2_GROUPS: TopicGroup[] = [
  {
    group: 'React Framework', icon: 'integration_instructions', tier: 1, accentColor: '#61DAFB', accentBg: '#61DAFB20',
    topics: [
      { topic: 'Components', problems: [{ name: 'React Components, Props & State' }, { name: 'Hooks Deep Dive (useEffect, useMemo, useCallback)' }] },
      { topic: 'State & Architecture', problems: [{ name: 'React Context, Redux & Zustand' }] }
    ]
  },
  {
    group: 'Angular Framework', icon: 'shield', tier: 1, accentColor: '#DD0031', accentBg: '#DD003120',
    topics: [
      { topic: 'Core Angular', problems: [{ name: 'Angular Modules, Components & Directives' }] },
      { topic: 'RxJS & DI', problems: [{ name: 'RxJS, Services & Dependency Injection' }] }
    ]
  }
];

const PHASE_3_GROUPS: TopicGroup[] = [
  {
    group: 'Node & Express', icon: 'dns', tier: 1, accentColor: '#68A063', accentBg: '#68A06320',
    topics: [
      { topic: 'Core', problems: [{ name: 'Node.js Core Modules & NPM' }] },
      { topic: 'Servers', problems: [{ name: 'Express.js & Middleware Architecture' }] }
    ]
  },
  {
    group: 'API Design', icon: 'api', tier: 1, accentColor: '#8B5CF6', accentBg: '#8B5CF620',
    topics: [
      { topic: 'REST & Security', problems: [{ name: 'RESTful API Design & Best Practices' }, { name: 'Authentication (JWT, OAuth, Cookies)' }] },
      { topic: 'GraphQL', problems: [{ name: 'GraphQL Subscriptions & Apollo Server' }] }
    ]
  }
];

const PHASE_4_GROUPS: TopicGroup[] = [
  {
    group: 'SQL & Relational', icon: 'database', tier: 1, accentColor: '#336791', accentBg: '#33679120',
    topics: [
      { topic: 'PostgreSQL', problems: [{ name: 'SQL Basics (Joins, Aggregations)' }, { name: 'PostgreSQL Advanced (Indexes, Transactions)' }] }
    ]
  },
  {
    group: 'NoSQL & Caching', icon: 'storage', tier: 1, accentColor: '#10B981', accentBg: '#10B98120',
    topics: [
      { topic: 'MongoDB', problems: [{ name: 'MongoDB Data Modeling & Aggregation Pipeline' }] },
      { topic: 'Tools', problems: [{ name: 'Redis Fundamentals & Query Caching' }, { name: 'Prisma, TypeORM & Mongoose' }] }
    ]
  }
];

const PHASE_5_GROUPS: TopicGroup[] = [
  {
    group: 'Cloud & Infrastructure', icon: 'cloud', tier: 1, accentColor: '#F59E0B', accentBg: '#F59E0B20',
    topics: [
      { topic: 'Containers & CI/CD', problems: [{ name: 'Docker Containerization & Docker Compose' }, { name: 'CI/CD Pipelines (GitHub Actions)' }] },
      { topic: 'AWS', problems: [{ name: 'AWS Core Services (S3, EC2, RDS, Lambda)' }] }
    ]
  },
  {
    group: 'System Design', icon: 'architecture', tier: 1, accentColor: '#EC4899', accentBg: '#EC489920',
    topics: [
      { topic: 'Patterns', problems: [{ name: 'Microservices vs Monolith Architecture' }] },
      { topic: 'Distributed Systems', problems: [{ name: 'CAP Theorem, Pub/Sub & Load Balancing' }] }
    ]
  }
];

export const seniorFsAdapter: ExamTopicBank = {
  examId: 'senior_fs',
  getGroups: (subjectName: string) => {
    switch (subjectName) {
      case 'Phase 1: Web & JS/TS Foundations': return PHASE_1_GROUPS;
      case 'Phase 2: Frontend Mastery (React & Angular)': return PHASE_2_GROUPS;
      case 'Phase 3: Backend & APIs (Node.js)': return PHASE_3_GROUPS;
      case 'Phase 4: Databases & Caching': return PHASE_4_GROUPS;
      case 'Phase 5: Architect & System Design': return PHASE_5_GROUPS;
      default: return [...PHASE_1_GROUPS, ...PHASE_2_GROUPS, ...PHASE_3_GROUPS, ...PHASE_4_GROUPS, ...PHASE_5_GROUPS];
    }
  }
};
