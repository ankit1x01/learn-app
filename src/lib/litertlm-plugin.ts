import { Capacitor, registerPlugin } from '@capacitor/core';

export interface NativeModel {
  id: string;
  displayName: string;
  version: string;
  fileName: string;
  path: string;
  sizeBytes: number;
  type: 'litertlm' | 'task';
}

interface LlmPluginInterface {
  checkStoragePermission(): Promise<{ granted: boolean }>;
  requestStoragePermission(): Promise<{ opened: boolean; alreadyGranted?: boolean }>;
  scanModels(): Promise<{ models: NativeModel[] }>;
  initialize(options: { path: string }): Promise<{ status: string }>;
  chat(options: { input: string }): Promise<{ status: string }>;
  resetConversation(): Promise<{ status: string }>;
  stopResponse(): Promise<{ status: string }>;
  cleanUp(): Promise<{ status: string }>;
  addListener(event: 'llmToken', handler: (data: { token: string; done: boolean }) => void): Promise<{ remove: () => void }>;
  removeAllListeners(): Promise<void>;
}

const LlmPlugin = registerPlugin<LlmPluginInterface>('LlmPlugin');

export const isNativeAndroid = () => Capacitor.getPlatform() === 'android';

export async function checkStoragePermission(): Promise<boolean> {
  try {
    const { granted } = await LlmPlugin.checkStoragePermission();
    return granted;
  } catch {
    return false;
  }
}

export async function requestStoragePermission(): Promise<void> {
  await LlmPlugin.requestStoragePermission();
}

export async function scanNativeModels(): Promise<NativeModel[]> {
  try {
    const { models } = await LlmPlugin.scanModels();
    return models;
  } catch {
    return [];
  }
}

export async function initializeNativeModel(path: string): Promise<void> {
  const result = await LlmPlugin.initialize({ path });
  if (result.status !== 'ready') {
    throw new Error(`Initialize returned: ${result.status}`);
  }
}

export async function chatNative(
  input: string,
  onToken: (token: string, done: boolean) => void,
): Promise<void> {
  const listener = await LlmPlugin.addListener('llmToken', ({ token, done }) => {
    onToken(token, done);
  });

  try {
    await LlmPlugin.chat({ input });
  } finally {
    await listener.remove();
  }
}

export async function stopNativeResponse(): Promise<void> {
  await LlmPlugin.stopResponse();
}

export async function resetNativeConversation(): Promise<void> {
  await LlmPlugin.resetConversation();
}

export async function cleanUpNativeEngine(): Promise<void> {
  await LlmPlugin.cleanUp();
}

export function formatModelSize(bytes: number): string {
  const gb = bytes / 1_073_741_824;
  if (gb >= 1) return `${gb.toFixed(1)} GB`;
  const mb = bytes / 1_048_576;
  return `${Math.round(mb)} MB`;
}
