import prisma from '../config/database.js';
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from '../utils/errors.js';
import { ChannelRole } from '@prisma/client';

// ── Interfaces ──

export interface CreateChannelInput {
  name: string;
  description?: string;
  isPrivate?: boolean;
}

export interface UpdateChannelInput {
  name?: string;
  description?: string;
  topic?: string;
}

// ── Service Functions ──

export const createChannel = async (
  workspaceId: string,
  userId: string,
  data: CreateChannelInput,
) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });
  if (!workspace) {
    throw new NotFoundError('Workspace');
  }

  const member = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } },
  });
  if (!member) {
    throw new AuthenticationError('Access denied');
  }

  const name = data.name.toLowerCase();

  const exists = await prisma.channel.findFirst({
    where: { workspaceId, name },
  });
  if (exists) {
    throw new ConflictError('Channel already exists');
  }

  const channel = await prisma.channel.create({
    data: {
      workspaceId,
      name,
      description: data.description,
      isPrivate: data.isPrivate ?? false,
      createdBy: userId,
    },
  });

  const members: {
    channelId: string;
    userId: string;
    role: ChannelRole;
  }[] = [
    {
      channelId: channel.id,
      userId,
      role: ChannelRole.OWNER,
    },
  ];

  if (!data.isPrivate) {
    const workspaceMembers = await prisma.workspaceMember.findMany({
      where: { workspaceId },
      select: { userId: true },
    });

    const additionalMembers = workspaceMembers
      .filter((m) => m.userId !== userId)
      .map((m) => ({
        channelId: channel.id,
        userId: m.userId,
        role: ChannelRole.MEMBER,
      }));

    members.push(...additionalMembers);
  }

  await prisma.channelMember.createMany({
    data: members,
    skipDuplicates: true,
  });

  return channel;
};

export const getChannels = async (workspaceId: string, userId: string) => {
  const member = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } },
  });

  if (!member) {
    throw new AuthenticationError('Access denied');
  }

  return prisma.channel.findMany({
    where: {
      workspaceId,
      archivedAt: null,
    },
    include: {
      _count: { select: { members: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getChannelById = async (channelId: string, userId: string) => {
  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
    include: { members: true },
  });

  if (!channel) {
    throw new NotFoundError('Channel');
  }

  if (channel.isPrivate) {
    const isMember = channel.members.some((m) => m.userId === userId);
    if (!isMember) {
      throw new AuthenticationError('Access denied');
    }
  }

  return channel;
};

export const updateChannel = async (
  channelId: string,
  userId: string,
  data: UpdateChannelInput,
) => {
  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
    include: { members: true },
  });

  if (!channel) {
    throw new NotFoundError('Channel');
  }

  const member = channel.members.find((m) => m.userId === userId);

  if (
    !member ||
    (member.role !== ChannelRole.OWNER &&
      member.role !== ChannelRole.MODERATOR)
  ) {
    throw new AuthenticationError('Not allowed');
  }

  if (data.name) {
    const conflict = await prisma.channel.findFirst({
      where: {
        workspaceId: channel.workspaceId,
        name: data.name.toLowerCase(),
        id: { not: channelId },
      },
    });

    if (conflict) {
      throw new ConflictError('Channel name exists');
    }
  }

  return prisma.channel.update({
    where: { id: channelId },
    data: {
      name: data.name?.toLowerCase(),
      description: data.description,
      topic: data.topic,
    },
  });
};

export const deleteChannel = async (channelId: string, userId: string) => {
  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
    include: { members: true },
  });

  if (!channel) {
    throw new NotFoundError('Channel');
  }

  const member = channel.members.find((m) => m.userId === userId);

  if (member?.role !== ChannelRole.OWNER) {
    throw new AuthenticationError('Only owner can delete');
  }

  await prisma.channel.delete({
    where: { id: channelId },
  });

  return { message: 'Channel deleted' };
};

