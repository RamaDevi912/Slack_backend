import { NextFunction, Request, Response } from 'express';
/**
 * Global error handling middleware
 */
export declare const errorHandler: (err: any, req: Request, res: Response, _next: NextFunction) => Response<any, Record<string, any>>;
/**
 * 404 Not Found handler
 */
export declare const notFoundHandler: (req: Request, res: Response, _next: NextFunction) => void;
//# sourceMappingURL=error.middleware.d.ts.map