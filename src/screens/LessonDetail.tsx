import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  onNavigateLesson?: (lesson: Lesson, phase: Phase) => void;
}

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

function estimateReadingTime(markdown: string): number {
  if (!markdown) return 5;
  const wordCount = markdown.split(/\s+/).length;
  const codeBlockCount = (markdown.match(/```/g) || []).length / 2;
  const regularWords = Math.max(0, wordCount - codeBlockCount * 50);
  const codeWords = codeBlockCount * 50;
  const readingMinutes = Math.ceil(regularWords / 200 + codeWords / 100);
  return Math.max(5, Math.min(readingMinutes + 5, 60));
}

function extractVideoUrl(markdown: string): string | null {
  const videoRegex = /(https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com|wistia\.net)\S+)/;
  const match = markdown.match(videoRegex);
  return match ? match[1] : null;
}

function convertVideoUrl(url: string): string {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes('vimeo.com')) {
    const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
    if (videoId) return `https://player.vimeo.com/video/${videoId}`;
  }
  if (url.includes('wistia.net')) {
    const videoId = url.match(/wistia\.net\/medias\/([a-z0-9]+)/)?.[1];
    if (videoId) return `https://fast.wistia.net/embed/iframe/${videoId}`;
  }
  return url;
}

function extractHeadings(markdown: string): HeadingItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: HeadingItem[] = [];
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2];
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    headings.push({ id, text, level });
  }
  return headings;
}

function getLessonIndex(phase: Phase, lessonId: string): number {
  return phase.lessons.findIndex(l => l.id === lessonId);
}

function getPreviousLesson(allPhases: typeof aiEngineeringPhases, currentPhase: Phase, currentLesson: Lesson) {
  const currentPhaseIndex = allPhases.findIndex(p => p.id === currentPhase.id);
  const currentLessonIndex = getLessonIndex(currentPhase, currentLesson.id);
  if (currentLessonIndex > 0) return { lesson: currentPhase.lessons[currentLessonIndex - 1], phase: currentPhase };
  if (currentPhaseIndex > 0) {
    const prevPhase = allPhases[currentPhaseIndex - 1];
    return { lesson: prevPhase.lessons[prevPhase.lessons.length - 1], phase: prevPhase };
  }
  return null;
}

function getNextLesson(allPhases: typeof aiEngineeringPhases, currentPhase: Phase, currentLesson: Lesson) {
  const currentPhaseIndex = allPhases.findIndex(p => p.id === currentPhase.id);
  const currentLessonIndex = getLessonIndex(currentPhase, currentLesson.id);
  if (currentLessonIndex < currentPhase.lessons.length - 1) return { lesson: currentPhase.lessons[currentLessonIndex + 1], phase: currentPhase };
  if (currentPhaseIndex < allPhases.length - 1) {
    const nextPhase = allPhases[currentPhaseIndex + 1];
    return { lesson: nextPhase.lessons[0], phase: nextPhase };
  }
  return null;
}

function tabClass(active: boolean) {
  return `px-3 py-1.5 rounded-lg font-medium text-sm transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
    active
      ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
      : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]'
  }`;
}

