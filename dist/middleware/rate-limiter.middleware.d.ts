/**
 * General API rate limiter
 * 100 requests per 15 minutes
 */
export declare const apiLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Auth rate limiter
 * 5 requests per 15 minutes per IP
 */
export declare const authLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Message rate limiter
 * 30 messages per minute
 */
export declare const messageLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * File upload rate limiter
 * 10 uploads per hour
 */
export declare const uploadLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Search rate limiter
 * 30 searches per minute
 */
export declare const searchLimiter: import("express-rate-limit").RateLimitRequestHandler;
//# sourceMappingURL=rate-limiter.middleware.d.ts.map