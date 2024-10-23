import dotenv from 'dotenv';

dotenv.config();

export function getConfig(key: string): string | undefined {
  return process.env[key];
}
