/**
 * Timeline Demo — Test bed for Action System + Playback Engine
 * Demonstrates unified action orchestration without full game complexity
 */

import React, { useRef, useState, useEffect } from 'react';
import { ActionEngine } from '@/lib/action-engine';
import { PlaybackEngine, type GameScene } from '@/lib/playback/engine';
import { computeGamePlaybackView } from '@/lib/playback/derived-state';
import type { EngineMode } from '@/lib/playback/types';

// Sample timeline configuration with actions
const DEMO_SCENES: GameScene[] = [
  {
    id: 'scene-1',
    actions: [
      {
        id: 'spotlight-1',
        type: 'spotlight',
        elementId: 'demo-element',
        dimOpacity: 0.6,
      },
      {
        id: 'speech-1',
        type: 'speech',
        text: 'Welcome to the Timeline Demo. This demonstrates the Action System and Playback Engine working together to orchestrate a sequence of events.',
      },
      {
        id: 'feedback-1',
        type: 'feedback',
        message: 'Great! You are now experiencing timeline orchestration.',
        type_: 'success',
        duration: 3000,
      },
      {
        id: 'laser-1',
        type: 'laser',
        elementId: 'demo-element-2',
        color: '#FF6B6B',
      },
      {
        id: 'speech-2',
        type: 'speech',
        text: 'Actions are executed sequentially. Each action can be fire-and-forget (spotlight, laser, feedback) or synchronous (speech, whiteboard, checkpoints).',
      },
    ],
  },
];

export function TimelineDemo({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<EngineMode>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [currentScene, setCurrentScene] = useState('');
  const engineRef = useRef<PlaybackEngine | null>(null);
  const actionEngineRef = useRef<ActionEngine | null>(null);

  // Initialize engines
  useEffect(() => {
    const actionEngine = new ActionEngine();
    actionEngineRef.current = actionEngine;

    const playbackEngine = new PlaybackEngine(DEMO_SCENES, actionEngine, {
      onModeChange: (newMode) => {
        setMode(newMode);
        addLog(`Mode: ${newMode}`);
      },
      onSceneChange: (sceneId) => {
        setCurrentScene(sceneId);
        addLog(`Scene: ${sceneId}`);
      },
      onSpeechStart: (text) => {
        addLog(`🔊 Speech: "${text.substring(0, 50)}..."`);
      },
      onSpeechEnd: () => {
        addLog(`Speech complete`);
      },
      onProgress: (snapshot) => {
        addLog(`Progress: Scene ${snapshot.sceneIndex}, Action ${snapshot.actionIndex}`);
      },
      onComplete: () => {
        addLog(`✅ Timeline complete!`);
      },
    });

    engineRef.current = playbackEngine;

    return () => {
      playbackEngine.stop();
      actionEngine.dispose();
    };
  }, []);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const handleStart = () => {
    if (engineRef.current && mode === 'idle') {
      addLog('▶️ Starting playback...');
      engineRef.current.start();
    }
  };

  const handlePause = () => {
    if (engineRef.current && mode === 'playing') {
      addLog('⏸️ Pausing playback');
      engineRef.current.pause();
    }
  };

  const handleResume = () => {
    if (engineRef.current && mode === 'paused') {
      addLog('▶️ Resuming playback');
      engineRef.current.resume();
    }
  };

  const handleStop = () => {
    if (engineRef.current) {
      addLog('⏹️ Stopping playback');
      engineRef.current.stop();
    }
  };

  const handleClear = () => {
    setLogs([]);
  };

  const view = computeGamePlaybackView(mode);

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto" style={{ background: '#F5F0E8' }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 border-b border-[#E3DDD5] bg-white"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)', paddingBottom: '12px' }}
      >
        <button
          onClick={onBack}
          className="w-12 h-12 flex items-center justify-center rounded-xl active:scale-95 transition-transform"
          style={{ background: 'var(--color-surface-container)', cursor: 'pointer' }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: 24, color: '#292524' }}>
            chevron_left
          </span>
        </button>
        <div className="flex-1">
          <p className="text-[17px] font-black text-[var(--color-on-surface)]" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>
            Timeline Demo
          </p>
          <p className="text-[12px] text-[var(--color-on-surface-variant)]" style={{ fontFamily: 'Inter, system-ui' }}>
            Action System + Playback Engine Test
          </p>
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          padding: '16px',
          background: 'white',
          borderBottom: '1px solid #E3DDD5',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={handleStart}
          disabled={mode !== 'idle'}
          style={{
            padding: '8px 16px',
            backgroundColor: mode === 'idle' ? '#6750a4' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: mode === 'idle' ? 'pointer' : 'not-allowed',
            fontWeight: 'bold',
          }}
        >
          ▶️ Start
        </button>

        <button
          onClick={handlePause}
          disabled={mode !== 'playing'}
          style={{
            padding: '8px 16px',
            backgroundColor: mode === 'playing' ? '#FF9800' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: mode === 'playing' ? 'pointer' : 'not-allowed',
            fontWeight: 'bold',
          }}
        >
          ⏸️ Pause
        </button>

        <button
          onClick={handleResume}
          disabled={mode !== 'paused'}
          style={{
            padding: '8px 16px',
            backgroundColor: mode === 'paused' ? '#4CAF50' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: mode === 'paused' ? 'pointer' : 'not-allowed',
            fontWeight: 'bold',
          }}
        >
          ▶️ Resume
        </button>

        <button
          onClick={handleStop}
          disabled={mode === 'idle'}
          style={{
            padding: '8px 16px',
            backgroundColor: mode !== 'idle' ? '#F44336' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: mode !== 'idle' ? 'pointer' : 'not-allowed',
            fontWeight: 'bold',
          }}
        >
          ⏹️ Stop
        </button>

        <button
          onClick={handleClear}
          style={{
            padding: '8px 16px',
            backgroundColor: '#9E9E9E',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginLeft: 'auto',
          }}
        >
          Clear Logs
        </button>
      </div>

      {/* Status */}
      <div
        style={{
          padding: '12px 16px',
          background: '#fff9c4',
          fontSize: '14px',
          fontFamily: 'monospace',
          borderBottom: '1px solid #E3DDD5',
        }}
      >
        <strong>Mode:</strong> {mode} | <strong>Scene:</strong> {currentScene || 'None'} | <strong>Playing:</strong> {view.isPlaying ? '✓' : '✗'}
      </div>

      {/* Demo Element (for spotlight/laser visualization) */}
      <div
        id="demo-element"
        style={{
          margin: '16px',
          padding: '24px',
          background: '#E8F5E9',
          borderRadius: '8px',
          textAlign: 'center',
          border: '2px solid #4CAF50',
          minHeight: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Demo Element</p>
      </div>

      <div
        id="demo-element-2"
        style={{
          margin: '0 16px 16px 16px',
          padding: '24px',
          background: '#FFE0B2',
          borderRadius: '8px',
          textAlign: 'center',
          border: '2px solid #FF9800',
          minHeight: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>Laser Target</p>
      </div>

      {/* Logs */}
      <div
        style={{
          flex: 1,
          padding: '12px',
          background: '#f5f5f5',
          borderTop: '1px solid #E3DDD5',
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '12px',
          lineHeight: '1.4',
        }}
      >
        {logs.length === 0 ? (
          <p style={{ color: '#999', margin: 0 }}>Click "Start" to begin the demo...</p>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} style={{ marginBottom: '4px', color: '#333' }}>
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
