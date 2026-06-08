export interface JwtUser {
  id: number;
  username: string;
  email?: string | null;
  avatarUrl?: string | null;
}

export interface User {
  id: number;
  username: string;
  email?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
}
