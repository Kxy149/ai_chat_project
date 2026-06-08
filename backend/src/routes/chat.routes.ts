import { Router } from 'express';
import { regenerate, stream } from '../controllers/chat.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const chatRouter = Router();

chatRouter.post('/stream', asyncHandler(stream));
chatRouter.post('/regenerate', asyncHandler(regenerate));
