/**
 * Application Constants and Configuration
 */
// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    RATE_LIMIT: 429,
    INTERNAL_ERROR: 500,
};
// User Roles
export const WORKSPACE_ROLES = {
    OWNER: 'OWNER',
    ADMIN: 'ADMIN',
    MEMBER: 'MEMBER',
    GUEST: 'GUEST',
};
export const CHANNEL_ROLES = {
    OWNER: 'OWNER',
    MODERATOR: 'MODERATOR',
    MEMBER: 'MEMBER',
};
// User Status
export const USER_STATUS = {
    ONLINE: 'ONLINE',
    AWAY: 'AWAY',
    DO_NOT_DISTURB: 'DO_NOT_DISTURB',
    OFFLINE: 'OFFLINE',
};
// Call Types
export const CALL_TYPES = {
    AUDIO: 'AUDIO',
    VIDEO: 'VIDEO',
};
// Call Status
export const CALL_STATUS = {
    INITIATED: 'INITIATED',
    RINGING: 'RINGING',
    ACCEPTED: 'ACCEPTED',
    ONGOING: 'ONGOING',
    ENDED: 'ENDED',
    MISSED: 'MISSED',
    DECLINED: 'DECLINED',
};
// Message Types
export const MESSAGE_TYPES = {
    TEXT: 'TEXT',
    FILE: 'FILE',
    SYSTEM: 'SYSTEM',
    REACTION: 'REACTION',
};
// Notification Types
export const NOTIFICATION_TYPES = {
    NEW_MESSAGE: 'NEW_MESSAGE',
    MENTION: 'MENTION',
    CALL: 'CALL',
    INVITATION: 'INVITATION',
    MEMBER_JOINED: 'MEMBER_JOINED',
    MEMBER_LEFT: 'MEMBER_LEFT',
    CHANNEL_CREATED: 'CHANNEL_CREATED',
};
// File Upload Limits
export const FILE_LIMITS = {
    MAX_SIZE: 52428800, // 50MB in bytes
    MAX_FILES_PER_MESSAGE: 5,
    ALLOWED_TYPES: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
};
// API Pagination
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    MIN_LIMIT: 1,
};
// Rate Limits
export const RATE_LIMITS = {
    API: {
        WINDOW_MS: 15 * 60 * 1000, // 15 minutes
        MAX: 100,
    },
    AUTH: {
        WINDOW_MS: 15 * 60 * 1000,
        MAX: 5,
    },
    MESSAGES: {
        WINDOW_MS: 60 * 1000, // 1 minute
        MAX: 30,
    },
    UPLOADS: {
        WINDOW_MS: 60 * 60 * 1000, // 1 hour
        MAX: 10,
    },
    SEARCH: {
        WINDOW_MS: 60 * 1000,
        MAX: 30,
    },
};
// JWT Configuration
export const JWT_CONFIG = {
    EXPIRATION: '24h',
    REFRESH_EXPIRATION: '7d',
    ALGORITHM: 'HS256',
};
// Database
export const DATABASE = {
    CONNECTION_TIMEOUT: 10000,
    QUERY_TIMEOUT: 30000,
};
// WebSocket Events
export const WEBSOCKET_EVENTS = {
    // Connection
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    // Messaging
    MESSAGE_SENT: 'message:sent',
    MESSAGE_RECEIVED: 'message:received',
    MESSAGE_UPDATED: 'message:updated',
    MESSAGE_DELETED: 'message:deleted',
    // Typing
    TYPING_START: 'typing:start',
    TYPING_STOP: 'typing:stop',
    // Presence
    USER_ONLINE: 'user:online',
    USER_OFFLINE: 'user:offline',
    USER_STATUS_CHANGED: 'user:status:changed',
    // Calls
    CALL_INITIATED: 'call:initiated',
    CALL_RINGING: 'call:ringing',
    CALL_ACCEPTED: 'call:accepted',
    CALL_DECLINED: 'call:declined',
    CALL_ENDED: 'call:ended',
    // Reactions
    REACTION_ADDED: 'reaction:added',
    REACTION_REMOVED: 'reaction:removed',
    // Notifications
    NOTIFICATION: 'notification',
    // Errors
    ERROR: 'error',
};
// Error Messages
export const ERROR_MESSAGES = {
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    NOT_FOUND: 'Resource not found',
    BAD_REQUEST: 'Bad request',
    INTERNAL_ERROR: 'Internal server error',
    DATABASE_ERROR: 'Database operation failed',
    VALIDATION_ERROR: 'Validation failed',
    RATE_LIMIT_ERROR: 'Too many requests',
    FILE_UPLOAD_ERROR: 'File upload failed',
    EMAIL_EXISTS: 'Email already registered',
    USERNAME_EXISTS: 'Username already taken',
    WORKSPACE_SLUG_EXISTS: 'Workspace slug already exists',
    CHANNEL_EXISTS: 'Channel already exists',
    DUPLICATE_MEMBER: 'User is already a member',
};
// Success Messages
export const SUCCESS_MESSAGES = {
    CREATED: 'Created successfully',
    UPDATED: 'Updated successfully',
    DELETED: 'Deleted successfully',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    PASSWORD_CHANGED: 'Password changed successfully',
};
// Validation Rules
export const VALIDATION_RULES = {
    USERNAME: {
        MIN_LENGTH: 3,
        MAX_LENGTH: 20,
    },
    PASSWORD: {
        MIN_LENGTH: 8,
        MIN_UPPERCASE: 0, // Optional requirement
        MIN_NUMBERS: 0,
        MIN_SPECIAL: 0,
    },
    EMAIL: {
        MAX_LENGTH: 254,
    },
    WORKSPACE: {
        NAME: {
            MIN_LENGTH: 1,
            MAX_LENGTH: 100,
        },
        SLUG: {
            MIN_LENGTH: 3,
            MAX_LENGTH: 50,
        },
        DESCRIPTION: {
            MAX_LENGTH: 500,
        },
    },
    CHANNEL: {
        NAME: {
            MIN_LENGTH: 1,
            MAX_LENGTH: 80,
        },
        DESCRIPTION: {
            MAX_LENGTH: 500,
        },
        TOPIC: {
            MAX_LENGTH: 200,
        },
    },
    MESSAGE: {
        MIN_LENGTH: 1,
        MAX_LENGTH: 4000,
    },
    BIO: {
        MAX_LENGTH: 500,
    },
    CUSTOM_STATUS: {
        MAX_LENGTH: 100,
    },
    SEARCH_QUERY: {
        MIN_LENGTH: 1,
        MAX_LENGTH: 100,
    },
};
// Application Settings
export const APP_CONFIG = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: Number(process.env.PORT) || 3001,
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    API_URL: process.env.API_URL || 'http://localhost:3001',
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
    DATABASE_URL: process.env.DATABASE_URL || '',
};
// Dates and Times
export const TIME_CONFIG = {
    TOKEN_EXPIRY_HOURS: 24,
    REFRESH_TOKEN_DAYS: 7,
    INVITATION_EXPIRY_DAYS: 7,
    PRESENCE_UPDATE_INTERVAL: 5000, // 5 seconds
    TYPING_TIMEOUT: 3000, // 3 seconds
};
//# sourceMappingURL=constants.js.map