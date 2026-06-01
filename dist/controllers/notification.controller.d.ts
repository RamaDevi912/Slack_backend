import { Response } from 'express';
import { AuthRequest } from '../types/index.js';
/**
 * Get notifications
 */
export declare const getNotifications: (req: AuthRequest, res: Response) => Promise<Response>;
/**
 * Mark one as read
 */
export declare const markNotificationAsRead: (req: AuthRequest, res: Response) => Promise<Response>;
/**
 * Mark all as read
 */
export declare const markAllNotificationsAsRead: (req: AuthRequest, res: Response) => Promise<Response>;
/**
 * Delete notification
 */
export declare const deleteNotification: (req: AuthRequest, res: Response) => Promise<Response>;
/**
 * Get notification settings
 */
export declare const getNotificationSettings: (req: AuthRequest, res: Response) => Promise<Response>;
/**
 * Update notification settings
 */
export declare const updateNotificationSettings: (req: AuthRequest, res: Response) => Promise<Response>;
//# sourceMappingURL=notification.controller.d.ts.map