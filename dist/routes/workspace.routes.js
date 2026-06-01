import { Router } from 'express';
import { authenticate, hasWorkspaceAccess, isWorkspaceAdmin, } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { workspaceValidation } from '../validations/index.js';
import { addMember, createWorkspace, getUserWorkspaces, getWorkspace, inviteToWorkspace, removeMember, updateWorkspace, } from '../controllers/workspace.controller.js';
const router = Router();
// Protected Routes
// Create + Get user workspaces
router.post('/', authenticate, validateRequest(workspaceValidation.create), createWorkspace);
router.get('/', authenticate, getUserWorkspaces);
// Single workspace
router.get('/:workspaceId', authenticate, hasWorkspaceAccess, getWorkspace);
// Update workspace (Admin only)
router.patch('/:workspaceId', authenticate, hasWorkspaceAccess, isWorkspaceAdmin, validateRequest(workspaceValidation.update), updateWorkspace);
// Members
router.post('/:workspaceId/members', authenticate, hasWorkspaceAccess, isWorkspaceAdmin, validateRequest(workspaceValidation.addMember), addMember);
router.delete('/:workspaceId/members/:memberId', authenticate, hasWorkspaceAccess, isWorkspaceAdmin, removeMember);
// Invitations
router.post('/:workspaceId/invitations', authenticate, hasWorkspaceAccess, isWorkspaceAdmin, validateRequest(workspaceValidation.invite), inviteToWorkspace);
export default router;
//# sourceMappingURL=workspace.routes.js.map