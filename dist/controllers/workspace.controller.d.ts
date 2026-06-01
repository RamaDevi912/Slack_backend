import { NextFunction, Response } from 'express';
import { AuthRequest } from '../types/index.js';
/**
 * Create new workspace
 */
export declare const createWorkspace: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get user's workspaces
 */
export declare const getUserWorkspaces: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get single workspace
 */
export declare const getWorkspace: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Update workspace
 */
export declare const updateWorkspace: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Add member to workspace
 */
export declare const addMember: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Remove member from workspace
 */
export declare const removeMember: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get workspace members
 */
export declare const getMembers: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Update member role
 */
export declare const updateMemberRole: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Invite user to workspace
 */
export declare const inviteToWorkspace: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=workspace.controller.d.ts.map