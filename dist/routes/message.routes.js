import { Router } from 'express';
import { authenticate, hasChannelAccess, } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { messageValidation } from '../validations/index.js';
import { addReaction, createMessage, createReply, deleteMessage, getMessages, getThreadReplies, markChannelAsRead, removeReaction, updateMessage, } from '../controllers/message.controller.js';
const router = Router({ mergeParams: true });
// 🔐 Protected Routes
// Messages
router.post('/', authenticate, hasChannelAccess, validateRequest(messageValidation.create), createMessage);
router.get('/', authenticate, hasChannelAccess, getMessages);
// Message actions
router.patch('/:messageId', authenticate, validateRequest(messageValidation.update), updateMessage);
router.delete('/:messageId', authenticate, deleteMessage);
// Reactions
router.post('/:messageId/reactions', authenticate, validateRequest(messageValidation.addReaction), addReaction);
router.delete('/:messageId/reactions', authenticate, removeReaction);
// Thread replies
router.post('/:messageId/replies', authenticate, createReply);
router.get('/:messageId/replies', authenticate, getThreadReplies);
// Mark as read
router.post('/mark-read', authenticate, hasChannelAccess, markChannelAsRead);
export default router;
//# sourceMappingURL=message.routes.js.map