// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dotenvx from '@dotenvx/dotenvx';
dotenvx.config();

export function getConfig(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}
