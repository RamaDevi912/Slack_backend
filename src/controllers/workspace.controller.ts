import { Request, Response } from 'express'
import prisma from '../config/database'
import { v4 as uuidv4 } from 'uuid'

// Auth Request
interface AuthRequest extends Request {
  user?: { id: string }
}

// Create workspace
export const createWorkspace = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    if (!name) {
      res.status(400).json({ message: 'Workspace name required' })
      return
    }

    const slug =
      name.toLowerCase().replace(/\s+/g, '-') +
      '-' +
      uuidv4().substring(0, 6)

    const workspace = await prisma.workspace.create({
      data: {
        name,
        slug,
        description,
        createdBy: userId,
      },
    })

    await prisma.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId,
        role: 'OWNER',
      },
    })

    await prisma.channel.create({
      data: {
        workspaceId: workspace.id,
        name: 'general',
        description: 'General discussion',
        isPrivate: false,
        createdBy: userId,
      },
    })

    res.status(201).json({
      message: 'Workspace created',
      workspace,
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to create workspace', error: error.message })
  }
}

// Get user workspaces
export const getUserWorkspaces = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const memberships = await prisma.workspaceMember.findMany({
      where: { userId },
      include: {
        workspace: {
          include: {
            members: true,
            channels: true,
          },
        },
      },
    })

    const workspaces = memberships.map((m) => m.workspace)

    res.json(workspaces)
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch workspaces', error: error.message })
  }
}

// Get single workspace
export const getWorkspace = async (req: Request, res: Response): Promise<void> => {
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
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                status: true,
              },
            },
          },
        },
        channels: {
          where: { archivedAt: null },
          include: {
            members: true,
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
    res.status(500).json({ message: 'Failed to fetch workspace', error: error.message })
  }
}

// Update workspace
export const updateWorkspace = async (req: Request, res: Response): Promise<void> => {
  try {
    const { workspaceId } = req.params
    const { name, description, logo } = req.body

    const workspace = await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(logo && { logo }),
      },
    })

    res.json({
      message: 'Workspace updated',
      workspace,
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update workspace', error: error.message })
  }
}

// Add member
export const addMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { workspaceId } = req.params
    const { userId, role = 'MEMBER' } = req.body

    if (!userId) {
      res.status(400).json({ message: 'User ID required' })
      return
    }

    const member = await prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId,
        role,
      },
    })

    res.status(201).json({
      message: 'Member added',
      member,
    })
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ message: 'User already a member' })
      return
    }

    res.status(500).json({ message: 'Failed to add member', error: error.message })
  }
}

// Remove member
export const removeMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { workspaceId, memberId } = req.params

    await prisma.workspaceMember.delete({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: memberId,
        },
      },
    })

    res.json({ message: 'Member removed' })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to remove member', error: error.message })
  }
}

// Invite to workspace
export const inviteToWorkspace = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { workspaceId } = req.params
    const { email, role = 'MEMBER' } = req.body
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    if (!email) {
      res.status(400).json({ message: 'Email required' })
      return
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    const invitation = await prisma.workspaceInvitation.create({
      data: {
        workspaceId,
        email,
        role,
        invitedBy: userId,
        expiresAt,
      },
    })

    res.status(201).json({
      message: 'Invitation sent',
      invitation,
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to invite user', error: error.message })
  }
}