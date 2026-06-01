import { NotFoundError } from '../utils/errors.js';
/**
 * Capture missing route targets and throw a clean NotFoundError
 */
export const notFoundMiddleware = (req, _res, next) => {
    next(new NotFoundError(`Route ${req.method} ${req.originalUrl}`));
};
//# sourceMappingURL=notFound.middleware.js.map