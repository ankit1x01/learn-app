import type { TTSProviderId } from '@/lib/audio/types';

export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  persona: string;
  avatar: string;
  color: string;
  allowedActions: string[];
  priority: number;
  voiceConfig?: { providerId: TTSProviderId; modelId?: string; voiceId: string };
  createdAt: Date;
  updatedAt: Date;
  isDefault: boolean;
  isGenerated?: boolean;
  boundStageId?: string;
}

export interface AgentTemplate {
  name: string;
  role: string;
  persona: string;
  avatar: string;
  color: string;
  allowedActions: string[];
  priority: number;
  voiceConfig?: { providerId: TTSProviderId; modelId?: string; voiceId: string };
  isGenerated?: boolean;
  boundStageId?: string;
}

export function createAgentFromTemplate(template: AgentTemplate, id: string): AgentConfig {
  return {
    ...template,
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDefault: false,
  };
}

export const WHITEBOARD_ACTIONS = ['wb_draw_text', 'wb_draw_shape', 'wb_clear'];
export const SLIDE_ACTIONS = ['slide_next', 'slide_prev', 'slide_goto'];
export const ROLE_ACTIONS: Record<string, string[]> = {
  teacher: [...WHITEBOARD_ACTIONS, ...SLIDE_ACTIONS],
  student: ['checkpoint_answer'],
};

export function getActionsForRole(role: string): string[] {
  return ROLE_ACTIONS[role] ?? [];
}

export interface AgentInfo {
  id: string;
  name: string;
  role: string;
}

export interface Participant {
  id: string;
  name: string;
  type: 'agent' | 'user';
}
