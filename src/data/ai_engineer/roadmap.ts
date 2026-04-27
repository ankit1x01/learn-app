import { AI_CONCEPTS } from './concepts';
import type { Lesson } from '../course/lessons';

export const AI_ROADMAP_LESSONS: Lesson[] = [];

let day = 1;

const subjects = [
  'Core Foundations',
  'ML & Deep Learning',
  'NLP & Language Understanding',
  'LLM Mastery',
  'RAG & Knowledge Systems',
  'AI Agents & Automation',
  'Production AI & MLOps',
  'AI Leadership & Safety'
];

subjects.forEach((subj, idx) => {
  const phaseNum = (idx + 1) as 1|2|3|4|5|6|7|8;
  const concepts = AI_CONCEPTS.filter(c => c.subject === subj);
  
  concepts.forEach(c => {
    AI_ROADMAP_LESSONS.push({
      day: day++,
      phase: phaseNum,
      phaseTitle: subj,
      title: c.name,
      principle: c.stakesFact || 'Master this concept to advance your AI engineering career.',
      theory: [
        `Today we dive into ${c.name}. This is a critical component of ${subj}.`,
        `Focus on the practical applications, particularly ${c.tags.join(', ')}.`,
        `Remember: ${c.stakesFact || 'This is heavily tested in Lead-level interviews.'}`
      ],
      represent: `Draw a high-level architecture diagram showing how ${c.name} fits into a production AI system. Identify its inputs, transformations, and outputs.`,
      recallCheck: [
        `What is the primary use case for ${c.name}?`,
        `How does it compare to its traditional or naive alternatives?`,
        `What are the most common failure modes or bottlenecks?`
      ],
      apply: `Open a local environment. Implement a basic "Hello World" version or write down the pseudo-code for ${c.name}.`,
      compress: `I understand ${c.name} and can implement its core pattern.`
    });
  });

  // Review Day
  AI_ROADMAP_LESSONS.push({
    day: day++,
    phase: phaseNum,
    phaseTitle: subj,
    title: `${subj} — Portfolio Project & Review`,
    principle: `Build proof, not claims. Consolidate your ${subj} knowledge.`,
    theory: [
      `You've completed all concepts in ${subj}.`,
      `The next step is applying them to a real-world scenario. Your portfolio project proves that you can integrate these isolated concepts into a functional system.`,
      `Identify any fragile concepts from this phase and review them before moving to the next subject.`
    ],
    represent: `Map out the entire ${subj} pipeline on paper. Show how the last ${concepts.length} concepts connect to each other.`,
    recallCheck: [
      `What were the 3 most difficult concepts in this phase?`,
      `How do they connect?`,
      `What is one new thing you built?`
    ],
    apply: `Spend this session working on the portfolio project for ${subj}.`,
    compress: `I have built proof of my ${subj} capability.`
  });
});

// Pad remaining days up to 90
const capstoneStart = day;
while(day <= 90) {
  AI_ROADMAP_LESSONS.push({
    day: day++,
    phase: 8,
    phaseTitle: 'AI Leadership & Safety',
    title: `Capstone Integration — Day ${day - capstoneStart}`,
    principle: 'Integration is the ultimate test of knowledge.',
    theory: [
      'In these final days, you are building your capstone Lead AI Engineer project.',
      'Combine LLMs, RAG, Agents, and MLOps into one deployed application.',
      'Focus on error handling, observability, and latency optimization.'
    ],
    represent: 'Review your system architecture. Draw the trace of a single user request flowing through your agents and tools.',
    recallCheck: [
      'What is the current bottleneck in your system?',
      'How does your system handle LLM API failures?',
      'Are your prompts secure against injection?'
    ],
    apply: 'Write code, optimize prompts, and deploy.',
    compress: 'Ship it.'
  });
}

export const AI_PHASE_META = subjects.map((subj, idx) => {
  const phaseLessons = AI_ROADMAP_LESSONS.filter(l => l.phaseTitle === subj);
  const start = phaseLessons[0].day;
  const end = phaseLessons[phaseLessons.length - 1].day;
  const colors = ['#6C63FF', '#F59E0B', '#F472B6', '#00D97E', '#38BDF8', '#FB923C', '#A78BFA', '#34D399'];
  return {
    phase: idx + 1,
    title: subj,
    days: `${start}–${end}`,
    color: colors[idx],
    desc: `Master ${subj}`
  };
});
