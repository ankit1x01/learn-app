import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

const PHASES_DIR = path.resolve('./ai-engineering-from-scratch-main/phases');
const OUTPUT_FILE = path.resolve('./src/data/ai-engineering/quiz-content.ts');

function generateQuizContent() {
  if (!fs.existsSync(PHASES_DIR)) {
    console.error(`❌ Phases directory not found: ${PHASES_DIR}`);
    process.exit(1);
  }

  const contentMap = {};
  // Look for quiz.json files in both possible directory structures
  const quizFiles = globSync('ai-engineering-from-scratch-main/**/quiz.json', {
    cwd: process.cwd(),
    posix: true,
  });

  for (const quizFile of quizFiles) {
    try {
      const fullPath = path.resolve(quizFile);
      const content = fs.readFileSync(fullPath, 'utf-8');
      let quizData = JSON.parse(content);

      // Normalize different quiz formats
      // Some quizzes are arrays of questions directly, others have { questions: [...] }
      let questions = Array.isArray(quizData) ? quizData : (quizData.questions || []);

      // Normalize field names across different quiz formats
      questions = questions.map(q => {
        const { id, ...cleaned } = q; // Remove 'id' field
        // Normalize alternative field names to standard ones
        if (cleaned.prompt && !cleaned.question) {
          cleaned.question = cleaned.prompt;
          delete cleaned.prompt;
        }
        if (cleaned.q && !cleaned.question) {
          cleaned.question = cleaned.q;
          delete cleaned.q;
        }
        if (cleaned.choices && !cleaned.options) {
          cleaned.options = cleaned.choices;
          delete cleaned.choices;
        }
        return cleaned;
      });

      quizData = { questions };

      // Extract the lesson path key from the file path
      const normalizedPath = quizFile.replace(/\\/g, '/');
      // Match pattern: phases/XX-name/NN-name/ or phases/XX-name/NN-name/quiz.json
      const match = normalizedPath.match(/phases\/(.+?)\/quiz\.json$/);
      if (match) {
        const lessonPath = match[1];
        contentMap[lessonPath] = quizData;
      }
    } catch (error) {
      console.error(`Failed to read ${quizFile}:`, error.message);
    }
  }

  // Generate TypeScript file with quiz map
  const typescriptCode = `// Auto-generated quiz content from lessons
// Generated at: ${new Date().toISOString()}
// DO NOT EDIT MANUALLY - run: npm run generate-quiz-content

export interface QuizQuestion {
  stage: 'pre' | 'post';
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface QuizData {
  questions: QuizQuestion[];
}

export const quizContent: Record<string, QuizData> = ${JSON.stringify(contentMap, null, 2)};

export function getQuizContent(lessonPath: string): QuizData | undefined {
  return quizContent[lessonPath];
}
`;

  fs.writeFileSync(OUTPUT_FILE, typescriptCode, 'utf-8');

  console.log(`✅ Generated quiz content: ${OUTPUT_FILE}`);
  console.log(`   ❓ ${Object.keys(contentMap).length} quiz files indexed`);
}

generateQuizContent();
