/**
 * LLM utility — wraps Google Gemini SDK for streaming AI responses.
 *
 * Strategy:
 *  1. Primary model: gemini-2.0-flash-lite  (30 RPM free tier)
 *  2. Fallback model: gemini-2.0-flash      (15 RPM free tier)
 *  3. Circuit breaker: after any 429, block ALL requests for CIRCUIT_OPEN_MS (60 s)
 *  4. MIN_REQUEST_GAP: enforced between sequential calls
 *  5. No retry loop — a 429 opens the circuit immediately (retrying just wastes quota)
 */

import { GoogleGenAI } from '@google/genai';

declare const process: { env: { GEMINI_API_KEY: string } };

// ── Config ────────────────────────────────────────────────────────────────────
const MODELS: string[] = [
  'gemini-2.0-flash',       // 15 RPM
  'gemini-1.5-flash',       // 15 RPM — fallback
];
const CIRCUIT_OPEN_MS  = 60_000; // 60 s — full Gemini rate-limit window
const MIN_REQUEST_GAP  = 4_500;  // 4.5 s — safe for 15 RPM (= 4 s/req gap)

// ── State ─────────────────────────────────────────────────────────────────────
let ai: GoogleGenAI | null       = null;
let abortController: AbortController | null = null;
let lastRequestAt   = 0;

// Circuit breaker & Locks
let circuitOpenUntil = 0;  // timestamp when circuit closes again
let modelIndex       = 0;  // which model we're currently using
let isRequestInFlight = false; // prevents ANY concurrent API overlapping

// ── Helpers ───────────────────────────────────────────────────────────────────
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isRateLimitError(err: unknown): boolean {
  if (err instanceof Error) {
    return (
      err.message.includes('429') ||
      err.message.toLowerCase().includes('too many requests')
    );
  }
  return false;
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Returns ms until circuit closes, or 0 if open (ready). */
export function getRateLimitStatus(): { blocked: boolean; remainingMs: number } {
  const remaining = Math.max(0, circuitOpenUntil - Date.now());
  return { blocked: remaining > 0, remainingMs: remaining };
}

export async function initLlm(): Promise<void> {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
}

export async function askLlm(
  prompt: string,
  onPartial: (text: string) => void
): Promise<void> {
  if (isRequestInFlight) {
    throw new Error("Another AI request is already processing. Please wait.");
  }
  
  if (!ai) await initLlm();
  abortController = new AbortController();

  // ── Circuit breaker check ──
  const { blocked, remainingMs } = getRateLimitStatus();
  if (blocked) {
    const secs = Math.ceil(remainingMs / 1000);
    throw new Error(`Rate limited. Please wait ${secs}s before trying again.`);
  }

  // ── Minimum request gap (race-condition safe) ──
  isRequestInFlight = true;
  let waitMs = 0;
  const now = Date.now();
  if (now - lastRequestAt < MIN_REQUEST_GAP) {
    waitMs = MIN_REQUEST_GAP - (now - lastRequestAt);
    lastRequestAt = now + waitMs;
  } else {
    lastRequestAt = now;
  }

  if (waitMs > 0) {
    await sleep(waitMs);
  }

  if (abortController.signal.aborted) {
    isRequestInFlight = false;
    return;
  }

  // ── Try current model, then cascade to next ──
  const model = MODELS[modelIndex] ?? MODELS[MODELS.length - 1];

  try {
    console.debug(`[llm] sending request via ${model}`);

    const response = await ai!.models.generateContentStream({
      model,
      contents: prompt,
    });

    for await (const chunk of response) {
      if (abortController.signal.aborted) break;
      const text = chunk.text;
      if (text) onPartial(text);
    }

    // Success — reset to fastest model for next call
    modelIndex = 0;

  } catch (err) {
    // Auto-cascade to next model on ANY API error (404, 429, 500)
    if (modelIndex < MODELS.length - 1) {
      console.warn(`[llm] ${model} failed: ${err instanceof Error ? err.message : err} — cascading to ${MODELS[modelIndex + 1]}`);
      modelIndex++;
      
      if (isRateLimitError(err)) {
        circuitOpenUntil = Date.now() + 5000; // Small penalty before fallback
      }
      
      throw new Error(`Model ${model} failed. Auto-switched to fallback model. Please try again.`);
    }

    if (isRateLimitError(err)) {
      circuitOpenUntil = Date.now() + CIRCUIT_OPEN_MS;
      throw new Error('AI is busy (rate limited). Please wait ~60s and try again.');
    }

    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`AI request failed: ${msg}`);
  } finally {
    isRequestInFlight = false;
  }
}
export async function stopLlm(): Promise<void> {
  abortController?.abort();
  abortController = null;
  isRequestInFlight = false;
}
