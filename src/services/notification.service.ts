import prisma from '../config/database.js';
import { AuthenticationError, NotFoundError } from '../utils/errors.js';
import { NotificationType } from '@prisma/client';

export class NotificationService {
  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    relatedId?: string,
  ) {
    return prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        relatedId,
        isRead: false,
      },
    });
  }

  async getNotifications(
    userId: string,
    options: { limit?: number; offset?: number; unreadOnly?: boolean },
  ) {
    const where = options.unreadOnly
      ? { userId, isRead: false }
      : { userId };

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        take: options.limit,
        skip: options.offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: { userId, isRead: false },
      }),
    ]);

    return { notifications, total, unreadCount };
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundError('Notification');
    }

    if (notification.userId !== userId) {
      throw new AuthenticationError('Access denied');
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return { message: 'All notifications marked as read' };
  }

  async deleteNotification(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundError('Notification');
    }

    if (notification.userId !== userId) {
      throw new AuthenticationError('Access denied');
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    return { message: 'Deleted' };
  }

  /**
   * Get notification settings
   */
  async getSettings(userId: string) {
    return prisma.notificationSetting.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  }

  /**
   * Update notification settings
   */
  async updateSettings(userId: string, data: any) {
    return prisma.notificationSetting.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });
  }
}

export default new NotificationService();
