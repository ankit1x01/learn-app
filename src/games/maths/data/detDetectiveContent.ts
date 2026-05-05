import type { DetDetectiveConfig } from '@/games/types'

export const detDetectiveContent: DetDetectiveConfig = {
  type: 'det-detective',
  theme: 'noir',
  subject: 'mathematics',
  items: [
    {
      id: 'det-detective-1',
      skillId: 'determinant_2x2_basic',
      matrix: [
        [2, 3],
        [1, 4],
      ],
      correctDeterminant: 5,
      timeLimit: 25,
      expansionMethod: 'ad-bc',
    },
    {
      id: 'det-detective-2',
      skillId: 'determinant_3x3_expansion',
      matrix: [
        [1, 0, 2],
        [0, 3, 0],
        [2, 0, 1],
      ],
      correctDeterminant: -9,
      shortcutHint: 'middle row has zeros',
      timeLimit: 45,
      expansionMethod: 'cofactor',
    },
    {
      id: 'det-detective-3',
      skillId: 'determinant_2x2_zero',
      matrix: [
        [2, 4],
        [1, 2],
      ],
      correctDeterminant: 0,
      shortcutHint: 'row 2 is row 1 / 2',
      timeLimit: 25,
      expansionMethod: 'ad-bc',
    },
    {
      id: 'det-detective-4',
      skillId: 'determinant_3x3_row_ops',
      matrix: [
        [1, 2, 3],
        [0, 1, 4],
        [0, 0, 2],
      ],
      correctDeterminant: 2,
      shortcutHint: 'upper triangular',
      timeLimit: 30,
      expansionMethod: 'ad-bc',
    },
    {
      id: 'det-detective-5',
      skillId: 'determinant_3x3_general',
      matrix: [
        [2, 1, 0],
        [1, 3, 1],
        [0, 1, 2],
      ],
      correctDeterminant: 9,
      timeLimit: 50,
      expansionMethod: 'cofactor',
    },
  ],
}
