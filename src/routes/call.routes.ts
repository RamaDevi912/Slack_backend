import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware'

import {
  initiateCall,
  getChannelActiveCalls,
  acceptCall,
  declineCall,
  leaveCall,
  getCallHistory,
  getCall,
} from '../controllers/call.controller'

const router = Router({ mergeParams: true })

// Protected Routes
router.post('/', authenticate, initiateCall)

router.get('/channel/:channelId/active', authenticate, getChannelActiveCalls)

router.get('/:callId', authenticate, getCall)

router.post('/:callId/accept', authenticate, acceptCall)
router.post('/:callId/decline', authenticate, declineCall)
router.post('/:callId/leave', authenticate, leaveCall)

router.get('/history/:workspaceId', authenticate, getCallHistory)

export default router