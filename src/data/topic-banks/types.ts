// src/data/topic-banks/types.ts

export interface TopicProblem {
  name: string;
  link?: string;
  resources?: string[];
  practices?: string[];
}

export interface TopicEntry {
  topic: string;
  problems: TopicProblem[];
}

export interface TopicGroup {
  group: string;
  topics: TopicEntry[];
  icon?: string;        // Material Symbols Rounded name, e.g. 'layers'
  tier?: 1 | 2 | 3;    // Core / Important / Advanced
  accentColor?: string; // CSS var or hex for icon tint
  accentBg?: string;    // CSS var or hex for icon background
}

export interface ExamTopicBank {
  examId: string;
  getGroups: (subjectName: string) => TopicGroup[];
}
