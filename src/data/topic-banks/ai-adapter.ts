import type { ExamTopicBank, TopicGroup } from './types';

const CF_GROUPS: TopicGroup[] = [
  {
    group: 'Python & Data', icon: 'code', tier: 1, accentColor: '#3B82F6', accentBg: '#3B82F620',
    topics: [
      { topic: 'Python Mastery', problems: [
        { name: 'Advanced Python (Async, Decorators, Generators, Type Hints)', link: 'https://docs.python.org/3/library/asyncio.html', resources: ['https://realpython.com/primer-on-python-decorators/', 'https://realpython.com/introduction-to-python-generators/'] },
        { name: 'NumPy, Pandas & Data Wrangling at Scale', link: 'https://pandas.pydata.org/docs/getting_started/intro_tutorials/', resources: ['https://numpy.org/doc/stable/user/quickstart.html'] }
      ]},
      { topic: 'SQL & Analytics', problems: [
        { name: 'SQL for Analytics (CTEs, Window Functions, Query Optimization)', link: 'https://mode.com/sql-tutorial/', resources: ['https://www.windowfunctions.com/'] }
      ]},
      { topic: 'Math & Tooling', problems: [
        { name: 'Linear Algebra & Probability for AI', link: 'https://www.3blue1brown.com/topics/linear-algebra', resources: ['https://www.khanacademy.org/math/statistics-probability'] },
        { name: 'Git, GitHub & Collaborative Engineering Workflows', link: 'https://learngitbranching.js.org/' },
        { name: 'Data Visualization & Storytelling (Matplotlib, Plotly, Streamlit)', link: 'https://streamlit.io/gallery', resources: ['https://plotly.com/python/'] }
      ]}
    ]
  }
];

const MLDL_GROUPS: TopicGroup[] = [
  {
    group: 'Classical ML', icon: 'scatter_plot', tier: 1, accentColor: '#10B981', accentBg: '#10B98120',
    topics: [
      { topic: 'Learning Paradigms', problems: [
        { name: 'Supervised Learning (Regression, Trees, Boosting, SVM)', link: 'https://scikit-learn.org/stable/supervised_learning.html', resources: ['https://www.kaggle.com/learn/intro-to-machine-learning'] },
        { name: 'Unsupervised Learning (Clustering, PCA, Anomaly Detection)', link: 'https://scikit-learn.org/stable/unsupervised_learning.html' }
      ]},
      { topic: 'Evaluation', problems: [
        { name: 'Model Evaluation, Metrics & Hyperparameter Tuning', link: 'https://scikit-learn.org/stable/model_selection.html', resources: ['https://neptune.ai/blog/hyperparameter-tuning-in-python-complete-guide'] }
      ]}
    ]
  },
  {
    group: 'Deep Learning', icon: 'memory', tier: 1, accentColor: '#10B981', accentBg: '#10B98120',
    topics: [
      { topic: 'Neural Nets & Frameworks', problems: [
        { name: 'Neural Network Fundamentals (Backprop, Optimizers, Loss)', link: 'https://www.3blue1brown.com/topics/neural-networks', resources: ['https://cs231n.github.io/'] },
        { name: 'PyTorch Framework Mastery (Tensors, Autograd, DataLoader)', link: 'https://pytorch.org/tutorials/beginner/basics/intro.html' }
      ]},
      { topic: 'Architectures', problems: [
        { name: 'CNNs, Vision Models & Transfer Learning', link: 'https://cs231n.stanford.edu/', resources: ['https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html'] },
        { name: 'Sequence Models (RNNs, LSTMs) & Time-Series', link: 'https://colah.github.io/posts/2015-08-Understanding-LSTMs/' }
      ]}
    ]
  }
];

