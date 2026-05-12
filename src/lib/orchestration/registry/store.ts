import { create } from 'zustand';
import type { AgentConfig, AgentInfo, Participant } from './types';

interface AgentRegistryState {
  agents: Record<string, AgentConfig>;
  addAgent: (agent: AgentConfig) => void;
  updateAgent: (id: string, updates: Partial<AgentConfig>) => void;
  deleteAgent: (id: string) => void;
  getAgent: (id: string) => AgentConfig | undefined;
  listAgents: () => AgentConfig[];
}

export const useAgentRegistry = create<AgentRegistryState>((set, get) => ({
  agents: {},
  addAgent: (agent) => set((s) => ({ agents: { ...s.agents, [agent.id]: agent } })),
  updateAgent: (id, updates) =>
    set((s) => ({
      agents: { ...s.agents, [id]: { ...s.agents[id], ...updates, updatedAt: new Date() } },
    })),
  deleteAgent: (id) =>
    set((s) => {
      const agents = { ...s.agents };
      delete agents[id];
      return { agents };
    }),
  getAgent: (id) => get().agents[id],
  listAgents: () => Object.values(get().agents),
}));

export function getDefaultAgents(): AgentInfo[] {
  return [
    { id: 'teacher', name: 'Teacher', role: 'teacher' },
    { id: 'student', name: 'Student', role: 'student' },
  ];
}

export function agentsToParticipants(agentIds: string[], _t?: (key: string) => string): Participant[] {
  return agentIds.map((id) => ({ id, name: id, type: 'agent' as const }));
}

export async function loadGeneratedAgentsForStage(_stageId: string): Promise<string[]> {
  return [];
}

export async function saveGeneratedAgents(_stageId: string, _agents: AgentConfig[]): Promise<string[]> {
  return [];
}
