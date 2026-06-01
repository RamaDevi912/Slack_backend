import { NextFunction, Request, Response } from 'express';
import { AuthRequest } from '../types/index.js';
/**
 * Register
 */
export declare const register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Login
 */
export declare const login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get current user
 */
export declare const getCurrentUser: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Update profile
 */
export declare const updateProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Change password
 */
export declare const changePassword: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Refresh token
 */
export declare const refreshToken: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Update user status
 */
export declare const updateStatus: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map