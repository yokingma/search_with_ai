import {
  AIMessage,
  AIMessageChunk,
  HumanMessage,
  BaseMessage,
  ToolMessage,
  ToolMessageChunk,
} from 'langchain';
import type { BaseMessageLike } from '@langchain/core/messages';
import { IToolCall } from '../../interface.js';

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

export function getUserInput(messages: BaseMessageLike[]) {
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
}

export function extractStringFromMessageContent(message: BaseMessageLike | BaseMessage): string {
  if (typeof message === 'string') return message;
  if ('content' in message) {
    return typeof message.content === 'string'
      ? message.content
      : Array.isArray(message.content)
        ? message.content
          .filter(
            (c: unknown) =>
              (typeof c === 'object' &&
              c !== null &&
              'type' in c &&
              (c as { type: string }).type === 'text') ||
            typeof c === 'string'
          )
          .map((c: unknown) =>
            typeof c === 'string'
              ? c
              : typeof c === 'object' && c !== null && 'text' in c
                ? (c as { text?: string }).text || ''
                : ''
          )
          .join('')
        : '';
  }
  return '';
}

/**
 * Extract tool calls from a message.
 * @param message The message to extract tool calls from.
 * @returns An array of tool calls.
 */
export function extractToolCalls(message: BaseMessageLike): Partial<IToolCall>[] {
  if (typeof message === 'string') return [];
  if (HumanMessage.isInstance(message)) return [];
  if ('type' in message && typeof message.type !== 'string') return [];

  if (AIMessageChunk.isInstance(message) || AIMessage.isInstance(message)) {
    return message.tool_calls ?? [];
  }

  if (ToolMessage.isInstance(message) || ToolMessageChunk.isInstance(message)) {
    const toolCalls: Partial<IToolCall>[] = [];
    if ('tool_call_id' in message) {
      const toolCallId = message.tool_call_id;
      if (!toolCallId) {
        return [];
      }
      const result = extractStringFromMessageContent(message);
      toolCalls.push({
        id: toolCallId,
        name: message.name ?? '',
        status: 'completed' as const,
        result
      });
    }
    return toolCalls;
  }

  return [];
}
