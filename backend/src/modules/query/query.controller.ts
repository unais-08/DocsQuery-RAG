import { Request, Response, NextFunction } from "express";
import { querySchema } from "./query.validation.js";
import { generateQuestionEmbedding } from "./query.service.js";

export const query = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { question } = querySchema.parse(request.body);
    const result = await generateQuestionEmbedding(question, request.userId);

    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
};