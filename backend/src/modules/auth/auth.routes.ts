import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authRateLimit } from '../../middleware/auth-rate-limit.js';
import { getUserById, login, register } from './auth.service.js';
import { loginSchema, registerSchema } from './auth.schemas.js';

const authRouter = Router();

authRouter.post('/register', authRateLimit, async (request, response, next) => {
  try {
    const input = registerSchema.parse(request.body);
    response.status(201).json(await register(input));
  } catch (error) {
    next(error);
  }
});

authRouter.post('/login', authRateLimit, async (request, response, next) => {
  try {
    const input = loginSchema.parse(request.body);
    response.status(200).json(await login(input));
  } catch (error) {
    next(error);
  }
});

authRouter.get('/me', authenticate, async (request, response, next) => {
  try {
    response.status(200).json({ user: await getUserById(request.userId) });
  } catch (error) {
    next(error);
  }
});

export { authRouter };
