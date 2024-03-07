const URL = 'http://127.0.0.1:3000/search'
import { EventStreamContentType, fetchEventSource } from "@microsoft/fetch-event-source"

export interface IQueryOptions {
  ctrl?: AbortController,
  stream?: boolean,
  model?: string,
  onMessage: (data: Record<string, any>) => void,
  onOpen?: () => void,
  onClose?: () => void,
  onError?: (e: any) => void
}
export async function search(q: string, options: IQueryOptions) {
  const { ctrl, stream = true, model = 'gpt-4', onMessage, onOpen, onClose, onError } = options
  const query = new URLSearchParams({
    q
  })
  await fetchEventSource(`${URL}?${query.toString()}`, {
    method: 'POST',
    signal: ctrl?.signal,
    body: JSON.stringify({
      stream,
      model
    }),
    headers: {
      'Content-Type': 'application/json'
    },
    onopen: async (res) => {
      if (res.ok && res.headers.get('content-type') === EventStreamContentType) {
        onOpen?.()
        return
      }
      // error
    },
    onmessage: (e) => {
      try {
        const data = JSON.parse(e.data)
        onMessage(JSON.parse(data.data))
      } catch (err) {
        onError?.(err)
      }
    },
    onclose: () => {
      onClose?.()
    },
    onerror: (e) => {
      onError?.(e)
    }
  })
}
