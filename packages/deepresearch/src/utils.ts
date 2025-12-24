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
 * - [[1]], [[2]], [[3]] or [[citation:1]], [[citation:2]] etc. to cite specific search results
 * - Multiple sources can be cited as [[1]][[2]] or [[citation:1]][[citation:2]]
 * Formatted Citation Format:
 * - If enableUrl is true: `<sup>[[id](url)]</sup>` if URL exists, `<sup>[[id]]</sup>` if no URL
 * - If enableUrl is false: `[[citation:id]]`
 */
export function getCitations(
  response: AIMessageChunk | { content: string | unknown },
  sources: SearchResultItem[],
  enableUrl = true
) {
  const text = typeof response.content === 'string'
    ? response.content
    : JSON.stringify(response.content);

  const replaceCitationMark = (text: string): string => {
    return (
      text
        // Convert [[citation:number]] to [citation](number)
        .replace(/\[\[citation:(\d+)]]/g, '[citation]($1)')
        // Convert [[number]] to [citation](number)
        .replace(/\[\[(\d+)]]/g, '[citation]($1)')
        // Convert [number] to [citation](number)
        .replace(/(?<!\[)\[(\d+)](?!])/g, '[citation]($1)')
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

  // insert citations with URL or keep simple format
  const citationRegex = /\[citation\]\((\d+)\)/g;
  const citationNumbers = getCitationNumber(formattedText);

  const insertedText = formattedText.replace(citationRegex, str => {
    const index = parseInt(str.match(/\((\d+)\)/)?.[1] ?? '0', 10);
    const source = sources[index - 1];
    if (!source) {
      return str;
    }

    // If enableUrl is false, return simple citation format
    if (!enableUrl) {
      return `[[citation:${source.id}]]`;
    }

    // If enableUrl is true, return URL format
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