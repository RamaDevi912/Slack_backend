import prisma from '../config/database.js';
import { AuthenticationError, NotFoundError } from '../utils/errors.js';

// ── Interfaces ──

export interface SendMessageInput {
  content: string;
  attachments?: string[];
}

export interface GetMessagesOptions {
  page?: number;
  limit?: number;
}

export interface UpdateMessageInput {
  content: string;
}

export interface ReplyInput {
  content: string;
}

// ── Service Functions ──

export const sendMessage = async (
  channelId: string,
  userId: string,
  data: SendMessageInput,
) => {
  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
    include: { members: true },
  });

  if (!channel) {
    throw new NotFoundError('Channel');
  }

  const isMember = channel.members.some((m) => m.userId === userId);
  if (!isMember) {
    throw new AuthenticationError('Access denied');
  }

  return prisma.message.create({
    data: {
      channelId,
      userId,
      content: data.content,
      attachments: data.attachments || [],
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          profilePicture: true,
        },
      },
    },
  });
};

export const getMessages = async (
  channelId: string,
  userId: string,
  options: GetMessagesOptions,
) => {
  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
    include: { members: true },
  });

  if (!channel) {
    throw new NotFoundError('Channel');
  }

  const isMember = channel.members.some((m) => m.userId === userId);
  if (!isMember) {
    throw new AuthenticationError('Access denied');
  }

  const page = options.page || 1;
  const limit = Math.min(options.limit || 20, 100);
  const skip = (page - 1) * limit;

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where: { channelId, deletedAt: null },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
        reactions: true,
        replies: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.message.count({
      where: { channelId, deletedAt: null },
    }),
  ]);

  return {
    messages: messages.reverse(),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const updateMessage = async (messageId: string, userId: string, data: UpdateMessageInput) => {
  const message = await prisma.message.findUnique({
    where: { id: messageId },
  });

  if (!message) {
    throw new NotFoundError('Message');
  }

  if (message.userId !== userId) {
    throw new AuthenticationError('Only sender can edit');
  }

  return prisma.message.update({
    where: { id: messageId },
    data: {
      content: data.content,
      editedAt: new Date(),
    },
  });
};

export const deleteMessage = async (messageId: string, userId: string) => {
  const message = await prisma.message.findUnique({
    where: { id: messageId },
  });

  if (!message) {
    throw new NotFoundError('Message');
  }

  if (message.userId !== userId) {
    throw new AuthenticationError('Only sender can delete');
  }

  await prisma.message.update({
    where: { id: messageId },
    data: { deletedAt: new Date() },
  });

  return { message: 'Deleted' };
};

export const addReaction = async (messageId: string, userId: string, emoji: string) => {
  await prisma.message.findUniqueOrThrow({ where: { id: messageId } });

  return prisma.messageReaction.upsert({
    where: {
      messageId_userId_emoji: {
        messageId,
        userId,
        emoji,
      },
    },
    update: {},
    create: {
      messageId,
      userId,
      emoji,
    },
  });
};

export const removeReaction = async (reactionId: string, userId: string) => {
  const reaction = await prisma.messageReaction.findUnique({
    where: { id: reactionId },
  });

  if (!reaction) {
    throw new NotFoundError('Reaction');
  }

  if (reaction.userId !== userId) {
    throw new AuthenticationError('Not allowed');
  }

  await prisma.messageReaction.delete({
    where: { id: reactionId },
  });

  return { message: 'Removed' };
};

export const replyToMessage = async (
  messageId: string,
  userId: string,
  data: ReplyInput,
) => {
  const message = await prisma.message.findUnique({
    where: { id: messageId },
    include: {
      channel: { include: { members: true } },
    },
  });

  if (!message) {
    throw new NotFoundError('Message');
  }

  const isMember = message.channel.members.some(
    (m) => m.userId === userId,
  );

  if (!isMember) {
    throw new AuthenticationError('Access denied');
  }

  return prisma.messageReply.create({
    data: {
      messageId: messageId,
      userId,
      content: data.content,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          profilePicture: true,
        },
      },
    },
  });
};

export const getThread = async (messageId: string, userId: string) => {
  const message = await prisma.message.findUnique({
    where: { id: messageId },
    include: {
      channel: { include: { members: true } },
      replies: {
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
  });

  if (!message) {
    throw new NotFoundError('Message');
  }

  const isMember = message.channel.members.some(
    (m) => m.userId === userId,
  );

  if (!isMember) {
    throw new AuthenticationError('Access denied');
  }

  return message;
};

export const markChannelAsRead = async (channelId: string, userId: string) => {
  const latestMessage = await prisma.message.findFirst({
    where: { channelId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
  });

  return prisma.channelMember.update({
    where: {
      channelId_userId: { channelId, userId },
    },
    data: {
      unreadMessages: 0,
      lastReadMessageId: latestMessage?.id || null,
      lastReadAt: new Date(),
    },
  });
};

