import { GameContent } from './game-content-store';
import { Concept } from '@/core/types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

type GamePromptTemplate = {
  system: string;
  userTemplate: (concept: Concept) => string;
  parser: (text: string) => Record<string, any>;
};

const GAME_PROMPTS: Record<string, GamePromptTemplate> = {
  memory: {
    system: 'You are creating memory game content. Generate 3-5 items to memorize.',
    userTemplate: (concept: Concept) => `
Create a memory game for the concept: "${concept.name}"
Chapter: ${concept.chapter || 'General'}

Respond in JSON format:
{
  "items": [
    { "name": "Item name", "definition": "Definition or description" }
  ]
}
    `,
    parser: (text: string) => {
      const json = JSON.parse(text);
      return {
        items: json.items || [],
      };
    },
  },
  challenge: {
    system: 'You are creating a challenge question for a learning game.',
    userTemplate: (concept: Concept) => `
Create a multiple-choice challenge for: "${concept.name}"
Chapter: ${concept.chapter || 'General'}

Respond in JSON format:
{
  "question": "The challenge question",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0,
  "explanation": "Why the correct answer is right"
}
    `,
    parser: (text: string) => {
      const json = JSON.parse(text);
      return {
        question: json.question || '',
        options: json.options || [],
        correctIndex: json.correctIndex ?? 0,
        explanation: json.explanation || '',
      };
    },
  },
};

export async function generateGameContent(
  concept: Concept,
  gameType: string
): Promise<GameContent | null> {
  const template = GAME_PROMPTS[gameType];
  if (!template || !GEMINI_API_KEY) {
    console.warn(`No template for game type: ${gameType}`);
    return null;
  }

  try {
    const userPrompt = template.userTemplate(concept);

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: userPrompt,
              },
            ],
          },
        ],
        systemInstruction: {
          parts: [
            {
              text: template.system,
            },
          ],
        },
      }),
    });

    if (!response.ok) {
      console.error(`Gemini API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const generatedText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!generatedText) {
      console.warn('Empty response from Gemini');
      return null;
    }

    const content = template.parser(generatedText);

    const gameContent: GameContent = {
      id: `gen_${concept.id}_${gameType}_${Date.now()}`,
      conceptId: concept.id,
      content,
      difficulty: 'medium',
      source: 'generated',
      createdAt: Date.now(),
      metadata: {
        gameType,
        requiredFields: Object.keys(content),
        expectedDuration: 30000,
      },
    };

    return gameContent;
  } catch (error) {
    console.error(`Error generating game content: ${error}`);
    return null;
  }
}
