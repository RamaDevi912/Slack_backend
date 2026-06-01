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
export const successResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    statusCode,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(response);
};

/**
 * Format error response
 */
export const errorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  errorCode: ErrorCode,
  details?: Record<string, any>,
): Response => {
  const response: ApiResponse = {
    success: false,
    statusCode,
    message,
    error: {
      code: errorCode,
      details,
    },
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(response);
};

/**
 * Format AppError response
 */
export const appErrorResponse = (res: Response, error: AppError): Response => {
  const details = (error as any).details;
  return errorResponse(
    res,
    error.statusCode,
    error.message,
    error.errorCode,
    details,
  );
};

/**
 * Generic error response handler
 */
export const handleErrorResponse = (res: Response, error: any): Response => {
  if (error instanceof AppError) {
    return appErrorResponse(res, error);
  }

  // Handle Joi validation errors
  if (error.isJoi) {
    return errorResponse(
      res,
      400,
      'Validation error',
      ErrorCode.VALIDATION_ERROR,
      {
        details: error.details?.map((d: any) => ({
          field: d.path.join('.'),
          message: d.message,
          type: d.type,
        })),
      },
    );
  }

  // Generic error
  return errorResponse(
    res,
    500,
    'Internal server error',
    ErrorCode.INTERNAL_SERVER_ERROR,
  );
};

// Re-export error types
export { AppError, ValidationError } from './errors.js';
