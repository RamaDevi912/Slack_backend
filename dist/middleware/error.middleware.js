import { AppError } from '../utils/errors.js';
/**
 * Global error handling middleware
 */
export const errorHandler = (err, req, res, _next) => {
    // Log error
    console.error({
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString(),
    });
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            statusCode: err.statusCode,
            message: err.message,
            error: {
                code: err.errorCode,
            },
            timestamp: new Date().toISOString(),
        });
    }
    // Prisma errors
    if (err.name === 'PrismaClientKnownRequestError') {
        const statusCode = 400;
        let message = 'Database error';
        if (err.code === 'P2002') {
            message = `${err.meta?.target?.[0]} already exists`;
        }
        else if (err.code === 'P2025') {
            message = 'Resource not found';
        }
        return res.status(statusCode).json({
            success: false,
            statusCode,
            message,
            error: {
                code: 'DATABASE_ERROR',
            },
            timestamp: new Date().toISOString(),
        });
    }
    // Default error
    return res.status(500).json({
        success: false,
        statusCode: 500,
        message: 'Internal server error',
        error: {
            code: 'INTERNAL_SERVER_ERROR',
        },
        timestamp: new Date().toISOString(),
    });
};
/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res, _next) => {
    res.status(404).json({
        success: false,
        statusCode: 404,
        message: `Route ${req.originalUrl} not found`,
        error: {
            code: 'NOT_FOUND',
        },
        timestamp: new Date().toISOString(),
    });
};
//# sourceMappingURL=error.middleware.js.map