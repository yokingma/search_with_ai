import { fetchEventData } from 'fetch-sse';
import { IResearchProgress, IChatMessage, TSearCategory, TSearchEngine } from './types';
const BASE_URL = import.meta.env.MODE === 'development' ? 'http://127.0.0.1:3000' : '';

const URLS = {
  MODEL: '/api/models',
  CHAT: '/api/chat',
  ENGINE: '/api/engines',
};

export interface IQueryOptions {
  ctrl?: AbortController
  stream?: boolean
  model?: string | null
  provider?: string
  engine?: string | null
  systemPrompt?: string
  temperature?: number
  language?: string
  categories?: TSearCategory[]
  onMessage: (data: Record<string, any>) => void
  onOpen?: () => void
  onClose?: () => void
  onError?: (e: any) => void
}

export interface IDeepResearchOptions {
  query: string;
  provider: string;
  model: string;
  searchEngine: TSearchEngine;
  depth?: number;
  breadth?: number;
  reportModel?: string;
  ctrl?: AbortController;
  onProgress?: (data: IResearchProgress) => void
}

export async function chat(messages: IChatMessage[], options: IQueryOptions) {
  const { ctrl, model, provider, engine, categories, language, systemPrompt, temperature, onMessage, onOpen, onClose, onError } = options;
  const url = `${BASE_URL}${URLS.CHAT}`;
  await fetchEventData(url, {
    method: 'POST',
    signal: ctrl?.signal,
    data: {
      messages,
      model,
      provider,
      language,
      categories,
      engine,
      systemPrompt,
      temperature
    },
    headers: {
      'Content-Type': 'application/json'
    },
    onOpen: async () => {
      onOpen?.();
    },
    onMessage: (e) => {
      try {
        if (e?.data) {
          const data = JSON.parse(e.data);
          onMessage(data.data);
        }
      } catch (err) {
        onError?.(err);
      }
    },
    onClose,
    onError
  });
}

export async function getModels() {
  const res = await fetch(`${BASE_URL}${URLS.MODEL}`);
  return res.json();
}

export async function getEngines() {
  const res = await fetch(`${BASE_URL}${URLS.ENGINE}`);
  return res.json();
}
