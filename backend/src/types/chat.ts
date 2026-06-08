export type MessageRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  id: number;
  conversationId: number;
  role: MessageRole;
  content: string;
  status: 'streaming' | 'completed' | 'failed';
  createdAt: string;
}

export interface Conversation {
  id: number;
  title: string;
  model: string;
  updatedAt: string;
}

export interface AiMessage {
  role: MessageRole;
  content: string;
}
