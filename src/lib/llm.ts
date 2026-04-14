/**
 * LLM utility — wraps Google Gemini SDK for streaming AI responses.
 * Used by SharePromptSheet for AI Hint generation.
 */

import { GoogleGenAI } from '@google/genai';

declare const process: { env: { GEMINI_API_KEY: string } };

let ai: GoogleGenAI | null = null;
let abortController: AbortController | null = null;

export async function initLlm(): Promise<void> {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
}

export async function askLlm(
  prompt: string,
  onPartial: (text: string) => void
): Promise<void> {
  if (!ai) await initLlm();
  abortController = new AbortController();

  const response = await ai!.models.generateContentStream({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });

  for await (const chunk of response) {
    if (abortController.signal.aborted) break;
    const text = chunk.text;
    if (text) onPartial(text);
  }
}

export async function stopLlm(): Promise<void> {
  abortController?.abort();
  abortController = null;
}
