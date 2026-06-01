import notificationService from '../services/notification.service.js';
/**
 * Get notifications
 */
export const getNotifications = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { limit = '50', offset = '0', unreadOnly = 'false' } = req.query;
        const result = await notificationService.getNotifications(userId, {
            limit: parseInt(limit),
            offset: parseInt(offset),
            unreadOnly: unreadOnly === 'true',
        });
        return res.json(result);
    }
    catch (error) {
        return res.status(500).json({ message: error.message }); // ✅ FIX
    }
};
/**
 * Mark one as read
 */
export const markNotificationAsRead = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { notificationId } = req.params;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const updated = await notificationService.markAsRead(notificationId, userId);
        return res.json(updated);
    }
    catch (error) {
        return res.status(500).json({ message: error.message }); // ✅ FIX
    }
};
/**
 * Mark all as read
 */
export const markAllNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const result = await notificationService.markAllAsRead(userId);
        return res.json(result);
    }
    catch (error) {
        return res.status(500).json({ message: error.message }); // ✅ FIX
    }
};
/**
 * Delete notification
 */
export const deleteNotification = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { notificationId } = req.params;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const result = await notificationService.deleteNotification(notificationId, userId);
        return res.json(result);
    }
    catch (error) {
        return res.status(500).json({ message: error.message }); // ✅ FIX
    }
};
/**
 * Get notification settings
 */
export const getNotificationSettings = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const settings = await notificationService.getSettings(userId);
        return res.json(settings);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
/**
 * Update notification settings
 */
export const updateNotificationSettings = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const settings = await notificationService.updateSettings(userId, req.body);
        return res.json(settings);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
//# sourceMappingURL=notification.controller.js.map