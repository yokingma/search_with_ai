export interface IQueryResult {
  related: string;
  answer: string;
  contexts: Record<string, any>[]
}