const NLP_GROUPS: TopicGroup[] = [
  {
    group: 'Text & Language', icon: 'translate', tier: 1, accentColor: '#06B6D4', accentBg: '#06B6D420',
    topics: [
      { topic: 'Text Representation', problems: [
        { name: 'Tokenization (BPE, WordPiece, SentencePiece)', link: 'https://huggingface.co/learn/nlp-course/chapter6', resources: ['https://platform.openai.com/tokenizer'] },
        { name: 'Word Embeddings & Contextual Representations', link: 'https://jalammar.github.io/illustrated-word2vec/', resources: ['https://nlp.stanford.edu/projects/glove/'] }
      ]},
      { topic: 'NLP Tasks', problems: [
        { name: 'Text Classification, Sentiment Analysis & NER', link: 'https://huggingface.co/learn/nlp-course/chapter7', resources: ['https://spacy.io/usage/linguistic-features'] },
        { name: 'Hugging Face Ecosystem (Transformers, Datasets, Pipelines)', link: 'https://huggingface.co/docs/transformers/', resources: ['https://huggingface.co/models'] }
      ]},
      { topic: 'Transformers', problems: [
        { name: 'Transformer Architecture & Self-Attention Deep Dive', link: 'https://jalammar.github.io/illustrated-transformer/', resources: ['https://arxiv.org/abs/1706.03762'] },
        { name: 'Pre-training vs Fine-tuning Paradigms', link: 'https://huggingface.co/learn/nlp-course/chapter7/1' }
      ]}
    ]
  }
];

const LLM_GROUPS: TopicGroup[] = [
  {
    group: 'APIs & Prompting', icon: 'chat', tier: 1, accentColor: '#8B5CF6', accentBg: '#8B5CF620',
    topics: [
      { topic: 'LLM APIs', problems: [
        { name: 'LLM API Mastery (OpenAI, Claude, Gemini, Llama)', link: 'https://platform.openai.com/docs/', resources: ['https://docs.anthropic.com/', 'https://ai.google.dev/docs'] },
        { name: 'Structured Output, JSON Mode & Schema Enforcement', link: 'https://platform.openai.com/docs/guides/structured-outputs', resources: ['https://docs.pydantic.dev/latest/concepts/json_schema/'] },
        { name: 'Context Window Management & Long-Context Strategies', link: 'https://www.anthropic.com/news/long-context-prompting', resources: ['https://arxiv.org/abs/2307.03172'] }
      ]},
      { topic: 'Prompting', problems: [
        { name: 'Prompt Engineering (Zero/Few-Shot, CoT, Tree-of-Thought)', link: 'https://www.promptingguide.ai/', resources: ['https://platform.openai.com/docs/guides/prompt-engineering'] }
      ]}
    ]
  },
  {
    group: 'Training & Optimization', icon: 'model_training', tier: 1, accentColor: '#8B5CF6', accentBg: '#8B5CF620',
    topics: [
      { topic: 'Fine-tuning', problems: [
        { name: 'Fine-tuning LLMs (PEFT, LoRA, QLoRA, Full Fine-tune)', link: 'https://huggingface.co/docs/peft/', resources: ['https://arxiv.org/abs/2106.09685'] },
        { name: 'Instruction Tuning, RLHF & DPO Alignment', link: 'https://huggingface.co/blog/rlhf', resources: ['https://arxiv.org/abs/2305.18290'] }
      ]},
      { topic: 'Optimization & Models', problems: [
        { name: 'Model Quantization (GPTQ, AWQ, GGUF) & Compression', link: 'https://huggingface.co/docs/optimum/concept_guides/quantization', resources: ['https://github.com/ggerganov/llama.cpp'] },
        { name: 'LLM Inference Optimization (vLLM, TensorRT-LLM, Batching)', link: 'https://docs.vllm.ai/', resources: ['https://github.com/vllm-project/vllm'] },
        { name: 'Open-Source LLM Ecosystem (Llama, Mistral, Gemma, Qwen)', link: 'https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard', resources: ['https://ollama.com/'] },
        { name: 'Multimodal Models (Vision-Language, Audio, CLIP)', link: 'https://openai.com/index/clip/', resources: ['https://huggingface.co/docs/transformers/model_doc/llava'] }
      ]}
    ]
  }
];