export default function LessonDetail({ lesson, phase, onBack, onNavigateLesson }: LessonDetailProps) {
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showMobileToc, setShowMobileToc] = useState(false);

  const headings = useMemo(() => extractHeadings(content), [content]);
  const previousLesson = useMemo(() => getPreviousLesson(aiEngineeringPhases, phase, lesson), [phase, lesson]);
  const nextLesson = useMemo(() => getNextLesson(aiEngineeringPhases, phase, lesson), [phase, lesson]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setLoading(true);
    setActiveTab('docs');
    setSelectedCodeFile(0);
    setShowMobileToc(false);

    const lessonPath = lesson.path.split('/phases/')[1];

    if (lessonPath) {
      const markdownContent = getMarkdownContent(lessonPath);
      if (markdownContent) {
        setContent(markdownContent);
        setEstimatedTime(estimateReadingTime(markdownContent));
        setVideoUrl(extractVideoUrl(markdownContent));
      } else {
        setContent(`# ${lesson.name}\n\n## Content Not Found`);
        setEstimatedTime(5);
        setVideoUrl(null);
      }

      if (lesson.codePaths && lesson.codePaths.length > 0) {
        const codes = lesson.codePaths.map(codePath => {
          const fileName = codePath.split('/').pop() || 'code';
          const normalizedPath = codePath.replace(/\\/g, '/');
          const codeContent = getCodeContent(normalizedPath);
          return { name: fileName, content: codeContent || `// File: ${fileName}\n// Path: ${codePath}\n\n// Content not found` };
        });
        setCodeFiles(codes);
      } else {
        setCodeFiles([]);
      }

      const quiz = getQuizContent(lessonPath);
      setQuizData(quiz || null);

      const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '{}');
      setIsCompleted(completedLessons[lesson.id] || false);
    }

    setLoading(false);
  }, [lesson, phase]);

  useEffect(() => {
    if (!isCompleted && content && activeTab === 'docs') {
      const timer = setTimeout(() => {
        const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '{}');
        completedLessons[lesson.id] = true;
        localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
        setIsCompleted(true);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [lesson.id, content, isCompleted, activeTab]);

  const handleCopyLink = () => {
    const link = `${window.location.origin}?lesson=${lesson.id}&phase=${phase.id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNavigateLesson = (targetLesson: Lesson, targetPhase: Phase) => {
    if (onNavigateLesson) {
      onNavigateLesson(targetLesson, targetPhase);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">

      {/* ── Single compact sticky header ── */}
      <div className="sticky top-0 z-20 bg-[var(--color-background)] border-b border-[var(--color-outline-variant)]">

        {/* Scroll progress bar */}
        <div className="h-0.5 bg-[var(--color-surface-container-high)]">
          <motion.div
            className="h-full bg-[var(--color-primary)]"
            style={{ width: `${scrollProgress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        <div className="px-3 sm:px-4 pt-2 pb-3 space-y-2">

          {/* Row 1: back · breadcrumb · lesson counter · share */}
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-[var(--color-primary)] font-medium active:scale-95 transition-transform shrink-0"
            >
              <span className="material-symbols-rounded text-base">arrow_back</span>
              <span className="text-sm">AI Eng</span>
            </button>
            <span className="text-[var(--color-outline)] text-sm">/</span>
            <span className="text-sm text-[var(--color-on-surface-variant)] truncate flex-1">
              Phase {phase.number}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-[var(--color-on-surface-variant)]">
                {lesson.number}/{phase.lessons.length}
              </span>
              {isCompleted && (
                <span className="material-symbols-rounded text-base" style={{ color: 'var(--color-success)', fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              )}
              <button
                onClick={handleCopyLink}
                className="p-1.5 rounded-lg bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] active:scale-95 transition-all hover:bg-[var(--color-surface-container-high)]"
                title="Copy lesson link"
              >
                <span className="material-symbols-rounded text-base">
                  {copied ? 'check' : 'share'}
                </span>
              </button>
            </div>
          </div>

          {/* Row 2: title + reading time */}
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-base sm:text-lg font-bold text-[var(--color-on-background)] leading-snug line-clamp-2 flex-1">
              {lesson.name}
            </h1>
            <div className="flex items-center gap-1 shrink-0 text-xs text-[var(--color-on-surface-variant)] pt-0.5">
              <span className="material-symbols-rounded text-sm" style={{ color: 'var(--color-warning)' }}>schedule</span>
              <span>{estimatedTime} min</span>
            </div>
          </div>

          {/* Row 3: tabs */}
          <div className="flex gap-2 overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0 pb-0.5">
            <button onClick={() => setActiveTab('docs')} className={tabClass(activeTab === 'docs')}>
              <span className="material-symbols-rounded text-base">description</span>
              Docs
            </button>
            {videoUrl && (
              <button onClick={() => setActiveTab('video')} className={tabClass(activeTab === 'video')}>
                <span className="material-symbols-rounded text-base">play_circle</span>
                Video
              </button>
            )}
            {codeFiles.length > 0 && (
              <button onClick={() => setActiveTab('code')} className={tabClass(activeTab === 'code')}>
                <span className="material-symbols-rounded text-base">code</span>
                Code
                <span className="text-xs opacity-70">({codeFiles.length})</span>
              </button>
            )}
            {quizData && (
              <button onClick={() => setActiveTab('quiz')} className={tabClass(activeTab === 'quiz')}>
                <span className="material-symbols-rounded text-base">quiz</span>
                Quiz
                <span className="text-xs opacity-70">({quizData.questions.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-3 sm:p-4 max-w-7xl mx-auto" style={{ paddingBottom: 'calc(200px + env(safe-area-inset-bottom))' }}>

        <div className="flex-1 min-w-0">
          {loading ? (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center py-8 text-[var(--color-on-surface-variant)]"
            >
              <div className="material-symbols-rounded text-4xl animate-spin mx-auto mb-2">hourglass_empty</div>
              <p>Loading lesson...</p>
            </motion.div>
          ) : activeTab === 'docs' ? (
            <motion.div key="docs" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

              {/* Mobile ToC toggle */}
              {headings.length > 0 && (
                <div className="lg:hidden mb-4">
                  <button
                    onClick={() => setShowMobileToc(v => !v)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-[var(--color-surface-container)] text-sm font-medium text-[var(--color-on-surface-variant)]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-rounded text-base">list</span>
                      Contents
                    </div>
                    <span className="material-symbols-rounded text-base transition-transform" style={{ transform: showMobileToc ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      expand_more
                    </span>
                  </button>
                  <AnimatePresence>
                    {showMobileToc && (
                      <motion.nav
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-1 px-3 py-2 rounded-lg bg-[var(--color-surface-container)] space-y-2 text-sm">
                          {headings.filter(h => h.level <= 3).map(heading => (
                            <a
                              key={heading.id}
                              href={`#${heading.id}`}
                              onClick={() => setShowMobileToc(false)}
                              className="block text-[var(--color-primary)] hover:opacity-80 transition-opacity"
                              style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                            >
                              {heading.text}
                            </a>
                          ))}
                        </div>
                      </motion.nav>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <MarkdownRenderer markdown={content} />
            </motion.div>
          ) : activeTab === 'video' && videoUrl ? (
            <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden border-2 sm:border-4 border-[var(--color-on-background)]" style={{ boxShadow: `2px 2px 0px var(--color-on-background)` }}>
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
              <p className="text-xs sm:text-sm text-[var(--color-on-surface-variant)] flex items-start gap-2">
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
                  <div className="flex gap-2 flex-wrap overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
                    {codeFiles.map((file, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedCodeFile(idx)}
                        className={tabClass(selectedCodeFile === idx)}
                      >
                        {file.name}
                      </button>
                    ))}
                  </div>
                  <div
                    className="rounded-lg bg-[var(--color-surface-container)] overflow-hidden border-2 sm:border-4 border-[var(--color-on-background)]"
                    style={{ boxShadow: `2px 2px 0px var(--color-on-background)` }}
                  >
                    <div className="bg-[var(--color-surface-container-high)] px-3 sm:px-4 py-2 border-b border-[var(--color-outline-variant)] text-xs font-mono text-[var(--color-on-surface-variant)] truncate">
                      {codeFiles[selectedCodeFile]?.name}
                    </div>
                    <pre className="p-3 sm:p-4 overflow-x-auto text-xs leading-relaxed text-[var(--color-on-surface)] font-mono">
                      <code>{codeFiles[selectedCodeFile]?.content}</code>
                    </pre>
                  </div>
                  <p className="text-xs text-[var(--color-on-surface-variant)] mt-4 flex items-start gap-2">
                    <span className="material-symbols-rounded text-base shrink-0" style={{ color: 'var(--color-warning)' }}>lightbulb</span>
                    <span>Tip: Copy and run this code locally. Modify it, extend it, break it, learn from it.</span>
                  </p>
                </div>
              )}
            </motion.div>
          ) : null}
        </div>

        {/* Desktop sidebar ToC */}
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

      {/* ── Fixed bottom prev/next bar ── */}
      {(previousLesson || nextLesson) && (
        <div className="fixed left-0 right-0 z-[55] px-3 py-2 bg-[var(--color-background)] border-t border-[var(--color-outline-variant)]" style={{ bottom: 'calc(80px + env(safe-area-inset-bottom))', boxShadow: '0 -2px 8px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-2 max-w-7xl mx-auto">
            {previousLesson ? (
              <button
                onClick={() => handleNavigateLesson(previousLesson.lesson, previousLesson.phase)}
                className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)] transition-all active:scale-95 text-left min-w-0"
              >
                <span className="material-symbols-rounded shrink-0 text-base text-[var(--color-on-surface-variant)]">arrow_back</span>
                <div className="min-w-0">
                  <p className="text-[10px] text-[var(--color-on-surface-variant)]">Previous</p>
                  <p className="text-xs font-semibold text-[var(--color-on-background)] truncate">{previousLesson.lesson.name}</p>
                </div>
              </button>
            ) : (
              <div className="flex-1" />
            )}
            <span className="text-xs text-[var(--color-on-surface-variant)] shrink-0 px-1">
              {lesson.number}/{phase.lessons.length}
            </span>
            {nextLesson ? (
              <button
                onClick={() => handleNavigateLesson(nextLesson.lesson, nextLesson.phase)}
                className="flex-1 flex items-center justify-end gap-2 px-3 py-2 rounded-lg bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)] transition-all active:scale-95 text-right min-w-0"
              >
                <div className="min-w-0">
                  <p className="text-[10px] text-[var(--color-on-surface-variant)]">Next</p>
                  <p className="text-xs font-semibold text-[var(--color-on-background)] truncate">{nextLesson.lesson.name}</p>
                </div>
                <span className="material-symbols-rounded shrink-0 text-base text-[var(--color-on-surface-variant)]">arrow_forward</span>
              </button>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
