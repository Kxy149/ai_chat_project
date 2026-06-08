import { http } from '@/services/http';

export interface AuthUser {
  id: number;
  username: string;
  email?: string | null;
  avatarUrl?: string | null;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export async function loginApi(payload: { account: string; password: string }) {
  const { data } = await http.post<AuthResponse>('/api/auth/login', payload);
  return data;
}

export async function registerApi(payload: { username: string; email?: string; password: string }) {
  const { data } = await http.post<AuthResponse>('/api/auth/register', payload);
  return data;
}

export async function logoutApi() {
  await http.post('/api/auth/logout');
}

export async function updateAvatarApi(avatarUrl: string) {
  const { data } = await http.patch<AuthResponse>('/api/auth/avatar', { avatarUrl });
  return data;
}

export async function uploadAvatarApi(file: File) {
  const formData = new FormData();
  formData.append('avatar', file);
  const { data } = await http.post<AuthResponse>('/api/auth/avatar/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
}

export async function changePasswordApi(payload: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  await http.patch('/api/auth/password', payload);
}
