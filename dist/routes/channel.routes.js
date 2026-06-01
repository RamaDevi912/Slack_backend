import { Router } from 'express';
import { authenticate, hasChannelAccess, hasWorkspaceAccess, } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { channelValidation } from '../validations/index.js';
import { addChannelMember, createChannel, getChannel, getChannels, getPinnedMessages, joinChannel, leaveChannel, pinMessage, removeChannelMember, unpinMessage, updateChannel, } from '../controllers/channel.controller.js';
const router = Router({ mergeParams: true });
// 🔐 Protected Routes
// Channel CRUD
router.post('/', authenticate, hasWorkspaceAccess, validateRequest(channelValidation.create), createChannel);
router.get('/', authenticate, hasWorkspaceAccess, getChannels);
router.get('/:channelId', authenticate, hasChannelAccess, getChannel);
router.patch('/:channelId', authenticate, hasChannelAccess, validateRequest(channelValidation.update), updateChannel);
// Members
router.post('/:channelId/members', authenticate, hasChannelAccess, validateRequest(channelValidation.addMember), addChannelMember);
router.delete('/:channelId/members/:memberId', authenticate, hasChannelAccess, removeChannelMember);
// Join / Leave
router.post('/:channelId/join', authenticate, joinChannel);
router.post('/:channelId/leave', authenticate, leaveChannel);
// Pinned messages
router.get('/:channelId/pinned', authenticate, hasChannelAccess, getPinnedMessages);
router.post('/:channelId/pinned/:messageId', authenticate, hasChannelAccess, pinMessage);
router.delete('/:channelId/pinned/:messageId', authenticate, hasChannelAccess, unpinMessage);
export default router;
//# sourceMappingURL=channel.routes.js.map