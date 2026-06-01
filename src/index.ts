import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import dotenv from 'dotenv';
// Load environment variables FIRST before any database or route imports!
dotenv.config();

import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';
import prisma from './config/database.js';
import { setupWebSocket } from './websocket/socketHandler.js';

// Import Middlewares
import {
  apiLimiter,
  authLimiter,
  messageLimiter,
  searchLimiter,
  uploadLimiter,
} from './middleware/rate-limiter.middleware.js';
import { notFoundMiddleware } from './middleware/notFound.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import morganMiddleware from './middleware/morgan.middleware.js';

// Import Routes
import authRoutes from './routes/auth.routes.js';
import workspaceRoutes from './routes/workspace.routes.js';
import channelRoutes from './routes/channel.routes.js';
import messageRoutes from './routes/message.routes.js';
import directMessageRoutes from './routes/directMessage.routes.js';
import callRoutes from './routes/call.routes.js';
import searchRoutes from './routes/search.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import adminRoutes from './routes/admin.routes.js';
import fileRoutes from './routes/file.routes.js';

const app = express();
const PORT: number = Number(process.env.PORT) || 3001;

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.io WebSocket connections
const io = setupWebSocket(server);
app.set('io', io);

// Global Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morganMiddleware);

// Base API rate limiting
app.use('/api/', apiLimiter);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoints
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    statusCode: 200,
    message: 'Service is healthy',
    timestamp: new Date().toISOString(),
  });
});
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    statusCode: 200,
    message: 'Service is healthy',
    timestamp: new Date().toISOString(),
  });
});

// Secure API Routes Mounting
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/workspaces/:workspaceId/channels', channelRoutes);
app.use(
  '/api/workspaces/:workspaceId/channels/:channelId/messages',
  messageLimiter,
  messageRoutes,
);
app.use(
  '/api/workspaces/:workspaceId/direct-messages',
  messageLimiter,
  directMessageRoutes,
);
app.use('/api/calls', callRoutes);
app.use('/api/search/:workspaceId', searchLimiter, searchRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/files', uploadLimiter, fileRoutes);

// Intercept unhandled routes
app.use(notFoundMiddleware);

// Global operational errors logger and response formatter
app.use(errorHandler);

// Start server listening
server.listen(PORT, async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✓ Database connected');
  } catch (error: any) {
    console.error('✗ Database connection failed:', error.message);
    process.exit(1);
  }

  console.log(`
╔════════════════════════════════════════╗
║   Slack Backend API Server Running     ║
╠════════════════════════════════════════╣
║ Port:      ${PORT}                     ║
║ Env:       ${process.env.NODE_ENV || 'development'}               ║
║ WebSocket: Ready                       ║
╚════════════════════════════════════════╝
  `);
});

// Graceful application shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

export default server;
