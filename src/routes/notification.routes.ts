import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware'

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getNotificationSettings,
  updateNotificationSettings,
} from '../controllers/notification.controller'

const router = Router()

//  Protected Routes

// Notifications
router.get('/', authenticate, getNotifications)

router.patch('/:notificationId/read', authenticate, markNotificationAsRead)
router.patch('/all/read', authenticate, markAllNotificationsAsRead)

router.delete('/:notificationId', authenticate, deleteNotification)

// Settings
router.get('/settings', authenticate, getNotificationSettings)
router.patch('/settings', authenticate, updateNotificationSettings)

export default router