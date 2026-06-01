import { Request, Response } from 'express'
import prisma from '../config/database'
import { Prisma } from '@prisma/client'

/* =======================
   Get platform statistics
======================= */
export const getPlatformStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await prisma.user.count()
    const totalWorkspaces = await prisma.workspace.count()
    const totalChannels = await prisma.channel.count()
    const totalMessages = await prisma.message.count()
    const totalDirectMessages = await prisma.directMessage.count()

    const activeCalls = await prisma.call.count({
      where: {
        status: {
          in: ['INITIATED', 'RINGING', 'ACTIVE'],
        },
      },
    })

    const recentUsers = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    })

    res.json({
      totalUsers,
      totalWorkspaces,
      totalChannels,
      totalMessages,
      totalDirectMessages,
      activeCalls,
      recentUsers,
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message })
  }
}

/* =======================
   Get all users
======================= */
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = '50', offset = '0', search } = req.query

    const where: Prisma.UserWhereInput = {}

    if (search) {
      where.OR = [
        { email: { contains: String(search), mode: 'insensitive' } },
        { username: { contains: String(search), mode: 'insensitive' } },
      ]
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            workspaceMembers: true,
            messages: true,
          },
        },
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      orderBy: { createdAt: 'desc' },
    })

    const total = await prisma.user.count({ where })

    res.json({
      users,
      total,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message })
  }
}

/* =======================
   Get all workspaces
======================= */
export const getAllWorkspaces = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = '50', offset = '0', search } = req.query

    const where: Prisma.WorkspaceWhereInput = {}

    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { slug: { contains: String(search), mode: 'insensitive' } },
      ]
    }

    const workspaces = await prisma.workspace.findMany({
      where,
      include: {
        _count: {
          select: {
            members: true,
            channels: true,
          },
        },
        admin: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      orderBy: { createdAt: 'desc' },
    })

    const total = await prisma.workspace.count({ where })

    res.json({
      workspaces,
      total,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch workspaces', error: error.message })
  }
}

/* =======================
   Get all channels
======================= */
export const getAllChannels = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = '50', offset = '0', workspaceId } = req.query

    const where: Prisma.ChannelWhereInput = {}

    if (workspaceId) {
      where.workspaceId = String(workspaceId)
    }

    const channels = await prisma.channel.findMany({
      where,
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            members: true,
            messages: true,
          },
        },
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      orderBy: { createdAt: 'desc' },
    })

    const total = await prisma.channel.count({ where })

    res.json({
      channels,
      total,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch channels', error: error.message })
  }
}

/* =======================
   Activity analytics
======================= */
export const getActivityAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { days = '30' } = req.query
    const daysNumber = parseInt(days as string)

    const startDate = new Date(Date.now() - daysNumber * 24 * 60 * 60 * 1000)

    const messageActivity = await prisma.message.groupBy({
      by: ['createdAt'],
      where: { createdAt: { gte: startDate } },
      _count: true,
      orderBy: { createdAt: 'asc' },
    })

    const dmActivity = await prisma.directMessage.groupBy({
      by: ['createdAt'],
      where: { createdAt: { gte: startDate } },
      _count: true,
      orderBy: { createdAt: 'asc' },
    })

    const callActivity = await prisma.call.groupBy({
      by: ['createdAt'],
      where: { createdAt: { gte: startDate } },
      _count: true,
      orderBy: { createdAt: 'asc' },
    })

    const newUsers = await prisma.user.count({
      where: { createdAt: { gte: startDate } },
    })

    res.json({
      messageActivity,
      dmActivity,
      callActivity,
      newUsers,
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message })
  }
}

/* =======================
   Get user details
======================= */
export const getUserDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        workspaceMembers: { include: { workspace: true } },
        channelMembers: { include: { channel: true } },
        _count: {
          select: {
            messages: true,
            directMessages: true,
            callParticipants: true,
          },
        },
      },
    })

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.json(user)
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch user details', error: error.message })
  }
}

/* =======================
   Promote user
======================= */
export const promoteToAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params

    const admin = await prisma.platformAdmin.create({
      data: {
        userId,
        role: 'ADMIN',
      },
    })

    res.status(201).json({
      message: 'User promoted to admin',
      admin,
    })
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ message: 'User is already an admin' })
      return
    }
    res.status(500).json({ message: 'Failed to promote user', error: error.message })
  }
}

/* =======================
   Remove admin
======================= */
export const removeAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params

    await prisma.platformAdmin.delete({
      where: { userId },
    })

    res.json({ message: 'Admin privileges removed' })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to remove admin', error: error.message })
  }
}

/* =======================
   Audit logs
======================= */
export const getAuditLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { workspaceId } = req.params
    const { limit = '50', offset = '0' } = req.query

    const logs = await prisma.auditLog.findMany({
      where: { workspaceId },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      orderBy: { createdAt: 'desc' },
    })

    const total = await prisma.auditLog.count({
      where: { workspaceId },
    })

    res.json({
      logs,
      total,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch audit logs', error: error.message })
  }
}

  //  Get workspace details

export const getWorkspaceDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { workspaceId } = req.params

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                status: true,
              },
            },
          },
        },
        channels: {
          include: {
            _count: {
              select: {
                members: true,
                messages: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            channels: true,
          },
        },
      },
    })

    if (!workspace) {
      res.status(404).json({ message: 'Workspace not found' })
      return
    }

    res.json(workspace)
  } catch (error: any) {
    res.status(500).json({
      message: 'Failed to fetch workspace details',
      error: error.message,
    })
  }
}