import * as tencentcloud from 'tencentcloud-sdk-nodejs';
import { ClientConfig } from 'tencentcloud-sdk-nodejs/tencentcloud/common/interface';
import { Client } from 'tencentcloud-sdk-nodejs/tencentcloud/services/hunyuan/v20230901/hunyuan_client';
import { ChatStdResponse } from 'tencentcloud-sdk-nodejs/tencentcloud/services/hunyuan/v20230901/hunyuan_models';
import { BaseChat } from './base';
import { IChatInputMessage, IStreamHandler } from '../interface';
import { DefaultSystem, TencentModels } from '../constant';

export class TencentChat implements BaseChat {
  private client: Client;

  constructor() {
    const key = process.env.TENCENT_KEY;
    const secret = process.env.TENCENT_SECRET;
    const config: ClientConfig = {
      credential: {
        secretId: key,
        secretKey: secret
      },
      region: '',
      profile: {
        httpProfile: {
          endpoint: 'hunyuan.tencentcloudapi.com'
        }
      }
    };
    this.client = new tencentcloud.hunyuan.v20230901.Client(config);
  }

  async chatStream(
    messages: IChatInputMessage[],
    onMessage?: IStreamHandler,
    model = TencentModels.STD,
    system = DefaultSystem
  ): Promise<void> {
    const Messages = this.transformMessage(messages);
    console.log(model);
    if (system) {
      Messages.unshift({
        Role: 'system',
        Content: system
      });
    }
    const result: any = await this.client.ChatStd({
      Messages
    });
    return new Promise((resolve) => {
      result.on('message', (res: any) => {
        const data: ChatStdResponse = JSON.parse(res.data ?? '{}');
        const text = data.Choices?.[0].Delta?.Content || '';
        const stop = data.Choices?.[0].FinishReason === 'stop' ? true : false;
        onMessage?.(text, stop);
        if (stop) resolve();
      });
    });
  }

  private transformMessage(messages: IChatInputMessage[]) {
    return messages.map(msg => {
      return {
        Role: msg.role,
        Content: msg.content
      };
    });
  }
}

export const tencent = new TencentChat();
