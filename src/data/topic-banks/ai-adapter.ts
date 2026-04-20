import type { ExamTopicBank, TopicGroup } from './types';

const CF_GROUPS: TopicGroup[] = [
  {
    group: 'Python & Data', icon: 'code', tier: 1, accentColor: '#3B82F6', accentBg: '#3B82F620',
    topics: [
      { topic: 'Python', problems: [{ name: 'Advanced Python (OOP, Decorators)', link: 'https://docs.python.org/3/' }, { name: 'Pandas & NumPy EDA', link: 'https://pandas.pydata.org/' }] },
      { topic: 'SQL & DB', problems: [{ name: 'Advanced SQL (Window Functions, CTEs)' }] },
      { topic: 'Math', problems: [{ name: 'Linear Algebra for Machine Learning' }] }
    ]
  }
];

const ML_GROUPS: TopicGroup[] = [
  {
    group: 'Supervised & Unsupervised', icon: 'scatter_plot', tier: 1, accentColor: '#10B981', accentBg: '#10B98120',
    topics: [
      { topic: 'Regression & Classification', problems: [{ name: 'Linear & Logistic Regression' }, { name: 'Random Forests & Decision Trees' }] },
      { topic: 'Advanced ML', problems: [{ name: 'Gradient Boosting (XGBoost, LightGBM)' }, { name: 'Clustering (K-Means, DBSCAN) & PCA' }] },
      { topic: 'Validation', problems: [{ name: 'Cross-Validation & Metrics (F1, ROC-AUC)' }] }
    ]
  }
];

const DL_GROUPS: TopicGroup[] = [
  {
    group: 'Deep Learning & Vision', icon: 'memory', tier: 1, accentColor: '#8B5CF6', accentBg: '#8B5CF620',
    topics: [
      { topic: 'PyTorch Core', problems: [{ name: 'Backpropagation & Loss Functions' }, { name: 'Tensors, Autograd & DataLoader' }] },
      { topic: 'Networks', problems: [{ name: 'CNNs (ResNet, Convolutions)' }, { name: 'RNNs & LSTMs' }] }
    ]
  }
];

const GEN_AI_GROUPS: TopicGroup[] = [
  {
    group: 'LLMs, RAG & Agents', icon: 'psychology', tier: 1, accentColor: '#EC4899', accentBg: '#EC489920',
    topics: [
      { topic: 'Transformers', problems: [{ name: 'Self-Attention & Transformer Architecture' }, { name: 'HuggingFace (Transformers, Diffusers)' }] },
      { topic: 'Retrieval Augmented Gen', problems: [{ name: 'Vector Databases (Pinecone, ChromaDB, Milvus)' }, { name: 'LangChain & LlamaIndex' }, { name: 'Retrieval Augmented Generation (RAG)' }] },
      { topic: 'Advanced LLMs', problems: [{ name: 'PEFT, LoRA & QLoRA' }, { name: 'AI Agents & Function Calling (ReAct)' }] }
    ]
  }
];

const OPS_GROUPS: TopicGroup[] = [
  {
    group: 'Deployment & MLOps', icon: 'rocket_launch', tier: 1, accentColor: '#F59E0B', accentBg: '#F59E0B20',
    topics: [
      { topic: 'Serving & Containers', problems: [{ name: 'Model Serving with FastAPI' }, { name: 'Docker for ML Models' }] },
      { topic: 'MLOps Tools', problems: [{ name: 'Experiment Tracking (MLflow, Weights & Biases)' }, { name: 'AWS SageMaker / GCP Vertex AI' }] }
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
