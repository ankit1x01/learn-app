export interface VoxCPMVoice {
  id: string;
  name: string;
  kind?: string;
}

export async function fetchVoxCPMVoices(_apiKey?: string): Promise<VoxCPMVoice[]> {
  return [];
}
