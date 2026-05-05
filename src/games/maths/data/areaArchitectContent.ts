import type { AreaArchitectConfig } from '@/games/types'

export const areaArchitectContent: AreaArchitectConfig = {
  type: 'area-architect',
  theme: 'drafting',
  subject: 'mathematics',
  items: [
    {
      id: 'area-architect-1',
      skillId: 'area_under_curve_simple',
      curves: [
        { equation: 'y = x', label: 'Line' },
        { equation: 'y = 0', label: 'x-axis' },
      ],
      integrationVariable: 'x',
      bounds: [0, 2],
      expectedArea: 2,
      timeLimit: 60,
    },
    {
      id: 'area-architect-2',
      skillId: 'area_between_curves',
      curves: [
        { equation: 'y = x^2', label: 'Parabola' },
        { equation: 'y = x', label: 'Line' },
      ],
      integrationVariable: 'x',
      bounds: [0, 1],
      expectedArea: 1 / 6,
      timeLimit: 75,
    },
    {
      id: 'area-architect-3',
      skillId: 'area_under_parabola',
      curves: [
        { equation: 'y = 4 - x^2', label: 'Parabola' },
        { equation: 'y = 0', label: 'x-axis' },
      ],
      integrationVariable: 'x',
      bounds: [-2, 2],
      expectedArea: 32 / 3,
      timeLimit: 60,
    },
    {
      id: 'area-architect-4',
      skillId: 'area_between_exponential',
      curves: [
        { equation: 'y = e^x', label: 'Exponential' },
        { equation: 'y = 1', label: 'Horizontal line' },
      ],
      integrationVariable: 'x',
      bounds: [0, 1],
      expectedArea: Math.E - 2,
      timeLimit: 70,
    },
    {
      id: 'area-architect-5',
      skillId: 'area_symmetric_region',
      curves: [
        { equation: 'y = \\sin(x)', label: 'Sine' },
        { equation: 'y = 0', label: 'x-axis' },
      ],
      integrationVariable: 'x',
      bounds: [0, Math.PI],
      expectedArea: 2,
      timeLimit: 65,
    },
  ],
}
