import type { NextFunction, Request, Response } from 'express';
import { getUserById, login, register } from './auth.service.js';
import { loginSchema, registerSchema } from './auth.schemas.js';

export const registerUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const input = registerSchema.parse(request.body);
    response.status(201).json(await register(input));
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const input = loginSchema.parse(request.body);
    response.status(200).json(await login(input));
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    response.status(200).json({ user: await getUserById(request.userId) });
  } catch (error) {
    next(error);
  }
};