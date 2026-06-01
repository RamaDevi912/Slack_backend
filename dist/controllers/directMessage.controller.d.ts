import { NextFunction, Response } from 'express';
import { AuthRequest } from '../types/index.js';
/**
 * Create or get DM room
 */
export declare const getOrCreateConversation: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Send message
 */
export declare const sendMessage: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get messages
 */
export declare const getMessageHistory: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get user rooms
 */
export declare const getUserConversations: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Delete message
 */
export declare const deleteMessage: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Update DM Message
 */
export declare const updateDirectMessage: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Add DM Reaction
 */
export declare const addDMReaction: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Remove DM Reaction
 */
export declare const removeDMReaction: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getOrCreateDMRoom: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getDMRooms: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const sendDirectMessage: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getDMMessages: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteDirectMessage: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=directMessage.controller.d.ts.map