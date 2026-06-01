import { Request, Response } from 'express'
import prisma from '../config/database'
import { NotificationType } from '@prisma/client'
// Auth Request
interface AuthRequest extends Request {
  user?: { id: string }
}

// Create notification (service function)
export const createNotification = async (
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  relatedId?: string
): Promise<void> => {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        relatedId,
      },
    })
  } catch (error) {
    console.error('Failed to create notification:', error)
  }
}

// Get notifications
export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id
    const { limit = '50', offset = '0', unreadOnly = 'false' } = req.query

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const where = unreadOnly === 'true'
      ? { userId, isRead: false }
      : { userId }

    const notifications = await prisma.notification.findMany({
      where,
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      orderBy: { createdAt: 'desc' },
    })

    const total = await prisma.notification.count({ where })

    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false },
    })

    res.json({
      notifications,
      total,
      unreadCount,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message })
  }
}

// Mark one as read
export const markNotificationAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { notificationId } = req.params
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    })

    if (!notification || notification.userId !== userId) {
      res.status(403).json({ message: 'Access denied' })
      return
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    res.json({
      message: 'Marked as read',
      notification: updated,
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to mark notification', error: error.message })
  }
}

// Mark all as read
export const markAllNotificationsAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    res.json({ message: 'All notifications marked as read' })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update notifications', error: error.message })
  }
}

// Delete notification
export const deleteNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { notificationId } = req.params
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    })

    if (!notification || notification.userId !== userId) {
      res.status(403).json({ message: 'Access denied' })
      return
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    })

    res.json({ message: 'Deleted' })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete notification', error: error.message })
  }
}

// Get notification settings
export const getNotificationSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const settings = await prisma.notificationSetting.findUnique({
      where: { userId },
    })

    res.json(settings)
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch settings', error: error.message })
  }
}

// Update settings
export const updateNotificationSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const {
      emailNotifications,
      pushNotifications,
      desktopNotifications,
      soundEnabled,
      mutedChannels,
      mutedWorkspaces,
      doNotDisturbUntil,
    } = req.body

    const settings = await prisma.notificationSetting.update({
      where: { userId },
      data: {
        ...(emailNotifications !== undefined && { emailNotifications }),
        ...(pushNotifications !== undefined && { pushNotifications }),
        ...(desktopNotifications !== undefined && { desktopNotifications }),
        ...(soundEnabled !== undefined && { soundEnabled }),
        ...(mutedChannels && { mutedChannels }),
        ...(mutedWorkspaces && { mutedWorkspaces }),
        ...(doNotDisturbUntil && {
          doNotDisturbUntil: new Date(doNotDisturbUntil),
        }),
      },
    })

    res.json({
      message: 'Settings updated',
      settings,
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update settings', error: error.message })
  }
}