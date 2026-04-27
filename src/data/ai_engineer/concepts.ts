import type { Concept } from '../../core/types';

// Helper to create concepts concisely
const c = (id: string, subject: string, chapter: string, unit: number, name: string, difficulty: number, pyqTier: 1|2|3|4, competingIds: string[], tags: string[], stakesTier: 1|2|3 = 1): Concept => ({
  id, subject, chapter, unit, name, difficulty, pyqTier, competingIds, tags, stage: 'Unseen', stability: 0, lastTested: -1, nextReview: -1, stakesTier
});

// ── Layer 9: Emotional Stakes Facts ──────────────────────────────────────────
const STAKES: Record<string, string> = {
  ai_cf_1: 'Every AI startup interview starts with a Python coding round — async generators alone can eliminate 40% of candidates.',
  ai_cf_2: 'Data scientists spend 80% of their time wrangling data. Pandas mastery = 10x faster feature engineering.',
  ai_cf_3: 'SQL is the #1 most tested skill in AI Engineer take-home assignments at Google, Meta, and OpenAI.',
  ai_cf_4: 'Without linear algebra, you cannot understand how embeddings work — the foundation of all modern AI.',
  ai_cf_5: 'Git mistakes have caused production outages at companies. One bad force-push can cost millions.',
  ai_cf_6: 'A well-crafted Streamlit demo in an interview can outweigh 3 months of theoretical knowledge.',
  ai_mldl_1: 'XGBoost still wins 70%+ of tabular ML competitions on Kaggle — knowing when to use it vs deep learning is critical.',
  ai_mldl_2: 'Anomaly detection using clustering caught a $2B fraud ring at a major bank — unsupervised ML saves industries.',
  ai_mldl_3: 'Wrong evaluation metrics led a healthcare AI to optimize for accuracy while missing 90% of cancer cases.',
  ai_mldl_4: 'Understanding backpropagation separates engineers who debug models from those who blindly copy-paste.',
  ai_mldl_5: 'PyTorch is used by 77% of AI research papers — it is the language of modern deep learning.',
  ai_mldl_6: 'Vision Transformers now outperform CNNs on ImageNet — understanding both architectures is non-negotiable.',
  ai_mldl_7: 'Time-series forecasting powers billion-dollar trading systems and demand prediction at Amazon.',
  ai_nlp_1: 'Tokenization bugs have caused LLMs to hallucinate on non-English languages — understanding BPE prevents this.',
  ai_nlp_2: 'Word embeddings encode societal biases (doctor→man, nurse→woman). Understanding them is an ethical imperative.',
  ai_nlp_3: 'Sentiment analysis powers every product review system. One misclassification can bury a product launch.',
  ai_nlp_4: 'The Hugging Face hub has 500K+ models. Knowing this ecosystem is like knowing npm for AI.',
  ai_nlp_5: 'The Transformer paper "Attention Is All You Need" has 100K+ citations — it changed computing forever.',
  ai_nlp_6: 'Companies spend $100K+ on fine-tuning vs pre-training decisions. Wrong choice = months of wasted compute.',
  ai_llm_1: 'Every GenAI product starts with an API call. Mastering OpenAI/Claude APIs is your entry ticket.',
  ai_llm_2: 'Chain-of-thought prompting improved GPT-4 math accuracy from 35% to 92% — prompting is a real skill.',
  ai_llm_3: 'Structured output eliminates 90% of parsing bugs in production LLM apps. JSON mode is essential.',
  ai_llm_4: 'Context window mismanagement causes silent data loss — your RAG app answers wrong without any error.',
  ai_llm_5: 'LoRA fine-tuning reduced GPT training costs from $100K to $100. This democratized custom AI.',
  ai_llm_6: 'RLHF is why ChatGPT feels helpful. Without alignment, LLMs produce toxic, dangerous outputs.',
  ai_llm_7: 'Quantization makes 70B models run on a single GPU. This is how startups compete with OpenAI.',
  ai_llm_8: 'Multimodal AI is the next platform shift — GPT-4V and Gemini are replacing entire vision pipelines.',
  ai_llm_9: 'Open-source LLMs (Llama, Mistral) let you own your AI. No vendor lock-in, no data leaving your servers.',
  ai_llm_10: 'vLLM serves 24x more requests than naive inference. This is the difference between demo and production.',
  ai_rag_1: 'Choosing the wrong embedding model can drop RAG accuracy by 40%. Semantic search quality = embedding quality.',
  ai_rag_2: 'Vector DB choice affects latency by 100x. Wrong choice at scale = $50K/month in wasted cloud spend.',
  ai_rag_3: 'Bad chunking is the #1 reason RAG apps give wrong answers. Most teams debug the LLM when the bug is in chunking.',
  ai_rag_4: 'RAG is the most hired-for skill in AI Engineering. Every company with private data needs a RAG pipeline.',
  ai_rag_5: 'Hybrid search (BM25 + semantic) outperforms pure vector search by 15-30% on real-world benchmarks.',
  ai_rag_6: 'Multi-modal RAG on PDFs with tables is an unsolved problem — solving it makes you invaluable.',
  ai_rag_7: 'Knowledge graphs + RAG (GraphRAG) reduced hallucinations by 50% in Microsoft internal benchmarks.',
  ai_rag_8: 'Without RAG evaluation, you ship hallucinating products. RAGAS and faithfulness metrics are non-negotiable.',
  ai_rag_9: 'Semantic caching can cut LLM API costs by 70%. One cache layer = thousands saved per month.',
  ai_rag_10: 'Production RAG needs incremental indexing — re-indexing 10M documents on every update is a $10K mistake.',
  ai_rag_11: 'Enterprise clients won\'t buy your AI if it lacks access control. Multi-tenancy is a deal-breaker.',
  ai_agt_1: 'ReAct agents outperform chain-of-thought by 30% on complex tasks. This is how AI "thinks and acts".',
  ai_agt_2: 'Function calling turned chatbots into powerful tools that can book flights, query databases, and send emails.',
  ai_agt_3: 'MCP is the USB-C of AI tools — one protocol to connect any LLM to any tool. Early adopters win.',
  ai_agt_4: 'Without memory, agents repeat mistakes endlessly. Memory systems are what make agents truly intelligent.',
  ai_agt_5: 'Multi-agent systems at Salesforce automate entire customer support workflows — replacing 100-person teams.',
  ai_agt_6: 'Poorly orchestrated agents can run in infinite loops burning $1000s in API credits per hour.',
  ai_agt_7: 'Autonomous AI without human oversight caused a stock trading bot to lose $440M in 45 minutes.',
  ai_agt_8: 'Voice AI is a $30B market. Real-time conversational agents are replacing call centers globally.',
  ai_agt_9: 'AI coding assistants (Copilot, Cursor) generate 40% of all code at major tech companies.',
  ai_agt_10: 'Web scraping agents extract competitive intelligence worth millions — a critical business tool.',
  ai_agt_11: 'Debugging agents without traces is like debugging production without logs — impossible at scale.',
  ai_agt_12: 'AI workflow automation saves enterprises 10,000+ human hours per month on repetitive tasks.',
  ai_agt_13: 'An unguarded agent once leaked a car dealership\'s internal pricing, costing them millions in lost revenue.',
  ai_ops_1: 'FastAPI + streaming responses is the standard for serving LLMs. Every AI company uses this pattern.',
  ai_ops_2: 'Docker containerization is required for 95% of AI job postings. No Docker = no deployment.',
  ai_ops_3: 'Wrong cloud architecture can cost 10x more. A $5K/month bill could be $500 with proper setup.',
  ai_ops_4: 'LLM gateways with fallbacks prevent 3AM outages when OpenAI goes down (which happens monthly).',
  ai_ops_5: 'vLLM serves models 24x faster than HuggingFace default. This is production vs prototype.',
  ai_ops_6: 'Without CI/CD, every deployment is a manual risk. AI teams ship 10x faster with automated pipelines.',
  ai_ops_7: 'LangSmith tracing caught a prompt injection attack in production that could have leaked customer data.',
  ai_ops_8: 'ETL pipeline failures at 3AM are the #1 cause of AI system downtime. Airflow monitoring prevents this.',
  ai_ops_9: 'Spot instances can cut GPU costs by 70%. One config change = $50K/year saved.',
  ai_ops_10: 'Without MLflow, teams lose track of which model version is in production. This causes silent regressions.',
  ai_ops_11: 'Proper caching and queuing turned a $10K/month LLM bill into $800. Architecture > throwing money.',
  ai_lead_1: 'Companies that don\'t eval their LLMs ship hallucinating products. Automated evals catch 80% of regressions.',
  ai_lead_2: 'Human evaluation design is what separates a good AI product from a great one. RLHF depends on this.',
  ai_lead_3: 'A medical AI hallucinated drug interactions, nearly causing patient harm. Hallucination detection saves lives.',
  ai_lead_4: 'Amazon\'s AI recruiting tool was scrapped because it discriminated against women. Bias detection is mandatory.',
  ai_lead_5: 'Regulators now require AI explainability. SHAP explanations are legally required in EU financial AI.',
  ai_lead_6: 'Red teaming found that GPT-4 could help synthesize bioweapons. Adversarial testing prevents catastrophic misuse.',
  ai_lead_7: 'Bad AI architecture decisions cost companies 6-12 months of rework. Getting it right from day one is everything.',
  ai_lead_8: 'Choosing GPT-4 when Llama-3 would suffice costs $500K/year extra. Build vs buy decisions define budgets.',
  ai_lead_9: 'AI projects have a 85% failure rate. Proper project management and team structure is the difference.',
  ai_lead_10: 'The EU AI Act can fine companies up to 7% of global revenue for non-compliance. Governance is not optional.',
  ai_lead_11: 'Prompt injection attacks can make your AI leak all user data. AI security is cybersecurity 2.0.',
  ai_lead_12: 'Companies that measure AI ROI retain 3x more executive support and budget for their AI teams.',
};

