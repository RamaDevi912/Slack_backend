import { NextFunction, Response } from 'express';
import { AuthRequest } from '../types/index.js';
/**
 * Upload file
 */
export declare const uploadFile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Download file
 */
export declare const downloadFile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get file details
 */
export declare const getFile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Delete file
 */
export declare const deleteFile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Delete multiple files
 */
export declare const deleteMultipleFiles: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=file.controller.d.ts.map