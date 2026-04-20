import type { Concept } from '../../core/types';

export const BACKEND_CONCEPTS: Concept[] = [
  // ── Core Language & Frameworks ──────────────────────────────────────────────
  { id: 'be_cl_1', subject: 'Core Language & Frameworks', chapter: 'Language Depth', unit: 1, name: 'Node.js Event Loop, V8 & Async Profiling', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'be_cl_2', subject: 'Core Language & Frameworks', chapter: 'Language Depth', unit: 1, name: 'Go Runtime, Native Concurrency & Memory Management', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'be_cl_3', subject: 'Core Language & Frameworks', chapter: 'Language Depth', unit: 1, name: 'Python/Java Internals (JVM GC, GIL, Memory)', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'be_cl_4', subject: 'Core Language & Frameworks', chapter: 'Frameworks', unit: 2, name: 'Enterprise MVC (NestJS, Spring Boot, FastAPI)', difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2 },
  { id: 'be_cl_5', subject: 'Core Language & Frameworks', chapter: 'API Design', unit: 3, name: 'Advanced API Design (REST, GraphQL, Validation)', difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'be_cl_6', subject: 'Core Language & Frameworks', chapter: 'Security', unit: 4, name: 'Auth/AuthZ, JWT, OAuth2 & Zero Trust', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },

  // ── System Design & Architecture ──────────────────────────────────────────────
  { id: 'be_sys_1', subject: 'System Design & Architecture', chapter: 'Distributed Systems', unit: 1, name: 'CAP / PACELC Theorem & Consistency Models', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'be_sys_2', subject: 'System Design & Architecture', chapter: 'Distributed Systems', unit: 1, name: 'Concurrency Models & Non-Blocking I/O vs Threads', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'be_sys_3', subject: 'System Design & Architecture', chapter: 'Microservices', unit: 2, name: 'Microservices vs Monolith Tradeoffs & Migration', difficulty: 4, pyqTier: 2, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'be_sys_4', subject: 'System Design & Architecture', chapter: 'Microservices', unit: 2, name: 'gRPC & Internal Microservice Communication', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'be_sys_5', subject: 'System Design & Architecture', chapter: 'Event-Driven', unit: 3, name: 'Messaging Systems (Kafka, RabbitMQ, SQS)', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'be_sys_6', subject: 'System Design & Architecture', chapter: 'Scaling', unit: 4, name: 'Load Balancing & Horizontal vs Vertical Scaling', difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2 },
  { id: 'be_sys_7', subject: 'System Design & Architecture', chapter: 'HLD/LLD', unit: 5, name: 'High-Level & Low-Level Design (Newsfeed, Rate Limit)', difficulty: 5, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },

  // ── Databases & Distributed Data ──────────────────────────────────────────────
  { id: 'be_db_1', subject: 'Databases & Distributed Data', chapter: 'RDBMS', unit: 1, name: 'SQL Engines, ACID Compliance & MVCC', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'be_db_2', subject: 'Databases & Distributed Data', chapter: 'Optimization', unit: 2, name: 'Index Strategies, Query Tuning & EXPLAIN ANALYZE', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'be_db_3', subject: 'Databases & Distributed Data', chapter: 'NoSQL', unit: 3, name: 'NoSQL Design (MongoDB, DynamoDB, Cassandra)', difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2 },
  { id: 'be_db_4', subject: 'Databases & Distributed Data', chapter: 'Scale', unit: 4, name: 'Database Partitioning, Replication & Sharding', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'be_db_5', subject: 'Databases & Distributed Data', chapter: 'Data Integration', unit: 5, name: 'Vector DBs (RAG) & AI Data Integrations', difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'be_db_6', subject: 'Databases & Distributed Data', chapter: 'Data Scale', unit: 5, name: 'Advanced Caching Strategies (Redis, CDNs)', difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },

  // ── Infrastructure & DevOps ──────────────────────────────────────────────
  { id: 'be_ops_1', subject: 'Infrastructure & DevOps', chapter: 'Containers', unit: 1, name: 'Docker Internals & Local Environment Setup', difficulty: 2, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'be_ops_2', subject: 'Infrastructure & DevOps', chapter: 'Orchestration', unit: 2, name: 'Kubernetes Architecture, Pods & Services', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'be_ops_3', subject: 'Infrastructure & DevOps', chapter: 'IaC', unit: 3, name: 'Infrastructure as Code (Terraform, CloudFormation)', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2 },
  { id: 'be_ops_4', subject: 'Infrastructure & DevOps', chapter: 'Pipelines', unit: 4, name: 'CI/CD Pipelines, GitHub Actions & Env Deployments', difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'be_ops_5', subject: 'Infrastructure & DevOps', chapter: 'Cloud Platforms', unit: 5, name: 'AWS/Azure/GCP Managed Services (IAM, Serverless)', difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'be_ops_6', subject: 'Infrastructure & DevOps', chapter: 'Security', unit: 6, name: 'DevSecOps & Code / API Security Principles', difficulty: 3, pyqTier: 2, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'be_ops_7', subject: 'Infrastructure & DevOps', chapter: 'Cloud Patterns', unit: 7, name: 'Serverless Functions vs Container Deployments', difficulty: 3, pyqTier: 2, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2 },

  // ── Leadership & Observability ──────────────────────────────────────────────
  { id: 'be_ld_1', subject: 'Leadership & Observability', chapter: 'Observability', unit: 1, name: 'Metrics, Tracing & Logging (Prometheus, OpenTelemetry)', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'be_ld_2', subject: 'Leadership & Observability', chapter: 'Standards', unit: 2, name: 'Code Quality, Clean Code & SOLID Principles', difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2 },
  { id: 'be_ld_3', subject: 'Leadership & Observability', chapter: 'Management', unit: 3, name: 'Technical Roadmaps & Reducing Technical Debt', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'be_ld_4', subject: 'Leadership & Observability', chapter: 'Culture', unit: 4, name: 'Mentorship, Hiring & Cross-Functional Alignment', difficulty: 3, pyqTier: 2, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2 },
  { id: 'be_ld_5', subject: 'Leadership & Observability', chapter: 'Strategy', unit: 5, name: 'The Art of the Tradeoff (Scalability vs Constraints)', difficulty: 5, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 }
];

