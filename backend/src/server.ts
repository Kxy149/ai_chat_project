import cors from 'cors';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { env } from './config/env.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { authRouter } from './routes/auth.routes.js';
import { chatRouter } from './routes/chat.routes.js';
import { conversationRouter } from './routes/conversation.routes.js';
import { authMiddleware } from './middleware/auth.middleware.js';
import { ensureDemoAdmin } from './services/bootstrap.service.js';

const app = express();
const uploadsDir = path.resolve(process.cwd(), 'uploads', 'avatars');

fs.mkdirSync(uploadsDir, { recursive: true });

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true
  })
);
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    provider: env.aiProvider
  });
});

app.use('/api/auth', authRouter);
app.use('/api/chat', authMiddleware, chatRouter);
app.use('/api/conversations', authMiddleware, conversationRouter);
app.use(errorMiddleware);

ensureDemoAdmin()
  .catch((error) => {
    console.warn('Demo admin initialization skipped:', error instanceof Error ? error.message : error);
  })
  .finally(() => {
    app.listen(env.port, () => {
      console.log(`API server is running at http://localhost:${env.port}`);
    });
  });
