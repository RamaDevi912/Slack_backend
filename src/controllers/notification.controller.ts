import { Response } from 'express';
import notificationService from '../services/notification.service.js';
import { AuthRequest } from '../types/index.js';

/**
 * Get notifications
 */
export const getNotifications = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { limit = '50', offset = '0', unreadOnly = 'false' } = req.query;

    const result = await notificationService.getNotifications(userId, {
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
      unreadOnly: unreadOnly === 'true',
    });

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message }); // ✅ FIX
  }
};

/**
 * Mark one as read
 */
export const markNotificationAsRead = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const userId = req.user?.id;
    const { notificationId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const updated = await notificationService.markAsRead(
      notificationId,
      userId,
    );

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ message: error.message }); // ✅ FIX
  }
};

/**
 * Mark all as read
 */
export const markAllNotificationsAsRead = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await notificationService.markAllAsRead(userId);

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message }); // ✅ FIX
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const userId = req.user?.id;
    const { notificationId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await notificationService.deleteNotification(
      notificationId,
      userId,
    );

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message }); // ✅ FIX
  }
};

/**
 * Get notification settings
 */
export const getNotificationSettings = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const settings = await notificationService.getSettings(userId);

    return res.json(settings);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Update notification settings
 */
export const updateNotificationSettings = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const settings = await notificationService.updateSettings(userId, req.body);

    return res.json(settings);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