const RAG_GROUPS: TopicGroup[] = [
  {
    group: 'RAG Fundamentals', icon: 'search', tier: 1, accentColor: '#EC4899', accentBg: '#EC489920',
    topics: [
      { topic: 'Embeddings & Storage', problems: [
        { name: 'Embedding Models & Semantic Search Fundamentals', link: 'https://www.sbert.net/', resources: ['https://platform.openai.com/docs/guides/embeddings'] },
        { name: 'Vector Databases (Pinecone, FAISS, ChromaDB, Weaviate)', link: 'https://www.pinecone.io/learn/', resources: ['https://docs.trychroma.com/', 'https://github.com/facebookresearch/faiss'] }
      ]},
      { topic: 'Pipeline Core', problems: [
        { name: 'Chunking Strategies (Fixed, Semantic, Recursive, Agentic)', link: 'https://python.langchain.com/docs/concepts/text_splitters/', resources: ['https://www.llamaindex.ai/blog/evaluating-the-ideal-chunk-size'] },
        { name: 'RAG Pipeline Architecture (End-to-End Naive RAG)', link: 'https://python.langchain.com/docs/tutorials/rag/', resources: ['https://docs.llamaindex.ai/en/stable/getting_started/starter_example/'] }
      ]}
    ]
  },
  {
    group: 'Advanced & Production RAG', icon: 'hub', tier: 1, accentColor: '#EC4899', accentBg: '#EC489920',
    topics: [
      { topic: 'Advanced Retrieval', problems: [
        { name: 'Advanced RAG (Hybrid Search, Re-ranking, Query Expansion)', link: 'https://docs.llamaindex.ai/en/stable/optimizing/advanced_retrieval/', resources: ['https://www.pinecone.io/learn/hybrid-search/'] },
        { name: 'Multi-Modal RAG (Documents, Images, Tables, PDFs)', link: 'https://docs.llamaindex.ai/en/stable/examples/multi_modal/', resources: ['https://unstructured.io/'] },
        { name: 'Knowledge Graphs & Graph RAG', link: 'https://microsoft.github.io/graphrag/', resources: ['https://neo4j.com/developer-blog/graphrag-llm-knowledge-graph-builder/'] }
      ]},
      { topic: 'Evaluation & Production', problems: [
        { name: 'RAG Evaluation (Retrieval Metrics, Faithfulness, Relevance)', link: 'https://docs.ragas.io/', resources: ['https://docs.confident-ai.com/'] },
        { name: 'Caching & Performance Optimization for RAG', link: 'https://gptcache.readthedocs.io/' },
        { name: 'Production RAG (Versioning, Indexing Pipelines, Updates)', link: 'https://docs.llamaindex.ai/en/stable/module_guides/indexing/' },
        { name: 'Enterprise RAG (Multi-Tenancy, Access Control, Compliance)', link: 'https://www.pinecone.io/learn/series/rag/rag-security/' }
      ]}
    ]
  }
];

