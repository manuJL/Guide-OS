// Thin client over a locally running Ollama, reached through the Vite proxy.
//
// Responsibilities:
//   - health check: list installed models and pick one from MODEL_CHAIN
//   - warm up the chosen model so the first demo question is fast
//   - stream `/api/chat` responses as tokens (NDJSON)
//   - fall back to the next installed model once if the first fails to load
//
// No `any`, no dependencies, no secrets.

import {
  OLLAMA_BASE,
  MODEL_CHAIN,
  FORCED_MODEL,
  MODEL_STORAGE_KEY,
  FIRST_TOKEN_TIMEOUT_MS,
  DEFAULT_KEEP_ALIVE,
  GENERATION_OPTIONS,
  modelLabel,
} from '../config/llm';

export interface LlmMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export type HealthStatus = 'ok' | 'ollama-down' | 'model-missing';

export interface ModelStatus {
  id: string;
  label: string;
  installed: boolean;
}

export interface HealthResult {
  status: HealthStatus;
  message: string;
  installedModels: string[];
  chain: ModelStatus[];
  selectedModel: string | null;
}

// ===== Errors =====

export class OllamaError extends Error {
  readonly status: HealthStatus;
  constructor(status: HealthStatus, message: string) {
    super(message);
    this.name = 'OllamaError';
    this.status = status;
  }
}

type AttemptReason = 'memory' | 'timeout' | 'http' | 'network';

class AttemptError extends Error {
  readonly eligible: boolean;
  readonly reason: AttemptReason;
  readonly status: HealthStatus;
  constructor(reason: AttemptReason, eligible: boolean, status: HealthStatus, message: string) {
    super(message);
    this.name = 'AttemptError';
    this.reason = reason;
    this.eligible = eligible;
    this.status = status;
  }
}

function isAbortError(err: unknown): boolean {
  return err instanceof DOMException
    ? err.name === 'AbortError'
    : err instanceof Error && err.name === 'AbortError';
}

// ===== Ollama /api/tags shapes =====

interface OllamaTagModel {
  name?: string;
  model?: string;
}

interface OllamaTagsResponse {
  models?: OllamaTagModel[];
}

interface OllamaChatChunk {
  message?: { role?: string; content?: string };
  response?: string;
  error?: string;
}

// ===== Model selection helpers =====

export function isInstalled(id: string, installed: string[]): boolean {
  const hasTag = id.includes(':');
  return installed.some((name) => {
    if (name === id) return true;
    if (!hasTag && name.split(':')[0] === id) return true;
    return false;
  });
}

