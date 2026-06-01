import { Router } from 'express'
import {
  authenticate,
  hasWorkspaceAccess,
} from '../middleware/auth.middleware'

import {
  getOrCreateDMRoom,
  getDMRooms,
  sendDirectMessage,
  getDMMessages,
  updateDirectMessage,
  deleteDirectMessage,
  addDMReaction,
  removeDMReaction,
} from '../controllers/directMessage.controller'

const router = Router({ mergeParams: true })

//  Protected Routes

// DM Rooms
router.post('/rooms', authenticate, hasWorkspaceAccess, getOrCreateDMRoom)
router.get('/rooms', authenticate, hasWorkspaceAccess, getDMRooms)

// Messages
router.post('/:roomId', authenticate, sendDirectMessage)
router.get('/:roomId', authenticate, getDMMessages)

// Message actions
router.patch('/:messageId', authenticate, updateDirectMessage)
router.delete('/:messageId', authenticate, deleteDirectMessage)

// Reactions
router.post('/:messageId/reactions', authenticate, addDMReaction)
router.delete('/:messageId/reactions', authenticate, removeDMReaction)

export default router