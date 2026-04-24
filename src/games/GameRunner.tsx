// src/games/GameRunner.tsx
import { GameConfig } from './types'
import { ThisOrThat } from './components/ThisOrThat'
import { Chrono } from './components/Chrono'
import { Links } from './components/Links'
import { Knockout } from './components/Knockout'
import { BalloonTapGame } from './components/BalloonTapGame'
import { RetentionGame } from './components/RetentionGame'
import { AudioLectureGame } from './components/AudioLectureGame'
import { BubbleMatchGame } from './components/BubbleMatchGame'

import { NameRecallGame } from './components/memory/NameRecallGame'
import { RetentionGame as MemoryRetentionGame } from './components/memory/RetentionGame'
import { SequencingGame } from './components/memory/SequencingGame'
import { SynthesisGame } from './components/memory/SynthesisGame'

interface Props {
  config: GameConfig
}

export function GameRunner({ config }: Props) {
  switch (config.type) {
    case 'this-or-that': return <ThisOrThat config={config} />
    case 'chrono':       return <Chrono config={config} />
    case 'links':        return <Links config={config} />
    case 'knockout':     return <Knockout config={config} />
    case 'balloon-tap':    return <BalloonTapGame   config={config} />
    case 'retention':      return <RetentionGame    config={config} />
    case 'audio-lecture':  return <AudioLectureGame config={config} />
    case 'bubble-match':   return <BubbleMatchGame  config={config} />

    case 'memory-name-recall': return <NameRecallGame config={config} />
    case 'memory-retention':   return <MemoryRetentionGame config={config} />
    case 'memory-sequencing':  return <SequencingGame config={config} />
    case 'memory-synthesis':   return <SynthesisGame config={config} />
  }
}
