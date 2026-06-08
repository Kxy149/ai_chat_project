import type { Request, Response } from 'express';
import { z } from 'zod';
import { createNewConversation, deleteConversationById, getConversationDetail, getConversationList, updateConversationTitle } from '../services/conversation.service.js';

export async function list(req: Request, res: Response) {
  const conversations = await getConversationList(req.user!.id);
  res.json(conversations);
}

export async function create(req: Request, res: Response) {
  const schema = z.object({
    title: z.string().optional()
  });
  const payload = schema.parse(req.body);
  const conversation = await createNewConversation(req.user!.id, payload.title);
  res.status(201).json(conversation);
}

export async function detail(req: Request, res: Response) {
  const conversation = await getConversationDetail(Number(req.params.id), req.user!.id);

  if (!conversation) {
    res.status(404).json({ message: '会话不存在' });
    return;
  }

  res.json(conversation);
}

export async function update(req: Request, res: Response) {
  const schema = z.object({
    title: z.string().min(1)
  });
  const payload = schema.parse(req.body);
  const conversation = await updateConversationTitle(Number(req.params.id), req.user!.id, payload.title);

  if (!conversation) {
    res.status(404).json({ message: '会话不存在' });
    return;
  }

  res.json(conversation);
}

export async function remove(req: Request, res: Response) {
  await deleteConversationById(Number(req.params.id), req.user!.id);
  res.status(204).send();
}
