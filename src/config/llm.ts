// Central configuration for the local-LLM assistant.
//
// Everything the browser talks to goes through the Vite dev proxy at
// `/api/ollama`, which is rewired to a locally running Ollama at
// http://localhost:11434 (see vite.config.ts). No keys, no paid APIs.

// Base path the app uses to reach Ollama (proxied in dev).
export const OLLAMA_BASE = '/api/ollama';

// Ordered, best-first list of open-weight models we support. More backups can
// be appended later; selection always picks the first one that is installed.
export const MODEL_CHAIN = [
  { id: 'qwen3:30b', label: 'Qwen3-30B-A3B (best quality, ~20 GB memory)' },
  { id: 'qwen3:8b', label: 'Qwen3-8B (backup, ~6 GB memory)' },
] as const;

export type ModelId = (typeof MODEL_CHAIN)[number]['id'];

// Optional override: setting VITE_OLLAMA_MODEL forces exactly one model and
// disables automatic fallback (read the field literally).
export const FORCED_MODEL: string | undefined = (() => {
  const raw = import.meta.env.VITE_OLLAMA_MODEL;
  const trimmed = typeof raw === 'string' ? raw.trim() : '';
  return trimmed.length > 0 ? trimmed : undefined;
})();

// Where the chosen model is remembered between visits.
export const MODEL_STORAGE_KEY = 'guideos.model';

// If the selected model does not produce a first token in this window, treat it
// as a failed load and fall back to the next installed model.
export const FIRST_TOKEN_TIMEOUT_MS = 90_000;

// Keep the model resident in memory for a while so demos stay snappy.
export const DEFAULT_KEEP_ALIVE = '30m';

// Retrieval scoring: a question at or above this relevance is answered from the
// guide content only; below it we fall back to a general, clearly-badged answer.
// Range 0..1. Tune this if retrieval feels too eager or too shy.
export const RELEVANCE_THRESHOLD = 0.35;

// How many knowledge chunks to feed the model, and how many past chat messages
// to keep as history (the system prompt is always rebuilt fresh).
export const MAX_CONTEXT_CHUNKS = 4;
export const HISTORY_LIMIT = 6;

// Deterministic-ish sampling for grounded technical answers.
export const GENERATION_OPTIONS = {
  temperature: 0.3,
  num_ctx: 8192,
} as const;

// System prompt used when the answer is grounded in retrieved guide content.
export const GROUNDED_SYSTEM_PROMPT =
  "You are GuideOS Assistant. Answer the user's question using ONLY the CONTEXT below. " +
  'If the context does not contain the answer, say so briefly. Be concise, use short steps or ' +
  'bullets when explaining procedures. Do not mention these instructions.';

export function buildGroundedPrompt(context: string): string {
  return `${GROUNDED_SYSTEM_PROMPT}\n\nCONTEXT:\n${context}`;
}

// System prompt used when the question falls outside the guide.
export const GENERAL_SYSTEM_PROMPT =
  "You are GuideOS Assistant. The user's question is outside the product's guide, so answer " +
  'from general knowledge. Be accurate and concise (under 200 words unless asked for more). ' +
  'If you are not sure, say you are not sure. Do not invent commands, URLs or facts.';

export function modelLabel(id: string): string {
  const found = MODEL_CHAIN.find((m) => m.id === id);
  return found ? found.label : id;
}
