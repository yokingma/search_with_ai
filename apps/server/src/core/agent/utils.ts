import {
  AIMessage,
  HumanMessage,
} from 'langchain';
import type { BaseMessageLike } from '@langchain/core/messages';

export const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

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
          .map((item: any) => (item.type === 'text' ? item.text : ''))
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
