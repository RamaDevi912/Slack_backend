import { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../utils/errors.js';

/**
 * Capture missing route targets and throw a clean NotFoundError
 */
export const notFoundMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl}`));
};
