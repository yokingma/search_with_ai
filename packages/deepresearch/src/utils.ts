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
 * - `[id](url)` to cite specific search results
 * - Multiple sources can be cited as `[id](url)[id](url)`
 */
export function getCitations(
  response: AIMessageChunk | { content: string | unknown },
  sources: SearchResultItem[]
) {
  const text = typeof response.content === 'string' 
    ? response.content 
    : JSON.stringify(response.content);

  const replaceCitationMark = (text: string): string => {
    return (
      text
        // Convert [[number]] directly to [citation](number)
        .replace(/\[\[(\d+)]]/g, '[citation]($1)')
        // If there are other formats to handle, continue adding
        .replace(/\[(\d+)]/g, '[citation]($1)')
    );
  };

  // Get numbers from the application content
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
    if (source.url) {
      return `<sup>[[${source.id}](${source.url})]</sup>`;
    }
    return `<sup>[[${source.id}]]</sup>`;
  });

  return {
    content: insertedText,
    segmentIndexes: citationNumbers,
  };
}

export const getCurrentDate = () => new Date().toISOString();

/**
 * replace the variable in the string with the value
 * e.g replaceVariable(`abc{query}, efg.`, { query: '456' })
 */
export function replaceVariable(
  text: string,
  obj: Record<string, string | number>
): string {
  if (!(typeof text === 'string')) return text;

  for (const key in obj) {
    const val = obj[key];
    if (!['string', 'number'].includes(typeof val)) continue;

    text = text.replace(new RegExp(`{(${key})}`, 'g'), String(val));
  }
  return text || '';
}