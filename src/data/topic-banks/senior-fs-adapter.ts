import type { ExamTopicBank, TopicGroup } from './types';

const FE_GROUPS: TopicGroup[] = [
  {
    group: 'Advanced Frontend', icon: 'integration_instructions', tier: 1, accentColor: '#61DAFB', accentBg: '#61DAFB20',
    topics: [
      { topic: 'Framework Internals', problems: [{ name: 'React Fiber, Concurrent Mode & Suspense' }, { name: 'Angular Ivy, Change Detection (OnPush) & Signals' }] },
      { topic: 'Architecture', problems: [{ name: 'RSC (React Server Components) & SSR/ISR Optimization' }, { name: 'Micro-frontends (Module Federation)' }] },
      { topic: 'Optimization', problems: [{ name: 'Core Web Vitals, Code Splitting & Tree Shaking' }] }
    ]
  }
];

const BE_GROUPS: TopicGroup[] = [
  {
    group: 'Node Performance', icon: 'dns', tier: 1, accentColor: '#68A063', accentBg: '#68A06320',
    topics: [
      { topic: 'Event Loop & Threads', problems: [{ name: 'Event Loop Deep Dive, libuv & Thread Pool' }, { name: 'Worker Threads, Clustering & IPC' }] },
      { topic: 'Data Flow', problems: [{ name: 'Node.js Streams, Buffers & Handling Backpressure' }] },
      { topic: 'Network & Security', problems: [{ name: 'WebSockets, gRPC & Server-Sent Events' }, { name: 'Advanced OAuth2 flows, OIDC & JWT Security' }] }
    ]
  }
];

const DB_GROUPS: TopicGroup[] = [
  {
    group: 'Distributed Data', icon: 'database', tier: 1, accentColor: '#336791', accentBg: '#33679120',
    topics: [
      { topic: 'Relational At Scale', problems: [{ name: 'Transaction Isolation Levels & MVCC' }, { name: 'Advanced Indexing (B-Tree, Hash, GiST) & Query Plans' }] },
      { topic: 'Horizontal Scaling', problems: [{ name: 'Sharding, Partitioning & Replication Strategies' }] },
      { topic: 'NoSQL & Cache', problems: [{ name: 'Redis Pub/Sub, Eviction Policies & Write-through/Write-behind' }, { name: 'DynamoDB/MongoDB Schema Design for Scale' }] }
    ]
  }
];

const CLOUD_GROUPS: TopicGroup[] = [
  {
    group: 'Cloud & DevOps', icon: 'cloud', tier: 1, accentColor: '#F59E0B', accentBg: '#F59E0B20',
    topics: [
      { topic: 'Containers & Orchestration', problems: [{ name: 'Docker Internals & multi-stage builds' }, { name: 'Kubernetes Architecture (Pods, Services, Ingress)' }] },
      { topic: 'AWS Strategy', problems: [{ name: 'AWS VPC, IAM, ECS/EKS & Load Balancers (ALB/NLB)' }] },
      { topic: 'Operations', problems: [{ name: 'Zero-downtime deployment (Blue/Green, Canary)' }, { name: 'Prometheus, Grafana & Distributed Tracing (OpenTelemetry)' }] }
    ]
  }
];

const SYS_GROUPS: TopicGroup[] = [
  {
    group: 'Systems & Scalability', icon: 'architecture', tier: 1, accentColor: '#8B5CF6', accentBg: '#8B5CF620',
    topics: [
      { topic: 'Distributed Theory', problems: [{ name: 'CAP Theorem, PACELC & Consistency Models' }, { name: 'Monolith to Microservices Migration Strategies' }] },
      { topic: 'Messaging', problems: [{ name: 'Event-Driven Systems (Kafka, RabbitMQ, SQS)' }] },
      { topic: 'Gateways & SDIs', problems: [{ name: 'API Gateways & Rate Limiting Algorithms (Token Bucket)' }, { name: 'Design a system: Newsfeed / System Design Interview framework' }] }
    ]
  }
];

export const seniorFsAdapter: ExamTopicBank = {
  examId: 'senior_fs',
  getGroups: (subjectName: string) => {
    switch (subjectName) {
      case 'Advanced Frontend Architecture': return FE_GROUPS;
      case 'Backend Performance & Node.js': return BE_GROUPS;
      case 'Databases & Distributed Data': return DB_GROUPS;
      case 'Cloud Native & DevOps': return CLOUD_GROUPS;
      case 'System Design & Scalability': return SYS_GROUPS;
      default: return [...FE_GROUPS, ...BE_GROUPS, ...DB_GROUPS, ...CLOUD_GROUPS, ...SYS_GROUPS];
    }
  }
};
