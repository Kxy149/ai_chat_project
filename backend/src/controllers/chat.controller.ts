import type { Request, Response } from 'express';
import { z } from 'zod';
import { regenerateChatResponse, streamChatResponse } from '../services/chat.service.js';

function setupSse(res: Response) {
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();
}

export async function stream(req: Request, res: Response) {
  const schema = z.object({
    conversationId: z.union([z.number(), z.string()]).transform(Number),
    message: z.string().min(1),
    model: z.string().optional()
  });
  const payload = schema.parse(req.body);

  setupSse(res);

  await streamChatResponse({
    conversationId: payload.conversationId,
    userId: req.user!.id,
    message: payload.message,
    model: payload.model,
    request: req,
    response: res
  });
}

export async function regenerate(req: Request, res: Response) {
  const schema = z.object({
    conversationId: z.union([z.number(), z.string()]).transform(Number),
    model: z.string().optional()
  });
  const payload = schema.parse(req.body);

  setupSse(res);

  await regenerateChatResponse({
    conversationId: payload.conversationId,
    userId: req.user!.id,
    model: payload.model,
    request: req,
    response: res
  });
}
