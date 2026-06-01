import { AppError, ErrorCode } from './errors.js';
/**
 * Format success response
 */
export const successResponse = (res, statusCode, message, data) => {
    const response = {
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
export const errorResponse = (res, statusCode, message, errorCode, details) => {
    const response = {
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
export const appErrorResponse = (res, error) => {
    const details = error.details;
    return errorResponse(res, error.statusCode, error.message, error.errorCode, details);
};
/**
 * Generic error response handler
 */
export const handleErrorResponse = (res, error) => {
    if (error instanceof AppError) {
        return appErrorResponse(res, error);
    }
    // Handle Joi validation errors
    if (error.isJoi) {
        return errorResponse(res, 400, 'Validation error', ErrorCode.VALIDATION_ERROR, {
            details: error.details?.map((d) => ({
                field: d.path.join('.'),
                message: d.message,
                type: d.type,
            })),
        });
    }
    // Generic error
    return errorResponse(res, 500, 'Internal server error', ErrorCode.INTERNAL_SERVER_ERROR);
};
// Re-export error types
export { AppError, ValidationError } from './errors.js';
//# sourceMappingURL=response.js.map