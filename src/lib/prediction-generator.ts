/**
 * Generate prediction MCQs from concepts
 * Prediction questions are shown BEFORE the main content
 * to activate active recall
 */

import type { Concept } from '../core/types';

export interface PredictionMCQ {
  id: string;
  conceptId: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

/**
 * Generate a prediction MCQ for a concept
 * These are simple, prediction-based questions shown before the full MCQ
 */
export function generatePredictionMCQ(concept: Concept): PredictionMCQ {
  // Template-based generation based on subject
  const templates = getPredictionTemplates(concept.subject);
  // Use concept ID to deterministically pick template (consistent per concept, varied per session)
  const templateIndex = concept.id.charCodeAt(concept.id.length - 1) % templates.length;
  const template = templates[templateIndex];

  const options = template.generateOptions(concept);
  const correct = template.correctIndex;

  return {
    id: `predict-${concept.id}`,
    conceptId: concept.id,
    question: template.generateQuestion(concept),
    options,
    correct,
    explanation: template.generateExplanation(concept),
  };
}

interface PredictionTemplate {
  generateQuestion: (c: Concept) => string;
  generateOptions: (c: Concept) => string[];
  correctIndex: number;
  generateExplanation: (c: Concept) => string;
}

function getPredictionTemplates(subject: string): PredictionTemplate[] {
  return [
    {
      generateQuestion: (c) => `When would you use "${c.name}" in practice?`,
      generateOptions: (c) => [
        `When you need to understand ${c.name.toLowerCase()}`,
        `When solving real-world problems related to ${c.name}`,
        `Only for academic assessments`,
        `Never needed in real work`,
      ],
      correctIndex: 1,
      generateExplanation: (c) =>
        `${c.name} is most valuable for solving real-world problems. Academic knowledge only matters when applied.`,
    },
    {
      generateQuestion: (c) => `What is the main challenge in understanding "${c.name}"?`,
      generateOptions: (c) => [
        `It's too simple to matter`,
        `Most people confuse it with similar concepts`,
        `It requires prior knowledge you might not have`,
        `There is no challenge - it's straightforward`,
      ],
      correctIndex: 1,
      generateExplanation: (c) =>
        `The main obstacle to mastering ${c.name} is distinguishing it from similar concepts and applying it correctly.`,
    },
    {
      generateQuestion: (c) => `In what scenario does "${c.name}" cause the most mistakes?`,
      generateOptions: (c) => [
        `When you ignore the definition`,
        `When you skip the edge cases`,
        `When you assume it always works`,
        `When you haven't practiced enough examples`,
      ],
      correctIndex: 2,
      generateExplanation: (c) =>
        `The critical mistake is assuming ${c.name} applies universally. Real mastery means knowing its boundary conditions.`,
    },
  ];
}

/**
 * For now: simple template-based generation
 * Future: Gemini-powered generation for more creative predictions
 */
