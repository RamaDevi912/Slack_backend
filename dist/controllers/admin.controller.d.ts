import { NextFunction, Request, Response } from 'express';
/**
 * Dashboard stats
 */
export declare const getPlatformStats: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get users
 */
export declare const getAllUsers: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get workspaces
 */
export declare const getAllWorkspaces: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get audit logs
 */
export declare const getAuditLogs: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Ban user
 */
export declare const banUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Unban user
 */
export declare const unbanUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * System health
 */
export declare const getSystemHealth: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get user details
 */
export declare const getUserDetails: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Promote user to platform admin
 */
export declare const promoteToAdmin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Remove platform admin privileges
 */
export declare const removeAdmin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get workspace details
 */
export declare const getWorkspaceDetails: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get all channels
 */
export declare const getAllChannels: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get activity analytics
 */
export declare const getActivityAnalytics: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=admin.controller.d.ts.map