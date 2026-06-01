import { Request, Response } from 'express'
import prisma from '../config/database'

// Auth Request
interface AuthRequest extends Request {
  user?: { id: string }
}

// 🔍 Search Messages
export const searchMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { workspaceId } = req.params
    const { query, limit = '50', offset = '0' } = req.query
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    if (!query) {
      res.status(400).json({ message: 'Search query required' })
      return
    }

    const userChannels = await prisma.channelMember.findMany({
      where: { userId },
      select: { channelId: true },
    })

    const channelIds = userChannels.map((c) => c.channelId)

    const publicChannels = await prisma.channel.findMany({
      where: { workspaceId, isPrivate: false },
      select: { id: true },
    })

    const accessibleChannels = [
      ...new Set([
        ...channelIds,
        ...publicChannels.map((c) => c.id),
      ]),
    ]

    const messages = await prisma.message.findMany({
      where: {
        channelId: { in: accessibleChannels },
        content: { contains: query as string, mode: 'insensitive' },
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
        channel: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      orderBy: { createdAt: 'desc' },
    })

    await prisma.searchLog.create({
      data: {
        userId,
        query: query as string,
        resultCount: messages.length,
        searchType: 'MESSAGE',
      },
    })

    res.json({ results: messages, count: messages.length })
  } catch (error: any) {
    res.status(500).json({ message: 'Search failed', error: error.message })
  }
}

// 👤 Search Users
export const searchUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { workspaceId } = req.params
    const { query, limit = '20', offset = '0' } = req.query
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    if (!query) {
      res.status(400).json({ message: 'Search query required' })
      return
    }

    const members = await prisma.workspaceMember.findMany({
      where: { workspaceId },
      select: { userId: true },
    })

    const memberIds = members.map((m) => m.userId)

    const users = await prisma.user.findMany({
      where: {
        id: { in: memberIds },
        OR: [
          { username: { contains: query as string, mode: 'insensitive' } },
          { email: { contains: query as string, mode: 'insensitive' } },
          { firstName: { contains: query as string, mode: 'insensitive' } },
          { lastName: { contains: query as string, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
        status: true,
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    })

    await prisma.searchLog.create({
      data: {
        userId,
        query: query as string,
        resultCount: users.length,
        searchType: 'USER',
      },
    })

    res.json({ results: users, count: users.length })
  } catch (error: any) {
    res.status(500).json({ message: 'Search failed', error: error.message })
  }
}

// 📢 Search Channels
export const searchChannels = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { workspaceId } = req.params
    const { query, limit = '20', offset = '0' } = req.query
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    if (!query) {
      res.status(400).json({ message: 'Search query required' })
      return
    }

    const privateChannels = await prisma.channelMember.findMany({
      where: { userId },
      select: { channelId: true },
    })

    const privateIds = privateChannels.map((c) => c.channelId)

    const channels = await prisma.channel.findMany({
      where: {
        workspaceId,
        OR: [
          {
            isPrivate: false,
            name: { contains: query as string, mode: 'insensitive' },
          },
          {
            isPrivate: true,
            id: { in: privateIds },
            name: { contains: query as string, mode: 'insensitive' },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        description: true,
        isPrivate: true,
        _count: {
          select: { members: true },
        },
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    })

    await prisma.searchLog.create({
      data: {
        userId,
        query: query as string,
        resultCount: channels.length,
        searchType: 'CHANNEL',
      },
    })

    res.json({ results: channels, count: channels.length })
  } catch (error: any) {
    res.status(500).json({ message: 'Search failed', error: error.message })
  }
}

// 💬 Search Direct Messages
export const searchDirectMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { workspaceId } = req.params
    const { query, limit = '50', offset = '0' } = req.query
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    if (!query) {
      res.status(400).json({ message: 'Search query required' })
      return
    }

    const messages = await prisma.directMessage.findMany({
      where: {
        room: { workspaceId },
        OR: [
          {
            senderId: userId,
            content: { contains: query as string, mode: 'insensitive' },
          },
          {
            receiverId: userId,
            content: { contains: query as string, mode: 'insensitive' },
          },
        ],
        deletedAt: null,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      orderBy: { createdAt: 'desc' },
    })

    res.json({ results: messages, count: messages.length })
  } catch (error: any) {
    res.status(500).json({ message: 'Search failed', error: error.message })
  }
}