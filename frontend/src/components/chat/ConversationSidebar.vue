<script setup lang="ts">
import { Delete, Edit, Key, Plus, Search, SwitchButton } from '@element-plus/icons-vue';
import { ElMessageBox } from 'element-plus';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import AvatarDialog from '@/components/common/AvatarDialog.vue';
import PasswordDialog from '@/components/common/PasswordDialog.vue';
import UserAvatar from '@/components/common/UserAvatar.vue';
import { useAuthStore } from '@/stores/authStore';
import { useChatStore } from '@/stores/chatStore';
import type { Conversation } from '@/types/chat';

const chatStore = useChatStore();
const authStore = useAuthStore();
const router = useRouter();
const avatarDialogVisible = ref(false);
const passwordDialogVisible = ref(false);
const keyword = ref('');

const filteredConversations = computed(() => {
  const value = keyword.value.trim().toLowerCase();

  if (!value) {
    return chatStore.conversations;
  }

  return chatStore.conversations.filter((item) => item.title.toLowerCase().includes(value));
});

async function rename(item: Conversation) {
  const { value } = await ElMessageBox.prompt('请输入新的会话名称', '重命名会话', {
    inputValue: item.title,
    confirmButtonText: '保存',
    cancelButtonText: '取消'
  });

  chatStore.currentConversationId = item.id;
  await chatStore.renameCurrentConversation(value);
}

async function remove(item: Conversation) {
  await ElMessageBox.confirm(`确定删除「${item.title}」吗？`, '删除会话', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  });
  await chatStore.removeConversation(item.id);
}

async function createConversation() {
  keyword.value = '';
  await chatStore.createNewConversation();
}

async function logout() {
  await authStore.logout();
  await router.push('/login');
}
</script>

<template>
  <aside class="conversation-sidebar">
    <div class="sidebar-header">
      <div>
        <h1>AI 学习助手</h1>
        <p>智能问答与学习记录</p>
      </div>
      <el-tooltip content="新建会话">
        <el-button :icon="Plus" circle type="primary" @click="createConversation" />
      </el-tooltip>
    </div>

    <div class="conversation-search">
      <el-input v-model="keyword" :prefix-icon="Search" clearable placeholder="搜索会话" />
    </div>

    <div class="conversation-list">
      <button
        v-for="item in filteredConversations"
        :key="item.id"
        class="conversation-item"
        :class="{ active: item.id === chatStore.currentConversationId }"
        @click="chatStore.selectConversation(item.id)"
      >
        <span class="conversation-title">{{ item.title }}</span>
        <span class="conversation-actions" @click.stop>
          <el-tooltip content="重命名">
            <el-button :icon="Edit" size="small" text @click="rename(item)" />
          </el-tooltip>
          <el-tooltip content="删除">
            <el-button :icon="Delete" size="small" text @click="remove(item)" />
          </el-tooltip>
        </span>
      </button>

      <el-empty v-if="chatStore.conversations.length === 0" description="暂无会话" :image-size="88" />
      <el-empty v-else-if="filteredConversations.length === 0" description="没有匹配的会话" :image-size="88" />
    </div>

    <div class="sidebar-footer">
      <button class="user-profile-button" type="button" @click="avatarDialogVisible = true">
        <UserAvatar :username="authStore.user?.username" :avatar-url="authStore.user?.avatarUrl" :size="34" />
        <span class="current-user">{{ authStore.user?.username || '未登录' }}</span>
      </button>
      <el-tooltip content="修改密码">
        <el-button :icon="Key" text @click="passwordDialogVisible = true" />
      </el-tooltip>
      <el-tooltip content="注销">
        <el-button :icon="SwitchButton" text @click="logout" />
      </el-tooltip>
    </div>

    <AvatarDialog v-model:visible="avatarDialogVisible" />
    <PasswordDialog v-model:visible="passwordDialogVisible" />
  </aside>
</template>
