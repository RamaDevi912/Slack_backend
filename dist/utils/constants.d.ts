/**
 * Application Constants and Configuration
 */
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly RATE_LIMIT: 429;
    readonly INTERNAL_ERROR: 500;
};
export declare const WORKSPACE_ROLES: {
    readonly OWNER: "OWNER";
    readonly ADMIN: "ADMIN";
    readonly MEMBER: "MEMBER";
    readonly GUEST: "GUEST";
};
export declare const CHANNEL_ROLES: {
    readonly OWNER: "OWNER";
    readonly MODERATOR: "MODERATOR";
    readonly MEMBER: "MEMBER";
};
export declare const USER_STATUS: {
    readonly ONLINE: "ONLINE";
    readonly AWAY: "AWAY";
    readonly DO_NOT_DISTURB: "DO_NOT_DISTURB";
    readonly OFFLINE: "OFFLINE";
};
export declare const CALL_TYPES: {
    readonly AUDIO: "AUDIO";
    readonly VIDEO: "VIDEO";
};
export declare const CALL_STATUS: {
    readonly INITIATED: "INITIATED";
    readonly RINGING: "RINGING";
    readonly ACCEPTED: "ACCEPTED";
    readonly ONGOING: "ONGOING";
    readonly ENDED: "ENDED";
    readonly MISSED: "MISSED";
    readonly DECLINED: "DECLINED";
};
export declare const MESSAGE_TYPES: {
    readonly TEXT: "TEXT";
    readonly FILE: "FILE";
    readonly SYSTEM: "SYSTEM";
    readonly REACTION: "REACTION";
};
export declare const NOTIFICATION_TYPES: {
    readonly NEW_MESSAGE: "NEW_MESSAGE";
    readonly MENTION: "MENTION";
    readonly CALL: "CALL";
    readonly INVITATION: "INVITATION";
    readonly MEMBER_JOINED: "MEMBER_JOINED";
    readonly MEMBER_LEFT: "MEMBER_LEFT";
    readonly CHANNEL_CREATED: "CHANNEL_CREATED";
};
export declare const FILE_LIMITS: {
    readonly MAX_SIZE: 52428800;
    readonly MAX_FILES_PER_MESSAGE: 5;
    readonly ALLOWED_TYPES: readonly ["image/jpeg", "image/png", "image/gif", "application/pdf", "text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
};
export declare const PAGINATION: {
    readonly DEFAULT_PAGE: 1;
    readonly DEFAULT_LIMIT: 20;
    readonly MAX_LIMIT: 100;
    readonly MIN_LIMIT: 1;
};
export declare const RATE_LIMITS: {
    readonly API: {
        readonly WINDOW_MS: number;
        readonly MAX: 100;
    };
    readonly AUTH: {
        readonly WINDOW_MS: number;
        readonly MAX: 5;
    };
    readonly MESSAGES: {
        readonly WINDOW_MS: number;
        readonly MAX: 30;
    };
    readonly UPLOADS: {
        readonly WINDOW_MS: number;
        readonly MAX: 10;
    };
    readonly SEARCH: {
        readonly WINDOW_MS: number;
        readonly MAX: 30;
    };
};
export declare const JWT_CONFIG: {
    readonly EXPIRATION: "24h";
    readonly REFRESH_EXPIRATION: "7d";
    readonly ALGORITHM: "HS256";
};
export declare const DATABASE: {
    readonly CONNECTION_TIMEOUT: 10000;
    readonly QUERY_TIMEOUT: 30000;
};
export declare const WEBSOCKET_EVENTS: {
    readonly CONNECT: "connect";
    readonly DISCONNECT: "disconnect";
    readonly MESSAGE_SENT: "message:sent";
    readonly MESSAGE_RECEIVED: "message:received";
    readonly MESSAGE_UPDATED: "message:updated";
    readonly MESSAGE_DELETED: "message:deleted";
    readonly TYPING_START: "typing:start";
    readonly TYPING_STOP: "typing:stop";
    readonly USER_ONLINE: "user:online";
    readonly USER_OFFLINE: "user:offline";
    readonly USER_STATUS_CHANGED: "user:status:changed";
    readonly CALL_INITIATED: "call:initiated";
    readonly CALL_RINGING: "call:ringing";
    readonly CALL_ACCEPTED: "call:accepted";
    readonly CALL_DECLINED: "call:declined";
    readonly CALL_ENDED: "call:ended";
    readonly REACTION_ADDED: "reaction:added";
    readonly REACTION_REMOVED: "reaction:removed";
    readonly NOTIFICATION: "notification";
    readonly ERROR: "error";
};
export declare const ERROR_MESSAGES: {
    readonly UNAUTHORIZED: "Unauthorized access";
    readonly FORBIDDEN: "Access forbidden";
    readonly NOT_FOUND: "Resource not found";
    readonly BAD_REQUEST: "Bad request";
    readonly INTERNAL_ERROR: "Internal server error";
    readonly DATABASE_ERROR: "Database operation failed";
    readonly VALIDATION_ERROR: "Validation failed";
    readonly RATE_LIMIT_ERROR: "Too many requests";
    readonly FILE_UPLOAD_ERROR: "File upload failed";
    readonly EMAIL_EXISTS: "Email already registered";
    readonly USERNAME_EXISTS: "Username already taken";
    readonly WORKSPACE_SLUG_EXISTS: "Workspace slug already exists";
    readonly CHANNEL_EXISTS: "Channel already exists";
    readonly DUPLICATE_MEMBER: "User is already a member";
};
export declare const SUCCESS_MESSAGES: {
    readonly CREATED: "Created successfully";
    readonly UPDATED: "Updated successfully";
    readonly DELETED: "Deleted successfully";
    readonly LOGIN_SUCCESS: "Login successful";
    readonly LOGOUT_SUCCESS: "Logout successful";
    readonly PASSWORD_CHANGED: "Password changed successfully";
};
export declare const VALIDATION_RULES: {
    readonly USERNAME: {
        readonly MIN_LENGTH: 3;
        readonly MAX_LENGTH: 20;
    };
    readonly PASSWORD: {
        readonly MIN_LENGTH: 8;
        readonly MIN_UPPERCASE: 0;
        readonly MIN_NUMBERS: 0;
        readonly MIN_SPECIAL: 0;
    };
    readonly EMAIL: {
        readonly MAX_LENGTH: 254;
    };
    readonly WORKSPACE: {
        readonly NAME: {
            readonly MIN_LENGTH: 1;
            readonly MAX_LENGTH: 100;
        };
        readonly SLUG: {
            readonly MIN_LENGTH: 3;
            readonly MAX_LENGTH: 50;
        };
        readonly DESCRIPTION: {
            readonly MAX_LENGTH: 500;
        };
    };
    readonly CHANNEL: {
        readonly NAME: {
            readonly MIN_LENGTH: 1;
            readonly MAX_LENGTH: 80;
        };
        readonly DESCRIPTION: {
            readonly MAX_LENGTH: 500;
        };
        readonly TOPIC: {
            readonly MAX_LENGTH: 200;
        };
    };
    readonly MESSAGE: {
        readonly MIN_LENGTH: 1;
        readonly MAX_LENGTH: 4000;
    };
    readonly BIO: {
        readonly MAX_LENGTH: 500;
    };
    readonly CUSTOM_STATUS: {
        readonly MAX_LENGTH: 100;
    };
    readonly SEARCH_QUERY: {
        readonly MIN_LENGTH: 1;
        readonly MAX_LENGTH: 100;
    };
};
export declare const APP_CONFIG: {
    readonly NODE_ENV: string;
    readonly PORT: number;
    readonly FRONTEND_URL: string;
    readonly API_URL: string;
    readonly JWT_SECRET: string;
    readonly LOG_LEVEL: string;
    readonly CORS_ORIGIN: string;
    readonly DATABASE_URL: string;
};
export declare const TIME_CONFIG: {
    readonly TOKEN_EXPIRY_HOURS: 24;
    readonly REFRESH_TOKEN_DAYS: 7;
    readonly INVITATION_EXPIRY_DAYS: 7;
    readonly PRESENCE_UPDATE_INTERVAL: 5000;
    readonly TYPING_TIMEOUT: 3000;
};
//# sourceMappingURL=constants.d.ts.map