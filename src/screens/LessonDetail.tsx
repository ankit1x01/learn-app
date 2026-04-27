import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown';
import type { Lesson, Phase } from '../data/ai-engineering/types';

interface LessonDetailProps {
  lesson: Lesson;
  phase: Phase;
  onBack: () => void;
}

export default function LessonDetail({ lesson, phase, onBack }: LessonDetailProps) {
  const [content, setContent] = useState<string>('');
  const [codeFiles, setCodeFiles] = useState<{ name: string; content: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'docs' | 'code'>('docs');
  const [selectedCodeFile, setSelectedCodeFile] = useState(0);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);

        // Load markdown docs
        if (lesson.docPath) {
          try {
            const docResponse = await fetch(lesson.docPath);
            if (docResponse.ok) {
              const docContent = await docResponse.text();
              setContent(docContent);
            }
          } catch (e) {
            console.log('Could not load doc from path:', lesson.docPath);
            setContent(`# ${lesson.name}\n\nLesson documentation not yet loaded. Path: ${lesson.docPath}`);
          }
        }

        // Load code files (would need to be implemented with actual file loading)
        // For now, we'll just set a placeholder
        setCodeFiles([
          {
            name: 'example.py',
            content: '# Code files will be loaded here\n# Path: ' + lesson.path + '/code/',
          },
        ]);
      } catch (error) {
        console.error('Error loading lesson content:', error);
        setContent('# Error Loading Lesson\n\nCould not load the lesson content.');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [lesson]);

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-20">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-[var(--color-background)]/95 backdrop-blur border-b border-[var(--color-outline-variant)] p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-[var(--color-primary)] font-medium mb-3 active:scale-95 transition-transform"
            >
              ← Back
            </button>
            <div>
              <p className="text-xs text-[var(--color-on-surface-variant)] mb-1">
                Phase {phase.number} • Lesson {lesson.number}
              </p>
              <h1 className="text-xl font-bold text-[var(--color-on-background)]">{lesson.name}</h1>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'docs'
                ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]'
            }`}
          >
            📖 Docs
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'code'
                ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]'
            }`}
          >
            💻 Code
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
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
          <motion.div
            key="docs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="prose prose-sm max-w-none dark:prose-invert"
          >
            <MarkdownContent content={content} />
          </motion.div>
        ) : (
          <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="space-y-4">
              {codeFiles.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {codeFiles.map((file, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedCodeFile(idx)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                        selectedCodeFile === idx
                          ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                          : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]'
                      }`}
                    >
                      {file.name}
                    </button>
                  ))}
                </div>
              )}

              <div className="rounded-lg bg-[var(--color-surface-container)] overflow-hidden border border-[var(--color-outline-variant)]">
                <div className="bg-[var(--color-surface-container-high)] px-4 py-2 border-b border-[var(--color-outline-variant)] text-xs font-mono text-[var(--color-on-surface-variant)]">
                  {codeFiles[selectedCodeFile]?.name || 'code'}
                </div>
                <pre className="p-4 overflow-x-auto text-xs leading-relaxed text-[var(--color-on-surface)]">
                  <code>{codeFiles[selectedCodeFile]?.content || 'No code content'}</code>
                </pre>
              </div>

              <p className="text-xs text-[var(--color-on-surface-variant)] mt-4">
                💡 Tip: Copy this code and run it locally. Modify it, extend it, break it, learn from it.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Helper component to render markdown with proper styling
function MarkdownContent({ content }: { content: string }) {
  return (
    <Markdown
      components={{
        h1: ({ node, ...props }) => (
          <h1 className="text-2xl font-bold my-4 text-[var(--color-on-background)]" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-xl font-bold my-3 mt-6 text-[var(--color-on-background)]" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-lg font-semibold my-2 text-[var(--color-on-background)]" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="my-3 text-[var(--color-on-surface)] leading-relaxed" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-inside my-3 text-[var(--color-on-surface)] space-y-1" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-inside my-3 text-[var(--color-on-surface)] space-y-1" {...props} />
        ),
        li: ({ node, ...props }) => <li className="ml-2" {...props} />,
        code: ({ node, inline, ...props }) =>
          inline ? (
            <code className="px-2 py-1 rounded bg-[var(--color-surface-container)] text-[var(--color-primary)] font-mono text-sm" {...props} />
          ) : (
            <code className="block bg-[var(--color-surface-container)] p-3 rounded-lg my-3 text-xs overflow-x-auto" {...props} />
          ),
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-[var(--color-primary)] pl-4 my-3 italic text-[var(--color-on-surface-variant)]" {...props} />
        ),
        table: ({ node, ...props }) => (
          <table className="w-full border-collapse my-3 text-sm" {...props} />
        ),
        th: ({ node, ...props }) => (
          <th className="border border-[var(--color-outline-variant)] p-2 bg-[var(--color-surface-container)] font-semibold text-[var(--color-on-surface)]" {...props} />
        ),
        td: ({ node, ...props }) => (
          <td className="border border-[var(--color-outline-variant)] p-2 text-[var(--color-on-surface)]" {...props} />
        ),
        a: ({ node, ...props }) => (
          <a className="text-[var(--color-primary)] underline hover:opacity-80" {...props} />
        ),
      }}
    >
      {content}
    </Markdown>
  );
}
