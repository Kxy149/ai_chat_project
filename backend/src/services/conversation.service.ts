import { env } from '../config/env.js';
import { createConversation, getConversationById, listConversations, renameConversation, softDeleteConversation } from '../storage/conversation.storage.js';
import { listMessages } from '../storage/message.storage.js';

export async function getConversationList(userId: number) {
  return listConversations(userId);
}

export async function createNewConversation(userId: number, title?: string) {
  return createConversation(userId, title?.trim() || '新的会话', env.aiProvider === 'deepseek' ? env.deepseekModel : env.openaiModel);
}

export async function getConversationDetail(id: number, userId: number) {
  const conversation = await getConversationById(id, userId);

  if (!conversation) {
    return null;
  }

  const messages = await listMessages(id);
  return {
    ...conversation,
    messages
  };
}

export async function updateConversationTitle(id: number, userId: number, title: string) {
  return renameConversation(id, userId, title.trim() || '新的会话');
}

export async function deleteConversationById(id: number, userId: number) {
  await softDeleteConversation(id, userId);
}
