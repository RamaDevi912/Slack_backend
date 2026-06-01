import { Request, Response } from 'express'
import prisma from '../config/database'

// Auth Request
interface AuthRequest extends Request {
  user?: { id: string }
}

// Get or create DM room
export const getOrCreateDMRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { workspaceId } = req.params
    const { userId } = req.body
    const currentUserId = req.user?.id

    if (!currentUserId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    if (!userId) {
      res.status(400).json({ message: 'User ID required' })
      return
    }

    if (userId === currentUserId) {
      res.status(400).json({ message: 'Cannot DM yourself' })
      return
    }

    const currentMember = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: { workspaceId, userId: currentUserId },
      },
    })

    const otherMember = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: { workspaceId, userId },
      },
    })

    if (!currentMember || !otherMember) {
      res.status(403).json({ message: 'Users must be in same workspace' })
      return
    }

    const existingRoom = await prisma.directMessageRoom.findFirst({
      where: {
        workspaceId,
        participantIds: {
          hasEvery: [currentUserId, userId], // 🔥 FIX (important)
        },
      },
    })

    if (existingRoom) {
      res.json(existingRoom)
      return
    }

    const room = await prisma.directMessageRoom.create({
      data: {
        workspaceId,
        participantIds: [currentUserId, userId],
      },
    })

    res.status(201).json(room)
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to create DM room', error: error.message })
  }
}

// Get DM rooms
export const getDMRooms = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { workspaceId } = req.params
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const rooms = await prisma.directMessageRoom.findMany({
      where: {
        workspaceId,
        participantIds: { has: userId },
      },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                profilePicture: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    res.json(rooms)
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch rooms', error: error.message })
  }
}

// Send DM
export const sendDirectMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { roomId } = req.params
    const { receiverId, content, attachments = [] } = req.body
    const senderId = req.user?.id

    if (!senderId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    if (!content && attachments.length === 0) {
      res.status(400).json({ message: 'Content or attachments required' })
      return
    }

    const room = await prisma.directMessageRoom.findUnique({
      where: { id: roomId },
    })

    if (!room) {
      res.status(404).json({ message: 'Room not found' })
      return
    }

    if (!room.participantIds.includes(senderId) || !room.participantIds.includes(receiverId)) {
      res.status(403).json({ message: 'Access denied' })
      return
    }

    const message = await prisma.directMessage.create({
      data: {
        roomId,
        senderId,
        receiverId,
        content,
        attachments,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
    })

    await prisma.directMessageRoom.update({
      where: { id: roomId },
      data: { updatedAt: new Date() },
    })

    res.status(201).json({ message: 'Message sent', data: message })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to send message', error: error.message })
  }
}

// Get DM messages
export const getDMMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { roomId } = req.params
    const userId = req.user?.id
    const { limit = '50', offset = '0' } = req.query

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const room = await prisma.directMessageRoom.findUnique({
      where: { id: roomId },
    })

    if (!room) {
      res.status(404).json({ message: 'Room not found' })
      return
    }

    if (!room.participantIds.includes(userId)) {
      res.status(403).json({ message: 'Access denied' })
      return
    }

    const messages = await prisma.directMessage.findMany({
      where: {
        roomId,
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
        reactions: true,
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    })

    await prisma.directMessage.updateMany({
      where: {
        roomId,
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    res.json(messages.reverse())
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch messages', error: error.message })
  }
}

// Update message
export const updateDirectMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { messageId } = req.params
    const { content } = req.body
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const message = await prisma.directMessage.findUnique({
      where: { id: messageId },
    })

    if (!message) {
      res.status(404).json({ message: 'Message not found' })
      return
    }

    if (message.senderId !== userId) {
      res.status(403).json({ message: 'Only sender can edit' })
      return
    }

    const updated = await prisma.directMessage.update({
      where: { id: messageId },
      data: {
        content,
        editedAt: new Date(),
      },
    })

    res.json({ message: 'Updated', data: updated })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update', error: error.message })
  }
}

// Delete message
export const deleteDirectMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { messageId } = req.params
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const message = await prisma.directMessage.findUnique({
      where: { id: messageId },
    })

    if (!message) {
      res.status(404).json({ message: 'Message not found' })
      return
    }

    if (message.senderId !== userId) {
      res.status(403).json({ message: 'Only sender can delete' })
      return
    }

    await prisma.directMessage.update({
      where: { id: messageId },
      data: { deletedAt: new Date() },
    })

    res.json({ message: 'Deleted' })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete', error: error.message })
  }
}

// Add reaction
export const addDMReaction = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const reaction = await prisma.directMessageReaction.create({
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
export const removeDMReaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { messageId } = req.params
    const { emoji } = req.body
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    await prisma.directMessageReaction.deleteMany({
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