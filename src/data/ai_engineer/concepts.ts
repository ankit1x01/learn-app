import type { Concept } from '../../core/types';

export const AI_CONCEPTS: Concept[] = [
  // ── Core Foundations (Python, Math, SQL) ──────────────────────────────────────────────
  {
    id: 'ai_cf_1', subject: 'Core Foundations (Python, Math, SQL)', chapter: 'Python for AI', unit: 1, name: 'Advanced Python (OOP, Decorators, Generators)',
    difficulty: 2, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'ai_cf_2', subject: 'Core Foundations (Python, Math, SQL)', chapter: 'Python for AI', unit: 1, name: 'NumPy & Vectorization',
    difficulty: 1, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'ai_cf_3', subject: 'Core Foundations (Python, Math, SQL)', chapter: 'Python for AI', unit: 1, name: 'Pandas (EDA, Merges, GroupBys)',
    difficulty: 2, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'ai_cf_4', subject: 'Core Foundations (Python, Math, SQL)', chapter: 'Data Bases', unit: 2, name: 'Advanced SQL (Window Functions, CTEs)',
    difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'ai_cf_5', subject: 'Core Foundations (Python, Math, SQL)', chapter: 'Mathematics', unit: 3, name: 'Linear Algebra (Matrices, Eigenvalues)',
    difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2
  },

  // ── Machine Learning ──────────────────────────────────────────────
  {
    id: 'ai_ml_1', subject: 'Machine Learning', chapter: 'Supervised Learning', unit: 1, name: 'Linear & Logistic Regression',
    difficulty: 1, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'ai_ml_2', subject: 'Machine Learning', chapter: 'Supervised Learning', unit: 1, name: 'Random Forests & Decision Trees',
    difficulty: 2, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'ai_ml_3', subject: 'Machine Learning', chapter: 'Supervised Learning', unit: 1, name: 'Gradient Boosting (XGBoost, LightGBM)',
    difficulty: 3, pyqTier: 1, competingIds: ['ai_ml_2'], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'ai_ml_4', subject: 'Machine Learning', chapter: 'Unsupervised Learning', unit: 2, name: 'Clustering (K-Means, DBSCAN) & PCA',
    difficulty: 3, pyqTier: 2, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2
  },
  {
    id: 'ai_ml_5', subject: 'Machine Learning', chapter: 'Evaluation', unit: 3, name: 'Cross-Validation & Metrics (F1, ROC-AUC)',
    difficulty: 2, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },

  // ── Deep Learning & PyTorch ──────────────────────────────────────────────
  {
    id: 'ai_dl_1', subject: 'Deep Learning & PyTorch', chapter: 'Neural Networks Foundations', unit: 1, name: 'Backpropagation & Loss Functions',
    difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'ai_dl_2', subject: 'Deep Learning & PyTorch', chapter: 'PyTorch Framework', unit: 2, name: 'Tensors, Autograd & DataLoader',
    difficulty: 2, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'ai_dl_3', subject: 'Deep Learning & PyTorch', chapter: 'Vision', unit: 3, name: 'CNNs (ResNet, Convolutions)',
    difficulty: 3, pyqTier: 2, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2
  },
  {
    id: 'ai_dl_4', subject: 'Deep Learning & PyTorch', chapter: 'Sequence', unit: 4, name: 'RNNs & LSTMs',
    difficulty: 3, pyqTier: 2, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2
  },

  // ── Generative AI & LLMs (RAG, Agents) ──────────────────────────────────────────────
  {
    id: 'ai_gen_1', subject: 'Generative AI & LLMs (RAG, Agents)', chapter: 'Transformers', unit: 1, name: 'Self-Attention & Transformer Architecture',
    difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'ai_gen_2', subject: 'Generative AI & LLMs (RAG, Agents)', chapter: 'Tooling', unit: 2, name: 'HuggingFace (Transformers, Diffusers)',
    difficulty: 2, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'ai_gen_3', subject: 'Generative AI & LLMs (RAG, Agents)', chapter: 'Applications', unit: 3, name: 'Vector Databases (Pinecone, ChromaDB, Milvus)',
    difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'ai_gen_4', subject: 'Generative AI & LLMs (RAG, Agents)', chapter: 'Applications', unit: 3, name: 'Retrieval Augmented Generation (RAG)',
    difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'ai_gen_5', subject: 'Generative AI & LLMs (RAG, Agents)', chapter: 'Applications', unit: 3, name: 'LangChain & LlamaIndex',
    difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'ai_gen_6', subject: 'Generative AI & LLMs (RAG, Agents)', chapter: 'Fine-tuning', unit: 4, name: 'PEFT, LoRA & QLoRA',
    difficulty: 5, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'ai_gen_7', subject: 'Generative AI & LLMs (RAG, Agents)', chapter: 'Agents', unit: 5, name: 'AI Agents & Function Calling (ReAct)',
    difficulty: 5, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },

  // ── MLOps & Deployment ──────────────────────────────────────────────
  {
    id: 'ai_ops_1', subject: 'MLOps & Deployment', chapter: 'Serving', unit: 1, name: 'Model Serving with FastAPI',
    difficulty: 2, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'ai_ops_2', subject: 'MLOps & Deployment', chapter: 'Containerization', unit: 2, name: 'Docker for ML Models',
    difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'ai_ops_3', subject: 'MLOps & Deployment', chapter: 'Tracking', unit: 3, name: 'Experiment Tracking (MLflow, Weights & Biases)',
    difficulty: 2, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1
  },
  {
    id: 'ai_ops_4', subject: 'MLOps & Deployment', chapter: 'Cloud Platforms', unit: 4, name: 'AWS SageMaker / GCP Vertex AI Basics',
    difficulty: 4, pyqTier: 2, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2
  }
];
