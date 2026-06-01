import { Router } from 'express'
import {
  authenticate,
  hasWorkspaceAccess,
  isWorkspaceAdmin,
} from '../middleware/auth.middleware'

import {
  createWorkspace,
  getUserWorkspaces,
  getWorkspace,
  updateWorkspace,
  addMember,
  removeMember,
  inviteToWorkspace,
} from '../controllers/workspace.controller'

const router = Router()

// Protected Routes

// Create + Get user workspaces
router.post('/', authenticate, createWorkspace)
router.get('/', authenticate, getUserWorkspaces)

// Single workspace
router.get('/:workspaceId', authenticate, hasWorkspaceAccess, getWorkspace)

// Update workspace (Admin only)
router.patch(
  '/:workspaceId',
  authenticate,
  hasWorkspaceAccess,
  isWorkspaceAdmin,
  updateWorkspace
)

// Members
router.post(
  '/:workspaceId/members',
  authenticate,
  hasWorkspaceAccess,
  isWorkspaceAdmin,
  addMember
)

router.delete(
  '/:workspaceId/members/:memberId',
  authenticate,
  hasWorkspaceAccess,
  isWorkspaceAdmin,
  removeMember
)

// Invitations
router.post(
  '/:workspaceId/invitations',
  authenticate,
  hasWorkspaceAccess,
  isWorkspaceAdmin,
  inviteToWorkspace
)

export default router