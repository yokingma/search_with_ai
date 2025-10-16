import localforage from 'localforage';

type Order = 'ASC' | 'DESC'

export class LocalStore {
  private readonly store: typeof localforage;

  constructor (storeName: string, name: string = 'chat') {
    this.store = localforage.createInstance({
      // Database name
      name,
      // Data warehouse name
      storeName
    });
  }

  async getItem<T> (key: string): Promise<T | null> {
    return this.store.getItem<T>(key);
  }

  async setItem<T> (key: string, value: T): Promise<T | null> {
    if (value instanceof File) {
      return this.store.setItem<T>(key, value);
    }
    if (typeof value === 'object') {
      const time = new Date().getTime();
      if (!Array.isArray(value)) {
        value = {
          ...value,
          time
        };
      }
      value = JSON.parse(JSON.stringify(value));
    }
    return this.store.setItem<T>(key, value);
  }

  async removeItem (key: string): Promise<void> {
    await this.store.removeItem(key);
  }

  /**
   * If the iteratorCallback returns a non-undefined value, the iterate method will exit early.
   */
  async list<T extends Record<string, any>> (page = 1, limit = 10, order: Order = 'DESC'): Promise<T[]> {
    const items: Array<T & { key: string }> = [];

    await this.store.iterate((value: T, key) => {
      if (typeof value === 'object' && 'time' in value) {
        items.push({ ...value, key });
      }
    });

    // ordering
    const sortedItems = items.sort((a, b) => {
      const diff = order === 'DESC' ? b.time - a.time : a.time - b.time;
      // When timestamps are the same, use the key as the second sorting criterion
      return diff === 0 ? a.key.localeCompare(b.key) : diff;
    });

    // Pagination handling
    return sortedItems
      .slice((page - 1) * limit, page * limit)
      .map(({ key, ...rest }) => rest as unknown as T);
  }

  async keys (): Promise<string[]> {
    return this.store.keys();
  }

  async count (): Promise<number> {
    return this.store.length();
  }

  async clear (): Promise<void> {
    await this.store.clear();
  }
}
