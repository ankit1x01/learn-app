import type { Concept } from '../../core/types';

export const SENIOR_FS_CONCEPTS: Concept[] = [
  // ── Phase 1: Web & JS/TS Foundations ──────────────────────────────────────────────
  {
    id: 'fs_web_1', subject: 'Phase 1: Web & JS/TS Foundations', chapter: 'Web Basics', unit: 1, name: 'HTML5 Semantic Tags & Accessibility (a11y)',
    difficulty: 1, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'fs_web_2', subject: 'Phase 1: Web & JS/TS Foundations', chapter: 'Web Basics', unit: 1, name: 'CSS Flexbox, Grid & Responsive Design',
    difficulty: 2, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'fs_web_3', subject: 'Phase 1: Web & JS/TS Foundations', chapter: 'JavaScript Core', unit: 2, name: 'Closures, Prototypes & Execution Context',
    difficulty: 3, pyqTier: 2, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2
  },
  {
    id: 'fs_web_4', subject: 'Phase 1: Web & JS/TS Foundations', chapter: 'JavaScript Core', unit: 2, name: 'Promises, Async/Await & Event Loop',
    difficulty: 3, pyqTier: 2, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2
  },
  {
    id: 'fs_web_5', subject: 'Phase 1: Web & JS/TS Foundations', chapter: 'TypeScript', unit: 3, name: 'TS Interfaces, Generics & Utility Types',
    difficulty: 2, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },

  // ── Phase 2: Frontend Mastery (React & Angular) ──────────────────────────────────────────────
  {
    id: 'fs_fe_1', subject: 'Phase 2: Frontend Mastery (React & Angular)', chapter: 'React Basics', unit: 1, name: 'React Components, Props & State',
    difficulty: 1, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'fs_fe_2', subject: 'Phase 2: Frontend Mastery (React & Angular)', chapter: 'React Advanced', unit: 2, name: 'Hooks Deep Dive (useEffect, useMemo, useCallback)',
    difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'fs_fe_3', subject: 'Phase 2: Frontend Mastery (React & Angular)', chapter: 'Architecture', unit: 3, name: 'React Context, Redux & Zustand',
    difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'fs_fe_4', subject: 'Phase 2: Frontend Mastery (React & Angular)', chapter: 'Angular', unit: 4, name: 'Angular Modules, Components & Directives',
    difficulty: 2, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'fs_fe_5', subject: 'Phase 2: Frontend Mastery (React & Angular)', chapter: 'Angular', unit: 4, name: 'RxJS, Services & Dependency Injection',
    difficulty: 4, pyqTier: 2, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2
  },

  // ── Phase 3: Backend & APIs (Node.js) ──────────────────────────────────────────────
  {
    id: 'fs_be_1', subject: 'Phase 3: Backend & APIs (Node.js)', chapter: 'Node Basics', unit: 1, name: 'Node.js Core Modules & NPM',
    difficulty: 1, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'fs_be_2', subject: 'Phase 3: Backend & APIs (Node.js)', chapter: 'Frameworks', unit: 2, name: 'Express.js & Middleware Architecture',
    difficulty: 2, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'fs_be_3', subject: 'Phase 3: Backend & APIs (Node.js)', chapter: 'APIs', unit: 3, name: 'RESTful API Design & Best Practices',
    difficulty: 2, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'fs_be_4', subject: 'Phase 3: Backend & APIs (Node.js)', chapter: 'Auth', unit: 4, name: 'Authentication (JWT, OAuth, Cookies)',
    difficulty: 3, pyqTier: 2, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2
  },
  {
    id: 'fs_be_5', subject: 'Phase 3: Backend & APIs (Node.js)', chapter: 'Advanced APIs', unit: 5, name: 'GraphQL Subscriptions & Apollo Server',
    difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },

  // ── Phase 4: Databases & Caching ──────────────────────────────────────────────
  {
    id: 'fs_db_1', subject: 'Phase 4: Databases & Caching', chapter: 'SQL', unit: 1, name: 'SQL Basics (Joins, Aggregations)',
    difficulty: 1, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'fs_db_2', subject: 'Phase 4: Databases & Caching', chapter: 'SQL', unit: 1, name: 'PostgreSQL Advanced (Indexes, Transactions)',
    difficulty: 3, pyqTier: 2, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2
  },
  {
    id: 'fs_db_3', subject: 'Phase 4: Databases & Caching', chapter: 'NoSQL', unit: 2, name: 'MongoDB Data Modeling & Aggregation Pipeline',
    difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'fs_db_4', subject: 'Phase 4: Databases & Caching', chapter: 'ORMs', unit: 3, name: 'Prisma, TypeORM & Mongoose',
    difficulty: 2, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'fs_db_5', subject: 'Phase 4: Databases & Caching', chapter: 'Caching', unit: 4, name: 'Redis Fundamentals & Query Caching',
    difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },

  // ── Phase 5: Architect & System Design ──────────────────────────────────────────────
  {
    id: 'fs_sys_1', subject: 'Phase 5: Architect & System Design', chapter: 'DevOps', unit: 1, name: 'Docker Containerization & Docker Compose',
    difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'fs_sys_2', subject: 'Phase 5: Architect & System Design', chapter: 'System Design', unit: 2, name: 'Microservices vs Monolith Architecture',
    difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'fs_sys_3', subject: 'Phase 5: Architect & System Design', chapter: 'Cloud', unit: 3, name: 'AWS Core Services (S3, EC2, RDS, Lambda)',
    difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'fs_sys_4', subject: 'Phase 5: Architect & System Design', chapter: 'Pipelines', unit: 4, name: 'CI/CD Pipelines (GitHub Actions)',
    difficulty: 2, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'fs_sys_5', subject: 'Phase 5: Architect & System Design', chapter: 'Advanced Systems', unit: 5, name: 'CAP Theorem, Pub/Sub & Load Balancing',
    difficulty: 4, pyqTier: 2, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2
  }
];
