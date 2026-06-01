import { Router } from 'express';
import {
  authenticate,
  hasWorkspaceAccess,
} from '../middleware/auth.middleware.js';
import { validateQuery } from '../middleware/validation.middleware.js';
import { searchValidation } from '../validations/index.js';
import {
  searchChannels,
  searchDirectMessages,
  searchMessages,
  searchUsers,
} from '../controllers/search.controller.js';

const router = Router({ mergeParams: true });

//  Protected Routes

router.get('/messages', authenticate, hasWorkspaceAccess, validateQuery(searchValidation), searchMessages);
router.get('/users', authenticate, hasWorkspaceAccess, validateQuery(searchValidation), searchUsers);
router.get('/channels', authenticate, hasWorkspaceAccess, validateQuery(searchValidation), searchChannels);
router.get('/direct-messages', authenticate, hasWorkspaceAccess, validateQuery(searchValidation), searchDirectMessages);

export default router;
