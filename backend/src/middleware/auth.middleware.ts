import type { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../services/auth.service.js';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : '';

  if (!token) {
    res.status(401).json({ message: '请先登录' });
    return;
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ message: '登录已过期，请重新登录' });
  }
}
