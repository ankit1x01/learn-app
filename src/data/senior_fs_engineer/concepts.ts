import type { Concept } from '../../core/types';

export const SENIOR_FS_CONCEPTS: Concept[] = [                               
  // ── Advanced Frontend Architecture ──────────────────────────────────────────────
  { id: 'fs_adv_fe_1', subject: 'Advanced Frontend Architecture', chapter: 'React Internals', unit: 1, name: 'React Fiber, Concurrent Mode & Suspense', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'fs_adv_fe_2', subject: 'Advanced Frontend Architecture', chapter: 'Next.js', unit: 1, name: 'RSC (React Server Components) & SSR/ISR Optimization', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'fs_adv_fe_3', subject: 'Advanced Frontend Architecture', chapter: 'Angular Internals', unit: 2, name: 'Angular Ivy, Change Detection (OnPush) & Signals', difficulty: 4, pyqTier: 2, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2 },
  { id: 'fs_adv_fe_4', subject: 'Advanced Frontend Architecture', chapter: 'Performance', unit: 3, name: 'Core Web Vitals, Code Splitting & Tree Shaking', difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'fs_adv_fe_5', subject: 'Advanced Frontend Architecture', chapter: 'Scale', unit: 4, name: 'Micro-frontends (Module Federation)', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2 },

  // ── Backend Performance & Node.js ──────────────────────────────────────────────
  { id: 'fs_adv_be_1', subject: 'Backend Performance & Node.js', chapter: 'Node Internals', unit: 1, name: 'Event Loop Deep Dive, libuv & Thread Pool', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'fs_adv_be_2', subject: 'Backend Performance & Node.js', chapter: 'Concurrency', unit: 2, name: 'Worker Threads, Clustering & IPC', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'fs_adv_be_3', subject: 'Backend Performance & Node.js', chapter: 'Streams', unit: 3, name: 'Node.js Streams, Buffers & Handling Backpressure', difficulty: 4, pyqTier: 2, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2 },
  { id: 'fs_adv_be_4', subject: 'Backend Performance & Node.js', chapter: 'Networking', unit: 4, name: 'WebSockets, gRPC & Server-Sent Events', difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'fs_adv_be_5', subject: 'Backend Performance & Node.js', chapter: 'Security', unit: 5, name: 'Advanced OAuth2 flows, OIDC & JWT Security', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },

  // ── Databases & Distributed Data ──────────────────────────────────────────────
  { id: 'fs_adv_db_1', subject: 'Databases & Distributed Data', chapter: 'RDBMS', unit: 1, name: 'Transaction Isolation Levels & MVCC', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'fs_adv_db_2', subject: 'Databases & Distributed Data', chapter: 'Optimization', unit: 2, name: 'Advanced Indexing (B-Tree, Hash, GiST) & Query Plans', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'fs_adv_db_3', subject: 'Databases & Distributed Data', chapter: 'Distributed DBs', unit: 3, name: 'Sharding, Partitioning & Replication Strategies', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'fs_adv_db_4', subject: 'Databases & Distributed Data', chapter: 'Caching', unit: 4, name: 'Redis Pub/Sub, Eviction Policies & Write-through/Write-behind', difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'fs_adv_db_5', subject: 'Databases & Distributed Data', chapter: 'NoSQL Design', unit: 5, name: 'DynamoDB/MongoDB Schema Design for Scale', difficulty: 4, pyqTier: 2, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2 },

  // ── Cloud Native & DevOps ──────────────────────────────────────────────
  { id: 'fs_adv_cld_1', subject: 'Cloud Native & DevOps', chapter: 'Containers', unit: 1, name: 'Docker Internals & multi-stage builds', difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'fs_adv_cld_2', subject: 'Cloud Native & DevOps', chapter: 'Kubernetes', unit: 2, name: 'Kubernetes Architecture (Pods, Services, Ingress)', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'fs_adv_cld_3', subject: 'Cloud Native & DevOps', chapter: 'AWS Architecture', unit: 3, name: 'AWS VPC, IAM, ECS/EKS & Load Balancers (ALB/NLB)', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'fs_adv_cld_4', subject: 'Cloud Native & DevOps', chapter: 'CI/CD', unit: 4, name: 'Zero-downtime deployment (Blue/Green, Canary)', difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'fs_adv_cld_5', subject: 'Cloud Native & DevOps', chapter: 'Observability', unit: 5, name: 'Prometheus, Grafana & Distributed Tracing (OpenTelemetry)', difficulty: 4, pyqTier: 2, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2 },

  // ── System Design & Scalability ──────────────────────────────────────────────
  { id: 'fs_adv_sys_1', subject: 'System Design & Scalability', chapter: 'Distributed Systems', unit: 1, name: 'CAP Theorem, PACELC & Consistency Models', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'fs_adv_sys_2', subject: 'System Design & Scalability', chapter: 'Architecture', unit: 2, name: 'Monolith to Microservices Migration Strategies', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'fs_adv_sys_3', subject: 'System Design & Scalability', chapter: 'Async Messaging', unit: 3, name: 'Event-Driven Systems (Kafka, RabbitMQ, SQS)', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'fs_adv_sys_4', subject: 'System Design & Scalability', chapter: 'API Gateways', unit: 4, name: 'API Gateways & Rate Limiting Algorithms (Token Bucket)', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'fs_adv_sys_5', subject: 'System Design & Scalability', chapter: 'Interview specific', unit: 5, name: 'Design a system: Newsfeed / System Design Interview framework', difficulty: 5, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 }
];
