import prisma from '../config/database.js';
import {
  AuthenticationError,
  NotFoundError,
} from '../utils/errors.js';

// ── Interfaces ──

export interface AuditLogOptions {
  page?: number;
  limit?: number;
}

// ── Service Functions ──

export const getDashboardStats = async () => {
  const [
    totalUsers,
    totalWorkspaces,
    totalChannels,
    totalMessages,
    totalDirectMessages,
    activeCalls,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.workspace.count(),
    prisma.channel.count(),
    prisma.message.count(),
    prisma.directMessage.count(),
    prisma.call.count({
      where: {
        status: {
          in: ['INITIATED', 'ACTIVE'],
        },
      },
    }),
    prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    totalUsers,
    totalWorkspaces,
    totalChannels,
    totalMessages,
    totalDirectMessages,
    activeCalls,
    recentUsers,
    timestamp: new Date(),
  };
};

export const getUserStats = async () => {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          messages: true,
          workspaceMembers: true,
          directMessages: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return users.map((user) => ({
    userId: user.id,
    username: user.username,
    email: user.email,
    messagesCount: user._count.messages,
    workspacesCount: user._count.workspaceMembers,
    directMessagesCount: user._count.directMessages,
    createdAt: user.createdAt,
    lastActiveAt: user.lastActiveAt,
  }));
};

export const getWorkspaceStats = async () => {
  const workspaces = await prisma.workspace.findMany({
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
    orderBy: { createdAt: 'desc' },
  });

  return workspaces.map((ws) => ({
    workspaceId: ws.id,
    name: ws.name,
    membersCount: ws._count.members,
    channelsCount: ws._count.channels,
    createdAt: ws.createdAt,
    admin: ws.admin,
  }));
};

export const getAuditLogs = async (options: AuditLogOptions) => {
  const page = options.page || 1;
  const limit = Math.min(options.limit || 20, 100);
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.auditLog.count(),
  ]);

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const banUser = async (userId: string, reason: string) => {
  if (!userId) {
    throw new AuthenticationError('User ID required');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      accountStatus: 'BANNED',
      banReason: reason,
    },
  });
};

export const unbanUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      accountStatus: 'ACTIVE',
      banReason: null,
    },
  });
};

export const getSystemHealth = async () => {
  try {
    await prisma.user.count();

    return {
      status: 'healthy',
      database: 'connected',
      uptime: process.uptime(),
      timestamp: new Date(),
    };
  } catch (_error) {
    return {
      status: 'unhealthy',
      database: 'disconnected',
      timestamp: new Date(),
    };
  }
};

export const getUserDetails = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      workspaceMembers: {
        include: {
          workspace: true,
        },
      },
      platformAdmin: true,
    },
  });

  if (!user) {
    throw new NotFoundError('User');
  }
  return user;
};

export const promoteToAdmin = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new NotFoundError('User');
  }

  return prisma.platformAdmin.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      role: 'ADMIN',
    },
  });
};

export const removeAdmin = async (userId: string) => {
  try {
    await prisma.platformAdmin.delete({
      where: { userId },
    });
    return { message: 'Platform admin privileges removed' };
  } catch (_error) {
    return { message: 'User was not a platform admin' };
  }
};

export const getWorkspaceDetails = async (workspaceId: string) => {
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
            },
          },
        },
      },
      channels: true,
    },
  });

  if (!workspace) {
    throw new NotFoundError('Workspace');
  }
  return workspace;
};

export const getAllChannels = async () => {
  return prisma.channel.findMany({
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
    orderBy: { createdAt: 'desc' },
  });
};

export const getActivityAnalytics = async () => {
  const [messagesCount, directMessagesCount, callsCount] = await Promise.all([
    prisma.message.count(),
    prisma.directMessage.count(),
    prisma.call.count(),
  ]);

  return {
    messagesCount,
    directMessagesCount,
    callsCount,
    timestamp: new Date(),
  };
};

