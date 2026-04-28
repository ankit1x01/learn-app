// src/data/ai_engineer/portfolio.ts
// Portfolio projects that prove lead-level GenAI competence

export interface PortfolioProject {
  id: string;
  name: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  subjects: string[];       // which syllabus subjects this covers
  skills: string[];          // specific skills demonstrated
  icon: string;
  color: string;
  bgColor: string;
  estimatedHours: number;
}

export const AI_PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'port_rag_chatbot',
    name: 'RAG Document Chatbot',
    description: 'Build a production-ready chatbot that answers questions from your own PDF/docs using RAG, vector DB, and streaming responses.',
    difficulty: 3,
    subjects: ['RAG & Knowledge Systems', 'LLM Mastery', 'Production AI & MLOps'],
    skills: ['Embeddings', 'ChromaDB/Pinecone', 'Chunking', 'FastAPI', 'Streaming'],
    icon: 'chat_bubble',
    color: '#EC4899',
    bgColor: '#EC489915',
    estimatedHours: 25,
  },
  {
    id: 'port_multi_agent',
    name: 'Multi-Agent Research System',
    description: 'Create a multi-agent system where agents collaborate to research topics, summarize findings, and generate reports.',
    difficulty: 4,
    subjects: ['AI Agents & Automation', 'LLM Mastery'],
    skills: ['CrewAI/LangGraph', 'Agent Memory', 'Tool Use', 'Orchestration'],
    icon: 'smart_toy',
    color: '#F97316',
    bgColor: '#F9731615',
    estimatedHours: 30,
  },
  {
    id: 'port_llm_eval',
    name: 'LLM Evaluation Pipeline',
    description: 'Build an automated eval pipeline that benchmarks LLM responses for accuracy, faithfulness, and hallucination rate.',
    difficulty: 3,
    subjects: ['AI Leadership & Safety', 'RAG & Knowledge Systems'],
    skills: ['RAGAS', 'LLM-as-Judge', 'Benchmarking', 'CI/CD Integration'],
    icon: 'bar_chart',
    color: '#EF4444',
    bgColor: '#EF444415',
    estimatedHours: 20,
  },
  {
    id: 'port_fine_tune',
    name: 'Custom Fine-tuned Model',
    description: 'Fine-tune an open-source LLM on domain-specific data using LoRA, deploy it with vLLM, and benchmark against GPT-4.',
    difficulty: 5,
    subjects: ['LLM Mastery', 'Production AI & MLOps', 'ML & Deep Learning'],
    skills: ['LoRA/QLoRA', 'Hugging Face', 'vLLM', 'Quantization', 'Benchmarking'],
    icon: 'dna',
    color: '#8B5CF6',
    bgColor: '#8B5CF615',
    estimatedHours: 40,
  },
  {
    id: 'port_voice_agent',
    name: 'Voice AI Assistant',
    description: 'Build a real-time voice agent using Whisper + TTS that can take actions via function calling and MCP tools.',
    difficulty: 4,
    subjects: ['AI Agents & Automation', 'LLM Mastery', 'Production AI & MLOps'],
    skills: ['Whisper', 'TTS', 'Realtime API', 'MCP', 'WebSockets'],
    icon: 'mic',
    color: '#06B6D4',
    bgColor: '#06B6D415',
    estimatedHours: 35,
  },
  {
    id: 'port_code_agent',
    name: 'AI Code Review Agent',
    description: 'Create an agent that reviews PRs, suggests improvements, runs tests, and posts comments on GitHub via MCP.',
    difficulty: 4,
    subjects: ['AI Agents & Automation', 'Core Foundations', 'AI Leadership & Safety'],
    skills: ['GitHub API', 'MCP', 'Code Analysis', 'Guardrails', 'CI/CD'],
    icon: 'code',
    color: '#10B981',
    bgColor: '#10B98115',
    estimatedHours: 30,
  },
  {
    id: 'port_enterprise_rag',
    name: 'Enterprise RAG with Auth',
    description: 'Production RAG with multi-tenancy, role-based access control, incremental indexing, and observability dashboards.',
    difficulty: 5,
    subjects: ['RAG & Knowledge Systems', 'Production AI & MLOps', 'AI Leadership & Safety'],
    skills: ['Multi-Tenancy', 'RBAC', 'LangFuse', 'Docker', 'PostgreSQL'],
    icon: 'domain',
    color: '#F59E0B',
    bgColor: '#F59E0B15',
    estimatedHours: 50,
  },
  {
    id: 'port_ai_saas',
    name: 'AI SaaS MVP',
    description: 'Ship a complete AI-powered SaaS product with auth, billing, LLM gateway, rate limiting, and usage analytics.',
    difficulty: 5,
    subjects: ['Production AI & MLOps', 'AI Leadership & Safety', 'LLM Mastery'],
    skills: ['System Architecture', 'LiteLLM', 'Stripe', 'Analytics', 'Cost Optimization'],
    icon: 'rocket_launch',
    color: '#7C3AED',
    bgColor: '#7C3AED15',
    estimatedHours: 60,
  },
];
