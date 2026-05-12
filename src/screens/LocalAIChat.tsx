import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as webllm from '@mlc-ai/web-llm';
import {
  isNativeAndroid,
  checkStoragePermission,
  requestStoragePermission,
  scanNativeModels,
  initializeNativeModel,
  chatNative,
  stopNativeResponse,
  resetNativeConversation,
  cleanUpNativeEngine,
  formatModelSize,
  type NativeModel,
} from '../lib/litertlm-plugin';

interface Props {
  onBack: () => void;
}

// ── WebLLM model registry (browser / non-Android) ────────────────────────────

const WEB_MODELS = [
  {
    id: 'gemma-3-1b-it-q4f16_1-MLC',
    name: 'Gemma 3 1B',
    params: '1B',
    size: '0.9 GB',
    description: "Google's fastest on-device model. Great for quick chats.",
    color: '#4285F4',
    icon: 'bolt',
  },
  {
    id: 'gemma-3-4b-it-q4f16_1-MLC',
    name: 'Gemma 3 4B',
    params: '4B',
    size: '2.4 GB',
    description: 'Smarter Gemma with better reasoning.',
    color: '#4285F4',
    icon: 'auto_awesome',
  },
  {
    id: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
    name: 'Qwen 2.5',
    params: '1.5B',
    size: '1.1 GB',
    description: 'Fast and capable. Excellent for technical questions.',
    color: '#6750A4',
    icon: 'psychology',
  },
  {
    id: 'DeepSeek-R1-Distill-Qwen-1.5B-q4f16_1-MLC',
    name: 'DeepSeek R1',
    params: '1.5B',
    size: '1.1 GB',
    description: 'Reasoning model with thinking steps. Best for analysis.',
    color: '#146C2E',
    icon: 'cognition',
  },
  {
    id: 'phi-4-mini-instruct-q4f16_1-MLC',
    name: 'Phi-4 Mini',
    params: '3.8B',
    size: '2.3 GB',
    description: "Microsoft's compact powerhouse. Excellent instruction following.",
    color: '#7D5260',
    icon: 'stars',
  },
] as const;

type WebModelId = (typeof WEB_MODELS)[number]['id'];

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  thinking?: string;
}

const DOWNLOADED_KEY = 'webllm_downloaded';

function getDownloaded(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(DOWNLOADED_KEY) || '[]'));
  } catch {
    return new Set();
  }
}

