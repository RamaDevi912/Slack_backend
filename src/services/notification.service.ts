import prisma from '../config/database.js';
import { AuthenticationError, NotFoundError } from '../utils/errors.js';
import { NotificationType } from '@prisma/client';

// ── Interfaces ──

export interface GetNotificationsOptions {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
}

// ── Service Functions ──

export const createNotification = async (
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  relatedId?: string,
) => {
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
};

export const getNotifications = async (
  userId: string,
  options: GetNotificationsOptions,
) => {
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
};

export const markAsRead = async (notificationId: string, userId: string) => {
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
};

export const markAllAsRead = async (userId: string) => {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  return { message: 'All notifications marked as read' };
};

export const deleteNotification = async (notificationId: string, userId: string) => {
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
};

export const getSettings = async (userId: string) => {
  return prisma.notificationSetting.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
};

export const updateSettings = async (userId: string, data: any) => {
  return prisma.notificationSetting.upsert({
    where: { userId },
    update: data,
    create: {
      userId,
      ...data,
    },
  });
};

