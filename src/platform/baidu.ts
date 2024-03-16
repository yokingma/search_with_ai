import { fetchEventData } from 'fetch-sse';
import { httpRequest }  from '../utils';
import { memoryCache } from '../cache';
import { BaseChat } from './base';
import { IChatInputMessage, IStreamHandler } from '../interface';
import { AllModels } from '../constant';
import { type MemoryCache } from 'cache-manager';

const BASE_URL =
  'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat';

const TokenUrl = 'https://aip.baidubce.com/oauth/2.0/token';

export class BaiduChat implements BaseChat {
  private key?: string;
  private secret?: string;
  private cache: MemoryCache;

  constructor() {
    this.key = process.env.BAIDU_KEY;
    this.secret = process.env.BAIDU_SECRET;
    this.cache = memoryCache;
  }

  public async chat(
    messages: IChatInputMessage[],
    model = AllModels['ERNIE-Bot-turbo'],
    system?: string
  ) {
    const token = await this.getAccessToken();
    const res = await httpRequest({
      endpoint: `${BASE_URL}/${model}`,
      method: 'POST',
      query: {
        access_token: token
      },
      data: JSON.stringify({
        messages,
        system,
        stream: false,
      })
    });
    const data = await res.json();
    if (data.error_code) {
      const msg = `${data.error_code}: ${data.error_msg}`;
      throw new Error(msg);
    }
    return data.result;
  }

  public async chatStream(
    messages: IChatInputMessage[],
    onMessage: IStreamHandler,
    model = AllModels['ERNIE-Bot-turbo'],
    system?: string
  ): Promise<void> {
    const token = await this.getAccessToken();
    const url = `${BASE_URL}/${model}?access_token=${token}`;
    const abort = new AbortController();
    await fetchEventData(url, {
      method: 'POST',
      data: {
        messages,
        system,
        stream: true,
      },
      signal: abort.signal,
      onMessage: (eventData) => {
        const data = eventData?.data;
        const result = JSON.parse(data || '{}');
        const msg = result.result ?? '';
        onMessage(msg, false);
      }
    });
  }

  /**
   * @description baidu access_token默认有效期30天，单位是秒，生产环境注意及时刷新。
   */
  protected async getAccessToken(): Promise<string> {
    if (!this.key || !this.secret) {
      throw new Error('Invalid Baidu params: key or secret');
    }
    const { key, secret } = this;
    const cachedToken: string | undefined = await this.cache.get(key);
    if (cachedToken) {
      return cachedToken;
    }
    const res = await httpRequest({
      method: 'POST',
      endpoint: TokenUrl,
      query: {
        grant_type: 'client_credentials',
        client_id: key,
        client_secret: secret,
      }
    });
    const data = await res.json();
    if (data?.error) {
      throw new Error(data.error);
    }
    const { access_token, expires_in } = data;
    this.cache.set(key, access_token, expires_in - 10);
    return access_token;
  }
}

export const baidu = new BaiduChat();
