import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './config/database.js';
// Load env
dotenv.config();
const app = express();
const PORT = Number(process.env.PORT) || 3001;
// Global Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Health check
app.get('/health', (_req, res) => {
    res.json({
        success: true,
        statusCode: 200,
        message: 'Service is healthy',
        timestamp: new Date().toISOString(),
    });
});
// Start server
app.listen(PORT, async () => {
    try {
        await prisma.$queryRaw `SELECT 1`;
        console.log('✓ Database connected');
    }
    catch (error) {
        console.error('✗ Database connection failed:', error.message);
        process.exit(1);
    }
});
// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});
export default app;
//# sourceMappingURL=index.js.map