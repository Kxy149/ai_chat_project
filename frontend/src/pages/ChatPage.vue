<script setup lang="ts">
import { onMounted } from 'vue';
import ChatInput from '@/components/chat/ChatInput.vue';
import ConversationSidebar from '@/components/chat/ConversationSidebar.vue';
import MessageList from '@/components/chat/MessageList.vue';
import { useChatStore } from '@/stores/chatStore';

const chatStore = useChatStore();

onMounted(async () => {
  await chatStore.loadConversations();
});
</script>

<template>
  <main class="chat-page">
    <ConversationSidebar />
    <section class="chat-workspace">
      <MessageList />
      <ChatInput />
    </section>
  </main>
</template>
