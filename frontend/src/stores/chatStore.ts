import { defineStore } from 'pinia';
import { ElMessage } from 'element-plus';
import { regenerateChat, streamChat } from '@/services/chatApi';
import { createConversation, deleteConversation, getConversation, listConversations, renameConversation } from '@/services/conversationApi';
import type { ChatMessage, Conversation } from '@/types/chat';

interface ChatState {
  conversations: Conversation[];
  currentConversationId: number | string | null;
  messages: ChatMessage[];
  isGenerating: boolean;
  abortController: AbortController | null;
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    conversations: [],
    currentConversationId: null,
    messages: [],
    isGenerating: false,
    abortController: null
  }),
  getters: {
    currentConversation(state) {
      return state.conversations.find((item) => item.id === state.currentConversationId) ?? null;
    },
    canRegenerate(state) {
      if (state.isGenerating || !state.currentConversationId) {
        return false;
      }

      const lastUserIndex = [...state.messages].reverse().findIndex((item) => item.role === 'user');
      return lastUserIndex >= 0;
    }
  },
  actions: {
    async loadConversations() {
      this.conversations = await listConversations();

      if (!this.currentConversationId && this.conversations.length > 0) {
        await this.selectConversation(this.conversations[0].id);
      }
    },

    async createNewConversation() {
      const conversation = await createConversation();
      this.conversations.unshift(conversation);
      this.currentConversationId = conversation.id;
      this.messages = [];
    },

    async selectConversation(id: number | string) {
      if (this.isGenerating) {
        this.stopGenerating();
      }

      const detail = await getConversation(id);
      this.currentConversationId = detail.id;
      this.messages = detail.messages;
    },

    async renameCurrentConversation(title: string) {
      if (!this.currentConversationId) {
        return;
      }

      const updated = await renameConversation(this.currentConversationId, title);
      this.conversations = this.conversations.map((item) => (item.id === updated.id ? updated : item));
    },

    async removeConversation(id: number | string) {
      await deleteConversation(id);
      this.conversations = this.conversations.filter((item) => item.id !== id);

      if (this.currentConversationId === id) {
        this.currentConversationId = null;
        this.messages = [];
        if (this.conversations.length > 0) {
          await this.selectConversation(this.conversations[0].id);
        }
      }
    },

    stopGenerating() {
      this.abortController?.abort();
      this.abortController = null;
      this.isGenerating = false;

      const lastAssistant = [...this.messages].reverse().find((item) => item.role === 'assistant' && item.status === 'streaming');
      if (lastAssistant) {
        lastAssistant.status = 'completed';
      }
    },

    async refreshCurrentConversation() {
      await this.loadConversations();
      if (this.currentConversationId) {
        await this.selectConversation(this.currentConversationId);
      }
    },

    createStreamingAssistantMessage(conversationId: number | string) {
      const assistantMessage: ChatMessage = {
        id: `local-assistant-${Date.now()}`,
        conversationId,
        role: 'assistant',
        content: '',
        status: 'streaming'
      };
      this.messages.push(assistantMessage);
      return assistantMessage.id;
    },

    appendAssistantToken(messageId: number | string, token: string) {
      const index = this.messages.findIndex((item) => item.id === messageId);
      if (index >= 0) {
        this.messages[index] = {
          ...this.messages[index],
          content: `${this.messages[index].content}${token}`
        };
      }
    },

    updateAssistantStatus(messageId: number | string, status: 'streaming' | 'completed' | 'failed') {
      const index = this.messages.findIndex((item) => item.id === messageId);
      if (index >= 0) {
        this.messages[index] = {
          ...this.messages[index],
          status
        };
      }
    },

    async sendMessage(content: string) {
      const trimmed = content.trim();
      if (!trimmed || this.isGenerating) {
        return;
      }

      if (!this.currentConversationId) {
        await this.createNewConversation();
      }

      const conversationId = this.currentConversationId!;
      const userMessage: ChatMessage = {
        id: `local-user-${Date.now()}`,
        conversationId,
        role: 'user',
        content: trimmed,
        status: 'completed'
      };
      const assistantMessageId = this.createStreamingAssistantMessage(conversationId);

      this.messages.splice(this.messages.length - 1, 0, userMessage);
      this.isGenerating = true;
      this.abortController = new AbortController();

      try {
        await streamChat(
          {
            conversationId,
            message: trimmed
          },
          {
            onToken: (token) => {
              this.appendAssistantToken(assistantMessageId, token);
            },
            onDone: async () => {
              this.updateAssistantStatus(assistantMessageId, 'completed');
              await this.refreshCurrentConversation();
            },
            onStopped: () => {
              this.updateAssistantStatus(assistantMessageId, 'completed');
            },
            onError: (message) => {
              this.updateAssistantStatus(assistantMessageId, 'failed');
              ElMessage.error(message);
            }
          },
          this.abortController.signal
        );
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          this.updateAssistantStatus(assistantMessageId, 'completed');
        } else {
          this.updateAssistantStatus(assistantMessageId, 'failed');
          ElMessage.error(error instanceof Error ? error.message : '发送失败');
        }
      } finally {
        this.abortController = null;
        this.isGenerating = false;
      }
    },

    async regenerateLastResponse() {
      if (!this.currentConversationId || this.isGenerating || !this.canRegenerate) {
        return;
      }

      const conversationId = this.currentConversationId;
      const lastAssistantIndex = [...this.messages].map((item, index) => ({ item, index })).reverse().find((entry) => entry.item.role === 'assistant')?.index;

      if (lastAssistantIndex !== undefined) {
        this.messages.splice(lastAssistantIndex, 1);
      }

      const assistantMessageId = this.createStreamingAssistantMessage(conversationId);
      this.isGenerating = true;
      this.abortController = new AbortController();

      try {
        await regenerateChat(
          {
            conversationId
          },
          {
            onToken: (token) => {
              this.appendAssistantToken(assistantMessageId, token);
            },
            onDone: async () => {
              this.updateAssistantStatus(assistantMessageId, 'completed');
              await this.refreshCurrentConversation();
            },
            onStopped: () => {
              this.updateAssistantStatus(assistantMessageId, 'completed');
            },
            onError: (message) => {
              this.updateAssistantStatus(assistantMessageId, 'failed');
              ElMessage.error(message);
            }
          },
          this.abortController.signal
        );
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          this.updateAssistantStatus(assistantMessageId, 'completed');
        } else {
          this.updateAssistantStatus(assistantMessageId, 'failed');
          ElMessage.error(error instanceof Error ? error.message : '重新生成失败');
        }
      } finally {
        this.abortController = null;
        this.isGenerating = false;
      }
    }
  }
});
