import type { NextFunction, Request, Response } from 'express';
import { getDashboardStats } from './dashboard.service.js';

export const stats = async (request: Request, response: Response, next: NextFunction) => {
  try {
    response.status(200).json(await getDashboardStats(request.userId));
  } catch (error) {
    next(error);
  }
};