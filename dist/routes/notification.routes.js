import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { deleteNotification, getNotifications, getNotificationSettings, markAllNotificationsAsRead, markNotificationAsRead, updateNotificationSettings, } from '../controllers/notification.controller.js';
const router = Router();
//  Protected Routes
// Notifications
router.get('/', authenticate, getNotifications);
router.patch('/:notificationId/read', authenticate, markNotificationAsRead);
router.patch('/all/read', authenticate, markAllNotificationsAsRead);
router.delete('/:notificationId', authenticate, deleteNotification);
// Settings
router.get('/settings', authenticate, getNotificationSettings);
router.patch('/settings', authenticate, updateNotificationSettings);
export default router;
//# sourceMappingURL=notification.routes.js.map