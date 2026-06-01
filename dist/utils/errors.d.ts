/**
 * Custom Error Classes for the application
 */
export declare enum ErrorCode {
    UNAUTHORIZED = "UNAUTHORIZED",
    FORBIDDEN = "FORBIDDEN",
    TOKEN_EXPIRED = "TOKEN_EXPIRED",
    INVALID_TOKEN = "INVALID_TOKEN",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    INVALID_INPUT = "INVALID_INPUT",
    NOT_FOUND = "NOT_FOUND",
    USER_NOT_FOUND = "USER_NOT_FOUND",
    WORKSPACE_NOT_FOUND = "WORKSPACE_NOT_FOUND",
    CHANNEL_NOT_FOUND = "CHANNEL_NOT_FOUND",
    MESSAGE_NOT_FOUND = "MESSAGE_NOT_FOUND",
    CALL_NOT_FOUND = "CALL_NOT_FOUND",
    FILE_NOT_FOUND = "FILE_NOT_FOUND",
    CONFLICT = "CONFLICT",
    EMAIL_EXISTS = "EMAIL_EXISTS",
    USERNAME_EXISTS = "USERNAME_EXISTS",
    WORKSPACE_SLUG_EXISTS = "WORKSPACE_SLUG_EXISTS",
    CHANNEL_EXISTS = "CHANNEL_EXISTS",
    DUPLICATE_MEMBER = "DUPLICATE_MEMBER",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
    DATABASE_ERROR = "DATABASE_ERROR",
    FILE_UPLOAD_ERROR = "FILE_UPLOAD_ERROR",
    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
    INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",
    ADMIN_ACCESS_REQUIRED = "ADMIN_ACCESS_REQUIRED",
    OWNER_ACCESS_REQUIRED = "OWNER_ACCESS_REQUIRED"
}
export declare class AppError extends Error {
    readonly statusCode: number;
    readonly errorCode: ErrorCode;
    readonly isOperational: boolean;
    constructor(message: string, statusCode: number, errorCode: ErrorCode, isOperational?: boolean);
}
export declare class ValidationError extends AppError {
    readonly details?: Record<string, any>;
    constructor(message: string, details?: Record<string, any>);
}
export declare class AuthenticationError extends AppError {
    constructor(message?: string);
}
export declare class AuthorizationError extends AppError {
    constructor(message?: string);
}
export declare class NotFoundError extends AppError {
    constructor(resource?: string);
}
export declare class ConflictError extends AppError {
    constructor(message: string, errorCode?: ErrorCode);
}
export declare class RateLimitError extends AppError {
    constructor(message?: string);
}
export declare class DatabaseError extends AppError {
    constructor(message?: string);
}
export declare class FileUploadError extends AppError {
    constructor(message?: string);
}
export declare class InternalServerError extends AppError {
    constructor(message?: string);
}
//# sourceMappingURL=errors.d.ts.map