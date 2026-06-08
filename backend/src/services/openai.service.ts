import OpenAI from 'openai';
import { env } from '../config/env.js';
import type { AiMessage } from '../types/chat.js';

export function createOpenAiClient(apiKey: string, baseURL: string) {
  return new OpenAI({
    apiKey,
    baseURL
  });
}

export async function streamOpenAiChat(params: {
  messages: AiMessage[];
  model?: string;
  onToken: (token: string) => void;
  isAborted?: () => boolean;
}) {
  if (!env.openaiApiKey) {
    throw new Error('缺少 OPENAI_API_KEY');
  }

  const client = createOpenAiClient(env.openaiApiKey, env.openaiBaseUrl);
  const stream = await client.chat.completions.create({
    model: params.model || env.openaiModel,
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

export async function completeOpenAiChat(params: {
  messages: AiMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  apiKey?: string;
  baseURL?: string;
}) {
  const apiKey = params.apiKey ?? env.openaiApiKey;
  const baseURL = params.baseURL ?? env.openaiBaseUrl;

  if (!apiKey) {
    throw new Error('缺少 OPENAI_API_KEY');
  }

  const client = createOpenAiClient(apiKey, baseURL);
  const completion = await client.chat.completions.create({
    model: params.model || env.openaiModel,
    messages: params.messages,
    temperature: params.temperature ?? 0.2,
    max_tokens: params.maxTokens ?? 32
  });

  return completion.choices[0]?.message?.content?.trim() ?? '';
}
