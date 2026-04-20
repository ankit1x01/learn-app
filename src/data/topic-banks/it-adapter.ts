import type { ExamTopicBank, TopicGroup, TopicEntry } from './types';
import { IT_PLACEMENT_CONCEPTS } from '../itplacement/concepts';
import { dsaAdapter } from './dsa-adapter';

// Extract QA concepts mapped by chapter
const mapQAConceptsToTopicEntries = (chapter: string): TopicEntry[] => {
  return IT_PLACEMENT_CONCEPTS
    .filter(c => c.subject === 'Quantitative Aptitude' && c.chapter === chapter)
    .map(c => ({
      topic: c.name,
      problems: [
        { name: c.chapter }
      ]
    }));
};

const getQAGroups = (): TopicGroup[] => {
  const chapters = Array.from(new Set(
    IT_PLACEMENT_CONCEPTS
      .filter(c => c.subject === 'Quantitative Aptitude')
      .map(c => c.chapter)
  ));
  
  return chapters.map((chapter, i) => {
    const COLORS = [
      { color: '#F59E0B', bg: '#F59E0B20', icon: 'calculate' },
      { color: '#10B981', bg: '#10B98120', icon: 'functions' },
      { color: '#8B5CF6', bg: '#8B5CF620', icon: 'pie_chart' },
      { color: '#0284C7', bg: '#0284C720', icon: 'insights' }
    ];
    const style = COLORS[i % COLORS.length];

    return {
      group: chapter,
      topics: mapQAConceptsToTopicEntries(chapter),
      icon: style.icon,
      tier: 2,
      accentColor: style.color,
      accentBg: style.bg
    };
  });
};

export const itAdapter: ExamTopicBank = {
  examId: 'it_placement_india',
  getGroups: (subjectName: string): TopicGroup[] => {
    if (subjectName === 'DSA & Coding') {
      return dsaAdapter.getGroups(subjectName);
    }
    if (subjectName === 'Quantitative Aptitude') {
      return getQAGroups();
    }
    return [];
  }
};
