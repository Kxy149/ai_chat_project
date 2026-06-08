import type { Request, Response } from 'express';
import { getConversationById, renameConversation, touchConversation } from '../storage/conversation.storage.js';
import { createMessage, deleteMessage, listMessages, updateMessageContent } from '../storage/message.storage.js';
import type { AiMessage, ChatMessage } from '../types/chat.js';
import { completeAiChat, getDefaultModel, streamAiChat } from './ai.service.js';

function sendEvent(res: Response, payload: unknown) {
  if (!res.writableEnded && !res.destroyed) {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
    const maybeFlush = res as Response & { flush?: () => void };
    maybeFlush.flush?.();
  }
}

function toAiMessages(messages: ChatMessage[]) {
  return messages
    .filter((item) => item.status === 'completed')
    .map((item) => ({
      role: item.role,
      content: item.content
    })) satisfies AiMessage[];
}

function findLastMessage(messages: ChatMessage[], role: 'user' | 'assistant') {
  return [...messages].reverse().find((item) => item.role === role);
}

function fallbackConversationTitle(message: string) {
  const normalized = message
    .replace(/```[\s\S]*?```/g, '代码问题')
    .replace(/\s+/g, ' ')
    .trim();
  const firstSentence = normalized.split(/[。！？!?；;\n]/)[0]?.trim() || normalized;
  const title = firstSentence.length > 12 ? `${firstSentence.slice(0, 12)}...` : firstSentence;

  return title || '新的会话';
}

function cleanAiTitle(title: string) {
  return title
    .replace(/^["'“”‘’【】《》\s]+|["'“”‘’【】《》\s]+$/g, '')
    .replace(/[。！？!?；;，,：:]/g, '')
    .replace(/\s+/g, '')
    .slice(0, 12);
}

async function generateConversationTitle(message: string, model: string) {
  try {
    const title = await completeAiChat({
      model,
      temperature: 0.2,
      maxTokens: 24,
      messages: [
        {
          role: 'system',
          content: '你是会话标题生成器。请根据用户问题生成一个中文短标题，4到10个字，只输出标题，不要解释，不要标点，不要复述完整问题。'
        },
        {
          role: 'user',
          content: message
        }
      ]
    });
    const cleaned = cleanAiTitle(title);
    return cleaned || fallbackConversationTitle(message);
  } catch {
    return fallbackConversationTitle(message);
  }
}

function isDefaultConversationTitle(title: string) {
  return !title || title === '新的会话' || title === 'New Conversation';
}

async function runAssistantStream(params: {
  conversationId: number;
  model: string;
  assistantMessageId: number;
  aiMessages: AiMessage[];
  request: Request;
  response: Response;
  beforeDone?: () => Promise<void>;
}) {
  let fullContent = '';
  let aborted = false;

  params.response.on('close', () => {
    aborted = true;
  });

  try {
    await streamAiChat({
      messages: params.aiMessages,
      model: params.model,
      isAborted: () => aborted || params.response.destroyed || params.response.writableEnded,
      onToken: (token) => {
        if (aborted) {
          return;
        }

        fullContent += token;
        sendEvent(params.response, { type: 'token', content: token });
      }
    });

    await updateMessageContent(params.assistantMessageId, fullContent, 'completed');
    await params.beforeDone?.();
    await touchConversation(params.conversationId);

    if (aborted) {
      sendEvent(params.response, { type: 'stopped' });
    } else {
      sendEvent(params.response, { type: 'done' });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'AI 接口调用失败';
    await updateMessageContent(params.assistantMessageId, fullContent, fullContent ? 'completed' : 'failed', message);
    sendEvent(params.response, { type: 'error', message });
  } finally {
    if (!params.response.writableEnded) {
      params.response.end();
    }
  }
}

export async function streamChatResponse(params: {
  conversationId: number;
  userId: number;
  message: string;
  model?: string;
  request: Request;
  response: Response;
}) {
  const conversation = await getConversationById(params.conversationId, params.userId);

  if (!conversation) {
    params.response.status(404);
    sendEvent(params.response, { type: 'error', message: '会话不存在' });
    params.response.end();
    return;
  }

  const model = params.model || conversation.model || getDefaultModel();
  await createMessage({
    conversationId: params.conversationId,
    role: 'user',
    content: params.message,
    status: 'completed'
  });

  const historyBeforeAssistant = await listMessages(params.conversationId);

  const userMessageCount = historyBeforeAssistant.filter((item) => item.role === 'user').length;
  const titlePromise =
    userMessageCount === 1 && isDefaultConversationTitle(conversation.title)
      ? generateConversationTitle(params.message, model).then((title) => renameConversation(params.conversationId, params.userId, title))
      : Promise.resolve();

  const assistantMessageId = await createMessage({
    conversationId: params.conversationId,
    role: 'assistant',
    content: '',
    model,
    status: 'streaming'
  });

  await runAssistantStream({
    conversationId: params.conversationId,
    model,
    assistantMessageId,
    aiMessages: toAiMessages(historyBeforeAssistant),
    request: params.request,
    response: params.response,
    beforeDone: async () => {
      await titlePromise;
    }
  });
}

export async function regenerateChatResponse(params: {
  conversationId: number;
  userId: number;
  model?: string;
  request: Request;
  response: Response;
}) {
  const conversation = await getConversationById(params.conversationId, params.userId);

  if (!conversation) {
    params.response.status(404);
    sendEvent(params.response, { type: 'error', message: '会话不存在' });
    params.response.end();
    return;
  }

  const history = await listMessages(params.conversationId);
  const lastUser = findLastMessage(history, 'user');

  if (!lastUser) {
    params.response.status(400);
    sendEvent(params.response, { type: 'error', message: '没有可重新生成的用户消息' });
    params.response.end();
    return;
  }

  const lastAssistant = findLastMessage(history, 'assistant');
  if (lastAssistant && lastAssistant.createdAt > lastUser.createdAt) {
    await deleteMessage(lastAssistant.id);
  }

  const historyForRegenerate = (await listMessages(params.conversationId)).filter((item) => item.status === 'completed');
  const model = params.model || conversation.model || getDefaultModel();
  const assistantMessageId = await createMessage({
    conversationId: params.conversationId,
    role: 'assistant',
    content: '',
    model,
    status: 'streaming'
  });

  await runAssistantStream({
    conversationId: params.conversationId,
    model,
    assistantMessageId,
    aiMessages: toAiMessages(historyForRegenerate),
    request: params.request,
    response: params.response
  });
}
