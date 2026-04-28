import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

const PHASES_DIR = path.resolve('./ai-engineering-from-scratch-main/phases');
const OUTPUT_FILE = path.resolve('./src/data/ai-engineering/code-content.ts');

function generateCodeContent() {
  if (!fs.existsSync(PHASES_DIR)) {
    console.error(`❌ Phases directory not found: ${PHASES_DIR}`);
    process.exit(1);
  }

  const contentMap = {};
  const codeFiles = globSync('ai-engineering-from-scratch-main/phases/**/code/**/*.{py,js,ts,java,cpp,go,rb,php,sh}', {
    cwd: process.cwd(),
    posix: true,
  });

  for (const codeFile of codeFiles) {
    try {
      const fullPath = path.resolve(codeFile);
      const content = fs.readFileSync(fullPath, 'utf-8');

      // Use the relative path as key (normalize backslashes)
      const normalizedPath = codeFile.replace(/\\/g, '/');
      contentMap[normalizedPath] = content;
    } catch (error) {
      console.error(`Failed to read ${codeFile}:`, error.message);
    }
  }

  // Generate TypeScript file with content map
  const typescriptCode = `// Auto-generated code content from lessons
// Generated at: ${new Date().toISOString()}
// DO NOT EDIT MANUALLY - run: npm run generate-code-content

export const codeContent: Record<string, string> = ${JSON.stringify(contentMap, null, 2)};

export function getCodeContent(codePath: string): string | undefined {
  return codeContent[codePath];
}
`;

  fs.writeFileSync(OUTPUT_FILE, typescriptCode, 'utf-8');

  console.log(`✅ Generated code content: ${OUTPUT_FILE}`);
  console.log(`   📝 ${Object.keys(contentMap).length} code files indexed`);
}

generateCodeContent();
