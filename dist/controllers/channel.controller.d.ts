import { NextFunction, Response } from 'express';
import { AuthRequest } from '../types/index.js';
/**
 * Create channel
 */
export declare const createChannel: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get channels
 */
export declare const getChannels: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get single channel
 */
export declare const getChannelById: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Update channel
 */
export declare const updateChannel: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Delete channel
 */
export declare const deleteChannel: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Add member to channel
 */
export declare const addMember: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Remove member from channel
 */
export declare const removeMember: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get channel members
 */
export declare const getMembers: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Archive channel
 */
export declare const archiveChannel: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Join channel
 */
export declare const joinChannel: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Leave channel
 */
export declare const leaveChannel: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get pinned messages
 */
export declare const getPinnedMessages: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Pin message
 */
export declare const pinMessage: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Unpin message
 */
export declare const unpinMessage: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getChannel: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const addChannelMember: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const removeChannelMember: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=channel.controller.d.ts.map