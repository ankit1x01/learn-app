import type { ExamTopicBank, TopicGroup, TopicEntry } from './types';
import { backendEngineerConfig } from '../backend_engineer/config';
import { BACKEND_CONCEPTS } from '../backend_engineer/concepts';

const mapConceptsToTopics = (subjectId: string, tags: string[]): TopicEntry[] => {
  return BACKEND_CONCEPTS
    .filter(c => c.subject === subjectId && tags.some(t => (c.tags || []).includes(t)))
    .map(c => ({
      topic: c.name,
      problems: [
        { name: c.chapter.slice(0, 50) + '...' }
      ]
    }));
};

export const backendAdapter: ExamTopicBank = {
  examId: 'backend_engineer',
  getGroups: (subjectName: string): TopicGroup[] => {
    switch (subjectName) {
      case 'Core Language & Frameworks':
        return [
          { group: 'Language', icon: 'code', topics: mapConceptsToTopics('core', ['Language']) },
          { group: 'APIs', icon: 'api', topics: mapConceptsToTopics('core', ['APIs']) }
        ];
      case 'System Design & Architecture':
        return [
          { group: 'HLD', icon: 'architecture', topics: mapConceptsToTopics('hld', ['HLD', 'Microservices']) },
          { group: 'Distributed', icon: 'hub', topics: mapConceptsToTopics('hld', ['Distributed']) }
        ];
      case 'Databases & Distributed Data':
        return [
          { group: 'Database', icon: 'database', topics: mapConceptsToTopics('data', ['Database', 'NoSQL']) },
          { group: 'Scaling', icon: 'dns', topics: mapConceptsToTopics('data', ['Scaling']) }
        ];
      case 'Infrastructure & DevOps':
        return [
          { group: 'DevOps', icon: 'cloud', topics: mapConceptsToTopics('devops', ['DevOps', 'Infra']) },
          { group: 'Kubernetes', icon: 'anchor', topics: mapConceptsToTopics('devops', ['Kubernetes']) }
        ];
      case 'Leadership & Observability':
        return [
          { group: 'Leadership', icon: 'groups', topics: mapConceptsToTopics('leadership', ['Leadership']) },
          { group: 'Observability', icon: 'monitoring', topics: mapConceptsToTopics('leadership', ['Observability']) }
        ];
      default:
        return [];
    }
  }
};

