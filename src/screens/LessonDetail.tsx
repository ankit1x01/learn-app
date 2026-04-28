import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import MarkdownRenderer from '@/lib/markdown-renderer';
import QuizComponent from '@/lib/quiz-component';
import { getMarkdownContent } from '@/data/ai-engineering/markdown-content';
import { getCodeContent } from '@/data/ai-engineering/code-content';
import { getQuizContent } from '@/data/ai-engineering/quiz-content';
import { aiEngineeringPhases } from '@/data/ai-engineering/course-index';
import type { Lesson, Phase } from '@/data/ai-engineering/types';

interface LessonDetailProps {
  lesson: Lesson;
  phase: Phase;
  onBack: () => void;
}

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

// Estimate reading time based on markdown content
function estimateReadingTime(markdown: string): number {
  if (!markdown) return 5;

  const wordCount = markdown.split(/\s+/).length;
  const codeBlockCount = (markdown.match(/```/g) || []).length / 2;

  // Regular text at 200 wpm, code at 100 wpm
  const regularWords = Math.max(0, wordCount - codeBlockCount * 50);
  const codeWords = codeBlockCount * 50;

  const readingMinutes = Math.ceil(regularWords / 200 + codeWords / 100);
  return Math.max(5, Math.min(readingMinutes + 5, 60)); // 5-60 min range
}

// Extract video URL from markdown or metadata
function extractVideoUrl(markdown: string): string | null {
  // Look for video URLs in markdown
  const videoRegex = /(https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com|wistia\.net)\S+)/;
  const match = markdown.match(videoRegex);
  return match ? match[1] : null;
}

// Convert video URLs to embeddable format
function convertVideoUrl(url: string): string {
  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  }

  // Vimeo
  if (url.includes('vimeo.com')) {
    const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
    if (videoId) return `https://player.vimeo.com/video/${videoId}`;
  }

  // Wistia
  if (url.includes('wistia.net')) {
    const videoId = url.match(/wistia\.net\/medias\/([a-z0-9]+)/)?.[1];
    if (videoId) return `https://fast.wistia.net/embed/iframe/${videoId}`;
  }

  return url; // Return as-is if not recognized
}

// Extract headings from markdown
function extractHeadings(markdown: string): HeadingItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: HeadingItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2];
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    headings.push({ id, text, level });
  }

  return headings;
}

// Get lesson index in phase
function getLessonIndex(phase: Phase, lessonId: string): number {
  return phase.lessons.findIndex(l => l.id === lessonId);
}

// Get previous lesson
function getPreviousLesson(allPhases: typeof aiEngineeringPhases, currentPhase: Phase, currentLesson: Lesson) {
  const currentPhaseIndex = allPhases.findIndex(p => p.id === currentPhase.id);
  const currentLessonIndex = getLessonIndex(currentPhase, currentLesson.id);

  if (currentLessonIndex > 0) {
    return {
      lesson: currentPhase.lessons[currentLessonIndex - 1],
      phase: currentPhase,
    };
  }

  if (currentPhaseIndex > 0) {
    const prevPhase = allPhases[currentPhaseIndex - 1];
    return {
      lesson: prevPhase.lessons[prevPhase.lessons.length - 1],
      phase: prevPhase,
    };
  }

  return null;
}

// Get next lesson
function getNextLesson(allPhases: typeof aiEngineeringPhases, currentPhase: Phase, currentLesson: Lesson) {
  const currentPhaseIndex = allPhases.findIndex(p => p.id === currentPhase.id);
  const currentLessonIndex = getLessonIndex(currentPhase, currentLesson.id);

  if (currentLessonIndex < currentPhase.lessons.length - 1) {
    return {
      lesson: currentPhase.lessons[currentLessonIndex + 1],
      phase: currentPhase,
    };
  }

  if (currentPhaseIndex < allPhases.length - 1) {
    const nextPhase = allPhases[currentPhaseIndex + 1];
    return {
      lesson: nextPhase.lessons[0],
      phase: nextPhase,
    };
  }

  return null;
}

