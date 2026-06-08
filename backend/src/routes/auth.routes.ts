import { Router } from 'express';
import { login, logout, me, register, updatePassword, updateProfileAvatar, uploadProfileAvatar } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { avatarUpload } from '../middleware/upload.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authRouter = Router();

authRouter.post('/register', asyncHandler(register));
authRouter.post('/login', asyncHandler(login));
authRouter.get('/me', authMiddleware, me);
authRouter.patch('/password', authMiddleware, asyncHandler(updatePassword));
authRouter.patch('/avatar', authMiddleware, asyncHandler(updateProfileAvatar));
authRouter.post('/avatar/upload', authMiddleware, avatarUpload.single('avatar'), asyncHandler(uploadProfileAvatar));
authRouter.post('/logout', authMiddleware, logout);
