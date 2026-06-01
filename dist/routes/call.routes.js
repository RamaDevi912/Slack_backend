import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { callValidation } from '../validations/index.js';
import { acceptCall, declineCall, getCall, getCallHistory, getChannelActiveCalls, initiateCall, leaveCall, } from '../controllers/call.controller.js';
const router = Router({ mergeParams: true });
// Protected Routes
router.post('/', authenticate, validateRequest(callValidation.initiate), initiateCall);
router.get('/channel/:channelId/active', authenticate, getChannelActiveCalls);
router.get('/:callId', authenticate, getCall);
router.post('/:callId/accept', authenticate, acceptCall);
router.post('/:callId/decline', authenticate, declineCall);
router.post('/:callId/leave', authenticate, leaveCall);
router.get('/history/:workspaceId', authenticate, getCallHistory);
export default router;
//# sourceMappingURL=call.routes.js.map