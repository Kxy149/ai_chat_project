import { env } from '../config/env.js';
import type { AiMessage } from '../types/chat.js';
import { completeDeepSeekChat, streamDeepSeekChat } from './deepseek.service.js';
import { completeOpenAiChat, streamOpenAiChat } from './openai.service.js';

export async function streamAiChat(params: {
  messages: AiMessage[];
  model?: string;
  onToken: (token: string) => void;
  isAborted?: () => boolean;
}) {
  if (env.aiProvider === 'deepseek') {
    return streamDeepSeekChat(params);
  }

  return streamOpenAiChat(params);
}

export function getDefaultModel() {
  return env.aiProvider === 'deepseek' ? env.deepseekModel : env.openaiModel;
}

export async function completeAiChat(params: {
  messages: AiMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}) {
  if (env.aiProvider === 'deepseek') {
    return completeDeepSeekChat(params);
  }

  return completeOpenAiChat(params);
}
