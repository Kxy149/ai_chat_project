import { http } from '@/services/http';
import type { ChatMessage, Conversation } from '@/types/chat';

export interface ConversationDetail extends Conversation {
  messages: ChatMessage[];
}

export async function listConversations() {
  const { data } = await http.get<Conversation[]>('/api/conversations');
  return data;
}

export async function createConversation(title = '新的会话') {
  const { data } = await http.post<Conversation>('/api/conversations', { title });
  return data;
}

export async function getConversation(id: number | string) {
  const { data } = await http.get<ConversationDetail>(`/api/conversations/${id}`);
  return data;
}

export async function renameConversation(id: number | string, title: string) {
  const { data } = await http.patch<Conversation>(`/api/conversations/${id}`, { title });
  return data;
}

export async function deleteConversation(id: number | string) {
  await http.delete(`/api/conversations/${id}`);
}
