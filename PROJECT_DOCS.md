# Slack Backend - Project Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [Feature Summary](#feature-summary)
5. [User Roles & Permissions](#user-roles--permissions)
6. [API Workflow](#api-workflow)
7. [Real-Time Features](#real-time-features)
8. [Deployment](#deployment)
9. [Testing](#testing)
10. [Known Limitations](#known-limitations)

---

## Project Overview

This is a **real-time team communication platform backend** similar to Slack, built with Node.js, Express, PostgreSQL, and Prisma. The platform supports:

- **Workspace-based communication** - Team boundaries with separate channels and members
- **Real-time messaging** - Instant message delivery with reactions and threading
- **Direct messaging** - One-on-one conversations with full history
- **Audio/Video calling** - Integrated calling capability with participant management
- **Admin controls** - Platform and workspace-level administration
- **Presence & notifications** - Real-time user status and notification system
- **Search & discoverability** - Full message and user search capabilities

### Key Metrics

- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: Socket.io for WebSocket connections
- **Authentication**: JWT-based with bcrypt password hashing
- **File Support**: Multer for file uploads
- **Scalability**: Stateless API design

---

## Architecture

### High-Level Components

```
┌─────────────────────────────────────────┐
│         Frontend Client                 │
│    (React/Vue/Flutter/Mobile)           │
└────────────┬────────────────────────────┘
             │
      ┌──────┴──────┐
      │             │
   HTTP/REST   WebSocket
   (RESTful)   (Real-time)
      │             │
      └──────┬──────┘
             │
┌────────────▼────────────────────────────┐
│     Express.js Backend Server            │
│  (Port 3001 - REST API)                  │
│  (Port 3002 - WebSocket)                 │
├─────────────────────────────────────────┤
│ • Authentication (JWT)                  │
│ • Workspace Management                  │
│ • Channel Management                    │
│ • Message Handling                      │
│ • Direct Messaging                      │
│ • Call Management                       │
│ • Admin Dashboard                       │
│ • Search & Notifications                │
└────────────┬────────────────────────────┘
             │
         PostgreSQL
        (Database)
```

### Directory Structure

```
slack_backend/
├── src/
│   ├── config/
│   │   └── database.js              # Prisma client setup
│   ├── controllers/                 # Business logic
│   │   ├── authController.js
│   │   ├── workspaceController.js
│   │   ├── channelController.js
│   │   ├── messageController.js
│   │   ├── directMessageController.js
│   │   ├── callController.js
│   │   ├── searchController.js
│   │   ├── notificationController.js
│   │   ├── adminController.js
│   │   └── fileController.js
│   ├── middleware/
│   │   └── auth.js                  # JWT & RBAC middleware
│   ├── routes/                      # API endpoints
│   │   ├── authRoutes.js
│   │   ├── workspaceRoutes.js
│   │   ├── channelRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── directMessageRoutes.js
│   │   ├── callRoutes.js
│   │   ├── searchRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── adminRoutes.js
│   │   └── fileRoutes.js
│   ├── utils/
│   │   └── auth.js                  # Auth utilities
│   ├── websocket/
│   │   └── socketHandler.js         # WebSocket events
│   └── index.js                     # Main server file
├── prisma/
│   ├── schema.prisma                # Database schema
│   └── seed.js                      # Demo data seed
├── uploads/                         # User uploaded files
├── .env                             # Environment variables
├── .env.example                     # Example environment
├── .gitignore
├── package.json
├── docker-compose.yml               # Docker setup
├── Dockerfile
├── README.md
├── API_REFERENCE.md
└── PROJECT_DOCS.md
```

---

## Database Schema

### Core Tables

#### Users

- Stores user accounts and profiles
- Includes authentication credentials (password hash)
- Tracks online status and custom status
- Relations: WorkspaceMembers, ChannelMembers, Messages, etc.

#### Workspaces

- Team organization units
- Owner and admin management
- Metadata: name, slug, logo, description
- Relations: Members, Channels, DirectMessageRooms, Calls

#### Channels

- Communication spaces within workspaces
- Public (auto-joined) or Private (invite-only)
- Topic and description for context
- Message history and pinned messages

#### Messages

- Channel messages with timestamps
- Support for attachments and reactions
- Edit/delete tracking with soft deletes
- Reply threading support

#### DirectMessageRooms & DirectMessages

- One-on-one conversation management
- Participant tracking
- Read receipts and delivery status
- Message history preservation

#### Calls

- Call lifecycle management (INITIATED → ACTIVE → ENDED)
- Participant tracking with roles
- Call history and duration recording
- Support for AUDIO, VIDEO, SCREEN_SHARE types

#### Notifications

- User notification tracking
- Read/unread status
- Settings for notification preferences
- Muted channels/workspaces support

#### Admin Models

- PlatformAdmin: User admin privileges
- AuditLog: Platform activity tracking
- SearchLog: User search analytics

---

## Feature Summary

### ✅ Implemented Features

#### 1. Authentication & User Management

- User registration with email verification concept
- Login with JWT token generation
- Password hashing with bcrypt (10 salt rounds)
- Session management via Bearer tokens
- Profile management (name, bio, picture, status)

#### 2. Workspace Management

- Create personal workspaces
- Invite users to workspaces
- Role-based access (Owner, Admin, Member, Guest)
- Workspace settings and metadata
- Member listing and management
- Automatic default channel (#general) creation

#### 3. Channel System

- Public channels (auto-joined by workspace members)
- Private channels (invite-only)
- Channel topics and descriptions
- Member management per channel
- Archive channel capability
- Pin important messages

#### 4. Real-Time Messaging

- Send/receive messages instantly
- Message reactions (emoji support)
- Thread replies for organized discussions
- Edit and delete messages
- File attachments in messages
- Message history with pagination
- Unread message tracking

#### 5. Direct Messaging

- One-on-one conversations
- Conversation persistence across sessions
- Read receipts and delivery status
- Message editing and deletion
- Reaction support in DMs
- Unread notification tracking

#### 6. Calling System

- Audio/Video call initiation
- Channel calls (group) and one-on-one calls
- Call participant management
- Call status tracking
- Call history recording
- Call duration calculation
- Participant join/leave events

#### 7. Real-Time Features (WebSocket)

- Join/leave channel notifications
- Typing indicators
- User presence status updates
- Message receive notifications
- Direct message notifications
- Call initiation notifications
- Active users tracking

#### 8. Search & Discoverability

- Full-text message search
- User search by name/email
- Channel search
- Direct message search
- Search history logging
- Advanced filtering options

#### 9. Notifications

- Message notifications
- Direct message notifications
- Call notifications
- Mention notifications (framework ready)
- Notification settings (email, push, desktop, sound)
- Muted channels and workspaces
- Do Not Disturb mode

#### 10. Admin Dashboard

- Platform statistics (users, workspaces, channels, messages)
- User management (list, promote to admin)
- Workspace analytics
- Activity analytics over time
- Audit logs for compliance
- Admin action tracking

#### 11. File Management

- File upload with size limits (50MB default)
- Supported file types (images, documents, media)
- File storage on disk
- Secure download with permission checks
- File deletion and cleanup

#### 12. Permission & Security

- Role-based access control (RBAC)
- Private channel enforcement
- Direct message privacy
- Admin-only endpoints
- Audit logging
- JWT token expiration (7 days)

---

## User Roles & Permissions

### Role Hierarchy

```
┌─────────────────────────────────────┐
│      Platform Admin (Super)         │
│  - Full platform oversight          │
│  - User & workspace management      │
│  - View all analytics               │
│  - Promote/demote admins            │
└─────────────────────────────────────┘
              ▲
              │
┌─────────────┴─────────────┐
│                           │
┌──────────────────┐   ┌────────────────┐
│ Workspace Owner  │   │ Workspace Admin│
│ - Manage members │   │ - Manage channels
│ - Create channels│   │ - Moderate
│ - Settings       │   │ - Analytics
└──────────────────┘   └────────────────┘
              ▲               ▲
              │               │
        ┌─────┴───────────────┘
        │
┌───────▼──────────────────────────────┐
│      Workspace Member                │
│  - Send/receive messages             │
│  - Start calls                        │
│  - Join public channels              │
│  - Direct messaging                  │
└──────────────────────────────────────┘
              ▲
              │
┌─────────────▼──────────────────────────┐
│      Workspace Guest (Optional)        │
│  - Limited read access                 │
│  - Cannot send messages                │
│  - View-only mode                      │
└────────────────────────────────────────┘
```

### Permission Matrix

| Action           | Guest | Member | Admin | Owner | PlatformAdmin |
| ---------------- | ----- | ------ | ----- | ----- | ------------- |
| Send messages    | ✗     | ✓      | ✓     | ✓     | ✓             |
| Create channels  | ✗     | ✗      | ✓     | ✓     | N/A           |
| Delete messages  | ✗     | Own    | ✓     | ✓     | N/A           |
| Manage members   | ✗     | ✗      | ✓     | ✓     | N/A           |
| Delete workspace | ✗     | ✗      | ✗     | ✓     | ✓             |
| View analytics   | ✗     | ✗      | ✓     | ✓     | ✓             |
| Manage users     | ✗     | ✗      | ✗     | ✗     | ✓             |

---

## API Workflow

### 1. Complete Chat Flow

```
1. User Registration/Login
   POST /api/auth/register
   POST /api/auth/login → Get JWT Token

2. View Workspaces
   GET /api/workspaces → List all user workspaces

3. Select Workspace
   GET /api/workspaces/{id} → Workspace details

4. List Channels
   GET /api/workspaces/{id}/channels → Available channels

5. Join/Select Channel
   POST /api/workspaces/{id}/channels/{id}/join
   GET /api/workspaces/{id}/channels/{id}

6. Get Message History
   GET /api/workspaces/{id}/channels/{id}/messages

7. Send Message
   POST /api/workspaces/{id}/channels/{id}/messages
   Body: { "content": "Hello!" }

8. Real-time Updates
   WebSocket: Message received via socket.io
```

### 2. Direct Messaging Flow

```
1. List DM Conversations
   GET /api/workspaces/{id}/direct-messages/rooms

2. Start/Get DM Room
   POST /api/workspaces/{id}/direct-messages/rooms
   Body: { "userId": "recipient_id" }

3. Get DM History
   GET /api/workspaces/{id}/direct-messages/{roomId}

4. Send DM
   POST /api/workspaces/{id}/direct-messages/{roomId}
   Body: { "receiverId": "...", "content": "..." }

5. Real-time Delivery
   WebSocket: DM received notification
```

### 3. Calling Flow

```
1. Initiate Call
   POST /api/calls
   Body: { "type": "VIDEO", "channelId": "..." }
   → Returns call ID and participants

2. Listen for Call
   WebSocket: 'incoming-call' event

3. Accept Call
   POST /api/calls/{id}/accept

4. In Call
   WebSocket: Call status updates

5. Leave Call
   POST /api/calls/{id}/leave
   → Call ends when last participant leaves
```

### 4. Admin Dashboard Flow

```
1. Check Platform Stats
   GET /api/admin/stats

2. View All Users
   GET /api/admin/users?limit=50

3. View Workspaces
   GET /api/admin/workspaces

4. Get Analytics
   GET /api/admin/analytics?days=30

5. Promote User
   POST /api/admin/users/{id}/promote

6. View Audit Logs
   GET /api/admin/workspaces/{id}/audit-logs
```

---

## Real-Time Features

### WebSocket Connection

```javascript
// Client connects
const socket = io("http://localhost:3002", {
  auth: { token: "jwt_token" },
});

// Join workspace
socket.emit("join-workspace", workspaceId);

// Join channel
socket.emit("join-channel", channelId);

// Listen for messages
socket.on("message-received", (message) => {
  console.log("New message:", message);
});
```

### Key Events

#### Channel Events

- `user-joined-channel` - User enters channel
- `user-left-channel` - User leaves channel
- `message-received` - New message arrives
- `typing-indicator` - User typing notification
- `user-status-changed` - User status update

#### Direct Messages

- `dm-received` - Direct message arrival
- `dm-status-changed` - Read status update

#### Calling

- `incoming-call` - Inbound call notification
- `call-status` - Call status changes (ACTIVE, ENDED, etc.)
- `participant-joined` - Participant joins call
- `participant-left` - Participant leaves call

---

## Deployment

### Local Development

```bash
# Install dependencies
npm install

# Setup database
npm run prisma:push
npm run prisma:seed

# Start server
npm run dev
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Logs
docker-compose logs -f backend

# Stop
docker-compose down
```

### Production Deployment

1. **Environment Setup**

   ```bash
   NODE_ENV=production
   JWT_SECRET=<generate_secure_random_key>
   DATABASE_URL=<production_postgres_url>
   FRONTEND_URL=<frontend_domain>
   ```

2. **Database Migration**

   ```bash
   npm run prisma:migrate
   ```

3. **Start Server**
   ```bash
   npm start
   ```

### Cloud Platforms

#### Heroku

```bash
heroku create slack-backend
heroku addons:create heroku-postgresql:standard-0
heroku config:set NODE_ENV=production
git push heroku main
```

#### Railway.app

- Connect GitHub repo
- Set environment variables
- Auto-deploy on push

#### DigitalOcean/AWS/Azure

- Use Docker image
- PostgreSQL managed database
- CDN for file uploads

---

## Testing

### Manual Testing

Use Postman or curl:

```bash
# Test registration
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "TestPass123"
  }'

# Test message creation
curl -X POST http://localhost:3001/api/workspaces/<id>/channels/<id>/messages \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello!"
  }'
```

### Unit Tests (Recommended Setup)

```javascript
// tests/auth.test.js
const request = require("supertest");
const app = require("../src/index");

describe("Authentication", () => {
  it("should register a user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      username: "testuser",
      password: "TestPass123",
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
  });
});
```

---

## Known Limitations & Trade-offs

### Current Limitations

1. **File Storage**
   - Files stored locally on disk
   - Not suitable for distributed systems
   - Recommendation: Integrate S3 for production

2. **Call Management**
   - Call signaling implemented (no media streaming)
   - Requires WebRTC implementation for actual media
   - Recommendation: Use Twilio, Daily, or Jitsi for media

3. **Scalability**
   - WebSocket connections tied to single server
   - Recommendation: Use Redis adapter for Socket.io clustering

4. **Message Indexing**
   - Basic LIKE search on messages
   - Recommendation: Use Elasticsearch for large deployments

5. **Real-time Presence**
   - Presence updates broadcast to all connections
   - Recommendation: Optimize with selective subscriptions

### Design Trade-offs Made

1. **JWT over Sessions**
   - ✓ Stateless, easier to scale
   - ✗ Tokens can't be revoked immediately

2. **Soft Deletes**
   - ✓ Preserves audit trail
   - ✗ More database space needed

3. **Direct Message Rooms**
   - ✓ Flexible participant management
   - ✗ More complex queries

---

## Performance Considerations

### Optimization Tips

1. **Database Indexing**

   ```prisma
   // Already indexes for common queries
   @@index([userId])
   @@index([channelId])
   @@index([createdAt])
   ```

2. **Pagination**
   - Always use `limit` and `offset`
   - Recommended: 50 items per page

3. **Caching**
   - Consider Redis for frequent queries
   - Cache workspace info
   - Cache channel member lists

4. **Connection Pooling**
   - Prisma handles connection pooling
   - Default: 2 connections, max 10

---

## Security Best Practices

### Implemented

- ✅ Password hashing (bcrypt, 10 rounds)
- ✅ JWT tokens with expiration
- ✅ CORS protection
- ✅ Role-based access control
- ✅ Private message enforcement

### Recommended for Production

- 🔒 Rate limiting
- 🔒 API key rotation
- 🔒 HTTPS enforcement
- 🔒 Database encryption
- 🔒 Audit logging
- 🔒 DDoS protection

---

## Support & Troubleshooting

### Common Issues

**Database Connection**

```
Error: connect ECONNREFUSED 127.0.0.1:5432
→ Ensure PostgreSQL is running
→ Check DATABASE_URL in .env
```

**JWT Token Invalid**

```
Error: Invalid token
→ Token may have expired (7 days)
→ Verify JWT_SECRET matches frontend
```

**WebSocket Connection Failed**

```
Error: Connection to socket.io failed
→ Check CORS settings
→ Verify frontend URL in FRONTEND_URL
→ Check firewall/network settings
```

---

## Next Steps & Enhancements

1. **Short Term**
   - Add email notifications
   - Implement user mentions
   - Add message search filters
   - Create mobile app

2. **Medium Term**
   - Integrate video calling (Twilio/Daily)
   - Add bot integration framework
   - Screen sharing capability
   - Advanced analytics dashboard

3. **Long Term**
   - Enterprise SSO integration
   - Multi-region deployment
   - Advanced compliance features
   - AI-powered moderation

---

## License

MIT License - See LICENSE file for details
