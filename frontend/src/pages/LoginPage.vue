<script setup lang="ts">
import { Lock, User } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();
const mode = ref<'login' | 'register'>('login');
const loading = ref(false);
const form = reactive({
  account: 'admin',
  username: '',
  email: '',
  password: '123456'
});

function fillDemoAccount() {
  mode.value = 'login';
  form.account = 'admin';
  form.password = '123456';
}

async function submit() {
  loading.value = true;

  try {
    if (mode.value === 'login') {
      await authStore.login(form.account, form.password);
    } else {
      await authStore.register(form.username, form.email, form.password);
    }

    ElMessage.success(mode.value === 'login' ? '登录成功' : '注册成功');
    await router.push('/');
  } catch (error) {
    const message = error instanceof Error ? error.message : '操作失败';
    ElMessage.error(message);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-panel">
      <div class="auth-brand">
        <h1>AI 学习助手</h1>
        <p>登录后管理你的学习会话与历史记录</p>
      </div>

      <div class="demo-account">
        <span>演示账号：admin / 123456</span>
        <el-button link type="primary" @click="fillDemoAccount">填入</el-button>
      </div>

      <el-tabs v-model="mode" stretch>
        <el-tab-pane label="登录" name="login">
          <el-form class="auth-form" @submit.prevent="submit">
            <el-form-item>
              <el-input v-model="form.account" :prefix-icon="User" placeholder="用户名或邮箱" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="form.password" :prefix-icon="Lock" placeholder="密码" show-password type="password" />
            </el-form-item>
            <el-button class="auth-submit" type="primary" :loading="loading" @click="submit">登录</el-button>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="注册" name="register">
          <el-form class="auth-form" @submit.prevent="submit">
            <el-form-item>
              <el-input v-model="form.username" :prefix-icon="User" placeholder="用户名" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="form.email" placeholder="邮箱，可选" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="form.password" :prefix-icon="Lock" placeholder="密码，至少 6 位" show-password type="password" />
            </el-form-item>
            <el-button class="auth-submit" type="primary" :loading="loading" @click="submit">注册并登录</el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </section>
  </main>
</template>
