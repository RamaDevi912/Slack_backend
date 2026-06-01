import { Router } from 'express';
import { authenticate, isPlatformAdmin } from '../middleware/auth.middleware.js';

import {
  getActivityAnalytics,
  getAllChannels,
  getAllUsers,
  getAllWorkspaces,
  getAuditLogs,
  getPlatformStats,
  getUserDetails,
  getWorkspaceDetails,
  promoteToAdmin,
  removeAdmin,
} from '../controllers/admin.controller.js';

const router = Router();

// 🔐 Admin Protected Routes
router.get('/stats', authenticate, isPlatformAdmin, getPlatformStats);

router.get('/users', authenticate, isPlatformAdmin, getAllUsers);
router.get('/users/:userId', authenticate, isPlatformAdmin, getUserDetails);

router.post('/users/:userId/promote', authenticate, isPlatformAdmin, promoteToAdmin);
router.delete('/users/:userId/admin', authenticate, isPlatformAdmin, removeAdmin);

router.get('/workspaces', authenticate, isPlatformAdmin, getAllWorkspaces);
router.get('/workspaces/:workspaceId', authenticate, isPlatformAdmin, getWorkspaceDetails);

router.get('/channels', authenticate, isPlatformAdmin, getAllChannels);

router.get('/analytics', authenticate, isPlatformAdmin, getActivityAnalytics);

router.get(
  '/workspaces/:workspaceId/audit-logs',
  authenticate,
  isPlatformAdmin,
  getAuditLogs,
);

export default router;
