import type { PrincipalValleyConfig } from '@/games/types'

export const principalValleyContent: PrincipalValleyConfig = {
  type: 'principal-valley',
  theme: 'landscape',
  subject: 'mathematics',
  items: [
    {
      id: 'principal-valley-1',
      skillId: 'inverse_trig_sin_principal',
      expression: '\\sin^{-1}\\left(\\frac{1}{2}\\right)',
      correctZone: 'sin-inv',
      correctAngle: Math.PI / 6,
      timeLimit: 30,
    },
    {
      id: 'principal-valley-2',
      skillId: 'inverse_trig_cos_principal',
      expression: '\\cos^{-1}\\left(-\\frac{1}{2}\\right)',
      correctZone: 'cos-inv',
      correctAngle: (2 * Math.PI) / 3,
      timeLimit: 30,
    },
    {
      id: 'principal-valley-3',
      skillId: 'inverse_trig_tan_principal',
      expression: '\\tan^{-1}(1)',
      correctZone: 'tan-inv',
      correctAngle: Math.PI / 4,
      timeLimit: 30,
    },
    {
      id: 'principal-valley-4',
      skillId: 'inverse_trig_sin_negative',
      expression: '\\sin^{-1}\\left(-\\frac{\\sqrt{3}}{2}\\right)',
      correctZone: 'sin-inv',
      correctAngle: -Math.PI / 3,
      timeLimit: 30,
    },
    {
      id: 'principal-valley-5',
      skillId: 'inverse_trig_cos_zero',
      expression: '\\cos^{-1}(0)',
      correctZone: 'cos-inv',
      correctAngle: Math.PI / 2,
      timeLimit: 30,
    },
    {
      id: 'principal-valley-6',
      skillId: 'inverse_trig_tan_negative',
      expression: '\\tan^{-1}(-\\sqrt{3})',
      correctZone: 'tan-inv',
      correctAngle: -Math.PI / 3,
      timeLimit: 30,
    },
  ],
}
