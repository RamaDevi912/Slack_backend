import { Request, Response } from 'express'
import prisma from '../config/database'

// Extend Request for auth
interface AuthRequest extends Request {
  user?: {
    id: string
  }
}

// Initiate call
export const initiateCall = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type = 'AUDIO', channelId, recipientId } = req.body
    const initiatorId = req.user?.id

    if (!initiatorId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    if (!['AUDIO', 'VIDEO', 'SCREEN_SHARE'].includes(type)) {
      res.status(400).json({ message: 'Invalid call type' })
      return
    }

    if (!channelId && !recipientId) {
      res.status(400).json({ message: 'Either channelId or recipientId is required' })
      return
    }

    const call = await prisma.call.create({
      data: {
        initiatorId,
        type,
        status: 'INITIATED',
        ...(channelId && { channelId }),
      },
    })

    // Add initiator
    await prisma.callParticipant.create({
      data: {
        callId: call.id,
        userId: initiatorId,
        status: 'JOINED',
        joinedAt: new Date(),
      },
    })

    // Add recipients
    if (recipientId) {
      await prisma.callParticipant.create({
        data: {
          callId: call.id,
          userId: recipientId,
          status: 'INVITED',
        },
      })
    } else if (channelId) {
      const members = await prisma.channelMember.findMany({
        where: { channelId },
      })

      for (const member of members) {
        if (member.userId !== initiatorId) {
          await prisma.callParticipant.create({
            data: {
              callId: call.id,
              userId: member.userId,
              status: 'INVITED',
            },
          })
        }
      }
    }

    const callData = await prisma.call.findUnique({
      where: { id: call.id },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    })

    res.status(201).json({ message: 'Call initiated', data: callData })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to initiate call', error: error.message })
  }
}

// Get active calls
export const getChannelActiveCalls = async (req: Request, res: Response): Promise<void> => {
  try {
    const { channelId } = req.params

    const calls = await prisma.call.findMany({
      where: {
        channelId,
        status: { in: ['INITIATED', 'RINGING', 'ACTIVE'] },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profilePicture: true,
                status: true,
              },
            },
          },
        },
      },
    })

    res.json(calls)
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch active calls', error: error.message })
  }
}

// Accept call
export const acceptCall = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { callId } = req.params
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const callData = await prisma.call.findUnique({
      where: { id: callId },
    })

    if (!callData) {
      res.status(404).json({ message: 'Call not found' })
      return
    }

    await prisma.callParticipant.update({
      where: {
        callId_userId: { callId, userId },
      },
      data: {
        status: 'ACCEPTED',
        joinedAt: new Date(),
      },
    })

    const participants = await prisma.callParticipant.findMany({
      where: { callId },
    })

    const allAccepted = participants.every((p) => p.status !== 'INVITED')

    if (allAccepted) {
      await prisma.call.update({
        where: { id: callId },
        data: {
          status: 'ACTIVE',
          startedAt: new Date(),
        },
      })
    }

    const updated = await prisma.call.findUnique({
      where: { id: callId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    })

    res.json({ message: 'Call accepted', data: updated })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to accept call', error: error.message })
  }
}

// Decline call
export const declineCall = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { callId } = req.params
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    await prisma.callParticipant.update({
      where: {
        callId_userId: { callId, userId },
      },
      data: {
        status: 'DECLINED',
        leftAt: new Date(),
      },
    })

    res.json({ message: 'Call declined' })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to decline call', error: error.message })
  }
}

// Leave call
export const leaveCall = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { callId } = req.params
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    await prisma.callParticipant.update({
      where: {
        callId_userId: { callId, userId },
      },
      data: {
        status: 'LEFT',
        leftAt: new Date(),
      },
    })

    const remaining = await prisma.callParticipant.findMany({
      where: {
        callId,
        status: { in: ['JOINED', 'ACCEPTED'] },
      },
    })

    if (remaining.length === 0) {
      await prisma.call.update({
        where: { id: callId },
        data: {
          status: 'ENDED',
          endedAt: new Date(),
        },
      })

      const call = await prisma.call.findUnique({
        where: { id: callId },
      })

      if (call?.startedAt && call?.endedAt) {
        const duration = Math.floor(
          (call.endedAt.getTime() - call.startedAt.getTime()) / 1000
        )

        await prisma.call.update({
          where: { id: callId },
          data: { duration },
        })
      }
    }

    res.json({ message: 'Left call' })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to leave call', error: error.message })
  }
}

// Get call history
export const getCallHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { workspaceId } = req.params
    const { limit = '50', offset = '0' } = req.query

    const calls = await prisma.call.findMany({
      where: {
        channel: { workspaceId },
        status: 'ENDED',
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, username: true },
            },
          },
        },
        callHistory: true,
      },
      orderBy: { endedAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    })

    res.json(calls)
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch call history', error: error.message })
  }
}

// Get single call
export const getCall = async (req: Request, res: Response): Promise<void> => {
  try {
    const { callId } = req.params

    const call = await prisma.call.findUnique({
      where: { id: callId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profilePicture: true,
                status: true,
              },
            },
          },
        },
        callHistory: true,
      },
    })

    if (!call) {
      res.status(404).json({ message: 'Call not found' })
      return
    }

    res.json(call)
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch call', error: error.message })
  }
}