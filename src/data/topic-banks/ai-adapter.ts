import type { ExamTopicBank, TopicGroup } from './types';

const CF_GROUPS: TopicGroup[] = [
  {
    group: 'Python & Data', icon: 'code', tier: 1, accentColor: '#3B82F6', accentBg: '#3B82F620',
    topics: [
      { topic: 'Python', problems: [{ name: 'Advanced Python (OOP, Decorators, Generators)' }, { name: 'NumPy, Pandas & Data Wrangling' }] },
      { topic: 'SQL & DB', problems: [{ name: 'SQL for Data Science (CTEs, Window Functions)' }] },
      { topic: 'Math & CS', problems: [{ name: 'Linear Algebra (Matrices, Vectors, Eigenvalues)' }, { name: 'Probability, Statistics & Calculus Basics' }, { name: 'Algorithms, Data Structures & System Design Basics' }] }
    ]
  }
];

const ML_GROUPS: TopicGroup[] = [
  {
    group: 'Supervised & Unsupervised', icon: 'scatter_plot', tier: 1, accentColor: '#10B981', accentBg: '#10B98120',
    topics: [
      { topic: 'Regression & Classification', problems: [{ name: 'Linear & Logistic Regression (Scikit-Learn)' }, { name: 'Random Forests, Decison Trees & Feature Engineering' }] },
      { topic: 'Advanced ML', problems: [{ name: 'Gradient Boosting (XGBoost, LightGBM)' }, { name: 'Clustering (K-Means, DBSCAN) & Dimensionality Reduction (PCA)' }] },
      { topic: 'Validation', problems: [{ name: 'Cross-Validation & Metrics (F1, Precision/Recall, ROC-AUC)' }] }
    ]
  }
];

const DL_GROUPS: TopicGroup[] = [
  {
    group: 'Deep Learning & Vision', icon: 'memory', tier: 1, accentColor: '#8B5CF6', accentBg: '#8B5CF620',
    topics: [
      { topic: 'PyTorch Core', problems: [{ name: 'Backpropagation, Optimizers & Loss Functions' }, { name: 'PyTorch (Tensors, Autograd, DataLoader)' }] },
      { topic: 'Archi & Apps', problems: [{ name: 'CNNs, Image Classification & Vision Transformers' }, { name: 'RNNs, LSTMs & Time-Series Basics' }] }
    ]
  }
];

const GEN_AI_GROUPS: TopicGroup[] = [
  {
    group: 'LLMs, RAG & Agents', icon: 'psychology', tier: 1, accentColor: '#EC4899', accentBg: '#EC489920',
    topics: [
      { topic: 'Transformers & Tools', problems: [{ name: 'Self-Attention & Transformer Architecture' }, { name: 'OpenAI API, Hugging Face Transformers & Prompt Engineering' }] },
      { topic: 'RAG Architecture', problems: [{ name: 'Vector Databases (Pinecone, FAISS, Weaviate)' }, { name: 'LangChain & LlamaIndex for LLM Orchestration' }, { name: 'Retrieval-Augmented Generation (RAG) Pipelines' }] },
      { topic: 'Advanced LLMs', problems: [{ name: 'Fine-tuning LLMs (PEFT, LoRA, QLoRA)' }, { name: 'AI Agents, Tools & Function Calling' }] }
    ]
  }
];

const OPS_GROUPS: TopicGroup[] = [
  {
    group: 'Deployment & MLOps', icon: 'rocket_launch', tier: 1, accentColor: '#F59E0B', accentBg: '#F59E0B20',
    topics: [
      { topic: 'Serving & Containers', problems: [{ name: 'REST APIs for Models (FastAPI / Flask)' }, { name: 'Docker Containerization & Kubernetes for AI' }] },
      { topic: 'Pipelines & Cloud', problems: [{ name: 'Data Pipelines (Apache Spark, Kafka, Airflow)' }, { name: 'Cloud AI (AWS SageMaker, EC2, S3 & GCP Vertex AI)' }] },
      { topic: 'Practices', problems: [{ name: 'CI/CD for ML (GitHub Actions, Jenkins) & Model Monitoring' }] }
    ]
  }
];

export const aiAdapter: ExamTopicBank = {
  examId: 'ai_engineer',
  getGroups: (subjectName: string) => {
    switch (subjectName) {
      case 'Core Foundations (Python, Math, SQL)': return CF_GROUPS;
      case 'Machine Learning': return ML_GROUPS;
      case 'Deep Learning & PyTorch': return DL_GROUPS;
      case 'Generative AI & LLMs (RAG, Agents)': return GEN_AI_GROUPS;
      case 'MLOps & Deployment': return OPS_GROUPS;
      default: return [...CF_GROUPS, ...ML_GROUPS, ...DL_GROUPS, ...GEN_AI_GROUPS, ...OPS_GROUPS];
    }
  },
};
