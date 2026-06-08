<script setup lang="ts">
import { Upload } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import UserAvatar from '@/components/common/UserAvatar.vue';
import { useAuthStore } from '@/stores/authStore';

const visible = defineModel<boolean>('visible', { required: true });
const authStore = useAuthStore();
const uploading = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

const presets = [
  { value: 'preset:blue', label: '蓝色' },
  { value: 'preset:teal', label: '青色' },
  { value: 'preset:rose', label: '玫红' },
  { value: 'preset:amber', label: '琥珀' },
  { value: 'preset:violet', label: '紫色' },
  { value: 'preset:slate', label: '灰蓝' }
];

function openFilePicker() {
  fileInputRef.value?.click();
}

async function selectPreset(value: string) {
  await authStore.updateAvatar(value);
  ElMessage.success('头像已更新');
  visible.value = false;
}

async function uploadLocalAvatar(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';

  if (!file) {
    return;
  }

  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件');
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过 2MB');
    return;
  }

  uploading.value = true;
  try {
    await authStore.uploadAvatar(file);
    ElMessage.success('头像已上传');
    visible.value = false;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '头像上传失败');
  } finally {
    uploading.value = false;
  }
}
</script>

<template>
  <el-dialog v-model="visible" title="设置头像" width="420px">
    <div class="avatar-dialog">
      <div class="avatar-preview">
        <UserAvatar :username="authStore.user?.username" :avatar-url="authStore.user?.avatarUrl" :size="72" />
        <span>{{ authStore.user?.username }}</span>
      </div>

      <div class="preset-grid">
        <button v-for="item in presets" :key="item.value" class="preset-option" type="button" @click="selectPreset(item.value)">
          <UserAvatar :username="authStore.user?.username" :avatar-url="item.value" :size="42" />
          <span>{{ item.label }}</span>
        </button>
      </div>

      <div class="upload-row">
        <input ref="fileInputRef" accept="image/*" class="hidden-file-input" type="file" @change="uploadLocalAvatar" />
        <el-button :icon="Upload" :loading="uploading" type="primary" @click="openFilePicker">从本地选择图片</el-button>
      </div>
    </div>
  </el-dialog>
</template>
