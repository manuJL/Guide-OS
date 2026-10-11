import React, { useCallback, useEffect, useRef, useState } from 'react';
import { retrieve } from '../lib/knowledge';
import {
  streamChat,
  healthCheck,
  warmUp,
  saveModel,
  OllamaError,
  type HealthResult,
  type LlmMessage,
} from '../lib/llm';
import {
  RELEVANCE_THRESHOLD,
  HISTORY_LIMIT,
  buildGroundedPrompt,
  GENERAL_SYSTEM_PROMPT,
} from '../config/llm';

interface SourceRef {
  id: string;
  title: string;
  source: string;
}

interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  mode?: 'grounded' | 'general';
  sources?: SourceRef[];
  streaming?: boolean;
  stopped?: boolean;
  error?: boolean;
  notice?: string;
}

let seq = 0;
function nextId(): string {
  seq += 1;
  return `a-${seq}-${Date.now()}`;
}

export default function AssistantChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);
  const [health, setHealth] = useState<HealthResult | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const endRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const refreshHealth = useCallback(async () => {
    setChecking(true);
    const result = await healthCheck();
    setHealth(result);
    if (result.selectedModel) {
      setSelectedModel(result.selectedModel);
      saveModel(result.selectedModel);
      if (result.status === 'ok') void warmUp(result.selectedModel);
    }
    setChecking(false);
  }, []);

  // Check for Ollama and pick a model as soon as the app loads.
  useEffect(() => {
    void refreshHealth();
  }, [refreshHealth]);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const handleModelChange = useCallback((id: string) => {
    setSelectedModel(id);
    saveModel(id);
    void warmUp(id);
  }, []);

  const handleCopy = useCallback(async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1500);
    } catch {
      // clipboard unavailable — nothing to do
    }
  }, []);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput('');

    const userMsg: AssistantMessage = { id: nextId(), role: 'user', text };

    if (!selectedModel) {
      setMessages((prev) => [
        ...prev,
        userMsg,
        {
          id: nextId(),
          role: 'assistant',
          text: 'No model is available yet. Install one with: ollama pull qwen3:8b',
          error: true,
        },
      ]);
      return;
    }

    setBusy(true);

    // Route: grounded if the guide clearly covers the question, else general.
    const { chunks, relevance } = retrieve(text);
    const grounded = chunks.length > 0 && relevance >= RELEVANCE_THRESHOLD;
    const context = chunks.map((chunk, index) => `[${index + 1}] ${chunk.title}\n${chunk.text}`).join('\n\n');
    const systemPrompt = grounded ? buildGroundedPrompt(context) : GENERAL_SYSTEM_PROMPT;

    const history: LlmMessage[] = [...messages, userMsg]
      .slice(-HISTORY_LIMIT)
      .map((msg) => ({ role: msg.role, content: msg.text }));
    const llmMessages: LlmMessage[] = [{ role: 'system', content: systemPrompt }, ...history];

    const assistantId = nextId();
    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        id: assistantId,
        role: 'assistant',
        text: '',
        mode: grounded ? 'grounded' : 'general',
        sources: grounded
          ? chunks.map((chunk) => ({ id: chunk.id, title: chunk.title, source: chunk.source }))
          : undefined,
        streaming: true,
      },
    ]);

    const controller = new AbortController();
    abortRef.current = controller;
    let accumulated = '';

    try {
      for await (const delta of streamChat({
        messages: llmMessages,
        model: selectedModel,
        installed: health?.installedModels ?? [],
        onModelChange: (model) => {
          setSelectedModel(model);
          saveModel(model);
        },
        onNotice: (notice) => {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === assistantId ? { ...msg, notice } : msg)),
          );
        },
        signal: controller.signal,
      })) {
        accumulated += delta;
        setMessages((prev) =>
          prev.map((msg) => (msg.id === assistantId ? { ...msg, text: accumulated } : msg)),
        );
      }

      if (!accumulated.trim()) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, text: '(The model returned an empty response.)', error: true }
              : msg,
          ),
        );
      }
    } catch (err) {
      if (controller.signal.aborted) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === assistantId ? { ...msg, streaming: false, stopped: true } : msg)),
        );
      } else {
        const message = err instanceof OllamaError ? err.message : 'Could not reach Ollama.';
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, text: message, streaming: false, error: true } : msg,
          ),
        );
        void refreshHealth();
      }
    } finally {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === assistantId ? { ...msg, streaming: false } : msg)),
      );
      abortRef.current = null;
      setBusy(false);
    }
  }, [input, busy, messages, selectedModel, health, refreshHealth]);

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  if (!open) {
    return (
      <button className="assistant-fab" onClick={() => setOpen(true)} aria-label="Open the AI assistant">
        <span className="assistant-fab-icon">✦</span>
        <span className="assistant-fab-label">Ask AI</span>
      </button>
    );
  }

  return (
    <aside className="assistant-panel" role="dialog" aria-label="GuideOS Assistant">
      <header className="assistant-header">
        <div className="assistant-title-wrap">
          <span className="assistant-title">GuideOS Assistant</span>
          <span className="assistant-subtitle">
            {selectedModel ? `Model: ${selectedModel}` : checking ? 'Checking for Ollama…' : 'No model selected'}
          </span>
        </div>
        <div className="assistant-header-actions">
          <select
            className="assistant-model-select"
            value={selectedModel ?? ''}
            onChange={(e) => handleModelChange(e.target.value)}
            disabled={busy}
            title="Active model"
          >
            {!selectedModel && <option value="">—</option>}
            {(health?.chain ?? []).map((model) => (
              <option key={model.id} value={model.id} disabled={!model.installed}>
                {model.id}
                {model.installed ? '' : ' (not installed)'}
              </option>
            ))}
          </select>
          <button
            className="assistant-icon-btn"
            onClick={() => setMessages([])}
            disabled={messages.length === 0 || busy}
            title="Clear chat"
          >
            Clear
          </button>
          <button className="assistant-icon-btn" onClick={() => setOpen(false)} title="Close">
            ✕
          </button>
        </div>
      </header>

      {health && health.status !== 'ok' && (
        <div className={`assistant-banner ${health.status}`}>
          <div className="assistant-banner-title">
            {health.status === 'ollama-down'
              ? 'Ollama is not running'
              : 'No supported model is installed'}
          </div>
          <pre className="assistant-banner-cmds">
            {health.status === 'ollama-down'
              ? 'curl -fsSL https://ollama.com/install.sh | sh\nollama serve'
              : health.message}
          </pre>
          <button className="assistant-banner-retry" onClick={() => void refreshHealth()} disabled={checking}>
            {checking ? 'Checking…' : 'Retry'}
          </button>
        </div>
      )}

      <div className="assistant-messages">
        {messages.length === 0 && (
          <div className="assistant-empty">
            Ask about anything in the guide — sending a photo, alarms, Wi-Fi — or anything else.
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`assistant-msg ${msg.role}`}>
            {msg.role === 'assistant' && msg.mode === 'general' && (
              <div className="assistant-badge">Outside the guide - general AI answer</div>
            )}
            <div className={`assistant-bubble${msg.error ? ' error' : ''}`}>
              {msg.text}
              {msg.streaming && <span className="assistant-caret" />}
            </div>
            {msg.stopped && <div className="assistant-note">Stopped</div>}
            {msg.notice && <div className="assistant-note">{msg.notice}</div>}
            {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
              <div className="assistant-sources">
                <span className="assistant-sources-label">Sources</span>
                <ul>
                  {msg.sources.map((source) => (
                    <li key={source.id}>
                      <span className="assistant-source-title">{source.title}</span>
                      <span className="assistant-source-file">{source.source}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {msg.role === 'assistant' && !msg.streaming && msg.text.length > 0 && (
              <button className="assistant-copy" onClick={() => void handleCopy(msg.id, msg.text)}>
                {copiedId === msg.id ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="assistant-input-row">
        <textarea
          className="assistant-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question…  (Enter to send, Shift+Enter for a new line)"
          rows={1}
        />
        {busy ? (
          <button className="assistant-send stop" onClick={handleStop} title="Stop generating">
            Stop
          </button>
        ) : (
          <button
            className="assistant-send"
            onClick={() => void handleSend()}
            disabled={!input.trim() || !selectedModel}
            title="Send"
          >
            Send
          </button>
        )}
      </div>
    </aside>
  );
}
