import { Router } from 'express'
import {
  authenticate,
  hasChannelAccess,
} from '../middleware/auth.middleware'

import {
  createMessage,
  getMessages,
  updateMessage,
  deleteMessage,
  addReaction,
  removeReaction,
  createReply,
  getThreadReplies,
  markChannelAsRead,
} from '../controllers/message.controller'

const router = Router({ mergeParams: true })

// 🔐 Protected Routes

// Messages
router.post('/', authenticate, hasChannelAccess, createMessage)
router.get('/', authenticate, hasChannelAccess, getMessages)

// Message actions
router.patch('/:messageId', authenticate, updateMessage)
router.delete('/:messageId', authenticate, deleteMessage)

// Reactions
router.post('/:messageId/reactions', authenticate, addReaction)
router.delete('/:messageId/reactions', authenticate, removeReaction)

// Thread replies
router.post('/:messageId/replies', authenticate, createReply)
router.get('/:messageId/replies', authenticate, getThreadReplies)

// Mark as read
router.post('/mark-read', authenticate, hasChannelAccess, markChannelAsRead)

export default router