// ── Layer 5: Synaptic Tagging (study these within 2h of each other) ─────────
const RELATED: Record<string, string[]> = {
  // Foundations → ML bridge
  ai_cf_4: ['ai_mldl_4', 'ai_nlp_5'],           // Math → Backprop, Transformers
  ai_cf_2: ['ai_mldl_1', 'ai_mldl_3'],           // Pandas → Supervised ML, Evaluation
  // ML → DL bridge
  ai_mldl_4: ['ai_mldl_5', 'ai_cf_4'],           // Backprop → PyTorch, Math
  ai_mldl_5: ['ai_mldl_6', 'ai_mldl_7'],         // PyTorch → CNNs, RNNs
  // NLP → LLM bridge
  ai_nlp_1: ['ai_nlp_2', 'ai_llm_4'],            // Tokenization → Embeddings, Context Windows
  ai_nlp_5: ['ai_llm_1', 'ai_nlp_6'],            // Transformers → LLM APIs, Pre-train vs Fine-tune
  ai_nlp_2: ['ai_rag_1', 'ai_llm_8'],            // Word Embeddings → Semantic Search, Multimodal
  // LLM internal links
  ai_llm_1: ['ai_llm_2', 'ai_llm_3'],            // APIs → Prompting, Structured Output
  ai_llm_5: ['ai_llm_6', 'ai_llm_7'],            // Fine-tuning → RLHF, Quantization
  ai_llm_9: ['ai_llm_7', 'ai_llm_10'],           // Open-source → Quantization, Inference
  // RAG pipeline chain
  ai_rag_1: ['ai_rag_2', 'ai_nlp_2'],            // Embeddings → Vector DBs, Word Embeddings
  ai_rag_3: ['ai_rag_4', 'ai_rag_5'],            // Chunking → RAG Pipeline, Advanced RAG
  ai_rag_4: ['ai_rag_8', 'ai_rag_3'],            // RAG Pipeline → RAG Eval, Chunking
  ai_rag_5: ['ai_rag_7', 'ai_rag_6'],            // Advanced RAG → GraphRAG, Multi-modal
  ai_rag_10: ['ai_rag_11', 'ai_rag_9'],          // Production RAG → Enterprise, Caching
  // Agent ecosystem
  ai_agt_1: ['ai_agt_2', 'ai_agt_4'],            // Agent Fundamentals → Function Calling, Memory
  ai_agt_2: ['ai_agt_3', 'ai_llm_3'],            // Function Calling → MCP, Structured Output
  ai_agt_5: ['ai_agt_6', 'ai_agt_4'],            // Multi-Agent → Orchestration, Memory
  ai_agt_7: ['ai_agt_13', 'ai_lead_3'],          // HITL → Guardrails, Hallucination Detection
  ai_agt_8: ['ai_llm_8', 'ai_agt_12'],           // Voice AI → Multimodal, Workflow Automation
  // Ops chain
  ai_ops_1: ['ai_ops_2', 'ai_ops_4'],            // FastAPI → Docker, LLM Gateway
  ai_ops_5: ['ai_llm_10', 'ai_ops_11'],          // Model Serving → Inference Opt, Scalability
  ai_ops_7: ['ai_agt_11', 'ai_lead_1'],          // Observability → Agent Debugging, LLM Evals
  // Leadership connections
  ai_lead_1: ['ai_rag_8', 'ai_lead_2'],          // Automated Evals → RAG Eval, Human Eval
  ai_lead_3: ['ai_lead_6', 'ai_agt_13'],         // Hallucination → Red Teaming, Guardrails
  ai_lead_7: ['ai_lead_8', 'ai_ops_11'],         // Architecture → Build vs Buy, Scalability
  ai_lead_11: ['ai_agt_13', 'ai_lead_10'],       // Security → Guardrails, Governance
};

