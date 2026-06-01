import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter
 * 100 requests per 15 minutes
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Auth rate limiter
 * 5 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Message rate limiter
 * 30 messages per minute
 */
export const messageLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: 'Too many messages, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * File upload rate limiter
 * 10 uploads per hour
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Too many file uploads, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Search rate limiter
 * 30 searches per minute
 */
export const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: 'Too many search requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
