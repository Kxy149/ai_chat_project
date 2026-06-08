import { defineStore } from 'pinia';
import { loginApi, logoutApi, registerApi, updateAvatarApi, uploadAvatarApi, type AuthUser } from '@/services/authApi';

interface AuthState {
  token: string;
  user: AuthUser | null;
}

function readUser() {
  const raw = localStorage.getItem('auth_user');
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('auth_token') ?? '',
    user: readUser()
  }),
  getters: {
    isLoggedIn: (state) => Boolean(state.token)
  },
  actions: {
    setSession(token: string, user: AuthUser) {
      this.token = token;
      this.user = user;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
    },

    async login(account: string, password: string) {
      const result = await loginApi({ account, password });
      this.setSession(result.token, result.user);
    },

    async register(username: string, email: string, password: string) {
      const result = await registerApi({ username, email: email || undefined, password });
      this.setSession(result.token, result.user);
    },

    async logout() {
      if (this.token) {
        await logoutApi().catch(() => undefined);
      }

      this.token = '';
      this.user = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    },

    async updateAvatar(avatarUrl: string) {
      const result = await updateAvatarApi(avatarUrl);
      this.setSession(result.token, result.user);
    },

    async uploadAvatar(file: File) {
      const result = await uploadAvatarApi(file);
      this.setSession(result.token, result.user);
    }
  }
});
