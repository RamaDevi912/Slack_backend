import prisma from '../config/database.js';
import { AuthenticationError, ValidationError, } from '../utils/errors.js';
export class SearchService {
    /**
     * Search Messages
     */
    async searchMessages(workspaceId, userId, query, options) {
        if (!query || query.trim().length < 2) {
            throw new ValidationError('Search query must be at least 2 characters');
        }
        //Check workspace access
        const member = await prisma.workspaceMember.findUnique({
            where: { workspaceId_userId: { workspaceId, userId } },
        });
        if (!member) {
            throw new AuthenticationError('Not a member of this workspace');
        }
        const page = options.page || 1;
        const limit = Math.min(options.limit || 20, 100);
        const skip = (page - 1) * limit;
        const where = {
            channel: { workspaceId },
            content: { contains: query, mode: 'insensitive' }, // ✅ safer than search
            deletedAt: null,
        };
        if (options.channelId) {
            where.channelId = options.channelId;
        }
        if (options.fromDate || options.toDate) {
            where.createdAt = {};
            if (options.fromDate) {
                where.createdAt.gte = options.fromDate;
            }
            if (options.toDate) {
                where.createdAt.lte = options.toDate;
            }
        }
        const [messages, total] = await Promise.all([
            prisma.message.findMany({
                where,
                include: {
                    user: {
                        select: { id: true, username: true, profilePicture: true },
                    },
                    channel: {
                        select: { id: true, name: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.message.count({ where }),
        ]);
        return {
            results: messages,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
            query,
        };
    }
    /**
     * 👤 Search Users
     */
    async searchUsers(workspaceId, userId, query, options) {
        if (!query || query.trim().length < 1) {
            throw new ValidationError('Search query is required');
        }
        const member = await prisma.workspaceMember.findUnique({
            where: { workspaceId_userId: { workspaceId, userId } },
        });
        if (!member) {
            throw new AuthenticationError('Not a member of this workspace');
        }
        const page = options.page || 1;
        const limit = Math.min(options.limit || 20, 100);
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where: {
                    workspaceMembers: {
                        some: { workspaceId },
                    },
                    OR: [
                        { username: { contains: query, mode: 'insensitive' } },
                        { email: { contains: query, mode: 'insensitive' } },
                        { firstName: { contains: query, mode: 'insensitive' } },
                        { lastName: { contains: query, mode: 'insensitive' } },
                    ],
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    profilePicture: true,
                    status: true,
                },
                skip,
                take: limit,
            }),
            prisma.user.count({
                where: {
                    workspaceMembers: {
                        some: { workspaceId },
                    },
                    OR: [
                        { username: { contains: query, mode: 'insensitive' } },
                        { email: { contains: query, mode: 'insensitive' } },
                        { firstName: { contains: query, mode: 'insensitive' } },
                        { lastName: { contains: query, mode: 'insensitive' } },
                    ],
                },
            }),
        ]);
        return {
            results: users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
            query,
        };
    }
    /**
     * 📁 Search Channels
     */
    async searchChannels(workspaceId, userId, query, options) {
        if (!query || query.trim().length < 1) {
            throw new ValidationError('Search query is required');
        }
        const member = await prisma.workspaceMember.findUnique({
            where: { workspaceId_userId: { workspaceId, userId } },
        });
        if (!member) {
            throw new AuthenticationError('Not a member of this workspace');
        }
        const page = options.page || 1;
        const limit = Math.min(options.limit || 20, 100);
        const skip = (page - 1) * limit;
        const [channels, total] = await Promise.all([
            prisma.channel.findMany({
                where: {
                    workspaceId,
                    archivedAt: null,
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                    ],
                },
                include: {
                    _count: { select: { members: true } },
                },
                skip,
                take: limit,
            }),
            prisma.channel.count({
                where: {
                    workspaceId,
                    archivedAt: null,
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                    ],
                },
            }),
        ]);
        return {
            results: channels,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
            query,
        };
    }
    /**
     * 🌍 Global Search
     */
    async globalSearch(workspaceId, userId, query) {
        if (!query || query.trim().length < 2) {
            throw new ValidationError('Search query must be at least 2 characters');
        }
        const member = await prisma.workspaceMember.findUnique({
            where: { workspaceId_userId: { workspaceId, userId } },
        });
        if (!member) {
            throw new AuthenticationError('Not a member of this workspace');
        }
        const limit = 5;
        const [messages, users, channels] = await Promise.all([
            prisma.message.findMany({
                where: {
                    channel: { workspaceId },
                    content: { contains: query, mode: 'insensitive' },
                    deletedAt: null,
                },
                take: limit,
            }),
            prisma.user.findMany({
                where: {
                    workspaceMembers: { some: { workspaceId } },
                    OR: [
                        { username: { contains: query, mode: 'insensitive' } },
                        { email: { contains: query, mode: 'insensitive' } },
                    ],
                },
                take: limit,
            }),
            prisma.channel.findMany({
                where: {
                    workspaceId,
                    name: { contains: query, mode: 'insensitive' },
                },
                take: limit,
            }),
        ]);
        return { messages, users, channels };
    }
    /**
     * 💬 Search My Messages
     */
    async searchMyMessages(userId, query, options) {
        if (!query || query.trim().length < 2) {
            throw new ValidationError('Search query must be at least 2 characters');
        }
        const page = options.page || 1;
        const limit = Math.min(options.limit || 20, 100);
        const skip = (page - 1) * limit;
        const where = {
            userId,
            content: { contains: query, mode: 'insensitive' },
            deletedAt: null,
        };
        if (options.workspaceId) {
            where.channel = { workspaceId: options.workspaceId };
        }
        const [messages, total] = await Promise.all([
            prisma.message.findMany({
                where,
                include: {
                    channel: {
                        select: { id: true, name: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.message.count({ where }),
        ]);
        return {
            results: messages,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
            query,
        };
    }
}
export default new SearchService();
//# sourceMappingURL=search.service.js.map