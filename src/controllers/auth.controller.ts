import { Request, Response } from 'express'
import prisma from '../config/database'
import { hashPassword, comparePassword, generateToken } from '../utils/auth'

// Extend Request to include user (for auth middleware)
interface AuthRequest extends Request {
  user?: {
    id: string
  }
}

// Register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, password, firstName, lastName } = req.body

    if (!email || !username || !password) {
      res.status(400).json({ message: 'Email, username, and password are required' })
      return
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (existingUser) {
      res.status(409).json({ message: 'Email or username already exists' })
      return
    }

    const passwordHash = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        firstName,
        lastName,
      },
    })

    await prisma.notificationSetting.create({
      data: {
        userId: user.id,
      },
    })

    const token = generateToken(user.id)

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Registration failed', error: error.message })
  }
}

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' })
      return
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' })
      return
    }

    const isValidPassword = await comparePassword(password, user.passwordHash)

    if (!isValidPassword) {
      res.status(401).json({ message: 'Invalid email or password' })
      return
    }

    const token = generateToken(user.id)

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Login failed', error: error.message })
  }
}

// Get current user
export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        workspaceMembers: {
          include: {
            workspace: true,
          },
        },
      },
    })

    res.json(user)
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message })
  }
}

// Update profile
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const { firstName, lastName, bio, profilePicture } = req.body

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(bio && { bio }),
        ...(profilePicture && { profilePicture }),
      },
    })

    res.json({
      message: 'Profile updated successfully',
      user,
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message })
  }
}

// Update status
export const updateStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const { status, customStatus } = req.body

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(status && { status }),
        ...(customStatus !== undefined && { customStatus }),
      },
    })

    res.json({
      message: 'Status updated successfully',
      user,
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update status', error: error.message })
  }
}