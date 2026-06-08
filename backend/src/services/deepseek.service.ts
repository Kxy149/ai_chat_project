import { env } from '../config/env.js';
import type { AiMessage } from '../types/chat.js';
import { completeOpenAiChat, createOpenAiClient } from './openai.service.js';

export async function streamDeepSeekChat(params: {
  messages: AiMessage[];
  model?: string;
  onToken: (token: string) => void;
  isAborted?: () => boolean;
}) {
  if (!env.deepseekApiKey) {
    throw new Error('缺少 DEEPSEEK_API_KEY');
  }

  const client = createOpenAiClient(env.deepseekApiKey, env.deepseekBaseUrl);
  const stream = await client.chat.completions.create({
    model: params.model || env.deepseekModel,
    messages: params.messages,
    stream: true
  });

  for await (const chunk of stream) {
    if (params.isAborted?.()) {
      break;
    }

    const token = chunk.choices[0]?.delta?.content;
    if (token) {
      params.onToken(token);
    }
  }
}

export async function completeDeepSeekChat(params: {
  messages: AiMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}) {
  if (!env.deepseekApiKey) {
    throw new Error('缺少 DEEPSEEK_API_KEY');
  }

  return completeOpenAiChat({
    messages: params.messages,
    model: params.model || env.deepseekModel,
    temperature: params.temperature,
    maxTokens: params.maxTokens,
    apiKey: env.deepseekApiKey,
    baseURL: env.deepseekBaseUrl
  });
}
