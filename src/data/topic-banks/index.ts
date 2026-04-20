// src/data/topic-banks/index.ts

export type { TopicProblem, TopicEntry, TopicGroup, ExamTopicBank } from './types';
export { EXAM_CARDS } from './exam-registry';
export type { ExamCard } from './exam-registry';

import type { ExamTopicBank } from './types';
import { dsaAdapter } from './dsa-adapter';
import { aiAdapter } from './ai-adapter';
import { seniorFsAdapter } from './senior-fs-adapter';
import { backendAdapter } from './backend-adapter';
import { sysDesign50LAdapter } from './sysdesign-adapter';

export const TOPIC_BANKS: Record<string, ExamTopicBank> = {
  dsa_faang: dsaAdapter,
  ai_engineer: aiAdapter,
  backend_engineer: backendAdapter,
  system_design_50l: sysDesign50LAdapter,
  senior_fs: seniorFsAdapter,
  // it_placement_india: itAdapter,  — add when IT topic data is structured
  // neet_2026: neetAdapter,         — add when NEET data is ready
};



