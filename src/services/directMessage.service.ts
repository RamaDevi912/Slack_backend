import prisma from '../config/database.js';
import { AuthenticationError, NotFoundError } from '../utils/errors.js';

// ── Interfaces ──

export interface GetMessagesOptions {
  page?: number;
  limit?: number;
}

// ── Service Functions ──

export const getOrCreateRoom = async (
  workspaceId: string,
  userId: string,
  recipientId: string,
) => {
  if (userId === recipientId) {
    throw new AuthenticationError('Cannot DM yourself');
  }

  const existing = await prisma.directMessageRoom.findFirst({
    where: {
      workspaceId,
      participantIds: {
        hasEvery: [userId, recipientId],
      },
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.directMessageRoom.create({
    data: {
      workspaceId,
      participantIds: [userId, recipientId],
    },
  });
};

export const sendMessage = async (
  roomId: string,
  senderId: string,
  receiverId: string,
  content: string,
) => {
  const room = await prisma.directMessageRoom.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    throw new NotFoundError('Room');
  }

  if (!room.participantIds.includes(senderId)) {
    throw new AuthenticationError('Access denied');
  }

  const message = await prisma.directMessage.create({
    data: {
      roomId,
      senderId,
      receiverId,
      content,
    },
  });

  await prisma.directMessageRoom.update({
    where: { id: roomId },
    data: { updatedAt: new Date() },
  });

  return message;
};

export const getMessages = async (
  roomId: string,
  userId: string,
  options: GetMessagesOptions,
) => {
  const room = await prisma.directMessageRoom.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    throw new NotFoundError('Room');
  }

  if (!room.participantIds.includes(userId)) {
    throw new AuthenticationError('Access denied');
  }

  const page = options.page || 1;
  const limit = options.limit || 20;
  const skip = (page - 1) * limit;

  const messages = await prisma.directMessage.findMany({
    where: { roomId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
  });

  return messages.reverse();
};

export const getUserRooms = async (workspaceId: string, userId: string) => {
  return prisma.directMessageRoom.findMany({
    where: {
      workspaceId,
      participantIds: { has: userId },
    },
    orderBy: { updatedAt: 'desc' },
  });
};

export const deleteMessage = async (messageId: string, userId: string) => {
  const message = await prisma.directMessage.findUnique({
    where: { id: messageId },
  });

  if (!message) {
    throw new NotFoundError('Message');
  }

  if (message.senderId !== userId) {
    throw new AuthenticationError('Only sender can delete');
  }

  await prisma.directMessage.update({
    where: { id: messageId },
    data: { deletedAt: new Date() },
  });

  return { message: 'Deleted' };
};

export const updateMessage = async (messageId: string, userId: string, content: string) => {
  const message = await prisma.directMessage.findUnique({
    where: { id: messageId },
  });

  if (!message) {
    throw new NotFoundError('Message');
  }

  if (message.senderId !== userId) {
    throw new AuthenticationError('Only sender can edit');
  }

  return prisma.directMessage.update({
    where: { id: messageId },
    data: {
      content,
      editedAt: new Date(),
    },
  });
};

export const addReaction = async (messageId: string, userId: string, emoji: string) => {
  const message = await prisma.directMessage.findUnique({
    where: { id: messageId },
  });

  if (!message) {
    throw new NotFoundError('Message');
  }

  return prisma.directMessageReaction.upsert({
    where: {
      messageId_userId_emoji: { messageId, userId, emoji },
    },
    update: {},
    create: {
      messageId,
      userId,
      emoji,
    },
  });
};

export const removeReaction = async (messageId: string, userId: string, emoji: string) => {
  try {
    await prisma.directMessageReaction.delete({
      where: {
        messageId_userId_emoji: { messageId, userId, emoji },
      },
    });
    return { message: 'Reaction removed' };
  } catch (_error) {
    throw new NotFoundError('Reaction not found');
  }
};

