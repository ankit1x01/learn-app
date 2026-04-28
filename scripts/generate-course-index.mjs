import fs from 'fs';
import path from 'path';

const PHASES_DIR = path.resolve('./ai-engineering-from-scratch-main/phases');
const OUTPUT_FILE = path.resolve('./src/data/ai-engineering/course-index.ts');

function extractNumberAndName(folderName) {
  const match = folderName.match(/^(\d+)-(.+)$/);
  if (!match) return null;
  const [, num, name] = match;
  return {
    number: parseInt(num, 10),
    name: name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
  };
}

function generateCourseIndex() {
  if (!fs.existsSync(PHASES_DIR)) {
    console.error(`❌ Phases directory not found: ${PHASES_DIR}`);
    process.exit(1);
  }

  const phases = [];
  const phaseFolders = fs.readdirSync(PHASES_DIR).sort();

  for (const phaseFolder of phaseFolders) {
    const phasePath = path.join(PHASES_DIR, phaseFolder);

    if (!fs.statSync(phasePath).isDirectory()) continue;

    const phaseInfo = extractNumberAndName(phaseFolder);
    if (!phaseInfo) continue;

    const lessons = [];
    const lessonFolders = fs.readdirSync(phasePath).sort();

    for (const lessonFolder of lessonFolders) {
      const lessonPath = path.join(phasePath, lessonFolder);

      if (!fs.statSync(lessonPath).isDirectory()) continue;

      const lessonInfo = extractNumberAndName(lessonFolder);
      if (!lessonInfo) continue;

      // Build relative path for web access
      const relativePhaseDir = path.relative(process.cwd(), phasePath);
      const relativeLessonDir = path.join(relativePhaseDir, lessonFolder);

      // Check for docs markdown file
      const docsPath = path.join(lessonPath, 'docs', 'en.md');
      const docPathExists = fs.existsSync(docsPath);
      const docPathWeb = docPathExists ? path.join(relativePhaseDir, lessonFolder, 'docs', 'en.md').replace(/\\/g, '/') : undefined;

      // Check for code files
      const codePath = path.join(lessonPath, 'code');
      let codePaths = [];
      if (fs.existsSync(codePath)) {
        codePaths = fs.readdirSync(codePath)
          .filter(f => ['.py', '.js', '.ts', '.java', '.cpp'].some(ext => f.endsWith(ext)))
          .map(f => path.join(relativePhaseDir, lessonFolder, 'code', f).replace(/\\/g, '/'));
      }

      lessons.push({
        id: `lesson-${phaseInfo.number.toString().padStart(2, '0')}-${lessonInfo.number.toString().padStart(2, '0')}`,
        number: lessonInfo.number,
        name: lessonInfo.name,
        path: relativeLessonDir.replace(/\\/g, '/'),
        docPath: docPathWeb,
        codePaths: codePaths.map(p => p.replace(/\\/g, '/')),
        quizPath: undefined,
      });
    }

    phases.push({
      id: `phase-${phaseInfo.number.toString().padStart(2, '0')}`,
      number: phaseInfo.number,
      name: phaseInfo.name,
      path: path.relative(process.cwd(), phasePath).replace(/\\/g, '/'),
      lessons,
    });
  }

  // Generate TypeScript file
  const typescriptCode = `// Auto-generated course index from ${PHASES_DIR}
// Generated at: ${new Date().toISOString()}
// DO NOT EDIT MANUALLY - run: npm run generate-course-index

import type { Phase } from './types';

export const aiEngineeringPhases: Phase[] = ${JSON.stringify(phases, null, 2)};

export const totalLessons = ${phases.reduce((sum, p) => sum + p.lessons.length, 0)};
export const totalPhases = ${phases.length};
`;

  fs.writeFileSync(OUTPUT_FILE, typescriptCode, 'utf-8');

  const totalLessons = phases.reduce((sum, p) => sum + p.lessons.length, 0);
  console.log(`✅ Generated course index: ${OUTPUT_FILE}`);
  console.log(`   📚 ${phases.length} phases`);
  console.log(`   📖 ${totalLessons} lessons`);
}

generateCourseIndex();
