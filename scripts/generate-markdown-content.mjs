import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

const PHASES_DIR = path.resolve('./ai-engineering-from-scratch-main/phases');
const OUTPUT_FILE = path.resolve('./src/data/ai-engineering/markdown-content.ts');

function generateMarkdownContent() {
  if (!fs.existsSync(PHASES_DIR)) {
    console.error(`❌ Phases directory not found: ${PHASES_DIR}`);
    process.exit(1);
  }

  const contentMap = {};
  // Use glob with forward slashes for cross-platform compatibility
  const mdFiles = globSync('ai-engineering-from-scratch-main/phases/**/docs/en.md', {
    cwd: process.cwd(),
    posix: true,
  });

  for (const mdFile of mdFiles) {
    try {
      const fullPath = path.resolve(mdFile);
      const content = fs.readFileSync(fullPath, 'utf-8');
      // Extract the lesson path key from the file path (use forward slashes)
      const normalizedPath = mdFile.replace(/\\/g, '/');
      const match = normalizedPath.match(/phases\/(.+?)\/docs\/en\.md$/);
      if (match) {
        const lessonPath = match[1];
        contentMap[lessonPath] = content;
      }
    } catch (error) {
      console.error(`Failed to read ${mdFile}:`, error.message);
    }
  }

  // Generate TypeScript file with content map
  const typescriptCode = `// Auto-generated markdown content from lessons
// Generated at: ${new Date().toISOString()}
// DO NOT EDIT MANUALLY - run: npm run generate-markdown-content

export const lessonContent: Record<string, string> = ${JSON.stringify(contentMap, null, 2)};

export function getMarkdownContent(lessonPath: string): string | undefined {
  return lessonContent[lessonPath];
}
`;

  fs.writeFileSync(OUTPUT_FILE, typescriptCode, 'utf-8');

  console.log(`✅ Generated markdown content: ${OUTPUT_FILE}`);
  console.log(`   📄 ${Object.keys(contentMap).length} markdown files indexed`);
}

generateMarkdownContent();
