import { Router } from 'express';
import { authenticate, hasWorkspaceAccess, } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { directMessageValidation } from '../validations/index.js';
import { addDMReaction, deleteDirectMessage, getDMMessages, getDMRooms, getOrCreateDMRoom, removeDMReaction, sendDirectMessage, updateDirectMessage, } from '../controllers/directMessage.controller.js';
const router = Router({ mergeParams: true });
//  Protected Routes
// DM Rooms
router.post('/rooms', authenticate, hasWorkspaceAccess, validateRequest(directMessageValidation.createRoom), getOrCreateDMRoom);
router.get('/rooms', authenticate, hasWorkspaceAccess, getDMRooms);
// Messages
router.post('/:roomId', authenticate, validateRequest(directMessageValidation.send), sendDirectMessage);
router.get('/:roomId', authenticate, getDMMessages);
// Message actions
router.patch('/:messageId', authenticate, updateDirectMessage);
router.delete('/:messageId', authenticate, deleteDirectMessage);
// Reactions
router.post('/:messageId/reactions', authenticate, addDMReaction);
router.delete('/:messageId/reactions', authenticate, removeDMReaction);
export default router;
//# sourceMappingURL=directMessage.routes.js.map