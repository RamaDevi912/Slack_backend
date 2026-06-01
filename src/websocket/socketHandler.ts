import { Server, Socket } from 'socket.io';
import { verifyToken } from '../utils/auth.js';
import prisma from '../config/database.js';
import { UserStatus } from '@prisma/client';
// Extend socket type
interface AuthenticatedSocket extends Socket {
  userId?: string
  user?: any
}

// Store active connections
export const activeUsers = new Map<string, string>();
export const activeChannels = new Map<string, Set<string>>();

export const setupWebSocket = (server: any): Server => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || '*',
      methods: ['GET', 'POST'],
    },
  });

  // 🔐 Auth middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = verifyToken(token);

      if (!decoded) {
        return next(new Error('Invalid token'));
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user.id;
      socket.user = user;

      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  // 🔌 Connection
  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.userId as string;

    console.log(`User ${userId} connected: ${socket.id}`);

    // Track active user
    activeUsers.set(userId, socket.id);

    updateUserStatus(userId, 'ONLINE');

    // Join workspace
    socket.on('join-workspace', (workspaceId: string) => {
      socket.join(`workspace:${workspaceId}`);
    });

    // Join channel
    socket.on('join-channel', (channelId: string) => {
      socket.join(`channel:${channelId}`);

      if (!activeChannels.has(channelId)) {
        activeChannels.set(channelId, new Set());
      }

      activeChannels.get(channelId)!.add(userId);

      io.to(`channel:${channelId}`).emit('user-joined-channel', {
        userId,
        channelId,
        userCount: activeChannels.get(channelId)!.size,
      });
    });

    // Leave channel
    socket.on('leave-channel', (channelId: string) => {
      socket.leave(`channel:${channelId}`);

      if (activeChannels.has(channelId)) {
        activeChannels.get(channelId)!.delete(userId);

        if (activeChannels.get(channelId)!.size === 0) {
          activeChannels.delete(channelId);
        }
      }

      io.to(`channel:${channelId}`).emit('user-left-channel', {
        userId,
        channelId,
        userCount: activeChannels.get(channelId)?.size || 0,
      });
    });

    // Message
    socket.on('new-message', (data: any) => {
      const { channelId, message } = data;

      io.to(`channel:${channelId}`).emit('message-received', {
        ...message,
        timestamp: new Date(),
      });
    });

    // Typing
    socket.on('user-typing', (data: any) => {
      const { channelId, username } = data;

      io.to(`channel:${channelId}`).emit('typing-indicator', {
        userId,
        username,
        isTyping: true,
      });
    });

    socket.on('user-stop-typing', (data: any) => {
      const { channelId } = data;

      io.to(`channel:${channelId}`).emit('typing-indicator', {
        userId,
        isTyping: false,
      });
    });

    // DM
    socket.on('direct-message', (data: any) => {
      const { receiverId, message } = data;

      if (activeUsers.has(receiverId)) {
        io.to(activeUsers.get(receiverId)!).emit('dm-received', {
          senderId: userId,
          ...message,
          timestamp: new Date(),
        });
      }
    });

    // Call events
    socket.on('call-initiated', (data: any) => {
      const { callId, recipientId, type } = data;

      if (activeUsers.has(recipientId)) {
        io.to(activeUsers.get(recipientId)!).emit('incoming-call', {
          callId,
          callerId: userId,
          type,
        });
      }
    });

    socket.on('call-accepted', ({ callId }: any) => {
      io.emit('call-status', { callId, status: 'ACTIVE' });
    });

    socket.on('call-declined', ({ callId }: any) => {
      io.emit('call-status', { callId, status: 'DECLINED' });
    });

    socket.on('call-ended', ({ callId }: any) => {
      io.emit('call-status', { callId, status: 'ENDED' });
    });

    // Presence
    // Presence
    socket.on('update-presence', (status: string) => {
      if (Object.values(UserStatus).includes(status as UserStatus)) {
        const validStatus = status as UserStatus;

        updateUserStatus(userId, validStatus);

        io.emit('user-status-changed', {
          userId,
          status: validStatus,
        });
      } else {
        console.warn(`Invalid status received: ${status}`);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);

      activeUsers.delete(userId);
      updateUserStatus(userId, 'OFFLINE');

      for (const [channelId, users] of activeChannels.entries()) {
        if (users.has(userId)) {
          users.delete(userId);

          io.to(`channel:${channelId}`).emit('user-left-channel', {
            userId,
            channelId,
            userCount: users.size,
          });
        }
      }
    });
  });

  return io;
};

// 🔧 Helper
const updateUserStatus = async (userId: string, status: UserStatus) => {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { status },
    });
  } catch (error) {
    console.error('Failed to update user status:', error);
  }
};
