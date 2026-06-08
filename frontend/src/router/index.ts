import { createRouter, createWebHistory } from 'vue-router';
import ChatPage from '@/pages/ChatPage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import { useAuthStore } from '@/stores/authStore';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'chat',
      component: ChatPage,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    }
  ]
});

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return '/login';
  }

  if (to.path === '/login' && authStore.isLoggedIn) {
    return '/';
  }

  return true;
});

export default router;
