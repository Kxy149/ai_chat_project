import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { createUser, findUserById, findUserByUsernameOrEmail, updateUserAvatar, updateUserPassword } from '../storage/user.storage.js';
import type { JwtUser } from '../types/user.js';

function signToken(user: JwtUser) {
  return jwt.sign(user, env.jwtSecret, {
    expiresIn: '7d'
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.jwtSecret) as JwtUser;
}

export async function registerUser(params: {
  username: string;
  email?: string;
  password: string;
}) {
  const existing = await findUserByUsernameOrEmail(params.username);
  if (existing) {
    throw new Error('用户名已存在');
  }

  if (params.email) {
    const emailUser = await findUserByUsernameOrEmail(params.email);
    if (emailUser) {
      throw new Error('邮箱已存在');
    }
  }

  const passwordHash = await bcrypt.hash(params.password, 10);
  const user = await createUser({
    username: params.username,
    email: params.email,
    passwordHash
  });

  if (!user) {
    throw new Error('注册失败');
  }

  return {
    user,
    token: signToken({ id: user.id, username: user.username, email: user.email, avatarUrl: user.avatarUrl })
  };
}

export async function loginUser(account: string, password: string) {
  const row = await findUserByUsernameOrEmail(account);

  if (!row || !row.password_hash) {
    throw new Error('账号或密码错误');
  }

  const valid = await bcrypt.compare(password, row.password_hash);
  if (!valid) {
    throw new Error('账号或密码错误');
  }

  const user = await findUserById(row.id);
  if (!user) {
    throw new Error('用户不存在');
  }

  return {
    user,
    token: signToken({ id: user.id, username: user.username, email: user.email, avatarUrl: user.avatarUrl })
  };
}

export async function updateAvatar(userId: number, avatarUrl: string) {
  const user = await updateUserAvatar(userId, avatarUrl);

  if (!user) {
    throw new Error('用户不存在');
  }

  return {
    user,
    token: signToken({ id: user.id, username: user.username, email: user.email, avatarUrl: user.avatarUrl })
  };
}

export async function changePassword(userId: number, oldPassword: string, newPassword: string) {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error('用户不存在');
  }

  const row = await findUserByUsernameOrEmail(user.username);
  if (!row?.password_hash) {
    throw new Error('当前账号未设置密码');
  }

  const valid = await bcrypt.compare(oldPassword, row.password_hash);
  if (!valid) {
    throw new Error('旧密码不正确');
  }

  const samePassword = await bcrypt.compare(newPassword, row.password_hash);
  if (samePassword) {
    throw new Error('新密码不能与旧密码相同');
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await updateUserPassword(userId, passwordHash);
}
