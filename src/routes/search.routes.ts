import { Router } from 'express'
import {
  authenticate,
  hasWorkspaceAccess,
} from '../middleware/auth.middleware'

import {
  searchMessages,
  searchUsers,
  searchChannels,
  searchDirectMessages,
} from '../controllers/search.controller'

const router = Router({ mergeParams: true })

//  Protected Routes

router.get('/messages', authenticate, hasWorkspaceAccess, searchMessages)
router.get('/users', authenticate, hasWorkspaceAccess, searchUsers)
router.get('/channels', authenticate, hasWorkspaceAccess, searchChannels)
router.get('/direct-messages', authenticate, hasWorkspaceAccess, searchDirectMessages)

export default router