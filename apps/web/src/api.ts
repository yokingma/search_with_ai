import { fetchEventData } from 'fetch-sse';
import { IResearchProgress, IChatMessage, TSearCategory, TSearchEngine } from './types';
const BASE_URL = import.meta.env.MODE === 'development' ? 'http://127.0.0.1:3000' : '';

const MODEL = '/api/models';
const CHAT = '/api/chat';
const DEEP_RESEARCH = '/api/deep-research';

export interface IQueryOptions {
  ctrl?: AbortController
  stream?: boolean
  model?: string | null
  provider?: string
  engine?: string | null
  system?: string
  language?: string
  categories?: TSearCategory[]
  reload?: boolean
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

export async function search(messages: IChatMessage[], options: IQueryOptions) {
  const { ctrl, model, provider, engine, categories, language, onMessage, onOpen, onClose, onError } = options;
  const url = `${BASE_URL}${CHAT}`;
  await fetchEventData(url, {
    method: 'POST',
    signal: ctrl?.signal,
    data: {
      messages,
      model,
      provider,
      language,
      categories,
      engine
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

export async function chat(messages: IChatMessage[], options: IQueryOptions) {
  const url = `${BASE_URL}${CHAT}`;
  const { ctrl, model, system, provider, onMessage, onError } = options;
  await fetchEventData(url, {
    method: 'POST',
    signal: ctrl?.signal,
    data: {
      model,
      system,
      provider,
      messages
    },
    headers: {
      'Content-Type': 'application/json'
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
  });
}

export async function deepResearch(options: IDeepResearchOptions) {
  const url = `${BASE_URL}${DEEP_RESEARCH}`;
  const { query, ctrl, provider, model, searchEngine, depth = 2, breadth = 2, reportModel, onProgress } = options;
  await fetchEventData(url, {
    method: 'POST',
    signal: ctrl?.signal,
    data: {
      query,
      provider,
      model,
      searchEngine,
      depth,
      breadth,
      reportModel
    },
    onMessage: (e) => {
      try {
        if (e?.data) {
          const data: IResearchProgress = JSON.parse(e.data);
          onProgress?.(data);
        }
      } catch (err) {
        console.error('[deepResearch]', err);
      }
    },
  });
}

export async function getModels() {
  const res = await fetch(`${BASE_URL}${MODEL}`);
  return res.json();
}
