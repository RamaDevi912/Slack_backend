import prisma from '../config/database.js';
import { verifyToken } from '../utils/auth.js';
// 🔐 Authenticate user
export const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }
        const decoded = verifyToken(token);
        if (!decoded) {
            res.status(401).json({ message: 'Invalid or expired token' });
            return;
        }
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });
        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(500).json({ message: 'Authentication error', error: error.message });
    }
};
// 🏢 Workspace access
export const hasWorkspaceAccess = async (req, res, next) => {
    try {
        const { workspaceId } = req.params;
        const userId = req.user?.id;
        const member = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: { workspaceId, userId },
            },
        });
        if (!member) {
            res.status(403).json({ message: 'Access denied to this workspace' });
            return;
        }
        req.workspaceMember = member;
        next();
    }
    catch (error) {
        res.status(500).json({ message: 'Authorization error', error: error.message });
    }
};
// 👑 Workspace admin check
export const isWorkspaceAdmin = (req, res, next) => {
    try {
        if (!req.workspaceMember) {
            res.status(403).json({ message: 'Access denied' });
            return;
        }
        if (!['OWNER', 'ADMIN'].includes(req.workspaceMember.role)) {
            res.status(403).json({ message: 'Admin access required' });
            return;
        }
        next();
    }
    catch (error) {
        res.status(500).json({ message: 'Authorization error', error: error.message });
    }
};
// 📢 Channel access
export const hasChannelAccess = async (req, res, next) => {
    try {
        const { channelId } = req.params;
        const userId = req.user?.id;
        const channel = await prisma.channel.findUnique({
            where: { id: channelId },
            include: { members: true },
        });
        if (!channel) {
            res.status(404).json({ message: 'Channel not found' });
            return;
        }
        if (!channel.isPrivate) {
            const workspaceMember = await prisma.workspaceMember.findUnique({
                where: {
                    workspaceId_userId: {
                        workspaceId: channel.workspaceId,
                        userId,
                    },
                },
            });
            if (!workspaceMember) {
                res.status(403).json({ message: 'Access denied to this channel' });
                return;
            }
        }
        else {
            const member = channel.members.find((m) => m.userId === userId);
            if (!member) {
                res.status(403).json({ message: 'Access denied to this channel' });
                return;
            }
        }
        req.channel = channel;
        next();
    }
    catch (error) {
        res.status(500).json({ message: 'Authorization error', error: error.message });
    }
};
// 🧑‍💼 Platform admin
export const isPlatformAdmin = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const admin = await prisma.platformAdmin.findUnique({
            where: { userId },
        });
        if (!admin) {
            res.status(403).json({ message: 'Platform admin access required' });
            return;
        }
        req.platformAdmin = admin;
        next();
    }
    catch (error) {
        res.status(500).json({ message: 'Authorization error', error: error.message });
    }
};
//# sourceMappingURL=auth.middleware.js.map