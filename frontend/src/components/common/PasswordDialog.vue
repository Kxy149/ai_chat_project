<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { changePasswordApi } from '@/services/authApi';

const visible = defineModel<boolean>('visible', { required: true });
const loading = ref(false);
const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

function resetForm() {
  form.oldPassword = '';
  form.newPassword = '';
  form.confirmPassword = '';
}

async function submit() {
  if (form.newPassword !== form.confirmPassword) {
    ElMessage.error('两次输入的新密码不一致');
    return;
  }

  loading.value = true;
  try {
    await changePasswordApi({
      oldPassword: form.oldPassword,
      newPassword: form.newPassword,
      confirmPassword: form.confirmPassword
    });
    ElMessage.success('密码已修改');
    resetForm();
    visible.value = false;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '修改密码失败');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <el-dialog v-model="visible" title="修改密码" width="420px" @closed="resetForm">
    <el-form class="password-form" @submit.prevent="submit">
      <el-form-item>
        <el-input v-model="form.oldPassword" placeholder="旧密码" show-password type="password" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.newPassword" placeholder="新密码，至少 6 位" show-password type="password" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.confirmPassword" placeholder="确认新密码" show-password type="password" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="submit">保存</el-button>
    </template>
  </el-dialog>
</template>
