import { WorkspaceRole } from '@prisma/client';
import prisma from '../config/database.js';
import { ConflictError, ErrorCode, NotFoundError } from '../utils/errors.js';
import { generateSlug } from '../utils/slug.js';

// ── Interfaces ──

export interface CreateWorkspaceInput {
  name: string;
  description?: string;
  slug?: string;
  createdBy: string;
}

export interface UpdateWorkspaceInput {
  name?: string;
  description?: string;
}

export interface InviteUserInput {
  workspaceId: string;
  email: string;
  role: WorkspaceRole;
  invitedBy: string;
}

// ── Service Functions ──

export const createWorkspace = async (data: CreateWorkspaceInput) => {
  let slug = data.slug;
  if (!slug || slug.trim() === '') {
    slug = generateSlug(data.name);
  }

  slug = slug.toLowerCase().trim();

  let uniqueSlug = slug;
  let counter = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existingWorkspace = await prisma.workspace.findUnique({
      where: { slug: uniqueSlug },
    });

    if (!existingWorkspace) {
      break;
    }

    if (data.slug) {
      throw new ConflictError(
        'Workspace slug already exists',
        ErrorCode.WORKSPACE_SLUG_EXISTS,
      );
    }

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  const workspace = await prisma.workspace.create({
    data: {
      name: data.name,
      description: data.description,
      slug: uniqueSlug,
      createdBy: data.createdBy,
    },
  });

  await prisma.workspaceMember.create({
    data: {
      workspaceId: workspace.id,
      userId: data.createdBy,
      role: 'OWNER',
    },
  });

  return workspace;
};

export const getWorkspaceById = async (workspaceId: string) => {
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
              profilePicture: true,
              status: true,
            },
          },
        },
      },
      channels: {
        where: { archivedAt: null },
      },
    },
  });

  if (!workspace) {
    throw new NotFoundError('Workspace');
  }

  return workspace;
};

export const getUserWorkspaces = async (userId: string) => {
  return prisma.workspace.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      members: {
        where: { userId },
      },
      channels: {
        where: { archivedAt: null },
      },
    },
  });
};

export const updateWorkspace = async (
  workspaceId: string,
  data: UpdateWorkspaceInput,
) => {
  return prisma.workspace.update({
    where: { id: workspaceId },
    data,
  });
};

export const addMember = async (
  workspaceId: string,
  userId: string,
  role: WorkspaceRole = 'MEMBER',
) => {
  const existingMember = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: { workspaceId, userId },
    },
  });

  if (existingMember) {
    throw new ConflictError(
      'User already a member of this workspace',
      ErrorCode.DUPLICATE_MEMBER,
    );
  }

  return prisma.workspaceMember.create({
    data: {
      workspaceId,
      userId,
      role,
    },
  });
};

export const removeMember = async (workspaceId: string, userId: string) => {
  await prisma.workspaceMember.delete({
    where: {
      workspaceId_userId: { workspaceId, userId },
    },
  });

  return { message: 'Member removed successfully' };
};

export const updateMemberRole = async (workspaceId: string, userId: string, role: WorkspaceRole) => {
  return prisma.workspaceMember.update({
    where: {
      workspaceId_userId: { workspaceId, userId },
    },
    data: { role },
  });
};

export const getMembers = async (workspaceId: string) => {
  return prisma.workspaceMember.findMany({
    where: { workspaceId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          profilePicture: true,
          status: true,
        },
      },
    },
  });
};

export const inviteUser = async (data: InviteUserInput) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  return prisma.workspaceInvitation.upsert({
    where: {
      workspaceId_email: {
        workspaceId: data.workspaceId,
        email: data.email,
      },
    },
    update: {
      expiresAt,
      used: false,
    },
    create: {
      workspaceId: data.workspaceId,
      email: data.email,
      role: data.role,
      invitedBy: data.invitedBy,
      expiresAt,
    },
  });
};

