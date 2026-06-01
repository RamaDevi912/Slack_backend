import express from 'express'
import { authenticate } from '../middleware/auth.middleware'
import {
  register,
  login,
  getCurrentUser,
  updateProfile,
  updateStatus,
} from '../controllers/auth.controller'

const router = express.Router()

// Public routes
router.post('/register', register)
router.post('/login', login)

// Protected routes
router.get('/me', authenticate, getCurrentUser)
router.patch('/me/profile', authenticate, updateProfile)
router.patch('/me/status', authenticate, updateStatus)

export default router