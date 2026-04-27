// Hardcoded course structure index for AI Engineering from Scratch
// TODO: Generate this dynamically at build time

import type { Phase } from './types';

const courseBasePath = '../../ai-engineering-from-scratch-main/phases';

export const aiEngineeringPhases: Phase[] = [
  {
    id: 'phase-00',
    number: 0,
    name: 'Setup and Tooling',
    path: `${courseBasePath}/00-setup-and-tooling`,
    lessons: [
      { id: 'lesson-00-01', number: 1, name: 'Dev Environment', path: `${courseBasePath}/00-setup-and-tooling/01-dev-environment`, codePaths: [], docPath: `${courseBasePath}/00-setup-and-tooling/01-dev-environment/docs/en.md` },
      { id: 'lesson-00-02', number: 2, name: 'Git and Collaboration', path: `${courseBasePath}/00-setup-and-tooling/02-git-and-collaboration`, codePaths: [], docPath: `${courseBasePath}/00-setup-and-tooling/02-git-and-collaboration/docs/en.md` },
      { id: 'lesson-00-03', number: 3, name: 'GPU Setup and Cloud', path: `${courseBasePath}/00-setup-and-tooling/03-gpu-setup-and-cloud`, codePaths: [], docPath: `${courseBasePath}/00-setup-and-tooling/03-gpu-setup-and-cloud/docs/en.md` },
      { id: 'lesson-00-04', number: 4, name: 'APIs and Keys', path: `${courseBasePath}/00-setup-and-tooling/04-apis-and-keys`, codePaths: [], docPath: `${courseBasePath}/00-setup-and-tooling/04-apis-and-keys/docs/en.md` },
      { id: 'lesson-00-05', number: 5, name: 'Jupyter Notebooks', path: `${courseBasePath}/00-setup-and-tooling/05-jupyter-notebooks`, codePaths: [], docPath: `${courseBasePath}/00-setup-and-tooling/05-jupyter-notebooks/docs/en.md` },
      { id: 'lesson-00-06', number: 6, name: 'Python Environments', path: `${courseBasePath}/00-setup-and-tooling/06-python-environments`, codePaths: [], docPath: `${courseBasePath}/00-setup-and-tooling/06-python-environments/docs/en.md` },
      { id: 'lesson-00-07', number: 7, name: 'Docker for AI', path: `${courseBasePath}/00-setup-and-tooling/07-docker-for-ai`, codePaths: [], docPath: `${courseBasePath}/00-setup-and-tooling/07-docker-for-ai/docs/en.md` },
      { id: 'lesson-00-08', number: 8, name: 'Editor Setup', path: `${courseBasePath}/00-setup-and-tooling/08-editor-setup`, codePaths: [], docPath: `${courseBasePath}/00-setup-and-tooling/08-editor-setup/docs/en.md` },
      { id: 'lesson-00-09', number: 9, name: 'Data Management', path: `${courseBasePath}/00-setup-and-tooling/09-data-management`, codePaths: [], docPath: `${courseBasePath}/00-setup-and-tooling/09-data-management/docs/en.md` },
      { id: 'lesson-00-10', number: 10, name: 'Terminal and Shell', path: `${courseBasePath}/00-setup-and-tooling/10-terminal-and-shell`, codePaths: [], docPath: `${courseBasePath}/00-setup-and-tooling/10-terminal-and-shell/docs/en.md` },
      { id: 'lesson-00-11', number: 11, name: 'Linux for AI', path: `${courseBasePath}/00-setup-and-tooling/11-linux-for-ai`, codePaths: [], docPath: `${courseBasePath}/00-setup-and-tooling/11-linux-for-ai/docs/en.md` },
      { id: 'lesson-00-12', number: 12, name: 'Debugging and Profiling', path: `${courseBasePath}/00-setup-and-tooling/12-debugging-and-profiling`, codePaths: [], docPath: `${courseBasePath}/00-setup-and-tooling/12-debugging-and-profiling/docs/en.md` },
    ],
  },
  {
    id: 'phase-01',
    number: 1,
    name: 'Math Foundations',
    path: `${courseBasePath}/01-math-foundations`,
    lessons: [
      { id: 'lesson-01-01', number: 1, name: 'Linear Algebra Intuition', path: `${courseBasePath}/01-math-foundations/01-linear-algebra-intuition`, codePaths: [], docPath: `${courseBasePath}/01-math-foundations/01-linear-algebra-intuition/docs/en.md` },
      { id: 'lesson-01-02', number: 2, name: 'Vectors and Matrices Operations', path: `${courseBasePath}/01-math-foundations/02-vectors-matrices-operations`, codePaths: [], docPath: `${courseBasePath}/01-math-foundations/02-vectors-matrices-operations/docs/en.md` },
      { id: 'lesson-01-03', number: 3, name: 'Matrix Transformations', path: `${courseBasePath}/01-math-foundations/03-matrix-transformations`, codePaths: [], docPath: `${courseBasePath}/01-math-foundations/03-matrix-transformations/docs/en.md` },
      { id: 'lesson-01-04', number: 4, name: 'Calculus for ML', path: `${courseBasePath}/01-math-foundations/04-calculus-for-ml`, codePaths: [], docPath: `${courseBasePath}/01-math-foundations/04-calculus-for-ml/docs/en.md` },
      { id: 'lesson-01-05', number: 5, name: 'Chain Rule and Autodiff', path: `${courseBasePath}/01-math-foundations/05-chain-rule-and-autodiff`, codePaths: [], docPath: `${courseBasePath}/01-math-foundations/05-chain-rule-and-autodiff/docs/en.md` },
      { id: 'lesson-01-06', number: 6, name: 'Probability and Distributions', path: `${courseBasePath}/01-math-foundations/06-probability-and-distributions`, codePaths: [], docPath: `${courseBasePath}/01-math-foundations/06-probability-and-distributions/docs/en.md` },
    ],
  },
  {
    id: 'phase-02',
    number: 2,
    name: 'ML Fundamentals',
    path: `${courseBasePath}/02-ml-fundamentals`,
    lessons: [
      { id: 'lesson-02-01', number: 1, name: 'Supervised Learning Basics', path: `${courseBasePath}/02-ml-fundamentals/01-supervised-learning-basics`, codePaths: [], docPath: `${courseBasePath}/02-ml-fundamentals/01-supervised-learning-basics/docs/en.md` },
      { id: 'lesson-02-02', number: 2, name: 'Unsupervised Learning', path: `${courseBasePath}/02-ml-fundamentals/02-unsupervised-learning`, codePaths: [], docPath: `${courseBasePath}/02-ml-fundamentals/02-unsupervised-learning/docs/en.md` },
    ],
  },
];
