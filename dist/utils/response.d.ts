import { Response } from 'express';
import { AppError, ErrorCode } from './errors.js';
export interface ApiResponse<T = any> {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T;
    error?: {
        code: ErrorCode;
        details?: Record<string, any>;
    };
    timestamp: string;
}
/**
 * Format success response
 */
export declare const successResponse: <T>(res: Response, statusCode: number, message: string, data?: T) => Response;
/**
 * Format error response
 */
export declare const errorResponse: (res: Response, statusCode: number, message: string, errorCode: ErrorCode, details?: Record<string, any>) => Response;
/**
 * Format AppError response
 */
export declare const appErrorResponse: (res: Response, error: AppError) => Response;
/**
 * Generic error response handler
 */
export declare const handleErrorResponse: (res: Response, error: any) => Response;
export { AppError, ValidationError } from './errors.js';
//# sourceMappingURL=response.d.ts.map