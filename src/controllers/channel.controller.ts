import { Request, Response } from 'express'
import prisma from '../config/database'

// Auth request type
interface AuthRequest extends Request {
  user?: { id: string }
}

// Create channel
export const createChannel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { workspaceId } = req.params
    const { name, description, isPrivate = false } = req.body
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    if (!name) {
      res.status(400).json({ message: 'Channel name is required' })
      return
    }

    const existingChannel = await prisma.channel.findFirst({
      where: {
        workspaceId,
        name: name.toLowerCase(),
      },
    })

    if (existingChannel) {
      res.status(409).json({ message: 'Channel name already exists' })
      return
    }

    const channel = await prisma.channel.create({
      data: {
        workspaceId,
        name: name.toLowerCase(),
        description,
        isPrivate,
        createdBy: userId,
      },
    })

    await prisma.channelMember.create({
      data: {
        channelId: channel.id,
        userId,
        role: 'OWNER',
      },
    })

    if (!isPrivate) {
      const members = await prisma.workspaceMember.findMany({
        where: { workspaceId },
      })

      for (const member of members) {
        if (member.userId !== userId) {
          await prisma.channelMember.create({
            data: {
              channelId: channel.id,
              userId: member.userId,
              role: 'MEMBER',
            },
          })
        }
      }
    }

    res.status(201).json({ message: 'Channel created', channel })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to create channel', error: error.message })
  }
}

// Get channels
export const getChannels = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { workspaceId } = req.params
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const channels = await prisma.channel.findMany({
      where: {
        workspaceId,
        archivedAt: null,
      },
      include: {
        members: true,
      },
    })

    const accessibleChannels = channels.filter((channel) => {
      if (!channel.isPrivate) return true
      return channel.members.some((m) => m.userId === userId)
    })

    res.json(accessibleChannels)
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch channels', error: error.message })
  }
}

// Get single channel
export const getChannel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { channelId } = req.params

    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                status: true,
              },
            },
          },
        },
      },
    })

    if (!channel) {
      res.status(404).json({ message: 'Channel not found' })
      return
    }

    res.json(channel)
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch channel', error: error.message })
  }
}

// Update channel
export const updateChannel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { channelId } = req.params
    const { name, description, topic } = req.body

    const channel = await prisma.channel.update({
      where: { id: channelId },
      data: {
        ...(name && { name: name.toLowerCase() }),
        ...(description && { description }),
        ...(topic && { topic }),
      },
    })

    res.json({ message: 'Channel updated', channel })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update channel', error: error.message })
  }
}

// Add member
export const addChannelMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { channelId } = req.params
    const { userId, role = 'MEMBER' } = req.body

    if (!userId) {
      res.status(400).json({ message: 'User ID required' })
      return
    }

    const member = await prisma.channelMember.create({
      data: {
        channelId,
        userId,
        role,
      },
    })

    res.status(201).json({ message: 'Member added', member })
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ message: 'Already a member' })
      return
    }
    res.status(500).json({ message: 'Failed to add member', error: error.message })
  }
}

// Remove member
export const removeChannelMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { channelId, memberId } = req.params

    await prisma.channelMember.delete({
      where: {
        channelId_userId: {
          channelId,
          userId: memberId,
        },
      },
    })

    res.json({ message: 'Member removed' })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to remove member', error: error.message })
  }
}

// Join channel
export const joinChannel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { channelId } = req.params
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
    })

    if (!channel) {
      res.status(404).json({ message: 'Channel not found' })
      return
    }

    if (channel.isPrivate) {
      res.status(403).json({ message: 'Cannot join private channel' })
      return
    }

    const member = await prisma.channelMember.create({
      data: {
        channelId,
        userId,
        role: 'MEMBER',
      },
    })

    res.status(201).json({ message: 'Joined channel', member })
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ message: 'Already a member' })
      return
    }
    res.status(500).json({ message: 'Failed to join', error: error.message })
  }
}

// Leave channel
export const leaveChannel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { channelId } = req.params
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    await prisma.channelMember.delete({
      where: {
        channelId_userId: {
          channelId,
          userId,
        },
      },
    })

    res.json({ message: 'Left channel' })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to leave', error: error.message })
  }
}

// Get pinned messages
export const getPinnedMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { channelId } = req.params

    const pinned = await prisma.pinnedMessage.findMany({
      where: { channelId },
      include: {
        message: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profilePicture: true,
              },
            },
            reactions: true,
          },
        },
      },
    })

    res.json(pinned)
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch pinned', error: error.message })
  }
}

// Pin message
export const pinMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { channelId, messageId } = req.params
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const pinned = await prisma.pinnedMessage.create({
      data: {
        messageId,
        channelId,
        pinnedBy: userId,
      },
    })

    res.status(201).json({ message: 'Message pinned', pinned })
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ message: 'Already pinned' })
      return
    }
    res.status(500).json({ message: 'Failed to pin', error: error.message })
  }
}

// Unpin message
export const unpinMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { channelId, messageId } = req.params

    await prisma.pinnedMessage.delete({
      where: {
        messageId_channelId: {
          messageId,
          channelId,
        },
      },
    })

    res.json({ message: 'Unpinned' })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to unpin', error: error.message })
  }
}