export function loadSavedModel(): string | null {
  try {
    return window.localStorage.getItem(MODEL_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveModel(id: string): void {
  try {
    window.localStorage.setItem(MODEL_STORAGE_KEY, id);
  } catch {
    // storage unavailable — fine, selection just won't persist
  }
}

function buildChainStatus(installed: string[]): ModelStatus[] {
  const chain: ModelStatus[] = MODEL_CHAIN.map((m) => ({
    id: m.id,
    label: m.label,
    installed: isInstalled(m.id, installed),
  }));
  if (FORCED_MODEL && !chain.some((m) => m.id === FORCED_MODEL)) {
    chain.unshift({
      id: FORCED_MODEL,
      label: `${FORCED_MODEL} (forced via VITE_OLLAMA_MODEL)`,
      installed: isInstalled(FORCED_MODEL, installed),
    });
  }
  return chain;
}

function resolveSelection(installed: string[]): string | null {
  if (FORCED_MODEL) return FORCED_MODEL;
  const saved = loadSavedModel();
  if (saved && isInstalled(saved, installed)) return saved;
  const first = MODEL_CHAIN.find((m) => isInstalled(m.id, installed));
  return first ? first.id : null;
}

// ===== Tags =====

interface TagsResult {
  running: boolean;
  installed: string[];
}

async function fetchTags(signal?: AbortSignal): Promise<TagsResult> {
  let res: Response;
  try {
    res = await fetch(`${OLLAMA_BASE}/api/tags`, { signal });
  } catch {
    return { running: false, installed: [] };
  }
  if (!res.ok) return { running: false, installed: [] };
  try {
    const data = (await res.json()) as OllamaTagsResponse;
    const installed = (data.models ?? [])
      .map((m) => (m.name ?? m.model ?? '').trim())
      .filter((name) => name.length > 0);
    return { running: true, installed };
  } catch {
    return { running: false, installed: [] };
  }
}

export async function listInstalledModels(signal?: AbortSignal): Promise<string[]> {
  return (await fetchTags(signal)).installed;
}

// ===== Health check =====

export async function healthCheck(signal?: AbortSignal): Promise<HealthResult> {
  const { running, installed } = await fetchTags(signal);
  const chain = buildChainStatus(installed);

  if (!running) {
    return {
      status: 'ollama-down',
      message: 'Ollama is not running',
      installedModels: installed,
      chain,
      selectedModel: null,
    };
  }

  const selected = resolveSelection(installed);
  if (!selected) {
    return {
      status: 'model-missing',
      message: buildPullMessage(),
      installedModels: installed,
      chain,
      selectedModel: null,
    };
  }

  return {
    status: 'ok',
    message: '',
    installedModels: installed,
    chain,
    selectedModel: selected,
  };
}

function buildPullMessage(): string {
  const commands = MODEL_CHAIN.map((m) => `ollama pull ${m.id}`).join('\n');
  return `No supported model is installed. Run:\n${commands}\n\nUse the smaller model if you have under 24 GB RAM/VRAM.`;
}

// ===== Warm up =====

// Nudge the model into memory so the first real question is not slow.
export async function warmUp(model: string, signal?: AbortSignal): Promise<void> {
  try {
    await fetch(`${OLLAMA_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: 'hi' }],
        stream: false,
        think: false,
        options: { num_predict: 1 },
        keep_alive: DEFAULT_KEEP_ALIVE,
      }),
      signal,
    });
  } catch {
    // warming up is best-effort; real errors surface on the first question
  }
}

// ===== Streaming =====

export interface ChatParams {
  messages: LlmMessage[];
  model: string;
  installed: string[];
  onModelChange?: (model: string) => void;
  onNotice?: (notice: string) => void;
  signal?: AbortSignal;
}

// The models worth trying for this message, best-first. Forced model means one
// attempt only. Otherwise we allow exactly one fallback hop.
function buildCandidates(model: string, installed: string[]): string[] {
  if (FORCED_MODEL) return [model];
  const chainIds: string[] = MODEL_CHAIN.map((m) => m.id).filter((id) => isInstalled(id, installed));
  const start = chainIds.indexOf(model);
  const ordered = start >= 0 ? [model, ...chainIds.slice(start + 1)] : [model, ...chainIds];
  return ordered.slice(0, 2);
}

// Qwen3 may emit  thinking… reasoning blocks. We ask Ollama not to with
// `think: false`, but strip them defensively if any slip through. Built from
// pieces so the literal tags never get mangled.
const THINK_OPEN = '<' + 'think>';
const THINK_CLOSE = '<' + '/think>';

function stripThink(text: string): string {
  let out = '';
  let rest = text;
  for (;;) {
    const start = rest.indexOf(THINK_OPEN);
    if (start === -1) {
      out += rest;
      return out;
    }
    out += rest.slice(0, start);
    const end = rest.indexOf(THINK_CLOSE, start);
    if (end === -1) return out; // unclosed think block: drop the tail
    rest = rest.slice(end + THINK_CLOSE.length);
  }
}

function parseChunk(line: string): string {
  try {
    const json = JSON.parse(line) as OllamaChatChunk;
    if (typeof json.error === 'string' && json.error) return '';
    if (json.message && typeof json.message.content === 'string') return json.message.content;
    if (typeof json.response === 'string') return json.response;
    return '';
  } catch {
    return '';
  }
}

async function* attemptStream(
  messages: LlmMessage[],
  model: string,
  signal?: AbortSignal,
): AsyncGenerator<string, void, unknown> {
  const controller = new AbortController();
  const abortFromOutside = () => controller.abort();
  signal?.addEventListener('abort', abortFromOutside);

  let timedOut = false;
  let gotFirstToken = false;
  const timer = setTimeout(() => {
    if (!gotFirstToken) {
      timedOut = true;
      controller.abort();
    }
  }, FIRST_TOKEN_TIMEOUT_MS);

  try {
    let res: Response;
    try {
      res = await fetch(`${OLLAMA_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages,
          stream: true,
          think: false,
          options: GENERATION_OPTIONS,
          keep_alive: DEFAULT_KEEP_ALIVE,
        }),
        signal: controller.signal,
      });
    } catch (err) {
      if (signal?.aborted) throw err;
      if (timedOut) {
        throw new AttemptError('timeout', true, 'ollama-down', `${model} did not start responding in time.`);
      }
      throw new AttemptError('network', false, 'ollama-down', 'Ollama is not running');
    }

    if (!res.ok || !res.body) {
      const text = await res.text().catch(() => '');
      if (res.status === 404) {
        throw new AttemptError('http', false, 'model-missing', `Model not found - run: ollama pull ${model}`);
      }
      const lower = text.toLowerCase();
      const memory =
        lower.includes('requires more system memory') ||
        lower.includes('unable to load model') ||
        lower.includes('out of memory');
      if (memory) {
        throw new AttemptError('memory', true, 'ollama-down', `${model} could not be loaded (not enough memory).`);
      }
      throw new AttemptError('http', false, 'ollama-down', text || `Ollama returned an error (${res.status}).`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let raw = '';
    let emitted = '';

    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newline = buffer.indexOf('\n');
        while (newline !== -1) {
          const line = buffer.slice(0, newline).trim();
          buffer = buffer.slice(newline + 1);
          newline = buffer.indexOf('\n');
          if (!line) continue;

          const token = parseChunk(line);
          if (!token) continue;
          if (!gotFirstToken) {
            gotFirstToken = true;
            clearTimeout(timer);
          }
          raw += token;
          const cleaned = stripThink(raw);
          if (cleaned.length > emitted.length) {
            const delta = cleaned.slice(emitted.length);
            emitted = cleaned;
            yield delta;
          }
        }
      }
    } catch (err) {
      if (signal?.aborted) throw err;
      if (timedOut) {
        throw new AttemptError('timeout', true, 'ollama-down', `${model} did not start responding in time.`);
      }
      throw err;
    } finally {
      reader.releaseLock();
    }
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', abortFromOutside);
  }
}

export async function* streamChat(params: ChatParams): AsyncGenerator<string, void, unknown> {
  const { messages, model, installed, onModelChange, onNotice, signal } = params;
  const candidates = buildCandidates(model, installed);

  for (let i = 0; i < candidates.length; i += 1) {
    const candidate = candidates[i];
    let produced = false;

    try {
      for await (const delta of attemptStream(messages, candidate, signal)) {
        produced = true;
        yield delta;
      }
      return;
    } catch (err) {
      // User pressed Stop — end quietly, keep whatever streamed so far.
      if (signal?.aborted || isAbortError(err)) return;

      const isEligible =
        err instanceof AttemptError && err.eligible && !produced && i + 1 < candidates.length;

      if (isEligible) {
        const next = candidates[i + 1];
        onModelChange?.(next);
        onNotice?.(
          `Switched to ${modelLabel(next)} because this machine could not run ${modelLabel(candidate)}.`,
        );
        continue;
      }

      if (err instanceof AttemptError) {
        throw new OllamaError(err.status, err.message);
      }
      throw err instanceof OllamaError
        ? err
        : new OllamaError('ollama-down', 'Something went wrong talking to Ollama.');
    }
  }
}