export const addMember = async (channelId: string, userId: string, targetUserId: string) => {
  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
    include: { members: true },
  });

  if (!channel) {
    throw new NotFoundError('Channel');
  }

  const admin = channel.members.find((m) => m.userId === userId);

  if (
    !admin ||
    (admin.role !== ChannelRole.OWNER &&
      admin.role !== ChannelRole.MODERATOR)
  ) {
    throw new AuthenticationError('Not allowed');
  }

  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
  });
  if (!user) {
    throw new NotFoundError('User');
  }

  return prisma.channelMember.upsert({
    where: {
      channelId_userId: { channelId, userId: targetUserId },
    },
    update: {},
    create: {
      channelId,
      userId: targetUserId,
      role: ChannelRole.MEMBER,
    },
  });
};

export const removeMember = async (channelId: string, userId: string, targetUserId: string) => {
  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
    include: { members: true },
  });

  if (!channel) {
    throw new NotFoundError('Channel');
  }

  const admin = channel.members.find((m) => m.userId === userId);

  if (
    !admin ||
    (admin.role !== ChannelRole.OWNER &&
      admin.role !== ChannelRole.MODERATOR)
  ) {
    throw new AuthenticationError('Not allowed');
  }

  await prisma.channelMember.deleteMany({
    where: { channelId, userId: targetUserId },
  });

  return { message: 'Member removed' };
};

export const getMembers = async (channelId: string, userId: string) => {
  const isMember = await prisma.channelMember.findUnique({
    where: { channelId_userId: { channelId, userId } },
  });

  if (!isMember) {
    throw new AuthenticationError('Access denied');
  }

  return prisma.channelMember.findMany({
    where: { channelId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          profilePicture: true,
          status: true,
        },
      },
    },
  });
};

export const archiveChannel = async (channelId: string, userId: string) => {
  const member = await prisma.channelMember.findUnique({
    where: { channelId_userId: { channelId, userId } },
  });

  if (member?.role !== ChannelRole.OWNER) {
    throw new AuthenticationError('Only owner can archive');
  }

  return prisma.channel.update({
    where: { id: channelId },
    data: { archivedAt: new Date() },
  });
};

export const joinChannel = async (channelId: string, userId: string) => {
  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
  });
  if (!channel) {
    throw new NotFoundError('Channel');
  }
  if (channel.isPrivate) {
    throw new AuthenticationError('Cannot join private channel without invite');
  }

  return prisma.channelMember.upsert({
    where: {
      channelId_userId: { channelId, userId },
    },
    update: {},
    create: {
      channelId,
      userId,
      role: ChannelRole.MEMBER,
    },
  });
};

export const leaveChannel = async (channelId: string, userId: string) => {
  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
  });
  if (!channel) {
    throw new NotFoundError('Channel');
  }

  const member = await prisma.channelMember.findUnique({
    where: { channelId_userId: { channelId, userId } },
  });
  if (!member) {
    throw new NotFoundError('Channel member');
  }

  if (member.role === ChannelRole.OWNER) {
    const owners = await prisma.channelMember.count({
      where: { channelId, role: ChannelRole.OWNER },
    });
    if (owners <= 1) {
      throw new ConflictError('Cannot leave as the last owner');
    }
  }

  await prisma.channelMember.delete({
    where: { channelId_userId: { channelId, userId } },
  });

  return { message: 'Left channel' };
};

export const getPinnedMessages = async (channelId: string) => {
  return prisma.pinnedMessage.findMany({
    where: { channelId },
    include: {
      message: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              profilePicture: true,
            },
          },
        },
      },
    },
  });
};

export const pinMessage = async (channelId: string, messageId: string, pinnedBy: string) => {
  const message = await prisma.message.findUnique({
    where: { id: messageId },
  });
  if (message?.channelId !== channelId) {
    throw new NotFoundError('Message in this channel not found');
  }

  return prisma.pinnedMessage.upsert({
    where: {
      messageId_channelId: { messageId, channelId },
    },
    update: {},
    create: {
      messageId,
      channelId,
      pinnedBy,
    },
  });
};

export const unpinMessage = async (channelId: string, messageId: string) => {
  try {
    await prisma.pinnedMessage.delete({
      where: {
        messageId_channelId: { messageId, channelId },
      },
    });
    return { message: 'Message unpinned' };
  } catch (_error) {
    throw new NotFoundError('Pinned message not found');
  }
};

// ── Default Export ──

