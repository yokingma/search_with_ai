import { fetchEventData } from 'fetch-sse';
import { IMessage, TSearCategory, TSearchMode } from './interface';
const BASE_URL = import.meta.env.MODE === 'development' ? 'http://127.0.0.1:3000' : '';

const SEARCH = '/api/search';
const MODEL = '/api/models';
const CHAT = '/api/chat';

export interface IQueryOptions {
  ctrl?: AbortController
  stream?: boolean
  model?: string | null
  provider?: string
  engine?: string | null
  system?: string
  mode?: TSearchMode
  language?: string
  categories?: TSearCategory[]
  reload?: boolean
  onMessage: (data: Record<string, any>) => void
  onOpen?: () => void
  onClose?: () => void
  onError?: (e: any) => void
}
export async function search(q: string, options: IQueryOptions) {
  const { ctrl, stream = true, model, provider, engine, reload = false, mode, categories, language, onMessage, onOpen, onClose, onError } = options;
  const query = new URLSearchParams({
    q
  });
  const url = `${BASE_URL}${SEARCH}?${query.toString()}`;
  await fetchEventData(url, {
    method: 'POST',
    signal: ctrl?.signal,
    data: {
      stream,
      model,
      provider,
      mode,
      language,
      categories,
      engine,
      reload
    },
    headers: {
      'Content-Type': 'application/json'
    },
    onOpen: async () => {
      onOpen?.();
    },
    onMessage: (e) => {
      console.log('[search]', e);
      try {
        if (e?.data) {
          const data = JSON.parse(e.data);
          onMessage(JSON.parse(data.data || '{}'));
        }
      } catch (err) {
        onError?.(err);
      }
    },
    onClose,
    onError
  });
}

export async function chat(messages: IMessage[], options: IQueryOptions) {
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

export async function getModels() {
  const res = await fetch(`${BASE_URL}${MODEL}`);
  return res.json();
}
