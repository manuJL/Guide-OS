// RAG-lite retrieval over GuideOS's own guide content.
//
// There is no vector database and no extra service. We flatten the tutorials
// (and a few short product notes) into ~150-300 word chunks, then rank them for
// a query with a small, dependency-free BM25 implementation. The top chunks
// become the CONTEXT for grounded answers; the returned relevance decides
// whether a question is in-guide at all.

import { tutorials } from '../tutorials';
import { MAX_CONTEXT_CHUNKS } from '../config/llm';

export interface KnowledgeChunk {
  id: string;
  title: string;
  text: string;
  source: string;
}

export interface RetrievedChunk extends KnowledgeChunk {
  score: number;
}

export interface RetrievalResult {
  chunks: RetrievedChunk[];
  /** BM25 score of the best chunk (0 when nothing matched). */
  score: number;
  /** 0..1 — how much of the query's information weight the best chunk covers. */
  relevance: number;
}

// ===== Chunk sources =====

// The live guide content lives in src/tutorials.ts, so we build chunks from it
// at module load. That keeps retrieval in sync with the tutorials automatically.
function buildTutorialChunks(): KnowledgeChunk[] {
  return Object.values(tutorials).map((tutorial) => {
    const parts: string[] = [`${tutorial.title.en}.`];
    tutorial.steps.forEach((step, index) => {
      parts.push(
        `Step ${index + 1}: ${step.instruction.en} ` +
          `(Tap: ${step.targetLabel.en}. ${step.whyThisStep.en})`,
      );
    });
    return {
      id: `tutorial-${tutorial.id}`,
      title: tutorial.title.en,
      text: parts.join(' '),
      source: `Guide task: ${tutorial.title.en}`,
    };
  });
}

const STATIC_CHUNKS: KnowledgeChunk[] = [
  {
    id: 'overview',
    title: 'What is GuideOS',
    text:
      'GuideOS is a phone assistant that teaches people how to do things on a smartphone. You ask ' +
      'a question in plain language and it walks you through the task step by step on a simulated ' +
      'phone, highlighting the exact button to tap and reading each step aloud. It works in ' +
      'English, Hindi and Telugu. There is no backend: it runs entirely in the browser. You can ' +
      'ask in the chat, or press the button to be given a manual and pick a task.',
    source: 'Product overview',
  },
  {
    id: 'languages-voice',
    title: 'Languages and voice',
    text:
      'GuideOS supports English, Hindi (हिन्दी) and Telugu (తెలుగు). Choose a language from the ' +
      'header, or simply type in Hindi or Telugu and it switches automatically and remembers your ' +
      'choice; any string without a translation falls back to English. Narration uses the browser ' +
      'speech engine to read each step out loud, and you can replay, pause, mute or turn auto ' +
      'voice off. Voice input, where you speak your question, works best in Chrome and Edge, ' +
      'partly in Safari, and not in Firefox, where typing still works.',
    source: 'Language and voice notes',
  },
  {
    id: 'privacy-simulation',
    title: 'Is it safe and does it control my phone',
    text:
      'The phone you see is a simulation for practice, so nothing you tap affects a real device. ' +
      'GuideOS has no account and no server and sends none of your data anywhere; your language ' +
      'choice is the only thing stored, in your browser. Assistant answers are produced by a local ' +
      'open-weight model running through Ollama on your own computer, so questions never leave ' +
      'your machine.',
    source: 'Product overview',
  },
];

// ===== Tokenisation =====

const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'of', 'to', 'in', 'on', 'for', 'with', 'as',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'do', 'does', 'did', 'how', 'what', 'when',
  'where', 'which', 'who', 'why', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'my', 'your',
  'our', 'their', 'this', 'that', 'these', 'those', 'can', 'could', 'should', 'would', 'will',
  'shall', 'may', 'might', 'must', 'at', 'by', 'from', 'up', 'about', 'into', 'over', 'after',
  'before', 'between', 'so', 'than', 'too', 'very', 'just', 'not', 'no', 'yes', 'please', 'show',
  'tell', 'want', 'need', 'use', 'using', 'get', 'got', 'make', 'made', 'let', 'guide', 'guideos',
]);

// Very light stemming: enough to match plurals and -ing forms without a library.
function stem(word: string): string {
  if (word.length > 4 && word.endsWith('ies')) return `${word.slice(0, -3)}y`;
  if (word.length > 4 && word.endsWith('es')) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097F\u0C00-\u0C7F]+/g, ' ')
    .split(' ')
    .filter((token) => token.length > 1 && !STOPWORDS.has(token))
    .map(stem);
}

// ===== Index =====

interface IndexedChunk {
  chunk: KnowledgeChunk;
  tf: Map<string, number>;
  length: number;
}

const CHUNKS: KnowledgeChunk[] = [...STATIC_CHUNKS, ...buildTutorialChunks()];

const INDEX: IndexedChunk[] = CHUNKS.map((chunk) => {
  const tokens = tokenize(`${chunk.title} ${chunk.text}`);
  const tf = new Map<string, number>();
  for (const token of tokens) tf.set(token, (tf.get(token) ?? 0) + 1);
  return { chunk, tf, length: tokens.length };
});

const K1 = 1.5;
const B = 0.75;
const AVG_LEN = Math.max(
  INDEX.reduce((sum, doc) => sum + doc.length, 0) / Math.max(INDEX.length, 1),
  1,
);

function idf(term: string): number {
  const df = INDEX.reduce((count, doc) => count + (doc.tf.has(term) ? 1 : 0), 0);
  if (df === 0) return 0;
  return Math.log(1 + (INDEX.length - df + 0.5) / (df + 0.5));
}

// ===== Retrieval =====

export function retrieve(query: string, limit: number = MAX_CONTEXT_CHUNKS): RetrievalResult {
  const queryTokens = Array.from(new Set(tokenize(query)));
  if (queryTokens.length === 0) {
    return { chunks: [], score: 0, relevance: 0 };
  }

  const termIdf = new Map<string, number>();
  for (const term of queryTokens) termIdf.set(term, idf(term));
  const totalIdf = queryTokens.reduce((sum, term) => sum + (termIdf.get(term) ?? 0), 0);

  const scored: RetrievedChunk[] = INDEX.map((doc) => {
    let score = 0;
    for (const term of queryTokens) {
      const frequency = doc.tf.get(term);
      if (!frequency) continue;
      const weight = termIdf.get(term) ?? 0;
      const denominator = frequency + K1 * (1 - B + (B * doc.length) / AVG_LEN);
      score += weight * ((frequency * (K1 + 1)) / denominator);
    }
    return { ...doc.chunk, score };
  })
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, limit);
  const bestScore = top.length > 0 ? top[0].score : 0;

  let relevance = 0;
  if (totalIdf > 0 && top.length > 0) {
    const bestDoc = INDEX.find((doc) => doc.chunk.id === top[0].id);
    if (bestDoc) {
      let matched = 0;
      for (const term of queryTokens) {
        if (bestDoc.tf.has(term)) matched += termIdf.get(term) ?? 0;
      }
      relevance = matched / totalIdf;
    }
  }

  return { chunks: top, score: bestScore, relevance };
}

export function knowledgeChunkCount(): number {
  return CHUNKS.length;
}
