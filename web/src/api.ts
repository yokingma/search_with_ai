const URL = 'http://127.0.0.1:3000/api/search';
const MODEL = 'http://127.0.0.1:3000/api/models';
import { fetchEventData } from 'fetch-sse';

export interface IQueryOptions {
  ctrl?: AbortController
  stream?: boolean
  model?: string | null
  engine?: string | null
  onMessage: (data: Record<string, any>) => void
  onOpen?: () => void
  onClose?: () => void
  onError?: (e: any) => void
}
export async function search(q: string, options: IQueryOptions) {
  const { ctrl, stream = true, model, engine, onMessage, onOpen, onClose, onError } = options;
  const query = new URLSearchParams({
    q
  });
  const url = `${URL}?${query.toString()}`;
  await fetchEventData(url, {
    method: 'POST',
    signal: ctrl?.signal,
    data: {
      stream,
      model,
      engine
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
  const res = await fetch(MODEL);
  return res.json();
}
