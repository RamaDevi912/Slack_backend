import { Router } from 'express'
import {
  authenticate,
  hasWorkspaceAccess,
  hasChannelAccess,
} from '../middleware/auth.middleware'

import {
  createChannel,
  getChannels,
  getChannel,
  updateChannel,
  addChannelMember,
  removeChannelMember,
  joinChannel,
  leaveChannel,
  getPinnedMessages,
  pinMessage,
  unpinMessage,
} from '../controllers/channel.controller'

const router = Router({ mergeParams: true })

// 🔐 Protected Routes

// Channel CRUD
router.post('/', authenticate, hasWorkspaceAccess, createChannel)
router.get('/', authenticate, hasWorkspaceAccess, getChannels)

router.get('/:channelId', authenticate, hasChannelAccess, getChannel)
router.patch('/:channelId', authenticate, hasChannelAccess, updateChannel)

// Members
router.post('/:channelId/members', authenticate, hasChannelAccess, addChannelMember)
router.delete(
  '/:channelId/members/:memberId',
  authenticate,
  hasChannelAccess,
  removeChannelMember
)

// Join / Leave
router.post('/:channelId/join', authenticate, joinChannel)
router.post('/:channelId/leave', authenticate, leaveChannel)

// Pinned messages
router.get('/:channelId/pinned', authenticate, hasChannelAccess, getPinnedMessages)

router.post(
  '/:channelId/pinned/:messageId',
  authenticate,
  hasChannelAccess,
  pinMessage
)

router.delete(
  '/:channelId/pinned/:messageId',
  authenticate,
  hasChannelAccess,
  unpinMessage
)

export default router