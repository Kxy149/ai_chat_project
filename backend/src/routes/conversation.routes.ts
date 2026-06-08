import { Router } from 'express';
import { create, detail, list, remove, update } from '../controllers/conversation.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const conversationRouter = Router();

conversationRouter.get('/', asyncHandler(list));
conversationRouter.post('/', asyncHandler(create));
conversationRouter.get('/:id', asyncHandler(detail));
conversationRouter.patch('/:id', asyncHandler(update));
conversationRouter.delete('/:id', asyncHandler(remove));
