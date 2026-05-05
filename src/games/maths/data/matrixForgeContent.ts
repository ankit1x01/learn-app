import type { MatrixForgeConfig } from '@/games/types'

export const matrixForgeContent: MatrixForgeConfig = {
  type: 'matrix-forge',
  theme: 'forge',
  subject: 'mathematics',
  items: [
    {
      id: 'matrix-add-1',
      skillId: 'matrix_addition_2x2',
      operation: 'add',
      matrixA: [
        [1, 2],
        [3, 4],
      ],
      matrixB: [
        [5, 6],
        [7, 8],
      ],
      expectedResult: [
        [6, 8],
        [10, 12],
      ],
      timeLimit: 30,
      cellsToFill: 4,
    },
    {
      id: 'matrix-mul-2x2',
      skillId: 'matrix_multiplication_2x2',
      operation: 'multiply',
      matrixA: [
        [1, 2],
        [3, 4],
      ],
      matrixB: [
        [2, 0],
        [1, 2],
      ],
      expectedResult: [
        [4, 4],
        [10, 8],
      ],
      timeLimit: 45,
      cellsToFill: 4,
    },
    {
      id: 'matrix-transpose-3x2',
      skillId: 'matrix_transpose_3x2',
      operation: 'transpose',
      matrixA: [
        [1, 2, 3],
        [4, 5, 6],
      ],
      expectedResult: [
        [1, 4],
        [2, 5],
        [3, 6],
      ],
      timeLimit: 25,
      cellsToFill: 6,
    },
    {
      id: 'matrix-add-3x3',
      skillId: 'matrix_addition_3x3',
      operation: 'add',
      matrixA: [
        [1, 0, 2],
        [0, 3, 0],
        [2, 0, 1],
      ],
      matrixB: [
        [3, 2, 1],
        [1, 2, 3],
        [3, 2, 1],
      ],
      expectedResult: [
        [4, 2, 3],
        [1, 5, 3],
        [5, 2, 2],
      ],
      timeLimit: 40,
      cellsToFill: 9,
    },
    {
      id: 'matrix-scalar-multiply',
      skillId: 'matrix_scalar_multiplication',
      operation: 'multiply',
      matrixA: [
        [1, 2],
        [3, 4],
      ],
      expectedResult: [
        [2, 4],
        [6, 8],
      ],
      timeLimit: 20,
      cellsToFill: 4,
    },
  ],
}
