// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dotenvx from '@dotenvx/dotenvx';
import { Provider } from './interface';
dotenvx.config();


export function getConfig(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}

/**
 * Get the API keys for providers
 * Needs to be set in .env or .env.local file
 */
export function getProviderKeys() {
  const {
    GOOGLE_KEY,
    ALIYUN_KEY,
    OPENAI_KEY,
    BAIDU_KEY,
    TENCENT_KEY,
    YI_KEY,
    MOONSHOT_KEY,
    LEPTON_KEY,
    DEEPSEEK_KEY,
    GLM_KEY,
    SILICONFLOW_KEY,
    LMSTUDIO_KEY,
    OLLAMA_KEY
  } = process.env;
  const keys: Record<Provider, string | undefined> = {
    [Provider.GOOGLE]: GOOGLE_KEY,
    [Provider.ALIYUN]: ALIYUN_KEY,
    [Provider.OPENAI]: OPENAI_KEY,
    [Provider.BAIDU]: BAIDU_KEY,
    [Provider.TENCENT]: TENCENT_KEY,
    [Provider.YI]: YI_KEY,
    [Provider.MOONSHOT]: MOONSHOT_KEY,
    [Provider.LEPTON]: LEPTON_KEY,
    [Provider.DEEPSEEK]: DEEPSEEK_KEY,
    [Provider.CHATGLM]: GLM_KEY,
    [Provider.SILICONFLOW]: SILICONFLOW_KEY,
    [Provider.LMSTUDIO]: LMSTUDIO_KEY,
    [Provider.OLLAMA]: OLLAMA_KEY
  };
  return keys;
}
