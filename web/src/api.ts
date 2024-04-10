import { fetchEventData } from 'fetch-sse';
const BASE_URL = import.meta.env.MODE === 'development' ? 'http://127.0.0.1:3000' : '';

const SEARCH = '/api/search';
const MODEL = '/api/models';
const LOCAL_MODELS = '/api/local/models';
export interface IQueryOptions {
  ctrl?: AbortController
  stream?: boolean
  model?: string | null
  engine?: string | null
  locally?: boolean
  onMessage: (data: Record<string, any>) => void
  onOpen?: () => void
  onClose?: () => void
  onError?: (e: any) => void
}
export async function search(q: string, options: IQueryOptions) {
  const { ctrl, stream = true, model, engine, locally, onMessage, onOpen, onClose, onError } = options;
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
      engine,
      locally
    },
    headers: {
      'Content-Type': 'application/json'
    },
    onOpen: async () => {
      onOpen?.();
    },
    onMessage: (e) => {
      console.log('[sse]', e);
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

export async function getModels() {
  const res = await fetch(`${BASE_URL}${MODEL}`);
  return res.json();
}

export async function getLocalModels() {
  const res = await fetch(`${BASE_URL}${LOCAL_MODELS}`);
  return res.json();
}
