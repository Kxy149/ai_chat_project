<script setup lang="ts">
import { computed, nextTick, onUpdated, ref } from 'vue';
import MarkdownRenderer from '@/components/markdown/MarkdownRenderer.vue';
import { useChatStore } from '@/stores/chatStore';

const chatStore = useChatStore();
const listRef = ref<HTMLDivElement | null>(null);

const hasMessages = computed(() => chatStore.messages.length > 0);

onUpdated(async () => {
  await nextTick();
  if (listRef.value) {
    listRef.value.scrollTop = listRef.value.scrollHeight;
  }
});
</script>

<template>
  <section ref="listRef" class="message-list">
    <div v-if="!hasMessages" class="welcome-panel">
      <h2>开始一次学习对话</h2>
      <p>可以提问概念、让 AI 拆解代码、生成学习计划，或总结知识点。</p>
    </div>

    <article
      v-for="message in chatStore.messages"
      :key="message.id"
      class="message-item"
      :class="message.role"
    >
      <div class="message-role">{{ message.role === 'user' ? '我' : 'AI' }}</div>
      <div class="message-content">
        <MarkdownRenderer :content="message.content || (message.status === 'streaming' ? '正在思考...' : '')" />
      </div>
    </article>
  </section>
</template>
