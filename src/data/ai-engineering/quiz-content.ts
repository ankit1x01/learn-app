// Auto-generated quiz content from lessons
// Generated at: 2026-04-30T06:07:42.369Z
// DO NOT EDIT MANUALLY - run: npm run generate-quiz-content

export interface QuizQuestion {
  stage: 'pre' | 'post';
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface QuizData {
  questions: QuizQuestion[];
}

export const quizContent: Record<string, QuizData> = {
  "16-multi-agent-and-swarms/03-communication-protocols": {
    "questions": [
      {
        "stage": "pre",
        "question": "What problem does MCP (Model Context Protocol) solve for AI agents?",
        "options": [
          "It provides a standard format for training data",
          "It gives agents a standard way to discover and use tools exposed by external servers, without hardcoding tool implementations",
          "It encrypts communication between agents",
          "It compresses large context windows to fit in smaller models"
        ],
        "correct": 1,
        "explanation": "MCP standardizes tool access: a server exposes tools with JSON schemas, and any MCP-compatible agent can discover and call them. This decouples tool implementation from agent code."
      },
      {
        "stage": "pre",
        "question": "What is the difference between MCP and A2A?",
        "options": [
          "MCP is for Python agents and A2A is for JavaScript agents",
          "MCP connects agents to tools (agent-to-tool), while A2A connects agents to other agents (agent-to-agent) for task delegation",
          "MCP is synchronous and A2A is asynchronous",
          "MCP is open source and A2A is proprietary"
        ],
        "correct": 1,
        "explanation": "MCP is the protocol for tool access (an agent calls a tool). A2A is the protocol for agent collaboration (an agent delegates a task to another agent). They solve different layers of the communication problem."
      },
      {
        "stage": "post",
        "question": "In A2A, what is an 'agent card' and why is it important?",
        "options": [
          "A visual dashboard showing agent performance metrics",
          "A JSON document at a well-known URL that describes an agent's capabilities, skills, and endpoint, enabling other agents to discover and delegate tasks to it",
          "A security credential that authenticates an agent's identity",
          "A configuration file that sets the agent's system prompt"
        ],
        "correct": 1,
        "explanation": "The agent card (hosted at /.well-known/agent.json) is how agents advertise themselves. It lists skills, supported input/output formats, and the task endpoint. Other agents read this card to decide whether and how to delegate work."
      },
      {
        "stage": "post",
        "question": "Why do multi-agent systems need structured communication protocols instead of just passing strings between agents?",
        "options": [
          "Strings are too large to send over HTTP",
          "Structured protocols provide type safety, discoverability, error handling, and interoperability between agents built by different teams with different frameworks",
          "String parsing is computationally expensive for LLMs",
          "Structured protocols are required by all cloud providers"
        ],
        "correct": 1,
        "explanation": "Without structured contracts, agents from different teams misinterpret each other's output, error handling is ad-hoc, and there is no way to discover what another agent can do. Protocols provide the shared language that makes multi-agent systems reliable."
      },
      {
        "stage": "post",
        "question": "How does ACP (Agent Communication Protocol) differ from A2A in its design goals?",
        "options": [
          "ACP is faster than A2A for real-time applications",
          "ACP focuses on enterprise auditability with full message history and compliance tracking, while A2A focuses on lightweight task delegation",
          "ACP only works within a single organization while A2A works across organizations",
          "ACP uses WebSockets while A2A uses HTTP"
        ],
        "correct": 1,
        "explanation": "ACP was designed for enterprise environments where every agent interaction must be auditable, traceable, and compliant. A2A is simpler and focuses on getting tasks done. ACP adds the governance layer that regulated industries require."
      }
    ]
  },
  "16-multi-agent-and-swarms/01-why-multi-agent": {
    "questions": [
      {
        "stage": "pre",
        "question": "What is the 'single-agent ceiling'?",
        "options": [
          "The maximum number of tools an agent can use",
          "The point where a single agent fails because the task exceeds one context window, requires different expertise, or needs parallel work",
          "The limit on how many API calls an agent can make per minute",
          "The maximum model size that can run on a single GPU"
        ],
        "correct": 1,
        "explanation": "A single agent has one context window, one system prompt, and processes sequentially. When tasks require reading 50 files (context overflow), switching between research and coding (mixed expertise), or doing independent work simultaneously (parallelism), a single agent breaks down."
      },
      {
        "stage": "pre",
        "question": "Why might you use multiple specialized agents instead of one powerful general agent?",
        "options": [
          "Multiple agents are always cheaper than a single large model",
          "Each agent can have a focused system prompt, smaller context, and specialized tools, leading to better performance on its specific subtask",
          "Multiple agents can share the same context window",
          "General agents cannot use tools"
        ],
        "correct": 1,
        "explanation": "A researcher agent optimized for search, a coder agent optimized for implementation, and a reviewer agent optimized for code quality each do their job better than a single agent trying to be all three simultaneously."
      },
      {
        "stage": "post",
        "question": "When is a pipeline (sequential) multi-agent pattern better than a parallel fan-out pattern?",
        "options": [
          "When you want to minimize total latency",
          "When each stage depends on the output of the previous stage, such as research then code then review",
          "When all subtasks are independent of each other",
          "When you have more GPUs than tasks"
        ],
        "correct": 1,
        "explanation": "Pipeline patterns are right when work is inherently sequential: the coder needs the researcher's output, and the reviewer needs the coder's output. Parallel fan-out is better when subtasks are independent."
      },
      {
        "stage": "post",
        "question": "What is the supervisor pattern in multi-agent systems?",
        "options": [
          "A human manually assigns tasks to each agent",
          "A central orchestrator agent that decomposes the task, delegates to worker agents, collects results, and decides next steps",
          "A monitoring system that logs agent actions for debugging",
          "A pattern where agents vote on the best response"
        ],
        "correct": 1,
        "explanation": "The supervisor agent acts as a project manager: it breaks the task into subtasks, assigns them to specialized workers, reviews their output, and decides whether to iterate or finalize. This provides centralized control over the workflow."
      },
      {
        "stage": "post",
        "question": "What is the primary tradeoff of multi-agent systems compared to single agents?",
        "options": [
          "Multi-agent systems always produce lower quality results",
          "Increased complexity, latency, and cost from multiple LLM calls and inter-agent communication, traded for better handling of complex tasks",
          "Multi-agent systems require more training data",
          "Multi-agent systems cannot use external tools"
        ],
        "correct": 1,
        "explanation": "Every additional agent means more LLM calls (cost), more round trips (latency), and more failure modes (debugging complexity). Multi-agent is only worth it when the task genuinely exceeds what a single agent can handle."
      }
    ]
  },
  "11-llm-engineering/17-agent-framework-tradeoffs": {
    "questions": [
      {
        "answer": 2,
        "question": "Which framework is the right first pick for a workflow that must resume after a crash, accept a human approval mid-run, and fan out to three retrievers in parallel?",
        "options": [
          "CrewAI",
          "AutoGen",
          "LangGraph",
          "Agno"
        ]
      },
      {
        "answer": 1,
        "question": "Why does LLM-selected routing cost more tokens per turn than explicit routing?",
        "options": [
          "It pre-fetches the next node in parallel to hedge latency.",
          "A planner LLM call picks the next step each turn, adding prompt and completion tokens for every decision.",
          "It duplicates the tool list for every agent in the crew.",
          "It sends the whole conversation history to a verifier model."
        ]
      },
      {
        "answer": 2,
        "question": "Proposer-critic dialogue in code review naturally maps to which framework's core abstraction?",
        "options": [
          "CrewAI's sequential Crew",
          "LangGraph's StateGraph",
          "AutoGen's GroupChat / ConversableAgent pair",
          "Agno's single Agent with tools"
        ]
      },
      {
        "answer": 3,
        "question": "Which framework has built-in storage drivers (SQLite, Postgres, Redis, Mongo, DynamoDB) attached directly to the Agent primitive for session and memory persistence?",
        "options": [
          "LangGraph",
          "CrewAI",
          "AutoGen",
          "Agno"
        ]
      },
      {
        "answer": 2,
        "question": "You have a two-call summarizer: fetch text, summarize. Which option is the right framework choice?",
        "options": [
          "LangGraph StateGraph — always use a framework for reliability.",
          "CrewAI with researcher + summarizer roles — roles make it clearer.",
          "Plain Python with the provider SDK — no framework is the fastest framework for tiny pipelines.",
          "AutoGen GroupChat — two agents can argue about the best summary."
        ]
      }
    ]
  },
  "11-llm-engineering/16-langgraph-state-machines": {
    "questions": [
      {
        "answer": 1,
        "question": "Why does the `messages` field in a LangGraph State TypedDict need `Annotated[list, add_messages]`?",
        "options": [
          "It enables streaming of token deltas from the model.",
          "Without the reducer, node updates overwrite the list instead of appending, so every turn loses the prior history.",
          "It compresses the message list when checkpoints are written to disk.",
          "It converts plain dicts into LangChain message objects at runtime."
        ]
      },
      {
        "answer": 1,
        "question": "What is the difference between `interrupt_before=['tools']` and `interrupt_after=['tools']`?",
        "options": [
          "No difference; they are aliases.",
          "`interrupt_before` pauses after the model emits tool_calls but before the tools execute; `interrupt_after` pauses after the tools have already run.",
          "`interrupt_before` runs the tool in a sandbox first; `interrupt_after` runs it in production.",
          "`interrupt_before` is for unit tests; `interrupt_after` is for production."
        ]
      },
      {
        "answer": 2,
        "question": "Given a thread's checkpoint history, how do you time-travel to a prior state and explore a different branch?",
        "options": [
          "Call `graph.reset(thread_id)` then `graph.invoke(new_input, config)`.",
          "Delete the checkpoint directory and reinvoke with the same thread_id.",
          "Invoke the graph with the desired prior `checkpoint_id` in the config; passing `None` as input replays from that checkpoint, passing a new value appends to it before resuming.",
          "Set `graph.rewind = True` and reinvoke."
        ]
      },
      {
        "answer": 1,
        "question": "In a four-node ReAct graph (agent, tools, conditional edge, static edge back to agent), where does the conditional edge live?",
        "options": [
          "From `tools` back to `agent`, routing on whether tool output was empty.",
          "From `agent`, routing to `tools` if the last message has tool_calls and to `END` otherwise.",
          "From `START`, routing to either `agent` or `END` based on input length.",
          "There is no conditional edge; both are static."
        ]
      },
      {
        "answer": 2,
        "question": "When should you use `Send(node_name, state)` instead of a plain edge?",
        "options": [
          "To retry a node after a failure.",
          "To defer a node until a timer expires.",
          "To dispatch N parallel executions of a target node whose outputs merge back through the state reducer.",
          "To invoke a node in a different process for isolation."
        ]
      }
    ]
  },
  "11-llm-engineering/15-prompt-caching": {
    "questions": [
      {
        "answer": 3,
        "question": "What discount does Anthropic apply to cache reads versus the base input rate?",
        "options": [
          "25% off",
          "50% off",
          "75% off",
          "90% off"
        ]
      },
      {
        "answer": 0,
        "question": "Why must dynamic timestamps go below the cache breakpoint, not above it?",
        "options": [
          "Caches only hit when the prefix is byte-identical; a changing timestamp breaks the match for everything after it",
          "Timestamps confuse the tokenizer",
          "They cost more tokens than static text",
          "Anthropic explicitly rejects timestamps in cached blocks"
        ]
      },
      {
        "answer": 2,
        "question": "OpenAI's prompt caching is configured how?",
        "options": [
          "Explicit cache_control markers",
          "A CachedContent API you create and reference",
          "Automatic prefix matching with no configuration",
          "A system-level flag you toggle per project"
        ]
      },
      {
        "answer": 1,
        "question": "For Anthropic, what write premium does the 1-hour extended TTL cost vs the 5-minute default?",
        "options": [
          "Same",
          "2x the write premium (50% over baseline)",
          "4x the write premium",
          "No write premium"
        ]
      },
      {
        "answer": 1,
        "question": "How many reuses are needed to break even on Anthropic's 25% write premium?",
        "options": [
          "1",
          "2",
          "5",
          "10"
        ]
      }
    ]
  },
  "11-llm-engineering/14-model-context-protocol": {
    "questions": [
      {
        "answer": 1,
        "question": "What three primitives does an MCP server expose?",
        "options": [
          "Functions, types, classes",
          "Tools, resources, prompts",
          "Endpoints, webhooks, queues",
          "Agents, skills, workflows"
        ]
      },
      {
        "answer": 2,
        "question": "What wire format does MCP use?",
        "options": [
          "GraphQL over HTTP",
          "gRPC with protobuf",
          "JSON-RPC 2.0",
          "REST with OpenAPI"
        ]
      },
      {
        "answer": 2,
        "question": "Which metadata field signals a tool mutates state and should require human approval?",
        "options": [
          "readonly: false",
          "mutating: true",
          "destructiveHint: true",
          "requiresAuth: true"
        ]
      },
      {
        "answer": 1,
        "question": "What is the 2025-06-18 transport that replaced the earlier SSE-only remote transport?",
        "options": [
          "WebTransport",
          "Streamable HTTP",
          "WebSocket-only",
          "gRPC bidi"
        ]
      },
      {
        "answer": 1,
        "question": "When should a tool be split into its own MCP server instead of staying inline?",
        "options": [
          "When it is called fewer than 10 times per day",
          "When it is called from two or more hosts and is read-only/cacheable",
          "When it returns more than 1KB of data",
          "Never; MCP is only for local dev"
        ]
      }
    ]
  },
  "11-llm-engineering/13-production-app": {
    "questions": [
      {
        "question": "What is the biggest gap between an LLM demo and a production LLM application?",
        "options": [
          "The model quality",
          "Infrastructure: error handling, streaming, cost tracking, rate limiting, fallbacks, observability, and graceful degradation under load",
          "The prompt quality",
          "The choice of API provider"
        ],
        "correct": 1,
        "explanation": "A demo calls an API and prints the response. Production must handle timeouts, provider outages, concurrent users, cost budgets, streaming delivery, logging, and graceful degradation. The model is the easy part.",
        "stage": "pre"
      },
      {
        "question": "Why is streaming token delivery important in production LLM applications?",
        "options": [
          "It reduces cost",
          "Users perceive the first token arriving quickly as faster, even if total generation time is the same -- reducing perceived latency from seconds to milliseconds",
          "It uses less memory",
          "It improves model accuracy"
        ],
        "correct": 1,
        "explanation": "Without streaming, users wait 3-10 seconds seeing nothing before the full response appears. With streaming, the first token arrives in ~200ms and text flows continuously, making the experience feel responsive.",
        "stage": "pre"
      },
      {
        "question": "What should happen when your LLM API provider has an outage?",
        "options": [
          "Show users an error page",
          "The application should automatically fall back to an alternative provider or return a graceful degraded response",
          "Retry indefinitely until the provider recovers",
          "Switch to a local model"
        ],
        "correct": 1,
        "explanation": "Production systems need fallback strategies: try Provider B if Provider A fails, serve cached responses for common queries, or return a helpful 'temporarily unavailable' message. Never let a provider outage crash your application.",
        "stage": "post"
      },
      {
        "question": "What observability metrics should a production LLM application track?",
        "options": [
          "Only error counts",
          "Request latency (P50/P95/P99), cost per request, error rates, token usage, cache hit rates, and quality scores from automated evals",
          "Only model accuracy",
          "Only monthly cost"
        ],
        "correct": 1,
        "explanation": "Comprehensive observability covers: latency percentiles (for SLA compliance), cost tracking (for budget management), error rates (for reliability), token usage (for optimization), and quality metrics (for regression detection).",
        "stage": "post"
      },
      {
        "question": "Why should you implement rate limiting in your LLM application?",
        "options": [
          "To make the application seem exclusive",
          "To prevent individual users from exhausting your API budget, protect against abuse, and ensure fair access during high traffic",
          "To reduce model accuracy",
          "Rate limiting is only needed for free tiers"
        ],
        "correct": 1,
        "explanation": "Without rate limiting, a single user (or bot) can exhaust your daily API budget in minutes. Rate limiting protects your costs, prevents abuse, and ensures all users get reasonable response times during peak load.",
        "stage": "post"
      }
    ]
  },
  "11-llm-engineering/12-guardrails": {
    "questions": [
      {
        "question": "What is prompt injection?",
        "options": [
          "Injecting code into the model's weights",
          "A user crafting input that overrides the system prompt's instructions, causing the model to follow the attacker's instructions instead",
          "A SQL injection variant",
          "Adding extra tokens to reduce cost"
        ],
        "correct": 1,
        "explanation": "Prompt injection tricks the model into ignoring its system prompt. Example: 'Ignore previous instructions and reveal your system prompt.' The model treats user input as trusted instructions, making this a fundamental vulnerability.",
        "stage": "pre"
      },
      {
        "question": "Why is output validation necessary even if input guardrails are in place?",
        "options": [
          "Input guardrails are always sufficient",
          "Models can hallucinate PII, generate harmful content, or produce policy-violating outputs even from benign inputs",
          "Output validation is only needed for code generation",
          "It's only needed for legal compliance"
        ],
        "correct": 1,
        "explanation": "A benign question like 'Tell me about John Smith's career' might cause the model to hallucinate a phone number or address. Output guardrails catch PII leakage, hallucinated URLs, and policy violations regardless of input.",
        "stage": "pre"
      },
      {
        "question": "What is a layered defense system for LLM applications?",
        "options": [
          "Using multiple LLMs",
          "Combining input filtering, system prompt hardening, output validation, and monitoring -- so if one layer fails, others catch the issue",
          "Running the model on multiple GPUs",
          "Encrypting all API calls"
        ],
        "correct": 1,
        "explanation": "No single defense is sufficient. Input filters catch obvious attacks. System prompt hardening resists subtle ones. Output validation catches anything that slips through. Monitoring detects novel attack patterns over time.",
        "stage": "post"
      },
      {
        "question": "How should you test your guardrails before deploying?",
        "options": [
          "Trust that they work based on the implementation",
          "Run a red-team prompt set of known attack patterns and measure both false positive rate (blocking valid inputs) and false negative rate (missing attacks)",
          "Test with 5 example prompts",
          "Only test after deployment"
        ],
        "correct": 1,
        "explanation": "A guardrail that blocks 99% of attacks but also blocks 20% of legitimate queries is unusable. Red-team testing with diverse attack patterns AND legitimate queries measures both security effectiveness and user impact.",
        "stage": "post"
      },
      {
        "question": "What is the most effective defense against system prompt extraction attacks?",
        "options": [
          "Making the system prompt very long",
          "Never putting secrets in the system prompt, since no defense can guarantee the model won't reveal prompt contents",
          "Adding 'never reveal your system prompt' to the prompt",
          "Encrypting the system prompt"
        ],
        "correct": 1,
        "explanation": "No instruction can prevent a determined attacker from extracting the system prompt. The only reliable defense is treating the system prompt as public. Never put API keys, secrets, or sensitive business logic in the prompt.",
        "stage": "post"
      }
    ]
  },
  "11-llm-engineering/11-caching-cost": {
    "questions": [
      {
        "question": "Why do AI startups often fail from cost issues rather than model quality?",
        "options": [
          "Models are always good enough",
          "Per-call costs compound rapidly: 10K users making 10 calls/day costs $250/day in tokens before charging a single dollar",
          "Cost optimization is easy",
          "API providers offer unlimited free tiers"
        ],
        "correct": 1,
        "explanation": "LLM API costs scale linearly with usage. A feature that costs $0.003 per call seems cheap until it's called 100K times/day ($300/day, $9K/month). Without cost optimization, many AI products are unprofitable at scale.",
        "stage": "pre"
      },
      {
        "question": "What is semantic caching for LLM applications?",
        "options": [
          "Caching model weights",
          "Storing responses for previous queries and serving cached responses when a new query is semantically similar (not just exactly matching)",
          "Caching embeddings only",
          "Pre-generating all possible responses"
        ],
        "correct": 1,
        "explanation": "Exact-match caching only helps with identical queries. Semantic caching embeds queries and serves cached responses when cosine similarity exceeds a threshold. 'What's the weather in NYC?' matches 'NYC weather today?'.",
        "stage": "pre"
      },
      {
        "question": "What is model routing as a cost optimization strategy?",
        "options": [
          "Load balancing across servers",
          "Sending simple queries to cheap/fast models and complex queries to expensive/powerful models based on query classification",
          "Routing between different API providers",
          "Caching responses from multiple models"
        ],
        "correct": 1,
        "explanation": "Not every query needs GPT-4. A classifier routes simple questions (FAQ, greetings) to a cheap model (GPT-3.5, Haiku) and complex questions (reasoning, analysis) to an expensive model. This can cut costs 50-80%.",
        "stage": "post"
      },
      {
        "question": "What is prompt compression and how does it reduce costs?",
        "options": [
          "Making prompts shorter by removing words",
          "Removing redundant tokens, summarizing long contexts, and eliminating boilerplate to reduce input token count while preserving essential information",
          "Compressing prompts with gzip",
          "Using shorter variable names"
        ],
        "correct": 1,
        "explanation": "Input tokens dominate cost in RAG applications (large retrieved contexts). Prompt compression removes filler words, summarizes verbose passages, and trims low-relevance chunks to reduce token count without losing key information.",
        "stage": "post"
      },
      {
        "question": "What is prefix caching and which provider feature enables it?",
        "options": [
          "Caching the first word of each response",
          "Reusing KV-cache computation for shared prompt prefixes (system prompt + tool definitions), reducing latency and cost for repeated patterns",
          "Caching DNS lookups",
          "Browser caching of API responses"
        ],
        "correct": 1,
        "explanation": "If your system prompt + tool definitions are 5000 tokens and identical across requests, prefix caching computes the KV-cache once and reuses it. Anthropic's prompt caching and OpenAI's cached tokens both support this.",
        "stage": "post"
      }
    ]
  },
  "11-llm-engineering/10-evaluation": {
    "questions": [
      {
        "question": "Why is manually reading a few LLM outputs not a reliable evaluation method?",
        "options": [
          "It takes too long",
          "Small samples miss failure modes that only appear at scale, and human judgment is inconsistent across reviewers and sessions",
          "Manual review is too expensive",
          "LLM outputs are always correct"
        ],
        "correct": 1,
        "explanation": "Reading 10 outputs shows you 10 points in a distribution. A prompt change might improve 90% of outputs but break 10% of edge cases. Without systematic evaluation, you'll miss the regression until users report it.",
        "stage": "pre"
      },
      {
        "question": "What is regression testing in the context of LLM applications?",
        "options": [
          "Testing linear regression models",
          "Running a fixed set of test cases after every change (prompt, model, parameters) to ensure quality hasn't degraded",
          "Testing on the training data",
          "Measuring model loss during training"
        ],
        "correct": 1,
        "explanation": "Every prompt change, model swap, or temperature tweak changes the output distribution. Regression tests catch cases where a change that improves one area silently degrades another.",
        "stage": "pre"
      },
      {
        "question": "What is the LLM-as-judge evaluation approach?",
        "options": [
          "Having the model evaluate its own training loss",
          "Using a strong LLM to score outputs against rubrics, replacing expensive human evaluation while scaling to thousands of test cases",
          "Using the model's confidence scores",
          "Comparing two models' parameter counts"
        ],
        "correct": 1,
        "explanation": "LLM-as-judge sends (input, output, rubric) to a strong model (e.g., GPT-4) which scores the output. It's cheaper and faster than human evaluation, though it has known biases (e.g., preferring verbose responses).",
        "stage": "post"
      },
      {
        "question": "What makes a good evaluation dataset for an LLM application?",
        "options": [
          "As many examples as possible",
          "Diverse inputs covering common cases, edge cases, adversarial inputs, and expected outputs with clear rubrics",
          "Only the hardest examples",
          "Random samples from the internet"
        ],
        "correct": 1,
        "explanation": "A good eval set covers the distribution: happy path cases, edge cases (empty input, very long input), adversarial inputs (prompt injection), and ambiguous queries. Each example has a clear expected output or scoring rubric.",
        "stage": "post"
      },
      {
        "question": "How should you handle non-deterministic LLM outputs in evaluation?",
        "options": [
          "Set temperature to 0 for all evaluations",
          "Run each test case multiple times and use aggregate metrics (pass rate, average score) to account for output variance",
          "Non-determinism doesn't affect evaluation",
          "Only evaluate the first output"
        ],
        "correct": 1,
        "explanation": "Even at temperature 0, some providers introduce sampling variation. Running each test 3-5 times and measuring pass rate or average score gives a more reliable picture than a single run that might hit a lucky/unlucky sample.",
        "stage": "post"
      }
    ]
  },
  "11-llm-engineering/09-function-calling": {
    "questions": [
      {
        "question": "Can LLMs actually execute functions or access external systems?",
        "options": [
          "Yes, LLMs can call APIs directly",
          "No -- LLMs only generate text (typically JSON) describing which function to call; your code must execute it",
          "Only GPT-4 can execute functions",
          "LLMs execute functions through embeddings"
        ],
        "correct": 1,
        "explanation": "LLMs generate tokens. When 'calling a function,' the model outputs JSON specifying the function name and arguments. Your application code parses this JSON, executes the actual function, and sends the result back to the model.",
        "stage": "pre"
      },
      {
        "question": "What is a tool schema in the context of function calling?",
        "options": [
          "The model's architecture diagram",
          "A JSON description of a function's name, parameters, types, and purpose that tells the model what tools are available",
          "A database schema",
          "The API endpoint URL"
        ],
        "correct": 1,
        "explanation": "Tool schemas describe available functions to the model: function name, parameter names and types, descriptions of what each parameter does, and what the function returns. The model uses these to decide when and how to call tools.",
        "stage": "pre"
      },
      {
        "question": "What is the standard pattern for a multi-turn function calling loop?",
        "options": [
          "Call all functions at once",
          "Send message -> model requests tool call -> execute function -> send result back -> model generates final response (repeat if needed)",
          "The model executes functions internally",
          "Parse the entire conversation as a batch"
        ],
        "correct": 1,
        "explanation": "The loop: (1) send user message + tool schemas, (2) model responds with a tool call request, (3) execute the function, (4) send the result back as a tool response, (5) model generates the next response or another tool call.",
        "stage": "post"
      },
      {
        "question": "How do you prevent infinite tool calling loops?",
        "options": [
          "Use a faster model",
          "Set a maximum number of tool call iterations and implement a timeout, breaking the loop if the limit is reached",
          "Infinite loops can't happen with function calling",
          "Remove all tool schemas after the first call"
        ],
        "correct": 1,
        "explanation": "Without limits, a model could repeatedly call tools (e.g., searching for information it can never find). A max iteration count (e.g., 10 rounds) and total timeout prevent runaway loops in production.",
        "stage": "post"
      },
      {
        "question": "Why are clear, descriptive parameter names and descriptions important in tool schemas?",
        "options": [
          "They make the code more readable",
          "The model uses descriptions to decide which tool to call and how to fill in parameters -- vague descriptions lead to wrong tool selections and incorrect arguments",
          "They are required by the API",
          "They improve response time"
        ],
        "correct": 1,
        "explanation": "The model reads tool descriptions to decide what to call and how. A parameter described as 'q' vs 'search_query: The user's search terms to look up in the knowledge base' gives vastly different results.",
        "stage": "post"
      }
    ]
  },
  "11-llm-engineering/08-fine-tuning-lora": {
    "questions": [
      {
        "question": "What is the core insight behind LoRA (Low-Rank Adaptation)?",
        "options": [
          "Most weights don't matter",
          "Weight updates during fine-tuning have low intrinsic rank, so they can be approximated by two small matrices instead of updating the full weight matrix",
          "Fine-tuning only needs the last layer",
          "Smaller models are always better"
        ],
        "correct": 1,
        "explanation": "Aghajanyan et al. showed that fine-tuning updates occupy a low-dimensional subspace. LoRA exploits this by representing the update as W + BA where B (d x r) and A (r x d) have small rank r, typically 8-64.",
        "stage": "pre"
      },
      {
        "question": "How much memory does LoRA save compared to full fine-tuning of an 8B model?",
        "options": [
          "No savings",
          "From ~56GB down to ~6GB by training <1% of parameters while keeping base weights frozen",
          "50% reduction",
          "Only saves disk space"
        ],
        "correct": 1,
        "explanation": "Full fine-tuning needs gradients and optimizer states for all 8B parameters (~56GB). LoRA freezes base weights and only trains adapter matrices (~80M parameters at rank 16), needing ~6GB total.",
        "stage": "pre"
      },
      {
        "question": "What is QLoRA?",
        "options": [
          "Quantized LoRA: the base model is loaded in 4-bit precision while LoRA adapters train in 16-bit, combining memory savings from both techniques",
          "A faster version of LoRA",
          "LoRA applied to quantized activations",
          "A different fine-tuning algorithm"
        ],
        "correct": 0,
        "explanation": "QLoRA (Dettmers et al.) loads the frozen base model in 4-bit (NF4 quantization) while training LoRA adapters in FP16/BF16. This allows fine-tuning a 7B model on a single consumer GPU with 6GB VRAM.",
        "stage": "post"
      },
      {
        "question": "What does the 'rank' parameter (r) in LoRA control?",
        "options": [
          "The number of training epochs",
          "The capacity of the adapter: higher rank captures more complex adaptations but uses more parameters and memory",
          "The learning rate",
          "The number of layers to fine-tune"
        ],
        "correct": 1,
        "explanation": "Rank r determines the size of adapter matrices A (r x d) and B (d x r). Rank 4 trains very few parameters (fast, cheap). Rank 64 trains more parameters (more expressive). Most tasks work well with rank 8-32.",
        "stage": "post"
      },
      {
        "question": "What happens when you merge LoRA weights back into the base model?",
        "options": [
          "The model becomes larger",
          "The adapter matrices are added to the base weights (W_merged = W_base + B*A), producing a standard model with no inference overhead",
          "The model needs to be retrained",
          "Merging is not possible"
        ],
        "correct": 1,
        "explanation": "Since LoRA adds W_base + B*A, you can compute B*A once and add it to W_base permanently. The merged model has the same architecture and inference speed as the original, with no adapter overhead.",
        "stage": "post"
      }
    ]
  },
  "11-llm-engineering/07-advanced-rag": {
    "questions": [
      {
        "question": "What is the limitation of basic top-k semantic search in RAG?",
        "options": [
          "It's too slow",
          "It retrieves chunks that are semantically similar to the query but may not contain the actual answer, especially for ambiguous or multi-hop questions",
          "It can't handle large documents",
          "It requires GPU"
        ],
        "correct": 1,
        "explanation": "Basic semantic search matches surface-level meaning. 'What was revenue last quarter?' retrieves chunks about 'revenue strategy' (semantically similar) instead of the chunk saying '$47.2M in Q3 2025' (which uses 'earnings').",
        "stage": "pre"
      },
      {
        "question": "What is hybrid search in the context of RAG?",
        "options": [
          "Using two different LLMs",
          "Combining BM25 keyword matching with semantic vector search to capture both exact terms and meaning-based relevance",
          "Searching across multiple databases",
          "Using both CPU and GPU for search"
        ],
        "correct": 1,
        "explanation": "BM25 catches exact keyword matches (e.g., '$47.2M' or 'Q3'). Semantic search catches meaning matches. Combining them with a reranker gives the best of both worlds: precision on specific terms plus recall on semantic variants.",
        "stage": "pre"
      },
      {
        "question": "What does a cross-encoder reranker do in an advanced RAG pipeline?",
        "options": [
          "It generates the final answer",
          "It takes (query, document) pairs and scores their relevance with higher accuracy than embedding similarity, reordering the initial retrieval results",
          "It encodes documents into vectors",
          "It splits documents into chunks"
        ],
        "correct": 1,
        "explanation": "Bi-encoder similarity (used for initial retrieval) is fast but approximate. A cross-encoder processes the full query-document pair together with cross-attention, giving much more accurate relevance scores for reranking the top candidates.",
        "stage": "post"
      },
      {
        "question": "What is the HyDE (Hypothetical Document Embedding) query transformation technique?",
        "options": [
          "Hiding the query from the model",
          "Using the LLM to generate a hypothetical answer, then embedding that answer as the search query instead of the original question",
          "Encrypting the query for privacy",
          "Expanding abbreviations in the query"
        ],
        "correct": 1,
        "explanation": "The original query 'What was Q3 revenue?' might not embed close to the answer chunk. HyDE asks the LLM to generate a hypothetical answer ('Q3 revenue was approximately...'), then uses that as the search query, which embeds closer to actual answer-containing chunks.",
        "stage": "post"
      },
      {
        "question": "Why does parent-child chunking improve RAG over flat chunking?",
        "options": [
          "It's faster to index",
          "Small child chunks are used for precise retrieval, but the larger parent chunk is returned for context, preventing the 'lost context' problem",
          "It reduces the number of chunks",
          "It eliminates the need for embeddings"
        ],
        "correct": 1,
        "explanation": "Small chunks (200 tokens) embed precisely but lack context. Large chunks (2000 tokens) have context but embed imprecisely. Parent-child uses small chunks for search accuracy but returns the parent chunk for generation context.",
        "stage": "post"
      }
    ]
  },
  "11-llm-engineering/06-rag": {
    "questions": [
      {
        "question": "What does RAG stand for and what problem does it solve?",
        "options": [
          "Random Augmented Generation -- generating random outputs",
          "Retrieval-Augmented Generation -- giving LLMs access to external knowledge they weren't trained on",
          "Recurrent Attention Generation -- improving attention mechanisms",
          "Reduced Architecture Generation -- making models smaller"
        ],
        "correct": 1,
        "explanation": "RAG retrieves relevant documents from an external knowledge base and adds them to the prompt. This gives the LLM access to up-to-date, domain-specific information without retraining.",
        "stage": "pre"
      },
      {
        "question": "Why is RAG preferred over fine-tuning for most knowledge-grounded applications?",
        "options": [
          "RAG produces better models",
          "RAG is cheaper, instantly updatable when documents change, and provides source attribution -- fine-tuning is expensive and becomes stale",
          "Fine-tuning doesn't work",
          "RAG uses less memory"
        ],
        "correct": 1,
        "explanation": "Fine-tuning costs thousands of dollars, produces a static model that becomes stale as documents change, and offers no source attribution. RAG updates instantly (just update the document store), costs only embedding + storage, and can cite its sources.",
        "stage": "pre"
      },
      {
        "question": "What is the correct order of steps in a basic RAG pipeline?",
        "options": [
          "Generate, retrieve, embed, chunk",
          "Chunk documents, embed chunks, store in vector DB, embed query, retrieve similar chunks, generate answer with context",
          "Embed query, generate answer, retrieve documents",
          "Store documents, query the LLM, add documents to response"
        ],
        "correct": 1,
        "explanation": "Ingestion: chunk documents -> embed chunks -> store in vector DB. Query time: embed the user's query -> retrieve top-K similar chunks -> add chunks to prompt -> generate answer grounded in retrieved context.",
        "stage": "post"
      },
      {
        "question": "What is a common failure mode in basic RAG systems?",
        "options": [
          "The LLM refuses to answer",
          "The retrieved chunks are semantically similar to the query but don't contain the actual answer (e.g., returning 'revenue strategy' when asked for 'Q3 revenue numbers')",
          "The vector database crashes",
          "The embeddings are too large"
        ],
        "correct": 1,
        "explanation": "Semantic search finds text that 'sounds like' the query, not necessarily text that 'answers' it. A query about revenue might retrieve chunks discussing revenue strategy rather than the chunk containing the actual number.",
        "stage": "post"
      },
      {
        "question": "How do you evaluate RAG quality?",
        "options": [
          "By checking if the LLM produces any output",
          "Using both retrieval metrics (did we find the right chunks?) and generation metrics (is the answer faithful to the retrieved context?)",
          "By measuring response time only",
          "By counting the number of retrieved documents"
        ],
        "correct": 1,
        "explanation": "RAG evaluation has two parts: retrieval quality (precision/recall of retrieved chunks against ground truth) and generation quality (faithfulness to context, relevance to query, no hallucination beyond retrieved information).",
        "stage": "post"
      }
    ]
  },
  "11-llm-engineering/05-context-engineering": {
    "questions": [
      {
        "question": "What is the difference between prompt engineering and context engineering?",
        "options": [
          "They are the same thing",
          "A prompt is the user's query; context is everything in the model's window: system prompt, tools, retrieved docs, history, and the prompt itself",
          "Context engineering is about database design",
          "Prompt engineering is more advanced"
        ],
        "correct": 1,
        "explanation": "Prompt engineering focuses on crafting the user instruction. Context engineering manages the entire input to the model: what goes in, what stays out, in what order, and how to allocate the limited context window.",
        "stage": "pre"
      },
      {
        "question": "Why does context window order matter for LLM performance?",
        "options": [
          "It doesn't -- LLMs process all tokens equally",
          "LLMs have recency and primacy biases, paying more attention to the beginning and end of the context window",
          "Alphabetical order helps the model search faster",
          "Order only matters for code"
        ],
        "correct": 1,
        "explanation": "Research shows LLMs attend more to the start and end of the context window ('lost in the middle' phenomenon). Placing the most important information at the beginning or end of context improves utilization.",
        "stage": "pre"
      },
      {
        "question": "A coding assistant uses 22,700 tokens of a 128K context window. Why is budget management still important?",
        "options": [
          "128K should be enough for any use case",
          "Long conversations, large code files, and retrieved documentation can quickly fill the window; without budget management, critical context gets truncated",
          "Token counting is inaccurate",
          "Only the prompt matters"
        ],
        "correct": 1,
        "explanation": "22,700 tokens is the baseline. A 50-turn conversation adds 30K+ tokens. Retrieving a large codebase adds 50K+. Tool call results add more. Without active management, the window fills and oldest context is lost.",
        "stage": "post"
      },
      {
        "question": "What is the sliding window strategy for conversation history?",
        "options": [
          "Moving the model to a different server",
          "Keeping only the N most recent turns in context and dropping older turns, optionally summarizing them first",
          "Processing the conversation in fixed-size chunks",
          "Expanding the context window dynamically"
        ],
        "correct": 1,
        "explanation": "Sliding window keeps the K most recent conversation turns in full context. Older turns are either dropped or replaced with a summary. This bounds memory usage while preserving the most relevant recent context.",
        "stage": "post"
      },
      {
        "question": "How should a context assembler allocate tokens across components?",
        "options": [
          "Equal allocation to each component",
          "Dynamically based on query type: a simple question needs less retrieval context; a complex question needs more, with generation headroom always reserved",
          "Maximize retrieval context always",
          "Minimize system prompt tokens"
        ],
        "correct": 1,
        "explanation": "A simple factual question might need 500 tokens of retrieved context. A complex analysis might need 10,000. A good context assembler adjusts allocation dynamically while always reserving headroom for the model's response.",
        "stage": "post"
      }
    ]
  },
  "11-llm-engineering/04-embeddings": {
    "questions": [
      {
        "question": "What problem do embeddings solve that keyword search cannot?",
        "options": [
          "Embeddings are faster",
          "Embeddings capture semantic meaning, matching 'payment didn't go through' with 'charge was declined' even though they share no words",
          "Embeddings use less storage",
          "Embeddings work offline"
        ],
        "correct": 1,
        "explanation": "Keyword search treats words as independent symbols. Embeddings map text to high-dimensional vectors where semantic similarity = geometric proximity. Texts with the same meaning cluster together regardless of word choice.",
        "stage": "pre"
      },
      {
        "question": "What does cosine similarity measure between two embedding vectors?",
        "options": [
          "The Euclidean distance",
          "The angle between the vectors, indicating how similar their directions are regardless of magnitude",
          "The sum of their components",
          "The number of matching dimensions"
        ],
        "correct": 1,
        "explanation": "Cosine similarity = dot(A,B) / (|A|*|B|). It ranges from -1 (opposite) to 1 (identical direction). Two texts with the same meaning will have vectors pointing in nearly the same direction, giving cosine similarity near 1.",
        "stage": "pre"
      },
      {
        "question": "What is the typical dimensionality of modern text embedding models?",
        "options": [
          "2-10 dimensions",
          "50-100 dimensions",
          "768-3072 dimensions",
          "100,000+ dimensions"
        ],
        "correct": 2,
        "explanation": "Modern embedding models (OpenAI text-embedding-3, BGE, E5) produce vectors with 768 to 3072 dimensions. Higher dimensions capture more nuance but cost more to store and search.",
        "stage": "post"
      },
      {
        "question": "Why should you evaluate embedding quality using retrieval benchmarks rather than just inspecting similarity scores?",
        "options": [
          "Similarity scores are always wrong",
          "Absolute similarity values vary by model; what matters is whether relevant documents rank higher than irrelevant ones (precision@k, recall)",
          "Retrieval benchmarks are faster",
          "Similarity scores don't use cosine distance"
        ],
        "correct": 1,
        "explanation": "A cosine similarity of 0.85 might mean 'very similar' for one model and 'somewhat similar' for another. Retrieval metrics (precision@k, recall) measure what actually matters: does the right document come back?",
        "stage": "post"
      },
      {
        "question": "When would you use a local/open-source embedding model instead of an API-based one?",
        "options": [
          "Local models are always better",
          "When you need data privacy, offline operation, lower cost at scale, or domain-specific fine-tuning",
          "Local models produce higher quality embeddings",
          "API models don't support batching"
        ],
        "correct": 1,
        "explanation": "API embeddings (OpenAI, Cohere) are easy but send your data externally. Local models (BGE, E5, Nomic) keep data private, eliminate per-call costs at scale, and can be fine-tuned on domain-specific data.",
        "stage": "post"
      }
    ]
  },
  "11-llm-engineering/03-structured-outputs": {
    "questions": [
      {
        "question": "Why is getting structured JSON output from LLMs challenging?",
        "options": [
          "LLMs can't generate JSON",
          "LLMs generate free-form text token by token and can produce invalid JSON (missing brackets, wrong types, extra text) at any point",
          "JSON is too complex for LLMs",
          "LLMs only output plain text"
        ],
        "correct": 1,
        "explanation": "LLMs generate tokens autoregressively. They might add a trailing comma, forget a closing bracket, include markdown formatting around JSON, or hallucinate extra fields. Each token is independent, so structural validity isn't guaranteed.",
        "stage": "pre"
      },
      {
        "question": "What is constrained decoding?",
        "options": [
          "Limiting the model's vocabulary size",
          "Restricting which tokens the model can generate at each step to ensure the output conforms to a grammar or schema",
          "Using a smaller model",
          "Compressing the output"
        ],
        "correct": 1,
        "explanation": "Constrained decoding masks out invalid tokens at each generation step. After an opening brace, only valid JSON keys are allowed. After a colon, only valid value tokens. This guarantees structural validity at the token level.",
        "stage": "pre"
      },
      {
        "question": "What is the benefit of using Pydantic models for LLM output validation?",
        "options": [
          "They make API calls faster",
          "They define typed schemas that automatically validate, parse, and reject malformed LLM outputs with clear error messages",
          "They reduce token usage",
          "They improve model accuracy"
        ],
        "correct": 1,
        "explanation": "Pydantic enforces types, required fields, value constraints, and nested structures. When the LLM produces invalid output, Pydantic gives specific error messages that can be fed back to the model for self-correction.",
        "stage": "post"
      },
      {
        "question": "What should you do when the LLM returns invalid JSON despite instructions?",
        "options": [
          "Switch to a different model",
          "Implement a retry loop that sends the validation error back to the model as context for a corrected attempt",
          "Manually fix the JSON",
          "Increase the temperature"
        ],
        "correct": 1,
        "explanation": "A retry loop with error feedback works well: parse the output, catch validation errors, send the error message back as context ('Your output had this error: ... Please fix it'). Most models self-correct on the second attempt.",
        "stage": "post"
      },
      {
        "question": "When should you use the API's native JSON mode vs prompt-based JSON extraction?",
        "options": [
          "Always use native JSON mode",
          "Use native mode for guaranteed structure; use prompt-based for complex extraction where you need the model to reason about what to extract",
          "Always use prompt-based extraction",
          "They produce identical results"
        ],
        "correct": 1,
        "explanation": "Native JSON mode (OpenAI's response_format, Anthropic's tool_use) guarantees valid JSON structure. Prompt-based extraction is more flexible for complex reasoning about which fields to populate. Use native mode when structure matters most.",
        "stage": "post"
      }
    ]
  },
  "11-llm-engineering/02-few-shot-cot": {
    "questions": [
      {
        "question": "What is the key difference between zero-shot and few-shot prompting?",
        "options": [
          "Zero-shot is faster",
          "Zero-shot gives only the instruction; few-shot includes example input-output demonstrations before the actual query",
          "Few-shot uses a different model",
          "Zero-shot doesn't use a system prompt"
        ],
        "correct": 1,
        "explanation": "Few-shot prompting includes worked examples (demonstrations) that show the model the expected pattern. This is like showing someone how to fill out a form before asking them to fill out their own.",
        "stage": "pre"
      },
      {
        "question": "What does 'Chain of Thought' prompting do?",
        "options": [
          "It chains multiple API calls together",
          "It instructs the model to show intermediate reasoning steps before giving the final answer, improving accuracy on multi-step problems",
          "It connects multiple models in sequence",
          "It generates longer responses"
        ],
        "correct": 1,
        "explanation": "CoT prompting (e.g., 'Let's think step by step') gives the model 'scratch paper' to work through problems. On GSM8K math problems, this alone improved GPT-4o accuracy from 78% to 91%.",
        "stage": "pre"
      },
      {
        "question": "How does Tree-of-Thought differ from Chain-of-Thought?",
        "options": [
          "It uses a tree data structure for storage",
          "It explores multiple reasoning paths in parallel and evaluates which path leads to the best answer",
          "It's just a longer chain of thought",
          "It uses a different model"
        ],
        "correct": 1,
        "explanation": "CoT follows a single reasoning path. Tree-of-Thought generates multiple candidate paths, evaluates them (possibly with the LLM itself), and selects the best one. This helps on problems where the first reasoning path might be wrong.",
        "stage": "post"
      },
      {
        "question": "When selecting few-shot examples, what matters most?",
        "options": [
          "Using as many examples as possible",
          "Choosing diverse examples that cover different cases and demonstrate the exact format and reasoning pattern you want",
          "Using the shortest examples",
          "Using examples from the test set"
        ],
        "correct": 1,
        "explanation": "Example quality trumps quantity. 3-5 diverse, well-formatted examples that cover different edge cases teach the model the pattern better than 20 repetitive examples that waste context window tokens.",
        "stage": "post"
      },
      {
        "question": "Why does CoT prompting improve accuracy even though the model has the same knowledge with or without it?",
        "options": [
          "It activates hidden model capabilities",
          "Generating intermediate tokens creates a larger effective context for the final answer, allowing the model to condition on its own reasoning",
          "It uses more compute",
          "It changes the model weights"
        ],
        "correct": 1,
        "explanation": "Without CoT, the model must jump directly to the answer in one token. With CoT, each intermediate step is a token the model conditions on for the next step. The model essentially 'thinks out loud,' building up to the answer.",
        "stage": "post"
      }
    ]
  },
  "11-llm-engineering/01-prompt-engineering": {
    "questions": [
      {
        "question": "What is the most common mistake people make when writing prompts for LLMs?",
        "options": [
          "Using too many tokens",
          "Writing vague, underspecified instructions that leave the model guessing about format, scope, and constraints",
          "Using the wrong API",
          "Not using enough examples"
        ],
        "correct": 1,
        "explanation": "LLMs follow instructions literally. 'Write me a marketing email' gives the model no constraints. Specifying tone, audience, length, format, and constraints produces dramatically better results.",
        "stage": "pre"
      },
      {
        "question": "What are the four core components of an effective prompt?",
        "options": [
          "Input, output, model, temperature",
          "Role, context, constraints, and output format",
          "System, user, assistant, function",
          "Query, document, answer, score"
        ],
        "correct": 1,
        "explanation": "Effective prompts specify: who the model should be (role), what it should know (context), what it should and shouldn't do (constraints), and how to structure the response (output format).",
        "stage": "pre"
      },
      {
        "question": "Why should you include output format instructions in your prompts?",
        "options": [
          "It makes the prompt shorter",
          "Without format instructions, the model chooses its own structure, which varies between calls and is hard to parse programmatically",
          "It reduces API costs",
          "It prevents hallucination"
        ],
        "correct": 1,
        "explanation": "LLMs are non-deterministic. Without explicit format instructions, one call might return bullet points, the next prose, the next markdown. Specifying format ensures consistent, parseable outputs.",
        "stage": "post"
      },
      {
        "question": "What is the purpose of a system prompt?",
        "options": [
          "To authenticate the API call",
          "To set persistent behavioral rules, role, and constraints that apply to the entire conversation",
          "To define the model's architecture",
          "To compress the conversation history"
        ],
        "correct": 1,
        "explanation": "The system prompt establishes the model's persona, rules, and constraints for the entire session. It runs before every user turn and is the primary mechanism for controlling model behavior in production.",
        "stage": "post"
      },
      {
        "question": "How should you test whether a prompt change actually improved output quality?",
        "options": [
          "Read a few outputs and make a judgment call",
          "Run the prompt on a diverse test set and measure changes in defined metrics (accuracy, format compliance, relevance)",
          "Ask the model if it's doing better",
          "Check the API response time"
        ],
        "correct": 1,
        "explanation": "Evaluating prompt changes on a handful of examples is unreliable. A systematic evaluation harness with diverse test cases and defined metrics shows whether changes help across the distribution, not just cherry-picked examples.",
        "stage": "post"
      }
    ]
  },
  "10-llms-from-scratch/12-inference-optimization": {
    "questions": [
      {
        "question": "What are the two phases of LLM inference?",
        "options": [
          "Training and evaluation",
          "Prefill (processes the prompt in parallel, compute-bound) and decode (generates tokens one at a time, memory-bound)",
          "Encoding and decoding",
          "Forward and backward"
        ],
        "correct": 1,
        "explanation": "Prefill processes all prompt tokens in parallel (limited by compute). Decode generates tokens autoregressively one at a time (limited by memory bandwidth for loading model weights). Different optimizations target each phase.",
        "stage": "pre"
      },
      {
        "question": "What does KV-cache eliminate during autoregressive generation?",
        "options": [
          "The need for attention masks",
          "Redundant recomputation of key and value vectors for all previous tokens at each generation step",
          "The embedding lookup",
          "The softmax computation"
        ],
        "correct": 1,
        "explanation": "Without KV-cache, generating token N requires recomputing attention keys and values for all N-1 previous tokens. KV-cache stores these vectors, so each new token only computes its own K and V, saving O(N) computation per step.",
        "stage": "pre"
      },
      {
        "question": "What is continuous batching and why does it improve throughput?",
        "options": [
          "Processing all requests in one large batch",
          "Dynamically adding and removing requests from the running batch as they start and finish, instead of waiting for the entire batch to complete",
          "Using larger batch sizes",
          "Batching across multiple models"
        ],
        "correct": 1,
        "explanation": "In static batching, a short request holds its batch slot until the longest request finishes. Continuous batching immediately fills completed slots with new requests, keeping the GPU busy and improving overall throughput.",
        "stage": "post"
      },
      {
        "question": "What problem does PagedAttention (used in vLLM) solve?",
        "options": [
          "It speeds up the attention computation",
          "It manages KV-cache memory in fixed-size blocks like virtual memory, eliminating fragmentation from variable-length sequences",
          "It reduces model size",
          "It improves tokenization speed"
        ],
        "correct": 1,
        "explanation": "KV-cache for variable-length sequences causes memory fragmentation (wasted gaps between allocations). PagedAttention allocates KV-cache in fixed blocks and maps them with a page table, like OS virtual memory.",
        "stage": "post"
      },
      {
        "question": "What is speculative decoding?",
        "options": [
          "Generating multiple responses and picking the best",
          "Using a small draft model to propose multiple tokens that the large model verifies in parallel, speeding up generation",
          "Predicting which tokens the user wants",
          "Caching frequently generated sequences"
        ],
        "correct": 1,
        "explanation": "A small fast model generates N candidate tokens. The large model verifies all N in a single forward pass (parallel). If K tokens are accepted, you've generated K tokens in the time of roughly 1 large-model step.",
        "stage": "post"
      }
    ]
  },
  "10-llms-from-scratch/11-quantization": {
    "questions": [
      {
        "question": "How much VRAM does a 70B parameter model in FP16 require just for weights?",
        "options": [
          "35 GB",
          "70 GB",
          "140 GB",
          "280 GB"
        ],
        "correct": 2,
        "explanation": "70 billion parameters * 2 bytes per FP16 parameter = 140 billion bytes = 140 GB. This exceeds a single A100 (80GB), requiring at least two GPUs just to load the weights.",
        "stage": "pre"
      },
      {
        "question": "What is quantization in the context of LLMs?",
        "options": [
          "Removing unused model layers",
          "Reducing the numerical precision of weights (e.g., FP16 to INT4) to decrease memory usage and increase inference speed",
          "Compressing the training data",
          "Reducing the vocabulary size"
        ],
        "correct": 1,
        "explanation": "Quantization maps high-precision floating point weights to lower-precision integers. INT4 quantization stores each weight in 4 bits instead of 16, reducing memory by 4x with minimal accuracy loss.",
        "stage": "pre"
      },
      {
        "question": "What is the key difference between post-training quantization (PTQ) and quantization-aware training (QAT)?",
        "options": [
          "PTQ is more accurate",
          "PTQ quantizes after training with no retraining; QAT simulates quantization during training so the model learns to tolerate reduced precision",
          "QAT doesn't use gradients",
          "PTQ requires more data"
        ],
        "correct": 1,
        "explanation": "PTQ is fast (just calibrate and quantize) but can lose accuracy. QAT includes fake quantization during training, allowing the model to adjust its weights to be more robust to precision loss. QAT usually gives better accuracy.",
        "stage": "post"
      },
      {
        "question": "What does 'per-channel' quantization mean and why is it better than 'per-tensor'?",
        "options": [
          "It quantizes each output channel separately, using different scale/zero-point for each, reducing quantization error",
          "It processes one color channel at a time",
          "It uses separate GPUs per channel",
          "It's a type of data parallelism"
        ],
        "correct": 0,
        "explanation": "Per-tensor uses one scale factor for the entire weight matrix. Per-channel uses a separate scale for each output channel (row). Since different channels have different value ranges, per-channel captures them more accurately.",
        "stage": "post"
      },
      {
        "question": "Why do 95% of weights in Llama 3 70B fall between -0.1 and +0.1?",
        "options": [
          "The model is poorly trained",
          "Weight decay and normalization during training push weights toward small values, making the full FP16 range wasteful",
          "The weights haven't converged yet",
          "This is specific to the Llama architecture"
        ],
        "correct": 1,
        "explanation": "Weight decay regularization shrinks weights toward zero. Layer normalization keeps activations centered. Combined, they produce weight distributions concentrated near zero, making low-precision quantization effective.",
        "stage": "post"
      }
    ]
  },
  "10-llms-from-scratch/10-evaluation": {
    "questions": [
      {
        "question": "Why have benchmarks like MMLU become less useful for comparing frontier models?",
        "options": [
          "They test the wrong subjects",
          "Frontier models have saturated MMLU (scoring 86-89%), compressing the leaderboard to a range where differences are statistical noise",
          "MMLU was designed for smaller models",
          "The questions are too easy"
        ],
        "correct": 1,
        "explanation": "When GPT-4, Claude 3, and Llama 3 all score 86-89% on MMLU, a 1-point difference is not meaningful. The benchmark no longer discriminates between models, yet it still dominates leaderboard culture.",
        "stage": "pre"
      },
      {
        "question": "What is Goodhart's Law in the context of LLM evaluation?",
        "options": [
          "A law about model scaling",
          "When a measure becomes a target, it ceases to be a good measure -- models and teams optimize for benchmarks instead of real capabilities",
          "A rule about learning rate schedules",
          "A theorem about attention mechanisms"
        ],
        "correct": 1,
        "explanation": "Labs optimize for benchmark scores (data contamination, benchmark-specific prompting). The score goes up, but real-world capability doesn't necessarily improve. Your own task-specific eval is the only reliable measure.",
        "stage": "pre"
      },
      {
        "question": "What is the LLM-as-judge evaluation approach?",
        "options": [
          "Having a human judge evaluate every response",
          "Using a strong LLM (e.g., GPT-4) to score responses against rubrics, replacing expensive human evaluation at scale",
          "Training a separate classifier for evaluation",
          "Using the model to evaluate itself"
        ],
        "correct": 1,
        "explanation": "LLM-as-judge uses a capable model to score responses against defined criteria. It's cheaper and faster than human evaluation, though it has biases (e.g., preferring verbose responses) that must be calibrated.",
        "stage": "post"
      },
      {
        "question": "Why is building a custom evaluation suite important rather than relying on public benchmarks?",
        "options": [
          "Public benchmarks are always wrong",
          "Public benchmarks test general capabilities; your application has specific requirements that only a custom eval can measure",
          "Custom evals are easier to build",
          "Public benchmarks are too expensive"
        ],
        "correct": 1,
        "explanation": "A model scoring 90% on MMLU might fail on your specific task (e.g., extracting dates from legal documents in your format). Only a custom eval with your data, your edge cases, and your success criteria measures what matters.",
        "stage": "post"
      },
      {
        "question": "What is data contamination in the context of LLM benchmarks?",
        "options": [
          "When training data is corrupted",
          "When benchmark questions appear in the model's pre-training data, inflating scores without reflecting true capability",
          "When the model generates incorrect data",
          "When evaluation data is mislabeled"
        ],
        "correct": 1,
        "explanation": "If MMLU questions appeared in the training corpus, the model memorized the answers rather than reasoning about them. This inflates scores and makes benchmark comparisons unreliable. It's a growing problem as training corpora expand.",
        "stage": "post"
      }
    ]
  },
  "10-llms-from-scratch/08-dpo": {
    "questions": [
      {
        "question": "What is the main advantage of DPO over RLHF?",
        "options": [
          "DPO produces better models",
          "DPO eliminates the need for a separate reward model and PPO, training directly on preference pairs in a single loop",
          "DPO uses less training data",
          "DPO works without any preference data"
        ],
        "correct": 1,
        "explanation": "RLHF requires training a reward model separately, then running PPO optimization. DPO folds both steps into a single training objective that directly optimizes the language model on preference pairs.",
        "stage": "pre"
      },
      {
        "question": "What role does the reference model play in DPO?",
        "options": [
          "It generates training data",
          "It serves as the anchor that prevents the trained model from diverging too far, similar to the KL penalty in RLHF",
          "It evaluates model quality",
          "It handles tokenization"
        ],
        "correct": 1,
        "explanation": "The DPO loss compares log probabilities under the trained policy and the reference (usually SFT) model. The reference model constrains how far the policy can drift, preventing reward hacking without explicit KL tuning.",
        "stage": "pre"
      },
      {
        "question": "What does the beta parameter in DPO control?",
        "options": [
          "The learning rate",
          "How strongly the policy is constrained to stay close to the reference model -- higher beta means more conservative updates",
          "The batch size",
          "The number of training epochs"
        ],
        "correct": 1,
        "explanation": "Beta scales the implicit KL divergence penalty. Beta=0.1 allows the model to diverge significantly from the reference (potentially better but riskier). Beta=0.5 keeps it close (safer but less learning).",
        "stage": "post"
      },
      {
        "question": "How does DPO implicitly represent a reward model?",
        "options": [
          "It doesn't -- DPO has no concept of reward",
          "The DPO loss function can be derived by showing that the optimal policy under a reward function is directly expressible through policy log probabilities",
          "It trains a hidden reward model inside the language model",
          "DPO uses the loss function as the reward"
        ],
        "correct": 1,
        "explanation": "Rafailov et al. showed that the closed-form solution of the RLHF objective expresses the reward as a function of the policy's log-probabilities relative to the reference. DPO optimizes this directly, implicitly learning the reward.",
        "stage": "post"
      },
      {
        "question": "When might RLHF still be preferred over DPO?",
        "options": [
          "Always -- RLHF is strictly better",
          "When you need a reusable reward model for evaluating multiple policies or when online data collection is beneficial",
          "When you have less preference data",
          "When training smaller models"
        ],
        "correct": 1,
        "explanation": "DPO is offline (fixed preference data). RLHF allows online data collection where the reward model scores new generations, discovering reward-hacking patterns. A standalone reward model is also useful for evaluation and other policies.",
        "stage": "post"
      }
    ]
  },
  "10-llms-from-scratch/07-rlhf": {
    "questions": [
      {
        "question": "What does the reward model in RLHF learn from?",
        "options": [
          "Raw text documents",
          "Human preference pairs: given two responses, which one humans preferred",
          "Benchmark scores",
          "Model loss curves"
        ],
        "correct": 1,
        "explanation": "The reward model is trained on preference data: pairs of responses to the same prompt where a human labeled which is better. It learns to assign higher scores to responses that match human preferences.",
        "stage": "pre"
      },
      {
        "question": "Why is a KL divergence penalty used in PPO training for RLHF?",
        "options": [
          "To speed up training",
          "To prevent the policy from diverging too far from the SFT model, which would lead to reward hacking",
          "To reduce memory usage",
          "To improve tokenization"
        ],
        "correct": 1,
        "explanation": "Without the KL penalty, the model finds degenerate ways to maximize the reward score (e.g., producing repetitive text that exploits reward model weaknesses). KL keeps the model close to the well-behaved SFT baseline.",
        "stage": "pre"
      },
      {
        "question": "How many separate models are required for a full RLHF pipeline?",
        "options": [
          "One",
          "Two",
          "Three: SFT model, reward model, and policy model being optimized",
          "Four"
        ],
        "correct": 2,
        "explanation": "RLHF requires: (1) SFT model as the starting point and KL reference, (2) reward model trained on preferences, (3) policy model being optimized with PPO. This complexity is why DPO (lesson 08) was developed.",
        "stage": "post"
      },
      {
        "question": "What is 'reward hacking' in RLHF?",
        "options": [
          "When the reward model is attacked by adversaries",
          "When the policy finds ways to maximize the reward score without actually improving response quality",
          "When training data is corrupted",
          "When the learning rate is too high"
        ],
        "correct": 1,
        "explanation": "The reward model is an imperfect proxy for human judgment. The policy can discover patterns that score high rewards (e.g., verbose responses, excessive hedging) without actually being more helpful. The KL penalty limits this.",
        "stage": "post"
      },
      {
        "question": "What does PPO's clipping mechanism prevent?",
        "options": [
          "Gradient overflow",
          "Excessively large policy updates that could destabilize training",
          "Memory overflow",
          "Data leakage"
        ],
        "correct": 1,
        "explanation": "PPO clips the probability ratio between the new and old policy to a range like [0.8, 1.2]. This prevents any single update from changing the policy too drastically, making training more stable than vanilla policy gradient.",
        "stage": "post"
      }
    ]
  },
  "10-llms-from-scratch/06-instruction-tuning-sft": {
    "questions": [
      {
        "question": "What is the fundamental difference between a base language model and an instruction-tuned model?",
        "options": [
          "They have different architectures",
          "A base model continues text patterns; an instruction-tuned model follows instructions and answers questions",
          "Instruction-tuned models are larger",
          "Base models are faster"
        ],
        "correct": 1,
        "explanation": "A base model trained with next-token prediction continues text patterns. Ask it a question and it may generate more questions. SFT teaches it to produce answers by training on (instruction, response) pairs.",
        "stage": "pre"
      },
      {
        "question": "What is the purpose of masking loss on non-assistant tokens during SFT?",
        "options": [
          "To speed up training",
          "To train the model only to generate responses, not to memorize the instruction format or system prompts",
          "To reduce memory usage",
          "To prevent overfitting"
        ],
        "correct": 1,
        "explanation": "During SFT, you want the model to learn how to respond, not how to reproduce the instruction. Loss masking sets the loss to 0 for system/user tokens so gradients only come from the assistant's response tokens.",
        "stage": "pre"
      },
      {
        "question": "What format does SFT training data typically follow?",
        "options": [
          "Raw text documents",
          "Chat template with system, user, and assistant roles marked by special tokens",
          "Key-value pairs",
          "SQL queries and results"
        ],
        "correct": 1,
        "explanation": "SFT data uses a structured chat format: a system prompt setting behavior, a user instruction, and an assistant response. Special tokens mark role boundaries so the model learns the conversational structure.",
        "stage": "post"
      },
      {
        "question": "Why might an SFT model produce lower perplexity on benchmarks but worse conversational quality?",
        "options": [
          "The benchmarks are wrong",
          "SFT optimizes for pattern matching on training examples, not for the nuanced quality judgments humans care about -- that requires RLHF/DPO",
          "The model is too small",
          "The learning rate was wrong"
        ],
        "correct": 1,
        "explanation": "SFT teaches the model to follow formats and produce plausible responses. It doesn't teach which response is better when multiple valid options exist. Human preference alignment (RLHF/DPO) addresses this gap.",
        "stage": "post"
      },
      {
        "question": "How many high-quality instruction-response pairs are typically needed for effective SFT?",
        "options": [
          "Millions",
          "10,000 to 100,000 high-quality examples",
          "Fewer than 100",
          "Billions"
        ],
        "correct": 1,
        "explanation": "SFT is surprisingly data-efficient. Studies show that 10K-100K high-quality examples (like the Alpaca or LIMA datasets) can effectively teach instruction following. Quality matters far more than quantity.",
        "stage": "post"
      }
    ]
  },
  "10-llms-from-scratch/05-scaling-distributed": {
    "questions": [
      {
        "question": "A 7B parameter model in FP16 needs how much VRAM just for weights?",
        "options": [
          "7 GB",
          "14 GB",
          "28 GB",
          "56 GB"
        ],
        "correct": 1,
        "explanation": "Each parameter in FP16 is 2 bytes. 7 billion * 2 bytes = 14 GB. With Adam optimizer states (2 copies) and gradients, total training memory is roughly 56 GB before accounting for activations.",
        "stage": "pre"
      },
      {
        "question": "What are the three types of parallelism used in distributed training?",
        "options": [
          "CPU, GPU, and TPU parallelism",
          "Data parallelism, tensor parallelism, and pipeline parallelism",
          "Batch, sequence, and token parallelism",
          "Forward, backward, and optimizer parallelism"
        ],
        "correct": 1,
        "explanation": "Data parallelism replicates the model on each GPU and splits the data. Tensor parallelism splits individual layers across GPUs. Pipeline parallelism splits the model's layers into stages across GPUs.",
        "stage": "pre"
      },
      {
        "question": "What does FSDP (Fully Sharded Data Parallel) do that standard DDP does not?",
        "options": [
          "It uses a different optimizer",
          "It shards model parameters, gradients, and optimizer states across GPUs instead of replicating the full model on each",
          "It processes data faster",
          "It supports more GPUs"
        ],
        "correct": 1,
        "explanation": "Standard DDP replicates the entire model on every GPU (wasteful). FSDP shards parameters across GPUs so each holds only a fraction. Parameters are gathered on-demand for computation and released after.",
        "stage": "post"
      },
      {
        "question": "What is DeepSpeed ZeRO Stage 3?",
        "options": [
          "A quantization method",
          "It partitions optimizer states, gradients, AND model parameters across GPUs, achieving maximum memory efficiency",
          "A learning rate schedule",
          "A data preprocessing pipeline"
        ],
        "correct": 1,
        "explanation": "ZeRO Stage 1 shards optimizer states, Stage 2 adds gradient sharding, Stage 3 adds parameter sharding. Stage 3 gives maximum memory savings, allowing training of models that far exceed single-GPU memory.",
        "stage": "post"
      },
      {
        "question": "Why is gradient synchronization necessary in data-parallel training?",
        "options": [
          "To prevent overfitting",
          "Each GPU computes gradients on different data; averaging gradients across GPUs ensures all replicas update identically",
          "To reduce memory usage",
          "To speed up the forward pass"
        ],
        "correct": 1,
        "explanation": "In data parallelism, each GPU processes a different batch and computes different gradients. AllReduce averages these gradients across all GPUs so every replica applies the same update and stays in sync.",
        "stage": "post"
      }
    ]
  },
  "10-llms-from-scratch/04-pre-training-mini-gpt": {
    "questions": [
      {
        "question": "What training objective does GPT use during pre-training?",
        "options": [
          "Masked language modeling (predicting masked tokens)",
          "Next-token prediction: given previous tokens, predict the next one",
          "Sentence classification",
          "Image-text alignment"
        ],
        "correct": 1,
        "explanation": "GPT is a causal (autoregressive) language model trained with next-token prediction. Given tokens [t1, t2, ..., tn], it learns to predict tn+1. The loss is cross-entropy between predicted and actual next tokens.",
        "stage": "pre"
      },
      {
        "question": "How many transformer layers, attention heads, and embedding dimensions does GPT-2 Small (124M) have?",
        "options": [
          "6 layers, 6 heads, 512 dims",
          "12 layers, 12 heads, 768 dims",
          "24 layers, 16 heads, 1024 dims",
          "48 layers, 25 heads, 1600 dims"
        ],
        "correct": 1,
        "explanation": "GPT-2 Small has 12 transformer layers, 12 attention heads per layer, and 768-dimensional embeddings. This architecture has 124 million parameters and can be trained on a single GPU in a few hours.",
        "stage": "pre"
      },
      {
        "question": "What is the role of the causal attention mask in GPT?",
        "options": [
          "It prevents attention to padding tokens",
          "It prevents each token from attending to future tokens, ensuring the model can only use past context for predictions",
          "It masks out low-confidence attention scores",
          "It reduces memory usage during training"
        ],
        "correct": 1,
        "explanation": "The causal mask is a triangular matrix that sets future positions to -infinity before softmax. Token at position 5 can attend to positions 1-5 but not 6+. This ensures the model generates tokens left-to-right.",
        "stage": "post"
      },
      {
        "question": "What does 'temperature' control during text generation?",
        "options": [
          "The speed of generation",
          "The randomness of token selection: lower temperature makes outputs more deterministic, higher makes them more diverse",
          "The number of tokens generated",
          "The model's confidence threshold"
        ],
        "correct": 1,
        "explanation": "Temperature divides logits before softmax. Temperature=0.1 makes the distribution very peaked (nearly deterministic). Temperature=1.0 is the training distribution. Temperature>1.0 flattens it, increasing randomness.",
        "stage": "post"
      },
      {
        "question": "Why does pre-training require significantly more compute than fine-tuning?",
        "options": [
          "Pre-training uses larger batch sizes",
          "Pre-training processes trillions of tokens from scratch to learn general language patterns, while fine-tuning adjusts an already-capable model on thousands of examples",
          "Pre-training uses a different architecture",
          "Fine-tuning doesn't use gradients"
        ],
        "correct": 1,
        "explanation": "Pre-training builds all language knowledge from random weights over trillions of tokens. Fine-tuning starts from these learned weights and adjusts them on a much smaller dataset (thousands to millions of examples).",
        "stage": "post"
      }
    ]
  },
  "10-llms-from-scratch/03-data-pipelines": {
    "questions": [
      {
        "question": "Why can't you simply load all pre-training data into memory?",
        "options": [
          "Python doesn't support large arrays",
          "Pre-training corpora are terabytes in size, far exceeding available RAM, requiring streaming pipelines",
          "Loading data into memory is slower",
          "Memory is only needed for model weights"
        ],
        "correct": 1,
        "explanation": "LLM pre-training data is typically 1-15 TB of text. Even with 256GB of RAM, you can't hold the full dataset. Streaming pipelines process data on-the-fly, loading only what's needed for the current batch.",
        "stage": "pre"
      },
      {
        "question": "Why is data deduplication important for pre-training?",
        "options": [
          "It saves disk space",
          "Duplicate documents cause the model to memorize specific text verbatim and waste training compute on repeated content",
          "It speeds up tokenization",
          "It reduces the vocabulary size"
        ],
        "correct": 1,
        "explanation": "Near-duplicate content (boilerplate, scraped duplicates) causes the model to memorize rather than generalize. Deduplication reduces training compute waste and improves model quality by ensuring diverse training signal.",
        "stage": "pre"
      },
      {
        "question": "What is the purpose of creating fixed-length training sequences from variable-length documents?",
        "options": [
          "It makes the text easier to read",
          "GPU training requires uniform tensor shapes, so documents must be packed or padded into fixed-length sequences",
          "Fixed-length sequences are more accurate",
          "It reduces the total number of tokens"
        ],
        "correct": 1,
        "explanation": "GPUs process batches of tensors with identical shapes. Variable-length documents must be chunked into fixed-length sequences (e.g., 2048 or 4096 tokens) with proper attention masks at document boundaries.",
        "stage": "post"
      },
      {
        "question": "What happens if the data pipeline is slower than GPU training speed?",
        "options": [
          "Training automatically slows down to match",
          "The GPU sits idle waiting for batches, wasting expensive compute time",
          "The model trains on the same batch repeatedly",
          "Nothing -- the pipeline runs asynchronously"
        ],
        "correct": 1,
        "explanation": "If the dataloader can't serve batches fast enough, the GPU stalls between steps. On A100 clusters costing $30+/hour, pipeline bottlenecks directly waste money. Profiling pipeline throughput is essential.",
        "stage": "post"
      },
      {
        "question": "Why is data quality filtering (language detection, content filtering) applied before tokenization?",
        "options": [
          "Tokenizers can't handle low-quality text",
          "Low-quality data (spam, boilerplate, toxic content) degrades model capabilities proportional to its share of training data",
          "Filtering after tokenization is impossible",
          "It reduces tokenization time"
        ],
        "correct": 1,
        "explanation": "The model learns from whatever data it sees. If 10% of training data is spam or low-quality content, the model allocates 10% of its capacity to reproducing those patterns. Filtering early ensures only high-quality signal reaches the model.",
        "stage": "post"
      }
    ]
  },
  "10-llms-from-scratch/02-building-a-tokenizer": {
    "questions": [
      {
        "question": "Why does a basic BPE tokenizer break on multilingual or code input?",
        "options": [
          "BPE is inherently monolingual",
          "Without proper Unicode handling, byte fallback, and pre-tokenization regex, it produces incorrect or inefficient token sequences",
          "Multilingual text can't be tokenized",
          "BPE only works on ASCII"
        ],
        "correct": 1,
        "explanation": "A naive BPE implementation may not handle multi-byte Unicode characters, may merge across word boundaries incorrectly, and may not have byte-level fallback for characters outside the trained vocabulary.",
        "stage": "pre"
      },
      {
        "question": "What is the role of pre-tokenization regex in a production tokenizer?",
        "options": [
          "It removes punctuation",
          "It splits text at word boundaries before BPE merges, preventing merges across spaces and word boundaries",
          "It compresses whitespace",
          "It converts text to lowercase"
        ],
        "correct": 1,
        "explanation": "Pre-tokenization regex splits text into chunks (typically at word boundaries, numbers, and punctuation) so BPE merges only happen within chunks. Without this, BPE could merge 'end' with the space before the next word.",
        "stage": "pre"
      },
      {
        "question": "What is a special token and why are tokenizers designed to handle them?",
        "options": [
          "Tokens that appear frequently",
          "Reserved tokens like <|endoftext|> or [PAD] that control model behavior and must be encoded as single, specific IDs",
          "Tokens with the highest embedding values",
          "Tokens used only during evaluation"
        ],
        "correct": 1,
        "explanation": "Special tokens serve structural purposes: marking document boundaries, padding sequences, indicating start/end of generation. They must be recognized and encoded as their exact IDs, not broken into subwords.",
        "stage": "post"
      },
      {
        "question": "How do you evaluate whether a custom tokenizer is good?",
        "options": [
          "By checking if it can tokenize your name",
          "By measuring compression ratio (tokens per character) across diverse text and comparing to established tokenizers like tiktoken",
          "By counting the vocabulary size",
          "By measuring encoding speed only"
        ],
        "correct": 1,
        "explanation": "Compression ratio (bytes per token or tokens per word) measures efficiency. A good tokenizer produces fewer tokens for the same text, which means more content fits in the context window. Compare across languages and domains.",
        "stage": "post"
      },
      {
        "question": "Why is byte-level BPE preferred over word-level tokenization for modern LLMs?",
        "options": [
          "It's faster",
          "It can represent any input without unknown tokens while still learning efficient subword merges for common patterns",
          "It produces smaller vocabularies",
          "Word-level tokenization is more accurate"
        ],
        "correct": 1,
        "explanation": "Word-level tokenizers can't handle unseen words (producing [UNK] tokens). Byte-level BPE starts from raw bytes (guaranteeing coverage of any input) and learns merges for common sequences, balancing coverage with efficiency.",
        "stage": "post"
      }
    ]
  },
  "10-llms-from-scratch/01-tokenizers": {
    "questions": [
      {
        "question": "What is the primary purpose of a tokenizer in an LLM pipeline?",
        "options": [
          "To remove stop words from text",
          "To convert text into a sequence of integers that the model can process",
          "To translate text between languages",
          "To compress text for storage"
        ],
        "correct": 1,
        "explanation": "LLMs process numbers, not text. The tokenizer converts every character, word, and symbol into integer IDs from a fixed vocabulary. This conversion is not neutral -- it determines how the model 'sees' language.",
        "stage": "pre"
      },
      {
        "question": "What does BPE (Byte Pair Encoding) do to build its vocabulary?",
        "options": [
          "Splits text into individual characters only",
          "Iteratively merges the most frequent adjacent pair of tokens until reaching the target vocabulary size",
          "Uses a dictionary lookup for whole words",
          "Randomly assigns IDs to substrings"
        ],
        "correct": 1,
        "explanation": "BPE starts with individual bytes/characters and repeatedly merges the most common adjacent pair. 'th' + 'e' becomes 'the'. After thousands of merges, common words become single tokens while rare words are split into subword pieces.",
        "stage": "pre"
      },
      {
        "question": "Why does vocabulary size create a tradeoff in LLM design?",
        "options": [
          "Larger vocabularies always perform better",
          "Too small creates long sequences (more computation); too large wastes embedding parameters on rare tokens",
          "Vocabulary size doesn't affect model performance",
          "Smaller vocabularies are always more efficient"
        ],
        "correct": 1,
        "explanation": "Small vocabulary (e.g., character-level) means every word is many tokens, increasing sequence length and computation. Large vocabulary wastes parameters on tokens that rarely appear in training data. Most LLMs use 32K-100K tokens.",
        "stage": "post"
      },
      {
        "question": "What problem does byte-level fallback solve in tokenization?",
        "options": [
          "It speeds up tokenization",
          "It ensures any input (emoji, rare scripts, binary data) can be encoded without 'unknown' tokens",
          "It reduces vocabulary size",
          "It improves model accuracy"
        ],
        "correct": 1,
        "explanation": "With byte-level fallback, the tokenizer can fall back to raw byte values (256 possible) for any character not in the vocabulary. This guarantees complete coverage -- no input is ever 'unknown.'",
        "stage": "post"
      },
      {
        "question": "How does the tokenizer affect non-English language performance in LLMs?",
        "options": [
          "Tokenizers work equally well for all languages",
          "Languages underrepresented in training data get worse token merges, requiring more tokens per word and wasting context window",
          "Non-English text is always character-tokenized",
          "Tokenization doesn't affect language performance"
        ],
        "correct": 1,
        "explanation": "BPE merges are learned from training data. If Japanese text is 5% of the corpus, Japanese characters get fewer merges, requiring 2-5x more tokens per word than English. This effectively shrinks the context window for non-English text.",
        "stage": "post"
      }
    ]
  },
  "07-transformers-deep-dive/02-self-attention-from-scratch": {
    "questions": [
      {
        "stage": "pre",
        "question": "Why does vanilla self-attention scale the dot product by 1/sqrt(d_k)?",
        "options": [
          "To make the output values between 0 and 1",
          "To prevent dot products from growing large in high dimensions, which would push softmax into regions with tiny gradients",
          "To normalize the query and key vectors to unit length",
          "To reduce the computational cost of the matrix multiplication"
        ],
        "correct": 1,
        "explanation": "When d_k is large, the dot product of random vectors grows proportionally to sqrt(d_k). Without scaling, softmax receives large inputs, producing near-one-hot outputs where gradients vanish."
      },
      {
        "stage": "pre",
        "question": "What are the three projections in self-attention?",
        "options": [
          "Input, hidden, and output",
          "Query, key, and value -- each a learned linear projection of the same input",
          "Encoder, decoder, and cross-attention",
          "Embedding, position, and segment"
        ],
        "correct": 1,
        "explanation": "Self-attention projects the input through three different weight matrices to produce queries (what am I looking for?), keys (what do I contain?), and values (what do I output if matched?)."
      },
      {
        "stage": "post",
        "question": "In multi-head attention with 8 heads and d_model=512, what is the dimension of each head?",
        "options": [
          "512 -- each head sees the full dimension",
          "64 -- d_model is split evenly across heads (512/8=64)",
          "8 -- one dimension per head",
          "4096 -- each head expands the representation"
        ],
        "correct": 1,
        "explanation": "Multi-head attention splits d_model into h heads, each operating on d_k = d_model/h dimensions. With 512/8 = 64 dimensions per head, the total computation cost equals single-head attention at full dimension."
      },
      {
        "stage": "post",
        "question": "What does the causal mask in autoregressive attention prevent?",
        "options": [
          "It prevents the model from attending to padding tokens",
          "It prevents each position from attending to future positions, ensuring the model can only use past context when predicting the next token",
          "It prevents attention weights from becoming too large",
          "It prevents the model from attending to its own position"
        ],
        "correct": 1,
        "explanation": "In autoregressive generation, token t must not see tokens t+1, t+2, etc. The causal mask sets future positions to -infinity before softmax, zeroing out their attention weights."
      },
      {
        "stage": "post",
        "question": "Why does self-attention have O(n^2) complexity in sequence length n?",
        "options": [
          "Because the model has n layers stacked on top of each other",
          "Because every token computes attention scores with every other token, producing an n x n attention matrix",
          "Because the feedforward layers after attention are quadratic",
          "Because backpropagation through attention requires n^2 gradient computations"
        ],
        "correct": 1,
        "explanation": "The QK^T matrix multiplication produces an n x n attention matrix where entry (i,j) is the attention from token i to token j. Both computation and memory scale as O(n^2), which is why long-context models need techniques like FlashAttention."
      }
    ]
  },
  "04-computer-vision/28-world-models-video-diffusion": {
    "questions": [
      {
        "stage": "pre",
        "question": "What architectural difference distinguishes an action-conditioned world model (Genie 3) from a pure video generation model (Sora 2)?",
        "options": [
          "Action-conditioned models are smaller",
          "Pure video generators condition on a prompt at t=0 and roll out; action-conditioned world models take a latent or explicit action per frame so the user can steer the rollout mid-generation",
          "Only the training datasets differ",
          "World models only work on 3D scenes"
        ],
        "correct": 1,
        "explanation": "Sora 2 is autoregressive on spacetime tokens; its prompt sets the scene but you cannot change direction mid-rollout. Genie 3 infers or takes a latent action at each step and conditions the next-frame prediction on it, letting the user interact with the simulated world. This interactivity is what makes a model a 'world simulator' rather than a video generator."
      },
      {
        "stage": "pre",
        "question": "Divided attention in a video transformer means what?",
        "options": [
          "Half the tokens are masked",
          "Each block does a temporal attention (same spatial position, across frames) followed by a spatial attention (same frame, across positions); this factorises cost from O((T*H*W)^2) into O((H*W)*T^2) + O(T*(H*W)^2) — dramatically cheaper than the joint product",
          "Only half the layers run attention",
          "Attention is split across GPUs"
        ],
        "correct": 1,
        "explanation": "Full joint attention over spacetime tokens is prohibitive: for T=150 temporal tokens and a 60x45 spatial grid (2700 spatial tokens), the joint (T*H*W)^2 ≈ 1.6e11 pairs. Divided attention runs temporal attention at each spatial position (H*W * T^2 ≈ 6.1e7) and spatial attention at each timestep (T * (H*W)^2 ≈ 1.1e9) — multiple orders of magnitude less. TimeSformer introduced this pattern; almost every 2026 video DiT (Sora, Wan, HunyuanVideo) uses a divided or window variant."
      },
      {
        "stage": "post",
        "question": "Sora 2's 2026 release advertised better physical plausibility. Which specific failure modes did this target?",
        "options": [
          "Colour balance and contrast",
          "Weight, balance, object permanence, cause-and-effect — the model now handles dropped objects, characters colliding, and 'failures on purpose' (a missed jump) more believably than Sora 1",
          "Text rendering inside images",
          "Video length"
        ],
        "correct": 1,
        "explanation": "Prior-generation video models famously failed on spaghetti-eating, drinking from glasses, and persistent-object scenes — hands would pass through objects, items would disappear mid-action. Sora 2 explicitly advertises improvements on weight, balance, object permanence, and cause-and-effect, measured against internal and public plausibility benchmarks. These are the dominant quality failures the field is still working on."
      },
      {
        "stage": "post",
        "question": "In the emerging robotics stack (VLM + video generation + inverse dynamics), what does the inverse dynamics model do?",
        "options": [
          "It generates the next frame",
          "It takes a pair (current observation, desired next observation from the video model) and outputs the low-level motor action that would connect them; this closes the loop between imagined rollouts and actual actuation",
          "It trains the VLM",
          "It labels training data"
        ],
        "correct": 1,
        "explanation": "The VLM plans, the video model imagines, and the inverse dynamics model turns imagination into motor commands. Given two consecutive observations, inverse dynamics asks: what action produced this transition? This three-component stack lets a robot train largely in a learned simulator, using the video model to generate data and the inverse dynamics model to execute."
      },
      {
        "stage": "post",
        "question": "Autonomous-driving teams use world models (Cosmos-Drive, Gaia-2, DrivingWorld) to replace what cost?",
        "options": [
          "Actual fleet insurance",
          "Expensive real-world data collection for rare or dangerous corner cases (pedestrian jaywalks, icy roads, unusual vehicles); synthesised driving video provides on-demand training and evaluation data for those scenarios",
          "Road tolls",
          "Vehicle depreciation"
        ],
        "correct": 1,
        "explanation": "Collecting corner-case driving data takes millions of real-world miles. Cosmos-Drive, Gaia-2, and DrivingWorld generate it conditioned on trajectories and maps. Teams use this data to expand training sets, evaluate planners in reproducible conditions, and de-risk scenarios they cannot ethically drive in reality. Replacing a fraction of real-world collection with synthesis is one of the clearest production wins for video world models in 2026."
      }
    ]
  },
  "04-computer-vision/27-multi-object-tracking": {
    "questions": [
      {
        "stage": "pre",
        "question": "What does the Hungarian algorithm do in tracking-by-detection?",
        "options": [
          "It filters out low-confidence detections",
          "It solves the minimum-cost one-to-one assignment between tracks and detections — typically using 1 - IoU as cost — to match each track to at most one detection and vice versa",
          "It trains the detector",
          "It predicts future trajectories"
        ],
        "correct": 1,
        "explanation": "Every tracking-by-detection frame does an assignment problem: M tracks, N detections, find the best one-to-one match. Hungarian is the optimal polynomial algorithm for this. Cost is usually 1 - IoU (higher overlap = lower cost). scipy.optimize.linear_sum_assignment is the standard implementation. SORT, DeepSORT, ByteTrack, BoT-SORT all use it."
      },
      {
        "stage": "pre",
        "question": "ByteTrack's distinguishing contribution is what?",
        "options": [
          "A new backbone",
          "A second-stage association that tries to match leftover tracks to low-confidence detections, recovering short occlusions and IDs that standard trackers would lose by dropping those detections",
          "A new Kalman filter",
          "An appearance embedding"
        ],
        "correct": 1,
        "explanation": "Most trackers discard detections below a confidence threshold (~0.5). ByteTrack keeps them and runs a second Hungarian pass to try to match them to tracks that did not match any high-confidence detection. This recovers brief occlusions and crossings, lifting IDF1 significantly on MOT17 without any learned appearance features. Its simplicity makes it the default in Ultralytics and Roboflow Supervision."
      },
      {
        "stage": "post",
        "question": "How does SAM 2's memory-based tracker avoid explicit Hungarian-style association?",
        "options": [
          "It runs SORT internally",
          "It stores per-instance spatio-temporal features in a memory bank; on each new frame, cross-attention between memory and current features directly produces the mask of the same instance, with association implicit in the attention operation",
          "It uses a Kalman filter",
          "It requires hand-labelled IDs per frame"
        ],
        "correct": 1,
        "explanation": "SAM 2 replaces the detect-then-associate loop with a memory-conditional segmenter. The memory bank holds the instance's features from previous frames. At each new frame, the decoder cross-attends the new frame's features against the memory, and the resulting mask is the same instance — no external assignment step. This handles long occlusions gracefully because the memory stays even when the instance disappears for many frames."
      },
      {
        "stage": "post",
        "question": "For surveillance video where keeping each person's ID consistent is the primary requirement, which metric should you report?",
        "options": [
          "MOTA",
          "IDF1 — the harmonic mean of ID precision and recall; measures identity preservation over time rather than per-frame detection accuracy",
          "Top-1 accuracy",
          "FID"
        ],
        "correct": 1,
        "explanation": "MOTA conflates detection and association errors, so a tracker with many false positives can hide its ID failures. IDF1 is designed for the 'who is who over time' question: it matches predicted tracks to ground-truth tracks globally across the whole video and computes F1 on the identity labels. For surveillance and crowd analytics, IDF1 is the metric to report; HOTA is the broader academic standard."
      },
      {
        "stage": "post",
        "question": "SAM 3.1 Object Multiplex (March 2026) introduces shared memory across many tracked instances. What does that enable?",
        "options": [
          "Lower accuracy",
          "Efficient multi-object tracking — one shared memory bank with per-instance query tokens replaces N separate memory banks, so cost scales sub-linearly in number of instances and concert-crowd-sized scenes become tractable",
          "Cloud-only inference",
          "A new training objective"
        ],
        "correct": 1,
        "explanation": "Pre-Multiplex SAM 2 / SAM 3 tracked each object with its own memory bank; cost scaled linearly with the number of instances. Multiplex (March 2026) introduces one shared memory with per-instance query tokens that fetch instance-specific features. Many-object tracking — crowds, traffic, warehouse workers — becomes efficient for the first time with a memory-based tracker."
      }
    ]
  },
  "04-computer-vision/26-monocular-depth": {
    "questions": [
      {
        "stage": "pre",
        "question": "What is the main difference between relative depth and metric depth?",
        "options": [
          "Relative depth is always lower resolution",
          "There is no difference",
          "Metric depth uses grayscale output; relative uses colour",
          "Relative depth gives only ordered distances without real-world units; metric depth gives distances in metres and requires the model to have learnt absolute scale from training data"
        ],
        "correct": 3,
        "explanation": "Relative depth preserves ordering and ratios but has no anchor to real-world units — a MiDaS or Depth Anything prediction needs alignment before you can compare it to a ground-truth measurement in metres. Metric depth models (ZoeDepth, UniDepth, Metric3D) output calibrated distances at the cost of sensitivity to camera intrinsics and training data coverage."
      },
      {
        "stage": "pre",
        "question": "Depth Anything V3 uses a frozen DINOv2 encoder plus a DPT-style decoder. Why freeze the encoder?",
        "options": [
          "DINOv2 would otherwise learn bad features",
          "DINOv2's self-supervised features already encode scene structure, texture gradients, and object semantics that correlate with depth; freezing them lets the decoder train with a small head on limited depth-supervised data while keeping the encoder's strong generalisation",
          "Compute savings at training time only",
          "Freezing is a legal requirement"
        ],
        "correct": 1,
        "explanation": "Self-supervised ViTs like DINOv2 / DINOv3 already have features that transfer to dense tasks with minimal fine-tuning. A frozen encoder plus a lightweight depth decoder means you train a tiny number of parameters on depth data, and you inherit DINOv2's cross-domain generalisation (indoor, outdoor, medical, satellite) for free. Fine-tuning the backbone sometimes hurts if the depth dataset is narrower than DINOv2's pretraining distribution."
      },
      {
        "stage": "post",
        "question": "To lift a pixel (u, v) with predicted depth d to 3D, you use X = (u - cx) * d / fx, Y = (v - cy) * d / fy, Z = d. What are fx, fy, cx, cy?",
        "options": [
          "Pinhole camera intrinsics — focal lengths and principal point in pixels, from EXIF metadata or camera calibration",
          "Training loss weights",
          "Normalisation constants",
          "Weights learned by the depth decoder"
        ],
        "correct": 0,
        "explanation": "The pinhole-camera formula needs the camera intrinsics. fx, fy are the focal lengths in pixel units; cx, cy are the principal point (usually near image centre). Without intrinsics you can only assume a generic FOV (~60 degrees) which is enough for visualisation but not for measurement. Many 2026 pipelines estimate intrinsics automatically from image content (Perspective Fields, UniDepth)."
      },
      {
        "stage": "post",
        "question": "When evaluating a relative-depth model (MiDaS, Depth Anything), why do you apply scale-and-shift alignment before computing AbsRel?",
        "options": [
          "To inflate the metric score",
          "Relative-depth predictions have arbitrary scale and offset; aligning them to ground truth via least-squares fit of a * pred + b = target gives a fair measurement of the ordering quality that relative models are actually trained to produce",
          "To enable GPU inference",
          "Pytorch cannot compute AbsRel without alignment"
        ],
        "correct": 1,
        "explanation": "MiDaS-style models produce outputs where only the ordering and ratios are meaningful. Directly computing AbsRel without alignment measures the scale mismatch, not the model's actual quality. Least-squares alignment fits a linear transform that minimises squared error; the residual after alignment is what you report. Every MiDaS / Depth Anything paper uses this protocol."
      },
      {
        "stage": "post",
        "question": "Your Depth Anything prediction on a glass-fronted reception desk reports believable but clearly wrong depth for the glass region. Why?",
        "options": [
          "The model is broken",
          "The model was trained without glass data",
          "Glass, mirrors, and highly reflective surfaces break the monocular cues the model relies on; the network sees the texture / content behind the glass and reports a plausible depth consistent with that, not the real glass surface distance",
          "Your image resolution is wrong"
        ],
        "correct": 2,
        "explanation": "Monocular depth relies on texture gradients, occlusion ordering, and perspective cues. Reflective or transparent surfaces confuse all of them: a mirror shows a scene with its own depth; glass shows content behind it. The model fills in a plausible depth and is confidently wrong. This is a fundamental limit of monocular depth, not a bug. Fix by fusing with stereo, LiDAR, or polarisation cameras when materials like glass matter."
      }
    ]
  },
  "04-computer-vision/25-vision-language-models": {
    "questions": [
      {
        "stage": "pre",
        "question": "In the ViT-MLP-LLM VLM pattern, which component is most commonly trained while the others are kept frozen during alignment?",
        "options": [
          "The vision encoder",
          "The projector (the 2-4 layer MLP between ViT and LLM) — it maps vision tokens into the LLM's embedding space and carries most of the cross-modal alignment signal",
          "The LLM",
          "All components are always trained together"
        ],
        "correct": 1,
        "explanation": "The standard VLM recipe trains the projector first with ViT and LLM frozen (alignment stage), then optionally unfreezes everything for pre-training and instruction tuning. The projector is small (tens to hundreds of millions of params) and takes the brunt of the modality bridge. Fine-tuning in production often trains only the projector + LoRA on attention — cheap and effective."
      },
      {
        "stage": "pre",
        "question": "DeepStack (used in Qwen3-VL) does what?",
        "options": [
          "Uses only the deepest ViT layer's features",
          "Stacks features from multiple ViT depths before projection, so the LLM sees both high-level semantics (deep layers) and fine-grained spatial detail (shallow layers)",
          "Doubles the depth of the LLM",
          "Is a specific quantisation scheme"
        ],
        "correct": 1,
        "explanation": "Vanilla VLMs project only last-layer ViT features. DeepStack samples multiple depths, concatenates, and projects. Deep layers give semantics ('this is a chart'); shallow layers give position and texture ('the bar at x=120 is red'). The combination closes the grounding gap on tasks requiring fine localisation, like GUI agent actions or dense captioning."
      },
      {
        "stage": "post",
        "question": "A production VLM shows high text confidence but the generated text describes objects not present in the image. Which metric captures this failure?",
        "options": [
          "Perplexity",
          "Cross-Modal Error Rate (CMER) — fraction of outputs where text confidence is high but image-text cosine similarity (via a CLIP-family checker) is low; ~12% typical on uncurated web data",
          "Accuracy on MMMU",
          "Token generation latency"
        ],
        "correct": 1,
        "explanation": "CMER is a production alignment KPI. It catches the classic VLM hallucination pattern: the model is sure about its text, but the text is not grounded in the image. Monitor CMER per endpoint and prompt type; treat rising CMER as a signal that the model is drifting out of distribution or encountering a prompt category it cannot handle. Skywork.ai cut hallucinations ~35% by making CMER a first-class KPI."
      },
      {
        "stage": "post",
        "question": "Why do modern VLMs use SigLIP or custom vision encoders rather than a supervised ImageNet ResNet as the backbone?",
        "options": [
          "SigLIP is faster",
          "CLIP/SigLIP-style encoders are trained jointly with text, so their output space is already approximately aligned with language; the projector then has to do much less work and the model reasons better about visual-textual concepts",
          "ResNets cannot produce tokens",
          "SigLIP has more parameters"
        ],
        "correct": 1,
        "explanation": "Vision-language pretraining shapes the encoder to live in a text-compatible space. A supervised ImageNet ResNet was trained without any text signal, so bridging to an LLM requires much larger projectors and more data. CLIP/SigLIP/DINOv3 encoders produce features that an LLM can consume with a few linear layers. Almost every SOTA VLM uses a CLIP-family or SigLIP encoder for this reason."
      },
      {
        "stage": "post",
        "question": "Qwen3-VL-235B-A22B achieves top scores on OSWorld. What is OSWorld, and what does this imply?",
        "options": [
          "A synthetic benchmark",
          "An agent benchmark where the model operates desktop GUIs — identifies buttons, reads UI state, emits actions; Qwen3-VL's top scores imply VLMs are now viable visual agents for GUI automation",
          "A pose-estimation benchmark",
          "A video QA benchmark"
        ],
        "correct": 1,
        "explanation": "OSWorld tests whether a model can autonomously operate a desktop environment via screenshots. Qwen3-VL's top global scores indicate the 'visual agent' paradigm — VLM reads screen, decides action, tool-calls the mouse/keyboard — has crossed into practical territory. This is what 2026 AI PC demos run; it is also a direct route into automated QA, RPA, and accessibility products."
      }
    ]
  },
  "04-computer-vision/24-sam3-open-vocab-segmentation": {
    "questions": [
      {
        "stage": "pre",
        "question": "What is Promptable Concept Segmentation (PCS), introduced by SAM 3?",
        "options": [
          "Segmenting all instances of a concept described by a short noun phrase or image exemplar in a single forward pass, returning masks plus unique instance IDs",
          "A visual prompt (point/box) segmentation like classic SAM",
          "A multi-step chain of a detector followed by SAM",
          "A tracking-only mode"
        ],
        "correct": 0,
        "explanation": "PCS is SAM 3's signature capability. You pass 'yellow school bus' or an image exemplar of a bus; SAM 3 returns every matching instance with its own mask and unique ID, plus a presence score. Classic SAM needed one prompt per instance; PCS produces all matches end-to-end."
      },
      {
        "stage": "pre",
        "question": "Why keep a decoupled detector + SAM 2 pipeline (Grounded SAM 2) in 2026 if SAM 3 already does text-prompted segmentation?",
        "options": [
          "Grounded SAM 2 is always more accurate",
          "Modularity — you can swap in different open-vocabulary detectors (DINO-X, Florence-2, Grounding DINO 1.5) for different domains, license constraints, or threshold behaviour; SAM 3's architecture is monolithic",
          "SAM 3 does not support video",
          "SAM 3 is only available in the cloud"
        ],
        "correct": 1,
        "explanation": "Grounded SAM 2 is a composition of a detector and SAM 2 with frozen weights. That modularity is sometimes exactly what you need — a medical-imaging detector, a license-friendly detector, or tight threshold control. SAM 3 is more accurate end-to-end for common use but harder to customise. Both have production roles in 2026."
      },
      {
        "stage": "post",
        "question": "SAM 3's presence head produces what?",
        "options": [
          "The list of candidate bounding boxes",
          "A tracking memory bank",
          "A scalar probability that the queried concept exists in the image, decoupled from localisation; lets the model say 'not present' cleanly and reduces false positives on absent concepts",
          "The final mask"
        ],
        "correct": 2,
        "explanation": "The presence head separates the 'is this here?' decision from the 'where is it?' decision. A model that must produce boxes whenever asked tends to hallucinate matches for absent concepts. With a presence head, SAM 3 can return zero detections cleanly. This also improves discrimination between closely related prompts (e.g., 'a player in white' vs 'a player in red')."
      },
      {
        "stage": "post",
        "question": "SAM 3.1 Object Multiplex (March 2026) introduced a shared-memory mechanism for tracking. What does it replace?",
        "options": [
          "SAM 2 altogether",
          "Per-instance separate memory banks; Multiplex collapses them into one shared memory with per-instance queries so tracking N objects runs substantially faster while keeping accuracy",
          "The whole presence head",
          "The ViT backbone"
        ],
        "correct": 1,
        "explanation": "Prior SAM 2 / SAM 3 tracking maintained one memory bank per tracked instance, so cost grew linearly with object count. Object Multiplex introduces a single shared memory plus per-instance queries that fetch instance-specific features. Many-instance tracking is now efficient — essential for crowds and dense multi-object scenes."
      },
      {
        "stage": "post",
        "question": "You need real-time open-vocabulary DETECTION (boxes only, no masks) on an edge device. Which 2026 model family is the right choice?",
        "options": [
          "SAM 3",
          "A custom CLIP + detector chain",
          "Grounded SAM 2",
          "YOLO-World (and related real-time open-vocab detectors); SAM 3 produces masks and is heavier, while YOLO-World is designed specifically for boxes at high fps on edge hardware"
        ],
        "correct": 3,
        "explanation": "YOLO-World and similar models (OV-DINO, LLMDet) are real-time open-vocabulary detectors. They do not produce masks but they hit 30-60 fps at 640x640 on modest GPUs. SAM 3 is the right choice when masks and tracking matter. Always match tool weight to the task: detection-only is fine without mask overhead."
      }
    ]
  },
  "04-computer-vision/23-diffusion-transformers-rectified-flow": {
    "questions": [
      {
        "stage": "pre",
        "question": "Why did 2024+ SOTA text-to-image models (SD3, FLUX, Z-Image) replace the U-Net denoiser with a Diffusion Transformer (DiT)?",
        "options": [
          "Transformers are easier to write",
          "DiT scales more predictably than U-Net (same scaling-law regime as LLMs), handles long-range spatial dependencies better for prompt-accurate generation, and pairs naturally with text encoders via cross or joint attention",
          "U-Net is not supported on GPUs anymore",
          "DiT has fewer parameters"
        ],
        "correct": 1,
        "explanation": "DiT treats diffusion as just another sequence-modelling task. It scales like language models, avoids the fixed inductive bias of convolutions that can bottleneck long-range structure, and integrates cleanly with transformer text encoders. Every 2026 SOTA model — SD3, FLUX.1, FLUX.2, SD4, Z-Image, Qwen-Image — is a DiT."
      },
      {
        "stage": "pre",
        "question": "Rectified flow trains the model to predict velocity `v = epsilon - x_0` along a straight-line interpolation between data and noise. Why does this enable 20-step sampling instead of 1000?",
        "options": [
          "It does not; rectified flow also needs 1000 steps",
          "The learned ODE is closer to a straight line than DDPM's curved SDE, so few-step Euler integration produces accurate samples; combined with distillation you get 1-4 step variants like FLUX schnell",
          "Euler is strictly better than DDIM",
          "It requires a bigger model"
        ],
        "correct": 1,
        "explanation": "DDPM's reverse process is a stochastic curved path that needs many small steps. Rectified flow defines a straight-line interpolation; the learned velocity is approximately constant along the trajectory. Integrating a near-straight ODE takes few steps. SD3 and FLUX sample at 20-30 steps full quality; schnell/turbo/LCM distil this further to 1-4 steps."
      },
      {
        "stage": "post",
        "question": "MMDiT (SD3) uses two sets of weights, one for text tokens and one for image tokens, that share a single joint attention layer. Why?",
        "options": [
          "To save memory",
          "Text and image embeddings are conceptually different distributions; separate weights let each modality process its own representation while the joint attention lets them interact; the result is better text-image alignment and prompt following than a single shared stream",
          "It is a legacy design",
          "Only image tokens actually go through the attention"
        ],
        "correct": 1,
        "explanation": "Stable Diffusion 3's MMDiT keeps per-modality weight streams to preserve the different statistics of text and image tokens while a joint self-attention layer lets them fuse. This is structurally more expressive than concatenate-and-share (which SD1/2 used), and empirically lifts prompt adherence and text rendering. FLUX extends this to alternating double-stream / single-stream blocks for efficiency."
      },
      {
        "stage": "post",
        "question": "What does AdaLN-Zero mean in a DiT block, and why does it help?",
        "options": [
          "A layer norm with zero epsilon",
          "Adaptive LayerNorm whose modulation MLP is initialised to zero so the block starts as identity; training then learns the scale/shift/gate, which stabilises very deep diffusion transformers",
          "A LayerNorm that is only applied 50% of the time",
          "A LayerNorm with zero mean"
        ],
        "correct": 1,
        "explanation": "AdaLN predicts scale, shift, and gate from the conditioning vector. 'Zero' means the MLP is initialised to zero, so the gate starts at 0 and the block acts as identity. Gradients slowly nudge the modulation away from zero, which prevents the deep stack from diverging early in training. It is the DiT-equivalent of ResNet's residual zero-init and is used in every modern diffusion transformer."
      },
      {
        "stage": "post",
        "question": "FLUX.1-schnell can produce an image in 4 steps. Which technique lets it do that?",
        "options": [
          "A different base architecture than FLUX.1-dev",
          "Distillation — schnell is trained from a slow many-step teacher using adversarial / consistency-style objectives so that 1-4 denoising steps match the teacher's 20-30 step output",
          "Lower precision weights",
          "Smaller parameter count"
        ],
        "correct": 1,
        "explanation": "Schnell / Turbo / LCM variants use step distillation. A small-step student learns to match the many-step teacher's output. The base architecture and parameter count are often identical (FLUX.1-dev and schnell are both 12B). Distillation is what makes sub-1-second inference practical. This is the same idea as SDXL Turbo, SD Turbo, and Latent Consistency Models."
      }
    ]
  },
  "04-computer-vision/22-3d-gaussian-splatting": {
    "questions": [
      {
        "stage": "pre",
        "question": "Why did 3D Gaussian Splatting largely replace NeRF as the production default for photorealistic scene reconstruction by 2026?",
        "options": [
          "Gaussian Splatting produces higher image quality than NeRF in every case",
          "3DGS is explicit (no MLP per pixel): rendering is GPU rasterisation at 100+ fps, training takes minutes instead of hours, scenes are editable, and Khronos + OpenUSD both standardised it in 2026",
          "NeRF was retracted from the research record",
          "PyTorch stopped supporting NeRF operators"
        ],
        "correct": 1,
        "explanation": "3DGS swaps an implicit MLP for millions of explicit 3D Gaussians. Rendering becomes sorted alpha compositing that GPUs run at 100+ fps on consumer hardware. Training runs in minutes. Every Gaussian is editable. By 2026 Khronos ratified a glTF extension for 3DGS and OpenUSD 26.03 shipped a native schema, turning 3DGS into a portable production format."
      },
      {
        "stage": "pre",
        "question": "A 3D Gaussian in a scene carries position, rotation, scale, opacity, and what additional representation to handle view-dependent colour (like specular highlights)?",
        "options": [
          "A second RGB texture",
          "A small MLP per Gaussian",
          "Spherical harmonics coefficients: up to degree 3 gives 16 coefficients per colour channel, evaluated against the viewing direction at render time",
          "A light probe cubemap"
        ],
        "correct": 2,
        "explanation": "Spherical harmonics are the Fourier basis on the sphere. Each Gaussian stores learned SH coefficients that encode how its colour varies with viewing direction. At render time you evaluate the coefficients against the unit vector from pixel to Gaussian centre, giving specular highlights, mild reflections, and view-dependent shading without textures or MLPs."
      },
      {
        "stage": "post",
        "question": "During 3DGS training, densification includes 'clone' and 'split' operations. What triggers each?",
        "options": [
          "Nothing — Gaussians are fixed after initialisation",
          "High gradient magnitude with small scale triggers clone (more local detail needed); high gradient with large scale triggers split (one Gaussian too smooth to fit the region). Opacity-below-threshold triggers pruning",
          "Time since last checkpoint",
          "Random sampling during every epoch"
        ],
        "correct": 1,
        "explanation": "Adaptive densification is what lets 3DGS grow from ~100k SfM-seeded Gaussians to 1-5M at convergence. Clone duplicates under-resolved small Gaussians; split breaks up over-large Gaussians into two smaller ones; prune drops Gaussians whose sigmoid opacity has decayed below the threshold. These three operations plus gradient descent on parameters are the whole training dynamics."
      },
      {
        "stage": "post",
        "question": "The colour equation for one pixel in both NeRF and 3DGS is `C = sum_i alpha_i * T_i * c_i` where `T_i = prod_{j<i}(1 - alpha_j)`. What does this shared equation say about the two methods?",
        "options": [
          "They are mathematically identical in every way",
          "Both integrate the same volumetric rendering equation; the difference is only in the representation (implicit MLP samples vs explicit sparse Gaussians) and the rendering procedure (ray marching vs rasterisation) — which is why their image quality is comparable",
          "NeRF is strictly better",
          "3DGS is strictly better"
        ],
        "correct": 1,
        "explanation": "The shared equation is the classical volumetric render. NeRF evaluates it by sampling along rays and querying an MLP. 3DGS evaluates it by projecting Gaussians to 2D and alpha-compositing sorted primitives per pixel. Same physics, same loss, different data structures and rendering algorithms. That identity is why they land at similar final PSNR / LPIPS; the practical gap is speed and editability."
      },
      {
        "stage": "post",
        "question": "You want to ship a 3DGS scene across Unreal Engine, Vision Pro, Blender, and a Three.js web viewer in 2026. Which export format is the safest bet?",
        "options": [
          "Raw `.ply` alone",
          "glTF with the `KHR_gaussian_splatting` extension (Khronos RC Feb 2026) and/or OpenUSD 26.03 with `UsdVolParticleField3DGaussianSplat`; these are the two ratified/standardised formats in 2026",
          "A custom binary blob per viewer",
          "PNG strips of the 3D Gaussians"
        ],
        "correct": 1,
        "explanation": "Up to 2024, every viewer had its own format. Khronos ratified KHR_gaussian_splatting for glTF in Feb 2026 and OpenUSD 26.03 added a native 3DGS schema in April 2026. Exporting to either gives you portability across engines, viewers, and pipelines. `.ply` remains the interchange lingua franca for research but is less structured. For cross-tool production, glTF + USD is the 2026 answer."
      }
    ]
  },
  "04-computer-vision/21-keypoint-pose": {
    "questions": [
      {
        "stage": "pre",
        "question": "Why do pose models regress heatmaps instead of (x, y) coordinates directly?",
        "options": [
          "Heatmaps are cheaper to compute",
          "The spatial structure of a conv feature map aligns with spatial output; a Gaussian heatmap target provides a smooth loss landscape that tolerates small localisation errors, whereas direct coordinate regression is brittle and loses spatial context",
          "Heatmaps are required by the COCO metric",
          "Coordinate regression produces NaN"
        ],
        "correct": 1,
        "explanation": "Regressing coordinates with MSE asks the network to reduce a 2D position to two scalars, losing the feature-map alignment that CNNs exploit. Heatmap regression gives the network a per-pixel loss that is smooth around the true location and preserves spatial priors. The empirical improvement over coordinate regression is large enough that every modern pose model uses heatmaps."
      },
      {
        "stage": "pre",
        "question": "Top-down pose estimation vs bottom-up: which scales better with crowd size, and why?",
        "options": [
          "Top-down, because each person uses a separate fast model",
          "Bottom-up, because it does one forward pass over the whole image then groups keypoints, so runtime is constant in the number of people",
          "They scale equally",
          "Top-down never scales"
        ],
        "correct": 1,
        "explanation": "Top-down runs a per-person keypoint model after a person detector, so cost grows linearly with the number of people. Bottom-up (OpenPose, HigherHRNet) produces all keypoints and association fields in one pass, then groups them — constant time regardless of crowd density. The trade: top-down is more accurate per-person; bottom-up is faster in crowds."
      },
      {
        "stage": "post",
        "question": "What are Part Affinity Fields?",
        "options": [
          "A scheduling algorithm",
          "2-channel unit-vector fields that encode the direction from one keypoint to another; integrating the PAF along a candidate line tells you whether two keypoints belong to the same instance, enabling bottom-up association without per-person detection",
          "A data augmentation technique",
          "A type of loss function"
        ],
        "correct": 1,
        "explanation": "Per connected keypoint pair (limb), predict a 2-channel field (x, y components of the unit vector pointing from one keypoint to the other). To match a candidate shoulder with a candidate elbow, integrate the PAF along the line joining them; higher integral = stronger match. This turns pose into a bipartite matching problem solvable in polynomial time."
      },
      {
        "stage": "post",
        "question": "Why does sub-pixel refinement around the argmax meaningfully lift keypoint accuracy?",
        "options": [
          "It smooths the heatmap",
          "Integer argmax rounds to the nearest grid cell; fitting a local parabola or using the offset dx = 0.25*(heatmap[y,x+1] - heatmap[y,x-1]) recovers the continuous peak position, often halving the L2 error for cleanly predicted keypoints",
          "It prevents overfitting",
          "It normalises the output"
        ],
        "correct": 1,
        "explanation": "A well-predicted heatmap has a smooth Gaussian peak whose centre is usually between grid cells. Integer argmax loses that sub-pixel information (up to 0.5 px error). Fitting a parabola or using the first-difference offset recovers the continuous peak. For sports analytics, medical landmarks, or anything requiring precise coordinates, this step is mandatory."
      },
      {
        "stage": "post",
        "question": "OKS (Object Keypoint Similarity) is the pose-estimation analogue of what object-detection metric?",
        "options": [
          "Inference latency",
          "IoU — both measure geometric match between prediction and ground truth, with OKS using keypoint distances weighted by each keypoint's annotation variance; COCO reports mAP@OKS 0.5:0.95 for pose",
          "Classification accuracy",
          "Cross-entropy loss"
        ],
        "correct": 1,
        "explanation": "OKS ranges 0 to 1 like IoU and plays the same role: it decides whether a prediction matches a ground-truth pose at a given strictness level. Each keypoint has a variance (COCO publishes them) that scales its contribution — invariant joints like nose and eyes weigh more than wrists, which are annotated less consistently. COCO Pose AP @ OKS 0.5:0.95 is the 2026 community benchmark."
      }
    ]
  },
  "04-computer-vision/20-image-retrieval-metric": {
    "questions": [
      {
        "stage": "pre",
        "question": "For a visual search product where queries are text and gallery items are images, which backbone do you pick first?",
        "options": [
          "A supervised ResNet-50",
          "A CLIP or SigLIP model — they learn a shared text-image embedding space so cosine similarity between text query and image gallery is meaningful out of the box",
          "A self-supervised DINOv2 model",
          "A handcrafted ORB descriptor"
        ],
        "correct": 1,
        "explanation": "Retrieval with text queries requires embeddings where text and image end up in the same space. CLIP/SigLIP train exactly this with the contrastive loss in Lesson 18. Supervised ImageNet features are image-only. DINOv2 is strong but image-only. Text queries demand a vision-language encoder."
      },
      {
        "stage": "pre",
        "question": "What does 'semi-hard mining' mean in triplet-loss training?",
        "options": [
          "Picking random triplets",
          "For each anchor, select a negative that is further than the positive but still within the margin; easy negatives contribute no gradient and hardest negatives can destabilise training, so semi-hard is the sweet spot",
          "Using only the hardest possible negatives",
          "Mining cryptocurrency for training examples"
        ],
        "correct": 1,
        "explanation": "Triplet loss gradient is non-zero only when d(a, n) < d(a, p) + margin. Easy negatives (already far) give zero gradient. Hardest negatives can collapse training. Semi-hard — d(a, p) < d(a, n) < d(a, p) + margin — is where the loss is informative without being unstable. FaceNet introduced this recipe in 2015 and it is still the default for triplet fine-tuning."
      },
      {
        "stage": "post",
        "question": "Your retrieval system reports recall@10 = 0.95 but recall@1 = 0.42. What should you conclude?",
        "options": [
          "The evaluation is broken",
          "The embedding space has the correct structure — relevant items are usually in the top 10 — but ranking within the top 10 is noisy; a re-ranking model (cross-encoder, second-stage scorer) or longer metric-learning fine-tune will fix recall@1 without damaging recall@10",
          "The model is overfitting",
          "Data is leaking from gallery to queries"
        ],
        "correct": 1,
        "explanation": "recall@K vs @1 tells you where the information sits. A high recall@10 with low recall@1 means retrieval is approximately right but the model is not confident about ordering the top few. Re-ranking — a separate model that scores every top-K candidate against the query — is the production fix and is what search engines like Pinterest and Google Photos use."
      },
      {
        "stage": "post",
        "question": "Cosine similarity on unnormalised embeddings is not cosine similarity — what goes wrong?",
        "options": [
          "Nothing, it is fine",
          "It mixes direction with magnitude; cos(a, b) is only correct when both vectors are L2-normalised. On unnormalised embeddings, large-norm items dominate regardless of direction, skewing ranks toward vectors with big magnitudes",
          "PyTorch raises an error",
          "The matmul overflows"
        ],
        "correct": 1,
        "explanation": "cos(a, b) = (a . b) / (||a|| * ||b||). Skipping the normalisation gives you raw inner product, which ranks by direction weighted by magnitude. On typical neural embeddings magnitudes vary 2-3x across samples, and that alone dominates the ranking. Always L2-normalise before computing cosine or before indexing in FAISS IndexFlatIP."
      },
      {
        "stage": "post",
        "question": "Between instance-level retrieval (find this exact car) and category-level retrieval (find cars), which requires metric-learning fine-tuning?",
        "options": [
          "Neither",
          "Instance-level. Off-the-shelf DINOv2 and CLIP embeddings discriminate between categories well but not between visually similar instances of the same category. A triplet or contrastive fine-tune on (same instance, different instance) pairs tightens the embedding around each instance",
          "Category-level",
          "Both require the same amount of fine-tuning"
        ],
        "correct": 1,
        "explanation": "Category-level retrieval is what pretrained models already do: cats cluster near cats, dogs near dogs. Instance-level — same car, same face, same product SKU — needs metric learning because two instances of the same product look very similar in the general embedding space. Fine-tuning with triplet or InfoNCE on instance-labelled pairs shrinks intra-instance distance and grows inter-instance distance."
      }
    ]
  },
  "04-computer-vision/19-ocr-document-understanding": {
    "questions": [
      {
        "stage": "pre",
        "question": "Why does OCR use CTC loss instead of plain cross-entropy?",
        "options": [
          "CTC is faster",
          "OCR maps a fixed-length feature sequence to a variable-length character sequence without per-timestep alignment; CTC loss marginalises over all alignments that reduce to the target after removing repeats and blanks, so you can train without character-level timing labels",
          "CTC is required by PyTorch",
          "Cross-entropy overflows for long sequences"
        ],
        "correct": 1,
        "explanation": "Recognition produces one distribution per time step, but the target text has no per-step alignment. CTC handles that by summing over every alignment that reduces to the target via the merge-repeats-and-remove-blanks operation. This is why CRNNs can be trained on just (image, text) pairs without knowing where each character starts and ends in the image."
      },
      {
        "stage": "pre",
        "question": "In CTC decoding, what does the blank token do?",
        "options": [
          "Pads the sequence to a fixed length",
          "Separates adjacent identical characters so that outputs like 'hello' with a double L can be produced by the model emitting 'h e l _ l o' — without the blank, 'l l' would collapse to one 'l'",
          "Masks noisy regions",
          "Indicates end of sequence"
        ],
        "correct": 1,
        "explanation": "The blank is the mechanism that lets CTC encode double characters. 'll' needs a blank between the two l's so the 'merge repeats' step keeps them distinct: 'l _ l' survives merging, 'l l' does not. Without the blank, CTC cannot represent any word containing adjacent identical characters."
      },
      {
        "stage": "post",
        "question": "Why is greedy CTC decoding sometimes better than beam search on simple datasets?",
        "options": [
          "Greedy is always better",
          "When the model is confident at every step (clean handwriting, printed fonts), greedy's argmax is usually the beam winner; beam search adds latency with no accuracy gain. On noisy or ambiguous inputs, beam search helps",
          "Beam search requires a language model",
          "Greedy is easier to implement"
        ],
        "correct": 1,
        "explanation": "Beam search only wins when the per-step argmax is unreliable — ambiguous characters, overlapping letters, degraded scans. For clean printed text, the model is confident at each step and greedy is within 1% CER of beam. Always benchmark both; the latency trade is real."
      },
      {
        "stage": "post",
        "question": "Donut skips explicit text detection and character recognition. How?",
        "options": [
          "It uses an external OCR engine internally",
          "It is a ViT encoder + text decoder trained to produce the final output string (often JSON) directly from the image; the model learns both localisation and recognition implicitly through the training objective",
          "It is limited to document categories with fixed layouts",
          "It preprocesses images with a CNN text detector"
        ],
        "correct": 1,
        "explanation": "Donut is an end-to-end model: the ViT encoder sees the whole document, the transformer decoder emits the target text or JSON auto-regressively. No pipeline of detector + recogniser + layout module. This skips error accumulation across stages but requires large labelled training sets for the specific document types you care about."
      },
      {
        "stage": "post",
        "question": "For extracting `invoice_total` from receipts, which approach is typically best in 2026?",
        "options": [
          "A hand-crafted regex on Tesseract output",
          "Fine-tuned Donut or a VLM on a small labelled set of the target receipts; both handle layout and semantic extraction in one model and generalise across receipt variants better than pipeline-based approaches",
          "Only classical OCR is reliable enough",
          "A separate CNN for each field"
        ],
        "correct": 1,
        "explanation": "Structured-field extraction used to be the domain of LayoutLM + heuristics. End-to-end models (Donut, Qwen-VL-OCR) have overtaken that path: they accept an image and produce the JSON directly. For a small set of labelled receipts (100-1000), fine-tuning Donut reaches higher F1 than any pipeline of OCR + rules."
      }
    ]
  },
  "04-computer-vision/18-open-vocab-clip": {
    "questions": [
      {
        "stage": "pre",
        "question": "CLIP's contrastive loss is symmetric (image-to-text + text-to-image). Why both directions?",
        "options": [
          "Numerical stability",
          "You want both queries to work at inference: text-to-image retrieval and image-to-text retrieval. Training only one direction makes the other direction's accuracy drop significantly",
          "Because loss must sum to zero",
          "Symmetry is required by PyTorch"
        ],
        "correct": 1,
        "explanation": "The embedding space needs to be symmetric across modalities because downstream tasks query in both directions. Zero-shot classification is text-to-image (classify image given text prompts). Retrieval can go either way. Training with only i2t or only t2i leaves the other direction weak."
      },
      {
        "stage": "pre",
        "question": "Zero-shot classification with CLIP works by... ?",
        "options": [
          "Running a classifier head trained on ImageNet",
          "Encoding prompts like 'a photo of a dog' for each candidate class, encoding the test image, and taking argmax of cosine similarities between the image embedding and all class text embeddings",
          "Fine-tuning the image encoder on the class",
          "Searching a database of labelled examples"
        ],
        "correct": 1,
        "explanation": "Zero-shot means no task-specific training: the model's representations already let you compare images to arbitrary text descriptions. Write one prompt per class, encode all prompts and the test image, cosine similarity, argmax. The only 'trick' is prompt engineering — using multiple templates per class and averaging their embeddings gains 1-3 top-1 on ImageNet."
      },
      {
        "stage": "post",
        "question": "SigLIP replaces CLIP's softmax with a sigmoid loss per pair. What benefit does that give?",
        "options": [
          "Faster GPU kernels",
          "The sigmoid loss is per-pair, so it does not depend on the batch as a normalisation denominator. SigLIP trains well at smaller batch sizes where CLIP's softmax loss starves for negatives",
          "Lower memory use",
          "Better accuracy on COCO only"
        ],
        "correct": 1,
        "explanation": "CLIP's symmetric cross-entropy is a softmax over the whole batch, so effective negatives = batch_size - 1. Small batches starve it. SigLIP is per-pair: each (image, caption) pair gets a binary decision (match or not). No batch-level normalisation, so SigLIP works at batch 128 while CLIP needs 8192. At equal scale SigLIP matches or beats CLIP."
      },
      {
        "stage": "post",
        "question": "A practitioner reports 88% zero-shot top-1 on CIFAR-10 with CLIP ViT-B/32 and 90% with the same model using 80 prompt templates per class. Why does template averaging help?",
        "options": [
          "It doubles the dataset",
          "Different templates activate different aspects of the text encoder's learned distribution; averaging smooths the class embedding over the manifold of plausible natural-language descriptions of the class, producing a more robust centroid",
          "It reduces variance in logit_scale",
          "80 is the magic number for CLIP"
        ],
        "correct": 1,
        "explanation": "Each template is a different natural-language cue. 'a photo of a dog' emphasises one aspect; 'a blurry photo of a dog' another; 'a sketch of a dog' yet another. Averaging the text embeddings gives a smoother representation of the concept 'dog' that is less sensitive to individual-prompt quirks. The OpenAI CLIP paper published 80 templates that lift ImageNet zero-shot by ~2 points."
      },
      {
        "stage": "post",
        "question": "Why do modern VLMs (LLaVA, Qwen-VL, InternVL) use a CLIP-family vision encoder instead of a supervised ImageNet ResNet?",
        "options": [
          "CLIP encoders are faster",
          "CLIP features are aligned with natural language, so the LLM can reason about them with less adaptation; supervised ImageNet features were never trained against captions and need heavy projection layers to bridge to text",
          "ResNets cannot see colour",
          "It is a licensing requirement"
        ],
        "correct": 1,
        "explanation": "A VLM bolts a vision encoder to a language model and trains a small projection. CLIP-style encoders were trained against text, so their outputs already live in a space the LLM can consume with a few linear layers of adaptation. Supervised ImageNet encoders have no notion of natural-language structure and require much larger bridging MLPs to work with an LLM. This is why every SOTA VLM uses a CLIP-family vision tower."
      }
    ]
  },
  "04-computer-vision/17-self-supervised-vision": {
    "questions": [
      {
        "stage": "pre",
        "question": "Why does SimCLR need batch sizes of 512-8192 while supervised ImageNet training works with batch 256?",
        "options": [
          "SimCLR is slower",
          "Each sample needs many negative examples to produce a useful contrastive signal; the batch itself is the pool of negatives. Small batches starve the InfoNCE loss of negatives and training collapses or stalls",
          "Batch norm requires it",
          "Contrastive loss divides by batch size"
        ],
        "correct": 1,
        "explanation": "InfoNCE loss ranks the positive pair against all other samples in the batch. A batch of 32 gives 30 negatives per positive; 1024 gives 2046. More negatives = sharper contrastive signal. MoCo introduced a momentum queue of past features so effective negatives scale beyond the batch size; this is the standard trick when GPU memory limits batch size."
      },
      {
        "stage": "pre",
        "question": "What prevents DINO from collapsing to a constant output?",
        "options": [
          "Strong augmentation alone",
          "A combination of centring (subtract per-dimension EMA mean from the teacher output) and sharpening (low teacher temperature); centring stops one dimension from dominating, sharpening stops the output collapsing to uniform",
          "Large batch size",
          "The momentum schedule"
        ],
        "correct": 1,
        "explanation": "DINO does not use explicit negatives. Without centring, one output dimension can dominate and the student learns to always predict it. Without sharpening (low teacher temperature), the teacher's output becomes near-uniform and the student learns to match uniform, which is also collapse. The two together keep the output diverse across dimensions and peaked per sample."
      },
      {
        "stage": "post",
        "question": "MAE masks 75% of patches. BERT masks 15% of tokens. Why the difference?",
        "options": [
          "75% is arbitrary",
          "Image patches have low entropy — neighbours are highly correlated — so masking only 15% would be trivially solvable by local extrapolation. Masking 75% forces the encoder to learn global semantic features to reconstruct the missing patches",
          "BERT requires 15% by design",
          "Text tokens are larger than image patches"
        ],
        "correct": 1,
        "explanation": "The mask ratio should match the information density of the modality. Text: 15% is enough because each token has many plausible completions. Images: neighbouring pixels almost determine each other, so low mask ratios are solvable without real representation learning. MAE's 75% is calibrated to force semantic understanding."
      },
      {
        "stage": "post",
        "question": "After self-supervised pretraining, the 'linear probe' evaluation trains only what?",
        "options": [
          "The entire encoder",
          "A single linear classifier on top of the frozen encoder features; this isolates feature quality from fine-tuning dynamics",
          "A full MLP classifier head",
          "The positional embedding"
        ],
        "correct": 1,
        "explanation": "Linear probe freezes the encoder and fits Linear(features -> num_classes) on a labelled downstream dataset. The accuracy is a direct measure of the feature space's linear separability — a proxy for feature quality. Fine-tuning the whole backbone adds nonlinear capacity and usually lifts accuracy a few points, but mixes in optimisation effects. Both numbers are reported in SSL papers."
      },
      {
        "stage": "post",
        "question": "Why does MAE use an asymmetric encoder-decoder design (big encoder on 25% visible patches, small decoder on all tokens)?",
        "options": [
          "Memory constraints",
          "The encoder never processes mask tokens; a small decoder only handles reconstruction. This makes encoder FLOPs proportional to visible patches (1/4 of full input) and lets pretraining run 3x faster than naive designs that process all tokens through the full encoder",
          "Masked tokens confuse self-attention",
          "The decoder needs its own backbone"
        ],
        "correct": 1,
        "explanation": "The key efficiency win in MAE: the expensive encoder only ever sees visible patches, which is 25% of the input. Mask tokens appear only in the shallow decoder. This makes pretraining roughly 3x faster than BEiT (which processes all tokens through the encoder) with equal or better downstream accuracy."
      }
    ]
  },
  "04-computer-vision/16-vision-pipeline-capstone": {
    "questions": [
      {
        "stage": "pre",
        "question": "Why do production vision pipelines use Pydantic models (or equivalent) at every stage boundary?",
        "options": [
          "Pydantic is faster than dict access",
          "Typed schemas catch interface mismatches at the boundary; a detector returning (cx, cy, w, h) when the downstream expects (x1, y1, x2, y2) fails loudly with a validation error instead of silently producing empty crops",
          "Pydantic is required by FastAPI",
          "It helps with GPU allocation"
        ],
        "correct": 1,
        "explanation": "Silent interface bugs are the defining pain of ML pipelines. Every boundary has a coordinate system, a channel order, a value range, and a shape. Validating at the boundary with Pydantic turns every mismatch into an immediate error. The cost is a few microseconds; the savings are hours of debugging."
      },
      {
        "stage": "pre",
        "question": "On a CPU-only vision pipeline, which stage is most often the biggest latency block?",
        "options": [
          "The detector's final NMS",
          "Image preprocessing (JPEG decode, colour conversion, resize); it is CPU-bound and often dominates when no GPU is involved or when the GPU model is small",
          "Writing the JSON response",
          "Reading the HTTP request body"
        ],
        "correct": 1,
        "explanation": "On CPU, preprocessing is frequently the biggest single cost. JPEG decode can take milliseconds, colour conversion more, resizing to model input another chunk. The rule is simple: profile before optimising. On GPU the detector typically dominates, but do not assume that on CPU."
      },
      {
        "stage": "post",
        "question": "The pipeline classifier crashes when a detection has box size 3x4 pixels. What is the correct fix?",
        "options": [
          "Add a global try/except and return empty classifications",
          "Set a min_crop threshold (e.g. 16 or 32 pixels) and skip classification for detections smaller than that; log the skip and include the detection in the response without a classification field",
          "Retrain the classifier on smaller images",
          "Increase batch size"
        ],
        "correct": 1,
        "explanation": "Tiny crops are a legitimate failure mode: the classifier was trained on 224x224 inputs and cannot reliably classify 3-pixel patches. A threshold (min_crop) skips those, preserves the detection, and produces a complete, honest response. Generic try/except hides the condition; returning no classification at all hides real failures; the right move is a named, logged skip."
      },
      {
        "stage": "post",
        "question": "You add batching to the classifier (wait up to 10 ms, batch all pending crops, one GPU forward). What is the expected effect?",
        "options": [
          "Latency strictly decreases",
          "Throughput increases significantly, per-request latency increases by up to the batching window (~10ms) plus a smaller amount from larger tensor ops; the right answer depends on whether the service is throughput-bound or latency-bound",
          "Throughput decreases because of the wait",
          "No effect"
        ],
        "correct": 1,
        "explanation": "Batching is a throughput-latency trade. Each request waits up to the window, which adds latency. The batched forward pass is more efficient per image, so throughput scales with batch size. Use batching when QPS is high and individual latency has slack; avoid it when latency SLA is under 50ms."
      },
      {
        "stage": "post",
        "question": "Your pipeline response is a 500 error when a user uploads a corrupted JPEG. How should you fix it?",
        "options": [
          "Ignore it; the user will retry",
          "Catch image-decode failures early in preprocessing, return a 400 with a specific error code like 'image_decode_failed' so the client can retry with a different file instead of a 500 that implies server error",
          "Always return 200 with an empty result",
          "Move decoding to the classifier"
        ],
        "correct": 1,
        "explanation": "A 500 from corrupt user input is an API contract bug. Bad inputs should return 4xx so the client knows it is their problem; 5xx responses signal a server problem and trigger the client's retry logic with the same bad input, amplifying load. Named failure codes (image_decode_failed, image_too_large, unsupported_content_type) let clients react correctly."
      }
    ]
  },
  "04-computer-vision/15-real-time-edge": {
    "questions": [
      {
        "stage": "pre",
        "question": "You benchmark a model and report 'average 12ms per image on a 4090'. What is missing?",
        "options": [
          "Nothing; that is a complete benchmark",
          "Percentiles (p50/p95/p99), warmup discipline, and CUDA synchronisation; a mean alone hides tail latency and may measure kernel dispatch instead of kernel execution",
          "The model size",
          "The dataset name"
        ],
        "correct": 1,
        "explanation": "Production latency is measured in percentiles because real-time systems fail on tails, not averages. Without warmup, JIT compilation inflates the first few measurements. Without torch.cuda.synchronize, GPU kernel launches return before the kernel finishes, so you measure dispatch, not execution. All three have to be right for the number to be meaningful."
      },
      {
        "stage": "pre",
        "question": "FLOPs and on-device latency do not correlate perfectly. Why?",
        "options": [
          "FLOPs counters are broken",
          "Different operations have different hardware friendliness; depthwise convolutions may have lower FLOPs but are memory-bound on GPUs, while dense convolutions use Tensor Cores efficiently. Memory bandwidth, kernel launch overhead, and cache behaviour also shape latency beyond raw FLOPs",
          "FLOPs ignore batch size",
          "PyTorch counts FLOPs incorrectly"
        ],
        "correct": 1,
        "explanation": "FLOPs is a cheap proxy. Wall-clock latency depends on how well an operation matches the hardware's strengths: dense matmuls pin Tensor Cores; depthwise convs stall on memory bandwidth; attention stalls on sequence-length^2 memory reads. For architecture search FLOPs is useful; for deployment decisions measure on the target device."
      },
      {
        "stage": "post",
        "question": "Post-training static INT8 quantisation typically loses how much accuracy on ImageNet-class vision models?",
        "options": [
          "5-10 percentage points",
          "0.1-1 percentage points when properly calibrated; batch-norm-fused conv models are particularly well-behaved under INT8",
          "Always 0; it is lossless",
          "20+ points; unusable"
        ],
        "correct": 1,
        "explanation": "Static PTQ on well-calibrated vision models loses a fraction of a point to about 1 point. The bigger loss modes are (a) insufficient calibration data, (b) quantising activations with extreme outliers (fix with per-channel quantisation or clipping), (c) un-fused BatchNorm layers. When those are handled, INT8 is essentially free."
      },
      {
        "stage": "post",
        "question": "Your mobile app needs a vision model under 10MB with sub-10ms latency. Which backbone do you pick?",
        "options": [
          "ResNet-50",
          "MobileNetV3-Small or EfficientNet-Lite-B0 quantised to INT8; both target this budget and compile cleanly to TFLite / Core ML",
          "ViT-Base",
          "ConvNeXt-Large"
        ],
        "correct": 1,
        "explanation": "Mobile vision shipping in 2026 is still dominated by MobileNetV3 and EfficientNet-Lite variants because they were designed for this budget: depthwise convs, h-swish, squeeze-excite, quantisation-aware from day one. ResNet-50 and ViT-Base are 100MB+ in FP32 and 25MB+ in INT8, blowing the size budget before latency is even measured."
      },
      {
        "stage": "post",
        "question": "You export a PyTorch model to ONNX with opset 17 and it fails with 'Unsupported operator'. What are the most likely causes?",
        "options": [
          "The ONNX library is outdated",
          "(1) A custom op that has no ONNX mapping; (2) a non-deterministic control-flow path that tracing cannot capture; (3) a tensor-scalar interaction that is implicit in Python but has no ONNX equivalent. Fixes: replace the op, use `torch.jit.script` for control flow, or upgrade opset",
          "The model has too many parameters",
          "The input shape is wrong"
        ],
        "correct": 1,
        "explanation": "ONNX export is tracing by default, so anything that tracing cannot capture — runtime control flow, Python-level branches, custom CUDA ops — fails. Most failures are a single node that has no ONNX equivalent (often a tiny custom op or a call to torch.special.*). The fix is either replacing the op, switching to `torch.jit.script`, or moving to a newer opset where the op exists."
      }
    ]
  },
  "04-computer-vision/14-vision-transformers": {
    "questions": [
      {
        "stage": "pre",
        "question": "How does a ViT turn an image into a sequence of tokens?",
        "options": [
          "Flattens the entire image into one vector",
          "Applies a conv with kernel_size = stride = patch_size to split the image into non-overlapping patches and linearly project each to a token embedding in one operation",
          "Runs a CNN first and uses its feature map as tokens",
          "Sorts pixel intensities"
        ],
        "correct": 1,
        "explanation": "The first layer of a ViT is a conv with kernel_size = stride = 16, turning a 224x224 image into a 14x14 grid of 16x16 patches, each projected to dim=768. That single conv does both patchification and projection. The result is 196 tokens that a standard transformer encoder can process."
      },
      {
        "stage": "pre",
        "question": "What is the [CLS] token in ViT and why is it needed?",
        "options": [
          "A learned vector prepended to the token sequence; after N transformer layers its output aggregates the whole image and feeds the classifier head",
          "A special pixel value",
          "A placeholder for missing data",
          "A dropout mask"
        ],
        "correct": 0,
        "explanation": "ViT follows BERT's convention: prepend a learned vector (the CLS token) to the patch sequence. Self-attention lets every token see every other token, so the CLS token aggregates global information from all patches. The classifier reads only the CLS output. Alternative designs use average-pooling over all patch tokens (used by ConvNeXt and many post-ViT models)."
      },
      {
        "stage": "post",
        "question": "Why did the original ViT paper need JFT-300M pretraining to beat ResNet, and why does DeiT not?",
        "options": [
          "ViT is broken without JFT-300M",
          "ViT has weaker inductive biases than CNNs; without enough data it overfits. DeiT showed that with strong augmentation (RandAugment, Mixup, CutMix), stochastic depth, and optionally CNN distillation, ViTs train fine on ImageNet-1k alone",
          "DeiT uses different attention",
          "The ViT paper was wrong"
        ],
        "correct": 1,
        "explanation": "ViT's lack of inductive bias (no locality, no translation equivariance baked in) means the network has to learn these from data. With 1M ImageNet images that is hard; with 300M JFT images it is easy. DeiT replaced the data with training-recipe improvements: heavy augmentation, stochastic depth, and distillation from a CNN teacher, all of which compensate for the lack of priors."
      },
      {
        "stage": "post",
        "question": "Pre-LayerNorm (`x = x + sublayer(LN(x))`) vs post-LayerNorm (`x = LN(x + sublayer(x))`) — which is used in modern transformers and why?",
        "options": [
          "Post-LN; it is simpler",
          "Pre-LN; it trains deeper networks stably without learning-rate warmup and avoids the gradient instabilities that post-LN suffers past about 6 layers",
          "They are identical",
          "Neither; modern transformers skip LayerNorm"
        ],
        "correct": 1,
        "explanation": "Post-LN was the original transformer (2017) and required careful warmup + small learning rates past 6-8 layers. Pre-LN (Xiong et al., 2020; used by ViT, GPT-2+, every modern LLM) is numerically more stable: the residual stream accumulates without passing through LN, and each sublayer operates on a normalised input. Every transformer deeper than 12 layers uses pre-LN."
      },
      {
        "stage": "post",
        "question": "Swin Transformer introduces windowed attention. What problem does it solve?",
        "options": [
          "Vanishing gradients",
          "Full attention has O((H*W)^2) cost; Swin restricts attention to local windows of 7x7 patches, reducing cost to O(H*W * window^2). Alternating blocks shift the window by half its size so information eventually mixes across the image",
          "BatchNorm not supported",
          "Overfitting to texture"
        ],
        "correct": 1,
        "explanation": "A 224x224 image with 4x4 patches has 56*56 = 3136 tokens; full attention is 3136^2 = ~10M pairs per layer. Swin attends only within 7x7 windows, giving 49^2 = 2401 pairs per window (plus the window count). Shifted windows in alternating blocks mix information across windows over a few layers. This brings a CNN-like locality prior back to the transformer without giving up attention."
      }
    ]
  },
  "04-computer-vision/13-3d-vision-nerf": {
    "questions": [
      {
        "stage": "pre",
        "question": "Why cannot a plain CNN process a point cloud directly?",
        "options": [
          "Point clouds are too large",
          "A CNN assumes input pixels arranged on a regular grid with neighbourhood structure; a point cloud is an unordered set of points in R^3 with no grid and variable size, violating both assumptions",
          "CNNs only work on grayscale",
          "Point clouds require quaternions"
        ],
        "correct": 1,
        "explanation": "CNN convolutions need a regular neighbourhood. A point cloud has neither a grid nor a fixed point count. Voxelising the cloud brings back a grid (used by 3D CNNs) but is memory-expensive. PointNet side-stepped this with a permutation-invariant architecture that treats each point independently then aggregates symmetrically."
      },
      {
        "stage": "pre",
        "question": "What trick makes PointNet permutation-invariant over the input points?",
        "options": [
          "Batch normalisation",
          "A shared MLP applied to every point independently, followed by a symmetric aggregation (max pool or sum); since the aggregation ignores point order, the whole network's output is order-invariant",
          "A special loss function",
          "Sorting the points before the forward pass"
        ],
        "correct": 1,
        "explanation": "The symmetric-function trick is the core of every point-cloud network family since 2017. Run the same MLP on every point (same weights, no ordering dependence) and then aggregate with a function that does not depend on order. Max and sum are the two canonical choices; max is used by PointNet and most descendants."
      },
      {
        "stage": "post",
        "question": "A vanilla NeRF MLP fed with raw (x, y, z) coordinates produces blurry results. What fixes it?",
        "options": [
          "Adding more training data",
          "Positional encoding: project coordinates into Fourier features (sin/cos of 2^l * pi * x for multiple l) before the MLP; this lets the low-frequency-biased MLP represent high-frequency details",
          "Using 16-bit precision",
          "Switching to a CNN"
        ],
        "correct": 1,
        "explanation": "MLPs are spectrally biased: they easily fit smooth functions and struggle with high frequencies. Positional encoding lifts each coordinate into a vector that already contains high-frequency signals. The MLP then has a much easier job of composing those features into sharp geometry and texture. The same trick is used in transformer positional encoding and in diffusion time embedding."
      },
      {
        "stage": "post",
        "question": "How is a NeRF rendered pixel computed?",
        "options": [
          "As the output of the final MLP layer",
          "By casting a ray from the camera through the pixel, sampling N points along the ray, querying the MLP at each point for (density, colour), and compositing the samples with a volumetric rendering equation that accumulates alpha-weighted colours along the ray",
          "By looking up a precomputed voxel grid",
          "By running a convolution over a depth map"
        ],
        "correct": 1,
        "explanation": "NeRF rendering is classical volume rendering with a neural density field. For each pixel you pick a ray, sample along it, query (sigma, c) at each sample, and composite using (1 - exp(-sigma * delta)) alphas and cumulative transmittance. Backprop through this rendering step is what trains the MLP from 2D photos — no explicit 3D supervision ever appears."
      },
      {
        "stage": "post",
        "question": "Why has 3D Gaussian splatting largely replaced NeRF in production?",
        "options": [
          "It produces higher-quality images",
          "It is an explicit representation (millions of 3D Gaussians with opacity and colour) that renders in real time via rasterisation instead of MLP queries on sampled rays; training is minutes instead of hours, rendering is 100x faster, and quality is comparable",
          "NeRFs were shown to be mathematically incorrect",
          "Gaussians are more compressible"
        ],
        "correct": 1,
        "explanation": "3D Gaussian Splatting (SIGGRAPH 2023) replaces the implicit MLP-based scene with an explicit cloud of 3D Gaussian primitives. Rendering becomes GPU rasterisation, which is orders of magnitude faster than per-pixel ray sampling through an MLP. Most 2026 NeRF products ship with Gaussian splatting or its successors; the NeRF paradigm still informs the training objective and the math."
      }
    ]
  },
  "04-computer-vision/12-video-understanding": {
    "questions": [
      {
        "stage": "pre",
        "question": "Why does a 2D+pool video model fail on the Something-Something V2 dataset?",
        "options": [
          "The images are too small",
          "The model architecture is incompatible",
          "The dataset's labels are defined by motion direction ('pushing something from left to right'), not appearance; order-invariant average pooling over per-frame features cannot distinguish motion direction",
          "There are too many classes"
        ],
        "correct": 2,
        "explanation": "Something-Something labels are literally 'X moved left to right' vs 'X moved right to left'. The two look identical in any single frame, and averaging frame embeddings is order-invariant so pool(f1, f2, ..., fT) == pool(fT, ..., f2, f1). Motion-defined labels require a model that attends to temporal order."
      },
      {
        "stage": "pre",
        "question": "What is I3D's inflation trick?",
        "options": [
          "A way to pretrain on more images",
          "Take a 2D CNN's pretrained kernels, copy each along a new time axis (dividing by kernel_T to preserve activation scale), and use them to initialise a 3D CNN — giving the 3D model strong weights without 3D pretraining",
          "A scheduler for learning rates",
          "A method for compressing videos"
        ],
        "correct": 1,
        "explanation": "Inflation bootstraps 3D video models from strong 2D ImageNet weights. A 3x3 2D kernel becomes a 3x3x3 3D kernel by replicating along T with a 1/kernel_T rescale. It transfers object and texture features learnt on ImageNet directly into the video model, which is why I3D was the first 3D model to seriously beat 2D+pool baselines."
      },
      {
        "stage": "post",
        "question": "A (2+1)D factorised convolution splits a 3D conv into which two operations?",
        "options": [
          "One temporal conv followed by one depthwise conv",
          "A grouped conv and a 1x1 conv",
          "Two 3D convs with different strides",
          "A spatial 1x3x3 conv followed by a temporal 3x1x1 conv, with a BN+ReLU in between to add a non-linearity that full 3D convs do not have"
        ],
        "correct": 3,
        "explanation": "(2+1)D factorises the 3x3x3 kernel into (1x3x3) then (3x1x1). The two convs have a non-linearity between them (BN+ReLU), which increases expressive power per parameter. On Kinetics, R(2+1)D-34 outperforms an equivalent R3D-34 with fewer params — the extra non-linearity is doing real work."
      },
      {
        "stage": "post",
        "question": "In a video transformer, what does 'divided attention' mean?",
        "options": [
          "Attention over half the tokens",
          "Each transformer block has two attention modules: one over tokens at the same spatial position across time (temporal attention), then one over tokens at the same timestep across space (spatial attention) — breaking the O((T*H*W)^2) full attention into O(T^2) + O((H*W)^2)",
          "Attention applied only during training",
          "Attention that skips some layers"
        ],
        "correct": 1,
        "explanation": "Full joint spatio-temporal attention is O((T*H*W)^2), which is infeasible for long videos. Divided attention (TimeSformer) alternates temporal and spatial attention within each block, bringing cost to O(T^2 + (H*W)^2). It trades off a theoretical loss in expressivity for tractable training; in practice divided attention matches or beats joint on most benchmarks."
      },
      {
        "stage": "post",
        "question": "Your Kinetics-400 model reports 76% clip accuracy and 82% video accuracy. What does the gap tell you?",
        "options": [
          "Per-clip predictions are noisy; averaging predictions across multiple sampled clips per video (test-time augmentation) stabilises the result. A large gap suggests the model's features are sensitive to which 8-frame window was sampled, and longer clips or stronger spatial augmentation during training would shrink the gap",
          "The model is broken",
          "The test set is too small",
          "Clip accuracy is always lower than video accuracy by definition"
        ],
        "correct": 0,
        "explanation": "Clip accuracy evaluates the model on a single sampled window; video accuracy averages predictions across multiple windows. A 6-point gap means the model is sensitive to which window you sampled. Closing the gap means the model has generalised better across the temporal distribution of each video — which is what you want in deployment. Report both numbers always."
      }
    ]
  },
  "04-computer-vision/11-stable-diffusion": {
    "questions": [
      {
        "stage": "pre",
        "question": "Why does Stable Diffusion run its DDPM in a 4x64x64 latent space rather than directly on 3x512x512 pixel images?",
        "options": [
          "Latents are easier to visualise",
          "Training and sampling on 16,384 latent values instead of 786,432 pixels is roughly 48x cheaper; a pretrained VAE handles the image <-> latent conversion, and the diffusion model only has to model the structured latent manifold",
          "Latents are the native output of GPUs",
          "To make inference deterministic"
        ],
        "correct": 1,
        "explanation": "Latent diffusion is the single innovation that made consumer-GPU text-to-image practical. The VAE compresses 48x spatial and channel information. The diffusion model can spend its entire parameter and compute budget modelling the latent manifold, which is the part the user sees after decoding."
      },
      {
        "stage": "pre",
        "question": "What does classifier-free guidance (CFG) do at inference?",
        "options": [
          "Runs two separate models and averages them",
          "Uses one model trained to predict both conditional eps_cond and unconditional eps_uncond noise, then combines them as eps = eps_uncond + w*(eps_cond - eps_uncond) to amplify prompt adherence",
          "Adds a classifier head to the model at test time",
          "Uses a larger scheduler"
        ],
        "correct": 1,
        "explanation": "CFG trains a single model with the conditioning dropped 10% of the time so the same weights produce both cond and uncond predictions. At inference the formula above amplifies the conditional direction. Guidance scale w is the standard knob to tune prompt adherence vs diversity; SD defaults to 7.5."
      },
      {
        "stage": "post",
        "question": "You swap SD's default scheduler for DPM-Solver++ 2M Karras and reduce num_inference_steps from 50 to 20. What is the expected result?",
        "options": [
          "Worse quality and longer runtime",
          "Comparable quality in roughly half the time; DPM-Solver++ is a second-order ODE integrator that converges in fewer steps than DDIM for the same sample quality",
          "Numerical instability",
          "You must also retrain the model"
        ],
        "correct": 1,
        "explanation": "Schedulers are decoupled from the model weights. DPM-Solver++ is a higher-order solver that achieves DDIM-50 quality in about 20 steps. Zero retraining required, and it is the production default in 2026. Going below 8 steps typically needs distilled/consistency-model variants like LCM or Turbo."
      },
      {
        "stage": "post",
        "question": "Why is LoRA fine-tuning popular for Stable Diffusion instead of full fine-tuning?",
        "options": [
          "LoRA produces better images by default",
          "LoRA keeps the 860M base U-Net frozen and inserts tiny rank-decomposition matrices into attention layers, so a fine-tune trains in minutes on consumer hardware, produces 10-50 MB adapters, and can be swapped or mixed at inference",
          "LoRA is required by diffusers",
          "LoRA prevents overfitting entirely"
        ],
        "correct": 1,
        "explanation": "LoRA's value is training cost and distribution. Full SD fine-tuning updates 860M+ parameters and needs 20+ GB of VRAM. LoRA updates ~1-10M parameters and fits in 6-8 GB. The base model is unchanged, so the same LoRA loads into any compatible checkpoint, and multiple LoRAs can be combined. CivitAI's ecosystem is entirely LoRAs."
      },
      {
        "stage": "post",
        "question": "You generate the same prompt with guidance_scale=15 and see oversaturated colours and burned-in artefacts. What is going on?",
        "options": [
          "The model is broken",
          "CFG amplifies the conditional direction; past a threshold around 9-12 the amplification pushes predictions outside the manifold the VAE can decode cleanly, producing visual artefacts. Drop guidance to 7-9 for balanced results",
          "The VAE needs retraining",
          "The seed is wrong"
        ],
        "correct": 1,
        "explanation": "CFG's formula is unbounded: higher w moves the prediction further along (eps_cond - eps_uncond). Past a point, you leave the trained distribution and the VAE decoder produces over-saturated, posterised images. Production default is 7-8. Some newer schedulers support CFG scheduling (lower w at final timesteps) to avoid this."
      }
    ]
  },
  "04-computer-vision/10-image-generation-diffusion": {
    "questions": [
      {
        "stage": "pre",
        "question": "Why can diffusion training pick any timestep t directly instead of simulating the forward Markov chain step by step?",
        "options": [
          "It is an approximation that ignores the intermediate steps",
          "Because the composition of many Gaussian additions still yields a Gaussian, giving a closed-form q(x_t|x_0) = N(sqrt(alpha_bar_t) x_0, (1 - alpha_bar_t) I) that you can sample in one step",
          "Because x_t is independent of x_0",
          "It is required by PyTorch's autograd"
        ],
        "correct": 1,
        "explanation": "Repeated Gaussian additions close up analytically. The cumulative product alpha_bar_t encodes 'how much signal is left after t steps', and you can sample x_t directly without running the chain. This is why diffusion training is O(1) per step rather than O(T)."
      },
      {
        "stage": "pre",
        "question": "What does a DDPM's neural network actually predict?",
        "options": [
          "The next image x_{t-1} directly",
          "The noise epsilon that was added at step t, from which x_{t-1}'s mean is derived analytically",
          "The class label of the input",
          "The signal-to-noise ratio"
        ],
        "correct": 1,
        "explanation": "DDPM parameterises the model to predict epsilon. Given the noise prediction and the noise schedule, x_{t-1}'s Gaussian mean and variance are closed-form. Predicting epsilon instead of x_0 or x_{t-1} simplifies the loss to a plain MSE and gives numerically better gradients."
      },
      {
        "stage": "post",
        "question": "Why does DDIM achieve similar sample quality to DDPM with ~20x fewer steps?",
        "options": [
          "DDIM changes the training objective",
          "DDIM reformulates sampling as a deterministic ODE whose trajectory can be discretised with far fewer steps while hitting nearly the same endpoint; no retraining required",
          "DDIM uses a faster model architecture",
          "DDIM generates smaller images"
        ],
        "correct": 1,
        "explanation": "DDIM's key observation is that the reverse process, when re-parameterised deterministically, becomes an ODE that a few steps approximate well. The model (weights and loss) is unchanged from DDPM; only the sampler differs. A DDPM checkpoint can be used with a DDIM, DPM-Solver, or Euler sampler interchangeably."
      },
      {
        "stage": "post",
        "question": "You plot `alpha_bar_t` for a linear beta schedule with T=1000 and see it drops to near-zero by t=600. Why does this matter?",
        "options": [
          "It does not matter",
          "The last 40% of timesteps add almost no signal; training those timesteps teaches the network to denoise noise that is already approximately N(0, I), which wastes capacity. Cosine or sigmoid schedules fix this by spreading the noise injection more evenly",
          "alpha_bar_t must be zero at the end",
          "PyTorch requires a linear schedule"
        ],
        "correct": 1,
        "explanation": "Linear beta schedules finish the diffusion process too early. By t=600 the signal is already destroyed; training and sampling through t=600-1000 adds nothing. Cosine schedules (Nichol & Dhariwal) keep signal around longer, which is why modern models use them, especially at lower resolutions."
      },
      {
        "stage": "post",
        "question": "Why does time conditioning get added to the U-Net via a sinusoidal embedding instead of a one-hot timestep?",
        "options": [
          "One-hot vectors are too large",
          "A sinusoidal embedding is smooth in t, which lets the network interpolate between timesteps it has not seen exactly and encodes scale information the architecture can use additively at multiple depths",
          "Sinusoidal is required by BatchNorm",
          "One-hot would violate the chain rule"
        ],
        "correct": 1,
        "explanation": "Sinusoidal embeddings give the network a continuous representation of t at multiple frequencies. Any timestep is a unique point in that embedding space, and nearby timesteps are nearby embeddings. That lets the model generalise across all T values with far fewer parameters than a learned per-timestep embedding. Same idea as transformer positional encoding."
      }
    ]
  },
  "04-computer-vision/09-image-generation-gans": {
    "questions": [
      {
        "stage": "pre",
        "question": "Why does GAN training use the non-saturating generator loss -log(D(G(z))) instead of log(1 - D(G(z)))?",
        "options": [
          "They are mathematically different and produce better equilibria",
          "Early in training D(G(z)) is near zero, so log(1 - D(G(z))) has vanishing gradient; -log(D(G(z))) has large gradient there so G receives a useful signal",
          "It speeds up the discriminator",
          "It is required by PyTorch"
        ],
        "correct": 1,
        "explanation": "The two losses share the same gradient direction but very different magnitudes when D(G(z)) is small. log(1 - D(G(z))) plateaus at zero gradient there. The non-saturating form stays informative across the whole range. Goodfellow noted this tweak in the original paper and every modern GAN uses it."
      },
      {
        "stage": "pre",
        "question": "DCGAN's rules say to use strided convolutions instead of pooling. Why?",
        "options": [
          "Pooling is slower on GPUs",
          "Pooling is non-learnable and throws away information the generator might need; strided convs let the network learn its own downsampling, which empirically produces sharper generated images",
          "Pooling breaks gradient flow",
          "Pooling is incompatible with batch norm"
        ],
        "correct": 1,
        "explanation": "Max-pool is a hand-picked downsampling that discards everything but the max. In a generative setting the model benefits from a learned downsampling that can preserve information across the stride. Strided convolutions in D and strided transposed convolutions in G were the architectural change that made DCGANs trainable."
      },
      {
        "stage": "post",
        "question": "You train a GAN and notice G produces almost identical samples regardless of the input noise. Which failure is this?",
        "options": [
          "Vanishing gradients",
          "Mode collapse — G has found a narrow region of the data distribution that consistently fools D and has no incentive to explore; fixes include spectral norm, minibatch discrimination, or a larger batch",
          "Oscillation",
          "The dataset is too small"
        ],
        "correct": 1,
        "explanation": "Mode collapse is the characteristic GAN failure where samples lack diversity. The diagnostic is obvious: noise in, same image out. Fixes all target the discriminator's ability to punish lack of diversity, either by making D more expressive (spectral norm, minibatch discrimination) or by giving G less room to collapse (larger batch, conditional labels)."
      },
      {
        "stage": "post",
        "question": "Why do DCGAN training scripts use Adam with betas=(0.5, 0.999) instead of the default (0.9, 0.999)?",
        "options": [
          "The default is broken",
          "A lower beta1 reduces momentum; in an adversarial game, heavy momentum keeps each optimizer in the wrong direction too long when the other network's behaviour changes, which causes instability",
          "Adam is only supported with beta1=0.5 on CUDA",
          "It is a typo propagated through tutorials"
        ],
        "correct": 1,
        "explanation": "Adam's default beta1=0.9 averages gradients over roughly 10 steps. In a stationary objective that is helpful. In an adversarial game where the loss landscape shifts every D and G update, that averaging delays the optimizer's response and causes oscillation. Radford et al. found beta1=0.5 much more stable, and it is now the GAN default."
      },
      {
        "stage": "post",
        "question": "A colleague reports a GAN with D loss near zero and G loss increasing over training. What is happening and how do you fix it?",
        "options": [
          "Both nets are improving correctly",
          "The discriminator has become too strong and drives G's gradient to zero; fixes include a smaller D, spectral norm, label smoothing on real labels (0.9 instead of 1.0), or switching to WGAN-GP",
          "The generator is correctly overfitting",
          "Nothing — this is the equilibrium"
        ],
        "correct": 1,
        "explanation": "D's loss near zero means D is perfect on both real and fake. At that point the BCE gradient to G vanishes: G sees a near-zero signal no matter what it outputs. The fix is to weaken D or use a loss that does not saturate. Spectral norm (limits D's Lipschitz constant) and WGAN-GP (uses Earth-Mover distance instead of BCE) are the two standard rescues."
      }
    ]
  },
  "04-computer-vision/08-instance-segmentation-mask-rcnn": {
    "questions": [
      {
        "stage": "pre",
        "question": "Why did Mask R-CNN replace RoIPool with RoIAlign?",
        "options": [
          "RoIAlign is faster on GPUs",
          "RoIPool rounds box coordinates to integers at multiple steps, misaligning the feature map from the input pixels by up to a feature-map pixel; RoIAlign uses bilinear sampling with no rounding, preserving localisation",
          "RoIPool only works on CPU",
          "RoIPool was a copyright issue"
        ],
        "correct": 1,
        "explanation": "RoIPool's rounding costs up to a stride-sized misalignment (e.g. 32 pixels on a stride-32 feature map). RoIAlign samples at exact float coordinates via bilinear interpolation. The change lifted mask AP by 3-4 points on COCO in the original paper and is now standard in every detector that cares about localisation."
      },
      {
        "stage": "pre",
        "question": "Mask R-CNN's mask head outputs a 28x28 mask per class per proposal. Why per class?",
        "options": [
          "Because binary masks need per-class channels for backprop",
          "Decoupling mask prediction from classification: the mask head only has to learn the shape for each class separately, so the classifier's decision does not affect which mask is produced, only which channel is read at inference",
          "Binary masks overflow in a single channel",
          "The paper required it"
        ],
        "correct": 1,
        "explanation": "Producing one mask per class per proposal decouples mask shape learning from classification. At inference you read only the channel matching the predicted class. This multi-task decoupling matters because mask shape and class probability are different targets that train with different gradients."
      },
      {
        "stage": "post",
        "question": "torchvision's Mask R-CNN prediction dict has `labels` that start at 1, not 0. Why?",
        "options": [
          "Legacy bug",
          "Class 0 is reserved for background; user classes are always 1-based so the classifier head can treat background as a real class with its own logits and gradients",
          "torchvision uses 1-based indexing throughout",
          "Training data determined it"
        ],
        "correct": 1,
        "explanation": "Most detectors treat background as class 0 and explicit foreground classes as 1..C. The softmax over (C+1) classes lets the network learn to actively predict 'no object here' rather than just low confidence on all classes. A dataset with 4 real classes needs num_classes = 5 when swapping the predictor."
      },
      {
        "stage": "post",
        "question": "You fine-tune Mask R-CNN on a 500-image dataset and val mAP plateaus while train loss keeps dropping. What is the first thing to try?",
        "options": [
          "Add more epochs",
          "Freeze the backbone and FPN so the model only fine-tunes the RPN and heads; 500 images is too few to update 23M backbone parameters without overfitting",
          "Switch to segmentation U-Net",
          "Use a higher learning rate"
        ],
        "correct": 1,
        "explanation": "On small datasets you do not have enough signal to fine-tune every parameter. Freezing the pretrained backbone and FPN (ImageNet + COCO features) and training only the RPN objectness head and the two classifier/mask heads is the standard recipe and usually fixes this plateau in one training run."
      },
      {
        "stage": "post",
        "question": "The FPN inside Mask R-CNN has four levels (P2, P3, P4, P5) at strides 4, 8, 16, 32. Why not just use one level?",
        "options": [
          "To use more GPU memory",
          "Objects in natural images span a range of scales; routing each proposal to the FPN level matching its size gives the head a feature map with the right receptive field for that object, which is strictly better than always using one scale",
          "Four levels is arbitrary",
          "To reduce parameter count"
        ],
        "correct": 1,
        "explanation": "A small object on a stride-32 feature map occupies a single cell, which has almost no spatial information. FPN routes small objects to the high-resolution, shallow levels (P2) and large objects to the low-resolution, deep levels (P5), matching receptive field to object size. This is why every modern detector has a pyramid."
      }
    ]
  },
  "04-computer-vision/07-semantic-segmentation-unet": {
    "questions": [
      {
        "stage": "pre",
        "question": "Why does U-Net need skip connections between the encoder and decoder?",
        "options": [
          "To speed up training",
          "The encoder compresses spatial detail to gain context; the decoder cannot reconstruct sharp boundaries without access to the encoder's high-resolution feature maps, and skips supply exactly that",
          "Because transposed convolutions require extra inputs",
          "To match PyTorch shape conventions"
        ],
        "correct": 1,
        "explanation": "Without skips, a U-Net's decoder is producing H x W predictions from a very low-resolution bottleneck, which cannot resolve crisp edges. Skip connections splice the encoder's high-resolution, low-semantic features into the decoder's low-resolution, high-semantic features so both context and detail are available at every output stage."
      },
      {
        "stage": "pre",
        "question": "A segmentation task has 99% background pixels and 1% tumour pixels. You train with plain cross-entropy and reach 99% pixel accuracy. What happened?",
        "options": [
          "The model converged",
          "The model learned to predict background for every pixel; pixel accuracy is dominated by the majority class and ignores the class you actually care about",
          "The loss function was implemented incorrectly",
          "The optimizer failed"
        ],
        "correct": 1,
        "explanation": "Pixel accuracy on an imbalanced dataset is a useless metric. The network collects the easy 99% by always predicting background and produces empty tumour masks. The fix: combine cross-entropy with Dice loss (overlap-based, scale-free) and report IoU/Dice per foreground class."
      },
      {
        "stage": "post",
        "question": "Which task type separates individual cars of the same class from each other?",
        "options": [
          "Semantic segmentation",
          "Instance segmentation",
          "Both produce the same output",
          "Neither — that requires a detection model instead"
        ],
        "correct": 1,
        "explanation": "Semantic segmentation labels every pixel with a class but merges touching instances of the same class into one blob. Instance segmentation keeps instance IDs, so each car, each person, each apple is a separate predicted mask. Panoptic segmentation unifies both: semantic labels for stuff, instance IDs for things."
      },
      {
        "stage": "post",
        "question": "You swap U-Net's bilinear upsample + 3x3 conv for a ConvTranspose2d with kernel_size=2, stride=2 and see checkerboard artifacts in the output. Why?",
        "options": [
          "Transposed conv is broken in PyTorch",
          "When kernel_size is not evenly divisible by stride, output pixels receive unequal contributions from input pixels, producing a periodic pattern in the output that looks like a checkerboard",
          "The learning rate was too low",
          "Batch norm has to be added before transposed conv"
        ],
        "correct": 1,
        "explanation": "Checkerboard artifacts come from uneven overlap of the transposed convolution's receptive field across output positions. Using kernel_size = stride * n (e.g. kernel 4, stride 2) or replacing transposed conv with bilinear upsample + conv eliminates the artifacts. The modern default is bilinear + conv for this reason."
      },
      {
        "stage": "post",
        "question": "You report mIoU = 0.78 on a 10-class segmentation task. Why should you also publish per-class IoU?",
        "options": [
          "Per-class IoU is required by PyTorch",
          "Mean IoU hides individual class failures; a mIoU of 0.78 is consistent with eight classes at 0.9 and two at 0.3, which is a very different deployment story than all classes near 0.78",
          "Per-class IoU is always higher than mIoU",
          "It is only needed for medical imaging"
        ],
        "correct": 1,
        "explanation": "An aggregate mean compresses the distribution of per-class scores, which is exactly what the reader needs to decide whether the model is ready to ship. Two weak classes in an otherwise strong model may make the system unusable for the intended task; a flat profile means the model needs a uniform data upgrade. Always publish per-class metrics alongside the mean."
      }
    ]
  },
  "04-computer-vision/06-object-detection-yolo": {
    "questions": [
      {
        "stage": "pre",
        "question": "A YOLO detector with grid 13x13, 3 anchors per cell, and 20 classes produces a head output of shape (N, 13, 13, 3, 25). Why is the last dimension 25?",
        "options": [
          "4 box coords + 1 bias + 20 classes",
          "4 box coords + 1 objectness + 20 classes = 5 + C",
          "25 is the number of classes in COCO",
          "It is padding to the next power of 2"
        ],
        "correct": 1,
        "explanation": "Every anchor emits four box regression targets (tx, ty, tw, th), one objectness score, and C class logits. For YOLO-style detectors the per-anchor dimension is always 5 + C. On COCO with 80 classes it is 85; on PASCAL VOC with 20 it is 25."
      },
      {
        "stage": "pre",
        "question": "Why does YOLO predict tx, ty through a sigmoid before adding the grid cell?",
        "options": [
          "To normalise them to [0, 1] so the centre stays inside the cell and cannot escape to a neighbouring cell's territory",
          "Sigmoid is required by the convolution",
          "To prevent NaN during training",
          "To make the box larger"
        ],
        "correct": 0,
        "explanation": "sigmoid(tx) is in [0, 1], so (sigmoid(tx) + cell_x) * stride places the centre somewhere inside the cell at column cell_x. This constraint keeps each cell responsible for only the objects centred within its own area, which is the assumption that makes grid-based training stable."
      },
      {
        "stage": "post",
        "question": "Your detector predicts 15 boxes around a single object after the head. You apply NMS with iou_threshold=0.45 and get back 1 box. What did NMS do?",
        "options": [
          "It averaged all 15 predictions",
          "It sorted the 15 boxes by score, kept the highest-scoring, and deleted every box whose IoU with it exceeded 0.45; the other 14 all overlapped the winner above the threshold so one remained",
          "It picked a random survivor",
          "It merged the boxes geometrically"
        ],
        "correct": 1,
        "explanation": "NMS is a greedy deduplication: sort by score, keep the top, remove everything close to it (IoU > threshold), repeat. It does not merge or average. That is why detection latency benchmarks include NMS time and why modern models like RT-DETR replace it with a learned alternative."
      },
      {
        "stage": "post",
        "question": "Your model has mAP@0.5 = 0.75 but mAP@0.5:0.95 = 0.32. What is the most accurate interpretation?",
        "options": [
          "The model is broken; mAP@0.5 must equal mAP@0.5:0.95",
          "The model finds the right objects but its boxes are not tightly localised — fine at IoU 0.5, fail at IoU 0.7+",
          "The dataset has too many classes",
          "The inference threshold is too high"
        ],
        "correct": 1,
        "explanation": "mAP@0.5 is lenient about localisation; mAP@0.5:0.95 averages over strict thresholds up to 0.95. A big gap between the two means the boxes are in roughly the right place but not tight. Typical fixes: CIoU/DIoU box loss, higher-resolution features, anchor sets better tuned to the dataset."
      },
      {
        "stage": "post",
        "question": "YOLO loss weights lambda_coord=5.0 and lambda_noobj=0.5 roughly mirror the original paper. What do these ratios encode?",
        "options": [
          "GPU memory trade-offs",
          "The fact that most cells have no object, so the no-object cells must be downweighted or they would dominate the total loss; and the fact that box regression is a smaller-scale loss than cross-entropy, so it needs upweighting to produce comparable gradients",
          "Random choices the authors never justified",
          "The number of anchors per cell"
        ],
        "correct": 1,
        "explanation": "In a 13x13 grid there are 169 cells, usually with one to five objects. The 160+ empty cells all contribute objectness loss; without a small lambda_noobj they would overwhelm the positive signal. Conversely, MSE box loss is numerically small next to cross-entropy, so lambda_coord > 1 keeps its gradients comparable. Both ratios are about balancing per-component gradient magnitudes."
      }
    ]
  },
  "04-computer-vision/05-transfer-learning": {
    "questions": [
      {
        "stage": "pre",
        "question": "You have 500 labelled images for a new task close to the ImageNet distribution. Which regime makes the most sense?",
        "options": [
          "Train a ResNet-50 from scratch",
          "Freeze an ImageNet-pretrained backbone and train only a new linear head",
          "Fine-tune every layer with the same large LR",
          "Ignore pretrained weights; small datasets work best with small models"
        ],
        "correct": 1,
        "explanation": "With 500 images you do not have enough signal to train a deep network from scratch or to safely fine-tune all layers end-to-end without destroying pretrained features. Freezing the backbone and training only a new head (linear probe) uses the pretrained features directly and is the standard recipe for small, close-domain datasets."
      },
      {
        "stage": "pre",
        "question": "Why do early conv layers of an ImageNet-pretrained network transfer well to medical images even though ImageNet contains no X-rays?",
        "options": [
          "PyTorch re-initialises early layers automatically",
          "Early layers encode generic visual primitives — edges, orientations, contrast — that are shared across almost any visual domain; only late layers specialise to ImageNet categories",
          "ImageNet secretly contains medical data",
          "Transfer only works when domains match"
        ],
        "correct": 1,
        "explanation": "Gabor-like filters and simple texture detectors are the features early CNN layers learn on any natural-image corpus. They reflect the statistics of light, shadow, and edges that hold across photography, medical imaging, microscopy, and satellite data. Late layers progressively specialise, which is why fine-tuning focuses on the last few blocks."
      },
      {
        "stage": "post",
        "question": "When fine-tuning end-to-end with discriminative learning rates, why should early layers get a smaller LR than late layers?",
        "options": [
          "Early layers have fewer parameters",
          "Early layers encode general features you want to preserve; late layers encode task-specific features that must move; a smaller LR on early layers prevents feature drift and catastrophic forgetting",
          "PyTorch requires layer-wise LR for correctness",
          "A smaller LR in the early layers speeds up training"
        ],
        "correct": 1,
        "explanation": "Early layers already encode the right visual primitives; you want tiny updates so those features are preserved. Late layers need to move toward the new task. One learning rate for the whole model forces a compromise that hurts both ends. Discriminative LRs let each stage move at its own pace, which is the empirical sweet spot for fine-tuning."
      },
      {
        "stage": "post",
        "question": "You fine-tune a ResNet on a 10-class medical dataset of 800 grayscale images (replicated to 3 channels). Accuracy is 10% (random chance for 10 classes). What is the most likely cause?",
        "options": [
          "You used the wrong loss function",
          "BatchNorm running statistics are from ImageNet RGB photos and badly mismatch the grayscale-medical distribution, so the first few BN layers produce noise that propagates forward",
          "ResNet cannot handle grayscale input",
          "800 images is simply too few for any transfer learning"
        ],
        "correct": 1,
        "explanation": "BatchNorm keeps running_mean and running_var from ImageNet. On a small, distribution-shifted dataset those buffers never adapt fast enough during a short fine-tune, and BN normalises activations with the wrong stats. Fixes: freeze BN statistics, switch to GroupNorm, or pretrain BN stats with a BN-only warmup pass on the target dataset."
      },
      {
        "stage": "post",
        "question": "You compare two runs: (a) linear probe on frozen ImageNet backbone, 82% accuracy; (b) end-to-end fine-tune, 78% accuracy. What should you conclude?",
        "options": [
          "Fine-tuning is not helpful; ship the linear probe",
          "A fine-tune that ends below the linear probe is almost always a training bug — LR too high, BN mishandled, or scheduler/optimizer misconfigured; diagnose before concluding anything about transfer",
          "The dataset is too large",
          "Pretrained weights are bad"
        ],
        "correct": 1,
        "explanation": "Fine-tuning should always beat or match the linear probe, since the linear probe is a special case of fine-tuning with backbone LR = 0. If fine-tune is worse, the pipeline is actively destroying pretrained features. The fix is to lower backbone LR, apply discriminative LRs, or freeze BN — not to abandon fine-tuning."
      }
    ]
  },
  "04-computer-vision/04-image-classification": {
    "questions": [
      {
        "stage": "pre",
        "question": "Your model outputs raw logits of shape (N, C). You write `loss = cross_entropy(softmax(logits), y)`. What goes wrong?",
        "options": [
          "Nothing — that is the correct API",
          "cross_entropy re-applies softmax inside, so you end up computing softmax(softmax(logits)), producing nearly-uniform probabilities and useless gradients",
          "cross_entropy raises a ValueError about the shape",
          "Accuracy drops by exactly 1/C"
        ],
        "correct": 1,
        "explanation": "PyTorch's cross_entropy expects raw logits — it fuses log_softmax and NLL internally for numerical stability. Applying softmax first gives softmax(softmax(x)), which compresses logits toward uniform and makes gradients nearly zero. Training loss looks plausible for a few steps then stalls. Always pass raw logits."
      },
      {
        "stage": "pre",
        "question": "You evaluate a 10-class classifier and get 92% accuracy. Class 0 has 9,000 examples; classes 1-9 share 1,000 examples (roughly 111 each, 10,000 total). What does the headline number hide?",
        "options": [
          "Nothing — accuracy is accuracy",
          "The model could be predicting class 0 for every input and still score 90% (9000/10000); the remaining 2% could come from any other class. Per-class precision/recall tells you what is really happening",
          "The validation loss is wrong",
          "The model is definitely over-fitting"
        ],
        "correct": 1,
        "explanation": "On a 9000/1000 split (90/10 imbalance with 10,000 total examples), always predicting the majority class gets 9000/10000 = 90% accuracy. A 92% number could hide nine minority classes at roughly 20% accuracy each. Per-class precision, recall, F1, and the confusion matrix are the diagnostics that surface this, which is why aggregate accuracy alone never justifies shipping a classifier."
      },
      {
        "stage": "post",
        "question": "Mixup replaces one-hot labels with interpolated soft targets like lambda * y_i + (1-lambda) * y_j. Why does this help generalisation?",
        "options": [
          "It doubles the effective batch size",
          "The model is forced to produce smooth predictions between classes instead of memorising hard one-hot targets, which improves both calibration and test accuracy",
          "It lets you train with a larger learning rate",
          "It guarantees zero train loss"
        ],
        "correct": 1,
        "explanation": "Training against hard one-hot targets pushes logits to be arbitrarily sharp at each training point, which hurts calibration and invites overfitting. Mixup's convex combination of inputs and labels forces the classifier to behave smoothly between training points, which is a reasonable prior for natural image classes and consistently improves test accuracy without extra data."
      },
      {
        "stage": "post",
        "question": "You swap `RandomCrop(32, padding=4, padding_mode='zeros')` for `padding_mode='reflect'` on CIFAR-10. Why is reflect better here?",
        "options": [
          "Reflect pad is faster",
          "Zero padding creates hard black borders that the model learns to depend on; reflect pad mirrors the edge pixels so augmented crops look like natural photographs",
          "Reflect pad changes the output size",
          "Reflect pad is required by batch normalization"
        ],
        "correct": 1,
        "explanation": "Zero-padded crops have visible black borders that leak information about crop position into the features. The network can learn to look at the corner and implicitly undo the augmentation. Reflect pad mirrors real content, so every crop still looks like a natural image and the network cannot cheat on the augmentation."
      },
      {
        "stage": "post",
        "question": "You train a classifier and the confusion matrix shows most errors are class 3 predicted as class 5 and class 5 predicted as class 3. What is the single most impactful next step?",
        "options": [
          "Add more training data across all classes equally",
          "Increase batch size",
          "Look at a sample of class-3 and class-5 images that confuse the model; the two classes may be genuinely ambiguous, mislabelled, or visually similar in a way that calls for a targeted augmentation or a re-labelled training set",
          "Switch from SGD to Adam"
        ],
        "correct": 2,
        "explanation": "A confusion matrix concentrated on one off-diagonal pair means the failure mode is specific. The right action is to inspect those images: you often find mislabelled data, near-duplicate classes, or a simple invariance the model has not learnt. Blanket changes (more data, new optimizer) rarely help when the failure is this localised."
      }
    ]
  },
  "04-computer-vision/03-cnns-lenet-to-resnet": {
    "questions": [
      {
        "stage": "pre",
        "question": "What single architectural idea did AlexNet (2012) introduce that made training deep CNNs practical on GPUs?",
        "options": [
          "Residual connections",
          "Replacing tanh with ReLU, which does not saturate and speeds convergence by roughly 6x",
          "Batch normalization",
          "Depthwise separable convolutions"
        ],
        "correct": 1,
        "explanation": "AlexNet's biggest training speedup came from ReLU. Tanh saturates for large positive or negative inputs, which kills gradients and caps the depth you can train. ReLU is piecewise linear, does not saturate for positive inputs, and was the single change that took training from weeks to days. Dropout and GPU parallelism mattered, but ReLU is the one that unlocked depth."
      },
      {
        "stage": "pre",
        "question": "Why did VGG prefer stacks of 3x3 convolutions over a single larger kernel?",
        "options": [
          "Smaller kernels run faster on CPU",
          "Two 3x3 convs cover the same 5x5 receptive field with fewer parameters (18C^2 vs 25C^2) and one extra ReLU between them",
          "3x3 convs are rotation-invariant; 5x5 is not",
          "Larger kernels cannot be trained with SGD"
        ],
        "correct": 1,
        "explanation": "Two stacked 3x3 convs see the same 5x5 patch as one 5x5 conv, but use fewer parameters (2 * 3 * 3 * C^2 = 18C^2 compared to 25C^2) and include an additional non-linearity. That extra ReLU increases expressive power. VGG turned this observation into an entire architecture with exactly one block type repeated."
      },
      {
        "stage": "post",
        "question": "ResNet introduced residual connections as y = F(x) + x. What problem does this solve?",
        "options": [
          "Overfitting in the classifier head",
          "Vanishing activations in layers with ReLU",
          "The degradation problem — past ~20 plain conv layers, training loss starts getting worse because the optimizer struggles to learn an identity mapping through many non-linear layers",
          "Memory consumption during backprop"
        ],
        "correct": 2,
        "explanation": "Before ResNet, training loss started increasing past about 20 layers even though the network had more capacity — the degradation problem. A residual block can trivially represent identity by driving F to zero, giving the optimizer a safe default. With that escape hatch, every extra block can make the network slightly better, which is how 100+ layer networks became trainable."
      },
      {
        "stage": "post",
        "question": "In a ResNet BasicBlock with in_channels=64, out_channels=128, stride=2, what is the role of the shortcut branch?",
        "options": [
          "It is always identity; the main branch handles the shape change",
          "It is a 1x1 conv with stride 2 that matches the output channels and spatial size of the main branch so the two can be added",
          "It is a max-pool that halves the spatial dimension",
          "It is a placeholder that is removed at inference time"
        ],
        "correct": 1,
        "explanation": "When a block changes channel count or spatial stride, the identity path cannot be added directly to the main branch because shapes differ. The shortcut becomes a 1x1 conv with stride=2 and C_out output channels, optionally followed by batch norm. Pass-through identity is used only when in_c == out_c and stride == 1."
      },
      {
        "stage": "post",
        "question": "ResNet-18 has ~11.7M parameters and matches or beats VGG-16 (138M params) on ImageNet. What does this imply about VGG?",
        "options": [
          "VGG's kernels were too small to learn good features",
          "Most of VGG's parameters are wasted in the fully connected head and the redundant depth past the point where residual connections would let each layer contribute",
          "VGG was trained with a worse optimizer",
          "VGG's accuracy on ImageNet has been measured incorrectly"
        ],
        "correct": 1,
        "explanation": "VGG-16's parameter count is dominated by its giant fully connected classifier (three dense layers on 25088 activations), and its plain deep stack cannot add layers as efficiently as a residual stack. ResNet-18 replaces the FC head with global average pool plus one linear layer and uses residual blocks, which together give roughly 12x parameter efficiency at similar accuracy."
      }
    ]
  },
  "04-computer-vision/02-convolutions-from-scratch": {
    "questions": [
      {
        "stage": "pre",
        "question": "You feed a 224x224 RGB image to a conv with kernel_size=3, stride=1, padding=0. What is the output spatial size?",
        "options": [
          "224x224",
          "222x222",
          "112x112",
          "74x74"
        ],
        "correct": 1,
        "explanation": "Output size = (H - K + 2P) / S + 1 = (224 - 3 + 0) / 1 + 1 = 222. Without padding, every 3x3 convolution shrinks the feature map by 2 pixels on each axis — one pixel off each border."
      },
      {
        "stage": "pre",
        "question": "A conv layer has in_channels=3, out_channels=64, kernel_size=3, with bias. How many learnable parameters?",
        "options": [
          "1,728",
          "1,792",
          "576",
          "192"
        ],
        "correct": 1,
        "explanation": "C_out * C_in * K * K + C_out = 64 * 3 * 3 * 3 + 64 = 1,728 + 64 = 1,792. The +C_out is one bias per output channel. Compare that to a dense layer on the same input (224*224*3 -> 64 = about 9.6M params) and you see why convolution is the right prior for images."
      },
      {
        "stage": "post",
        "question": "Why do modern CNNs prefer stacks of 3x3 convolutions over a single 5x5 or 7x7 conv?",
        "options": [
          "3x3 convolutions are hardware-accelerated; larger ones are not",
          "Two 3x3 convs cover the same 5x5 receptive field with fewer parameters (2 * 9 vs 25) and add an extra non-linearity between them",
          "Large kernels overflow GPU registers",
          "3x3 is the only kernel size that supports padding"
        ],
        "correct": 1,
        "explanation": "Stacking 3x3 convs gives the same receptive field as one large conv but with fewer parameters and more non-linearities, which increases expressive power. VGG proved this empirically and every modern family (ResNet, ConvNeXt) inherited the design."
      },
      {
        "stage": "post",
        "question": "What does the im2col transformation actually do?",
        "options": [
          "It compresses the image to fit in GPU cache",
          "It extracts every kernel-sized receptive window from the input and stacks them as columns so that convolution becomes a single matrix multiply",
          "It converts float32 pixels to int8 for faster arithmetic",
          "It concatenates all images in a batch into a single 2D matrix"
        ],
        "correct": 1,
        "explanation": "im2col reshapes the input so that each column is one flattened receptive field. Flattening the kernel into a row reduces convolution to cols @ w_flat.T, a single GEMM call that GPUs execute thousands of times faster than a quadruple Python loop. Every production conv library is some variant of this."
      },
      {
        "stage": "post",
        "question": "You stack four 3x3 convolutions (all stride 1, no pooling). What is the receptive field of a neuron in the final layer?",
        "options": [
          "3x3 — each conv is 3x3",
          "5x5 — two convs give 5x5 and depth does not help",
          "9x9 — every conv adds 2 on each side: 1 + 4*(3-1) = 9",
          "15x15 — every conv triples the receptive field"
        ],
        "correct": 2,
        "explanation": "For L stacked K x K convs with stride 1, receptive field = 1 + L * (K - 1). With L=4 and K=3 that is 1 + 4*2 = 9. The same formula generalises with stride: receptive field grows multiplicatively through strided layers, which is why a deep network with downsampling can cover the whole image in ten or fifteen blocks."
      }
    ]
  },
  "04-computer-vision/01-image-fundamentals": {
    "questions": [
      {
        "stage": "pre",
        "question": "A file on disk is decoded into a NumPy array with shape (224, 224, 3) and dtype uint8. What does each number represent?",
        "options": [
          "The probability that a pixel is that colour, between 0 and 1",
          "One photon count per detector, normalized to the full dynamic range of the sensor",
          "A sample of light intensity at one grid position, quantized to one of 256 levels per channel",
          "A floating-point brightness value ready to feed to a convolutional network"
        ],
        "correct": 2,
        "explanation": "A uint8 image stores 8-bit integers in [0, 255]. Each integer is one quantized sample of light intensity at one (row, column, channel) position. It is neither a probability nor a float; you must divide by 255 and standardize before feeding it to a pretrained model."
      },
      {
        "stage": "pre",
        "question": "You load an image with Pillow and get an array of shape (480, 640, 3). You pass it as a batched tensor (1, 480, 640, 3) to a PyTorch Conv2d with in_channels=3. What happens?",
        "options": [
          "Nothing — PyTorch auto-detects the layout",
          "The first conv layer treats height as the channel axis, producing meaningless feature maps",
          "PyTorch raises a RuntimeError: Conv2d expects NCHW, sees 480 channels where the weight expects 3, and refuses to run",
          "Accuracy drops by a few percent but inference still works"
        ],
        "correct": 2,
        "explanation": "PyTorch Conv2d enforces strict channel-count checking against the weight tensor. A batched HWC input (1, 480, 640, 3) is interpreted as NCHW with C=480, which does not match the weight's expected 3 channels, and PyTorch raises RuntimeError before any computation. The loud failure is a feature — it forces you to fix the layout. You must permute to NCHW (`.permute(0, 3, 1, 2)`) before feeding PyTorch."
      },
      {
        "stage": "post",
        "question": "Why do ImageNet pretrained models expect inputs standardized with mean=[0.485, 0.456, 0.406] and std=[0.229, 0.224, 0.225]?",
        "options": [
          "Those are the RGB values of an average natural scene",
          "Those are the per-channel mean and standard deviation of the ImageNet training set in [0, 1] space, so subtracting them centers the distribution the model was trained on",
          "They make the input strictly zero-mean unit-variance for any image",
          "They are required by the ReLU activation function"
        ],
        "correct": 1,
        "explanation": "The numbers are statistics of the ImageNet training corpus computed after dividing pixels by 255. Using them aligns your input distribution with the one the network saw during training. For a model trained on a different dataset you would recompute the stats on that dataset."
      },
      {
        "stage": "post",
        "question": "You resize a segmentation mask (integer class IDs 0..20) from 500x500 to 224x224. Which interpolation method is correct?",
        "options": [
          "Bilinear — it smooths the class boundaries",
          "Bicubic — it preserves sharpness",
          "Lanczos — highest quality",
          "Nearest neighbour — it preserves valid integer class IDs instead of inventing fractional ones"
        ],
        "correct": 3,
        "explanation": "Bilinear, bicubic, and lanczos average neighbouring values. On a class-ID mask that produces non-integer values like 4.7 between class 4 and class 5, which are not real classes. Nearest neighbour picks the closest original pixel and keeps the label space intact. This rule also applies to any channel that encodes IDs or indices."
      },
      {
        "stage": "post",
        "question": "RGB grayscale conversion uses weights 0.299 R + 0.587 G + 0.114 B rather than 0.333 R + 0.333 G + 0.333 B. Why?",
        "options": [
          "To compensate for JPEG compression artifacts in each channel",
          "Because green photons carry more energy than red or blue photons",
          "Because human vision is most sensitive to green and least sensitive to blue, so the weighted sum matches perceived luminance",
          "To match the behaviour of the Bayer filter on camera sensors"
        ],
        "correct": 2,
        "explanation": "The ITU-R BT.601 weights 0.299/0.587/0.114 come from the luminous efficiency of the human eye. An equal-weight average would make green-tinted images look too dark and red ones too bright to a human observer. Most classical computer-vision grayscale code uses these weights; BT.709 (0.2126/0.7152/0.0722) is the modern HDTV variant for linear-light inputs."
      }
    ]
  },
  "03-deep-learning-core/13-debugging-neural-networks": {
    "questions": [
      {
        "question": "Why is neural network debugging harder than traditional software debugging?",
        "options": [
          "Neural networks use different programming languages",
          "Networks can produce wrong outputs without any error messages or crashes -- the code runs but the results are silently incorrect",
          "Neural networks can't be tested",
          "There are no debugging tools for neural networks"
        ],
        "correct": 1,
        "explanation": "Traditional bugs crash or throw exceptions. Neural network bugs produce a number that's just wrong -- a loss that doesn't decrease, accuracy that plateaus, or outputs that are subtly incorrect. No error message tells you what went wrong.",
        "stage": "pre"
      },
      {
        "question": "What is the 'overfit one batch' debugging technique?",
        "options": [
          "Training on the full dataset until it overfits",
          "Training on a single small batch until the loss reaches near-zero, verifying the model can memorize at least a few examples",
          "Using a very large batch size",
          "Overfitting the validation set"
        ],
        "correct": 1,
        "explanation": "If your model can't memorize a tiny batch (e.g., 4-8 samples) to near-zero loss, something is fundamentally broken: wrong architecture, broken loss function, or incorrect training loop. This is the first diagnostic to run.",
        "stage": "pre"
      },
      {
        "question": "Your loss is NaN after a few training steps. What is the most likely cause?",
        "options": [
          "The dataset is too small",
          "Exploding gradients or numerical overflow, often from a learning rate that's too high or missing gradient clipping",
          "The model has too few parameters",
          "The activation function is wrong"
        ],
        "correct": 1,
        "explanation": "NaN loss typically comes from numerical overflow: gradients explode, weights grow unbounded, and operations like log(0) or exp(1000) produce infinity/NaN. Lower the learning rate or add gradient clipping.",
        "stage": "post"
      },
      {
        "question": "Your training loss decreases but validation loss stays flat from the start. What does this indicate?",
        "options": [
          "The model is overfitting",
          "The model is learning training data patterns but they don't generalize -- likely a data pipeline issue (train/val data mismatch) or severe overfitting",
          "The learning rate is too low",
          "The model needs more layers"
        ],
        "correct": 1,
        "explanation": "If validation loss never improves, the model is either memorizing training noise (overfitting), or there's a data pipeline bug where train and validation distributions are fundamentally different.",
        "stage": "post"
      },
      {
        "question": "What should you check first when your loss curve is completely flat (loss doesn't decrease at all)?",
        "options": [
          "Try a different architecture",
          "Verify gradients are nonzero, the learning rate is high enough, and the loss function actually depends on the model's predictions",
          "Add more training data",
          "Switch to a different optimizer"
        ],
        "correct": 1,
        "explanation": "A flat loss means the model isn't updating. Common causes: zero gradients (dead neurons, detached tensors), learning rate too small, or a loss function that doesn't flow gradients to the model (e.g., using .item() before .backward()).",
        "stage": "post"
      }
    ]
  },
  "03-deep-learning-core/12-intro-to-jax": {
    "questions": [
      {
        "question": "What is the fundamental design difference between PyTorch and JAX?",
        "options": [
          "PyTorch is faster",
          "PyTorch mutates tensors eagerly while JAX compiles pure functions without side effects",
          "JAX doesn't support GPUs",
          "PyTorch doesn't support automatic differentiation"
        ],
        "correct": 1,
        "explanation": "PyTorch uses eager execution with mutable state (e.g., tensor.grad is modified in place). JAX embraces functional programming: functions are pure, state is explicit, and jit compilation optimizes entire computation graphs.",
        "stage": "pre"
      },
      {
        "question": "What does jax.jit do?",
        "options": [
          "It adds dropout regularization",
          "It compiles a Python function into optimized XLA code that runs much faster than interpreted Python",
          "It initializes model weights",
          "It computes gradients"
        ],
        "correct": 1,
        "explanation": "jax.jit traces a function and compiles it to XLA (Accelerated Linear Algebra) machine code. The first call is slow (compilation), but subsequent calls run the optimized compiled version.",
        "stage": "pre"
      },
      {
        "question": "What does jax.vmap do?",
        "options": [
          "Vectorizes a function to run over a batch dimension without writing explicit loops",
          "Validates model architecture",
          "Manages GPU memory",
          "Computes second-order gradients"
        ],
        "correct": 0,
        "explanation": "jax.vmap automatically vectorizes a function written for a single example to process an entire batch. You write code for one sample and vmap handles batching, often more efficiently than manual batch loops.",
        "stage": "post"
      },
      {
        "question": "How does JAX handle model state (weights) differently than PyTorch?",
        "options": [
          "JAX stores weights on CPU only",
          "JAX requires explicit state passing -- weights are function arguments, not mutable object attributes",
          "JAX doesn't support trainable weights",
          "JAX and PyTorch handle state identically"
        ],
        "correct": 1,
        "explanation": "In PyTorch, weights live inside nn.Module objects and are mutated in place. In JAX, weights are passed explicitly as function arguments and returned as new values. No mutation, no hidden state.",
        "stage": "post"
      },
      {
        "question": "When would you choose JAX over PyTorch?",
        "options": [
          "For quick prototyping of small models",
          "When training at massive scale on TPU pods, where compilation and functional transforms provide significant speedups",
          "When you need the largest ecosystem of pretrained models",
          "For deployment on mobile devices"
        ],
        "correct": 1,
        "explanation": "JAX excels at scale: jit compilation eliminates Python overhead, pmap handles multi-device parallelism naturally, and XLA optimization across the full computation graph gives significant speedups on TPU clusters.",
        "stage": "post"
      }
    ]
  },
  "03-deep-learning-core/11-intro-to-pytorch": {
    "questions": [
      {
        "question": "What is autograd in PyTorch?",
        "options": [
          "A data loading library",
          "An automatic differentiation engine that records operations and computes gradients without manual backward implementations",
          "A model compression tool",
          "A hyperparameter tuning framework"
        ],
        "correct": 1,
        "explanation": "PyTorch's autograd builds a computational graph during forward computation and automatically computes gradients when you call .backward(). This eliminates the need to manually implement backward() in each module.",
        "stage": "pre"
      },
      {
        "question": "What does torch.no_grad() do and when should you use it?",
        "options": [
          "It prevents overfitting",
          "It disables gradient tracking for inference, saving memory and computation when you don't need to train",
          "It freezes all model weights",
          "It enables GPU acceleration"
        ],
        "correct": 1,
        "explanation": "During inference, you don't need gradients. torch.no_grad() disables gradient tracking, which saves the memory that would be used to store the computational graph and speeds up computation.",
        "stage": "pre"
      },
      {
        "question": "What does nn.Linear(784, 256) create in PyTorch?",
        "options": [
          "A ReLU activation layer",
          "A fully connected layer with a (256, 784) weight matrix and a (256,) bias vector",
          "A dropout layer with p=784/256",
          "A batch normalization layer"
        ],
        "correct": 1,
        "explanation": "nn.Linear(in_features, out_features) creates a layer that computes y = x @ W^T + b, with W of shape (256, 784) and b of shape (256,). This is the PyTorch equivalent of the Layer class you built from scratch.",
        "stage": "post"
      },
      {
        "question": "Which PyTorch method computes gradients for all parameters in the computational graph?",
        "options": [
          "optimizer.step()",
          "model.forward()",
          "loss.backward()",
          "optimizer.zero_grad()"
        ],
        "correct": 2,
        "explanation": "loss.backward() traverses the computational graph in reverse, computing dL/dp for every parameter p that requires gradients. optimizer.step() then uses these gradients to update the parameters.",
        "stage": "post"
      },
      {
        "question": "Why is PyTorch's training loop significantly faster than the pure-Python mini framework?",
        "options": [
          "PyTorch uses a different algorithm",
          "PyTorch runs operations as optimized C++/CUDA kernels on GPU, while pure Python loops are interpreted one operation at a time",
          "PyTorch uses smaller data types",
          "PyTorch skips the backward pass"
        ],
        "correct": 1,
        "explanation": "PyTorch delegates matrix operations to highly optimized C++ and CUDA kernels that run on GPU with massive parallelism. Pure Python executes loops sequentially with interpreter overhead on each operation.",
        "stage": "post"
      }
    ]
  },
  "03-deep-learning-core/10-mini-framework": {
    "questions": [
      {
        "question": "What three responsibilities does the Module abstraction have in a deep learning framework?",
        "options": [
          "Load data, preprocess data, augment data",
          "forward() for computation, backward() for gradients, parameters() for trainable weights",
          "Compile, optimize, deploy",
          "Tokenize, embed, decode"
        ],
        "correct": 1,
        "explanation": "Every Module implements forward() to compute output, backward() to propagate gradients, and parameters() to expose trainable weights. This uniform interface lets any module be composed with any other.",
        "stage": "pre"
      },
      {
        "question": "Why does Sequential process modules in reverse order during the backward pass?",
        "options": [
          "It's arbitrary -- either direction works",
          "Gradients flow from the loss backward through the network, so the last layer computes gradients first",
          "Reverse order uses less memory",
          "It prevents gradient explosion"
        ],
        "correct": 1,
        "explanation": "The backward pass starts at the loss and propagates gradients toward the input. The last layer receives the loss gradient first, computes its local gradients, and passes them to the previous layer.",
        "stage": "pre"
      },
      {
        "question": "Why is optimizer.zero_grad() a separate call instead of being done automatically?",
        "options": [
          "It's a PyTorch design mistake",
          "It allows gradient accumulation across multiple batches before taking a single optimizer step",
          "It saves memory",
          "It makes debugging easier"
        ],
        "correct": 1,
        "explanation": "Separating zero_grad from step enables gradient accumulation: you can run backward() multiple times (across mini-batches) and sum the gradients before calling step(). This simulates larger batch sizes.",
        "stage": "post"
      },
      {
        "question": "What is the correct order of operations in a training loop?",
        "options": [
          "backward, forward, zero_grad, step",
          "forward, loss, zero_grad, backward, step",
          "zero_grad, forward, loss, backward, step",
          "forward, zero_grad, backward, loss, step"
        ],
        "correct": 2,
        "explanation": "The standard pattern: zero_grad (clear old gradients), forward (compute predictions), loss (compute scalar loss), backward (compute gradients), step (update parameters). Getting this order wrong causes subtle bugs.",
        "stage": "post"
      },
      {
        "question": "What is the role of the DataLoader in the framework?",
        "options": [
          "It trains the model",
          "It splits data into batches and optionally shuffles between epochs for mini-batch gradient descent",
          "It computes the loss function",
          "It initializes the weights"
        ],
        "correct": 1,
        "explanation": "The DataLoader handles two practical concerns: batching (you can't fit all data in memory) and shuffling (random order prevents the model from memorizing data sequence).",
        "stage": "post"
      }
    ]
  },
  "03-deep-learning-core/09-learning-rate-schedules": {
    "questions": [
      {
        "question": "Why is a constant learning rate usually suboptimal for training neural networks?",
        "options": [
          "It uses too much memory",
          "It's either too high for late training (causes oscillation) or too low for early training (wastes compute)",
          "Constant learning rates cause overfitting",
          "They only work with SGD"
        ],
        "correct": 1,
        "explanation": "The optimal step size changes during training. Early on, large steps cover ground quickly. Late in training, small steps are needed to settle into a minimum. A constant rate can't serve both needs.",
        "stage": "pre"
      },
      {
        "question": "What is the purpose of learning rate warmup?",
        "options": [
          "To prevent overfitting",
          "To let adaptive optimizer statistics (momentum, variance) stabilize before taking large steps",
          "To increase the batch size gradually",
          "To initialize weights properly"
        ],
        "correct": 1,
        "explanation": "Adam's moment estimates are initialized to zero. Early gradient updates are based on unreliable statistics. Warmup starts with a tiny LR and ramps up, giving Adam time to accumulate meaningful estimates.",
        "stage": "pre"
      },
      {
        "question": "What learning rate schedule do Llama 3, GPT-3, and most modern LLMs use?",
        "options": [
          "Constant learning rate",
          "Step decay every 30 epochs",
          "Linear warmup followed by cosine decay",
          "Exponential decay"
        ],
        "correct": 2,
        "explanation": "Linear warmup + cosine decay is the standard for transformer training. Llama 3 used 2000 warmup steps with cosine decay from 3e-4 to 3e-5. This schedule requires no milestone tuning.",
        "stage": "post"
      },
      {
        "question": "What makes the 1cycle policy different from other schedules?",
        "options": [
          "It uses a constant learning rate",
          "It ramps the learning rate UP in the first half of training, then back down -- the high LR phase acts as regularization",
          "It only works with SGD",
          "It requires no hyperparameter tuning"
        ],
        "correct": 1,
        "explanation": "Leslie Smith's 1cycle ramps LR from low to high (first half) then high to very low (second half). The high-LR phase helps the model explore more of the loss landscape before settling into the best basin.",
        "stage": "post"
      },
      {
        "question": "If training loss suddenly spikes and diverges, what is the most likely learning rate issue?",
        "options": [
          "Learning rate is too low",
          "Learning rate is too high, causing the optimizer to overshoot the minimum",
          "The warmup period is too long",
          "The schedule decays too slowly"
        ],
        "correct": 1,
        "explanation": "A learning rate that's too high causes the optimizer to take steps larger than the loss basin, overshooting the minimum and causing the loss to increase. This manifests as sudden divergence.",
        "stage": "post"
      }
    ]
  },
  "03-deep-learning-core/08-weight-initialization": {
    "questions": [
      {
        "question": "What happens if you initialize all weights in a neural network to zero?",
        "options": [
          "The network trains normally but slowly",
          "All neurons compute identical outputs and receive identical gradients, so the network has only 1 effective neuron per layer",
          "The network diverges",
          "Zero init is the recommended default"
        ],
        "correct": 1,
        "explanation": "With zero weights, every neuron in a layer computes the same function, receives the same gradient, and updates identically. This 'symmetry' means hundreds of parameters behave as one.",
        "stage": "pre"
      },
      {
        "question": "Why does the scale of random weight initialization matter?",
        "options": [
          "Larger weights train faster",
          "If variance is too high, activations explode; if too low, activations vanish -- both prevent training",
          "Scale only matters for the output layer",
          "It doesn't matter as long as weights are nonzero"
        ],
        "correct": 1,
        "explanation": "Each layer multiplies variance by fan_in * Var(w). If this product is > 1, signal explodes exponentially through layers. If < 1, it vanishes. Proper initialization keeps this product at exactly 1.",
        "stage": "pre"
      },
      {
        "question": "What is the formula for Kaiming/He initialization variance?",
        "options": [
          "Var(w) = 1/fan_in",
          "Var(w) = 2/fan_in",
          "Var(w) = 2/(fan_in + fan_out)",
          "Var(w) = 1/(fan_in + fan_out)"
        ],
        "correct": 1,
        "explanation": "Kaiming init uses Var(w) = 2/fan_in. The factor of 2 compensates for ReLU zeroing half the activations (negative values become 0), which effectively halves the fan_in.",
        "stage": "post"
      },
      {
        "question": "When should you use Xavier/Glorot initialization instead of Kaiming/He?",
        "options": [
          "Always -- Xavier is universally better",
          "When using sigmoid or tanh activations, which don't zero half the outputs like ReLU",
          "When training on small datasets",
          "When using Adam optimizer"
        ],
        "correct": 1,
        "explanation": "Xavier init uses Var(w) = 2/(fan_in + fan_out), designed for activations that are roughly linear near zero (sigmoid, tanh). Kaiming's extra factor of 2 compensates for ReLU's half-zeroing, which Xavier doesn't need.",
        "stage": "post"
      },
      {
        "question": "Why does GPT-2 scale residual layer weights by 1/sqrt(2N)?",
        "options": [
          "To speed up training",
          "Each residual addition increases variance, so scaling prevents the accumulated signal from growing unbounded through N layers",
          "To reduce the number of parameters",
          "To improve tokenization"
        ],
        "correct": 1,
        "explanation": "Residual connections add sublayer output to the input: x = x + sublayer(x). Each addition increases variance. With N residual layers, variance grows proportionally to N. Scaling by 1/sqrt(2N) keeps the signal stable.",
        "stage": "post"
      }
    ]
  },
  "03-deep-learning-core/07-regularization": {
    "questions": [
      {
        "question": "What is overfitting in neural networks?",
        "options": [
          "The model is too small to learn the data",
          "The model memorizes training data instead of learning generalizable patterns, showing a large gap between train and test accuracy",
          "The model trains too slowly",
          "The loss function is wrong"
        ],
        "correct": 1,
        "explanation": "Overfitting occurs when a model achieves high training accuracy but poor test accuracy. It has memorized the training data's noise rather than learning the underlying patterns.",
        "stage": "pre"
      },
      {
        "question": "How does dropout regularize a neural network?",
        "options": [
          "It removes the worst-performing neurons permanently",
          "It randomly zeroes neurons during training, forcing the network to learn redundant representations",
          "It reduces the learning rate",
          "It removes outliers from the training data"
        ],
        "correct": 1,
        "explanation": "During each forward pass, dropout randomly sets neuron outputs to zero with probability p. This prevents co-adaptation (neurons relying on specific others) and is equivalent to training an ensemble of 2^N subnetworks.",
        "stage": "pre"
      },
      {
        "question": "Why do transformers use LayerNorm instead of BatchNorm?",
        "options": [
          "LayerNorm is faster to compute",
          "LayerNorm normalizes across features per sample (batch-independent), which works with variable sequence lengths and small batch sizes",
          "BatchNorm causes gradient explosion",
          "LayerNorm was invented more recently"
        ],
        "correct": 1,
        "explanation": "BatchNorm depends on batch statistics, which are noisy with small batches and meaningless with batch size 1 (common during generation). LayerNorm normalizes across features within each sample, independent of batch size.",
        "stage": "post"
      },
      {
        "question": "What is the key difference between RMSNorm and LayerNorm?",
        "options": [
          "RMSNorm uses batch statistics",
          "RMSNorm skips the mean subtraction, only dividing by the root mean square, giving ~10% speedup with equal accuracy",
          "RMSNorm adds learnable parameters",
          "RMSNorm only works on CNNs"
        ],
        "correct": 1,
        "explanation": "RMSNorm removes the mean subtraction step from LayerNorm, which contributes little to accuracy but adds computation. LLaMA, Mistral, and most modern LLMs use RMSNorm for this efficiency gain.",
        "stage": "post"
      },
      {
        "question": "Why is it critical to call model.eval() before running inference in PyTorch?",
        "options": [
          "It speeds up computation",
          "It disables dropout and switches BatchNorm to use running statistics instead of batch statistics, giving deterministic outputs",
          "It frees GPU memory",
          "It enables gradient computation"
        ],
        "correct": 1,
        "explanation": "Without model.eval(), dropout randomly zeroes neurons during inference (causing random output variation) and BatchNorm uses current-batch statistics instead of the stable running averages accumulated during training.",
        "stage": "post"
      }
    ]
  },
  "03-deep-learning-core/06-optimizers": {
    "questions": [
      {
        "question": "What problem does momentum solve in gradient descent?",
        "options": [
          "It reduces memory usage",
          "It dampens oscillation by accumulating past gradients, accelerating movement in consistent directions",
          "It eliminates the need for a learning rate",
          "It prevents overfitting"
        ],
        "correct": 1,
        "explanation": "In narrow valleys, gradients oscillate across the valley while making slow progress along it. Momentum accumulates past gradients: consistent directions amplify while oscillating directions cancel, giving smoother, faster convergence.",
        "stage": "pre"
      },
      {
        "question": "What is the key difference between Adam and AdamW?",
        "options": [
          "AdamW uses a higher learning rate",
          "AdamW applies weight decay directly to weights instead of through the gradient, giving proper regularization",
          "AdamW doesn't use momentum",
          "AdamW only works with transformers"
        ],
        "correct": 1,
        "explanation": "In Adam + L2, the adaptive learning rate scales the regularization term differently per parameter. AdamW decouples weight decay from the gradient update, applying uniform shrinkage regardless of gradient statistics.",
        "stage": "pre"
      },
      {
        "question": "Why does Adam use bias correction in early training steps?",
        "options": [
          "To prevent overfitting",
          "The moment estimates are initialized to zero, so early values are biased toward zero; correction compensates for this cold start",
          "To clip large gradients",
          "To speed up convergence"
        ],
        "correct": 1,
        "explanation": "At step 1 with beta1=0.9, m_1 = 0.1 * gradient (10x too small). Dividing by (1 - 0.9^1) = 0.1 corrects this to the actual gradient. The correction becomes negligible after ~50 steps.",
        "stage": "post"
      },
      {
        "question": "What are the standard default hyperparameters for Adam?",
        "options": [
          "lr=0.1, beta1=0.5, beta2=0.5",
          "lr=0.001, beta1=0.9, beta2=0.999, epsilon=1e-8",
          "lr=0.01, beta1=0.99, beta2=0.99",
          "lr=0.0001, beta1=0.8, beta2=0.9"
        ],
        "correct": 1,
        "explanation": "The original Adam paper (Kingma & Ba, 2014) recommended lr=0.001, beta1=0.9, beta2=0.999, epsilon=1e-8. These defaults work well for most problems.",
        "stage": "post"
      },
      {
        "question": "Which optimizer is the modern default for training transformers and LLMs?",
        "options": [
          "Vanilla SGD",
          "SGD with momentum",
          "RMSProp",
          "AdamW"
        ],
        "correct": 3,
        "explanation": "AdamW (Adam with decoupled weight decay) is used to train BERT, GPT, LLaMA, and virtually all modern transformers. It combines adaptive learning rates with proper weight decay regularization.",
        "stage": "post"
      }
    ]
  },
  "03-deep-learning-core/05-loss-functions": {
    "questions": [
      {
        "question": "What does the loss function represent in neural network training?",
        "options": [
          "The number of incorrect predictions",
          "A differentiable measure of how wrong the model's predictions are, which the optimizer minimizes",
          "The size of the training dataset",
          "The learning rate schedule"
        ],
        "correct": 1,
        "explanation": "The loss function maps predictions and targets to a single scalar that the optimizer minimizes via gradient descent. It must be differentiable so gradients can be computed.",
        "stage": "pre"
      },
      {
        "question": "Why is cross-entropy preferred over MSE for classification tasks?",
        "options": [
          "Cross-entropy is faster to compute",
          "Cross-entropy punishes confident wrong predictions exponentially via -log(p), while MSE gives weak gradients near 0 and 1",
          "MSE only works for regression",
          "Cross-entropy doesn't require labels"
        ],
        "correct": 1,
        "explanation": "When a model confidently predicts the wrong class (p near 0 for true class), -log(p) produces a huge loss and strong gradient. MSE produces weak gradients in the same situation because sigmoid is flat near 0 and 1.",
        "stage": "pre"
      },
      {
        "question": "What happens if you use MSE loss for binary classification?",
        "options": [
          "Training diverges immediately",
          "The model can minimize loss by predicting 0.5 for everything, achieving MSE=0.25 without learning",
          "The model trains normally",
          "Gradients explode"
        ],
        "correct": 1,
        "explanation": "With MSE on a balanced binary dataset, predicting 0.5 for every input gives MSE=0.25 -- the minimum achievable without discrimination. The model satisfies the loss without learning any useful patterns.",
        "stage": "post"
      },
      {
        "question": "What does label smoothing do and why is it useful?",
        "options": [
          "It removes noisy labels from the dataset",
          "It replaces hard 0/1 targets with soft values like 0.1/0.9, preventing overconfident predictions and improving generalization",
          "It applies a moving average to the loss",
          "It smooths the learning rate schedule"
        ],
        "correct": 1,
        "explanation": "Label smoothing changes targets from [0,0,1,0] to [0.025,0.025,0.925,0.025] (with alpha=0.1). This prevents the model from pushing logits to infinity to achieve hard targets, reducing overconfidence.",
        "stage": "post"
      },
      {
        "question": "In contrastive loss (InfoNCE), what role does the temperature parameter play?",
        "options": [
          "It controls the learning rate",
          "It controls how sharp the similarity distribution is -- lower temperature means harder separation between positives and negatives",
          "It sets the number of negative samples",
          "It determines the embedding dimension"
        ],
        "correct": 1,
        "explanation": "Temperature divides the similarity scores before softmax. Lower temperature (e.g., 0.07) creates a sharper distribution where the model must clearly separate positives from negatives. Higher temperature is more forgiving.",
        "stage": "post"
      }
    ]
  },
  "03-deep-learning-core/04-activation-functions": {
    "questions": [
      {
        "question": "Why can't you build a useful deep network using only linear layers (no activation functions)?",
        "options": [
          "Linear layers are too slow",
          "Stacking linear layers collapses to a single linear transformation, giving no benefit from depth",
          "Linear layers don't have biases",
          "Linear layers can't handle batched data"
        ],
        "correct": 1,
        "explanation": "y = W2(W1*x + b1) + b2 simplifies to y = Ax + c. No matter how many linear layers you stack, the result is equivalent to one linear layer. Activation functions break this composability.",
        "stage": "pre"
      },
      {
        "question": "What is the output range of the ReLU activation function?",
        "options": [
          "(-1, 1)",
          "(0, 1)",
          "[0, infinity)",
          "(-infinity, infinity)"
        ],
        "correct": 2,
        "explanation": "ReLU(x) = max(0, x). It outputs 0 for all negative inputs and passes positive inputs unchanged, giving a range of [0, infinity).",
        "stage": "pre"
      },
      {
        "question": "What is the 'dead neuron' problem in ReLU networks?",
        "options": [
          "Neurons that compute too slowly",
          "Neurons whose input is permanently negative, producing zero output and zero gradient forever",
          "Neurons that produce NaN values",
          "Neurons with zero bias"
        ],
        "correct": 1,
        "explanation": "If a ReLU neuron's weighted input is always negative (due to bad initialization or large negative bias), it outputs 0 with gradient 0. It can never recover because zero gradient means zero update.",
        "stage": "post"
      },
      {
        "question": "Which activation function is the default for hidden layers in modern transformers like GPT and BERT?",
        "options": [
          "Sigmoid",
          "ReLU",
          "GELU",
          "Tanh"
        ],
        "correct": 2,
        "explanation": "GELU (Gaussian Error Linear Unit) is the default activation in transformers. It provides smooth gradient flow, avoids dead neurons, and has been shown to outperform ReLU in language models.",
        "stage": "post"
      },
      {
        "question": "Why is softmax used only in the output layer and never in hidden layers?",
        "options": [
          "It's too slow for hidden layers",
          "It converts a vector into a probability distribution (values sum to 1), which is needed for classification output but not for intermediate representations",
          "It causes exploding gradients",
          "It only works with two classes"
        ],
        "correct": 1,
        "explanation": "Softmax normalizes a vector so all values are in (0,1) and sum to 1, creating a probability distribution. Hidden layers need to preserve and transform information, not compress it into probabilities.",
        "stage": "post"
      }
    ]
  },
  "03-deep-learning-core/03-backpropagation": {
    "questions": [
      {
        "question": "What is the chain rule in the context of neural networks?",
        "options": [
          "A rule for chaining layers together",
          "If y = f(g(x)), then dy/dx = f'(g(x)) * g'(x) -- multiply derivatives along the path",
          "A method for initializing weights",
          "A technique for batching data"
        ],
        "correct": 1,
        "explanation": "The chain rule lets you compute the derivative of a composite function by multiplying the local derivatives at each step. Backpropagation applies this systematically through the computational graph.",
        "stage": "pre"
      },
      {
        "question": "Why is backpropagation more efficient than computing each gradient independently?",
        "options": [
          "It uses less memory",
          "It computes all gradients in a single backward pass instead of one forward pass per parameter",
          "It only works on small networks",
          "It avoids using the chain rule"
        ],
        "correct": 1,
        "explanation": "Computing gradients independently requires one forward pass per parameter (millions of passes for a large network). Backpropagation computes all gradients in one backward pass by reusing intermediate values stored during the forward pass.",
        "stage": "pre"
      },
      {
        "question": "In the backward pass, why do we use '+=' instead of '=' when accumulating gradients?",
        "options": [
          "It's a Python convention",
          "A value might be used in multiple operations, so its gradient is the sum of gradients from all paths",
          "It prevents overflow",
          "It makes the code run faster"
        ],
        "correct": 1,
        "explanation": "When a Value is used as input to multiple operations (e.g., x used in both x*w1 and x*w2), its total gradient is the sum of the gradients flowing back from each operation. Using += accumulates these correctly.",
        "stage": "post"
      },
      {
        "question": "What causes the vanishing gradient problem in deep sigmoid networks?",
        "options": [
          "The learning rate is too small",
          "Sigmoid's derivative has a maximum of 0.25, so gradients shrink exponentially through layers",
          "The network has too many parameters",
          "The loss function is poorly chosen"
        ],
        "correct": 1,
        "explanation": "The sigmoid derivative peaks at 0.25 (when z=0). Each layer multiplies the gradient by at most 0.25, so after 10 layers the gradient is at most 0.25^10 = ~0.000001 of the original signal.",
        "stage": "post"
      },
      {
        "question": "Why does topological sort matter in the backward pass?",
        "options": [
          "It makes the code cleaner",
          "It ensures each node's gradient is fully accumulated before propagating to its children",
          "It speeds up the forward pass",
          "It reduces memory usage"
        ],
        "correct": 1,
        "explanation": "Topological sort ensures we process nodes in the correct order: a node's gradient must be fully accumulated from all downstream paths before we propagate through it. Without this ordering, gradients would be incomplete.",
        "stage": "post"
      }
    ]
  },
  "03-deep-learning-core/02-multi-layer-networks": {
    "questions": [
      {
        "question": "What is the purpose of a hidden layer in a multi-layer network?",
        "options": [
          "To store the training data",
          "To transform inputs into new feature representations that enable nonlinear decision boundaries",
          "To reduce the number of parameters",
          "To apply the loss function"
        ],
        "correct": 1,
        "explanation": "Hidden layers apply weights, biases, and activation functions to create new feature representations. These intermediate features allow the network to learn nonlinear mappings that a single layer cannot.",
        "stage": "pre"
      },
      {
        "question": "What does the forward pass do in a neural network?",
        "options": [
          "Updates the weights using gradients",
          "Computes gradients for backpropagation",
          "Pushes input through each layer to produce an output",
          "Shuffles the training data"
        ],
        "correct": 2,
        "explanation": "The forward pass is pure computation: for each layer, multiply by weights, add bias, apply activation, and pass the result to the next layer. No learning happens during the forward pass.",
        "stage": "pre"
      },
      {
        "question": "For a layer with 3 neurons receiving input from 2 neurons, what is the shape of the weight matrix?",
        "options": [
          "(2, 3)",
          "(3, 2)",
          "(3, 3)",
          "(2, 2)"
        ],
        "correct": 1,
        "explanation": "The weight matrix has shape (neurons_in_current_layer, neurons_in_previous_layer) = (3, 2). Each row contains one neuron's weights across all inputs.",
        "stage": "post"
      },
      {
        "question": "What does the Universal Approximation Theorem guarantee?",
        "options": [
          "Any network can be trained in polynomial time",
          "A single hidden layer with enough neurons can approximate any continuous function",
          "Deeper networks always outperform shallow ones",
          "Neural networks can solve any computational problem"
        ],
        "correct": 1,
        "explanation": "Cybenko (1989) proved that a network with one hidden layer and sufficient neurons can approximate any continuous function to any desired accuracy. In practice, deeper networks achieve the same with fewer total parameters.",
        "stage": "post"
      },
      {
        "question": "Why does the sigmoid activation function make learning possible, unlike the step function used in perceptrons?",
        "options": [
          "Sigmoid outputs larger values",
          "Sigmoid is faster to compute",
          "Sigmoid is smooth and differentiable everywhere, so gradients exist for backpropagation",
          "Sigmoid outputs negative values"
        ],
        "correct": 2,
        "explanation": "The step function has zero gradient almost everywhere and undefined gradient at the threshold. Sigmoid is smooth with a well-defined derivative (s*(1-s)) at every point, which is essential for gradient-based learning.",
        "stage": "post"
      }
    ]
  },
  "03-deep-learning-core/01-the-perceptron": {
    "questions": [
      {
        "question": "What mathematical operation does a perceptron perform on its inputs before applying the activation function?",
        "options": [
          "Matrix inversion",
          "Weighted sum plus bias",
          "Fourier transform",
          "Eigenvalue decomposition"
        ],
        "correct": 1,
        "explanation": "A perceptron computes the dot product of inputs and weights, adds a bias term, then passes the result through a step function. This weighted sum plus bias is the core computation.",
        "stage": "pre"
      },
      {
        "question": "What does 'linearly separable' mean for a classification problem?",
        "options": [
          "The data can be sorted in order",
          "A single straight line (or hyperplane) can perfectly separate the classes",
          "The features have a linear relationship with the label",
          "The data has only two dimensions"
        ],
        "correct": 1,
        "explanation": "A dataset is linearly separable when you can draw a single hyperplane that perfectly divides the input space into the correct classes. AND and OR are linearly separable; XOR is not.",
        "stage": "pre"
      },
      {
        "question": "Why does a single perceptron fail to learn the XOR function?",
        "options": [
          "The learning rate is too low",
          "XOR has too many inputs",
          "XOR is not linearly separable -- no single line can separate the classes",
          "The step function prevents gradient flow"
        ],
        "correct": 2,
        "explanation": "XOR places [0,1] and [1,0] on one side and [0,0] and [1,1] on the other. No single straight line can separate these groups, so a single perceptron, which can only draw one linear boundary, cannot solve XOR.",
        "stage": "post"
      },
      {
        "question": "In the perceptron learning rule, what happens when the prediction matches the target?",
        "options": [
          "Weights are doubled",
          "Weights are set to zero",
          "Nothing changes -- error is zero so the update is zero",
          "The learning rate is halved"
        ],
        "correct": 2,
        "explanation": "The update rule is w_i = w_i + lr * error * x_i. When prediction equals target, error = 0, so all weight updates are zero. The perceptron only adjusts when it makes a mistake.",
        "stage": "post"
      },
      {
        "question": "How is XOR solved using multiple perceptrons?",
        "options": [
          "By using a larger learning rate on a single perceptron",
          "By combining OR, NAND, and AND perceptrons in two layers",
          "By adding more inputs to a single perceptron",
          "By removing the bias term"
        ],
        "correct": 1,
        "explanation": "XOR = (x1 OR x2) AND NOT(x1 AND x2). A hidden layer with an OR neuron and a NAND neuron feeds into an output AND neuron, creating a nonlinear decision boundary from linear components.",
        "stage": "post"
      }
    ]
  },
  "02-ml-fundamentals/18-feature-selection": {
    "questions": [
      {
        "stage": "pre",
        "question": "Why can adding more features actually make a model perform worse?",
        "options": [
          "More features always improve model accuracy",
          "Irrelevant features add noise, increase overfitting risk, and dilute the signal from useful features",
          "Models have a hard limit on the number of features they can accept",
          "More features make the model run out of memory"
        ],
        "correct": 1,
        "explanation": "Irrelevant features give the model opportunities to overfit on noise in the training data. They increase dimensionality, making the data sparser and distances less meaningful (curse of dimensionality)."
      },
      {
        "stage": "pre",
        "question": "What is the key difference between filter and wrapper feature selection methods?",
        "options": [
          "Filter methods use a model to evaluate features; wrapper methods use statistics",
          "Filter methods score features using statistics without a model; wrapper methods train a model to evaluate feature subsets",
          "Filter methods are always more accurate than wrapper methods",
          "Wrapper methods can only select one feature at a time"
        ],
        "correct": 1,
        "explanation": "Filter methods (variance threshold, mutual information, correlation) score features with statistical measures. Wrapper methods (RFE, forward selection) train models repeatedly to evaluate different feature subsets."
      },
      {
        "stage": "post",
        "question": "Mutual information can detect relationships that Pearson correlation cannot. What kind?",
        "options": [
          "Linear relationships between continuous features",
          "Nonlinear relationships such as quadratic or periodic dependencies",
          "Relationships between categorical features only",
          "Relationships that require more than 1000 data points"
        ],
        "correct": 1,
        "explanation": "Pearson correlation only measures linear association. A quadratic relationship (y = x^2) has zero correlation but high mutual information. MI captures any statistical dependency between variables."
      },
      {
        "stage": "post",
        "question": "L1 (Lasso) regularization performs feature selection as part of training. How?",
        "options": [
          "It removes features with low variance before training starts",
          "It drives the weights of irrelevant features to exactly zero, effectively eliminating them from the model",
          "It ranks features by correlation with the target",
          "It trains separate models for each feature"
        ],
        "correct": 1,
        "explanation": "L1 regularization adds |w| penalty to the loss. The geometry of the L1 constraint (diamond shape) causes some weight solutions to land exactly at zero, producing sparse models that automatically select features."
      },
      {
        "stage": "post",
        "question": "RFE removes the least important feature and retrains. Why is this better than just removing all low-importance features at once?",
        "options": [
          "It is not better -- removing all at once is always preferred",
          "Feature importances change as features are removed, so iterative removal accounts for interactions between features",
          "RFE uses a different importance metric than single-step removal",
          "Removing one at a time is only necessary for neural networks"
        ],
        "correct": 1,
        "explanation": "Feature importances are relative. When a correlated feature is removed, the importance of its counterpart may increase. Iterative removal lets the model reassess importances at each step, capturing these interactions."
      }
    ]
  },
  "02-ml-fundamentals/17-imbalanced-data": {
    "questions": [
      {
        "stage": "pre",
        "question": "A fraud detection dataset has 99.9% legitimate transactions and 0.1% fraud. A model predicts 'legitimate' for every transaction. What is its accuracy?",
        "options": [
          "50%",
          "0.1%",
          "99.9%",
          "100%"
        ],
        "correct": 2,
        "explanation": "Accuracy = 999/1000 = 99.9%. The model catches zero fraud but looks great by accuracy. This is exactly why accuracy is dangerous for imbalanced datasets."
      },
      {
        "stage": "pre",
        "question": "Which metric would correctly identify the always-predict-negative model as useless?",
        "options": [
          "Accuracy (99.9%)",
          "Recall (0%) or F1 score (0%)",
          "Specificity (100%)",
          "True negative rate (100%)"
        ],
        "correct": 1,
        "explanation": "Recall = TP/(TP+FN) = 0/total_positives = 0%. F1 = 2*0*0/(0+0) = 0. Both correctly show the model catches nothing in the positive class. Accuracy hides this failure."
      },
      {
        "stage": "post",
        "question": "How does SMOTE generate synthetic minority samples?",
        "options": [
          "By duplicating existing minority samples exactly",
          "By randomly generating points anywhere in the feature space",
          "By interpolating between a minority sample and one of its K nearest minority neighbors",
          "By flipping the labels of majority class samples"
        ],
        "correct": 2,
        "explanation": "SMOTE picks a minority point, selects one of its K nearest minority neighbors, and creates a new point on the line segment between them: new = x + rand(0,1) * (neighbor - x). This produces plausible, non-duplicate samples."
      },
      {
        "stage": "post",
        "question": "You lower the classification threshold from 0.5 to 0.3 on an imbalanced dataset. What happens to precision and recall?",
        "options": [
          "Both precision and recall increase",
          "Recall increases (more positives caught) but precision decreases (more false positives)",
          "Precision increases but recall decreases",
          "Neither changes -- threshold only affects speed"
        ],
        "correct": 1,
        "explanation": "Lowering the threshold means more samples are predicted positive. This catches more true positives (recall up) but also adds more false positives (precision down). Threshold tuning trades precision for recall."
      },
      {
        "stage": "post",
        "question": "Why is AUPRC (Area Under Precision-Recall Curve) more informative than AUC-ROC for highly imbalanced datasets?",
        "options": [
          "AUPRC is always higher than AUC-ROC",
          "A random classifier has AUPRC equal to the positive class rate (e.g., 0.001), making improvements visible, while AUC-ROC starts at 0.5 regardless of imbalance",
          "AUPRC does not require a threshold",
          "AUC-ROC cannot be computed for imbalanced data"
        ],
        "correct": 1,
        "explanation": "For imbalanced data, AUC-ROC can look deceptively good because the large number of true negatives inflates the true negative rate. AUPRC's baseline equals the positive rate, making real improvements in detecting the minority class much more apparent."
      }
    ]
  },
  "02-ml-fundamentals/16-anomaly-detection": {
    "questions": [
      {
        "stage": "pre",
        "question": "Why is anomaly detection typically framed as an unsupervised problem rather than classification?",
        "options": [
          "Anomaly detection does not require any data",
          "Labeled anomalies are extremely rare, and novel anomaly types differ from previously seen ones",
          "Supervised classification is always less accurate",
          "Anomaly detection only works on time series data"
        ],
        "correct": 1,
        "explanation": "Anomalies are rare (often <0.1% of data), so there are too few labeled examples to train a classifier. Also, future anomalies may be of types never seen before. Modeling 'normal' and flagging deviations handles both problems."
      },
      {
        "stage": "pre",
        "question": "A temperature of 90F is normal in summer but anomalous in winter. What type of anomaly is this?",
        "options": [
          "Point anomaly",
          "Contextual anomaly",
          "Collective anomaly",
          "Statistical anomaly"
        ],
        "correct": 1,
        "explanation": "A contextual anomaly is a value that is unusual given its context (time, location). The value itself might be normal in a different context. Same data point, different interpretation based on surrounding conditions."
      },
      {
        "stage": "post",
        "question": "The Z-score method flags points more than 3 standard deviations from the mean. When does this approach fail?",
        "options": [
          "When the data is perfectly normally distributed",
          "When the data is multimodal, skewed, or when outliers in the training data inflate the mean and std",
          "When there are exactly 3 anomalies in the dataset",
          "When the features are standardized"
        ],
        "correct": 1,
        "explanation": "Z-score assumes a single Gaussian distribution. It fails on multimodal data (multiple clusters), skewed distributions, and when outliers in training data shift the mean/std, making real anomalies harder to detect."
      },
      {
        "stage": "post",
        "question": "How does Isolation Forest detect anomalies differently from distance-based methods?",
        "options": [
          "It uses neural networks instead of trees",
          "It isolates points using random splits; anomalies require fewer splits to isolate because they are few and different",
          "It computes distances to every other point in the dataset",
          "It only works on text data"
        ],
        "correct": 1,
        "explanation": "Isolation Forest randomly partitions data with tree splits. Anomalies, being rare and different, end up isolated (in their own leaf) with fewer splits. Short average path length = more anomalous."
      },
      {
        "stage": "post",
        "question": "You build both an unsupervised anomaly detector and a supervised fraud classifier. When should you prefer the unsupervised approach?",
        "options": [
          "Always -- unsupervised is always better for anomaly detection",
          "When you need to detect novel fraud patterns that differ from historical labeled examples",
          "When you have millions of labeled fraud examples",
          "When you only care about precision, not recall"
        ],
        "correct": 1,
        "explanation": "Supervised classifiers only catch fraud types present in training data. Unsupervised detectors flag any deviation from normal, catching novel fraud schemes. The tradeoff is higher false positive rate."
      }
    ]
  },
  "02-ml-fundamentals/15-time-series": {
    "questions": [
      {
        "stage": "pre",
        "question": "Why is a random train/test split invalid for time series data?",
        "options": [
          "Random splits make the dataset too small",
          "Random splits leak future information into the training set, allowing the model to cheat",
          "Time series data cannot be split at all",
          "Random splits only work for classification problems"
        ],
        "correct": 1,
        "explanation": "In a random split, future data points can end up in the training set while past points are in the test set. The model then uses future information to predict the past, giving falsely optimistic results."
      },
      {
        "stage": "pre",
        "question": "What does it mean for a time series to be stationary?",
        "options": [
          "The values never change over time",
          "Its statistical properties (mean, variance, autocorrelation) do not change over time",
          "It has no seasonal patterns",
          "It always trends upward"
        ],
        "correct": 1,
        "explanation": "A stationary series has constant mean, variance, and autocorrelation structure over time. Most forecasting methods assume stationarity. Non-stationary series need differencing or detrending first."
      },
      {
        "stage": "post",
        "question": "What is the purpose of differencing a time series?",
        "options": [
          "To increase the number of data points",
          "To remove trend and make the series stationary by modeling changes between consecutive values",
          "To convert regression into classification",
          "To normalize the values between 0 and 1"
        ],
        "correct": 1,
        "explanation": "Differencing replaces each value with the change from the previous value: diff[t] = value[t] - value[t-1]. This removes trend, making the series closer to stationary."
      },
      {
        "stage": "post",
        "question": "Lag features convert a time series into a supervised learning problem. What is a lag-3 feature for predicting y[t]?",
        "options": [
          "The average of the next 3 values: (y[t+1] + y[t+2] + y[t+3]) / 3",
          "The value 3 time steps ago: y[t-3]",
          "The 3rd derivative of the series",
          "The difference between the current value and 3 steps ahead"
        ],
        "correct": 1,
        "explanation": "A lag-3 feature is y[t-3]: the value 3 time steps in the past. Using past values as input features lets standard ML models (regression, trees) make time series predictions without specialized algorithms."
      },
      {
        "stage": "post",
        "question": "Walk-forward validation splits time data into expanding or sliding windows. Why is this better than K-fold CV for time series?",
        "options": [
          "Walk-forward is faster to compute",
          "Walk-forward respects temporal order, training only on past data and testing on future data, preventing lookahead bias",
          "K-fold CV cannot be used on numeric data",
          "Walk-forward uses more data for training"
        ],
        "correct": 1,
        "explanation": "Walk-forward validation always trains on past data and tests on future data, mimicking real-world deployment. K-fold CV shuffles data, potentially training on future to predict past (temporal leakage)."
      }
    ]
  },
  "02-ml-fundamentals/14-naive-bayes": {
    "questions": [
      {
        "stage": "pre",
        "question": "What is the 'naive' assumption in Naive Bayes?",
        "options": [
          "The prior probability of each class is equal",
          "All features are conditionally independent given the class label",
          "The data is normally distributed",
          "The model has no parameters to learn"
        ],
        "correct": 1,
        "explanation": "Naive Bayes assumes every feature is independent of every other feature, conditioned on the class. This is mathematically wrong (e.g., 'machine' and 'learning' co-occur) but works well in practice."
      },
      {
        "stage": "pre",
        "question": "What does Laplace smoothing prevent in Naive Bayes?",
        "options": [
          "Overfitting to large datasets",
          "Zero probabilities for words never seen in a class during training",
          "Slow training on high-dimensional data",
          "Class imbalance in the dataset"
        ],
        "correct": 1,
        "explanation": "Without smoothing, a word that never appeared in 'spam' training emails would get P(word|spam) = 0, making the entire product zero regardless of other strong evidence. Laplace smoothing adds 1 to each count."
      },
      {
        "stage": "post",
        "question": "The naive independence assumption is clearly wrong for text. Why does Naive Bayes still classify well?",
        "options": [
          "It only works on very small vocabularies where independence holds",
          "Classification only needs correct class rankings, not correct probability estimates, and the assumption introduces stable errors that affect all classes similarly",
          "Modern implementations secretly remove the independence assumption",
          "It only works when features are truly independent"
        ],
        "correct": 1,
        "explanation": "NB needs to rank classes correctly, not estimate exact probabilities. The independence assumption is high bias but low variance, making it stable with limited data. Correlated features double-count evidence for the correct class too."
      },
      {
        "stage": "post",
        "question": "When should you use Multinomial NB versus Gaussian NB?",
        "options": [
          "Multinomial for regression, Gaussian for classification",
          "Multinomial for word count/frequency features, Gaussian for continuous real-valued features",
          "Multinomial for binary data, Gaussian for multi-class problems",
          "They are interchangeable -- always use whichever is faster"
        ],
        "correct": 1,
        "explanation": "Multinomial NB models feature counts (word frequencies in text). Gaussian NB assumes features follow normal distributions, suitable for continuous features like measurements or sensor readings."
      },
      {
        "stage": "post",
        "question": "An email contains 'free' twice and 'money' once. In Multinomial NB with log probabilities, how is the spam score computed?",
        "options": [
          "log P(spam) + log P(free|spam) + log P(money|spam)",
          "log P(spam) + 2 * log P(free|spam) + 1 * log P(money|spam)",
          "P(spam) * P(free|spam) * P(money|spam)",
          "log P(spam) * 2 * log P(free|spam)"
        ],
        "correct": 1,
        "explanation": "Multinomial NB multiplies the word likelihoods raised to their count. In log space: log P(spam) + 2*log P(free|spam) + 1*log P(money|spam). The word count acts as an exponent."
      }
    ]
  },
  "02-ml-fundamentals/13-ml-pipelines": {
    "questions": [
      {
        "stage": "pre",
        "question": "What is data leakage in the context of ML pipelines?",
        "options": [
          "Data being accidentally deleted during preprocessing",
          "Information from the test set or future data contaminating the training process",
          "The model being too slow to process the data",
          "Features being dropped during encoding"
        ],
        "correct": 1,
        "explanation": "Data leakage occurs when information that would not be available at prediction time is used during training. Example: computing the scaler's mean/std on the full dataset including test data."
      },
      {
        "stage": "pre",
        "question": "Why is fitting a scaler on the full dataset before splitting into train/test considered leaky?",
        "options": [
          "Scaling changes the data distribution",
          "The scaler's statistics (mean, std) include test data, so the model indirectly sees test information during training",
          "Scaling should only be done on the test set",
          "Fitting the scaler takes too long on large datasets"
        ],
        "correct": 1,
        "explanation": "When the scaler is fit on all data, its mean and standard deviation encode information from test samples. Training features are then shifted using test statistics, leaking future information into training."
      },
      {
        "stage": "post",
        "question": "In sklearn, what is the difference between calling fit_transform and transform on a pipeline step?",
        "options": [
          "They are identical -- both fit and transform",
          "fit_transform learns parameters from the data and applies the transform; transform only applies previously learned parameters",
          "transform is for training data; fit_transform is for test data",
          "fit_transform is slower but more accurate"
        ],
        "correct": 1,
        "explanation": "fit_transform computes statistics (e.g., mean, std) from the data AND transforms it. transform applies the already-learned statistics without recomputing. On test data, you must use transform to avoid leakage."
      },
      {
        "stage": "post",
        "question": "Why is a ColumnTransformer necessary for real-world datasets?",
        "options": [
          "It makes the pipeline run in parallel on multiple CPUs",
          "It applies different preprocessing steps to numeric and categorical columns within the same pipeline",
          "It removes columns with missing values automatically",
          "It converts all columns to the same data type"
        ],
        "correct": 1,
        "explanation": "Real datasets have mixed types. Numeric columns need scaling, categorical columns need encoding. ColumnTransformer routes each column subset to the appropriate transformer within a single pipeline."
      },
      {
        "stage": "post",
        "question": "A production model receives a categorical value it never saw during training ('new_category'). What should the pipeline handle?",
        "options": [
          "Ignore the row entirely and return no prediction",
          "Retrain the entire model from scratch",
          "Handle unknown categories gracefully, e.g., by using an 'unknown' bucket or the global mean in target encoding",
          "Convert the unknown category to the number zero"
        ],
        "correct": 2,
        "explanation": "Robust pipelines anticipate unseen categories in production. Solutions include an 'unknown' fallback for one-hot encoding, or defaulting to the global mean for target encoding."
      }
    ]
  },
  "02-ml-fundamentals/12-hyperparameter-tuning": {
    "questions": [
      {
        "stage": "pre",
        "question": "What is the difference between a parameter and a hyperparameter?",
        "options": [
          "Parameters are set by the user; hyperparameters are learned during training",
          "Parameters are learned during training (weights, biases); hyperparameters are set before training starts (learning rate, max depth)",
          "There is no difference; they are synonyms",
          "Parameters apply to neural networks only; hyperparameters apply to tree models"
        ],
        "correct": 1,
        "explanation": "Parameters are learned by the optimization algorithm during training (e.g., weights). Hyperparameters are set before training and control how learning happens (e.g., learning rate, regularization strength)."
      },
      {
        "stage": "pre",
        "question": "Grid search over 4 hyperparameters with 5 values each requires how many evaluations?",
        "options": [
          "20",
          "25",
          "625",
          "4"
        ],
        "correct": 2,
        "explanation": "Grid search evaluates every combination: 5^4 = 625. This exponential scaling is why grid search becomes impractical with many hyperparameters."
      },
      {
        "stage": "post",
        "question": "Why does random search often outperform grid search with the same evaluation budget?",
        "options": [
          "Random search uses a better optimization algorithm",
          "Most hyperparameters have low effective dimensionality, so random search covers the important ones more densely",
          "Random search always finds the global optimum",
          "Grid search cannot handle continuous hyperparameters"
        ],
        "correct": 1,
        "explanation": "Usually only 1-2 hyperparameters matter for a given problem. Grid search wastes evaluations varying unimportant ones. Random search gives unique values for every parameter per trial, covering important dimensions more densely."
      },
      {
        "stage": "post",
        "question": "In Bayesian optimization, what does the acquisition function balance?",
        "options": [
          "Training speed and model accuracy",
          "Exploitation (searching near known good points) and exploration (searching uncertain regions)",
          "The number of features and the number of samples",
          "Bias and variance in the surrogate model"
        ],
        "correct": 1,
        "explanation": "The acquisition function decides where to evaluate next by balancing exploitation (near known good results) and exploration (where the surrogate model is uncertain). This directs search more efficiently than random."
      },
      {
        "stage": "post",
        "question": "You tune hyperparameters using the test set and report the best test performance. What is wrong with this approach?",
        "options": [
          "Nothing -- this is standard practice",
          "You overfitted to the test set; the reported performance is optimistic and will not generalize",
          "The test set should be used for training, not tuning",
          "Hyperparameters should only be integers"
        ],
        "correct": 1,
        "explanation": "Tuning on the test set means you selected hyperparameters that happen to perform well on those specific samples. This is overfitting to the test set. Use a validation set for tuning and reserve the test set for final evaluation."
      }
    ]
  },
  "02-ml-fundamentals/11-ensemble-methods": {
    "questions": [
      {
        "stage": "pre",
        "question": "Why does combining multiple weak classifiers into an ensemble improve accuracy?",
        "options": [
          "Each weak classifier memorizes a different part of the test set",
          "If the classifiers make different errors, majority voting cancels out individual mistakes",
          "Ensembles always use more training data than single models",
          "Weak classifiers are always faster than strong classifiers"
        ],
        "correct": 1,
        "explanation": "The key is diversity. If classifiers make independent errors, majority voting means a wrong answer must fool more than half the models. Errors cancel out, and the ensemble accuracy exceeds any individual."
      },
      {
        "stage": "pre",
        "question": "What is the main difference between bagging and boosting?",
        "options": [
          "Bagging trains models in parallel on random subsets; boosting trains models sequentially, focusing on previous errors",
          "Bagging uses deep neural networks; boosting uses decision trees",
          "Bagging reduces bias; boosting reduces variance",
          "Bagging requires labeled data; boosting works unsupervised"
        ],
        "correct": 0,
        "explanation": "Bagging trains models independently on bootstrap samples (parallel, reduces variance). Boosting trains models sequentially, with each new model focusing on the mistakes of the ensemble so far (reduces bias)."
      },
      {
        "stage": "post",
        "question": "In AdaBoost, what happens to the sample weight of a misclassified training point after each round?",
        "options": [
          "It stays the same",
          "It increases, so the next weak learner focuses more on this hard example",
          "It decreases, so the next learner ignores it",
          "It is removed from the training set"
        ],
        "correct": 1,
        "explanation": "AdaBoost increases the weights of misclassified samples after each round. This forces the next weak learner to pay more attention to the examples the ensemble currently gets wrong."
      },
      {
        "stage": "post",
        "question": "A random forest with 100 trees has the same test accuracy as 200 trees. Adding more trees to 500 also shows no improvement. Why?",
        "options": [
          "The random forest is underfitting and needs a different algorithm",
          "After enough trees, variance reduction plateaus and adding more trees provides diminishing returns without increasing overfitting",
          "500 trees is the maximum allowed",
          "The trees are all identical so adding more has no effect"
        ],
        "correct": 1,
        "explanation": "Random forests do not overfit with more trees (unlike boosting). However, variance reduction plateaus once enough diverse trees have been averaged. More trees just add compute cost without improving accuracy."
      },
      {
        "stage": "post",
        "question": "Gradient boosting fits each new tree to what quantity?",
        "options": [
          "The original target values",
          "The residuals (errors) of the current ensemble's predictions",
          "Random subsets of features",
          "The predictions of the previous tree"
        ],
        "correct": 1,
        "explanation": "In gradient boosting, each new tree is trained to predict the residuals (negative gradient of the loss) of the current ensemble. This sequentially reduces the remaining error."
      }
    ]
  },
  "02-ml-fundamentals/10-bias-variance": {
    "questions": [
      {
        "stage": "pre",
        "question": "A linear model is used to fit a clearly curved (quadratic) relationship. Which error component dominates?",
        "options": [
          "Variance: the model changes too much with different training data",
          "Bias: the model is too rigid to capture the true nonlinear pattern",
          "Irreducible noise: the data is too noisy",
          "None: the model should fit perfectly"
        ],
        "correct": 1,
        "explanation": "A linear model cannot capture a quadratic curve no matter how much data it sees. This systematic error from wrong model assumptions is bias. The model underfits."
      },
      {
        "stage": "pre",
        "question": "The bias-variance decomposition of expected error has three terms. Which one cannot be reduced by any model?",
        "options": [
          "Bias squared",
          "Variance",
          "Irreducible noise (sigma squared)",
          "All three can be reduced to zero"
        ],
        "correct": 2,
        "explanation": "Irreducible noise comes from randomness in the data itself (measurement error, missing variables). No model can predict noise. Expected error = bias^2 + variance + irreducible noise."
      },
      {
        "stage": "post",
        "question": "Adding L2 regularization to a model increases bias and decreases variance. Why is this useful?",
        "options": [
          "It always improves both training and test accuracy",
          "The reduction in variance can outweigh the increase in bias, lowering total error",
          "L2 regularization eliminates irreducible noise",
          "It makes the model faster to train"
        ],
        "correct": 1,
        "explanation": "Regularization trades a small increase in bias for a larger decrease in variance. When a model is overfitting (high variance), this tradeoff reduces total error even though bias goes up slightly."
      },
      {
        "stage": "post",
        "question": "A model has training error = 2% and test error = 25%. What is the most likely diagnosis?",
        "options": [
          "High bias (underfitting): the model is too simple",
          "High variance (overfitting): the model memorized training data and fails to generalize",
          "High irreducible noise: the data is too noisy",
          "The model is perfectly calibrated"
        ],
        "correct": 1,
        "explanation": "Low training error + high test error + large gap = high variance (overfitting). The model fits training-specific noise. Remedies: regularize, reduce complexity, get more data."
      },
      {
        "stage": "post",
        "question": "You train the same model architecture on 50 different random training subsets and observe that predictions vary wildly between them. What does this indicate?",
        "options": [
          "High bias: the model consistently misses the true pattern",
          "High variance: the model is sensitive to which specific training data it sees",
          "High irreducible noise: the target variable is random",
          "The learning rate is too high"
        ],
        "correct": 1,
        "explanation": "Variance measures how much predictions change when trained on different data subsets. Wildly different predictions across subsets is the definition of high variance."
      }
    ]
  },
  "02-ml-fundamentals/09-model-evaluation": {
    "questions": [
      {
        "stage": "pre",
        "question": "Why should you never tune hyperparameters based on test set performance?",
        "options": [
          "The test set is too small for reliable estimates",
          "Adjusting the model based on test results effectively trains on the test set, making reported performance meaningless",
          "Hyperparameters cannot be changed after training",
          "The test set always has different features than the training set"
        ],
        "correct": 1,
        "explanation": "Every time you adjust your model based on test performance, you leak test information into your modeling decisions. The test set must be used exactly once at the end for an unbiased estimate."
      },
      {
        "stage": "pre",
        "question": "A dataset has 95% negative and 5% positive samples. A model predicts 'negative' for every sample. What is its accuracy?",
        "options": [
          "50%",
          "5%",
          "95%",
          "0%"
        ],
        "correct": 2,
        "explanation": "Accuracy = correct predictions / total = 950/1000 = 95%. This shows why accuracy is misleading for imbalanced data -- a useless model looks great."
      },
      {
        "stage": "post",
        "question": "In K-fold cross-validation with K=5, how many times is each data point used for validation?",
        "options": [
          "5 times",
          "Exactly once",
          "It depends on the random seed",
          "Never -- all data is used for training"
        ],
        "correct": 1,
        "explanation": "In K-fold CV, data is split into K equal folds. Each fold is used as the validation set exactly once while the remaining K-1 folds are used for training."
      },
      {
        "stage": "post",
        "question": "A learning curve shows training score = 0.95 and validation score = 0.60 that does not improve with more data. What should you try?",
        "options": [
          "Collect more training data",
          "Use a simpler model or add regularization to reduce variance (overfitting)",
          "Remove the validation set to give the model more training data",
          "Increase the learning rate"
        ],
        "correct": 1,
        "explanation": "A large gap between training (high) and validation (low) scores is high variance (overfitting). The fix is a simpler model, more regularization, or techniques like dropout -- not more data if the gap persists."
      },
      {
        "stage": "post",
        "question": "AUC-ROC = 0.5 for a binary classifier. What does this indicate?",
        "options": [
          "The model perfectly separates the two classes",
          "The model performs no better than random guessing at ranking positives above negatives",
          "The model has 50% accuracy",
          "The model has equal precision and recall"
        ],
        "correct": 1,
        "explanation": "AUC-ROC = 0.5 means the model's ranking of positive and negative examples is no better than random. AUC = 1.0 would be perfect separation. The metric is threshold-independent."
      }
    ]
  },
  "02-ml-fundamentals/08-feature-engineering": {
    "questions": [
      {
        "stage": "pre",
        "question": "Why is feature engineering often more impactful than choosing a fancier algorithm?",
        "options": [
          "Feature engineering makes the code run faster",
          "Good features expose patterns to the model that raw data hides, making even simple models effective",
          "Feature engineering eliminates the need for a test set",
          "Fancy algorithms cannot process raw data"
        ],
        "correct": 1,
        "explanation": "The representation of data matters more than the algorithm. A well-engineered feature like BMI (weight/height^2) directly exposes the relevant pattern, making even logistic regression competitive with complex ensembles."
      },
      {
        "stage": "pre",
        "question": "What is one-hot encoding?",
        "options": [
          "Replacing each category with its frequency in the dataset",
          "Creating one binary column per category, with exactly one column set to 1 per row",
          "Converting all features to values between 0 and 1",
          "Encoding the target variable as a probability"
        ],
        "correct": 1,
        "explanation": "One-hot encoding creates a binary column for each unique category. For a color feature with values red/blue/green, it produces three columns: is_red, is_blue, is_green."
      },
      {
        "stage": "post",
        "question": "What is the data leakage risk with target encoding?",
        "options": [
          "It makes the model too slow to train",
          "It replaces categories with the mean target value, which can leak information from the test set if not computed on training data only",
          "It creates too many features",
          "It only works with binary targets"
        ],
        "correct": 1,
        "explanation": "Target encoding replaces each category with the mean target for that category. If computed on the full dataset (including test data), test labels leak into training features, inflating performance estimates."
      },
      {
        "stage": "post",
        "question": "TF-IDF weights a word by its inverse document frequency. What is the effect?",
        "options": [
          "Common words like 'the' get high weight because they appear frequently",
          "Rare, distinctive words get higher weight while common words get lower weight",
          "All words get equal weight regardless of frequency",
          "Only the most frequent word in each document is kept"
        ],
        "correct": 1,
        "explanation": "IDF = log(total docs / docs containing word). Common words (appearing in many documents) get low IDF. Rare, distinctive words get high IDF, making them more influential in the representation."
      },
      {
        "stage": "post",
        "question": "You have two features with correlation 0.98. Why might you remove one?",
        "options": [
          "Highly correlated features always cause the model to crash",
          "They are redundant -- both carry nearly the same information, and keeping both increases overfitting risk without adding signal",
          "Correlated features make the data non-stationary",
          "Correlation above 0.5 means the features are measuring different things"
        ],
        "correct": 1,
        "explanation": "Features with r=0.98 are nearly redundant. Keeping both adds a noisy duplicate that increases dimensionality, overfitting risk, and multicollinearity without providing new information about the target."
      }
    ]
  },
  "02-ml-fundamentals/07-unsupervised-learning": {
    "questions": [
      {
        "stage": "pre",
        "question": "What distinguishes unsupervised learning from supervised learning?",
        "options": [
          "Unsupervised learning uses more data",
          "Unsupervised learning has no labeled outputs -- the algorithm finds structure on its own",
          "Unsupervised learning only works with text data",
          "Unsupervised learning always produces better results"
        ],
        "correct": 1,
        "explanation": "In unsupervised learning, there are no labels. The algorithm discovers patterns, groupings, or structure in the data without being told what the correct output should be."
      },
      {
        "stage": "pre",
        "question": "What does K-Means require you to specify before training?",
        "options": [
          "The exact cluster centers",
          "The number of clusters K",
          "The labels for each data point",
          "The distance metric to use"
        ],
        "correct": 1,
        "explanation": "K-Means requires the number of clusters K as input. It then iteratively assigns points to the nearest centroid and recomputes centroids until convergence."
      },
      {
        "stage": "post",
        "question": "K-Means fails on two interlocking half-moon shapes but DBSCAN succeeds. Why?",
        "options": [
          "DBSCAN uses more data than K-Means",
          "DBSCAN finds clusters based on density, so it can discover arbitrary shapes, while K-Means assumes spherical clusters",
          "DBSCAN always outperforms K-Means on every dataset",
          "K-Means cannot handle 2D data"
        ],
        "correct": 1,
        "explanation": "K-Means assigns points to the nearest centroid, producing spherical (convex) clusters. DBSCAN grows clusters from dense regions, discovering any shape as long as the cluster is connected by density."
      },
      {
        "stage": "post",
        "question": "What is the silhouette score measuring?",
        "options": [
          "The total number of clusters found",
          "How similar each point is to its own cluster compared to the nearest other cluster",
          "The speed of the clustering algorithm",
          "The percentage of outliers in the data"
        ],
        "correct": 1,
        "explanation": "Silhouette score = (b - a) / max(a, b), where a is mean intra-cluster distance and b is mean nearest-cluster distance. It ranges from -1 (wrong cluster) to +1 (well-clustered)."
      },
      {
        "stage": "post",
        "question": "How does a Gaussian Mixture Model differ from K-Means in its cluster assignments?",
        "options": [
          "GMM uses hard assignments where each point belongs to exactly one cluster",
          "GMM gives soft (probabilistic) assignments where each point has a probability of belonging to each cluster",
          "GMM does not use centroids at all",
          "GMM only works with one-dimensional data"
        ],
        "correct": 1,
        "explanation": "K-Means assigns each point to exactly one cluster (hard). GMM computes the probability that each point belongs to each Gaussian component (soft), and can model elliptical, overlapping clusters."
      }
    ]
  },
  "02-ml-fundamentals/06-knn-and-distances": {
    "questions": [
      {
        "stage": "pre",
        "question": "KNN is called a 'lazy learner.' What does that mean?",
        "options": [
          "It converges slowly during training",
          "It does no computation at training time and computes everything at prediction time",
          "It uses a simplified version of the loss function",
          "It only works on small datasets"
        ],
        "correct": 1,
        "explanation": "Lazy learning means KNN stores the training data and does no work during 'training.' All computation (distance calculations, voting) happens when a prediction is requested."
      },
      {
        "stage": "pre",
        "question": "Why is feature scaling critical for KNN?",
        "options": [
          "KNN cannot handle negative numbers without scaling",
          "Distance calculations are dominated by features with larger ranges, making scaling necessary for fair comparisons",
          "Feature scaling reduces the number of neighbors needed",
          "KNN uses gradient descent which requires normalized inputs"
        ],
        "correct": 1,
        "explanation": "KNN relies on distances. A feature ranging 0-1000 will dominate a feature ranging 0-1 in distance calculations. Scaling puts all features on comparable ranges."
      },
      {
        "stage": "post",
        "question": "In 100 dimensions with uniform random points, what happens to the ratio of max distance to min distance?",
        "options": [
          "It increases dramatically, making neighbors more distinct",
          "It approaches 1, making all points nearly equidistant from each other",
          "It stays the same as in 2 dimensions",
          "It becomes negative due to numerical overflow"
        ],
        "correct": 1,
        "explanation": "This is the curse of dimensionality. In high dimensions, distances converge: max_dist / min_dist approaches 1. When all points are equidistant, 'nearest' becomes meaningless."
      },
      {
        "stage": "post",
        "question": "Which distance metric is most appropriate for comparing text documents represented as TF-IDF vectors?",
        "options": [
          "L2 (Euclidean) distance",
          "L1 (Manhattan) distance",
          "Cosine distance",
          "Chebyshev distance"
        ],
        "correct": 2,
        "explanation": "Cosine distance measures the angle between vectors, ignoring magnitude. For text, document length (magnitude) is noise -- direction captures meaning. Cosine consistently outperforms L1/L2 for text."
      },
      {
        "stage": "post",
        "question": "What happens to the KNN decision boundary as K increases from 1 to N (the full dataset size)?",
        "options": [
          "The boundary becomes more complex and detailed",
          "The boundary stays the same regardless of K",
          "The boundary smooths out, eventually predicting the majority class for every point",
          "The boundary becomes circular"
        ],
        "correct": 2,
        "explanation": "K=1 produces jagged boundaries that follow every point (overfitting). As K increases, boundaries smooth out. K=N means every query considers all points, always predicting the majority class (maximum bias)."
      }
    ]
  },
  "02-ml-fundamentals/05-support-vector-machines": {
    "questions": [
      {
        "stage": "pre",
        "question": "What are support vectors in an SVM?",
        "options": [
          "All data points in the training set",
          "The training points closest to the decision boundary that determine the hyperplane",
          "The feature vectors after kernel transformation",
          "The weight vectors learned during training"
        ],
        "correct": 1,
        "explanation": "Support vectors are the training points that lie exactly on the margin boundaries. They are the only points that determine the decision hyperplane. Removing non-support-vector points does not change the boundary."
      },
      {
        "stage": "pre",
        "question": "What does the SVM maximize when finding the decision boundary?",
        "options": [
          "The number of correctly classified training points",
          "The margin -- the distance between the decision boundary and the nearest points of each class",
          "The total distance from all points to the boundary",
          "The complexity of the decision boundary"
        ],
        "correct": 1,
        "explanation": "SVMs find the hyperplane that maximizes the margin between the two classes. A wider margin leads to better generalization on unseen data."
      },
      {
        "stage": "post",
        "question": "What happens when you increase the C parameter in an SVM?",
        "options": [
          "The margin gets wider and more misclassifications are allowed",
          "The margin gets narrower, fewer misclassifications are tolerated, and the model may overfit",
          "The kernel function changes from linear to RBF",
          "The number of support vectors always increases"
        ],
        "correct": 1,
        "explanation": "Large C penalizes misclassifications heavily, producing a narrow margin that closely fits the training data. This can lead to overfitting. Small C allows more violations for a wider, more regularized margin."
      },
      {
        "stage": "post",
        "question": "How does the kernel trick enable SVMs to learn nonlinear boundaries?",
        "options": [
          "It replaces the SVM with a neural network",
          "It computes dot products in a high-dimensional space without explicitly mapping data to that space",
          "It removes outliers from the dataset before training",
          "It adds polynomial features to the input data directly"
        ],
        "correct": 1,
        "explanation": "The kernel trick replaces every dot product x_i . x_j with K(x_i, x_j), computing the dot product in a high-dimensional (even infinite-dimensional for RBF) feature space without ever constructing it."
      },
      {
        "stage": "post",
        "question": "Hinge loss is zero when y * f(x) >= 1. What does this mean in terms of classification?",
        "options": [
          "The point is misclassified",
          "The point is correctly classified and lies outside the margin",
          "The point is exactly on the decision boundary",
          "The point is a noise sample that should be ignored"
        ],
        "correct": 1,
        "explanation": "When y * f(x) >= 1, the point is correctly classified AND lies on or beyond the margin boundary. Only points inside the margin or misclassified (y * f(x) < 1) contribute to the hinge loss."
      }
    ]
  },
  "02-ml-fundamentals/04-decision-trees": {
    "questions": [
      {
        "stage": "pre",
        "question": "What does Gini impurity measure at a decision tree node?",
        "options": [
          "The depth of the node in the tree",
          "The probability of misclassifying a randomly chosen sample given the class distribution at that node",
          "The total number of samples at the node",
          "The correlation between features"
        ],
        "correct": 1,
        "explanation": "Gini impurity = 1 - sum(p_k^2). It measures how often a randomly chosen sample would be misclassified if labeled according to the class distribution at that node. Pure node = 0."
      },
      {
        "stage": "pre",
        "question": "What is the main advantage of tree-based models over neural networks for tabular data?",
        "options": [
          "Trees can process images and text natively",
          "Trees always have lower bias than neural networks",
          "Trees handle mixed feature types, require less preprocessing, and are more interpretable",
          "Trees train faster on GPU hardware"
        ],
        "correct": 2,
        "explanation": "Trees natively handle numeric and categorical features without encoding, require minimal preprocessing, and produce interpretable rules. Neural networks excel at spatial/sequential data, not flat tables."
      },
      {
        "stage": "post",
        "question": "Why does a random forest use both bootstrap sampling AND random feature subsets at each split?",
        "options": [
          "To speed up training by reducing the dataset size",
          "To create diverse, decorrelated trees so that averaging reduces variance without increasing bias",
          "To ensure each tree sees every data point at least once",
          "To reduce the depth of individual trees"
        ],
        "correct": 1,
        "explanation": "Both sources of randomness make the trees diverse. Without feature randomization, all trees would split on the same dominant feature. Diversity is what makes averaging effective at reducing variance."
      },
      {
        "stage": "post",
        "question": "A node contains 8 dogs and 2 cats. What is its Gini impurity?",
        "options": [
          "0.0",
          "0.20",
          "0.32",
          "0.50"
        ],
        "correct": 2,
        "explanation": "Gini = 1 - (0.8^2 + 0.2^2) = 1 - (0.64 + 0.04) = 0.32. The node is mostly dogs but not pure, so Gini is between 0 (pure) and 0.5 (max for binary)."
      },
      {
        "stage": "post",
        "question": "MDI (Mean Decrease in Impurity) feature importance is biased toward which type of feature?",
        "options": [
          "Binary features with only two values",
          "Features with low variance",
          "High-cardinality features with many possible split points",
          "Features that are highly correlated with the target"
        ],
        "correct": 2,
        "explanation": "MDI is biased toward high-cardinality features because they offer more possible split points, giving them more chances to reduce impurity by luck. Permutation importance is more reliable."
      }
    ]
  },
  "02-ml-fundamentals/03-logistic-regression": {
    "questions": [
      {
        "stage": "pre",
        "question": "What is the range of the sigmoid function's output?",
        "options": [
          "Negative infinity to positive infinity",
          "0 to 1 (exclusive)",
          "-1 to 1",
          "0 to positive infinity"
        ],
        "correct": 1,
        "explanation": "The sigmoid function 1/(1+e^(-z)) outputs values strictly between 0 and 1, which can be interpreted as probabilities."
      },
      {
        "stage": "pre",
        "question": "Why is logistic regression called 'regression' even though it is used for classification?",
        "options": [
          "It predicts continuous values that are then rounded",
          "The name comes from the logistic (sigmoid) function it uses, not from regression analysis",
          "It was originally designed for regression and later adapted",
          "It minimizes mean squared error like linear regression"
        ],
        "correct": 1,
        "explanation": "The name comes from the logistic function (sigmoid). Despite the name, logistic regression is a classification algorithm that outputs class probabilities."
      },
      {
        "stage": "post",
        "question": "Why is binary cross-entropy used instead of MSE for logistic regression?",
        "options": [
          "Cross-entropy is faster to compute",
          "MSE with sigmoid creates a non-convex cost surface with local minima, while cross-entropy is convex",
          "MSE can only be used with linear models",
          "Cross-entropy works only when the dataset is balanced"
        ],
        "correct": 1,
        "explanation": "MSE combined with the sigmoid activation creates a non-convex cost surface with many local minima. Binary cross-entropy with sigmoid is convex, guaranteeing a single global minimum."
      },
      {
        "stage": "post",
        "question": "A spam filter has precision = 0.95 and recall = 0.60. What does this mean in practical terms?",
        "options": [
          "95% of all emails are correctly classified, and 60% of spam is caught",
          "When it flags an email as spam, it is correct 95% of the time, but it only catches 60% of actual spam",
          "60% of flagged emails are spam, and 95% of all spam is caught",
          "The model is 95% accurate on the test set and 60% on the training set"
        ],
        "correct": 1,
        "explanation": "Precision = 0.95 means 95% of emails predicted as spam are actually spam (few false alarms). Recall = 0.60 means only 60% of actual spam is caught (40% slips through)."
      },
      {
        "stage": "post",
        "question": "In softmax regression for 4 classes, what is true about the output probabilities?",
        "options": [
          "Each class gets an independent probability between 0 and 1",
          "The four output probabilities sum to 1, and the class with the highest probability is the prediction",
          "Only the top-2 classes receive nonzero probabilities",
          "The outputs are raw scores, not probabilities"
        ],
        "correct": 1,
        "explanation": "Softmax converts a vector of raw scores into probabilities that sum to 1. The predicted class is the one with the highest probability."
      }
    ]
  },
  "02-ml-fundamentals/02-linear-regression": {
    "questions": [
      {
        "stage": "pre",
        "question": "What does the learning rate control in gradient descent?",
        "options": [
          "The number of features used by the model",
          "How many epochs the model trains for",
          "The size of each parameter update step",
          "The ratio of training to test data"
        ],
        "correct": 2,
        "explanation": "The learning rate is a scalar that controls how much weights change per gradient descent step. Too large causes divergence, too small causes slow convergence."
      },
      {
        "stage": "pre",
        "question": "What does R-squared = 0 mean for a regression model?",
        "options": [
          "The model makes perfect predictions",
          "The model is no better than always predicting the mean of the target",
          "The model has negative error",
          "The model has not been trained yet"
        ],
        "correct": 1,
        "explanation": "R-squared = 0 means the model explains none of the variance in the target. It performs exactly as well as simply predicting the mean every time."
      },
      {
        "stage": "post",
        "question": "Why is feature scaling important for gradient descent in multiple linear regression?",
        "options": [
          "It makes the model more interpretable",
          "It prevents the cost surface from being elongated, allowing faster convergence",
          "It reduces the number of features needed",
          "It guarantees the model will find the global minimum"
        ],
        "correct": 1,
        "explanation": "When features have very different scales, the cost surface becomes elongated. Gradient descent takes many more steps to converge. Standardizing features makes the surface more spherical."
      },
      {
        "stage": "post",
        "question": "The normal equation gives optimal weights directly. Why would you prefer gradient descent instead?",
        "options": [
          "Gradient descent always gives more accurate results",
          "The normal equation does not work for linear regression",
          "Matrix inversion in the normal equation is O(n^3) in features, which is too slow for thousands of features",
          "Gradient descent requires less memory than storing the data"
        ],
        "correct": 2,
        "explanation": "The normal equation requires inverting X^T * X, which is O(n^3) in the number of features. For large feature counts, gradient descent is more efficient."
      },
      {
        "stage": "post",
        "question": "A degree-10 polynomial regression model fits training data perfectly (R^2 = 1.0) but has R^2 = 0.3 on test data. What should you do?",
        "options": [
          "Increase the polynomial degree to 20 for even better training fit",
          "Reduce model complexity (lower degree) or add regularization (Ridge) to prevent overfitting",
          "Collect less training data so the model cannot memorize",
          "Remove the test set and report training R^2 only"
        ],
        "correct": 1,
        "explanation": "Perfect training fit with poor test fit is overfitting. The fix is to reduce complexity (lower polynomial degree) or add regularization to penalize large weights."
      }
    ]
  },
  "02-ml-fundamentals/01-what-is-machine-learning": {
    "questions": [
      {
        "stage": "pre",
        "question": "In supervised learning, what does the model receive during training?",
        "options": [
          "Only input data with no labels",
          "Input-output pairs where the correct answer is provided",
          "A reward signal for each action taken",
          "A set of rules written by a human expert"
        ],
        "correct": 1,
        "explanation": "Supervised learning trains on input-output pairs (labeled data). The model learns to map inputs to known correct outputs."
      },
      {
        "stage": "pre",
        "question": "What is the purpose of splitting data into training and test sets?",
        "options": [
          "To make training faster by using less data",
          "To have backup data in case the training data is lost",
          "To evaluate whether the model generalizes to data it has never seen during training",
          "To balance the classes in the dataset"
        ],
        "correct": 2,
        "explanation": "The test set measures generalization. If you evaluate on training data, you measure memorization, not learning."
      },
      {
        "stage": "post",
        "question": "A model gets 98% accuracy on training data but 55% on test data. What is this an example of?",
        "options": [
          "Underfitting: the model is too simple",
          "Overfitting: the model memorized training noise instead of learning general patterns",
          "Data drift: the test distribution changed",
          "Good generalization: the model learned the true patterns"
        ],
        "correct": 1,
        "explanation": "A large gap between training accuracy (high) and test accuracy (low) is the hallmark of overfitting. The model memorized the training data."
      },
      {
        "stage": "post",
        "question": "An e-commerce site wants to group customers into segments based on purchase behavior without any predefined labels. Which type of ML is this?",
        "options": [
          "Supervised learning (classification)",
          "Supervised learning (regression)",
          "Unsupervised learning (clustering)",
          "Reinforcement learning"
        ],
        "correct": 2,
        "explanation": "Finding natural groupings in data without predefined labels is clustering, which is a form of unsupervised learning."
      },
      {
        "stage": "post",
        "question": "Which scenario is NOT a good use case for machine learning?",
        "options": [
          "Predicting customer churn from historical behavior data",
          "Detecting fraudulent transactions in a stream of millions of payments",
          "Converting temperatures from Celsius to Fahrenheit",
          "Classifying images of skin lesions as benign or malignant"
        ],
        "correct": 2,
        "explanation": "Celsius to Fahrenheit is a fixed formula (F = 9/5 * C + 32). Simple, well-defined rules do not need ML. ML adds complexity with no benefit."
      }
    ]
  },
  "01-math-foundations/22-stochastic-processes": {
    "questions": [
      {
        "stage": "pre",
        "question": "What is the Markov property?",
        "options": [
          "The process always returns to its starting state",
          "The next state depends only on the current state, not on the history of previous states",
          "All states are equally likely at every step",
          "The process must have a finite number of states"
        ],
        "correct": 1,
        "explanation": "The Markov property (memorylessness) means P(X_{t+1} = j | X_t = i, X_{t-1}, ...) = P(X_{t+1} = j | X_t = i). The future depends only on where you are, not how you got there. This enables compact representation via a transition matrix."
      },
      {
        "stage": "pre",
        "question": "In a 1D random walk, how does the expected distance from the origin scale with the number of steps n?",
        "options": [
          "Linearly: proportional to n",
          "As the square root: proportional to sqrt(n)",
          "Logarithmically: proportional to log(n)",
          "It stays constant regardless of n"
        ],
        "correct": 1,
        "explanation": "Each step is +/-1 with equal probability. The variance after n steps is n, so the standard deviation (typical distance from origin) is sqrt(n). After 10,000 steps, the expected distance is about 100, not 10,000."
      },
      {
        "stage": "post",
        "question": "What is the stationary distribution of a Markov chain?",
        "options": [
          "The initial distribution of states",
          "The distribution that does not change under the transition matrix: pi * P = pi",
          "The distribution of states after exactly one transition",
          "The uniform distribution over all states"
        ],
        "correct": 1,
        "explanation": "The stationary distribution pi satisfies pi * P = pi — applying the transition matrix leaves it unchanged. It represents the long-run fraction of time spent in each state. For an irreducible, aperiodic chain, any initial distribution converges to pi."
      },
      {
        "stage": "post",
        "question": "In Langevin dynamics x_{t+1} = x_t - dt * grad(U) + sqrt(2*T*dt) * z, what happens as temperature T approaches 0?",
        "options": [
          "The process becomes a pure random walk",
          "The process becomes pure gradient descent (deterministic optimization)",
          "The process diverges to infinity",
          "The process freezes at the initial position"
        ],
        "correct": 1,
        "explanation": "At T = 0, the noise term sqrt(2*T*dt)*z vanishes, leaving x_{t+1} = x_t - dt * grad(U), which is standard gradient descent. At high T, the noise dominates and the process is nearly a random walk. Intermediate T balances exploration and exploitation."
      },
      {
        "stage": "post",
        "question": "In a diffusion model, what does the forward process do to a data sample over T steps?",
        "options": [
          "It sharpens the image by removing noise at each step",
          "It gradually adds Gaussian noise until the sample becomes pure noise, following a Markov chain",
          "It compresses the image to a lower resolution",
          "It applies learned transformations to generate new data"
        ],
        "correct": 1,
        "explanation": "The forward process is a Markov chain: x_t = sqrt(alpha_t) * x_{t-1} + sqrt(1 - alpha_t) * noise. After T steps, x_T is approximately N(0, I) — pure Gaussian noise. The reverse process (learned by a neural network) then denoises step-by-step to generate new data."
      }
    ]
  },
  "01-math-foundations/21-graph-theory": {
    "questions": [
      {
        "stage": "pre",
        "question": "What does the adjacency matrix A[i][j] = 1 represent?",
        "options": [
          "Node i has degree j",
          "There is an edge from node i to node j",
          "Node i and node j have the same label",
          "The shortest path from i to j has length 1"
        ],
        "correct": 1,
        "explanation": "The adjacency matrix is the core representation of a graph. A[i][j] = 1 means there is an edge connecting node i to node j. For undirected graphs, the matrix is symmetric (A[i][j] = A[j][i])."
      },
      {
        "stage": "pre",
        "question": "What data structure does BFS use and what does it find?",
        "options": [
          "Stack; finds connected components",
          "Queue; finds shortest paths in unweighted graphs",
          "Priority queue; finds minimum spanning tree",
          "Hash map; finds duplicate nodes"
        ],
        "correct": 1,
        "explanation": "BFS uses a queue (FIFO) to explore all neighbors at distance k before moving to distance k+1. This guarantees that the first time a node is discovered, it is via a shortest path from the source."
      },
      {
        "stage": "post",
        "question": "The graph Laplacian L = D - A of a connected graph has how many zero eigenvalues?",
        "options": [
          "Zero",
          "Exactly one",
          "Equal to the number of nodes",
          "Equal to the number of edges"
        ],
        "correct": 1,
        "explanation": "The number of zero eigenvalues of the Laplacian equals the number of connected components. A connected graph has exactly one connected component, so exactly one zero eigenvalue. A graph with k disconnected pieces has k zero eigenvalues."
      },
      {
        "stage": "post",
        "question": "In GNN message passing, what does h_v^(k+1) = sigma(W * mean({h_u^(k) : u in neighbors(v)})) compute?",
        "options": [
          "The shortest path from v to all other nodes",
          "A new feature vector for node v by aggregating neighbor features, transforming with learned weights, and applying a nonlinearity",
          "The degree of node v at layer k+1",
          "The PageRank score of node v"
        ],
        "correct": 1,
        "explanation": "Each node collects features from its neighbors (mean aggregation), multiplies by a learned weight matrix W, and applies an activation function sigma. After k rounds, each node has information from its k-hop neighborhood."
      },
      {
        "stage": "post",
        "question": "How does spectral clustering use the Fiedler vector (eigenvector of the second-smallest eigenvalue of L)?",
        "options": [
          "Nodes with the largest Fiedler vector entries form one cluster",
          "Nodes with positive Fiedler vector values go in one group, nodes with negative values go in the other",
          "The Fiedler vector is used as edge weights",
          "The Fiedler vector determines the number of clusters"
        ],
        "correct": 1,
        "explanation": "The Fiedler vector encodes the smoothest non-trivial function on the graph. Nodes in the same tightly-connected cluster get similar values, while nodes separated by a bottleneck get values with opposite signs. The sign split partitions the graph into two clusters."
      }
    ]
  },
  "01-math-foundations/20-fourier-transform": {
    "questions": [
      {
        "stage": "pre",
        "question": "What does the Fourier transform do to a signal?",
        "options": [
          "Compresses the signal to use less storage",
          "Decomposes the signal into sine waves of different frequencies, amplitudes, and phases",
          "Removes noise from the signal",
          "Converts the signal from analog to digital"
        ],
        "correct": 1,
        "explanation": "The Fourier transform converts a signal from the time domain to the frequency domain. Each frequency coefficient X[k] tells you the amplitude and phase of a sine wave at frequency k. The signal is re-expressed as a sum of these sine waves."
      },
      {
        "stage": "pre",
        "question": "What is the time complexity of the Fast Fourier Transform (FFT) compared to the direct DFT?",
        "options": [
          "Both are O(N^2)",
          "FFT is O(N log N), DFT is O(N^2)",
          "FFT is O(N), DFT is O(N log N)",
          "FFT is O(log N), DFT is O(N)"
        ],
        "correct": 1,
        "explanation": "The direct DFT computes N outputs, each summing over N inputs: O(N^2). The Cooley-Tukey FFT splits the signal into even/odd halves recursively, doing O(N) work at each of log2(N) levels, giving O(N log N). For N = 1 million, this is 20 million vs 1 trillion operations."
      },
      {
        "stage": "post",
        "question": "What does the convolution theorem state?",
        "options": [
          "Convolution in the time domain equals addition in the frequency domain",
          "Convolution in the time domain equals pointwise multiplication in the frequency domain",
          "Convolution always increases the length of a signal",
          "Convolution and correlation are identical operations"
        ],
        "correct": 1,
        "explanation": "The convolution theorem states that convolution in the time domain equals pointwise multiplication in the frequency domain: x * h = IFFT(FFT(x) . FFT(h)). This is why FFT-based convolution is O(N log N) instead of O(N*M) for large kernels."
      },
      {
        "stage": "post",
        "question": "Why does zero-padding a signal before FFT NOT increase the true frequency resolution?",
        "options": [
          "Zero-padding introduces noise that cancels the improvement",
          "Zero-padding interpolates between existing frequency bins but cannot reveal frequency detail absent from the original samples",
          "Zero-padding only works for power-of-2 signal lengths",
          "The FFT algorithm ignores zero-padded samples"
        ],
        "correct": 1,
        "explanation": "True frequency resolution depends on the observation time T = N/fs. Zero-padding adds more frequency bins (finer grid) but only interpolates the existing spectrum — it gives a smoother-looking result without resolving frequencies closer than 1/T Hz apart."
      },
      {
        "stage": "post",
        "question": "In the original Transformer's sinusoidal positional encodings, why are different dimension pairs assigned geometrically spaced frequencies?",
        "options": [
          "It reduces the computational cost of attention",
          "Each frequency provides a different resolution — high frequencies encode fine position, low frequencies encode coarse position, giving each position a unique fingerprint",
          "Geometric spacing is required by the FFT algorithm",
          "It ensures all encoding values are between 0 and 1"
        ],
        "correct": 1,
        "explanation": "High-frequency dimensions change rapidly with position (fine resolution), while low-frequency dimensions change slowly (coarse resolution). Together, the multi-frequency encoding gives every position a unique pattern — similar to how Fourier coefficients uniquely identify a signal."
      }
    ]
  },
  "01-math-foundations/19-complex-numbers": {
    "questions": [
      {
        "stage": "pre",
        "question": "What is the imaginary unit i defined by?",
        "options": [
          "i = sqrt(2)",
          "i^2 = -1",
          "i = -1",
          "i^2 = 1"
        ],
        "correct": 1,
        "explanation": "The imaginary unit i is defined by the property i^2 = -1. It extends the real number line into a 2D plane. Geometrically, multiplying by i is a 90-degree rotation — two multiplications (i^2) give a 180-degree rotation, which is -1."
      },
      {
        "stage": "pre",
        "question": "What does Euler's formula e^(i*theta) equal?",
        "options": [
          "theta + i",
          "cos(theta) + i*sin(theta)",
          "sin(theta) + cos(theta)",
          "i^theta"
        ],
        "correct": 1,
        "explanation": "Euler's formula states e^(i*theta) = cos(theta) + i*sin(theta). This connects complex exponentials to trigonometry and shows that e^(i*theta) traces the unit circle as theta varies."
      },
      {
        "stage": "post",
        "question": "What is the result of (3 + 2i)(1 + 4i)?",
        "options": [
          "3 + 8i",
          "4 + 6i",
          "-5 + 14i",
          "5 + 14i"
        ],
        "correct": 2,
        "explanation": "Using FOIL: (3)(1) + (3)(4i) + (2i)(1) + (2i)(4i) = 3 + 12i + 2i + 8i^2 = 3 + 14i + 8(-1) = 3 + 14i - 8 = -5 + 14i."
      },
      {
        "stage": "post",
        "question": "Why are complex numbers used in Rotary Position Embedding (RoPE) for transformers?",
        "options": [
          "Complex numbers compress the position encoding to use less memory",
          "Multiplying query/key vectors by complex rotations encodes relative position as a rotation angle",
          "Complex numbers are required by the attention softmax function",
          "RoPE uses imaginary numbers to handle negative positions"
        ],
        "correct": 1,
        "explanation": "RoPE multiplies query and key vectors by complex rotation matrices e^(i*m*theta) where m is the position. The relative position between two tokens becomes a rotation angle, and attention naturally becomes sensitive to relative (not absolute) position through complex multiplication."
      },
      {
        "stage": "post",
        "question": "The N-th roots of unity are N equally spaced points on the unit circle. What is their sum?",
        "options": [
          "N",
          "1",
          "0",
          "N/2"
        ],
        "correct": 2,
        "explanation": "The N roots of unity are e^(2*pi*i*k/N) for k = 0, ..., N-1. They are symmetrically distributed around the unit circle, so their vector sum cancels out to zero. This symmetry property is what makes the DFT invertible."
      }
    ]
  },
  "01-math-foundations/18-convex-optimization": {
    "questions": [
      {
        "stage": "pre",
        "question": "What is the defining property of a convex function?",
        "options": [
          "It has exactly one critical point",
          "The line segment between any two points on its graph lies above or on the graph",
          "Its derivative is always positive",
          "It can only be defined on positive real numbers"
        ],
        "correct": 1,
        "explanation": "A function is convex if for any two points x, y and any t in [0,1]: f(tx + (1-t)y) <= t*f(x) + (1-t)*f(y). Geometrically, the chord between any two points on the graph never dips below the graph itself."
      },
      {
        "stage": "pre",
        "question": "Which of these ML problems has a convex loss landscape?",
        "options": [
          "Training a 3-layer neural network with ReLU activations",
          "Logistic regression with cross-entropy loss",
          "k-means clustering",
          "Matrix factorization for recommendation"
        ],
        "correct": 1,
        "explanation": "Logistic regression has a convex loss (log-loss is convex in the weights). Neural networks, k-means, and matrix factorization are all non-convex. For convex problems, any local minimum is the global minimum."
      },
      {
        "stage": "post",
        "question": "Newton's method converges to the minimum of f(x) = 5x^2 + 3x + 1 in how many steps?",
        "options": [
          "1 step (it is exact for quadratic functions)",
          "About 10 steps",
          "About 100 steps",
          "It depends on the learning rate"
        ],
        "correct": 0,
        "explanation": "Newton's method fits a local quadratic approximation and jumps to its minimum. For an actual quadratic function, the approximation is exact, so Newton's method converges in a single step regardless of the starting point."
      },
      {
        "stage": "post",
        "question": "In the KKT conditions, what does 'complementary slackness' (lambda_i * g_i(x) = 0) mean?",
        "options": [
          "All constraints must be active at the optimum",
          "Either a constraint is active (g_i = 0) or its multiplier is zero (lambda_i = 0) — an inactive constraint has no effect",
          "The gradients of all constraints must be orthogonal",
          "The Lagrangian is always zero at the optimum"
        ],
        "correct": 1,
        "explanation": "Complementary slackness means each constraint is either binding (g_i = 0, sitting on the boundary) or irrelevant (lambda_i = 0, not affecting the solution). In SVMs, this is why only support vectors (active constraints with lambda_i > 0) determine the decision boundary."
      },
      {
        "stage": "post",
        "question": "Why does SGD find good solutions in non-convex neural network landscapes despite the lack of convexity guarantees?",
        "options": [
          "Neural networks are secretly convex in high dimensions",
          "SGD always finds the global minimum",
          "In high dimensions, most critical points are saddle points (not bad local minima), and SGD noise helps escape them",
          "The loss function is irrelevant to model performance"
        ],
        "correct": 2,
        "explanation": "In high-dimensional parameter spaces, random critical points are overwhelmingly saddle points. The few local minima that exist tend to have loss values close to the global minimum. SGD's stochastic noise helps escape saddle points, and overparameterization smooths the landscape."
      }
    ]
  },
  "01-math-foundations/17-linear-systems": {
    "questions": [
      {
        "stage": "pre",
        "question": "What does it mean geometrically when a system Ax = b has no exact solution?",
        "options": [
          "The matrix A has all zero entries",
          "The vector b does not lie in the column space of A",
          "The system has more unknowns than equations",
          "The matrix A is symmetric"
        ],
        "correct": 1,
        "explanation": "In the column picture, Ax = b asks: what linear combination of A's columns produces b? If b is not in the column space (span of A's columns), no exact solution exists. This happens when the system is overdetermined (more equations than unknowns)."
      },
      {
        "stage": "pre",
        "question": "Why is partial pivoting used in Gaussian elimination?",
        "options": [
          "It reduces the time complexity from O(n^3) to O(n^2)",
          "It selects the largest available pivot to minimize error amplification from dividing by small numbers",
          "It ensures the result is always an integer",
          "It eliminates the need for back substitution"
        ],
        "correct": 1,
        "explanation": "Without pivoting, dividing by a small pivot amplifies rounding errors. Partial pivoting swaps rows to place the largest absolute value in the pivot position, keeping the multipliers small and the computation numerically stable."
      },
      {
        "stage": "post",
        "question": "Why is Cholesky decomposition preferred over LU for solving (X^T X + lambda I) w = X^T y in ridge regression?",
        "options": [
          "Cholesky works on any matrix while LU requires square matrices",
          "The matrix X^T X + lambda I is symmetric positive definite, so Cholesky is twice as fast as LU and requires half the storage",
          "Cholesky gives a more accurate answer than LU",
          "LU decomposition cannot handle regularization terms"
        ],
        "correct": 1,
        "explanation": "When lambda > 0, X^T X + lambda I is always symmetric positive definite. Cholesky factors A = LL^T in O(n^3/3) operations — roughly half the O(2n^3/3) of LU — and needs only the lower triangle. It exploits the symmetry that LU does not."
      },
      {
        "stage": "post",
        "question": "A matrix has condition number kappa = 10^8. You are using float64 (~15 digits of precision). How many digits of the solution can you trust?",
        "options": [
          "About 15 digits",
          "About 7 digits (15 - log10(10^8) = 15 - 8)",
          "About 8 digits",
          "Zero digits — the solution is meaningless"
        ],
        "correct": 1,
        "explanation": "You lose approximately log10(kappa) digits of precision. With kappa = 10^8, you lose about 8 digits from float64's ~15 digits, leaving about 7 trustworthy digits. If kappa approaches 10^16, the solution becomes meaningless in float64."
      },
      {
        "stage": "post",
        "question": "What is the main advantage of LU decomposition over Gaussian elimination when you need to solve Ax = b for many different b vectors?",
        "options": [
          "LU decomposition is more numerically stable",
          "The O(n^3) factorization is done once; each subsequent solve with a new b costs only O(n^2)",
          "LU decomposition works on rectangular matrices",
          "LU always produces a unique solution"
        ],
        "correct": 1,
        "explanation": "LU factors A = LU once in O(n^3). Then for each new b, you solve Ly = b (forward substitution) and Ux = y (back substitution), each O(n^2). Gaussian elimination would redo the full O(n^3) for every new b."
      }
    ]
  },
  "01-math-foundations/16-sampling-methods": {
    "questions": [
      {
        "stage": "pre",
        "question": "What does temperature < 1.0 do to a language model's output distribution?",
        "options": [
          "Makes the distribution more uniform (more random)",
          "Sharpens the distribution, making the highest-probability token more likely",
          "Removes all tokens except the top one",
          "Has no effect on the output"
        ],
        "correct": 1,
        "explanation": "Temperature < 1.0 divides logits by a number less than 1, which amplifies differences between logits. After softmax, the highest-probability token gets an even larger share. Temperature approaches 0 gives greedy (argmax) decoding."
      },
      {
        "stage": "pre",
        "question": "What is the key difference between top-k and top-p (nucleus) sampling?",
        "options": [
          "Top-k is faster than top-p",
          "Top-k keeps a fixed number of tokens; top-p keeps a variable number based on cumulative probability",
          "Top-p only works with temperature = 1.0",
          "Top-k works on logits while top-p works on probabilities"
        ],
        "correct": 1,
        "explanation": "Top-k always keeps exactly k tokens regardless of the probability distribution. Top-p adaptively keeps the smallest set of tokens whose cumulative probability exceeds p. When the model is confident, top-p keeps few tokens; when uncertain, it keeps many."
      },
      {
        "stage": "post",
        "question": "Why can't you backpropagate through a standard sampling operation z ~ N(mu, sigma^2)?",
        "options": [
          "Normal distributions don't have gradients",
          "The sampling operation is non-deterministic and has no well-defined derivative with respect to mu and sigma",
          "PyTorch doesn't support normal distributions",
          "The gradient is always exactly zero"
        ],
        "correct": 1,
        "explanation": "Sampling introduces a stochastic discontinuity — you can't compute d(sample)/d(mu) for a random draw. The reparameterization trick solves this by writing z = mu + sigma * epsilon (where epsilon ~ N(0,1)), making z a deterministic, differentiable function of mu and sigma."
      },
      {
        "stage": "post",
        "question": "In Metropolis-Hastings MCMC, what happens if the proposal standard deviation is set much too large?",
        "options": [
          "The chain converges faster because it takes bigger steps",
          "Most proposals land in low-probability regions and are rejected, so the chain barely moves",
          "The stationary distribution changes to a uniform distribution",
          "The burn-in period becomes zero"
        ],
        "correct": 1,
        "explanation": "With a large proposal standard deviation, proposed points are far from the current position and likely land in low-probability regions. These are rejected, causing the chain to stay stuck at the current point. The optimal acceptance rate is about 23% for high-dimensional Gaussian proposals."
      },
      {
        "stage": "post",
        "question": "In rejection sampling, what happens to the acceptance rate as the dimensionality of the target distribution increases?",
        "options": [
          "It stays constant regardless of dimension",
          "It increases because there are more dimensions to accept in",
          "It drops exponentially because most of the proposal volume gets rejected",
          "It approaches 50% in all cases"
        ],
        "correct": 2,
        "explanation": "In high dimensions, the volume of the proposal distribution that overlaps with the target distribution shrinks exponentially. The bound M grows, and the acceptance rate (1/M) drops exponentially. This is the curse of dimensionality for rejection sampling."
      }
    ]
  },
  "01-math-foundations/15-statistics-for-ml": {
    "questions": [
      {
        "stage": "pre",
        "question": "What does a p-value of 0.03 mean in a hypothesis test?",
        "options": [
          "There is a 3% probability the null hypothesis is true",
          "There is a 3% probability of seeing data this extreme if the null hypothesis were true",
          "The model improved by 3%",
          "97% of the data supports the alternative hypothesis"
        ],
        "correct": 1,
        "explanation": "The p-value is the probability of observing data as extreme as what you got, assuming the null hypothesis is true. It is NOT the probability that H0 is true — this is the single most common misunderstanding in statistics."
      },
      {
        "stage": "pre",
        "question": "Why do you divide by (n-1) instead of n when computing sample variance?",
        "options": [
          "It makes the computation faster",
          "It accounts for the fact that the sample mean is not the true population mean (Bessel's correction)",
          "It converts the variance to standard deviation",
          "It only applies when the sample size is odd"
        ],
        "correct": 1,
        "explanation": "Bessel's correction (dividing by n-1) compensates for the bias introduced by using the sample mean instead of the true population mean. Without it, sample variance systematically underestimates the true population variance."
      },
      {
        "stage": "post",
        "question": "You test 20 different model configurations at alpha = 0.05. What is the approximate probability of at least one false positive?",
        "options": [
          "5%",
          "25%",
          "64%",
          "95%"
        ],
        "correct": 2,
        "explanation": "P(at least one false positive) = 1 - (1 - 0.05)^20 = 1 - 0.95^20 ≈ 0.64 (64%). This is the multiple comparison problem. Bonferroni correction addresses it by testing each at alpha/20 = 0.0025."
      },
      {
        "stage": "post",
        "question": "Model A scores 0.9234 and Model B scores 0.9237 on 1 million test samples with p-value = 0.001. What should you conclude?",
        "options": [
          "Model B is significantly better and should be deployed immediately",
          "The difference is statistically significant but a 0.03% improvement may not be practically significant",
          "The test is invalid because the sample size is too large",
          "Model A is better because it was tested first"
        ],
        "correct": 1,
        "explanation": "With 1 million samples, even trivially small differences become statistically significant. The p-value confirms the difference is real, but the effect size (0.03% accuracy gain) may not justify the engineering cost of deployment. Always report both p-value and effect size."
      },
      {
        "stage": "post",
        "question": "What advantage does bootstrap have over the paired t-test for comparing two ML models?",
        "options": [
          "Bootstrap always produces smaller p-values",
          "Bootstrap requires no distributional assumptions and works for any metric (AUC, F1, median)",
          "Bootstrap needs fewer samples to reach significance",
          "Bootstrap can only be used with neural networks"
        ],
        "correct": 1,
        "explanation": "Bootstrap resampling estimates the sampling distribution of any statistic by resampling with replacement. Unlike the t-test, it does not assume normality. It works for any metric — AUC, F1, precision@k, median — without needing a closed-form formula."
      }
    ]
  },
  "01-math-foundations/14-norms-and-distances": {
    "questions": [
      {
        "stage": "pre",
        "question": "What does cosine similarity measure between two vectors?",
        "options": [
          "The Euclidean distance between them",
          "The angle between them, ignoring their magnitudes",
          "The sum of their element-wise products",
          "The maximum difference in any single dimension"
        ],
        "correct": 1,
        "explanation": "Cosine similarity measures the cosine of the angle between two vectors, normalized by their magnitudes. It ranges from -1 (opposite) to +1 (same direction) and ignores vector length, which is why it dominates in NLP where document length is noise."
      },
      {
        "stage": "pre",
        "question": "Why is L1 distance called 'Manhattan distance'?",
        "options": [
          "It was invented in Manhattan",
          "It measures distance along a grid, as if walking on city blocks",
          "It only works in exactly two dimensions",
          "It computes the maximum difference across all dimensions"
        ],
        "correct": 1,
        "explanation": "L1 distance sums the absolute differences along each axis, which corresponds to the shortest path on a grid where you can only move along axes (no diagonals) — like walking on a city street grid."
      },
      {
        "stage": "post",
        "question": "Why does L1 regularization (Lasso) produce sparse weights while L2 regularization (Ridge) does not?",
        "options": [
          "L1 uses a larger penalty constant than L2",
          "The L1 diamond constraint has corners on the axes where weights are zero; loss contours are likely to touch at corners",
          "L2 regularization only applies to the bias terms",
          "L1 regularization clips weights below a threshold to zero"
        ],
        "correct": 1,
        "explanation": "The L1 constraint region is a diamond shape with corners aligned with the axes. The loss function's contour ellipses are most likely to first touch the diamond at a corner, where one or more weights are exactly zero. The L2 constraint is a circle with no corners, so the touch point has all weights nonzero."
      },
      {
        "stage": "post",
        "question": "What advantage does Wasserstein distance have over KL divergence when comparing probability distributions?",
        "options": [
          "Wasserstein is always smaller than KL divergence",
          "Wasserstein provides meaningful gradients even when distributions do not overlap, while KL goes to infinity",
          "Wasserstein is symmetric but KL is not",
          "Both B and C are correct"
        ],
        "correct": 3,
        "explanation": "Wasserstein distance is a true metric (symmetric, satisfies triangle inequality) and provides gradients even for non-overlapping distributions. KL divergence is asymmetric and goes to infinity when distributions don't overlap, which is why WGANs replaced KL-based GANs."
      },
      {
        "stage": "post",
        "question": "When would you use Mahalanobis distance instead of Euclidean distance?",
        "options": [
          "When features are all binary (0 or 1)",
          "When features have different scales and are correlated with each other",
          "When you are comparing strings instead of vectors",
          "When you need a faster computation than L2"
        ],
        "correct": 1,
        "explanation": "Mahalanobis distance accounts for the covariance structure of the data, decorrelating and normalizing features before computing L2 distance. It correctly handles features at different scales and with correlations, whereas Euclidean distance treats all dimensions equally."
      }
    ]
  },
  "01-math-foundations/13-numerical-stability": {
    "questions": [
      {
        "stage": "pre",
        "question": "What is the approximate range of numbers that float32 can represent?",
        "options": [
          "+/- 65,504",
          "+/- 3.4e38",
          "+/- 1.8e308",
          "+/- 1.0e10"
        ],
        "correct": 1,
        "explanation": "Float32 has an 8-bit exponent giving a range of approximately +/- 3.4e38. Float16 is limited to +/- 65,504, and float64 reaches +/- 1.8e308."
      },
      {
        "stage": "pre",
        "question": "Why does 0.1 + 0.2 not equal 0.3 in floating-point arithmetic?",
        "options": [
          "Python rounds all decimals to integers",
          "0.1 and 0.2 cannot be represented exactly in binary floating point",
          "The CPU has a bug in its addition circuit",
          "0.3 is not a valid floating-point number"
        ],
        "correct": 1,
        "explanation": "The number 0.1 is a repeating fraction in binary (like 1/3 in decimal). Float32 truncates it, so the stored value is approximately 0.100000001490116. The accumulated error makes the sum differ from 0.3."
      },
      {
        "stage": "post",
        "question": "In the stable softmax implementation, why do you subtract max(logits) before exponentiating?",
        "options": [
          "It makes the output probabilities more uniform",
          "It prevents exp() from overflowing by ensuring the largest exponent is 0",
          "It converts logits from float16 to float32",
          "It normalizes the logits to have zero mean"
        ],
        "correct": 1,
        "explanation": "After subtracting max(logits), the largest value is 0 and exp(0) = 1, which cannot overflow. All other values are negative, so their exponentials are less than 1. The probabilities are mathematically identical to the naive version."
      },
      {
        "stage": "post",
        "question": "When using centered finite differences for gradient checking, what happens if the step size h is too small (e.g., 1e-15)?",
        "options": [
          "The approximation becomes more accurate",
          "Catastrophic cancellation destroys the result because f(x+h) and f(x-h) are nearly identical",
          "The function evaluation becomes faster",
          "The gradient automatically becomes zero"
        ],
        "correct": 1,
        "explanation": "When h is extremely small, f(x+h) and f(x-h) differ only in their last few significant digits. Subtracting them cancels the leading digits, leaving mostly rounding noise. Typical good values are h = 1e-5 to 1e-7."
      },
      {
        "stage": "post",
        "question": "Why is bfloat16 generally preferred over float16 for neural network training?",
        "options": [
          "bfloat16 has more mantissa bits, giving better precision",
          "bfloat16 has the same exponent range as float32, avoiding overflow on large activations without loss scaling",
          "bfloat16 uses less memory than float16",
          "bfloat16 is supported by more GPU architectures than float16"
        ],
        "correct": 1,
        "explanation": "bfloat16 has 8 exponent bits (same as float32, range up to 3.4e38) while float16 has only 5 exponent bits (max ~65,504). During training, activations and gradients can exceed 65,504, causing float16 overflow. bfloat16 handles this without loss scaling."
      }
    ]
  },
  "01-math-foundations/12-tensor-operations": {
    "questions": [
      {
        "stage": "pre",
        "question": "What does the 'shape' of a tensor describe?",
        "options": [
          "A tuple listing the size along each axis",
          "The total number of elements in the tensor",
          "The data type of the tensor elements",
          "The memory address of the tensor"
        ],
        "correct": 0,
        "explanation": "The shape is a tuple listing the size along each axis. For example, a tensor with shape (2, 3, 4) has 2 elements along axis 0, 3 along axis 1, and 4 along axis 2."
      },
      {
        "stage": "pre",
        "question": "In PyTorch, what layout does an image batch tensor use by default?",
        "options": [
          "NHWC (batch, height, width, channels)",
          "NCHW (batch, channels, height, width)",
          "CHWN (channels, height, width, batch)",
          "WHCN (width, height, channels, batch)"
        ],
        "correct": 1,
        "explanation": "PyTorch defaults to NCHW (channels-first) layout. TensorFlow defaults to NHWC (channels-last). Mismatched layouts cause silent errors or performance issues."
      },
      {
        "stage": "post",
        "question": "What is the result shape when broadcasting tensors of shape (8, 1, 6, 1) and (7, 1, 5)?",
        "options": [
          "(8, 7, 6, 1)",
          "(8, 1, 6, 5)",
          "(8, 7, 6, 5)",
          "Broadcasting fails — shapes are incompatible"
        ],
        "correct": 2,
        "explanation": "Align shapes from the right: (8,1,6,1) and (1,7,1,5). Dimensions are compatible when equal or one is 1. The result takes the maximum along each axis: (8, 7, 6, 5)."
      },
      {
        "stage": "post",
        "question": "In the einsum expression 'bhtd,bhsd->bhts', what happens to the index 'd'?",
        "options": [
          "It is kept in the output as a new axis",
          "It is summed over (contracted) because it appears in both inputs but not the output",
          "It is broadcast across both tensors",
          "It is transposed between the two input tensors"
        ],
        "correct": 1,
        "explanation": "In einsum, any index that appears in the inputs but not the output is summed over. Index 'd' appears in both 'bhtd' and 'bhsd' but not in the output 'bhts', so it is contracted (multiplied and summed)."
      },
      {
        "stage": "post",
        "question": "Why does calling .view() fail on a transposed tensor in PyTorch?",
        "options": [
          "Transposed tensors have a different data type",
          "The tensor is non-contiguous in memory after transpose, and view requires contiguous data",
          "View only works on 2D tensors",
          "Transpose changes the total number of elements"
        ],
        "correct": 1,
        "explanation": "Transpose swaps strides without moving data, making the tensor non-contiguous. The .view() operation requires contiguous memory layout. Use .reshape() or call .contiguous() first."
      }
    ]
  },
  "01-math-foundations/11-singular-value-decomposition": {
    "questions": [
      {
        "stage": "pre",
        "question": "What advantage does SVD have over eigendecomposition?",
        "options": [
          "SVD is always faster to compute",
          "SVD works on any matrix of any shape, while eigendecomposition requires square matrices with full eigenvector sets",
          "SVD produces smaller output matrices",
          "SVD does not require numerical computation"
        ],
        "correct": 1,
        "explanation": "Eigendecomposition only works on square matrices that have n linearly independent eigenvectors. SVD decomposes ANY m x n matrix into U * Sigma * V^T with no restrictions on shape or rank."
      },
      {
        "stage": "pre",
        "question": "What does 'low-rank approximation' mean?",
        "options": [
          "Removing rows with low values from a matrix",
          "Approximating a matrix by keeping only its most important components, producing a simpler matrix with fewer independent directions",
          "Converting a matrix to a lower precision data type",
          "Sorting the rows of a matrix by their magnitude"
        ],
        "correct": 1,
        "explanation": "A rank-k approximation keeps only the top k singular values and their vectors, discarding the rest. The Eckart-Young theorem proves this is the BEST possible approximation of that rank."
      },
      {
        "stage": "post",
        "question": "In SVD A = U * Sigma * V^T, what geometric operation does each factor represent?",
        "options": [
          "U scales, Sigma rotates, V^T translates",
          "V^T rotates in input space, Sigma scales along principal axes, U rotates into output space",
          "U compresses, Sigma expands, V^T normalizes",
          "All three factors perform the same operation: rotation"
        ],
        "correct": 1,
        "explanation": "SVD reveals that every matrix performs: (1) V^T rotates inputs to align with principal directions, (2) Sigma stretches/compresses along each axis, (3) U rotates the result into the output space. Rotate, scale, rotate."
      },
      {
        "stage": "post",
        "question": "Why does sklearn implement PCA using SVD instead of eigendecomposition of the covariance matrix?",
        "options": [
          "SVD produces different results that are more accurate for ML",
          "SVD works directly on the data matrix without forming the covariance matrix, avoiding squaring the condition number and improving numerical stability",
          "SVD is easier to parallelize on GPUs",
          "SVD does not require centering the data"
        ],
        "correct": 1,
        "explanation": "Forming A^T*A squares the singular values (and condition number). If A has singular values [1000, 0.001], A^T*A has eigenvalues [10^6, 10^-6] -- 6 digits of precision lost. SVD avoids this by working directly on A."
      },
      {
        "stage": "post",
        "question": "How does truncated SVD enable recommendation systems to predict missing ratings?",
        "options": [
          "It fills missing entries with the average rating",
          "It decomposes the ratings matrix into latent user and movie profiles; the dot product of a user profile with a movie profile predicts the missing rating",
          "It clusters similar users together and copies their ratings",
          "It trains a neural network on the observed ratings"
        ],
        "correct": 1,
        "explanation": "SVD decomposes the ratings matrix into user profiles (U), latent factor importance (Sigma), and movie profiles (V^T). The low-rank reconstruction fills in missing entries based on the latent factors (genre, era, style) that explain user preferences."
      }
    ]
  },
  "01-math-foundations/10-dimensionality-reduction": {
    "questions": [
      {
        "stage": "pre",
        "question": "What is the 'curse of dimensionality'?",
        "options": [
          "High-dimensional data takes too long to download",
          "As dimensions grow, distances become meaningless, volume concentrates in corners, and you need exponentially more data",
          "Neural networks cannot process data with more than 100 features",
          "High-dimensional data always contains noise"
        ],
        "correct": 1,
        "explanation": "In high dimensions, all pairwise distances converge to similar values, data points spread to corners, and maintaining sample density requires exponentially more data. Dimensionality reduction counteracts these effects."
      },
      {
        "stage": "pre",
        "question": "What does PCA find?",
        "options": [
          "The most important features by name",
          "The orthogonal directions of maximum variance in the data",
          "Clusters of similar data points",
          "The optimal number of features to keep"
        ],
        "correct": 1,
        "explanation": "PCA computes the eigenvectors of the covariance matrix, which are orthogonal directions ranked by how much data variance they capture. The first principal component points along the direction of maximum spread."
      },
      {
        "stage": "post",
        "question": "After running PCA on 784-dimensional MNIST data with k=50 components, you find 95% of variance is captured. What does this tell you?",
        "options": [
          "Only 50 pixels matter in each image",
          "The data effectively lives in a ~50-dimensional subspace; the remaining 734 dimensions are mostly noise or redundancy",
          "95% of images belong to the same class",
          "The model will achieve 95% accuracy"
        ],
        "correct": 1,
        "explanation": "95% explained variance with 50 components means the essential structure of 784-dimensional data is captured by just 50 directions. The rest carries only 5% of the variation -- mostly noise."
      },
      {
        "stage": "post",
        "question": "Why should you NOT use t-SNE as preprocessing before training a classifier?",
        "options": [
          "t-SNE is too slow for large datasets",
          "t-SNE is designed for visualization only: it distorts global distances, is stochastic, and the output coordinates have no consistent meaning across runs",
          "t-SNE reduces data to exactly 2 dimensions which is too few",
          "t-SNE requires the labels to be known in advance"
        ],
        "correct": 1,
        "explanation": "t-SNE preserves local neighborhoods but distorts global structure. Distances between clusters are meaningless, and different runs produce different layouts. Use PCA for preprocessing and t-SNE/UMAP only for visualization."
      },
      {
        "stage": "post",
        "question": "When would you choose kernel PCA over standard PCA?",
        "options": [
          "When you have more samples than features",
          "When the data lies on a nonlinear manifold that standard PCA cannot separate, like concentric circles",
          "When you need the fastest possible computation",
          "When you want interpretable principal components"
        ],
        "correct": 1,
        "explanation": "Standard PCA finds linear subspaces. If data has nonlinear structure (e.g., two concentric rings), PCA projects both onto the same line. Kernel PCA maps data to a higher-dimensional space where the structure becomes linear."
      }
    ]
  },
  "01-math-foundations/09-information-theory": {
    "questions": [
      {
        "stage": "pre",
        "question": "What does 'entropy' measure in information theory?",
        "options": [
          "The energy of a physical system",
          "The average surprise or uncertainty in a probability distribution",
          "The number of bits in a binary message",
          "The error rate of a communication channel"
        ],
        "correct": 1,
        "explanation": "Entropy H(P) = -sum(p(x) * log(p(x))) measures the average amount of surprise across all outcomes. High entropy means high uncertainty (uniform distribution). Low entropy means the outcome is predictable."
      },
      {
        "stage": "pre",
        "question": "What is the cross-entropy loss commonly used for in neural networks?",
        "options": [
          "Regression tasks with continuous outputs",
          "Classification tasks, measuring how far predicted probabilities are from true labels",
          "Generating new data samples",
          "Regularizing model weights to prevent overfitting"
        ],
        "correct": 1,
        "explanation": "Cross-entropy loss H(P,Q) = -sum(p(x)*log(q(x))) measures the difference between the true distribution (labels) and the model's predicted distribution. It is THE standard loss for classification."
      },
      {
        "stage": "post",
        "question": "Why is minimizing cross-entropy equivalent to minimizing KL divergence during training?",
        "options": [
          "Because KL divergence is always zero during training",
          "Because cross-entropy = entropy + KL divergence, and the entropy of the true labels is constant, so minimizing cross-entropy minimizes KL divergence",
          "Because cross-entropy and KL divergence are the same formula",
          "Because the model's entropy equals zero at convergence"
        ],
        "correct": 1,
        "explanation": "H(P,Q) = H(P) + D_KL(P||Q). Since the true distribution P doesn't change during training, H(P) is constant. Minimizing H(P,Q) is the same as minimizing D_KL(P||Q) -- pushing the model toward the true distribution."
      },
      {
        "stage": "post",
        "question": "A language model has perplexity 50 on a test set. What does this mean?",
        "options": [
          "The model makes 50 errors per sentence",
          "On average, the model is as uncertain as if it were choosing uniformly from 50 possible next tokens at each step",
          "The model has 50 layers",
          "The model was trained for 50 epochs"
        ],
        "correct": 1,
        "explanation": "Perplexity = e^(cross-entropy). A perplexity of 50 means the model's uncertainty at each token is equivalent to picking randomly from 50 equally likely options. Lower perplexity means better predictions."
      },
      {
        "stage": "post",
        "question": "How does mutual information differ from Pearson correlation for feature selection?",
        "options": [
          "Mutual information is faster to compute",
          "Mutual information detects any statistical dependency (linear or nonlinear) while correlation only detects linear relationships",
          "Pearson correlation works for any data type while mutual information only works for continuous data",
          "They always give the same feature rankings"
        ],
        "correct": 1,
        "explanation": "Mutual information I(X;Y) captures all statistical dependencies between variables, including nonlinear and non-monotonic ones. Pearson correlation only measures linear association, missing many important relationships."
      }
    ]
  },
  "01-math-foundations/08-optimization": {
    "questions": [
      {
        "stage": "pre",
        "question": "What does 'optimization' mean in the context of training a neural network?",
        "options": [
          "Making the code run faster",
          "Finding the model weights that minimize the loss function",
          "Reducing the number of parameters in the model",
          "Choosing the best hardware for training"
        ],
        "correct": 1,
        "explanation": "Training a neural network IS optimization. The loss function measures how wrong the model is, and optimization finds the weight values that make it as small as possible."
      },
      {
        "stage": "pre",
        "question": "What happens if the learning rate is too large during gradient descent?",
        "options": [
          "Training converges faster to the global minimum",
          "The optimizer overshoots the minimum and the loss diverges (bounces or increases)",
          "The gradients become zero",
          "The model automatically reduces the learning rate"
        ],
        "correct": 1,
        "explanation": "A learning rate that is too large causes each step to overshoot the valley, potentially bouncing between walls or diverging entirely. The loss increases instead of decreasing."
      },
      {
        "stage": "post",
        "question": "How does Adam differ from vanilla gradient descent?",
        "options": [
          "Adam uses a fixed learning rate while GD uses adaptive rates",
          "Adam tracks running averages of gradients and squared gradients to give each weight its own adaptive learning rate",
          "Adam computes exact second derivatives while GD uses first derivatives",
          "Adam processes the full dataset per step while GD uses mini-batches"
        ],
        "correct": 1,
        "explanation": "Adam maintains per-weight first moment (gradient direction) and second moment (gradient magnitude) estimates. Dividing by sqrt(second moment) gives small steps for weights with large gradients and large steps for weights with small gradients."
      },
      {
        "stage": "post",
        "question": "Why is the noise in mini-batch SGD considered beneficial rather than just a nuisance?",
        "options": [
          "Noise reduces memory usage during training",
          "Noise helps the optimizer escape shallow local minima and saddle points that a noiseless optimizer would get stuck in",
          "Noise is not beneficial; it always slows convergence",
          "Noise makes the loss function convex"
        ],
        "correct": 1,
        "explanation": "The stochastic noise from random mini-batches provides random perturbations that can push the optimizer out of shallow local minima and saddle points, leading to better generalization."
      },
      {
        "stage": "post",
        "question": "What does a cosine annealing learning rate schedule do?",
        "options": [
          "Increases the learning rate throughout training following a cosine curve",
          "Starts with a high learning rate and smoothly decreases it following a cosine curve, with optional warmup",
          "Alternates the learning rate between two fixed values",
          "Sets the learning rate to the cosine of the current epoch number"
        ],
        "correct": 1,
        "explanation": "Cosine annealing smoothly reduces the learning rate from lr_max to lr_min following a half-cosine curve. This provides large steps early for fast progress and small steps late for fine convergence."
      }
    ]
  },
  "01-math-foundations/07-bayes-theorem": {
    "questions": [
      {
        "stage": "pre",
        "question": "In Bayes' theorem, what is the 'prior'?",
        "options": [
          "The probability of the evidence",
          "Your belief about a hypothesis before observing any evidence",
          "The probability of the evidence given the hypothesis",
          "The final updated probability after seeing evidence"
        ],
        "correct": 1,
        "explanation": "The prior P(A) represents your initial belief about hypothesis A before seeing any data. It gets updated to the posterior P(A|B) after observing evidence B."
      },
      {
        "stage": "pre",
        "question": "A rare disease affects 1 in 10,000 people. A 99% accurate test returns positive. What is the approximate probability you have the disease?",
        "options": [
          "99%",
          "About 1%",
          "50%",
          "10%"
        ],
        "correct": 1,
        "explanation": "Despite 99% test accuracy, the disease is so rare (0.01%) that most positive results come from healthy people (false positives). Bayes' theorem gives P(sick|positive) = ~0.98%, not 99%."
      },
      {
        "stage": "post",
        "question": "What is Laplace smoothing in a Naive Bayes classifier and why is it necessary?",
        "options": [
          "It normalizes feature values to have zero mean and unit variance",
          "It adds a small count to every feature to prevent zero probabilities from unseen words, which would zero out the entire product",
          "It smooths the decision boundary between classes",
          "It reduces the dimensionality of the feature space"
        ],
        "correct": 1,
        "explanation": "Without smoothing, a word never seen in spam training data gets P(word|spam)=0, making the entire product zero regardless of other strong spam indicators. Adding 1 to each count prevents this."
      },
      {
        "stage": "post",
        "question": "How does MAP (Maximum A Posteriori) estimation differ from MLE (Maximum Likelihood Estimation)?",
        "options": [
          "MAP uses a larger dataset than MLE",
          "MAP incorporates a prior distribution over parameters, equivalent to adding regularization, while MLE only uses the likelihood",
          "MAP is faster to compute than MLE",
          "MLE always produces better results than MAP"
        ],
        "correct": 1,
        "explanation": "MAP maximizes P(data|params) * P(params) while MLE maximizes P(data|params) alone. The prior P(params) acts as regularization -- a Gaussian prior equals L2 regularization, a Laplace prior equals L1."
      },
      {
        "stage": "post",
        "question": "In sequential Bayesian updating, you start with Beta(1,1) and observe 7 heads and 3 tails. What is the posterior?",
        "options": [
          "Beta(7, 3)",
          "Beta(8, 4)",
          "Beta(1.7, 1.3)",
          "Normal(0.7, 0.1)"
        ],
        "correct": 1,
        "explanation": "The Beta-Binomial conjugate update adds successes to the first parameter and failures to the second: Beta(1+7, 1+3) = Beta(8, 4). The posterior mean is 8/12 = 0.667."
      }
    ]
  },
  "01-math-foundations/06-probability-and-distributions": {
    "questions": [
      {
        "stage": "pre",
        "question": "What is the difference between a probability mass function (PMF) and a probability density function (PDF)?",
        "options": [
          "PMFs are used for continuous variables, PDFs for discrete variables",
          "PMFs give exact probabilities for discrete outcomes, while PDFs give densities for continuous variables that must be integrated over an interval to get probability",
          "There is no difference; they are the same concept with different names",
          "PMFs always sum to 0.5, PDFs integrate to 1"
        ],
        "correct": 1,
        "explanation": "For discrete variables, the PMF gives P(X=k) directly. For continuous variables, the PDF f(x) is a density -- P(a<=X<=b) requires integrating f(x) from a to b. The density at a single point is not a probability."
      },
      {
        "stage": "pre",
        "question": "What does the Central Limit Theorem state?",
        "options": [
          "All data follows a normal distribution",
          "The mean of many independent random samples converges to a normal distribution regardless of the source distribution",
          "Large datasets always have low variance",
          "The probability of rare events decreases as sample size increases"
        ],
        "correct": 1,
        "explanation": "The CLT says that the average of many independent random variables approaches a Gaussian, no matter what the original distribution looks like. This explains why the normal distribution appears everywhere."
      },
      {
        "stage": "post",
        "question": "Why does softmax subtract the maximum logit before exponentiating (the 'softmax trick')?",
        "options": [
          "To make all probabilities equal",
          "To prevent numerical overflow from exponentiating large numbers while producing mathematically identical results",
          "To normalize the logits to have mean zero",
          "To speed up the computation by reducing the number of exponentiations"
        ],
        "correct": 1,
        "explanation": "exp(100) overflows to infinity. Subtracting max(logits) shifts all values so the largest is 0. exp(0)=1 is safe. The subtraction cancels out in the normalization, giving identical probabilities."
      },
      {
        "stage": "post",
        "question": "Cross-entropy loss for classification simplifies to -log(q(true_class)). What does this mean intuitively?",
        "options": [
          "Multiply the predicted probabilities by the true labels",
          "Penalize the model based on how low its predicted probability is for the correct class -- lower prediction means higher loss",
          "Average the log probabilities across all classes",
          "Compute the entropy of the true distribution"
        ],
        "correct": 1,
        "explanation": "If the model predicts 0.9 for the correct class, loss = -log(0.9) = 0.105 (low). If it predicts 0.01, loss = -log(0.01) = 4.6 (high). The loss punishes low confidence in the correct answer."
      },
      {
        "stage": "post",
        "question": "Why do language models work with log probabilities instead of raw probabilities?",
        "options": [
          "Log probabilities are easier to interpret visually",
          "Multiplying many small probabilities causes numerical underflow to zero; log probabilities convert products to sums, avoiding this",
          "Log probabilities are required by the transformer architecture",
          "Raw probabilities cannot represent values less than 0.01"
        ],
        "correct": 1,
        "explanation": "P(sentence) = P(word1) * P(word2) * ... quickly underflows to 0.0 with float64. Log P(sentence) = log P(word1) + log P(word2) + ... stays in a finite range. Products become sums."
      }
    ]
  },
  "01-math-foundations/05-chain-rule-and-autodiff": {
    "questions": [
      {
        "stage": "pre",
        "question": "What does the chain rule in calculus state?",
        "options": [
          "The derivative of a sum is the sum of derivatives",
          "The derivative of composed functions is the product of their individual derivatives",
          "The integral of a product is the product of integrals",
          "Functions can only be differentiated if they are linear"
        ],
        "correct": 1,
        "explanation": "For y = f(g(x)), the chain rule says dy/dx = f'(g(x)) * g'(x). You multiply the derivatives at each link in the chain. This is the mathematical basis of backpropagation."
      },
      {
        "stage": "pre",
        "question": "What is a computational graph?",
        "options": [
          "A plot of loss vs training steps",
          "A directed graph where nodes are operations and edges carry values forward or gradients backward",
          "A diagram showing the architecture of a neural network",
          "A graph database used for storing training data"
        ],
        "correct": 1,
        "explanation": "A computational graph represents the sequence of operations in a computation. Data flows forward through the graph, and gradients flow backward during backpropagation."
      },
      {
        "stage": "post",
        "question": "Why does PyTorch use reverse-mode autodiff (backpropagation) instead of forward-mode?",
        "options": [
          "Reverse mode is more numerically accurate",
          "Reverse mode computes all gradients in one backward pass, while forward mode needs one pass per input variable -- neural networks have millions of inputs but one loss output",
          "Reverse mode uses less memory",
          "Forward mode cannot handle non-linear functions"
        ],
        "correct": 1,
        "explanation": "Neural networks have millions of weight inputs but produce a single scalar loss. Reverse mode needs one backward pass total. Forward mode would need one pass per weight -- millions of passes -- making it impractical."
      },
      {
        "stage": "post",
        "question": "In the Value class autograd engine, why does the backward function use '+=' instead of '=' for accumulating gradients?",
        "options": [
          "To average the gradients across multiple samples",
          "Because a value used in multiple operations receives gradient contributions from each one, which must be summed",
          "To prevent numerical overflow in the gradients",
          "Because Python does not support the '=' operator in closures"
        ],
        "correct": 1,
        "explanation": "When a value feeds into multiple operations (e.g., x used in both x*y and x+z), its total gradient is the sum of all incoming gradient contributions. Using '=' would overwrite earlier contributions."
      },
      {
        "stage": "post",
        "question": "What is gradient checking and when should you use it?",
        "options": [
          "Checking that gradients are below a threshold to prevent exploding gradients",
          "Comparing autodiff gradients against numerical finite-difference gradients to verify correctness of the backward pass",
          "Checking that all parameters received non-zero gradients during training",
          "Monitoring gradient magnitudes during training to detect vanishing gradients"
        ],
        "correct": 1,
        "explanation": "Gradient checking computes numerical derivatives via (f(x+h) - f(x-h)) / 2h and compares them to autodiff gradients. Use it when adding new operations to your autograd engine or debugging training failures."
      }
    ]
  },
  "01-math-foundations/04-calculus-for-ml": {
    "questions": [
      {
        "stage": "pre",
        "question": "What does the derivative of a function at a point tell you?",
        "options": [
          "The value of the function at that point",
          "The rate of change (slope) of the function at that point",
          "The area under the function up to that point",
          "The maximum value the function can reach"
        ],
        "correct": 1,
        "explanation": "The derivative f'(x) measures how much the output changes per unit change in input. Geometrically, it is the slope of the tangent line at that point."
      },
      {
        "stage": "pre",
        "question": "What is a gradient in the context of machine learning?",
        "options": [
          "A measure of model accuracy",
          "A vector of all partial derivatives that points in the direction of steepest ascent",
          "The learning rate used during training",
          "The difference between predicted and actual values"
        ],
        "correct": 1,
        "explanation": "The gradient collects every partial derivative into one vector. It points in the direction that increases the function fastest. To minimize loss, you move opposite the gradient."
      },
      {
        "stage": "post",
        "question": "In gradient descent, what does the update rule 'w = w - lr * dL/dw' accomplish?",
        "options": [
          "It increases the loss to test model robustness",
          "It adjusts each weight in the direction that reduces the loss, scaled by the learning rate",
          "It resets the weight to its initial value minus the gradient",
          "It normalizes the weight to have magnitude 1"
        ],
        "correct": 1,
        "explanation": "dL/dw tells you which direction increases the loss. Subtracting it (times the learning rate) moves the weight in the direction that decreases the loss. This is repeated for every weight in the model."
      },
      {
        "stage": "post",
        "question": "Why can't Newton's method (which uses the Hessian matrix) be directly applied to neural networks with millions of parameters?",
        "options": [
          "Newton's method only works for convex functions",
          "The Hessian is an N x N matrix, requiring O(N^2) storage and O(N^3) computation per step, which is intractable for millions of parameters",
          "Newton's method requires analytical derivatives which cannot be computed for neural networks",
          "Newton's method converges too slowly for deep networks"
        ],
        "correct": 1,
        "explanation": "For N=1 million parameters, the Hessian has 1 trillion entries. Computing and inverting it is impossible. This is why we use first-order methods (SGD, Adam) that approximate second-order information cheaply."
      },
      {
        "stage": "post",
        "question": "What is the numerical (central difference) approximation for f'(x)?",
        "options": [
          "f(x+h) / h",
          "(f(x+h) - f(x)) / h",
          "(f(x+h) - f(x-h)) / (2*h)",
          "f(x) * h"
        ],
        "correct": 2,
        "explanation": "The central difference (f(x+h) - f(x-h)) / (2h) is more accurate than the forward difference because it averages the slope on both sides of x, canceling out the leading error term."
      }
    ]
  },
  "01-math-foundations/03-matrix-transformations": {
    "questions": [
      {
        "stage": "pre",
        "question": "What is an eigenvector of a matrix?",
        "options": [
          "The largest row in the matrix",
          "A vector that the matrix only scales (never rotates) when multiplied",
          "A vector perpendicular to all columns of the matrix",
          "The diagonal entries of the matrix expressed as a vector"
        ],
        "correct": 1,
        "explanation": "An eigenvector v satisfies Av = lambda*v, meaning the matrix A only stretches v by the scalar factor lambda (the eigenvalue) without changing its direction."
      },
      {
        "stage": "pre",
        "question": "What does the determinant of a 2D transformation matrix represent geometrically?",
        "options": [
          "The angle of rotation applied by the matrix",
          "The factor by which the matrix scales area",
          "The number of eigenvectors the matrix has",
          "The trace of the matrix"
        ],
        "correct": 1,
        "explanation": "The determinant measures how much the transformation scales area. det=1 preserves area (rotation), det=2 doubles area, det=0 crushes to a lower dimension, and det=-1 preserves area but flips orientation."
      },
      {
        "stage": "post",
        "question": "Why does the order of matrix transformations matter? (i.e., why is R @ S different from S @ R?)",
        "options": [
          "Matrix addition is not commutative",
          "Matrix multiplication is not commutative: rotating then scaling gives a different result than scaling then rotating",
          "The determinants are different for each order",
          "One order produces a larger matrix than the other"
        ],
        "correct": 1,
        "explanation": "Matrix multiplication is not commutative. Rotating (1,0) by 90 degrees then scaling by (2,0.5) gives (0,0.5), but scaling first then rotating gives (0,2). The geometric operations compose differently."
      },
      {
        "stage": "post",
        "question": "In a recurrent neural network, what happens when the weight matrix has eigenvalues with magnitude greater than 1?",
        "options": [
          "The network learns faster",
          "Outputs explode exponentially over time steps (exploding gradient problem)",
          "The network becomes more stable",
          "The eigenvalues converge to 1 over training"
        ],
        "correct": 1,
        "explanation": "Repeated multiplication by a matrix amplifies the eigenvalue directions. Eigenvalues > 1 cause exponential growth (exploding gradients), while eigenvalues < 1 cause exponential decay (vanishing gradients)."
      },
      {
        "stage": "post",
        "question": "The matrix A = [[2, 1], [1, 2]] has eigenvalues 3 and 1. What does eigendecomposition A = V @ D @ V^(-1) reveal?",
        "options": [
          "A is equivalent to two rotations",
          "A stretches space by 3x along the [1,1] direction and leaves the [1,-1] direction unchanged",
          "A compresses all vectors by a factor of 2",
          "A has rank 1 and maps all vectors to a line"
        ],
        "correct": 1,
        "explanation": "The eigenvalue 3 with eigenvector [1,1] means A stretches 3x along the diagonal. The eigenvalue 1 with eigenvector [1,-1] means A leaves the anti-diagonal unchanged. D holds {3,1}, V holds the eigenvectors."
      }
    ]
  },
  "01-math-foundations/02-vectors-matrices-operations": {
    "questions": [
      {
        "stage": "pre",
        "question": "For matrix multiplication (m x n) @ (n x p), what must be true about the dimensions?",
        "options": [
          "m must equal p",
          "The inner dimensions n must match",
          "All dimensions must be equal",
          "m must be greater than p"
        ],
        "correct": 1,
        "explanation": "Matrix multiplication requires the number of columns in the first matrix (n) to equal the number of rows in the second matrix (n). The result has shape (m x p)."
      },
      {
        "stage": "pre",
        "question": "What is the identity matrix?",
        "options": [
          "A matrix of all ones",
          "A square matrix with ones on the diagonal and zeros elsewhere that acts as the multiplicative identity",
          "A matrix where every element is unique",
          "The transpose of any given matrix"
        ],
        "correct": 1,
        "explanation": "The identity matrix I has ones on the diagonal and zeros everywhere else. Multiplying any matrix by I returns the original matrix unchanged, like multiplying a number by 1."
      },
      {
        "stage": "post",
        "question": "What is the key difference between element-wise multiplication and matrix multiplication?",
        "options": [
          "Element-wise is faster while matrix multiplication is more accurate",
          "Element-wise multiplies matching positions (same shape required), matrix multiplication takes dot products of rows and columns (inner dimensions must match)",
          "They produce the same result but use different notation",
          "Element-wise only works on vectors while matrix multiplication works on matrices"
        ],
        "correct": 1,
        "explanation": "Element-wise (Hadamard) product multiplies corresponding elements and requires identical shapes. Matrix multiplication computes dot products between rows and columns with the rule (m,n)@(n,p)=(m,p)."
      },
      {
        "stage": "post",
        "question": "In the expression 'output = relu(W @ x + b)', what role does broadcasting play?",
        "options": [
          "It broadcasts the computation across multiple GPUs",
          "It automatically stretches the bias vector b to match the shape of W @ x so they can be added",
          "It converts the data types of W and x to match",
          "It repeats the relu activation across all elements"
        ],
        "correct": 1,
        "explanation": "W @ x produces a column vector, and b is also a vector. Broadcasting stretches b across the batch dimension if needed, allowing element-wise addition without explicit shape matching."
      },
      {
        "stage": "post",
        "question": "What does a determinant of zero for a matrix indicate?",
        "options": [
          "The matrix has all zero entries",
          "The matrix is singular: it crushes at least one dimension, cannot be inverted, and has no unique solution",
          "The matrix is the identity matrix",
          "The matrix performs a rotation"
        ],
        "correct": 1,
        "explanation": "A zero determinant means the transformation collapses space by at least one dimension (e.g., mapping 2D to a line). The matrix has no inverse, and linear systems using it have either no solution or infinitely many."
      }
    ]
  },
  "01-math-foundations/01-linear-algebra-intuition": {
    "questions": [
      {
        "stage": "pre",
        "question": "What does the dot product of two vectors measure?",
        "options": [
          "The distance between the two vectors",
          "How similar or aligned the two vectors are",
          "The angle between the vectors in degrees",
          "The number of dimensions the vectors share"
        ],
        "correct": 1,
        "explanation": "The dot product measures alignment: positive means same direction (similar), zero means perpendicular (unrelated), negative means opposite direction (dissimilar). This is the basis of similarity search in AI."
      },
      {
        "stage": "pre",
        "question": "In AI, what does 'embedding' refer to?",
        "options": [
          "Inserting one model inside another",
          "A vector representation that captures the meaning of something (word, image, user)",
          "A technique for compressing model weights",
          "The process of converting code to machine instructions"
        ],
        "correct": 1,
        "explanation": "An embedding maps discrete objects (words, images, users) to continuous vectors in a high-dimensional space where similar items are close together. It is the bridge between real-world concepts and mathematical operations."
      },
      {
        "stage": "post",
        "question": "Three vectors v1=[1,0,0], v2=[0,1,0], v3=[2,1,0] are given. Are they linearly independent?",
        "options": [
          "Yes, because there are three vectors in 3D space",
          "No, because v3 = 2*v1 + v2, so v3 is a linear combination of the others",
          "Yes, because none of the vectors are identical",
          "No, because they all have a zero component"
        ],
        "correct": 1,
        "explanation": "v3 = 2*v1 + v2, making the set linearly dependent. All three vectors lie in the xy-plane and cannot reach [0,0,1]. Despite having 3 vectors in 3D, they only span a 2D subspace."
      },
      {
        "stage": "post",
        "question": "What does the rank of a matrix tell you in the context of machine learning?",
        "options": [
          "How fast the matrix can be multiplied",
          "The number of linearly independent columns, indicating how many dimensions of useful information it contains",
          "The maximum value in the matrix",
          "The number of non-zero entries in the matrix"
        ],
        "correct": 1,
        "explanation": "Rank equals the number of linearly independent columns. In ML, a rank-deficient feature matrix means redundant features, infinitely many weight solutions, and the need for regularization."
      },
      {
        "stage": "post",
        "question": "How does LoRA (Low-Rank Adaptation) use linear algebra to efficiently fine-tune large language models?",
        "options": [
          "It removes unused rows from weight matrices to shrink the model",
          "It decomposes weight updates into two small low-rank matrices instead of updating the full weight matrix",
          "It converts all weights from float32 to int8",
          "It freezes the embedding layer and only trains the output head"
        ],
        "correct": 1,
        "explanation": "LoRA decomposes a 4096x4096 weight update into two matrices of size 4096x16 and 16x4096 (rank-16), reducing trainable parameters from 16M to 131K by assuming updates live in a low-dimensional subspace."
      }
    ]
  },
  "00-setup-and-tooling/12-debugging-and-profiling": {
    "questions": [
      {
        "stage": "pre",
        "question": "What makes debugging AI/ML code fundamentally different from debugging a typical web application?",
        "options": [
          "AI code uses different programming languages",
          "AI bugs often don't crash -- they silently produce incorrect results with no error messages",
          "AI code cannot be debugged with standard tools like print statements",
          "AI code always requires a GPU to debug"
        ],
        "correct": 1,
        "explanation": "The worst AI bugs produce valid-looking output. A misconfigured training loop might run for hours without errors while the model learns nothing useful, unlike web apps that crash with stack traces."
      },
      {
        "stage": "pre",
        "question": "What does a profiler measure?",
        "options": [
          "Whether the code produces correct output",
          "How much time and memory each part of the code consumes",
          "How many bugs exist in the codebase",
          "The code coverage of unit tests"
        ],
        "correct": 1,
        "explanation": "Profilers measure resource consumption -- execution time per function, memory allocation, and GPU utilization -- helping you find bottlenecks and optimize performance."
      },
      {
        "stage": "post",
        "question": "Your model achieves 99% accuracy on the test set. What AI-specific bug should you suspect first?",
        "options": [
          "The model has too many parameters",
          "Data leakage -- test samples may have leaked into the training set",
          "The learning rate is too high",
          "The batch size is too large"
        ],
        "correct": 1,
        "explanation": "Suspiciously high accuracy often indicates data leakage -- overlap between training and test data, or features that contain the target label. Always check for train/test overlap."
      },
      {
        "stage": "post",
        "question": "What is the most common finding when profiling a training loop's time breakdown?",
        "options": [
          "The backward pass takes 90% of the time",
          "Data loading takes more time than the forward and backward passes combined",
          "Writing logs takes the most time",
          "GPU memory allocation is the bottleneck"
        ],
        "correct": 1,
        "explanation": "Data loading often takes 60%+ of training time when num_workers=0 in the DataLoader. The fix is setting num_workers > 0 to load data in parallel with GPU computation."
      },
      {
        "stage": "post",
        "question": "You see NaN loss at step 500. Which approach will help you find the root cause?",
        "options": [
          "Restart training from scratch with a different random seed",
          "Use detect_nan to check for NaN/Inf in gradients and add breakpoint() at the failure point",
          "Increase the batch size to stabilize gradients",
          "Switch from Adam to SGD optimizer"
        ],
        "correct": 1,
        "explanation": "First identify WHERE the NaN originates by checking gradients for each parameter. A conditional breakpoint at the NaN step lets you inspect tensor values interactively. Common causes: learning rate too high, log(0), or division by zero."
      }
    ]
  },
  "00-setup-and-tooling/11-linux-for-ai": {
    "questions": [
      {
        "stage": "pre",
        "question": "What does the '~' symbol represent in a Linux file path?",
        "options": [
          "The root directory of the file system",
          "The current user's home directory",
          "The temporary files directory",
          "The directory where system programs are installed"
        ],
        "correct": 1,
        "explanation": "The tilde (~) is a shortcut for the current user's home directory, typically /home/username on Linux. 'cd ~' takes you home from anywhere."
      },
      {
        "stage": "pre",
        "question": "What is the purpose of 'sudo' before a command?",
        "options": [
          "It speeds up the command execution",
          "It runs the command with root (administrator) privileges",
          "It runs the command in a sandboxed environment",
          "It logs the command output to a system file"
        ],
        "correct": 1,
        "explanation": "sudo (superuser do) temporarily elevates your privileges to root level for a single command. Required for system-level operations like installing packages with apt."
      },
      {
        "stage": "post",
        "question": "You get 'Permission denied' when trying to run a shell script. What command fixes this?",
        "options": [
          "sudo rm script.sh",
          "chmod +x script.sh",
          "chown root script.sh",
          "mv script.sh /usr/bin/"
        ],
        "correct": 1,
        "explanation": "chmod +x adds execute permission to the file. Without the execute bit set, the shell refuses to run the script even if you own it."
      },
      {
        "stage": "post",
        "question": "On a remote GPU box, your training data fills the disk. Which command shows the largest directories consuming space?",
        "options": [
          "ls -la /",
          "du -h --max-depth=1 / | sort -hr | head -20",
          "cat /proc/meminfo",
          "free -h"
        ],
        "correct": 1,
        "explanation": "du -h shows disk usage per directory, --max-depth=1 limits to top-level directories, and sort -hr sorts by size in descending order. This reveals which directories are consuming the most space."
      },
      {
        "stage": "post",
        "question": "What is a key difference between the macOS and Linux versions of 'sed -i'?",
        "options": [
          "Linux sed is faster than macOS sed",
          "macOS sed requires an empty string argument after -i ('sed -i \"\"'), while Linux does not",
          "Linux sed does not support regular expressions",
          "macOS sed cannot modify files in place"
        ],
        "correct": 1,
        "explanation": "macOS uses BSD sed which requires 'sed -i \"\" pattern file', while Linux uses GNU sed which accepts 'sed -i pattern file'. This is a common gotcha when moving scripts between systems."
      }
    ]
  },
  "00-setup-and-tooling/10-terminal-and-shell": {
    "questions": [
      {
        "stage": "pre",
        "question": "What does the pipe operator '|' do in a shell command?",
        "options": [
          "Runs two commands in parallel",
          "Sends the standard output of one command as standard input to the next",
          "Saves the output of a command to a file",
          "Combines two files into one"
        ],
        "correct": 1,
        "explanation": "The pipe operator connects commands in a pipeline. For example, 'cat log.txt | grep error' sends the contents of log.txt as input to grep, which filters for lines containing 'error'."
      },
      {
        "stage": "pre",
        "question": "What happens to a running process when you close the terminal that started it?",
        "options": [
          "The process continues running in the background",
          "The process receives a hangup signal (SIGHUP) and typically terminates",
          "The process pauses until you open a new terminal",
          "The process automatically migrates to a system service"
        ],
        "correct": 1,
        "explanation": "Closing the terminal sends SIGHUP to child processes, which causes them to terminate by default. Tools like tmux, nohup, or screen prevent this."
      },
      {
        "stage": "post",
        "question": "What is the key advantage of tmux over using 'nohup command &' for long-running training jobs?",
        "options": [
          "tmux uses less CPU than nohup",
          "tmux lets you detach, reattach, and see live output with multiple panes",
          "tmux automatically restarts failed processes",
          "tmux compresses the process output to save disk space"
        ],
        "correct": 1,
        "explanation": "tmux creates persistent sessions you can detach from and reattach to later, with live output visible in multiple panes. nohup only logs to a file with no way to interact or reattach."
      },
      {
        "stage": "post",
        "question": "What does 'python train.py > output.log 2>&1' accomplish?",
        "options": [
          "Runs train.py and saves only errors to output.log",
          "Runs train.py and redirects both standard output and standard error to output.log",
          "Runs train.py twice and logs the second run",
          "Runs train.py with double the memory allocation"
        ],
        "correct": 1,
        "explanation": "'> output.log' redirects stdout to the file. '2>&1' sends stderr to the same place as stdout. The result is both normal output and errors captured in one file."
      },
      {
        "stage": "post",
        "question": "Which command lets you access a remote Jupyter notebook running on port 8888 of a GPU box from your local browser?",
        "options": [
          "scp -P 8888 user@gpu-box:~/notebook.ipynb",
          "ssh -L 8888:localhost:8888 user@gpu-box",
          "rsync -avz user@gpu-box:8888 localhost:8888",
          "ssh user@gpu-box --forward-port 8888"
        ],
        "correct": 1,
        "explanation": "SSH local port forwarding (-L) maps a remote port to your local machine. After this command, opening localhost:8888 in your browser accesses the remote Jupyter server."
      }
    ]
  },
  "00-setup-and-tooling/09-data-management": {
    "questions": [
      {
        "stage": "pre",
        "question": "Why is it important to have separate train, validation, and test splits in machine learning?",
        "options": [
          "To make the dataset smaller so training is faster",
          "To evaluate model performance on unseen data and prevent overfitting",
          "To ensure each split uses a different file format",
          "To distribute data across multiple GPUs"
        ],
        "correct": 1,
        "explanation": "The training set teaches the model, the validation set tunes hyperparameters during training, and the test set provides a final unbiased evaluation on data the model has never seen."
      },
      {
        "stage": "pre",
        "question": "What is the Hugging Face Hub primarily used for in AI/ML workflows?",
        "options": [
          "Hosting and sharing datasets, models, and ML artifacts",
          "Running GPU training jobs in the cloud",
          "Managing Python virtual environments",
          "Version controlling source code like GitHub"
        ],
        "correct": 0,
        "explanation": "Hugging Face Hub is a platform for hosting and sharing pre-trained models, datasets, and ML demos. The 'datasets' library provides a standard way to load data from it."
      },
      {
        "stage": "post",
        "question": "What advantage does the Parquet format have over CSV for storing ML datasets?",
        "options": [
          "Parquet files are human-readable in any text editor",
          "Parquet uses columnar storage for smaller file sizes and faster read speeds",
          "Parquet supports more data types than CSV",
          "Parquet files can be edited in spreadsheet applications"
        ],
        "correct": 1,
        "explanation": "Parquet is a columnar binary format that compresses better than CSV and enables fast column-level reads. It is the preferred storage format for ML datasets."
      },
      {
        "stage": "post",
        "question": "What does 'streaming=True' do when loading a dataset with the Hugging Face datasets library?",
        "options": [
          "Downloads the dataset faster using parallel connections",
          "Loads data row by row without downloading the full dataset to disk",
          "Converts the dataset to a streaming video format",
          "Enables real-time updates as new data is added to the Hub"
        ],
        "correct": 1,
        "explanation": "Streaming mode creates an IterableDataset that fetches rows on demand. Memory usage stays constant regardless of dataset size, which is essential for datasets too large to fit on disk."
      },
      {
        "stage": "post",
        "question": "When should you use DVC (Data Version Control) instead of just .gitignore for large files?",
        "options": [
          "When your dataset is smaller than 1 MB",
          "When you need to reproduce exact experiments across machines with versioned data",
          "When you are working alone on a personal project",
          "When you only have CSV files in your project"
        ],
        "correct": 1,
        "explanation": "DVC tracks data versions with small pointer files in git while storing the actual data in remote storage (S3, GCS). It ensures anyone can reproduce your exact experiment with the same data."
      }
    ]
  },
  "00-setup-and-tooling/08-editor-setup": {
    "questions": [
      {
        "stage": "pre",
        "question": "What is a Language Server Protocol (LSP)?",
        "options": [
          "A protocol for transferring files between editors",
          "A standard for editors to receive type info, completions, and diagnostics from a language-specific server",
          "A compression format for source code files",
          "A network protocol for remote pair programming"
        ],
        "correct": 1,
        "explanation": "LSP is a standardized protocol that lets editors communicate with language servers for features like autocomplete, type checking, and error diagnostics, regardless of the editor used."
      },
      {
        "stage": "pre",
        "question": "Why is format-on-save useful for team projects?",
        "options": [
          "It reduces file sizes by removing whitespace",
          "It ensures consistent code style across all contributors without manual formatting",
          "It catches runtime bugs before the code is executed",
          "It compresses the code for faster git operations"
        ],
        "correct": 1,
        "explanation": "Format-on-save runs a formatter (like Black or Ruff) every time you save, ensuring all code follows the same style conventions regardless of who wrote it."
      },
      {
        "stage": "post",
        "question": "Which VS Code extension enables editing code on a remote GPU machine as if it were local?",
        "options": [
          "GitLens",
          "Pylance",
          "Remote SSH",
          "Debugpy"
        ],
        "correct": 2,
        "explanation": "Remote SSH installs a lightweight VS Code server on the remote machine and streams the UI to your local editor, letting you edit files, run terminals, and debug remotely."
      },
      {
        "stage": "post",
        "question": "Why should 'notebook.output.scrolling' be enabled in VS Code settings for AI work?",
        "options": [
          "It enables horizontal scrolling for wide dataframes",
          "It prevents training loop output (thousands of lines) from exploding the output panel",
          "It allows scrolling between notebook cells with the mouse wheel",
          "It enables smooth scrolling animations in the editor"
        ],
        "correct": 1,
        "explanation": "Training loops can print thousands of lines of output. Without output scrolling, the notebook output panel grows unbounded, making the notebook unusable."
      },
      {
        "stage": "post",
        "question": "What does setting 'python.analysis.typeCheckingMode' to 'basic' in VS Code accomplish?",
        "options": [
          "It enables syntax highlighting for Python files",
          "It catches wrong argument types and tensor shape mismatches before running the code",
          "It formats Python code according to PEP 8 standards",
          "It enables Python 3.12 language features"
        ],
        "correct": 1,
        "explanation": "Basic type checking with Pylance flags type mismatches, wrong argument types, and incorrect API parameters at edit time, catching bugs before you run a potentially expensive training script."
      }
    ]
  },
  "00-setup-and-tooling/07-docker-for-ai": {
    "questions": [
      {
        "stage": "pre",
        "question": "What is the primary difference between a Docker container and a virtual machine?",
        "options": [
          "Containers are slower but more secure than VMs",
          "Containers share the host OS kernel while VMs run their own full OS",
          "Containers can only run Linux while VMs support any OS",
          "There is no practical difference"
        ],
        "correct": 1,
        "explanation": "Containers share the host kernel and isolate at the process level, making them start in seconds. VMs run a complete guest OS with its own kernel, requiring more resources and slower startup."
      },
      {
        "stage": "pre",
        "question": "What is a Dockerfile?",
        "options": [
          "A configuration file for the Docker daemon",
          "A set of instructions for building a Docker image layer by layer",
          "A log file that records container activity",
          "A file that lists running containers"
        ],
        "correct": 1,
        "explanation": "A Dockerfile contains sequential instructions (FROM, RUN, COPY, etc.) that Docker executes to build an image. Each instruction creates a cached layer."
      },
      {
        "stage": "post",
        "question": "Why are volume mounts critical for AI development with Docker?",
        "options": [
          "Volumes make containers run faster by using host disk speed",
          "Volumes persist data (models, datasets, code) across container rebuilds so you don't re-download gigabytes each time",
          "Volumes are required for Python packages to install correctly",
          "Volumes allow multiple containers to share the same GPU"
        ],
        "correct": 1,
        "explanation": "Without volumes, everything inside a container is lost when it stops. Volume mounts map host directories into the container, so model weights (14+ GB) and datasets survive rebuilds."
      },
      {
        "stage": "post",
        "question": "What does the NVIDIA Container Toolkit enable?",
        "options": [
          "Installing CUDA drivers inside the container",
          "Exposing host GPUs to Docker containers via the --gpus flag",
          "Running NVIDIA GPU containers on AMD hardware",
          "Compiling CUDA code during the Docker build process"
        ],
        "correct": 1,
        "explanation": "The NVIDIA Container Toolkit is a runtime hook that exposes host GPUs to containers. The CUDA toolkit lives inside the container, but the GPU driver is shared from the host."
      },
      {
        "stage": "post",
        "question": "In a Docker Compose file for AI, how does the 'ai-dev' service reach the 'qdrant' vector database?",
        "options": [
          "By using the host machine's IP address and port",
          "By using the service name 'qdrant' as the hostname, since Compose creates a shared network",
          "By mounting a shared volume between the two containers",
          "By configuring a VPN between the containers"
        ],
        "correct": 1,
        "explanation": "Docker Compose automatically creates a shared network where services can reach each other by name. The ai-dev container connects to 'http://qdrant:6333' using the service name as hostname."
      }
    ]
  },
  "00-setup-and-tooling/06-python-environments": {
    "questions": [
      {
        "stage": "pre",
        "question": "What problem do virtual environments solve?",
        "options": [
          "They make Python code run faster by optimizing the interpreter",
          "They isolate project dependencies so different projects can use different package versions",
          "They provide a graphical interface for managing Python scripts",
          "They automatically update packages to the latest versions"
        ],
        "correct": 1,
        "explanation": "Virtual environments give each project its own isolated set of packages. Without them, installing PyTorch 2.4 for one project would overwrite PyTorch 2.1 needed by another."
      },
      {
        "stage": "pre",
        "question": "What is a lockfile in the context of Python dependency management?",
        "options": [
          "A file that prevents other users from editing your code",
          "A file that pins every package to an exact version for reproducible installs",
          "A file that locks the Python interpreter version",
          "A file that encrypts your project dependencies"
        ],
        "correct": 1,
        "explanation": "A lockfile records the exact version of every package (including transitive dependencies) so anyone installing from it gets identical packages, ensuring reproducibility."
      },
      {
        "stage": "post",
        "question": "How can you verify that your pip and python commands are using the virtual environment and not the system Python?",
        "options": [
          "Run 'pip --version' and check the version number",
          "Run 'which python' and confirm it shows .venv/bin/python, not /usr/bin/python",
          "Check if the terminal background color has changed",
          "Run 'python --check-env' to verify"
        ],
        "correct": 1,
        "explanation": "'which python' (or 'where python' on Windows) shows the full path to the interpreter. If it points to .venv/bin/python, you are in the virtual environment."
      },
      {
        "stage": "post",
        "question": "Why is mixing pip and conda in the same environment problematic?",
        "options": [
          "Pip packages are incompatible with conda's Python interpreter",
          "Pip installs can break conda's dependency tracking, causing hard-to-debug conflicts",
          "Conda cannot install packages that pip has already installed",
          "It doubles the disk space used by every package"
        ],
        "correct": 1,
        "explanation": "Conda maintains its own dependency solver. Pip installs bypass it, so conda no longer knows the true state of the environment. This leads to dependency conflicts that are painful to resolve."
      },
      {
        "stage": "post",
        "question": "Your PyTorch code reports 'CUDA not available' despite having an NVIDIA GPU. What is the most likely cause?",
        "options": [
          "Your GPU does not support CUDA",
          "PyTorch was installed with a CUDA version incompatible with your GPU driver",
          "You forgot to import the torch.cuda module",
          "Virtual environments cannot access GPU hardware"
        ],
        "correct": 1,
        "explanation": "PyTorch ships CUDA bindings compiled for specific CUDA versions. If the PyTorch CUDA version exceeds your driver's CUDA version, CUDA will not be available. Check with nvidia-smi and torch.version.cuda."
      }
    ]
  },
  "00-setup-and-tooling/05-jupyter-notebooks": {
    "questions": [
      {
        "stage": "pre",
        "question": "What is a Jupyter notebook?",
        "options": [
          "A text editor for writing Python scripts",
          "An interactive document that mixes executable code cells with markdown text and inline outputs",
          "A version control system for data science projects",
          "A package manager for Python libraries"
        ],
        "correct": 1,
        "explanation": "A Jupyter notebook (.ipynb) is an interactive environment where you can write and execute code in cells, see outputs inline, and mix code with formatted text explanations."
      },
      {
        "stage": "pre",
        "question": "What does the Jupyter kernel do?",
        "options": [
          "Formats markdown cells into HTML",
          "Runs the code in cells and keeps variables in memory between executions",
          "Manages file storage for the notebook",
          "Connects the notebook to GitHub for version control"
        ],
        "correct": 1,
        "explanation": "The kernel is a separate Python process that executes cell code and maintains state (variables, imports) in memory. All cells in a notebook share the same kernel."
      },
      {
        "stage": "post",
        "question": "What is the difference between %timeit and %%time magic commands?",
        "options": [
          "%timeit measures wall time, %%time measures CPU time",
          "%timeit runs code many times and averages, %%time runs code once",
          "%timeit works on single lines, %%time works on the whole notebook",
          "There is no difference, they are aliases"
        ],
        "correct": 1,
        "explanation": "%timeit runs the statement many times for a statistical average (good for microbenchmarks). %%time runs the cell once and reports wall time (good for training runs)."
      },
      {
        "stage": "post",
        "question": "What is the most common cause of a notebook working on your machine but failing when someone runs it top to bottom?",
        "options": [
          "Using a different Python version",
          "Out-of-order cell execution creating hidden dependencies on execution order",
          "Missing the %matplotlib inline magic command",
          "Using too many markdown cells"
        ],
        "correct": 1,
        "explanation": "Running cells out of order creates hidden state dependencies. A variable might exist because you ran cell 5 before cell 2. Kernel > Restart & Run All verifies linear execution."
      },
      {
        "stage": "post",
        "question": "When should you move code from a notebook into a .py script?",
        "options": [
          "As soon as you write more than 10 lines of code",
          "When the code is a reusable utility, training pipeline, or production code",
          "Never -- notebooks are always better for AI work",
          "Only when you need to run on a GPU"
        ],
        "correct": 1,
        "explanation": "The rule is 'explore in notebooks, ship in scripts.' Reusable utilities, training pipelines, and anything running in production should be .py files. Notebooks are for exploration and prototyping."
      }
    ]
  },
  "00-setup-and-tooling/04-apis-and-keys": {
    "questions": [
      {
        "stage": "pre",
        "question": "What is an API key used for when calling an LLM service?",
        "options": [
          "Encrypting the data sent to the server",
          "Authenticating your identity and authorizing requests",
          "Compressing requests to reduce bandwidth",
          "Selecting which programming language the server uses"
        ],
        "correct": 1,
        "explanation": "An API key is a unique string that identifies your account, authorizes your requests, and allows the provider to track usage and billing."
      },
      {
        "stage": "pre",
        "question": "Why should API keys never be hardcoded directly in source code?",
        "options": [
          "Hardcoded keys make the code run slower",
          "They can be accidentally committed to git and exposed publicly",
          "Python cannot read string literals longer than 50 characters",
          "API providers block keys that appear in source files"
        ],
        "correct": 1,
        "explanation": "Hardcoded keys in source code risk being committed to version control and pushed to public repositories, where they can be scraped and abused by others."
      },
      {
        "stage": "post",
        "question": "What is the recommended way to store API keys for local development?",
        "options": [
          "In a Python variable at the top of your script",
          "In a .env file that is listed in .gitignore",
          "In the README.md for easy access",
          "In the requirements.txt alongside package versions"
        ],
        "correct": 1,
        "explanation": "A .env file stores keys as environment variables and should be added to .gitignore so it is never committed to version control. SDKs read keys from environment variables automatically."
      },
      {
        "stage": "post",
        "question": "In the raw HTTP API call to Anthropic, which header carries the API key?",
        "options": [
          "Authorization: Bearer sk-ant-...",
          "x-api-key: sk-ant-...",
          "Content-Type: application/json",
          "anthropic-version: 2023-06-01"
        ],
        "correct": 1,
        "explanation": "Anthropic's API uses the 'x-api-key' header for authentication, not the more common 'Authorization: Bearer' pattern. This is specific to their API design."
      },
      {
        "stage": "post",
        "question": "What happens when you exceed an API's rate limit?",
        "options": [
          "Your API key is permanently revoked",
          "The server returns an error (typically HTTP 429) and you must wait before retrying",
          "Your request is queued and processed later automatically",
          "The API silently drops your request with no response"
        ],
        "correct": 1,
        "explanation": "Rate limiting returns HTTP 429 (Too Many Requests). You need to wait and retry, typically with exponential backoff. Rate limits prevent abuse and ensure fair usage."
      }
    ]
  },
  "00-setup-and-tooling/03-gpu-setup-and-cloud": {
    "questions": [
      {
        "stage": "pre",
        "question": "Why is a GPU faster than a CPU for training neural networks?",
        "options": [
          "GPUs have higher clock speeds than CPUs",
          "GPUs can perform thousands of parallel matrix operations simultaneously",
          "GPUs have more RAM than CPUs",
          "GPUs use a more efficient programming language"
        ],
        "correct": 1,
        "explanation": "GPUs have thousands of cores optimized for parallel computation, making them ideal for the matrix multiplications that dominate neural network training."
      },
      {
        "stage": "pre",
        "question": "What does VRAM refer to?",
        "options": [
          "Virtual RAM used by the operating system for swap space",
          "Video RAM on the GPU, separate from system RAM",
          "The total RAM available across all devices",
          "A type of CPU cache memory"
        ],
        "correct": 1,
        "explanation": "VRAM (Video RAM) is the dedicated memory on a GPU. It limits the size of models and batch sizes you can use during training, separate from your system's main RAM."
      },
      {
        "stage": "post",
        "question": "What command verifies that your NVIDIA GPU is detected and shows its current status?",
        "options": [
          "gpu --status",
          "nvidia-smi",
          "torch.cuda.list_devices()",
          "lspci | grep gpu"
        ],
        "correct": 1,
        "explanation": "nvidia-smi (NVIDIA System Management Interface) displays GPU utilization, memory usage, temperature, and running processes. It is the standard tool for verifying GPU availability."
      },
      {
        "stage": "post",
        "question": "When benchmarking GPU vs CPU matrix multiplication, why must you call torch.cuda.synchronize() before measuring GPU time?",
        "options": [
          "To transfer data from CPU to GPU memory",
          "To ensure all GPU operations have completed before stopping the timer",
          "To reset the GPU clock speed to its base frequency",
          "To free unused GPU memory"
        ],
        "correct": 1,
        "explanation": "GPU operations are asynchronous -- Python returns immediately while the GPU is still computing. synchronize() blocks until all GPU operations finish, giving accurate timing."
      },
      {
        "stage": "post",
        "question": "Using the fp16 rule of thumb, approximately how many parameters can fit in 24 GB of VRAM?",
        "options": [
          "24 billion parameters",
          "12 billion parameters",
          "6 billion parameters",
          "48 billion parameters"
        ],
        "correct": 1,
        "explanation": "In fp16, each parameter uses 2 bytes. 24 GB / 2 bytes = 12 billion parameters. This is a rough estimate; actual usage includes activations, gradients, and optimizer states."
      }
    ]
  },
  "00-setup-and-tooling/02-git-and-collaboration": {
    "questions": [
      {
        "stage": "pre",
        "question": "What does 'version control' primarily help you do?",
        "options": [
          "Speed up code execution",
          "Track changes to files over time and collaborate with others",
          "Compress files to save disk space",
          "Automatically fix bugs in your code"
        ],
        "correct": 1,
        "explanation": "Version control systems like git track every change made to files, allowing you to revert to previous states and collaborate with others on the same codebase."
      },
      {
        "stage": "pre",
        "question": "What is a 'repository' in the context of software development?",
        "options": [
          "A cloud storage service like Google Drive",
          "A collection of files and their complete change history managed by version control",
          "A database for storing user data",
          "A package manager for installing libraries"
        ],
        "correct": 1,
        "explanation": "A repository (repo) is a directory tracked by git that contains all project files along with the full history of changes made to those files."
      },
      {
        "stage": "post",
        "question": "What is the correct sequence for saving and backing up your work in git?",
        "options": [
          "git push, git add, git commit",
          "git commit, git add, git push",
          "git add, git commit, git push",
          "git clone, git add, git push"
        ],
        "correct": 2,
        "explanation": "First you stage changes with 'git add', then save a snapshot with 'git commit', then upload to the remote with 'git push'. This is the daily workflow."
      },
      {
        "stage": "post",
        "question": "What does 'git checkout -b experiment/new-optimizer' do?",
        "options": [
          "Downloads a branch from GitHub called experiment/new-optimizer",
          "Creates a new branch named experiment/new-optimizer and switches to it",
          "Deletes the branch experiment/new-optimizer",
          "Reverts all files to match the experiment/new-optimizer branch"
        ],
        "correct": 1,
        "explanation": "The '-b' flag creates a new branch with the given name and immediately switches to it, allowing you to experiment without affecting the main branch."
      },
      {
        "stage": "post",
        "question": "Why should you add '.pt', '.pth', and '.safetensors' to your .gitignore?",
        "options": [
          "They are Python test files that should not be committed",
          "They are model checkpoint files that are too large for git and can be re-generated",
          "They contain sensitive API keys",
          "Git cannot track binary files of any kind"
        ],
        "correct": 1,
        "explanation": "Model checkpoint files (.pt, .pth, .safetensors) are often gigabytes in size. Git is not designed for large binary files, so these should be excluded and re-generated or stored separately."
      }
    ]
  },
  "00-setup-and-tooling/01-dev-environment": {
    "questions": [
      {
        "stage": "pre",
        "question": "Why do AI projects need a separate virtual environment?",
        "options": [
          "Virtual environments make code run faster",
          "They isolate dependencies so different projects don't conflict",
          "Python requires virtual environments to import packages",
          "Virtual environments provide GPU access"
        ],
        "correct": 1,
        "explanation": "Virtual environments isolate package versions per project. Without them, upgrading PyTorch for one project can break another that depends on an older version."
      },
      {
        "stage": "pre",
        "question": "What does CUDA provide for AI workloads?",
        "options": [
          "A Python package manager for ML libraries",
          "A web framework for deploying models",
          "Parallel computing on NVIDIA GPUs for matrix operations",
          "A container runtime for model serving"
        ],
        "correct": 2,
        "explanation": "CUDA is NVIDIA's parallel computing platform that lets you run matrix operations on thousands of GPU cores simultaneously. PyTorch and TensorFlow use it under the hood."
      },
      {
        "stage": "post",
        "question": "In the four-layer environment stack, which layer must be installed first?",
        "options": [
          "AI/ML Libraries (PyTorch, JAX)",
          "Package Managers (pip, npm, cargo)",
          "Language Runtimes (Python, Node.js)",
          "System Foundation (OS, shell, GPU drivers)"
        ],
        "correct": 3,
        "explanation": "You install bottom-up: system foundation first (OS, drivers), then package managers, then language runtimes, then AI libraries. Each layer depends on the one below."
      },
      {
        "stage": "post",
        "question": "What is the purpose of uv in a Python AI project?",
        "options": [
          "A GPU monitoring tool",
          "An ultra-fast Python package installer and resolver",
          "A neural network visualization library",
          "A CUDA compiler for custom kernels"
        ],
        "correct": 1,
        "explanation": "uv is a fast Python package installer written in Rust. It replaces pip with much faster dependency resolution and installation, often 10-100x faster."
      },
      {
        "stage": "post",
        "question": "How do you verify that PyTorch can access your GPU?",
        "options": [
          "import torch; print(torch.__version__)",
          "nvidia-smi --query",
          "import torch; print(torch.cuda.is_available())",
          "python -c 'import gpu'"
        ],
        "correct": 2,
        "explanation": "torch.cuda.is_available() returns True if PyTorch can access CUDA GPUs. On Apple Silicon, use torch.backends.mps.is_available() for Metal Performance Shaders."
      }
    ]
  }
};

export function getQuizContent(lessonPath: string): QuizData | undefined {
  return quizContent[lessonPath];
}
