import type { ThreeDArchitectConfig } from '@/games/types'

export const threeDArchitectContent: ThreeDArchitectConfig = {
  type: '3d-architect',
  theme: 'building',
  subject: 'mathematics',
  items: [
    {
      id: '3d-architect-1',
      skillId: '3d_direction_cosines',
      problemType: 'direction-cosines',
      point: [1, 2, 2],
      expectedAnswer: '[1/3, 2/3, 2/3]',
      timeLimit: 45,
    },
    {
      id: '3d-architect-2',
      skillId: '3d_distance_point_plane',
      problemType: 'distance-point-plane',
      point: [1, 1, 1],
      plane: { a: 1, b: 2, c: 2, d: -3 },
      expectedAnswer: 0.33,
      timeLimit: 50,
    },
    {
      id: '3d-architect-3',
      skillId: '3d_angle_between_lines',
      problemType: 'angle-between-lines',
      line: {
        pointA: [0, 0, 0],
        pointB: [1, 0, 0],
      },
      expectedAnswer: '0',
      timeLimit: 50,
    },
    {
      id: '3d-architect-4',
      skillId: '3d_skew_line_distance',
      problemType: 'skew-lines',
      expectedAnswer: '1.41',
      timeLimit: 60,
    },
    {
      id: '3d-architect-5',
      skillId: '3d_distance_point_line',
      problemType: 'distance-point-plane',
      point: [0, 0, 0],
      plane: { a: 1, b: 1, c: 1, d: -3 },
      expectedAnswer: 1.73,
      timeLimit: 45,
    },
  ],
}
