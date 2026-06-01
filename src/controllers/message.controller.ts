import { Request, Response } from 'express'
import prisma from '../config/database'

// Auth Request
interface AuthRequest extends Request {
  user?: { id: string }
}

// Create message
export const createMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { channelId } = req.params
    const { content, attachments = [] } = req.body
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    if (!content && attachments.length === 0) {
      res.status(400).json({ message: 'Content or attachments required' })
      return
    }

    const message = await prisma.message.create({
      data: {
        channelId,
        userId,
        content,
        attachments,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
            firstName: true,
            lastName: true,
          },
        },
        reactions: true,
      },
    })

    // 🔥 OPTIMIZED (avoid repeated DB calls)
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      select: { workspaceId: true },
    })

    const members = await prisma.channelMember.findMany({
      where: { channelId },
    })

    for (const member of members) {
      if (member.userId !== userId) {
        const workspaceMember = await prisma.workspaceMember.findUnique({
          where: {
            workspaceId_userId: {
              workspaceId: channel!.workspaceId,
              userId: member.userId,
            },
          },
        })

        if (!workspaceMember) continue

        await prisma.unreadChannel.upsert({
          where: {
            workspaceMemberId_channelId: {
              workspaceMemberId: workspaceMember.id,
              channelId,
            },
          },
          update: {
            unreadCount: { increment: 1 },
          },
          create: {
            workspaceMemberId: workspaceMember.id,
            channelId,
            unreadCount: 1,
          },
        })
      }
    }

    res.status(201).json({ message: 'Message created', data: message })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to create message', error: error.message })
  }
}

// Get messages
export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { channelId } = req.params
    const { limit = '50', offset = '0' } = req.query

    const messages = await prisma.message.findMany({
      where: {
        channelId,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
            firstName: true,
            lastName: true,
          },
        },
        reactions: true,
        replies: {
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
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    })

    res.json(messages.reverse())
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch messages', error: error.message })
  }
}

// Update message
export const updateMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { messageId } = req.params
    const { content } = req.body
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    })

    if (!message) {
      res.status(404).json({ message: 'Message not found' })
      return
    }

    if (message.userId !== userId) {
      res.status(403).json({ message: 'Only owner can edit' })
      return
    }

    const updated = await prisma.message.update({
      where: { id: messageId },
      data: {
        content,
        editedAt: new Date(),
      },
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
    })

    res.json({ message: 'Updated', data: updated })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update', error: error.message })
  }
}

// Delete message
export const deleteMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { messageId } = req.params
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    })

    if (!message) {
      res.status(404).json({ message: 'Message not found' })
      return
    }

    if (message.userId !== userId) {
      res.status(403).json({ message: 'Only owner can delete' })
      return
    }

    await prisma.message.update({
      where: { id: messageId },
      data: { deletedAt: new Date() },
    })

    res.json({ message: 'Deleted' })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete', error: error.message })
  }
}

// Add reaction
export const addReaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { messageId } = req.params
    const { emoji } = req.body
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    if (!emoji) {
      res.status(400).json({ message: 'Emoji required' })
      return
    }

    const reaction = await prisma.messageReaction.create({
      data: {
        messageId,
        userId,
        emoji,
      },
    })

    res.status(201).json({ message: 'Reaction added', data: reaction })
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ message: 'Already reacted' })
      return
    }
    res.status(500).json({ message: 'Failed to react', error: error.message })
  }
}

// Remove reaction
export const removeReaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { messageId } = req.params
    const { emoji } = req.body
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    await prisma.messageReaction.deleteMany({
      where: {
        messageId,
        userId,
        emoji,
      },
    })

    res.json({ message: 'Reaction removed' })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to remove reaction', error: error.message })
  }
}

// Create reply
export const createReply = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { messageId } = req.params
    const { content, attachments = [] } = req.body
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    if (!content && attachments.length === 0) {
      res.status(400).json({ message: 'Reply content required' })
      return
    }

    const reply = await prisma.messageReply.create({
      data: {
        messageId,
        userId,
        content,
        attachments,
      },
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
    })

    res.status(201).json({ message: 'Reply created', data: reply })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to create reply', error: error.message })
  }
}

// Get thread replies
export const getThreadReplies = async (req: Request, res: Response): Promise<void> => {
  try {
    const { messageId } = req.params
    const { limit = '50', offset = '0' } = req.query

    const replies = await prisma.messageReply.findMany({
      where: {
        messageId,
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
        reactions: true,
      },
      orderBy: { createdAt: 'asc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    })

    res.json(replies)
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch replies', error: error.message })
  }
}

// Mark channel as read
export const markChannelAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { channelId } = req.params
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const latestMessage = await prisma.message.findFirst({
      where: { channelId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    })

    if (!latestMessage) {
      res.json({ message: 'No messages' })
      return
    }

    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      select: { workspaceId: true },
    })

    const workspaceMember = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: channel!.workspaceId,
          userId,
        },
      },
    })

    if (!workspaceMember) {
      res.status(404).json({ message: 'Workspace member not found' })
      return
    }

    await prisma.unreadChannel.upsert({
      where: {
        workspaceMemberId_channelId: {
          workspaceMemberId: workspaceMember.id,
          channelId,
        },
      },
      update: {
        unreadCount: 0,
        lastReadMessageId: latestMessage.id,
        lastReadAt: new Date(),
      },
      create: {
        workspaceMemberId: workspaceMember.id,
        channelId,
        unreadCount: 0,
        lastReadMessageId: latestMessage.id,
        lastReadAt: new Date(),
      },
    })

    res.json({ message: 'Marked as read' })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to mark as read', error: error.message })
  }
}