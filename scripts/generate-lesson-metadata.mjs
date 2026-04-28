import { getMarkdownContent } from '../src/data/ai-engineering/markdown-content.ts';
import { aiEngineeringPhases } from '../src/data/ai-engineering/course-index.ts';

// Estimate reading time based on word count
// Average reading speed: 200 words per minute, code: 100 words per minute
function estimateReadingTime(markdown) {
  if (!markdown) return 5;

  const wordCount = markdown.split(/\s+/).length;
  const codeBlockCount = (markdown.match(/```/g) || []).length / 2;

  // Regular text at 200 wpm, code at 100 wpm (rough estimate)
  const regularWords = Math.max(0, wordCount - codeBlockCount * 50);
  const codeWords = codeBlockCount * 50;

  const readingMinutes = Math.ceil(regularWords / 200 + codeWords / 100);

  // Add 5 minutes minimum, 60 max
  return Math.max(5, Math.min(readingMinutes + 5, 60));
}

// Generate metadata
const metadata = {};

for (const phase of aiEngineeringPhases) {
  for (const lesson of phase.lessons) {
    const lessonPath = lesson.path.split('/phases/')[1];
    const content = getMarkdownContent(lessonPath);
    const estimatedMinutes = estimateReadingTime(content);

    metadata[lesson.id] = {
      estimatedMinutes,
      completed: false,
      completedAt: null,
    };
  }
}

console.log(`✅ Generated metadata for ${Object.keys(metadata).length} lessons`);
