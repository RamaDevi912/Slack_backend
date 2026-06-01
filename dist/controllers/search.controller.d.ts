import { Response } from 'express';
import { AuthRequest } from '../types/index.js';
/**
 * 🔍 Search Messages
 */
export declare const searchMessages: (req: AuthRequest, res: Response) => Promise<Response>;
/**
 * 👤 Search Users
 */
export declare const searchUsers: (req: AuthRequest, res: Response) => Promise<Response>;
/**
 * 📁 Search Channels
 */
export declare const searchChannels: (req: AuthRequest, res: Response) => Promise<Response>;
/**
 * 💬 Search Direct Messages
 */
export declare const searchDirectMessages: (req: AuthRequest, res: Response) => Promise<Response>;
//# sourceMappingURL=search.controller.d.ts.map