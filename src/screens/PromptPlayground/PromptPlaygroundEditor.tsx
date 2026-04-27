import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, Share2, Copy, Check, MessageSquare, Bot, Sparkles,
  ChevronDown, ChevronUp, Zap, BookOpen, Code2, Shield,
  ExternalLink, RotateCcw
} from 'lucide-react';
import { Share } from '@capacitor/share';
import { TEMPLATES, getTemplatesByPack } from './templates';
import type { Template, CoursePackId } from '../../types';

interface PromptPlaygroundEditorProps {
  pack: CoursePackId;
  chapter: number;
  onBack: () => void;
  onNextChapter?: () => void;
}

const AI_APPS = [
  { label: 'ChatGPT', color: '#10A37F', url: 'https://chatgpt.com', Icon: MessageSquare },
  { label: 'Claude',  color: '#D97757', url: 'https://claude.ai/new', Icon: Bot },
  { label: 'Gemini',  color: '#4285F4', url: 'https://gemini.google.com/', Icon: Sparkles },
];

function estimateTokens(text: string) {
  return Math.ceil(text.length / 4);
}

export const PromptPlaygroundEditor: React.FC<PromptPlaygroundEditorProps> = ({
  pack,
  chapter,
  onBack,
  onNextChapter,
}) => {
  const templates = getTemplatesByPack(pack);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [system, setSystem] = useState('');
  const [user, setUser] = useState('');
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'templates' | 'editor'>('templates');

  const fullPrompt = useMemo(() => {
    const parts = [];
    if (system.trim()) parts.push(`System: ${system.trim()}`);
    if (user.trim()) parts.push(`User: ${user.trim()}`);
    return parts.join('\n\n');
  }, [system, user]);

  const tokens = useMemo(() => estimateTokens(fullPrompt), [fullPrompt]);

  const loadTemplate = (t: Template) => {
    setSelectedTemplate(t);
    setSystem(t.system);
    setUser(t.user);
    setActiveTab('editor');
  };

  const handleCopy = () => {
    if (!fullPrompt.trim()) return;
    navigator.clipboard.writeText(fullPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!fullPrompt.trim()) return;
    try {
      await Share.share({ title: 'Prompt', text: fullPrompt, dialogTitle: 'Share Prompt to AI App' });
    } catch (e) { console.log('Share failed', e); }
  };

  const openApp = (url: string) => {
    handleCopy();
    window.open(url, '_blank');
  };

  const reset = () => {
    setSelectedTemplate(null);
    setSystem('');
    setUser('');
  };

  return (
    <div className="pt-14 pb-32 max-w-md mx-auto min-h-screen flex flex-col" style={{ background: 'var(--color-background)' }}>

      {/* ── Top bar ── */}
      <div className="flex items-center gap-3 px-4 mt-4 mb-5">
        <button onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0"
          style={{ background: 'var(--color-surface-container)', borderColor: 'var(--color-border)' }}>
          <ChevronLeft size={18} style={{ color: 'var(--color-on-surface-variant)' }} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-[18px] leading-tight" style={{ color: 'var(--color-on-surface)' }}>
            {selectedTemplate?.chapterTitle || `Chapter ${chapter}`}
          </h1>
          <p className="text-[11px] uppercase tracking-[0.18em] font-bold" style={{ color: 'var(--color-on-surface-variant)' }}>
            {pack.toUpperCase()} · Ch {chapter}
          </p>
        </div>
        {fullPrompt && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleShare}
            className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0"
            style={{ background: 'var(--color-primary-container)', borderColor: 'var(--color-primary)' }}>
            <Share2 size={15} style={{ color: 'var(--color-on-primary-container)' }} />
          </motion.button>
        )}
      </div>

      {/* ── Tab Bar ── */}
      <div className="flex mx-4 mb-4 p-1 rounded-xl gap-1" style={{ background: 'var(--color-surface-container)' }}>
        {(['templates', 'editor'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="flex-1 py-2 rounded-lg text-[12px] font-bold uppercase tracking-wider transition-all"
            style={{
              background: activeTab === tab ? 'var(--color-primary)' : 'transparent',
              color: activeTab === tab ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)'
            }}>
            {tab === 'templates' ? '📚 Templates' : '✏️ Editor'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'templates' && (
          <motion.div key="templates"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col gap-3 px-4 overflow-y-auto">
            {templates.length === 0 ? (
              <div className="flex items-center justify-center h-40">
                <p style={{ color: 'var(--color-on-surface-variant)' }}>No templates yet. Coming soon!</p>
              </div>
            ) : (
              templates.map((t, i) => (
                <motion.button
                  key={t.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => loadTemplate(t)}
                  className="w-full rounded-2xl border p-4 text-left flex flex-col gap-2 transition-all active:scale-[0.98]"
                  style={{
                    background: selectedTemplate?.id === t.id ? 'var(--color-primary-container)' : 'var(--color-surface)',
                    borderColor: selectedTemplate?.id === t.id ? 'var(--color-primary)' : 'var(--color-border)'
                  }}>
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5"
                      style={{ background: t.techniqueColor + '20', color: t.techniqueColor }}>
                      Ch. {t.chapter}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[14px] leading-snug" style={{ color: 'var(--color-on-surface)' }}>{t.title}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0"
                      style={{ color: t.techniqueColor, borderColor: t.techniqueColor + '40' }}>
                      {t.technique}
                    </span>
                  </div>
                  <p className="text-[12px] leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {t.lesson}
                  </p>
                  {t.highlight && (
                    <div className="flex items-start gap-1.5 mt-1 px-2.5 py-2 rounded-xl"
                      style={{ background: t.techniqueColor + '12' }}>
                      <Zap size={11} className="shrink-0 mt-0.5" style={{ color: t.techniqueColor }} />
                      <p className="text-[11px] font-medium" style={{ color: t.techniqueColor }}>{t.highlight}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-[11px] font-bold" style={{ color: 'var(--color-primary)' }}>
                      Open in Editor →
                    </span>
                  </div>
                </motion.button>
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'editor' && (
          <motion.div key="editor"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col gap-3 px-4">

            {selectedTemplate && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: selectedTemplate.techniqueColor + '15' }}>
                <BookOpen size={13} style={{ color: selectedTemplate.techniqueColor }} />
                <span className="text-[12px] font-bold flex-1" style={{ color: selectedTemplate.techniqueColor }}>
                  {selectedTemplate.title}
                </span>
                <button onClick={reset}>
                  <RotateCcw size={13} style={{ color: selectedTemplate.techniqueColor }} />
                </button>
              </div>
            )}

            {/* System Prompt */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5"
                style={{ color: 'var(--color-on-surface-variant)' }}>
                <Shield size={11} /> System Prompt
              </label>
              <textarea
                value={system}
                onChange={e => setSystem(e.target.value)}
                placeholder="You are a helpful assistant..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl border resize-none focus:outline-none text-[13px]"
                style={{
                  background: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-on-surface)',
                  fontFamily: "'Nunito', system-ui, sans-serif",
                  lineHeight: '1.7'
                }}
              />
            </div>

            {/* User Prompt */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5"
                style={{ color: 'var(--color-on-surface-variant)' }}>
                <MessageSquare size={11} /> User Message
              </label>
              <textarea
                value={user}
                onChange={e => setUser(e.target.value)}
                placeholder="What is the capital of France?"
                rows={6}
                className="w-full px-3 py-2.5 rounded-xl border resize-none focus:outline-none text-[14px]"
                style={{
                  background: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-on-surface)',
                  fontFamily: "'Nunito', system-ui, sans-serif",
                  lineHeight: '1.7'
                }}
              />
            </div>

            {/* Full prompt preview */}
            {fullPrompt && (
              <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  onClick={() => setExpanded(v => !v)}
                  className="w-full flex items-center justify-between px-3 py-2"
                  style={{ background: 'var(--color-surface-container)' }}>
                  <div className="flex items-center gap-2">
                    <Code2 size={12} style={{ color: 'var(--color-on-surface-variant)' }} />
                    <span className="text-[11px] font-bold uppercase tracking-wider"
                      style={{ color: 'var(--color-on-surface-variant)' }}>Full Prompt</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                      style={{ background: 'var(--color-primary-container)', color: 'var(--color-primary)' }}>
                      ~{tokens} tokens
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={e => { e.stopPropagation(); handleCopy(); }}
                      className="flex items-center gap-1 text-[11px] font-bold"
                      style={{ color: copied ? 'var(--color-success)' : 'var(--color-primary)' }}>
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                    {expanded ? <ChevronUp size={14} style={{ color: 'var(--color-on-surface-variant)' }} />
                      : <ChevronDown size={14} style={{ color: 'var(--color-on-surface-variant)' }} />}
                  </div>
                </button>
                <AnimatePresence>
                  {expanded && (
                    <motion.pre
                      initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                      className="px-3 py-2 text-[12px] overflow-hidden"
                      style={{
                        background: 'var(--color-surface)',
                        color: 'var(--color-on-surface)',
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}>
                      {fullPrompt}
                    </motion.pre>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Share & Launch */}
            <button
              onClick={handleShare}
              disabled={!fullPrompt.trim()}
              className="w-full py-4 rounded-2xl font-bold text-[13px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40"
              style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>
              <Share2 size={15} />
              Share via OS Sheet
            </button>

            <div className="grid grid-cols-3 gap-2">
              {AI_APPS.map(({ label, color, url, Icon }) => (
                <motion.button key={label}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => openApp(url)}
                  className="py-3 rounded-xl border flex flex-col items-center justify-center gap-1.5"
                  style={{ background: 'var(--color-surface-container)', borderColor: color + '30' }}>
                  <Icon size={20} style={{ color }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: 'var(--color-on-surface-variant)' }}>{label}</span>
                  <ExternalLink size={9} style={{ color: 'var(--color-on-surface-variant)' }} />
                </motion.button>
              ))}
            </div>

            <p className="text-[11px] text-center pb-2" style={{ color: 'var(--color-on-surface-variant)' }}>
              Copies your prompt to clipboard & opens the AI web app
            </p>

            {onNextChapter && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={onNextChapter}
                className="w-full mt-4 py-3 rounded-2xl font-bold text-[13px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>
                Next Chapter →
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