function markDownloaded(id: string) {
  const set = getDownloaded();
  set.add(id);
  localStorage.setItem(DOWNLOADED_KEY, JSON.stringify([...set]));
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function LocalAIChat({ onBack }: Props) {
  const isAndroid = isNativeAndroid();

  const [phase, setPhase] = useState<'select' | 'loading' | 'chat'>('select');
  const [nativeModels, setNativeModels] = useState<NativeModel[]>([]);
  const [nativeScanning, setNativeScanning] = useState(false);
  const [storagePermission, setStoragePermission] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const [activeModelName, setActiveModelName] = useState('');
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadText, setLoadText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloaded, setDownloaded] = useState<Set<string>>(getDownloaded);
  const [expandedThinking, setExpandedThinking] = useState<number | null>(null);

  const webEngineRef = useRef<webllm.MLCEngine | null>(null);
  const abortRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasWebGPU = 'gpu' in navigator;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Check permission on mount — auto-open Settings if not granted
  useEffect(() => {
    if (!isAndroid) return;
    checkStoragePermission().then(granted => {
      if (granted) {
        setStoragePermission('granted');
        doScan();
      } else {
        setStoragePermission('denied');
        // Automatically open the All Files Access settings page
        requestStoragePermission();
      }
    });
  }, [isAndroid]);

  const doScan = () => {
    setNativeScanning(true);
    scanNativeModels().then(models => {
      setNativeModels(models);
      setNativeScanning(false);
    });
  };

  // Re-check permission when screen is focused (user returns from Settings)
  useEffect(() => {
    if (!isAndroid || phase !== 'select') return;
    const timer = setInterval(async () => {
      const granted = await checkStoragePermission();
      if (granted && storagePermission !== 'granted') {
        setStoragePermission('granted');
        doScan();
      }
    }, 1500);
    return () => clearInterval(timer);
  }, [isAndroid, phase, storagePermission]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isAndroid) {
        cleanUpNativeEngine().catch(() => {});
      } else {
        webEngineRef.current?.unload().catch(() => {});
      }
    };
  }, [isAndroid]);

  // ── Load native model ─────────────────────────────────────────────────────

  const loadNativeModel = useCallback(async (model: NativeModel) => {
    setPhase('loading');
    setLoadProgress(0);
    setLoadText('Initializing engine...');
    setActiveModelName(model.displayName);
    setMessages([]);

    try {
      await initializeNativeModel(model.path);
      setLoadProgress(100);
      setLoadText('Ready');
      setPhase('chat');
    } catch (err) {
      console.error('Native model load failed:', err);
      setPhase('select');
    }
  }, []);

  // ── Load WebLLM model ─────────────────────────────────────────────────────

  const loadWebModel = useCallback(async (modelId: WebModelId) => {
    setPhase('loading');
    setLoadProgress(0);
    setLoadText('Preparing model...');
    setMessages([]);

    const meta = WEB_MODELS.find(m => m.id === modelId)!;
    setActiveModelName(`${meta.name} ${meta.params}`);

    try {
      if (webEngineRef.current) {
        await webEngineRef.current.unload();
        webEngineRef.current = null;
      }

      webEngineRef.current = await webllm.CreateMLCEngine(modelId, {
        initProgressCallback: (report) => {
          setLoadProgress(Math.round(report.progress * 100));
          setLoadText(report.text);
        },
      });

      markDownloaded(modelId);
      setDownloaded(getDownloaded());
      setPhase('chat');
    } catch (err) {
      console.error('WebLLM load failed:', err);
      setPhase('select');
    }
  }, []);

  // ── Send message (native) ─────────────────────────────────────────────────

  const sendNativeMessage = useCallback(async () => {
    if (!input.trim() || isGenerating) return;

    const userMsg = input.trim();
    setInput('');
    setIsGenerating(true);
    abortRef.current = false;

    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    let accumulated = '';
    try {
      await chatNative(userMsg, (token, done) => {
        if (abortRef.current) return;
        if (!done) {
          accumulated += token;
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: 'assistant', content: accumulated };
            return updated;
          });
        }
      });
    } catch (err) {
      if (!abortRef.current) {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: 'Something went wrong. Please try again.' };
          return updated;
        });
      }
    }

    setIsGenerating(false);
  }, [input, isGenerating]);

  // ── Send message (WebLLM) ─────────────────────────────────────────────────

  const sendWebMessage = useCallback(async () => {
    if (!webEngineRef.current || !input.trim() || isGenerating) return;

    const userMsg = input.trim();
    setInput('');
    setIsGenerating(true);
    abortRef.current = false;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setMessages(prev => [...prev, { role: 'assistant', content: '', thinking: '' }]);

    try {
      const stream = await webEngineRef.current.chat.completions.create({
        messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        stream: true,
      });

      let content = '';
      let thinking = '';
      let inThinking = false;

      for await (const chunk of stream) {
        if (abortRef.current) break;
        const delta = chunk.choices[0]?.delta?.content || '';

        for (let i = 0; i < delta.length; i++) {
          const sofar = content + delta.slice(0, i + 1);
          if (sofar.endsWith('<think>')) { inThinking = true; }
          else if (sofar.endsWith('</think>')) { inThinking = false; }
          else if (inThinking) { thinking += delta[i]; }
          else { content += delta[i]; }
        }

        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: content.replace(/<\/?think>/g, '').trim(),
            thinking: thinking.trim() || undefined,
          };
          return updated;
        });
      }
    } catch (err) {
      if (!abortRef.current) {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: 'Something went wrong. Please try again.' };
          return updated;
        });
      }
    }

    setIsGenerating(false);
  }, [input, messages, isGenerating]);

  const sendMessage = isAndroid ? sendNativeMessage : sendWebMessage;

  const stopGeneration = () => {
    abortRef.current = true;
    if (isAndroid) {
      stopNativeResponse().catch(() => {});
    } else {
      webEngineRef.current?.interruptGenerate();
    }
    setIsGenerating(false);
  };

  const handleNewChat = async () => {
    if (isAndroid) {
      await resetNativeConversation().catch(() => {});
    }
    setMessages([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Select phase ────────────────────────────────────────────────────────────

  if (phase === 'select') {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-background)' }}>
        <div className="sticky top-0 z-10 border-b px-4 py-3 flex items-center gap-3" style={{ background: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
          <button onClick={onBack} className="p-1.5 -ml-1.5 rounded-lg active:scale-95 transition-transform" style={{ color: 'var(--color-primary)' }}>
            <span className="material-symbols-rounded">arrow_back</span>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-base" style={{ color: 'var(--color-on-background)' }}>Local AI</h1>
            <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
              {isAndroid ? 'Models from AI Edge Gallery · No internet needed' : 'Runs 100% in your browser'}
            </p>
          </div>
          {isAndroid && storagePermission === 'granted' && (
            <button
              onClick={doScan}
              className="p-1.5 rounded-lg active:scale-95 transition-transform"
              style={{ color: 'var(--color-primary)' }}
            >
              <span className="material-symbols-rounded" style={{ fontSize: 20 }}>refresh</span>
            </button>
          )}
        </div>

        <div className="flex-1 p-4 space-y-3 pb-8">

          {/* Android: show Gallery models */}
          {isAndroid ? (
            <>
              {/* Checking permission */}
              {storagePermission === 'unknown' && (
                <div className="flex items-center justify-center gap-3 py-12">
                  <motion.span
                    className="material-symbols-rounded text-2xl"
                    style={{ color: 'var(--color-primary)' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >progress_activity</motion.span>
                  <span className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Checking storage access...</span>
                </div>
              )}

              {/* Permission not granted */}
              {storagePermission === 'denied' && (
                <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: 'var(--color-error-container)' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--color-error)' }}>
                      <span className="material-symbols-rounded text-xl" style={{ color: 'var(--color-on-error)', fontVariationSettings: "'FILL' 1" }}>folder_off</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: 'var(--color-on-error-container)' }}>Files access required</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--color-on-error-container)', lineHeight: 1.6 }}>
                        Smriti needs "All Files Access" to read your AI Edge Gallery models from storage.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => requestStoragePermission()}
                    className="w-full py-3 rounded-xl font-bold text-sm active:scale-[0.98] transition-all"
                    style={{ background: 'var(--color-error)', color: 'var(--color-on-error)' }}
                  >
                    Grant Access in Settings
                  </button>
                  <p className="text-xs text-center" style={{ color: 'var(--color-on-error-container)', opacity: 0.7 }}>
                    Come back after granting — models load automatically.
                  </p>
                </div>
              )}

              {/* Permission granted — show models */}
              {storagePermission === 'granted' && (
                <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--color-surface-container)' }}>
                  <span className="material-symbols-rounded text-xl mt-0.5" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>folder_open</span>
                  <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)', lineHeight: 1.5 }}>
                    Reading from AI Edge Gallery storage. Download models there first, then select one below.
                  </p>
                </div>
              )}

              {storagePermission === 'granted' && nativeScanning && (
                <div className="flex items-center justify-center gap-3 py-8">
                  <motion.span
                    className="material-symbols-rounded text-2xl"
                    style={{ color: 'var(--color-primary)' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >progress_activity</motion.span>
                  <span className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Scanning storage...</span>
                </div>
              )}

              {storagePermission === 'granted' && !nativeScanning && nativeModels.length === 0 && (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <span className="material-symbols-rounded text-4xl" style={{ color: 'var(--color-on-surface-variant)' }}>search_off</span>
                  <p className="font-semibold text-sm" style={{ color: 'var(--color-on-background)' }}>No models found</p>
                  <p className="text-xs max-w-xs" style={{ color: 'var(--color-on-surface-variant)', lineHeight: 1.6 }}>
                    Open AI Edge Gallery and download a model. Then tap refresh.
                  </p>
                </div>
              )}

              {storagePermission === 'granted' && !nativeScanning && nativeModels.map((model) => (
                <motion.button
                  key={model.path}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => loadNativeModel(model)}
                  className="w-full text-left p-4 rounded-2xl border transition-all"
                  style={{ background: 'var(--color-surface-container-lowest)', borderColor: 'var(--color-border)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--color-primary-container)' }}>
                      <span className="material-symbols-rounded text-xl" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>
                        {model.type === 'litertlm' ? 'model_training' : 'task_alt'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate" style={{ color: 'var(--color-on-background)' }}>
                        {model.displayName}
                      </p>
                      <p className="text-xs truncate mt-0.5" style={{ color: 'var(--color-on-surface-variant)' }}>
                        {model.fileName}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium uppercase" style={{ background: 'var(--color-primary-container)', color: 'var(--color-primary)' }}>
                          {model.type}
                        </span>
                        {model.version && (
                          <span className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>v{model.version}</span>
                        )}
                        <span className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                          {formatModelSize(model.sizeBytes)}
                        </span>
                      </div>
                    </div>
                    <span className="material-symbols-rounded shrink-0" style={{ color: 'var(--color-primary)', fontSize: 20 }}>play_circle</span>
                  </div>
                </motion.button>
              ))}
            </>
          ) : (
            /* Browser: WebLLM models */
            <>
              {!hasWebGPU && (
                <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--color-error-container)', color: 'var(--color-on-error-container)' }}>
                  <span className="material-symbols-rounded text-xl mt-0.5">warning</span>
                  <div>
                    <p className="font-semibold text-sm">WebGPU not available</p>
                    <p className="text-xs mt-0.5 opacity-80">Use Chrome or Edge 113+ for GPU-accelerated inference.</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--color-surface-container)' }}>
                <span className="material-symbols-rounded text-xl mt-0.5" style={{ color: 'var(--color-primary)' }}>info</span>
                <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)', lineHeight: 1.5 }}>
                  Models download to your browser cache once, then run offline.
                </p>
              </div>

              <p className="text-xs font-semibold uppercase tracking-widest px-1" style={{ color: 'var(--color-on-surface-variant)' }}>
                Available Models
              </p>

              {WEB_MODELS.map((model) => {
                const isCached = downloaded.has(model.id);
                return (
                  <motion.button
                    key={model.id}
                    onClick={() => loadWebModel(model.id)}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-left p-4 rounded-2xl border transition-all"
                    style={{ background: 'var(--color-surface-container-lowest)', borderColor: 'var(--color-border)' }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: model.color + '18' }}>
                        <span className="material-symbols-rounded text-xl" style={{ color: model.color, fontVariationSettings: "'FILL' 1" }}>
                          {model.icon}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm" style={{ color: 'var(--color-on-background)' }}>{model.name}</span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: model.color + '18', color: model.color }}>
                            {model.params}
                          </span>
                          {isCached && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: 'var(--color-success-container)', color: 'var(--color-success)' }}>
                              <span className="material-symbols-rounded text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                              Cached
                            </span>
                          )}
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--color-on-surface-variant)' }}>{model.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>{model.size}</span>
                          <span className="material-symbols-rounded text-base" style={{ color: 'var(--color-primary)' }}>
                            {isCached ? 'play_circle' : 'download'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Loading phase ───────────────────────────────────────────────────────────

  if (phase === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-6" style={{ background: 'var(--color-background)' }}>
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center" style={{ background: 'var(--color-primary-container)' }}>
          <span className="material-symbols-rounded text-4xl" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>
            {isAndroid ? 'model_training' : 'download'}
          </span>
        </div>

        <div className="text-center">
          <h2 className="font-bold text-xl" style={{ color: 'var(--color-on-background)' }}>{activeModelName}</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>
            {isAndroid ? 'Loading model into GPU memory...' : loadText || 'Downloading...'}
          </p>
        </div>

        <div className="w-full max-w-xs">
          <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--color-on-surface-variant)' }}>
            <span className="truncate pr-2" style={{ maxWidth: '80%' }}>
              {isAndroid ? 'Initializing LiteRT-LM engine' : (loadText || 'Initializing...')}
            </span>
            {!isAndroid && <span className="shrink-0 font-bold" style={{ color: 'var(--color-primary)' }}>{loadProgress}%</span>}
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-container-high)' }}>
            {isAndroid ? (
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'var(--color-primary)' }}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            ) : (
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'var(--color-primary)', width: `${loadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>
        </div>

        <button
          onClick={() => { abortRef.current = true; setPhase('select'); }}
          className="text-sm px-4 py-2 rounded-xl transition-all active:scale-95"
          style={{ color: 'var(--color-error)', background: 'var(--color-error-container)' }}
        >
          Cancel
        </button>
      </div>
    );
  }

  // ── Chat phase ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-background)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 border-b px-3 py-2.5 flex items-center gap-2" style={{ background: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
        <button onClick={onBack} className="p-1.5 -ml-1 rounded-lg active:scale-95 transition-transform" style={{ color: 'var(--color-primary)' }}>
          <span className="material-symbols-rounded text-base">arrow_back</span>
        </button>

        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-primary-container)' }}>
          <span className="material-symbols-rounded text-sm" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>
            {isAndroid ? 'model_training' : 'memory'}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-on-background)' }}>{activeModelName}</p>
          <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
            {isAndroid ? 'LiteRT-LM · on-device' : 'WebLLM · on-device'}
          </p>
        </div>

        <button
          onClick={handleNewChat}
          className="p-1.5 rounded-lg active:scale-95 transition-transform"
          title="New chat"
          style={{ color: 'var(--color-on-surface-variant)' }}
        >
          <span className="material-symbols-rounded text-base">add_comment</span>
        </button>

        <button
          onClick={() => { setPhase('select'); setMessages([]); }}
          className="text-xs px-3 py-1.5 rounded-lg transition-all active:scale-95"
          style={{ background: 'var(--color-surface-container)', color: 'var(--color-on-surface-variant)' }}
        >
          Switch
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-[140px]">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-48 gap-3"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'var(--color-primary-container)' }}>
              <span className="material-symbols-rounded text-3xl" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>
                {isAndroid ? 'model_training' : 'memory'}
              </span>
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>Ask me anything</p>
          </motion.div>
        )}

        {messages.map((msg, i) => (
          <AnimatePresence key={i}>
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div style={{ maxWidth: '85%' }}>
                {msg.role === 'assistant' && msg.thinking && (
                  <button
                    onClick={() => setExpandedThinking(expandedThinking === i ? null : i)}
                    className="flex items-center gap-1.5 text-xs mb-1.5 px-3 py-1.5 rounded-lg w-full text-left transition-all"
                    style={{ background: 'var(--color-surface-container)', color: 'var(--color-on-surface-variant)' }}
                  >
                    <span className="material-symbols-rounded text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>cognition</span>
                    <span className="flex-1">Thinking</span>
                    <span className="material-symbols-rounded text-sm">{expandedThinking === i ? 'expand_less' : 'expand_more'}</span>
                  </button>
                )}
                {expandedThinking === i && msg.thinking && (
                  <div className="text-xs mb-2 px-3 py-2 rounded-lg italic" style={{ background: 'var(--color-surface-container)', color: 'var(--color-on-surface-variant)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {msg.thinking}
                  </div>
                )}

                <div
                  className="px-4 py-3 rounded-2xl text-sm"
                  style={{
                    background: msg.role === 'user' ? 'var(--color-primary)' : 'var(--color-surface-container)',
                    color: msg.role === 'user' ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.content || (msg.role === 'assistant' && isGenerating && i === messages.length - 1 ? (
                    <span className="flex gap-1">
                      {[0, 1, 2].map(d => (
                        <motion.span
                          key={d}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, delay: d * 0.2, repeat: Infinity }}
                          className="w-1.5 h-1.5 rounded-full inline-block"
                          style={{ background: 'var(--color-on-surface-variant)' }}
                        />
                      ))}
                    </span>
                  ) : msg.content)}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 px-3 py-3 border-t" style={{ background: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
        <div className="flex gap-2 items-end max-w-2xl mx-auto">
          <div className="flex-1 flex items-end rounded-2xl border px-3 py-2" style={{ background: 'var(--color-surface-container)', borderColor: 'var(--color-border)' }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message..."
              rows={1}
              disabled={isGenerating}
              className="flex-1 bg-transparent resize-none outline-none text-sm"
              style={{ color: 'var(--color-on-surface)', maxHeight: '120px', fontFamily: 'inherit' }}
              onInput={e => {
                const t = e.currentTarget;
                t.style.height = 'auto';
                t.style.height = Math.min(t.scrollHeight, 120) + 'px';
              }}
            />
          </div>

          {isGenerating ? (
            <button
              onClick={stopGeneration}
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 active:scale-95 transition-all"
              style={{ background: 'var(--color-error)', color: 'var(--color-on-error)' }}
            >
              <span className="material-symbols-rounded text-base" style={{ fontVariationSettings: "'FILL' 1" }}>stop</span>
            </button>
          ) : (
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 active:scale-95 transition-all disabled:opacity-40"
              style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
            >
              <span className="material-symbols-rounded text-base" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
            </button>
          )}
        </div>
        <p className="text-center text-[10px] mt-1.5" style={{ color: 'var(--color-on-surface-variant)' }}>
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
