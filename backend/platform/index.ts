import { aliyun } from './aliyun';
import { openai } from './openai';
import { baidu } from './baidu';
import { google } from './google';
import { tencent } from './tencent';
import { yi } from './yi';
import { moonshot } from './moonshot';
import { lepton } from './lepton';
import { deepseek } from './deepseek';
import { chatglm } from './chatglm';
import { ollama } from './ollama';
import { lmstudio } from './lmstudio';

const platform = {
  aliyun,
  openai,
  baidu,
  google,
  tencent,
  yi,
  deepseek,
  chatglm,
  moonshot,
  lepton,
  ollama,
  lmstudio
};

export default platform;
