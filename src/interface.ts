export type SearchFunc = (query: string, subscriptionKey: string) => Promise<any[]>;

export enum EBackend {
  GOOGLE = 'GOOGLE',
  BING = 'BING'
}
