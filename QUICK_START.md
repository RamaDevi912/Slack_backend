# Quick Start Guide

## 🚀 5-Minute Setup

### Prerequisites

- Node.js 16+ installed
- PostgreSQL 12+ running locally
- npm or yarn package manager

### Installation

1. **Navigate to project directory**

```bash
cd slack_backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment**

```bash
# Copy example file
cp .env.example .env

# Edit .env with your PostgreSQL credentials
# DATABASE_URL="postgresql://postgres:password@localhost:5432/slack_db"
```

4. **Setup database**

```bash
# Create database schema
npm run prisma:push

# Generate Prisma client
npm run prisma:generate

# Seed with demo data
npm run prisma:seed
```

5. **Start development server**

```bash
npm run dev
```

✅ Server running at `http://localhost:3001`

---

## 📊 Demo Credentials

After seeding, use these to test:

### Platform Admin

```
Email: admin@slack.com
Password: Admin@123
```

### Regular Users

```
Email: john@slack.com
Password: User@123

Email: jane@slack.com
Password: User@123

Email: bob@slack.com
Password: User@123
```

---

## 📝 npm Scripts

```bash
# Development
npm run dev           # Start with auto-reload (nodemon)

# Database
npm run prisma:push              # Sync schema with database
npm run prisma:migrate           # Create migration
npm run prisma:generate          # Generate Prisma client
npm run prisma:seed             # Load demo data
npm run prisma:studio           # Open Prisma Studio GUI

# Production
npm start            # Start server

# Utility
npm run prisma:generate         # Regenerate client
```

---

## 🧪 Test API Endpoints

### Using Curl

**Login**

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@slack.com",
    "password": "Admin@123"
  }'
```

**Get User Profile**

```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer eyJhbGc..."
```

**List Workspaces**

```bash
curl -X GET http://localhost:3001/api/workspaces \
  -H "Authorization: Bearer eyJhbGc..."
```

**Send Message**

```bash
curl -X POST http://localhost:3001/api/workspaces/{workspaceId}/channels/{channelId}/messages \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello team!"}'
```

### Using Postman

1. Import API collection (if available)
2. Set `token` variable from login response
3. Update `workspaceId` and `channelId` for specific endpoints
4. Send requests

---

## 📚 Key Files

| File                     | Purpose                         |
| ------------------------ | ------------------------------- |
| `src/index.js`           | Main server entry point         |
| `src/config/database.js` | Prisma client configuration     |
| `src/middleware/auth.js` | Authentication & authorization  |
| `src/controllers/`       | Business logic for each feature |
| `src/routes/`            | API endpoint definitions        |
| `prisma/schema.prisma`   | Database schema                 |
| `prisma/seed.js`         | Demo data seeding               |
| `.env`                   | Environment variables           |

---

## 🔧 Environment Variables

Key variables in `.env`:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Server
PORT=3001
NODE_ENV=development

# Authentication
JWT_SECRET=your_secret_key_here

# CORS
FRONTEND_URL=http://localhost:3000

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=52428800  # 50MB

# WebSocket
SOCKET_IO_PORT=3002
```

---

## 🐛 Troubleshooting

### Issue: Database connection error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**

- Start PostgreSQL: `pg_ctl -D /usr/local/var/postgres start`
- Or with Homebrew: `brew services start postgresql`
- Or with Docker: `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres`

### Issue: Port already in use

```
Error: listen EADDRINUSE :::3001
```

**Solution:**

```bash
# Change port in .env
PORT=3002

# Or kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Issue: Prisma client not found

```
Error: Cannot find module '@prisma/client'
```

**Solution:**

```bash
npm install @prisma/client
npm run prisma:generate
```

### Issue: JWT token expired

**Solution:**

- Tokens expire after 7 days
- Login again to get new token
- Or extend JWT_EXPIRY in `src/utils/auth.js`

---

## 📦 Docker Setup

### Using Docker Compose

```bash
# Start all services (PostgreSQL + Backend)
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Remove volumes (careful!)
docker-compose down -v
```

### Manual Docker

```bash
# Build image
docker build -t slack-backend .

# Run with PostgreSQL
docker run -d \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="secret" \
  -p 3001:3001 \
  slack-backend
```

---

## 🔐 Security Checklist

- [ ] Change `JWT_SECRET` in production
- [ ] Use strong database password
- [ ] Enable HTTPS in production
- [ ] Set `NODE_ENV=production`
- [ ] Use environment variables (not hardcoded values)
- [ ] Enable rate limiting
- [ ] Set proper CORS origins
- [ ] Enable database encryption
- [ ] Setup SSL certificates
- [ ] Configure firewall rules

---

## 📈 Scaling Considerations

### Single Server

- Current setup supports ~100-500 concurrent users
- Limited by single Node.js process

### Multiple Servers (Recommended)

```
┌─────────────┐     ┌─────────────┐
│  Backend 1  │     │  Backend 2  │
└──────┬──────┘     └──────┬──────┘
       └────────┬──────────┘
              Load Balancer
                   │
            PostgreSQL Database
                   │
            Redis (Socket.io adapter)
```

**Setup:**

```bash
# Install Redis adapter
npm install @socket.io/redis-adapter redis

# Use Redis in socketHandler.js
```

### Database Optimization

- Add indexes for common queries ✅ (Already done)
- Enable query caching with Redis
- Archive old messages
- Partition large tables

---

## 📞 Support & Help

### Common Questions

**Q: Can I use this in production?**
A: Yes, after:

- Securing all credentials
- Setting up proper database backups
- Enabling HTTPS
- Implementing rate limiting
- Adding monitoring/logging

**Q: How do I add a new feature?**
A:

1. Update Prisma schema
2. Run migration: `npm run prisma:migrate`
3. Create controller in `src/controllers/`
4. Add routes in `src/routes/`
5. Test API endpoints

**Q: How do I deploy to the cloud?**
A: See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide

**Q: How do I backup the database?**
A:

```bash
# PostgreSQL backup
pg_dump slack_db > backup.sql

# Restore
psql slack_db < backup.sql
```

---

## 📖 Additional Resources

- [API Reference](./API_REFERENCE.md) - Detailed endpoint documentation
- [Project Docs](./PROJECT_DOCS.md) - Architecture and design
- [Prisma Docs](https://www.prisma.io/docs/) - Database ORM
- [Express.js Docs](https://expressjs.com/) - Web framework
- [Socket.io Docs](https://socket.io/docs/) - Real-time library

---

## ✅ Next Steps

1. ✅ Setup complete
2. 🔌 Connect frontend application
3. 🧪 Run integration tests
4. 🚀 Deploy to staging
5. 📊 Monitor and optimize
6. 🎉 Deploy to production

---

Happy coding! 🚀
