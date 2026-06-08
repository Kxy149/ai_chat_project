<script setup lang="ts">
import { Promotion } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { useChatStore } from '@/stores/chatStore';

const chatStore = useChatStore();
const text = ref('');

async function submit() {
  const content = text.value;
  text.value = '';
  await chatStore.sendMessage(content);
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    submit();
  }
}
</script>

<template>
  <footer class="chat-input">
    <el-input
      v-model="text"
      type="textarea"
      :autosize="{ minRows: 2, maxRows: 6 }"
      resize="none"
      placeholder="输入你的问题，Enter 发送，Shift + Enter 换行"
      @keydown="handleKeydown"
    />
    <div class="chat-actions">
      <el-button v-if="chatStore.isGenerating" type="danger" @click="chatStore.stopGenerating">停止生成</el-button>
      <template v-else>
        <el-button :disabled="!chatStore.canRegenerate" @click="chatStore.regenerateLastResponse">重新生成</el-button>
        <el-tooltip content="发送">
          <el-button :icon="Promotion" type="primary" circle :disabled="!text.trim()" @click="submit" />
        </el-tooltip>
      </template>
    </div>
  </footer>
</template>
