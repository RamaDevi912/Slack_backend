import prisma from '../config/database.js';
import { AuthenticationError, NotFoundError } from '../utils/errors.js';
export class DirectMessageService {
    /**
     * Create or get room
     */
    async getOrCreateRoom(workspaceId, userId, recipientId) {
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
    }
    /**
     * Send message
     */
    async sendMessage(roomId, senderId, receiverId, content) {
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
    }
    /**
     * Get messages
     */
    async getMessages(roomId, userId, options) {
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
    }
    /**
     * Get user rooms
     */
    async getUserRooms(workspaceId, userId) {
        return prisma.directMessageRoom.findMany({
            where: {
                workspaceId,
                participantIds: { has: userId },
            },
            orderBy: { updatedAt: 'desc' },
        });
    }
    /**
     * Delete message
     */
    async deleteMessage(messageId, userId) {
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
    }
    /**
     * Update message
     */
    async updateMessage(messageId, userId, content) {
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
    }
    /**
     * Add reaction
     */
    async addReaction(messageId, userId, emoji) {
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
    }
    /**
     * Remove reaction
     */
    async removeReaction(messageId, userId, emoji) {
        try {
            await prisma.directMessageReaction.delete({
                where: {
                    messageId_userId_emoji: { messageId, userId, emoji },
                },
            });
            return { message: 'Reaction removed' };
        }
        catch (error) {
            throw new NotFoundError('Reaction not found');
        }
    }
}
export default new DirectMessageService();
//# sourceMappingURL=directMessage.service.js.map