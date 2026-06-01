import prisma from '../config/database.js';
import { AuthenticationError, NotFoundError } from '../utils/errors.js';

export class MessageService {
  /**
   * Send message
   */
  async sendMessage(
    channelId: string,
    userId: string,
    data: {
      content: string;
      attachments?: string[];
    },
  ) {
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
  }

  /**
   * Get messages
   */
  async getMessages(
    channelId: string,
    userId: string,
    options: { page?: number; limit?: number },
  ) {
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
  }

  /**
   * Update message
   */
  async updateMessage(messageId: string, userId: string, data: { content: string }) {
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
  }

  /**
   * Delete message
   */
  async deleteMessage(messageId: string, userId: string) {
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
  }

  /**
   * Add reaction (no duplicates)
   */
  async addReaction(messageId: string, userId: string, emoji: string) {
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
  }

  /**
   * Remove reaction
   */
  async removeReaction(reactionId: string, userId: string) {
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
  }

  /**
   * Reply to message (FIXED)
   */
  async replyToMessage(
    messageId: string,
    userId: string,
    data: { content: string },
  ) {
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
  }

  /**
   * Get thread (secure)
   */
  async getThread(messageId: string, userId: string) {
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
  }

  /**
   * Mark channel as read
   */
  async markChannelAsRead(channelId: string, userId: string) {
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
  }
}

export default new MessageService();
