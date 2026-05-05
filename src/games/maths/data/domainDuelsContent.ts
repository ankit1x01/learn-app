import type { DomainDuelsConfig } from '@/games/types'

export const domainDuelsContent: DomainDuelsConfig = {
  type: 'domain-duels',
  theme: 'duel',
  subject: 'mathematics',
  items: [
    {
      id: 'domain-duels-1',
      skillId: 'relation_injective_basic',
      diagram: {
        setA: ['1', '2', '3'],
        setB: ['a', 'b', 'c'],
        mappings: [
          ['1', 'a'],
          ['2', 'b'],
          ['3', 'c'],
        ],
      },
      correctAnswer: 'bijective',
      timeLimit: 20,
    },
    {
      id: 'domain-duels-2',
      skillId: 'relation_surjective_check',
      diagram: {
        setA: ['1', '2', '3', '4'],
        setB: ['x', 'y'],
        mappings: [
          ['1', 'x'],
          ['2', 'y'],
          ['3', 'x'],
          ['4', 'y'],
        ],
      },
      correctAnswer: 'surjective',
      timeLimit: 20,
    },
    {
      id: 'domain-duels-3',
      skillId: 'relation_injective_fail',
      diagram: {
        setA: ['a', 'b', 'c'],
        setB: ['p', 'q'],
        mappings: [
          ['a', 'p'],
          ['b', 'p'],
          ['c', 'q'],
        ],
      },
      correctAnswer: 'neither',
      timeLimit: 20,
    },
    {
      id: 'domain-duels-4',
      skillId: 'relation_function_check',
      diagram: {
        setA: ['1', '2', '3'],
        setB: ['x', 'y', 'z'],
        mappings: [
          ['1', 'x'],
          ['1', 'y'],
          ['2', 'z'],
          ['3', 'x'],
        ],
      },
      correctAnswer: 'neither',
      timeLimit: 20,
    },
    {
      id: 'domain-duels-5',
      skillId: 'relation_injective_only',
      diagram: {
        setA: ['α', 'β', 'γ'],
        setB: ['1', '2', '3', '4'],
        mappings: [
          ['α', '1'],
          ['β', '2'],
          ['γ', '4'],
        ],
      },
      correctAnswer: 'injective',
      timeLimit: 20,
    },
  ],
  totalWaves: 5,
  bossWaveInterval: 3,
}
