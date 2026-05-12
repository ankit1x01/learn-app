import React from "react";
import type { VisualMode } from "./GlobeScene";

interface VisualizationModeSelectorProps {
  currentMode: VisualMode;
  onModeChange: (mode: VisualMode) => void;
  disabled?: boolean;
}

const modes: Array<{ id: VisualMode; label: string; icon: string; description: string }> = [
  {
    id: "wave",
    label: "Waves",
    icon: "waves",
    description: "Classic sine wave animation",
  },
  {
    id: "spectrum",
    label: "Spectrum",
    icon: "equalizer",
    description: "Frequency spectrum analyzer",
  },
  {
    id: "particles",
    label: "Particles",
    icon: "blur_on",
    description: "Particle system with gravity",
  },
  {
    id: "wordHighlight",
    label: "Word Highlight",
    icon: "format_color_highlight",
    description: "Highlight each spoken word",
  },
];

export function VisualizationModeSelector({
  currentMode,
  onModeChange,
  disabled = false,
}: VisualizationModeSelectorProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          disabled={disabled}
          title={mode.description}
          className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
            currentMode === mode.id
              ? "bg-primary text-on-primary shadow-md"
              : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <span className="material-symbols-rounded text-sm">{mode.icon}</span>
          <span className="text-label-medium font-medium">{mode.label}</span>
        </button>
      ))}
    </div>
  );
}
