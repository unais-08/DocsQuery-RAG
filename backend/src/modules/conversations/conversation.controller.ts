import type { NextFunction, Request, Response } from 'express';
import { conversationIdSchema, updateConversationSchema } from './conversation.validation.js';
import {
  createConversation,
  deleteConversation,
  getConversation,
  listConversations,
  updateConversation
} from './conversation.service.js';

export const create = async (request: Request, response: Response, next: NextFunction) => {
  try { response.status(201).json(await createConversation(request.userId)); } catch (error) { next(error); }
};

export const list = async (request: Request, response: Response, next: NextFunction) => {
  try { response.status(200).json(await listConversations(request.userId)); } catch (error) { next(error); }
};

export const getById = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const id = conversationIdSchema.parse(request.params.id);
    response.status(200).json(await getConversation(request.userId, id));
  } catch (error) { next(error); }
};

export const rename = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const id = conversationIdSchema.parse(request.params.id);
    const { title } = updateConversationSchema.parse(request.body);
    response.status(200).json(await updateConversation(request.userId, id, title));
  } catch (error) { next(error); }
};

export const remove = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const id = conversationIdSchema.parse(request.params.id);
    await deleteConversation(request.userId, id);
    response.status(204).send();
  } catch (error) { next(error); }
};
