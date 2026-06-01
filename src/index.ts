import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import prisma from './config/database'
import { setupWebSocket } from './websocket/socketHandler'

// Load env
dotenv.config()

// Routes
import authRoutes from './routes/auth.routes'
import workspaceRoutes from './routes/workspace.routes'
import channelRoutes from './routes/channel.routes'
import messageRoutes from './routes/message.routes'
import directMessageRoutes from './routes/directMessage.routes'
import callRoutes from './routes/call.routes'
import searchRoutes from './routes/search.routes'
import notificationRoutes from './routes/notification.routes'
import adminRoutes from './routes/admin.routes'
import fileRoutes from './routes/file.routes'

const app = express()
const PORT: number = Number(process.env.PORT) || 3001

// Create HTTP server
const server = http.createServer(app)

// Setup WebSocket
const io = setupWebSocket(server)
app.set('io', io)

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Static files
app.use('/uploads', express.static('uploads'))

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/workspaces', workspaceRoutes)
app.use('/api/workspaces/:workspaceId/channels', channelRoutes)
app.use('/api/workspaces/:workspaceId/channels/:channelId/messages', messageRoutes)
app.use('/api/workspaces/:workspaceId/direct-messages', directMessageRoutes)
app.use('/api/calls', callRoutes)
app.use('/api/search/:workspaceId', searchRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/files', fileRoutes)

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  })
})

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' })
})

// Start server
server.listen(PORT, async () => {
  try {
    await prisma.$queryRaw`SELECT 1`
    console.log('✓ Database connected')
  } catch (error: any) {
    console.error('✗ Database connection failed:', error.message)
    process.exit(1)
  }

  console.log(`
╔════════════════════════════════════════╗
║   Slack Backend API Server Running     ║
╠════════════════════════════════════════╣
║ Port:     ${PORT}                      
║ Env:      ${process.env.NODE_ENV}           
║ WebSocket: Ready                       
╚════════════════════════════════════════╝
  `)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})

export default server