const AGENT_GROUPS: TopicGroup[] = [
  {
    group: 'Agent Foundations', icon: 'smart_toy', tier: 1, accentColor: '#F97316', accentBg: '#F9731620',
    topics: [
      { topic: 'Core Patterns', problems: [
        { name: 'AI Agent Fundamentals (ReAct, Plan-and-Execute, Reflexion)', link: 'https://www.promptingguide.ai/techniques/react', resources: ['https://arxiv.org/abs/2210.03629'] },
        { name: 'Function Calling & Tool Use Patterns', link: 'https://platform.openai.com/docs/guides/function-calling', resources: ['https://docs.anthropic.com/en/docs/build-with-claude/tool-use'] },
        { name: 'Model Context Protocol (MCP) & Tool Servers', link: 'https://modelcontextprotocol.io/', resources: ['https://github.com/modelcontextprotocol'] }
      ]},
      { topic: 'Memory & Multi-Agent', problems: [
        { name: 'Agent Memory Systems (Buffer, Summary, Vector, Episodic)', link: 'https://python.langchain.com/docs/concepts/memory/', resources: ['https://www.pinecone.io/learn/series/langchain/langchain-conversational-memory/'] },
        { name: 'Multi-Agent Systems (CrewAI, AutoGen, LangGraph)', link: 'https://langchain-ai.github.io/langgraph/', resources: ['https://docs.crewai.com/', 'https://microsoft.github.io/autogen/'] },
        { name: 'Agent Orchestration & Complex Workflow Design', link: 'https://langchain-ai.github.io/langgraph/concepts/high_level/' }
      ]}
    ]
  },
  {
    group: 'Specialized Agents', icon: 'bolt', tier: 1, accentColor: '#F97316', accentBg: '#F9731620',
    topics: [
      { topic: 'Agent Types', problems: [
        { name: 'Voice AI & Conversational Agents (Whisper, TTS, Realtime API)', link: 'https://platform.openai.com/docs/guides/realtime', resources: ['https://github.com/openai/whisper'] },
        { name: 'Code Generation Agents & AI-Assisted Development', link: 'https://github.com/features/copilot', resources: ['https://cursor.sh/'] },
        { name: 'Web Browsing & Data Extraction Agents', link: 'https://playwright.dev/', resources: ['https://github.com/browser-use/browser-use'] },
        { name: 'Complex Workflow Automation with AI (ETL, Reports, Ops)', link: 'https://n8n.io/', resources: ['https://zapier.com/ai'] }
      ]},
      { topic: 'Safety & Debugging', problems: [
        { name: 'Human-in-the-Loop & Agent Supervision Patterns', link: 'https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/' },
        { name: 'Agent Evaluation, Debugging & Trace Analysis', link: 'https://docs.smith.langchain.com/', resources: ['https://docs.arize.com/phoenix'] },
        { name: 'Guardrails, Output Validation & Agent Safety', link: 'https://www.guardrailsai.com/', resources: ['https://github.com/NVIDIA/NeMo-Guardrails'] }
      ]}
    ]
  }
];

const OPS_GROUPS: TopicGroup[] = [
  {
    group: 'Serving & Infrastructure', icon: 'rocket_launch', tier: 1, accentColor: '#F59E0B', accentBg: '#F59E0B20',
    topics: [
      { topic: 'APIs & Containers', problems: [
        { name: 'REST APIs for AI (FastAPI, Streaming Responses)', link: 'https://fastapi.tiangolo.com/tutorial/', resources: ['https://fastapi.tiangolo.com/advanced/custom-response/#streamingresponse'] },
        { name: 'Docker & Kubernetes for AI Workloads', link: 'https://docs.docker.com/get-started/', resources: ['https://kubernetes.io/docs/tutorials/'] },
        { name: 'Model Serving at Scale (vLLM, Triton, TGI)', link: 'https://docs.vllm.ai/', resources: ['https://huggingface.co/docs/text-generation-inference/'] }
      ]},
      { topic: 'Cloud & Gateway', problems: [
        { name: 'Cloud AI Platforms (AWS SageMaker, GCP Vertex, Azure AI)', link: 'https://aws.amazon.com/sagemaker/', resources: ['https://cloud.google.com/vertex-ai'] },
        { name: 'LLM Gateway & API Management (Rate Limiting, Fallbacks)', link: 'https://github.com/BerriAI/litellm', resources: ['https://portkey.ai/'] }
      ]}
    ]
  },
  {
    group: 'Operations & Scale', icon: 'monitoring', tier: 1, accentColor: '#F59E0B', accentBg: '#F59E0B20',
    topics: [
      { topic: 'CI/CD & Tracking', problems: [
        { name: 'CI/CD for AI Applications (Testing, Versioning, Rollback)', link: 'https://docs.github.com/en/actions', resources: ['https://dvc.org/'] },
        { name: 'Experiment Tracking & Model Registry (MLflow, W&B)', link: 'https://mlflow.org/docs/latest/index.html', resources: ['https://docs.wandb.ai/'] }
      ]},
      { topic: 'Monitoring & Scale', problems: [
        { name: 'Monitoring & Observability (LangSmith, Langfuse, Phoenix)', link: 'https://docs.smith.langchain.com/', resources: ['https://langfuse.com/docs'] },
        { name: 'Data Pipelines & ETL for AI (Airflow, Kafka)', link: 'https://airflow.apache.org/docs/', resources: ['https://kafka.apache.org/documentation/'] },
        { name: 'GPU Management & Cost Optimization (Spot, Serverless)', link: 'https://modal.com/', resources: ['https://www.runpod.io/'] },
        { name: 'Scalability Patterns (Caching, Queuing, Load Balancing)', link: 'https://redis.io/docs/', resources: ['https://docs.celeryq.dev/'] }
      ]}
    ]
  }
];

