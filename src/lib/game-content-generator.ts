import { GameContent } from './game-content-store';
import { Concept } from '@/core/types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Safe JSON parser that extracts JSON from text with markdown code blocks
function safeParseJSON(text: string): Record<string, any> | null {
  try {
    // Try direct parse first
    return JSON.parse(text);
  } catch {
    // Try extracting JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch {
        // Fall through
      }
    }

    // Try extracting JSON object patterns
    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      try {
        return JSON.parse(objectMatch[0]);
      } catch {
        // Fall through
      }
    }

    return null;
  }
}

type GamePromptTemplate = {
  system: string;
  userTemplate: (concept: Concept) => string;
  parser: (text: string) => Record<string, any>;
};

const GAME_PROMPTS: Record<string, GamePromptTemplate> = {
  memory: {
    system: 'You are creating memory game content. Generate 3-5 items to memorize. Respond ONLY with valid JSON.',
    userTemplate: (concept: Concept) => `
Create a memory game for: "${concept.name}" (${concept.chapter})

Return exactly this JSON structure:
{
  "items": [
    { "name": "Item 1", "definition": "Definition 1" },
    { "name": "Item 2", "definition": "Definition 2" },
    { "name": "Item 3", "definition": "Definition 3" }
  ]
}
    `,
    parser: (text: string) => {
      const json = safeParseJSON(text);
      return {
        items: Array.isArray(json?.items) ? json.items : [],
      };
    },
  },
  challenge: {
    system: 'You are creating a multiple-choice challenge. Respond ONLY with valid JSON.',
    userTemplate: (concept: Concept) => `
Create a challenge question for: "${concept.name}" (${concept.chapter})

Return exactly this JSON structure:
{
  "question": "A clear question about the concept",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0,
  "explanation": "Why the correct answer is right"
}
    `,
    parser: (text: string) => {
      const json = safeParseJSON(text);
      return {
        question: json?.question || '',
        options: Array.isArray(json?.options) ? json.options : [],
        correctIndex: typeof json?.correctIndex === 'number' ? json.correctIndex : 0,
        explanation: json?.explanation || '',
      };
    },
  },
  simulation: {
    system: 'You are creating a simulation game description. Respond ONLY with valid JSON.',
    userTemplate: (concept: Concept) => `
Create a simulation game description for: "${concept.name}" (${concept.chapter})

Return exactly this JSON structure:
{
  "title": "Short simulation title",
  "description": "What the simulation demonstrates",
  "expectedOutcome": "What the learner should observe"
}
    `,
    parser: (text: string) => {
      const json = safeParseJSON(text);
      return {
        title: json?.title || '',
        description: json?.description || '',
        expectedOutcome: json?.expectedOutcome || '',
      };
    },
  },
};

export async function generateGameContent(
  concept: Concept,
  gameType: string,
  maxRetries = 2
): Promise<GameContent | null> {
  const template = GAME_PROMPTS[gameType];
  if (!template) {
    console.warn(`No template for game type: ${gameType}`);
    return null;
  }

  if (!GEMINI_API_KEY) {
    console.debug('GEMINI_API_KEY not set - generation unavailable');
    return null;
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const userPrompt = template.userTemplate(concept);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        {
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
          signal: controller.signal as any,
        }
      );

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (!generatedText) {
        throw new Error('Empty response from Gemini');
      }

      const parsedContent = template.parser(generatedText);
      if (!parsedContent || Object.keys(parsedContent).length === 0) {
        throw new Error('Failed to parse generated content');
      }

      const gameContent: GameContent = {
        id: `gen_${concept.id}_${gameType}_${Date.now()}`,
        conceptId: concept.id,
        content: parsedContent,
        difficulty: 'medium',
        source: 'generated',
        createdAt: Date.now(),
        metadata: {
          gameType,
          requiredFields: Object.keys(parsedContent),
          expectedDuration: 30000,
        },
      };

      console.log(`✓ Generated ${gameType} content for ${concept.name}`);
      return gameContent;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.debug(`Generation attempt ${attempt + 1}/${maxRetries + 1} failed:`, lastError.message);

      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s...
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  console.warn(`Failed to generate ${gameType} content for ${concept.name}: ${lastError?.message}`);
  return null;
}
