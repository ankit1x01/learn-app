import { MathSimulationType, MathSimulationPlugin } from './types'

export const MATH_REGISTRY: Record<MathSimulationType, MathSimulationPlugin> = {
  // ── Calculus ──────────────────────────────────────────────────────────────
  function_grapher:       { engine: 'stub', conceptId: 'calculus_function_grapher',        label: 'Function Grapher',          icon: 'show_chart',        category: 'Calculus' },
  area_under_curve:       { engine: 'stub', conceptId: 'calculus_definite_integral',        label: 'Area Under Curve',          icon: 'area_chart',        category: 'Calculus' },
  tangent_normal:         { engine: 'stub', conceptId: 'calculus_tangent_normal',           label: 'Tangent & Normal',          icon: 'ssid_chart',        category: 'Calculus' },
  maxima_minima:          { engine: 'stub', conceptId: 'calculus_maxima_minima',            label: 'Maxima & Minima',           icon: 'trending_up',       category: 'Calculus' },
  differential_equation:  { engine: 'stub', conceptId: 'calculus_differential_equation',   label: 'Differential Equation',     icon: 'functions',         category: 'Calculus' },

  // ── Coordinate Geometry ───────────────────────────────────────────────────
  conic_circle:           { engine: 'stub', conceptId: 'conic_circle',                     label: 'Circle',                    icon: 'circle',            category: 'Coordinate Geometry' },
  conic_parabola:         { engine: 'stub', conceptId: 'conic_parabola',                   label: 'Parabola',                  icon: 'waterfall_chart',   category: 'Coordinate Geometry' },
  conic_ellipse:          { engine: 'stub', conceptId: 'conic_ellipse',                    label: 'Ellipse',                   icon: 'radio_button_unchecked', category: 'Coordinate Geometry' },
  conic_hyperbola:        { engine: 'stub', conceptId: 'conic_hyperbola',                  label: 'Hyperbola',                 icon: 'open_in_full',      category: 'Coordinate Geometry' },
  straight_lines:         { engine: 'stub', conceptId: 'coordinate_straight_lines',        label: 'Straight Lines',            icon: 'remove',            category: 'Coordinate Geometry' },

  // ── Vectors ───────────────────────────────────────────────────────────────
  vector_2d:              { engine: 'stub', conceptId: 'vectors_2d_operations',             label: 'Vector Operations (2D)',    icon: 'arrow_forward',     category: 'Vectors' },
  vector_cross_product:   { engine: 'stub', conceptId: 'vectors_cross_product',             label: 'Cross Product',             icon: 'close',             category: 'Vectors' },

  // ── Trigonometry ──────────────────────────────────────────────────────────
  unit_circle:            { engine: 'stub', conceptId: 'trig_unit_circle',                  label: 'Unit Circle',               icon: 'adjust',            category: 'Trigonometry' },
  sine_wave:              { engine: 'stub', conceptId: 'trig_sine_wave_parameters',         label: 'Sine Wave',                 icon: 'graphic_eq',        category: 'Trigonometry' },
  triangle_solver:        { engine: 'stub', conceptId: 'trig_triangle_solver',              label: 'Triangle Solver',           icon: 'change_history',    category: 'Trigonometry' },

  // ── Complex Numbers ───────────────────────────────────────────────────────
  argand_plane:           { engine: 'stub', conceptId: 'complex_argand_plane',              label: 'Argand Plane',              icon: 'scatter_plot',      category: 'Complex Numbers' },
  roots_of_unity:         { engine: 'stub', conceptId: 'complex_roots_of_unity',            label: 'Roots of Unity',            icon: 'blur_circular',     category: 'Complex Numbers' },

  // ── Matrices ──────────────────────────────────────────────────────────────
  matrix_transform_2d:    { engine: 'stub', conceptId: 'matrices_2d_linear_transform',     label: '2D Matrix Transform',       icon: 'grid_on',           category: 'Matrices' },

  // ── Probability & Statistics ──────────────────────────────────────────────
  probability_tree:       { engine: 'stub', conceptId: 'probability_bayes_tree',            label: 'Probability Tree',          icon: 'account_tree',      category: 'Probability' },
  normal_distribution:    { engine: 'stub', conceptId: 'statistics_normal_distribution',   label: 'Normal Distribution',       icon: 'bar_chart',         category: 'Probability' },
}