const LEAD_GROUPS: TopicGroup[] = [
  {
    group: 'Evaluation & Safety', icon: 'verified_user', tier: 1, accentColor: '#EF4444', accentBg: '#EF444420',
    topics: [
      { topic: 'LLM Evaluation', problems: [
        { name: 'LLM Evaluation Frameworks (Automated Evals & Benchmarks)', link: 'https://github.com/openai/evals', resources: ['https://docs.confident-ai.com/', 'https://docs.ragas.io/'] },
        { name: 'Human Evaluation Design & Annotation Pipelines', link: 'https://labelstud.io/', resources: ['https://scale.com/'] }
      ]},
      { topic: 'Safety & Security', problems: [
        { name: 'Hallucination Detection & Mitigation Strategies', link: 'https://arxiv.org/abs/2311.05232', resources: ['https://www.vectara.com/blog/hallucination-evaluation-model'] },
        { name: 'Red Teaming & Adversarial Testing for LLMs', link: 'https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/red-teaming', resources: ['https://github.com/leondz/garak'] },
        { name: 'AI Security (Prompt Injection, Data Leakage, PII Protection)', link: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/', resources: ['https://github.com/protectai/rebuff'] }
      ]}
    ]
  },
  {
    group: 'Leadership & Strategy', icon: 'architecture', tier: 1, accentColor: '#EF4444', accentBg: '#EF444420',
    topics: [
      { topic: 'Responsible AI', problems: [
        { name: 'Bias Detection & Fairness in AI Systems', link: 'https://fairlearn.org/', resources: ['https://aif360.mybluemix.net/'] },
        { name: 'Explainability (SHAP, LIME, Attention Analysis)', link: 'https://shap.readthedocs.io/', resources: ['https://github.com/marcotcr/lime'] },
        { name: 'AI Governance, Compliance & Regulatory Landscape', link: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai', resources: ['https://www.nist.gov/artificial-intelligence'] }
      ]},
      { topic: 'Architecture & Strategy', problems: [
        { name: 'AI System Architecture & Design Patterns', link: 'https://huyenchip.com/2024/03/14/ai-ux.html', resources: ['https://applied-llms.org/'] },
        { name: 'Build vs Buy: LLM Provider Selection & Vendor Evaluation', link: 'https://artificialanalysis.ai/', resources: ['https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard'] },
        { name: 'AI Project Management & Team Structure', link: 'https://pair.withgoogle.com/guidebook/', resources: ['https://www.oreilly.com/radar/ai-product-management-after-the-hype/'] },
        { name: 'AI Product Strategy & Business Impact Measurement', link: 'https://a16z.com/emerging-architectures-for-llm-applications/' }
      ]}
    ]
  }
];

export const aiAdapter: ExamTopicBank = {
  examId: 'ai_engineer',
  getGroups: (subjectName: string) => {
    switch (subjectName) {
      case 'Core Foundations':            return CF_GROUPS;
      case 'ML & Deep Learning':          return MLDL_GROUPS;
      case 'NLP & Language Understanding': return NLP_GROUPS;
      case 'LLM Mastery':                 return LLM_GROUPS;
      case 'RAG & Knowledge Systems':     return RAG_GROUPS;
      case 'AI Agents & Automation':      return AGENT_GROUPS;
      case 'Production AI & MLOps':       return OPS_GROUPS;
      case 'AI Leadership & Safety':      return LEAD_GROUPS;
      default: return [...CF_GROUPS, ...MLDL_GROUPS, ...NLP_GROUPS, ...LLM_GROUPS, ...RAG_GROUPS, ...AGENT_GROUPS, ...OPS_GROUPS, ...LEAD_GROUPS];
    }
  },
};
