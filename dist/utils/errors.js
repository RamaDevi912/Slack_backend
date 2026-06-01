/**
 * Custom Error Classes for the application
 */
export var ErrorCode;
(function (ErrorCode) {
    // Authentication & Authorization
    ErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
    ErrorCode["FORBIDDEN"] = "FORBIDDEN";
    ErrorCode["TOKEN_EXPIRED"] = "TOKEN_EXPIRED";
    ErrorCode["INVALID_TOKEN"] = "INVALID_TOKEN";
    // Validation
    ErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ErrorCode["INVALID_INPUT"] = "INVALID_INPUT";
    // Resource Not Found
    ErrorCode["NOT_FOUND"] = "NOT_FOUND";
    ErrorCode["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    ErrorCode["WORKSPACE_NOT_FOUND"] = "WORKSPACE_NOT_FOUND";
    ErrorCode["CHANNEL_NOT_FOUND"] = "CHANNEL_NOT_FOUND";
    ErrorCode["MESSAGE_NOT_FOUND"] = "MESSAGE_NOT_FOUND";
    ErrorCode["CALL_NOT_FOUND"] = "CALL_NOT_FOUND";
    ErrorCode["FILE_NOT_FOUND"] = "FILE_NOT_FOUND";
    // Conflict
    ErrorCode["CONFLICT"] = "CONFLICT";
    ErrorCode["EMAIL_EXISTS"] = "EMAIL_EXISTS";
    ErrorCode["USERNAME_EXISTS"] = "USERNAME_EXISTS";
    ErrorCode["WORKSPACE_SLUG_EXISTS"] = "WORKSPACE_SLUG_EXISTS";
    ErrorCode["CHANNEL_EXISTS"] = "CHANNEL_EXISTS";
    ErrorCode["DUPLICATE_MEMBER"] = "DUPLICATE_MEMBER";
    // Server Error
    ErrorCode["INTERNAL_SERVER_ERROR"] = "INTERNAL_SERVER_ERROR";
    ErrorCode["DATABASE_ERROR"] = "DATABASE_ERROR";
    ErrorCode["FILE_UPLOAD_ERROR"] = "FILE_UPLOAD_ERROR";
    // Rate Limiting
    ErrorCode["RATE_LIMIT_EXCEEDED"] = "RATE_LIMIT_EXCEEDED";
    // Permission
    ErrorCode["INSUFFICIENT_PERMISSIONS"] = "INSUFFICIENT_PERMISSIONS";
    ErrorCode["ADMIN_ACCESS_REQUIRED"] = "ADMIN_ACCESS_REQUIRED";
    ErrorCode["OWNER_ACCESS_REQUIRED"] = "OWNER_ACCESS_REQUIRED";
})(ErrorCode || (ErrorCode = {}));
export class AppError extends Error {
    statusCode;
    errorCode;
    isOperational;
    constructor(message, statusCode, errorCode, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
export class ValidationError extends AppError {
    details;
    constructor(message, details) {
        super(message, 400, ErrorCode.VALIDATION_ERROR);
        this.details = details;
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
export class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed') {
        super(message, 401, ErrorCode.UNAUTHORIZED);
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}
export class AuthorizationError extends AppError {
    constructor(message = 'Access denied') {
        super(message, 403, ErrorCode.FORBIDDEN);
        Object.setPrototypeOf(this, AuthorizationError.prototype);
    }
}
export class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404, ErrorCode.NOT_FOUND);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
export class ConflictError extends AppError {
    constructor(message, errorCode = ErrorCode.CONFLICT) {
        super(message, 409, errorCode);
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}
export class RateLimitError extends AppError {
    constructor(message = 'Too many requests. Please try again later.') {
        super(message, 429, ErrorCode.RATE_LIMIT_EXCEEDED);
        Object.setPrototypeOf(this, RateLimitError.prototype);
    }
}
export class DatabaseError extends AppError {
    constructor(message = 'Database operation failed') {
        super(message, 500, ErrorCode.DATABASE_ERROR, false);
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }
}
export class FileUploadError extends AppError {
    constructor(message = 'File upload failed') {
        super(message, 400, ErrorCode.FILE_UPLOAD_ERROR);
        Object.setPrototypeOf(this, FileUploadError.prototype);
    }
}
export class InternalServerError extends AppError {
    constructor(message = 'Internal server error') {
        super(message, 500, ErrorCode.INTERNAL_SERVER_ERROR, false);
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
}
//# sourceMappingURL=errors.js.map