import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
/**
 * Middleware factory for request body validation
 */
export declare const validateRequest: (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Middleware factory for query validation
 */
export declare const validateQuery: (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Middleware factory for params validation
 */
export declare const validateParams: (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=validation.middleware.d.ts.map