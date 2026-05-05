import type { BayesBazaarConfig } from '@/games/types'

export const bayesBazaarContent: BayesBazaarConfig = {
  type: 'bayes-bazaar',
  theme: 'market',
  subject: 'mathematics',
  items: [
    {
      id: 'bayes-bazaar-1',
      skillId: 'probability_basic_sampling',
      scenario:
        'A die is rolled. What is the probability of getting a number greater than 4?',
      correctStrategy: 'direct',
      givenInfo: {
        'Favorable outcomes': 2,
        'Total outcomes': 6,
      },
      expectedProbability: 1 / 3,
      timeLimit: 30,
    },
    {
      id: 'bayes-bazaar-2',
      skillId: 'probability_conditional_basic',
      scenario:
        'Two cards drawn from a deck without replacement. First card is heart. Probability second is also heart?',
      correctStrategy: 'conditional',
      givenInfo: {
        'Hearts in deck': 13,
        'First: Heart': 1,
        'Cards left': 51,
      },
      expectedProbability: 12 / 51,
      timeLimit: 35,
    },
    {
      id: 'bayes-bazaar-3',
      skillId: 'probability_total_probability',
      scenario:
        'Box A: 2 red, 3 blue. Box B: 4 red, 1 blue. Pick a box randomly, then a ball. Probability of red?',
      correctStrategy: 'total-probability',
      givenInfo: {
        'P(Box A)': 0.5,
        'P(Red|A)': 0.4,
        'P(Box B)': 0.5,
        'P(Red|B)': 0.8,
      },
      expectedProbability: 0.6,
      timeLimit: 50,
    },
    {
      id: 'bayes-bazaar-4',
      skillId: 'probability_bayes_theorem',
      scenario:
        'Test accuracy: 95% true positive, 90% true negative. Disease prevalence: 1%. Test positive, probability of disease?',
      correctStrategy: 'bayes',
      givenInfo: {
        'P(+|Disease)': 0.95,
        'P(-|No Disease)': 0.9,
        'P(Disease)': 0.01,
      },
      expectedProbability: 0.087,
      timeLimit: 60,
    },
    {
      id: 'bayes-bazaar-5',
      skillId: 'probability_compound_event',
      scenario:
        'Coin tossed twice. Probability of getting exactly one head?',
      correctStrategy: 'direct',
      givenInfo: {
        'Sample space': 'HH, HT, TH, TT',
        'Favorable': 'HT, TH',
      },
      expectedProbability: 0.5,
      timeLimit: 30,
    },
    {
      id: 'bayes-bazaar-6',
      skillId: 'probability_independence',
      scenario:
        'Two independent events: P(A) = 0.3, P(B) = 0.4. Probability of both occurring?',
      correctStrategy: 'direct',
      givenInfo: {
        'P(A)': 0.3,
        'P(B)': 0.4,
        'Independent': true,
      },
      expectedProbability: 0.12,
      timeLimit: 25,
    },
  ],
}
