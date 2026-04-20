import type { Concept } from '../../core/types';

export const AI_CONCEPTS: Concept[] = [
  // ── Core Foundations (Python, Math, SQL) ──────────────────────────────────────────────
  { id: 'ai_cf_1', subject: 'Core Foundations (Python, Math, SQL)', chapter: 'Python for AI', unit: 1, name: 'Advanced Python (OOP, Decorators, Generators)', difficulty: 2, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'ai_cf_2', subject: 'Core Foundations (Python, Math, SQL)', chapter: 'Python for AI', unit: 1, name: 'NumPy, Pandas & Data Wrangling', difficulty: 2, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'ai_cf_3', subject: 'Core Foundations (Python, Math, SQL)', chapter: 'Data Engineering', unit: 2, name: 'SQL for Data Science (CTEs, Window Functions)', difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'ai_cf_4', subject: 'Core Foundations (Python, Math, SQL)', chapter: 'Mathematics', unit: 3, name: 'Linear Algebra (Matrices, Vectors, Eigenvalues)', difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2 },
  { id: 'ai_cf_5', subject: 'Core Foundations (Python, Math, SQL)', chapter: 'Mathematics', unit: 4, name: 'Probability, Statistics & Calculus Basics', difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2 },
  { id: 'ai_cf_6', subject: 'Core Foundations (Python, Math, SQL)', chapter: 'CS Fundamentals', unit: 5, name: 'Algorithms, Data Structures & System Design Basics', difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },

  // ── Machine Learning ──────────────────────────────────────────────
  { id: 'ai_ml_1', subject: 'Machine Learning', chapter: 'Supervised Learning', unit: 1, name: 'Linear & Logistic Regression (Scikit-Learn)', difficulty: 1, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'ai_ml_2', subject: 'Machine Learning', chapter: 'Supervised Learning', unit: 1, name: 'Random Forests, Decison Trees & Feature Engineering', difficulty: 2, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'ai_ml_3', subject: 'Machine Learning', chapter: 'Supervised Learning', unit: 2, name: 'Gradient Boosting (XGBoost, LightGBM)', difficulty: 3, pyqTier: 1, competingIds: ['ai_ml_2'], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'ai_ml_4', subject: 'Machine Learning', chapter: 'Unsupervised Learning', unit: 3, name: 'Clustering (K-Means, DBSCAN) & Dimensionality Reduction (PCA)', difficulty: 3, pyqTier: 2, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2 },
  { id: 'ai_ml_5', subject: 'Machine Learning', chapter: 'Evaluation', unit: 4, name: 'Cross-Validation & Metrics (F1, Precision/Recall, ROC-AUC)', difficulty: 2, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },

  // ── Deep Learning & PyTorch ──────────────────────────────────────────────
  { id: 'ai_dl_1', subject: 'Deep Learning & PyTorch', chapter: 'Neural Networks Foundations', unit: 1, name: 'Backpropagation, Optimizers & Loss Functions', difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'ai_dl_2', subject: 'Deep Learning & PyTorch', chapter: 'PyTorch Framework', unit: 2, name: 'PyTorch (Tensors, Autograd, DataLoader)', difficulty: 2, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'ai_dl_3', subject: 'Deep Learning & PyTorch', chapter: 'Computer Vision', unit: 3, name: 'CNNs, Image Classification & Vision Transformers', difficulty: 3, pyqTier: 2, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2 },
  { id: 'ai_dl_4', subject: 'Deep Learning & PyTorch', chapter: 'Sequence Models', unit: 4, name: 'RNNs, LSTMs & Time-Series Basics', difficulty: 3, pyqTier: 2, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2 },

  // ── Generative AI & LLMs (RAG, Agents) ──────────────────────────────────────────────
  { id: 'ai_gen_1', subject: 'Generative AI & LLMs (RAG, Agents)', chapter: 'Transformers', unit: 1, name: 'Self-Attention & Transformer Architecture', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'ai_gen_2', subject: 'Generative AI & LLMs (RAG, Agents)', chapter: 'Tooling', unit: 2, name: 'OpenAI API, Hugging Face Transformers & Prompt Engineering', difficulty: 2, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'ai_gen_3', subject: 'Generative AI & LLMs (RAG, Agents)', chapter: 'Applications', unit: 3, name: 'Vector Databases (Pinecone, FAISS, Weaviate)', difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'ai_gen_4', subject: 'Generative AI & LLMs (RAG, Agents)', chapter: 'Applications', unit: 4, name: 'Retrieval-Augmented Generation (RAG) Pipelines', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'ai_gen_5', subject: 'Generative AI & LLMs (RAG, Agents)', chapter: 'Frameworks', unit: 5, name: 'LangChain & LlamaIndex for LLM Orchestration', difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'ai_gen_6', subject: 'Generative AI & LLMs (RAG, Agents)', chapter: 'Fine-tuning', unit: 6, name: 'Fine-tuning LLMs (PEFT, LoRA, QLoRA)', difficulty: 5, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'ai_gen_7', subject: 'Generative AI & LLMs (RAG, Agents)', chapter: 'Agents', unit: 7, name: 'AI Agents, Tools & Function Calling', difficulty: 5, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },

  // ── MLOps & Deployment ──────────────────────────────────────────────
  { id: 'ai_ops_1', subject: 'MLOps & Deployment', chapter: 'Serving', unit: 1, name: 'REST APIs for Models (FastAPI / Flask)', difficulty: 2, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'ai_ops_2', subject: 'MLOps & Deployment', chapter: 'Containerization', unit: 2, name: 'Docker Containerization & Kubernetes for AI', difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'ai_ops_3', subject: 'MLOps & Deployment', chapter: 'Data Pipelines', unit: 3, name: 'Data Pipelines (Apache Spark, Kafka, Airflow)', difficulty: 3, pyqTier: 2, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 },
  { id: 'ai_ops_4', subject: 'MLOps & Deployment', chapter: 'Cloud Platforms', unit: 4, name: 'Cloud AI (AWS SageMaker, EC2, S3 & GCP Vertex AI)', difficulty: 4, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 2 },
  { id: 'ai_ops_5', subject: 'MLOps & Deployment', chapter: 'CI/CD', unit: 5, name: 'CI/CD for ML (GitHub Actions, Jenkins) & Model Monitoring', difficulty: 3, pyqTier: 1, competingIds: [], stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier: 1 }
];
