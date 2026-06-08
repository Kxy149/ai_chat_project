export type MessageRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  id: number | string;
  conversationId: number | string;
  role: MessageRole;
  content: string;
  status?: 'streaming' | 'completed' | 'failed';
  createdAt?: string;
}

export interface Conversation {
  id: number | string;
  title: string;
  model?: string;
  updatedAt?: string;
}
