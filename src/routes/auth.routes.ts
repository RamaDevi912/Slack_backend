import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { authValidation } from '../validations/index.js';
import {
  getCurrentUser,
  login,
  register,
  updateProfile,
  updateStatus,
} from '../controllers/auth.controller.js';

const router = express.Router();

// Public routes
router.post('/register', validateRequest(authValidation.register), register);
router.post('/login', validateRequest(authValidation.login), login);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.patch('/me/profile', authenticate, validateRequest(authValidation.updateProfile), updateProfile);
router.patch('/me/status', authenticate, validateRequest(authValidation.updateProfile), updateStatus);

export default router;
