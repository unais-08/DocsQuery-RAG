import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authRateLimit } from '../../middleware/auth-rate-limit.js';
import { getCurrentUser, loginUser, registerUser } from './auth.controller.js';

const authRouter = Router();

authRouter.post('/register', authRateLimit, registerUser);

authRouter.post('/login', authRateLimit, loginUser);

authRouter.get('/me', authenticate, getCurrentUser);

export { authRouter };
