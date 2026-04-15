// src/games/components/GameWinScreen.tsx
import { Trophy, RotateCcw, Share2 } from 'lucide-react'
import { Share } from '@capacitor/share'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { GameResult } from '../types'

interface Props {
  result: GameResult
  onPlayAgain: () => void
}

export function GameWinScreen({ result, onPlayAgain }: Props) {
  const handleShare = async () => {
    Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
    await Share.share({
      title: 'CHITTA Exam Challenge',
      text: `I just scored ${result.score}/100 in the ${result.gameType} exam minigame with only ${result.guesses} guesses! Can you beat my score??`,
      url: 'https://chitta.app/',
      dialogTitle: 'Share your High Score',
    }).catch(() => {});
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-10 gap-6">
      <div className="flex w-full justify-end">
        <button onClick={handleShare} className="p-3 bg-[#F0FDF4] text-[#15803D] rounded-full active:scale-95 transition-transform" aria-label="Share Score">
          <Share2 size={24} />
        </button>
      </div>

      <div className="w-16 h-16 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center">
        <Trophy size={28} className="text-[#15803D]" />
      </div>

      <div className="text-center">
        <p className="text-xs font-semibold text-[#15803D] uppercase tracking-wide mb-1">That's right!</p>
        <p className="text-xl font-bold text-[#1C1917]" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>
          You got it
        </p>
      </div>

      <div className="w-full bg-white border border-[#E8E5DF] rounded-2xl p-5 flex justify-around">
        <Stat label="Score" value={`${result.score}`} unit="/ 100" />
        <div className="w-px bg-[#E8E5DF]" />
        <Stat label="Guesses" value={`${result.guesses}`} />
        <div className="w-px bg-[#E8E5DF]" />
        <Stat label="Hints" value={`${result.hintsUsed}`} />
      </div>

      <button
        onClick={onPlayAgain}
        className="w-full flex items-center justify-center gap-2 bg-[#2563EB] text-white rounded-xl py-4 font-bold text-[15px]"
        style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}
      >
        <RotateCcw size={16} />
        Play again
      </button>
    </div>
  )
}

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-[#1C1917]" style={{ fontFamily: 'Inter, system-ui' }}>
        {value}
        {unit && <span className="text-sm font-normal text-[#A8A29E] ml-0.5">{unit}</span>}
      </div>
      <div className="text-xs font-medium text-[#78716C] mt-0.5" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>
        {label}
      </div>
    </div>
  )
}