// Apply neuroscience layers to all concepts
const enhance = (concepts: Concept[]): Concept[] =>
  concepts.map(c => ({
    ...c,
    ...(STAKES[c.id] && { stakesFact: STAKES[c.id] }),
    ...(RELATED[c.id] && { relatedIds: RELATED[c.id] }),
  }));

const _RAW: Concept[] = [
  // ═══ 1. Core Foundations (6) ═══════════════════════════════════════════════
  c('ai_cf_1', 'Core Foundations', 'Python', 1, 'Advanced Python (Async, Decorators, Generators, Type Hints)', 2, 1, [], ['hands-on','python','interview-critical']),
  c('ai_cf_2', 'Core Foundations', 'Python', 1, 'NumPy, Pandas & Data Wrangling at Scale', 2, 1, ['ai_cf_6'], ['hands-on','python','data']),
  c('ai_cf_3', 'Core Foundations', 'Data', 2, 'SQL for Analytics (CTEs, Window Functions, Query Optimization)', 3, 1, [], ['hands-on','data','interview-critical']),
  c('ai_cf_4', 'Core Foundations', 'Mathematics', 3, 'Linear Algebra & Probability for AI', 3, 1, [], ['theory','math']),
  c('ai_cf_5', 'Core Foundations', 'Tooling', 4, 'Git, GitHub & Collaborative Engineering Workflows', 1, 1, [], ['hands-on','tooling']),
  c('ai_cf_6', 'Core Foundations', 'Tooling', 4, 'Data Visualization & Storytelling (Matplotlib, Plotly, Streamlit)', 2, 2, ['ai_cf_2'], ['hands-on','python','portfolio-project'], 2),

  // ═══ 2. ML & Deep Learning (7) ════════════════════════════════════════════
  c('ai_mldl_1', 'ML & Deep Learning', 'Supervised', 1, 'Supervised Learning (Regression, Trees, Boosting, SVM)', 2, 1, ['ai_mldl_2'], ['hands-on','python','interview-critical']),
  c('ai_mldl_2', 'ML & Deep Learning', 'Unsupervised', 2, 'Unsupervised Learning (Clustering, PCA, Anomaly Detection)', 3, 2, ['ai_mldl_1'], ['theory','conceptual'], 2),
  c('ai_mldl_3', 'ML & Deep Learning', 'Evaluation', 3, 'Model Evaluation, Metrics & Hyperparameter Tuning', 2, 1, [], ['hands-on','interview-critical']),
  c('ai_mldl_4', 'ML & Deep Learning', 'Neural Networks', 4, 'Neural Network Fundamentals (Backprop, Optimizers, Loss)', 3, 1, ['ai_mldl_5'], ['theory','interview-critical']),
  c('ai_mldl_5', 'ML & Deep Learning', 'Frameworks', 5, 'PyTorch Framework Mastery (Tensors, Autograd, DataLoader)', 2, 1, ['ai_mldl_4'], ['hands-on','python','interview-critical']),
  c('ai_mldl_6', 'ML & Deep Learning', 'Vision', 6, 'CNNs, Vision Models & Transfer Learning', 3, 2, ['ai_mldl_7'], ['theory','cv'], 2),
  c('ai_mldl_7', 'ML & Deep Learning', 'Sequences', 7, 'Sequence Models (RNNs, LSTMs) & Time-Series', 3, 2, ['ai_mldl_6'], ['theory','nlp'], 2),

  // ═══ 3. NLP & Language Understanding (6) ══════════════════════════════════
  c('ai_nlp_1', 'NLP & Language Understanding', 'Representation', 1, 'Tokenization (BPE, WordPiece, SentencePiece)', 2, 1, ['ai_nlp_2'], ['theory','nlp','interview-critical']),
  c('ai_nlp_2', 'NLP & Language Understanding', 'Representation', 1, 'Word Embeddings & Contextual Representations', 3, 1, ['ai_nlp_1'], ['theory','nlp']),
  c('ai_nlp_3', 'NLP & Language Understanding', 'Tasks', 2, 'Text Classification, Sentiment Analysis & NER', 2, 1, [], ['hands-on','nlp','portfolio-project']),
  c('ai_nlp_4', 'NLP & Language Understanding', 'Ecosystem', 3, 'Hugging Face Ecosystem (Transformers, Datasets, Pipelines)', 2, 1, [], ['hands-on','python','interview-critical']),
  c('ai_nlp_5', 'NLP & Language Understanding', 'Architecture', 4, 'Transformer Architecture & Self-Attention Deep Dive', 4, 1, ['ai_nlp_6'], ['theory','interview-critical']),
  c('ai_nlp_6', 'NLP & Language Understanding', 'Architecture', 4, 'Pre-training vs Fine-tuning Paradigms', 3, 1, ['ai_nlp_5'], ['conceptual','interview-critical']),

  // ═══ 4. LLM Mastery & Prompt Engineering (10) ═════════════════════════════
  c('ai_llm_1', 'LLM Mastery', 'APIs', 1, 'LLM API Mastery (OpenAI, Claude, Gemini, Llama)', 1, 1, ['ai_llm_9'], ['hands-on','api','interview-critical']),
  c('ai_llm_2', 'LLM Mastery', 'Prompting', 2, 'Prompt Engineering (Zero/Few-Shot, CoT, Tree-of-Thought)', 2, 1, [], ['hands-on','interview-critical']),
  c('ai_llm_3', 'LLM Mastery', 'APIs', 1, 'Structured Output, JSON Mode & Schema Enforcement', 2, 1, ['ai_llm_4'], ['hands-on','api']),
  c('ai_llm_4', 'LLM Mastery', 'APIs', 1, 'Context Window Management & Long-Context Strategies', 3, 1, ['ai_llm_3'], ['conceptual','interview-critical']),
  c('ai_llm_5', 'LLM Mastery', 'Fine-tuning', 3, 'Fine-tuning LLMs (PEFT, LoRA, QLoRA, Full Fine-tune)', 5, 1, ['ai_llm_6'], ['hands-on','python','interview-critical']),
  c('ai_llm_6', 'LLM Mastery', 'Fine-tuning', 3, 'Instruction Tuning, RLHF & DPO Alignment', 5, 1, ['ai_llm_5'], ['theory','interview-critical']),
  c('ai_llm_7', 'LLM Mastery', 'Optimization', 4, 'Model Quantization (GPTQ, AWQ, GGUF) & Compression', 4, 1, ['ai_llm_10'], ['hands-on','python']),
  c('ai_llm_8', 'LLM Mastery', 'Multimodal', 5, 'Multimodal Models (Vision-Language, Audio, CLIP)', 3, 1, [], ['conceptual','cv']),
  c('ai_llm_9', 'LLM Mastery', 'Open Source', 6, 'Open-Source LLM Ecosystem (Llama, Mistral, Gemma, Qwen)', 2, 1, ['ai_llm_1'], ['conceptual','interview-critical']),
  c('ai_llm_10', 'LLM Mastery', 'Optimization', 4, 'LLM Inference Optimization (vLLM, TensorRT-LLM, Batching)', 4, 1, ['ai_llm_7'], ['hands-on','cloud']),

  // ═══ 5. RAG & Knowledge Systems (11) ══════════════════════════════════════
  c('ai_rag_1', 'RAG & Knowledge Systems', 'Embeddings', 1, 'Embedding Models & Semantic Search Fundamentals', 2, 1, ['ai_rag_2'], ['hands-on','nlp','interview-critical']),
  c('ai_rag_2', 'RAG & Knowledge Systems', 'Storage', 2, 'Vector Databases (Pinecone, FAISS, ChromaDB, Weaviate)', 3, 1, ['ai_rag_1'], ['hands-on','data','interview-critical']),
  c('ai_rag_3', 'RAG & Knowledge Systems', 'Ingestion', 3, 'Chunking Strategies (Fixed, Semantic, Recursive, Agentic)', 3, 1, ['ai_rag_4'], ['hands-on','interview-critical']),
  c('ai_rag_4', 'RAG & Knowledge Systems', 'Pipeline', 4, 'RAG Pipeline Architecture (End-to-End Naive RAG)', 3, 1, ['ai_rag_3','ai_rag_5'], ['hands-on','interview-critical','portfolio-project']),
  c('ai_rag_5', 'RAG & Knowledge Systems', 'Advanced', 5, 'Advanced RAG (Hybrid Search, Re-ranking, Query Expansion)', 4, 1, ['ai_rag_4'], ['hands-on','interview-critical']),
  c('ai_rag_6', 'RAG & Knowledge Systems', 'Advanced', 5, 'Multi-Modal RAG (Documents, Images, Tables, PDFs)', 4, 1, [], ['hands-on','portfolio-project']),
  c('ai_rag_7', 'RAG & Knowledge Systems', 'Graphs', 6, 'Knowledge Graphs & Graph RAG', 4, 1, ['ai_rag_5'], ['conceptual','interview-critical']),
  c('ai_rag_8', 'RAG & Knowledge Systems', 'Evaluation', 7, 'RAG Evaluation (Retrieval Metrics, Faithfulness, Relevance)', 3, 1, [], ['hands-on','interview-critical']),
  c('ai_rag_9', 'RAG & Knowledge Systems', 'Production', 8, 'Caching & Performance Optimization for RAG', 3, 1, ['ai_rag_10'], ['hands-on','cloud']),
  c('ai_rag_10', 'RAG & Knowledge Systems', 'Production', 8, 'Production RAG (Versioning, Indexing Pipelines, Updates)', 4, 1, ['ai_rag_9','ai_rag_11'], ['hands-on','interview-critical']),
  c('ai_rag_11', 'RAG & Knowledge Systems', 'Enterprise', 9, 'Enterprise RAG (Multi-Tenancy, Access Control, Compliance)', 4, 1, ['ai_rag_10'], ['conceptual','interview-critical']),

  // ═══ 6. AI Agents & Autonomous Systems (13) ═══════════════════════════════
  c('ai_agt_1', 'AI Agents & Automation', 'Fundamentals', 1, 'AI Agent Fundamentals (ReAct, Plan-and-Execute, Reflexion)', 3, 1, ['ai_agt_5'], ['theory','interview-critical']),
  c('ai_agt_2', 'AI Agents & Automation', 'Tools', 2, 'Function Calling & Tool Use Patterns', 2, 1, ['ai_agt_3'], ['hands-on','api','interview-critical']),
  c('ai_agt_3', 'AI Agents & Automation', 'Tools', 2, 'Model Context Protocol (MCP) & Tool Servers', 3, 1, ['ai_agt_2'], ['hands-on','api','interview-critical']),
  c('ai_agt_4', 'AI Agents & Automation', 'Memory', 3, 'Agent Memory Systems (Buffer, Summary, Vector, Episodic)', 4, 1, ['ai_agt_5'], ['conceptual','interview-critical']),
  c('ai_agt_5', 'AI Agents & Automation', 'Multi-Agent', 4, 'Multi-Agent Systems (CrewAI, AutoGen, LangGraph)', 4, 1, ['ai_agt_1','ai_agt_4'], ['hands-on','portfolio-project']),
  c('ai_agt_6', 'AI Agents & Automation', 'Orchestration', 5, 'Agent Orchestration & Complex Workflow Design', 4, 1, ['ai_agt_12'], ['hands-on','interview-critical']),
  c('ai_agt_7', 'AI Agents & Automation', 'Supervision', 6, 'Human-in-the-Loop & Agent Supervision Patterns', 3, 1, ['ai_agt_13'], ['conceptual','interview-critical']),
  c('ai_agt_8', 'AI Agents & Automation', 'Voice', 7, 'Voice AI & Conversational Agents (Whisper, TTS, Realtime API)', 3, 1, [], ['hands-on','portfolio-project']),
  c('ai_agt_9', 'AI Agents & Automation', 'Coding', 8, 'Code Generation Agents & AI-Assisted Development', 3, 1, ['ai_agt_10'], ['hands-on','portfolio-project']),
  c('ai_agt_10', 'AI Agents & Automation', 'Web', 9, 'Web Browsing & Data Extraction Agents', 3, 1, ['ai_agt_9'], ['hands-on','portfolio-project']),
  c('ai_agt_11', 'AI Agents & Automation', 'Evaluation', 10, 'Agent Evaluation, Debugging & Trace Analysis', 3, 1, [], ['hands-on','interview-critical']),
  c('ai_agt_12', 'AI Agents & Automation', 'Workflows', 11, 'Complex Workflow Automation with AI (ETL, Reports, Ops)', 4, 1, ['ai_agt_6'], ['hands-on','portfolio-project']),
  c('ai_agt_13', 'AI Agents & Automation', 'Safety', 12, 'Guardrails, Output Validation & Agent Safety', 3, 1, ['ai_agt_7'], ['hands-on','interview-critical']),

  // ═══ 7. Production AI & MLOps (11) ════════════════════════════════════════
  c('ai_ops_1', 'Production AI & MLOps', 'Serving', 1, 'REST APIs for AI (FastAPI, Streaming Responses)', 2, 1, ['ai_ops_2'], ['hands-on','python','interview-critical']),
  c('ai_ops_2', 'Production AI & MLOps', 'Containers', 2, 'Docker & Kubernetes for AI Workloads', 3, 1, ['ai_ops_1'], ['hands-on','cloud','interview-critical']),
  c('ai_ops_3', 'Production AI & MLOps', 'Cloud', 3, 'Cloud AI Platforms (AWS SageMaker, GCP Vertex, Azure AI)', 4, 1, [], ['hands-on','cloud','interview-critical'], 2),
  c('ai_ops_4', 'Production AI & MLOps', 'Gateway', 4, 'LLM Gateway & API Management (Rate Limiting, Fallbacks)', 3, 1, ['ai_ops_5'], ['hands-on','api','interview-critical']),
  c('ai_ops_5', 'Production AI & MLOps', 'Serving', 1, 'Model Serving at Scale (vLLM, Triton, TGI)', 4, 1, ['ai_ops_4'], ['hands-on','cloud']),
  c('ai_ops_6', 'Production AI & MLOps', 'CI/CD', 5, 'CI/CD for AI Applications (Testing, Versioning, Rollback)', 3, 1, ['ai_ops_10'], ['hands-on','cloud']),
  c('ai_ops_7', 'Production AI & MLOps', 'Observability', 6, 'Monitoring & Observability (LangSmith, Langfuse, Phoenix)', 3, 1, [], ['hands-on','interview-critical']),
  c('ai_ops_8', 'Production AI & MLOps', 'Data', 7, 'Data Pipelines & ETL for AI (Airflow, Kafka)', 3, 2, [], ['hands-on','data'], 2),
  c('ai_ops_9', 'Production AI & MLOps', 'Infra', 8, 'GPU Management & Cost Optimization (Spot, Serverless)', 3, 2, ['ai_ops_11'], ['conceptual','cloud'], 2),
  c('ai_ops_10', 'Production AI & MLOps', 'Tracking', 9, 'Experiment Tracking & Model Registry (MLflow, W&B)', 2, 1, ['ai_ops_6'], ['hands-on','python']),
  c('ai_ops_11', 'Production AI & MLOps', 'Scale', 10, 'Scalability Patterns (Caching, Queuing, Load Balancing)', 4, 1, ['ai_ops_9'], ['conceptual','interview-critical']),

  // ═══ 8. AI Leadership, Evaluation & Safety (12) ═══════════════════════════
  c('ai_lead_1', 'AI Leadership & Safety', 'Evaluation', 1, 'LLM Evaluation Frameworks (Automated Evals & Benchmarks)', 3, 1, ['ai_lead_2'], ['hands-on','interview-critical']),
  c('ai_lead_2', 'AI Leadership & Safety', 'Evaluation', 1, 'Human Evaluation Design & Annotation Pipelines', 3, 1, ['ai_lead_1'], ['conceptual','interview-critical']),
  c('ai_lead_3', 'AI Leadership & Safety', 'Safety', 2, 'Hallucination Detection & Mitigation Strategies', 4, 1, ['ai_lead_6'], ['hands-on','interview-critical']),
  c('ai_lead_4', 'AI Leadership & Safety', 'Fairness', 3, 'Bias Detection & Fairness in AI Systems', 3, 1, ['ai_lead_5'], ['theory','conceptual']),
  c('ai_lead_5', 'AI Leadership & Safety', 'Explainability', 4, 'Explainability (SHAP, LIME, Attention Analysis)', 3, 1, ['ai_lead_4'], ['hands-on','python']),
  c('ai_lead_6', 'AI Leadership & Safety', 'Safety', 2, 'Red Teaming & Adversarial Testing for LLMs', 4, 1, ['ai_lead_3'], ['hands-on','interview-critical']),
  c('ai_lead_7', 'AI Leadership & Safety', 'Architecture', 5, 'AI System Architecture & Design Patterns', 4, 1, ['ai_lead_8'], ['conceptual','interview-critical']),
  c('ai_lead_8', 'AI Leadership & Safety', 'Strategy', 6, 'Build vs Buy: LLM Provider Selection & Vendor Evaluation', 3, 1, ['ai_lead_7'], ['conceptual','interview-critical']),
  c('ai_lead_9', 'AI Leadership & Safety', 'Management', 7, 'AI Project Management & Team Structure', 3, 1, [], ['conceptual','interview-critical']),
  c('ai_lead_10', 'AI Leadership & Safety', 'Governance', 8, 'AI Governance, Compliance & Regulatory Landscape', 3, 1, ['ai_lead_11'], ['conceptual']),
  c('ai_lead_11', 'AI Leadership & Safety', 'Security', 9, 'AI Security (Prompt Injection, Data Leakage, PII Protection)', 4, 1, ['ai_lead_10'], ['hands-on','interview-critical']),
  c('ai_lead_12', 'AI Leadership & Safety', 'Business', 10, 'AI Product Strategy & Business Impact Measurement', 3, 1, [], ['conceptual','interview-critical'])
];

export const AI_CONCEPTS = enhance(_RAW);
