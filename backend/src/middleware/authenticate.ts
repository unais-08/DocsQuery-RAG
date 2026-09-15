import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AuthError } from '../modules/auth/auth.service.js';

export const authenticate: RequestHandler = (request, _response, next) => {
  const authorization = request.get('authorization');
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined;

  if (!token) {
    next(new AuthError('Authentication is required', 401, 'UNAUTHENTICATED'));
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    if (typeof payload === 'string' || typeof payload.sub !== 'string') {
      throw new Error('Invalid token payload');
    }
    request.userId = payload.sub;
    next();
  } catch {
    next(new AuthError('Invalid or expired token', 401, 'INVALID_TOKEN'));
  }
};
