import type { ExamTopicBank, TopicGroup, TopicEntry } from './types';
import { systemDesign50LConfig } from '../system_design_50l/config';
import { systemDesign50LConcepts } from '../system_design_50l/concepts';

const mapConceptsToTopics = (subjectId: string, tags: string[]): TopicEntry[] => {
  return systemDesign50LConcepts
    .filter(c => c.subject === subjectId && tags.some(t => (c.tags || []).includes(t)))
    .map(c => ({
      topic: c.name,
      problems: [
        { name: c.chapter.slice(0, 50) + '...' }
      ]
    }));
};

export const sysDesign50LAdapter: ExamTopicBank = {
  examId: 'system_design_50l',
  getGroups: (subjectName: string): TopicGroup[] => {
    switch (subjectName) {
      case 'High-Level Design & Arch':
        return [
          { group: 'Architecture', icon: 'architecture', topics: mapConceptsToTopics('hld_architecture', ['Scalability', 'Microservices']) },
          { group: 'Distributed Systems', icon: 'hub', topics: mapConceptsToTopics('hld_architecture', ['Distributed Systems', 'Protocols']) }
        ];
      case 'Low-Level Design & Code':
        return [
          { group: 'Code Quality', icon: 'code', topics: mapConceptsToTopics('lld_oop', ['SOLID', 'DDD']) },
          { group: 'Patterns', icon: 'account_tree', topics: mapConceptsToTopics('lld_oop', ['Patterns', 'Concurrency']) }
        ];
      case 'Data Strategy & Storage':
        return [
          { group: 'Data Models', icon: 'database', topics: mapConceptsToTopics('data_storage', ['SQL', 'NoSQL']) },
          { group: 'Data Scaling', icon: 'dns', topics: mapConceptsToTopics('data_storage', ['Scaling', 'Caching']) }
        ];
      case 'Asynchronous & Event-Driven':
        return [
          { group: 'Messaging', icon: 'forward_to_inbox', topics: mapConceptsToTopics('event_driven', ['Kafka', 'Message Broker']) },
          { group: 'Event Patterns', icon: 'dynamic_feed', topics: mapConceptsToTopics('event_driven', ['CQRS', 'Saga', 'Streaming']) }
        ];
      case 'Advanced Production Eng':
        return [
          { group: 'Production', icon: 'rocket_launch', topics: mapConceptsToTopics('production_eng', ['FinOps', 'Observability', 'Failure Modes', 'Metastability']) },
          { group: 'Reliability & AI', icon: 'verified_user', topics: mapConceptsToTopics('production_eng', ['Security', 'Reliability', 'AI', 'Chaos', 'LLMOps', 'Formal Verification', 'eBPF']) }
        ];
      case 'Leadership & Career':
        return [
          { group: 'Career & Vision', icon: 'route', topics: mapConceptsToTopics('leadership', ['Mentorship', 'Roadmap', 'Culture']) },
          { group: 'Mechanism Design', icon: 'psychology', topics: mapConceptsToTopics('leadership', ['Game Theory', 'System Design']) }
        ];

      default:
        return [];
    }
  }
};




