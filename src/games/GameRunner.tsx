// src/games/GameRunner.tsx
import { GameConfig } from './types'
import { ThisOrThat } from './components/ThisOrThat'
import { Chrono } from './components/Chrono'
import { Links } from './components/Links'
import { Knockout } from './components/Knockout'
import { BalloonTapGame } from './components/BalloonTapGame'
import { RetentionGame } from './components/RetentionGame'
import { AudioLectureGame } from './components/AudioLectureGame'
import { AttentionGame } from './components/memory/AttentionGame'
import { NameRecallGame } from './components/memory/NameRecallGame'
import { RetentionGame as MemoryRetentionGame } from './components/memory/RetentionGame'
import { SequencingGame } from './components/memory/SequencingGame'
import { SynthesisGame } from './components/memory/SynthesisGame'
import { VisualizationGame } from './components/memory/VisualizationGame'
import { TeachBackGame } from './components/memory/TeachBackGame'
import { InversionGame } from './components/memory/InversionGame'

interface Props {
  config: GameConfig
  onBack?: () => void
}

export function GameRunner({ config, onBack }: Props) {
  switch (config.type) {
    case 'this-or-that': return <ThisOrThat config={config} />
    case 'chrono':       return <Chrono config={config} />
    case 'links':        return <Links config={config} />
    case 'knockout':     return <Knockout config={config} />
    case 'balloon-tap':    return <BalloonTapGame   config={config} />
    case 'retention':      return <RetentionGame    config={config} />
    case 'audio-lecture':  return <AudioLectureGame config={config} />
    case 'bubble-match':   return <AttentionGame config={config} onBack={onBack} />

    case 'memory-attention':   return <AttentionGame config={config} onBack={onBack} />
    case 'memory-name-recall': return <NameRecallGame config={config} />
    case 'memory-retention':   return <MemoryRetentionGame config={config} />
    case 'memory-sequencing':  return <SequencingGame config={config} />
    case 'memory-synthesis':   return <SynthesisGame config={config} />
    case 'memory-visualization': return <VisualizationGame config={config} />
    case 'memory-teach-back': return <TeachBackGame config={config} />
    case 'memory-inversion': return <InversionGame config={config} />
  }
}
