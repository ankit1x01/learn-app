export type MathSimulationType =
  // Calculus
  | 'function_grapher' | 'area_under_curve' | 'tangent_normal'
  | 'maxima_minima' | 'differential_equation'
  // Coordinate Geometry
  | 'conic_circle' | 'conic_parabola' | 'conic_ellipse' | 'conic_hyperbola'
  | 'straight_lines'
  // Vectors
  | 'vector_2d' | 'vector_cross_product'
  // Trigonometry
  | 'unit_circle' | 'sine_wave' | 'triangle_solver'
  // Complex Numbers
  | 'argand_plane' | 'roots_of_unity'
  // Matrices
  | 'matrix_transform_2d'
  // Probability & Statistics
  | 'probability_tree' | 'normal_distribution'

export interface MathSimulationPlugin {
  engine: 'canvas' | 'stub'
  conceptId: string
  label: string
  icon: string
  category: string
}
