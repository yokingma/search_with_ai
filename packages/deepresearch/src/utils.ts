import {
  HumanMessage,
  AIMessage,
  AIMessageChunk,
  BaseMessageLike,
} from '@langchain/core/messages';
import { SearchResultItem } from './types.js';

/**
 * Get the research topic from the messages.
 */
export function getResearchTopic(messages: BaseMessageLike[]) {
  // check if request has a history and combine the messages into a single string
  if (messages.length === 1) {
    const msg = messages[messages.length - 1];
    if (typeof msg === 'string') {
      return msg;
    }
    if ('content' in msg) {
      if (typeof msg.content === 'string') {
        return msg.content;
      }
      if (Array.isArray(msg.content)) {
        return msg.content
          .map(item => item.type === 'text' ? item.text : '')
          .join('\n');
      }
    }
    return JSON.stringify(msg);
  } else {
    let researchTopic = '';
    for (const message of messages) {
      if (message instanceof HumanMessage) {
        researchTopic += `User: ${message.content}\n`;
      } else if (message instanceof AIMessage) {
        researchTopic += `Assistant: ${message.content}\n`;
      }
    }
    return researchTopic;
  }
}

/**
 * Extracts and formats citation information from a model's response.
 * Original Citation Format:
 * - [[1]], [[2]], [[3]] etc. to cite specific search results
 * - Multiple sources can be cited as [[1]][[2]]
 * Formatted Citation Format:
 * - `[Title](id)` to cite specific search results
 * - Multiple sources can be cited as `[Title](id)[Title](id)`
 */
export function getCitations(
  response: AIMessageChunk,
  sources: SearchResultItem[]
) {
  const text = response.content as string;

  const replaceCitationMark = (text: string): string => {
    return (
      text
        // 直接转换 [[数字]] 为 [citation](数字)
        .replace(/\[\[(\d+)]]/g, '[citation]($1)')
        // 如果还有其他格式需要处理，可以继续添加
        .replace(/\[(\d+)]/g, '[citation]($1)')
    );
  };

  // 获取应用内容中的数字
  const getCitationNumber = (text: string): string[] => {
    const regex = /\[citation\]\((\d+)\)/g;
    const numbers: string[] = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      numbers.push(match[1]);
    }
    return numbers;
  };

  const formattedText = replaceCitationMark(text);

  // insert citations
  const citationRegex = /\[citation\]\((\d+)\)/g;
  const citationNumbers = getCitationNumber(formattedText);

  const insertedText = formattedText.replace(citationRegex, str => {
    const index = parseInt(str.match(/\((\d+)\)/)?.[1] ?? '0', 10);
    const source = sources[index - 1];
    if (!source) {
      return str;
    }
    const title =
      source.title.length > 32
        ? source.title.slice(0, 32) + '...'
        : source.title;
    return `[${title}](${source.id})`;
  });

  return {
    content: insertedText,
    segmentIndexes: citationNumbers,
  };
}

export const getCurrentDate = () => new Date().toISOString();
