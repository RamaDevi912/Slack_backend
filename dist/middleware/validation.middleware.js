import { ValidationError } from '../utils/errors.js';
/**
 * Middleware factory for request body validation
 */
export const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            const { error, value } = schema.validate(req.body || {}, {
                abortEarly: false,
                stripUnknown: true,
            });
            if (error) {
                const details = error.details.reduce((acc, detail) => {
                    const key = detail.path.join('.');
                    acc[key] = detail.message;
                    return acc;
                }, {});
                throw new ValidationError('Validation error', details);
            }
            req.body = value;
            next();
        }
        catch (err) {
            if (err instanceof ValidationError) {
                res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: err.message,
                    error: {
                        code: 'VALIDATION_ERROR',
                        details: err.details,
                    },
                    timestamp: new Date().toISOString(),
                });
            }
            else {
                next(err);
            }
        }
    };
};
/**
 * Middleware factory for query validation
 */
export const validateQuery = (schema) => {
    return async (req, res, next) => {
        try {
            const { error, value } = schema.validate(req.query || {}, {
                abortEarly: false,
                stripUnknown: true,
            });
            if (error) {
                const details = error.details.reduce((acc, detail) => {
                    const key = detail.path.join('.');
                    acc[key] = detail.message;
                    return acc;
                }, {});
                throw new ValidationError('Query validation error', details);
            }
            req.query = value;
            next();
        }
        catch (err) {
            if (err instanceof ValidationError) {
                res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: err.message,
                    error: {
                        code: 'VALIDATION_ERROR',
                        details: err.details,
                    },
                    timestamp: new Date().toISOString(),
                });
            }
            else {
                next(err);
            }
        }
    };
};
/**
 * Middleware factory for params validation
 */
export const validateParams = (schema) => {
    return async (req, res, next) => {
        try {
            const { error, value } = schema.validate(req.params || {}, {
                abortEarly: false,
                stripUnknown: true,
            });
            if (error) {
                const details = error.details.reduce((acc, detail) => {
                    const key = detail.path.join('.');
                    acc[key] = detail.message;
                    return acc;
                }, {});
                throw new ValidationError('Parameter validation error', details);
            }
            req.params = value;
            next();
        }
        catch (err) {
            if (err instanceof ValidationError) {
                res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: err.message,
                    error: {
                        code: 'VALIDATION_ERROR',
                        details: err.details,
                    },
                    timestamp: new Date().toISOString(),
                });
            }
            else {
                next(err);
            }
        }
    };
};
//# sourceMappingURL=validation.middleware.js.map