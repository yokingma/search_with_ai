import { IChatMessage } from '@/types';
import { LocalStore } from './';

const MAX_CHAT_COUNT = 40;

export interface IChatRecord {
  uuid: string
  time?: number
  title: string
  messages: IChatMessage[]
  source?: Record<string, any>
}

export const store = new LocalStore('chat');
export async function saveChat (uuid: string, record: IChatRecord): Promise<IChatRecord | null> {
  record.title = record.title.length > 40 ? `${record.title.slice(0, 40)}...` : record.title;
  record.time = new Date().getTime();
  const res = await store.setItem<IChatRecord>(uuid, record);
  await removeExceededChats();
  return res;
}

export async function updateChat (uuid: string, record: IChatRecord): Promise<void> {
  const res = await store.getItem<IChatRecord>(uuid);
  if (res === null) return;
  res.messages = record.messages;
  res.time = new Date().getTime();
  await store.setItem<IChatRecord>(uuid, res);
}

export async function getChat (uuid: string): Promise<IChatRecord | null> {
  const res = await store.getItem<IChatRecord>(uuid);
  return res;
}

export async function removeChat (uuid: string): Promise<void> {
  await store.removeItem(uuid);
}

export async function removeExceededChats (): Promise<void> {
  const count = await store.count();
  if (count > MAX_CHAT_COUNT) {
    const res = await store.list<IChatRecord>(1, count - MAX_CHAT_COUNT, 'ASC');
    for (const item of res) {
      await store.removeItem(item.uuid);
    }
  }
}

export async function count (): Promise<number> {
  return store.count();
}

export async function listChat (page = 1, limit = 20): Promise<{ count: number, list: IChatRecord[] }> {
  const count = await store.count();
  const res = await store.list<IChatRecord>(page, limit);
  return {
    count,
    list: res
      .map(item => {
        return {
          title: item.title,
          messages: [],
          uuid: item.uuid,
          time: item.time
        };
      })
  };
}
