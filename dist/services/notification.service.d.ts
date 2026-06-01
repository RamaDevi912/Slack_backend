import { NotificationType } from '@prisma/client';
export declare class NotificationService {
    createNotification(userId: string, type: NotificationType, title: string, message: string, relatedId?: string): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        userId: string;
        type: import(".prisma/client").$Enums.NotificationType;
        isRead: boolean;
        readAt: Date | null;
        title: string;
        relatedId: string | null;
    }>;
    getNotifications(userId: string, options: {
        limit?: number;
        offset?: number;
        unreadOnly?: boolean;
    }): Promise<{
        notifications: {
            message: string;
            id: string;
            createdAt: Date;
            userId: string;
            type: import(".prisma/client").$Enums.NotificationType;
            isRead: boolean;
            readAt: Date | null;
            title: string;
            relatedId: string | null;
        }[];
        total: number;
        unreadCount: number;
    }>;
    markAsRead(notificationId: string, userId: string): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        userId: string;
        type: import(".prisma/client").$Enums.NotificationType;
        isRead: boolean;
        readAt: Date | null;
        title: string;
        relatedId: string | null;
    }>;
    markAllAsRead(userId: string): Promise<{
        message: string;
    }>;
    deleteNotification(notificationId: string, userId: string): Promise<{
        message: string;
    }>;
    /**
     * Get notification settings
     */
    getSettings(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        emailNotifications: boolean;
        pushNotifications: boolean;
        desktopNotifications: boolean;
        soundEnabled: boolean;
        mutedChannels: string[];
        mutedWorkspaces: string[];
        doNotDisturbUntil: Date | null;
    }>;
    /**
     * Update notification settings
     */
    updateSettings(userId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        emailNotifications: boolean;
        pushNotifications: boolean;
        desktopNotifications: boolean;
        soundEnabled: boolean;
        mutedChannels: string[];
        mutedWorkspaces: string[];
        doNotDisturbUntil: Date | null;
    }>;
}
declare const _default: NotificationService;
export default _default;
//# sourceMappingURL=notification.service.d.ts.map