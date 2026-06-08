import type { Request, Response } from 'express';
import { z } from 'zod';
import { changePassword, loginUser, registerUser, updateAvatar } from '../services/auth.service.js';

export async function register(req: Request, res: Response) {
  const schema = z.object({
    username: z.string().min(2).max(50),
    email: z.string().email().optional().or(z.literal('')),
    password: z.string().min(6).max(64)
  });
  const payload = schema.parse(req.body);
  const result = await registerUser({
    username: payload.username,
    email: payload.email || undefined,
    password: payload.password
  });

  res.status(201).json(result);
}

export async function login(req: Request, res: Response) {
  const schema = z.object({
    account: z.string().min(1),
    password: z.string().min(1)
  });
  const payload = schema.parse(req.body);
  const result = await loginUser(payload.account, payload.password);

  res.json(result);
}

export function me(req: Request, res: Response) {
  res.json(req.user);
}

export function logout(req: Request, res: Response) {
  res.status(204).send();
}

export async function updateProfileAvatar(req: Request, res: Response) {
  const schema = z.object({
    avatarUrl: z.string().min(1).max(500)
  });
  const payload = schema.parse(req.body);
  const result = await updateAvatar(req.user!.id, payload.avatarUrl);
  res.json(result);
}

export async function uploadProfileAvatar(req: Request, res: Response) {
  if (!req.file) {
    res.status(400).json({ message: '请选择头像图片' });
    return;
  }

  const avatarUrl = `/uploads/avatars/${req.file.filename}`;
  const result = await updateAvatar(req.user!.id, avatarUrl);
  res.json(result);
}

export async function updatePassword(req: Request, res: Response) {
  const schema = z
    .object({
      oldPassword: z.string().min(1),
      newPassword: z.string().min(6).max(64),
      confirmPassword: z.string().min(6).max(64)
    })
    .refine((value) => value.newPassword === value.confirmPassword, {
      message: '两次输入的新密码不一致',
      path: ['confirmPassword']
    });
  const payload = schema.parse(req.body);

  await changePassword(req.user!.id, payload.oldPassword, payload.newPassword);
  res.status(204).send();
}
