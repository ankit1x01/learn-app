// src/games/components/memory/SequencingGame.tsx
import React, { useState, useEffect } from "react";
import { motion, Reorder, AnimatePresence } from "motion/react";
import { MemorySequencingConfig } from "../../types";
import { m3SpatialDefault } from "../../../lib/m3-motion";
import { GlobeScene } from "./GlobeScene";
import { speak, stopTTS, getTTSPlatform } from "../../../lib/audio/native-tts";
import { WordHighlighter } from "./WordHighlighter";
import { VisualizationModeSelector } from "./VisualizationModeSelector";
import type { VisualMode } from "./GlobeScene";

export function SequencingGame({ config }: { config: MemorySequencingConfig }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasFinishedAudio, setHasFinishedAudio] = useState(false);
  const [items, setItems] = useState<typeof config.events>([]);
  const [showResults, setShowResults] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [globePhase, setGlobePhase] = useState<0 | 1 | 2 | 3 | 4>(0);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isTTSMode] = useState(!config.audioUrl);
  const [audioEnergy, setAudioEnergy] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const passageText = `When we talk of globalisation we often refer to an economic system that has emerged since the last 50 years or so. But as you will see in this chapter, the making of the global world has a long history. It is a history of trade, of migration, of people in search of work, the movement of capital, and much else. As we think about the dramatic and visible signs of global interconnectedness in our lives today, we need to understand the phases through which this world in which we live has emerged.`;
  const passageWords = passageText.split(/\s+/);

  useEffect(() => {
    let itemsToUse = config.events;

    // If no events provided and in TTS mode, use default globalisation passage items
    if ((!itemsToUse || itemsToUse.length === 0) && isTTSMode) {
      itemsToUse = [
        {
          id: "1",
          label:
            'When we talk of "globalisation" we often refer to an economic system that has emerged since the last 50 years or so.',
          order: 1,
        },
        {
          id: "2",
          label:
            "But the making of the global world has a long history – of trade, migration, and people in search of work.",
          order: 2,
        },
        {
          id: "3",
          label:
            "This includes the movement of capital and much else throughout history.",
          order: 3,
        },
        {
          id: "4",
          label:
            "As we think about the dramatic signs of global interconnectedness today, we need to understand the phases through which this world has emerged.",
          order: 4,
        },
      ];
    }

    if (!itemsToUse || itemsToUse.length === 0) return;

    // Fisher-Yates shuffle for uniform randomization
    const shuffled = [...itemsToUse];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setItems(shuffled);
  }, [config.events, isTTSMode]);

  // Autoplay audio on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      handleStartAudio();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Cleanup: stop all audio when component unmounts
  useEffect(() => {
    return () => {
      stopTTS().catch(err => console.error('[TTS] Cleanup error:', err));
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setHasFinishedAudio(true);
  };

  const handleReplayAudio = async () => {
    // Stop all audio sources first
    await stopTTS().catch(err => console.error('[TTS] Stop error:', err));
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setTimeout(() => {
      if (isTTSMode) {
        handleStartAudio();
      } else if (audioRef.current) {
        audioRef.current
          .play()
          .catch((err) => console.error("Audio play failed:", err));
        setIsPlaying(true);
      }
    }, 100);
  };

  const handleStartAudio = async () => {
    setIsPlaying(true);
    setGlobePhase(0);
    setCurrentWordIndex(0);

    // Stop any existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    await stopTTS().catch(err => console.error('[TTS] Stop error:', err));

    if (isTTSMode) {
      const passageText = `When we talk of globalisation we often refer to an economic system that has emerged since the last 50 years or so. But as you will see in this chapter, the making of the global world has a long history. It is a history of trade, of migration, of people in search of work, the movement of capital, and much else. As we think about the dramatic and visible signs of global interconnectedness in our lives today, we need to understand the phases through which this world in which we live has emerged.`;

      try {
        console.log(`[TTS] Using platform: ${getTTSPlatform()}`);

        await speak(
          passageText,
          {
            rate: 0.85,
            pitch: 1,
            volume: 1,
            lang: "en-US",
          },
          {
            onBoundary: (event) => {
              const pct = event.charIndex / event.totalChars;
              setAudioEnergy(Math.random() * 0.8 + 0.2); // simulate speech peaks

              if (pct > 0.15) setGlobePhase(1);
              if (pct > 0.4) setGlobePhase(2);
              if (pct > 0.65) setGlobePhase(3);
              if (pct > 0.85) setGlobePhase(4);

              // Calculate current word index based on character position
              let charCount = 0;
              for (let i = 0; i < passageWords.length; i++) {
                charCount += passageWords[i].length + 1; // +1 for space
                if (charCount >= event.charIndex) {
                  setCurrentWordIndex(i);
                  break;
                }
              }
            },
            onEnd: () => {
              console.log("[TTS] Speech ended");
              setIsPlaying(false);
              setHasFinishedAudio(true);
              setGlobePhase(4);
              setCurrentWordIndex(passageWords.length - 1);
            },
            onError: (error) => {
              console.error("[TTS] Error:", error);
              setIsPlaying(false);
            },
          }
        );
      } catch (err) {
        console.error("[TTS] Setup error:", err);
        setIsPlaying(false);
      }
    } else if (audioRef.current) {
      audioRef.current
        .play()
        .catch((err) => console.error("Audio play failed:", err));
    }
  };

  const validateSequence = () => {
    const correct = items.every((item, index) => item.order === index + 1);
    setIsCorrect(correct);
    setShowResults(true);

    if (correct) {
      speakText("Perfect! You have arranged the sequence correctly");
    } else {
      const incorrectCount = items.filter(
        (item, index) => item.order !== index + 1,
      ).length;
      speakText(
        `${incorrectCount} item${incorrectCount !== 1 ? "s" : ""} in incorrect position. Try again.`,
      );
    }
  };

  const handleRetry = () => {
    setHasFinishedAudio(false);
    setShowResults(false);
    setIsCorrect(false);
    // Re-shuffle on retry
    const shuffled = [...config.events];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setItems(shuffled);
  };

  const speakText = async (text: string) => {
    try {
      await speak(
        text,
        {
          rate: 0.85,
          pitch: 1,
          volume: 1,
          lang: "en-US",
        },
        {
          onError: (error) => {
            console.error("[TTS] Error during speak:", error);
          },
        }
      );
    } catch (err) {
      console.error("[TTS] Error:", err);
    }
  };

  const announceItemPosition = (
    item: (typeof config.events)[0],
    index: number,
  ) => {
    const isCorrect = item.order === index + 1;
    if (isCorrect) {
      speakText(`${item.label} is in the correct position`);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-surface">
      {/* Game Content - Bottom */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!hasFinishedAudio ? (
            <motion.div
              key="listening"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center w-full gap-0"
              style={{ maxWidth: "600px" }}
            >
              <div className="w-full h-64 shrink-0">
                <GlobeScene
                  phase={globePhase}
                  isNarrating={isPlaying}
                  audioEnergy={audioEnergy}
                />
              </div>

              <WordHighlighter
                text={passageText}
                currentWordIndex={currentWordIndex}
                isPlaying={isPlaying}
              />
            </motion.div>
          ) : !showResults ? (
            <motion.div
              key="ordering"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-xl flex flex-col gap-8"
            >
              <div className="flex flex-col gap-4 w-full">
                <div className="text-headline-small text-center">
                  Place in Correct Order
                </div>
                <button
                  className="btn-tonal self-center"
                  onClick={() => {
                    const allLabels = items
                      .map((item) => item.label)
                      .join(", ");
                    speakText(`Items to order: ${allLabels}`).catch(err =>
                      console.error("[TTS] Speak items error:", err)
                    );
                  }}
                >
                  <span className="material-symbols-rounded">volume_up</span>
                  Speak Items
                </button>
              </div>

              <Reorder.Group
                axis="y"
                values={items}
                onReorder={setItems}
                className="flex flex-col gap-3"
              >
                {items.map((item, index) => {
                  const isInCorrectPosition = item.order === index + 1;
                  return (
                    <Reorder.Item
                      key={item.id}
                      value={item}
                      className={`card-elevated p-5 flex items-center gap-4 cursor-grab active:cursor-grabbing rounded-2xl border transition-colors ${
                        isInCorrectPosition
                          ? "border-success-container bg-success-container/20"
                          : "border-outline-variant bg-surface-container-low"
                      }`}
                      style={{ boxShadow: "var(--shadow-elevation-1)" }}
                      whileDrag={{
                        scale: 1.05,
                        boxShadow: "var(--shadow-elevation-3)",
                      }}
                    >
                      <span className="material-symbols-rounded text-outline">
                        drag_indicator
                      </span>
                      <div className="flex-grow text-body-large font-medium">
                        {item.label}
                      </div>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          isInCorrectPosition
                            ? "bg-success-container text-on-success-container"
                            : "bg-secondary-container text-on-secondary-container"
                        }`}
                      >
                        {index + 1}
                      </div>
                      {isInCorrectPosition && (
                        <span className="material-symbols-rounded text-success text-sm">
                          check_circle
                        </span>
                      )}
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>

              <button
                className="btn-primary-full mt-4"
                onClick={validateSequence}
              >
                Validate Sequence
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-8 text-center"
            >
              <div
                className={`text-display-small font-bold ${isCorrect ? "text-success" : "text-error"}`}
              >
                {isCorrect ? "Perfect Sequence!" : "Sequence Incorrect"}
              </div>

              <div className="flex flex-col gap-2 w-full max-w-md">
                {items.map((item, index) => {
                  const itemIsCorrect = item.order === index + 1;
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border ${itemIsCorrect ? "border-success-container bg-success-container/30" : "border-error-container bg-error-container/30"}`}
                    >
                      <span
                        className={`material-symbols-rounded ${itemIsCorrect ? "text-success" : "text-error"}`}
                      >
                        {itemIsCorrect ? "check_circle" : "cancel"}
                      </span>
                      <div className="flex-grow text-left text-sm font-medium">
                        {item.label}
                      </div>
                      <div className="text-xs opacity-60">
                        Should be #{item.order}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button className="btn-tonal mt-4" onClick={handleRetry}>
                <span className="material-symbols-rounded">restart_alt</span>
                Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