export default function LessonDetail({ lesson, phase, onBack }: LessonDetailProps) {
  const [content, setContent] = useState<string>('');
  const [codeFiles, setCodeFiles] = useState<{ name: string; content: string }[]>([]);
  const [quizData, setQuizData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'docs' | 'code' | 'video' | 'quiz'>('docs');
  const [selectedCodeFile, setSelectedCodeFile] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const headings = useMemo(() => extractHeadings(content), [content]);
  const previousLesson = useMemo(() => getPreviousLesson(aiEngineeringPhases, phase, lesson), [phase, lesson]);
  const nextLesson = useMemo(() => getNextLesson(aiEngineeringPhases, phase, lesson), [phase, lesson]);

  useEffect(() => {
    setLoading(true);
    setActiveTab('docs');
    setSelectedCodeFile(0);

    // Get the lesson path
    const lessonPath = lesson.path.split('/phases/')[1];

    if (lessonPath) {
      const markdownContent = getMarkdownContent(lessonPath);
      if (markdownContent) {
        setContent(markdownContent);

        // Calculate estimated reading time
        const timeEstimate = estimateReadingTime(markdownContent);
        setEstimatedTime(timeEstimate);

        // Extract video URL from markdown
        const videoLink = extractVideoUrl(markdownContent);
        setVideoUrl(videoLink);
      } else {
        setContent(`# ${lesson.name}\n\n## Content Not Found`);
        setEstimatedTime(5);
        setVideoUrl(null);
      }

      // Load code files if they exist
      if (lesson.codePaths && lesson.codePaths.length > 0) {
        const codes = lesson.codePaths.map(codePath => {
          const fileName = codePath.split('/').pop() || 'code';
          const normalizedPath = codePath.replace(/\\/g, '/');
          const codeContent = getCodeContent(normalizedPath);
          return {
            name: fileName,
            content: codeContent || `// File: ${fileName}\n// Path: ${codePath}\n\n// Content not found`,
          };
        });
        setCodeFiles(codes);
      } else {
        setCodeFiles([]);
      }

      // Load quiz if it exists
      const quiz = getQuizContent(lessonPath);
      setQuizData(quiz || null);

      // Check if lesson was completed (from localStorage)
      const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '{}');
      setIsCompleted(completedLessons[lesson.id] || false);
    }

    setLoading(false);
  }, [lesson, phase]);

  // Mark lesson as completed when user spends time viewing it
  useEffect(() => {
    if (!isCompleted && content) {
      const timer = setTimeout(() => {
        const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '{}');
        completedLessons[lesson.id] = true;
        localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
        setIsCompleted(true);
      }, 30000); // Mark as completed after 30 seconds of viewing

      return () => clearTimeout(timer);
    }
  }, [lesson.id, content, isCompleted]);

  const handleCopyLink = () => {
    const link = `${window.location.origin}?lesson=${lesson.id}&phase=${phase.id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNavigateLesson = (targetLesson: Lesson, targetPhase: Phase) => {
    // In a real app, you'd update parent state or use routing
    // For now, we'll just scroll to top
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Breadcrumb Navigation */}
      <div className="sticky top-0 z-20 bg-[var(--color-background)]/95 backdrop-blur border-b border-[var(--color-outline-variant)] px-4 py-2">
        <div className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)]">
          <button onClick={onBack} className="text-[var(--color-primary)] hover:opacity-80">
            AI Engineering
          </button>
          <span>/</span>
          <span>Phase {phase.number}</span>
          <span>/</span>
          <span className="text-[var(--color-primary)] font-medium">{lesson.name}</span>
        </div>
      </div>

      {/* Header with Back, Title, and Copy Link */}
      <div className="sticky top-11 z-10 bg-[var(--color-background)]/95 backdrop-blur border-b border-[var(--color-outline-variant)] p-4">
        <div className="flex items-start justify-between mb-4 gap-4">
          <div className="flex-1">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-[var(--color-primary)] font-medium mb-3 active:scale-95 transition-transform hover:opacity-80"
            >
              <span className="material-symbols-rounded">arrow_back</span>
              Back
            </button>
            <div>
              <p className="text-xs text-[var(--color-on-surface-variant)] mb-1">
                Phase {phase.number} • Lesson {lesson.number}
              </p>
              <h1 className="text-xl font-bold text-[var(--color-on-background)]">{lesson.name}</h1>
            </div>
          </div>
          <button
            onClick={handleCopyLink}
            className="px-3 py-2 rounded-lg bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] active:scale-95 transition-all hover:bg-[var(--color-surface-container-high)]"
            title="Copy lesson link"
          >
            <span className="material-symbols-rounded text-sm">
              {copied ? 'check' : 'share'}
            </span>
          </button>
        </div>

        {/* Progress and Time Indicator */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 flex items-center gap-2">
            <span className="text-xs font-medium text-[var(--color-on-surface-variant)]">
              <span className="material-symbols-rounded text-sm" style={{ color: 'var(--color-primary)' }}>schedule</span>
              {estimatedTime} min
            </span>
            {isCompleted && (
              <span className="px-2 py-1 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)] text-xs font-medium flex items-center gap-1">
                <span className="material-symbols-rounded text-sm">check_circle</span>
                Completed
              </span>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'docs'
                ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]'
            }`}
          >
            <span className="material-symbols-rounded text-base">description</span>
            Docs
          </button>
          {videoUrl && (
            <button
              onClick={() => setActiveTab('video')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'video'
                  ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                  : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]'
              }`}
            >
              <span className="material-symbols-rounded text-base">play_circle</span>
              Video
            </button>
          )}
          {codeFiles.length > 0 && (
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'code'
                  ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                  : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]'
              }`}
            >
              <span className="material-symbols-rounded text-base">code</span>
              Code ({codeFiles.length})
            </button>
          )}
          {quizData && (
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'quiz'
                  ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                  : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]'
              }`}
            >
              <span className="material-symbols-rounded text-base">quiz</span>
              Quiz ({quizData.questions.length})
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6 p-4 pb-40 max-w-7xl mx-auto">
        {/* Left: Documentation */}
        <div className="flex-1">
          {loading ? (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center py-8 text-[var(--color-on-surface-variant)]"
            >
              <div className="material-symbols-rounded text-4xl animate-spin mx-auto mb-2">
                hourglass_empty
              </div>
              <p>Loading lesson...</p>
            </motion.div>
          ) : activeTab === 'docs' ? (
            <motion.div key="docs" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <MarkdownRenderer markdown={content} />
            </motion.div>
          ) : activeTab === 'video' && videoUrl ? (
            <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden border-4 border-[var(--color-on-background)]" style={{ boxShadow: `4px 4px 0px var(--color-on-background)` }}>
                <iframe
                  width="100%"
                  height="100%"
                  src={convertVideoUrl(videoUrl)}
                  title="Lesson Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="text-sm text-[var(--color-on-surface-variant)] flex items-start gap-2">
                <span className="material-symbols-rounded text-base shrink-0" style={{ color: 'var(--color-warning)' }}>lightbulb</span>
                Watch the video and read the documentation for the best learning experience.
              </p>
            </motion.div>
          ) : activeTab === 'quiz' && quizData ? (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="mb-4">
                <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-on-background)' }}>
                  Test Your Knowledge
                </h2>
                <QuizComponent
                  quizData={quizData}
                  lessonId={lesson.id}
                  onComplete={(stats) => {
                    // Update lesson completion based on quiz performance
                    if (stats.percentage >= 80) {
                      const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '{}');
                      completedLessons[lesson.id] = true;
                      localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
                      setIsCompleted(true);
                    }
                  }}
                />
              </div>
            </motion.div>
          ) : activeTab === 'code' ? (
            <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {codeFiles.length > 0 && (
                <div className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    {codeFiles.map((file, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedCodeFile(idx)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedCodeFile === idx
                            ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                            : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]'
                        }`}
                      >
                        {file.name}
                      </button>
                    ))}
                  </div>

                  <div
                    className="rounded-lg bg-[var(--color-surface-container)] overflow-hidden border border-[var(--color-outline-variant)]"
                    style={{
                      border: `3px solid var(--color-on-background)`,
                      boxShadow: `4px 4px 0px var(--color-on-background)`,
                    }}
                  >
                    <div className="bg-[var(--color-surface-container-high)] px-4 py-2 border-b border-[var(--color-outline-variant)] text-xs font-mono text-[var(--color-on-surface-variant)]">
                      {codeFiles[selectedCodeFile]?.name}
                    </div>
                    <pre className="p-4 overflow-x-auto text-xs leading-relaxed text-[var(--color-on-surface)] font-mono">
                      <code>{codeFiles[selectedCodeFile]?.content}</code>
                    </pre>
                  </div>

                  <p className="text-xs text-[var(--color-on-surface-variant)] mt-4 flex items-start gap-2">
                    <span className="material-symbols-rounded text-base shrink-0" style={{ color: 'var(--color-warning)' }}>lightbulb</span>
                    Tip: Copy and run this code locally. Modify it, extend it, break it, learn from it.
                  </p>
                </div>
              )}
            </motion.div>
          ) : null}
        </div>

        {/* Right: Table of Contents (on large screens) */}
        {activeTab === 'docs' && headings.length > 0 && (
          <div className="hidden lg:block w-64 sticky top-40 h-fit">
            <div className="bg-[var(--color-surface-container)] p-4 rounded-lg border border-[var(--color-outline-variant)]">
              <h3 className="text-sm font-bold text-[var(--color-on-background)] mb-3 flex items-center gap-2">
                <span className="material-symbols-rounded text-base">list</span>
                Contents
              </h3>
              <nav className="space-y-2 text-sm">
                {headings.filter(h => h.level <= 3).map(heading => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className="block text-[var(--color-primary)] hover:opacity-80 transition-opacity"
                    style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Previous/Next Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--color-background)] border-t border-[var(--color-outline-variant)] p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {previousLesson ? (
            <button
              onClick={() => handleNavigateLesson(previousLesson.lesson, previousLesson.phase)}
              className="flex-1 p-3 rounded-lg bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)] transition-all active:scale-95 text-left border border-[var(--color-outline-variant)]"
            >
              <p className="text-xs text-[var(--color-on-surface-variant)] mb-1">Previous Lesson</p>
              <p className="text-sm font-semibold text-[var(--color-on-background)] flex items-center gap-2">
                <span className="material-symbols-rounded">arrow_back</span>
                {previousLesson.lesson.name}
              </p>
            </button>
          ) : (
            <div />
          )}

          <div className="text-center text-xs text-[var(--color-on-surface-variant)]">
            Phase {phase.number} • Lesson {lesson.number} / {phase.lessons.length}
          </div>

          {nextLesson ? (
            <button
              onClick={() => handleNavigateLesson(nextLesson.lesson, nextLesson.phase)}
              className="flex-1 p-3 rounded-lg bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)] transition-all active:scale-95 text-right border border-[var(--color-outline-variant)]"
            >
              <p className="text-xs text-[var(--color-on-surface-variant)] mb-1">Next Lesson</p>
              <p className="text-sm font-semibold text-[var(--color-on-background)] flex items-center justify-end gap-2">
                {nextLesson.lesson.name}
                <span className="material-symbols-rounded">arrow_forward</span>
              </p>
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
