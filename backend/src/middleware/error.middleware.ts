import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export function errorMiddleware(error: unknown, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      message: '请求参数错误',
      issues: error.issues
    });
    return;
  }

  const message = error instanceof Error ? error.message : '服务器内部错误';
  res.status(500).json({ message });
}
