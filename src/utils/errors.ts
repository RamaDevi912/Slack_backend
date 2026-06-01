/**
 * Custom Error Classes for the application
 */

export enum ErrorCode {
  // Authentication & Authorization
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',

  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',

  // Resource Not Found
  NOT_FOUND = 'NOT_FOUND',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  WORKSPACE_NOT_FOUND = 'WORKSPACE_NOT_FOUND',
  CHANNEL_NOT_FOUND = 'CHANNEL_NOT_FOUND',
  MESSAGE_NOT_FOUND = 'MESSAGE_NOT_FOUND',
  CALL_NOT_FOUND = 'CALL_NOT_FOUND',
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',

  // Conflict
  CONFLICT = 'CONFLICT',
  EMAIL_EXISTS = 'EMAIL_EXISTS',
  USERNAME_EXISTS = 'USERNAME_EXISTS',
  WORKSPACE_SLUG_EXISTS = 'WORKSPACE_SLUG_EXISTS',
  CHANNEL_EXISTS = 'CHANNEL_EXISTS',
  DUPLICATE_MEMBER = 'DUPLICATE_MEMBER',

  // Server Error
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  FILE_UPLOAD_ERROR = 'FILE_UPLOAD_ERROR',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // Permission
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  ADMIN_ACCESS_REQUIRED = 'ADMIN_ACCESS_REQUIRED',
  OWNER_ACCESS_REQUIRED = 'OWNER_ACCESS_REQUIRED',
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: ErrorCode;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number,
    errorCode: ErrorCode,
    isOperational: boolean = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public readonly details?: Record<string, any>;

  constructor(message: string, details?: Record<string, any>) {
    super(message, 400, ErrorCode.VALIDATION_ERROR);
    this.details = details;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, ErrorCode.UNAUTHORIZED);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403, ErrorCode.FORBIDDEN);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, ErrorCode.NOT_FOUND);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, errorCode: ErrorCode = ErrorCode.CONFLICT) {
    super(message, 409, errorCode);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests. Please try again later.') {
    super(message, 429, ErrorCode.RATE_LIMIT_EXCEEDED);
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, ErrorCode.DATABASE_ERROR, false);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

export class FileUploadError extends AppError {
  constructor(message: string = 'File upload failed') {
    super(message, 400, ErrorCode.FILE_UPLOAD_ERROR);
    Object.setPrototypeOf(this, FileUploadError.prototype);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(message, 500, ErrorCode.INTERNAL_SERVER_ERROR, false);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
