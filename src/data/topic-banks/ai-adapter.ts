import type { ExamTopicBank, TopicGroup } from './types';

// Hardcoded topic data for AI Engineer
const ML_GROUPS: TopicGroup[] = [
  {
    group: 'Supervised Learning',
    icon: 'scatter_plot',
    tier: 1,
    accentColor: '#10B981',
    accentBg: '#10B98120',
    topics: [
      {
        topic: 'Regression',
        problems: [
          { name: 'Linear Regression implementation from scratch', link: 'https://towardsdatascience.com' },
          { name: 'Polynomial Regression', link: 'https://towardsdatascience.com' }
        ]
      },
      {
        topic: 'Classification',
        problems: [
          { name: 'Logistic Regression', link: 'https://towardsdatascience.com' },
          { name: 'Support Vector Machines (SVM)', link: 'https://towardsdatascience.com' },
          { name: 'Decision Trees & Random Forests', link: 'https://towardsdatascience.com' }
        ]
      }
    ]
  },
  {
    group: 'Unsupervised Learning',
    icon: 'bubble_chart',
    tier: 2,
    accentColor: '#10B981',
    accentBg: '#10B98120',
    topics: [
      {
        topic: 'Clustering',
        problems: [
          { name: 'K-Means Clustering', link: 'https://towardsdatascience.com' },
          { name: 'Hierarchical Clustering', link: 'https://towardsdatascience.com' }
        ]
      },
      {
        topic: 'Dimensionality Reduction',
        problems: [
          { name: 'Principal Component Analysis (PCA)', link: 'https://towardsdatascience.com' },
          { name: 't-SNE', link: 'https://towardsdatascience.com' }
        ]
      }
    ]
  }
];

const DL_GROUPS: TopicGroup[] = [
  {
    group: 'Neural Networks Foundations',
    icon: 'network_node',
    tier: 1,
    accentColor: '#8B5CF6',
    accentBg: '#8B5CF620',
    topics: [
      {
        topic: 'Basics',
        problems: [
          { name: 'Perceptron and MLPs', link: 'https://www.deeplearning.ai/' },
          { name: 'Backpropagation Calculus', link: 'https://www.deeplearning.ai/' },
          { name: 'Activation Functions (ReLU, Sigmoid, etc.)', link: 'https://www.deeplearning.ai/' }
        ]
      },
      {
        topic: 'Optimization',
        problems: [
          { name: 'Gradient Descent & Variants (Adam, RMSProp)', link: 'https://www.deeplearning.ai/' },
          { name: 'Regularization (Dropout, L1/L2)', link: 'https://www.deeplearning.ai/' }
        ]
      }
    ]
  },
  {
    group: 'Advanced Architectures',
    icon: 'memory',
    tier: 2,
    accentColor: '#8B5CF6',
    accentBg: '#8B5CF620',
    topics: [
      {
        topic: 'Computer Vision',
        problems: [
          { name: 'Convolutional Neural Networks (CNNs)', link: 'https://www.deeplearning.ai/' },
          { name: 'ResNet, VGG, Inception', link: 'https://www.deeplearning.ai/' }
        ]
      },
      {
        topic: 'Sequence Models',
        problems: [
          { name: 'Recurrent Neural Networks (RNNs)', link: 'https://www.deeplearning.ai/' },
          { name: 'LSTMs and GRUs', link: 'https://www.deeplearning.ai/' }
        ]
      }
    ]
  }
];

const GEN_AI_GROUPS: TopicGroup[] = [
  {
    group: 'Transformers & Attention',
    icon: 'psychology',
    tier: 1,
    accentColor: '#EC4899',
    accentBg: '#EC489920',
    topics: [
      {
        topic: 'Architecture',
        problems: [
          { name: 'Self-Attention Mechanism', link: 'https://arxiv.org/abs/1706.03762' },
          { name: 'Encoder-Decoder Architecture', link: 'https://jalammar.github.io/illustrated-transformer/' }
        ]
      },
      {
        topic: 'Core Models',
        problems: [
          { name: 'BERT & RoBERTa (Masked LM)', link: 'https://huggingface.co/docs' },
          { name: 'GPT-series (Causal LM)', link: 'https://huggingface.co/docs' }
        ]
      }
    ]
  },
  {
    group: 'LLM Fine-tuning & Alignment',
    icon: 'tune',
    tier: 3,
    accentColor: '#EC4899',
    accentBg: '#EC489920',
    topics: [
      {
        topic: 'Parameter-Efficient Fine-Tuning',
        problems: [
          { name: 'LoRA & QLoRA', link: 'https://huggingface.co/blog/lora' },
          { name: 'Prompt Tuning', link: 'https://huggingface.co/docs' }
        ]
      },
      {
        topic: 'Alignment',
        problems: [
          { name: 'Reinforcement Learning from Human Feedback (RLHF)', link: 'https://openai.com/research/instruction-following' },
          { name: 'Direct Preference Optimization (DPO)', link: 'https://arxiv.org/abs/2305.18290' }
        ]
      }
    ]
  }
];

export const aiAdapter: ExamTopicBank = {
  examId: 'ai_engineer',
  getGroups: (subjectName: string) => {
    switch (subjectName) {
      case 'Machine Learning':
        return ML_GROUPS;
      case 'Deep Learning':
        return DL_GROUPS;
      case 'Generative AI & LLMs':
        return GEN_AI_GROUPS;
      default:
        // Fallback returns all
        return [...ML_GROUPS, ...DL_GROUPS, ...GEN_AI_GROUPS];
    }
  },
};
