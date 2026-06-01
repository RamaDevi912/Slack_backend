import { NextFunction, Response } from 'express';
import { AuthRequest } from '../types/index.js';
/**
 * Send message
 */
export declare const createMessage: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get messages
 */
export declare const getMessages: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Update message
 */
export declare const updateMessage: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Delete message
 */
export declare const deleteMessage: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Add reaction
 */
export declare const addReaction: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Remove reaction
 */
export declare const removeReaction: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Reply
 */
export declare const createReply: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Thread
 */
export declare const getThreadReplies: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Mark channel as read
 */
export declare const markChannelAsRead: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=message.controller.d.ts.map