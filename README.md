# Real-Time Team Communication Platform - Backend

A professional-grade Node.js/Express backend for a Slack-like team communication platform with real-time messaging, channels, direct messages, audio/video calling, and admin dashboard.

## ✨ Key Features

### Core Features

- ✅ **User Authentication & Authorization** - JWT-based auth with role-based access control
- ✅ **Workspace Management** - Organize teams into workspaces with different roles
- ✅ **Channels** - Create public/private channels with member management
- ✅ **Real-time Messaging** - Instant message delivery with WebSocket
- ✅ **Direct Messages** - One-on-one conversations with history
- ✅ **Message Features** - Reactions, threads, editing, deletion
- ✅ **Audio/Video Calling** - Integrated call system with lifecycle management
- ✅ **Presence Management** - Show online/offline and custom status
- ✅ **Notifications** - Real-time push notifications
- ✅ **File Sharing** - Upload and share files with validation
- ✅ **Search** - Search messages, users, and channels
- ✅ **Admin Dashboard** - Platform administration and analytics
- ✅ **Audit Logging** - Track all system activities

### Architecture Features

- ✅ **Error Handling** - Custom error classes with proper HTTP status codes
- ✅ **Input Validation** - Comprehensive Joi schemas for all endpoints
- ✅ **Rate Limiting** - Per-endpoint rate limiting to prevent abuse
- ✅ **Security** - CORS, JWT, password hashing, parameterized queries
- ✅ **Services Layer** - Business logic separation from controllers
- ✅ **Type Safety** - Full TypeScript with Prisma type generation
- ✅ **Structured Logging** - Winston logger for debugging and monitoring
- ✅ **Database ORM** - Prisma with migrations and seeding

## 📋 Tech Stack

| Technology             | Purpose                    |
| ---------------------- | -------------------------- |
| **Node.js**            | JavaScript runtime         |
| **Express.js**         | HTTP server framework      |
| **TypeScript**         | Type-safe development      |
| **PostgreSQL**         | Relational database        |
| **Prisma**             | ORM with migrations        |
| **Socket.io**          | Real-time communication    |
| **JWT**                | Token-based authentication |
| **Joi**                | Data validation            |
| **bcryptjs**           | Password hashing           |
| **express-rate-limit** | Rate limiting              |
| **Winston**            | Structured logging         |

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- PostgreSQL 12+
- npm 7+

### Installation (5 minutes)

```bash
# 1. Clone and navigate
cd slack_backend

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# 4. Setup database
npm run prisma:migrate
npm run prisma:seed

# 5. Start server
npm run dev
```

Server runs at `http://localhost:3001`

**Verify with:**

```bash
curl http://localhost:3001/health
```

## 📁 Project Structure

```
src/
├── config/               # Configuration files
├── controllers/          # Request handlers
├── middleware/           # Express middleware
│   ├── authMiddleware.ts      # Authentication/authorization
│   ├── errorHandler.ts        # Global error handling
│   ├── rateLimiter.ts         # Rate limiting policies
│   └── validationMiddleware.ts # Input validation
├── routes/               # API endpoints
├── services/             # Business logic layer
│   ├── authService.ts
│   └── workspaceService.ts
├── types/                # TypeScript definitions
├── utils/                # Helper functions
│   ├── auth.ts           # JWT utilities
│   ├── errors.ts         # Custom error classes
│   ├── validation.ts     # Joi validation schemas
│   ├── response.ts       # API response formatting
│   ├── constants.ts      # App constants
│   └── logger.ts         # Logging utility
├── websocket/            # Real-time handlers
└── index.ts              # Entry point
```

## 🔐 Security Features

1. **Authentication**: JWT tokens with expiration
2. **Authorization**: Role-based access control (RBAC)
3. **Validation**: Joi schemas for all inputs
4. **Rate Limiting**: Prevents abuse and DDoS
5. **Password Security**: bcryptjs hashing
6. **CORS**: Frontend origin validation
7. **Error Messages**: No sensitive data exposed
8. **Database**: Parameterized queries via Prisma

## 📊 API Response Format

All endpoints return standardized responses:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-06-01T10:00:00.000Z"
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": { "email": "Invalid email format" }
  },
  "timestamp": "2026-06-01T10:00:00.000Z"
}
```

## 🔄 Middleware Stack

1. CORS configuration
2. Request parsing (JSON/URL-encoded)
3. API rate limiting
4. Route-specific rate limits
5. Authentication middleware
6. Validation middleware
7. Business logic
8. Error handler
9. 404 handler

## 🛡️ Error Handling

Custom error classes for different scenarios:

| Error               | Code             | Status |
| ------------------- | ---------------- | ------ |
| ValidationError     | VALIDATION_ERROR | 400    |
| AuthenticationError | UNAUTHORIZED     | 401    |
| AuthorizationError  | FORBIDDEN        | 403    |
| NotFoundError       | NOT_FOUND        | 404    |
| ConflictError       | CONFLICT         | 409    |
| RateLimitError      | RATE_LIMIT       | 429    |
| InternalServerError | INTERNAL_ERROR   | 500    |

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture guide
- [API_REFERENCE.md](./API_REFERENCE.md) - Complete API documentation
- [ENDPOINTS.md](./ENDPOINTS.md) - All endpoints explained

## 🎯 Main Endpoints

### Authentication

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get profile
- `POST /api/auth/change-password` - Change password

### Workspaces

- `POST /api/workspaces` - Create workspace
- `GET /api/workspaces` - List workspaces
- `GET /api/workspaces/:id` - Get details
- `POST /api/workspaces/:id/members` - Add member

### Channels

- `POST /api/workspaces/:wsId/channels` - Create channel
- `GET /api/workspaces/:wsId/channels` - List channels
- `POST /api/workspaces/:wsId/channels/:chId/members` - Add member

### Messages

- `POST /api/workspaces/:wsId/channels/:chId/messages` - Send message
- `GET /api/workspaces/:wsId/channels/:chId/messages` - List messages
- `PUT /api/workspaces/:wsId/channels/:chId/messages/:msgId` - Edit
- `DELETE /api/workspaces/:wsId/channels/:chId/messages/:msgId` - Delete

### Direct Messages

- `POST /api/workspaces/:wsId/direct-messages` - Send DM
- `GET /api/workspaces/:wsId/direct-messages/:userId` - Get conversation

### Calls

- `POST /api/calls` - Initiate call
- `PUT /api/calls/:id` - Update call status
- `DELETE /api/calls/:id` - End call

### Admin

- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/users` - List users
- `GET /api/admin/analytics` - Analytics data

## 🌐 Real-Time Events

WebSocket events for real-time features:

| Event            | Direction       | Purpose          |
| ---------------- | --------------- | ---------------- |
| `message:sent`   | Bidirectional   | New message      |
| `typing:start`   | Client → Server | User typing      |
| `call:initiated` | Server → Client | Call started     |
| `user:online`    | Server → Client | User came online |
| `notification`   | Server → Client | New notification |

## 📊 Rate Limits

| Endpoint    | Limit | Window |
| ----------- | ----- | ------ |
| General API | 100   | 15 min |
| Auth        | 5     | 15 min |
| Messages    | 30    | 1 min  |
| Uploads     | 10    | 1 hour |
| Search      | 30    | 1 min  |

## 🔄 Database Schema

Key models:

- **User** - User accounts with profiles
- **Workspace** - Team workspaces
- **Channel** - Communication channels
- **Message** - Channel messages
- **DirectMessage** - Direct conversations
- **Call** - Call records
- **File** - Uploaded files
- **Notification** - User notifications
- **PlatformAdmin** - Admin accounts

See [prisma/schema.prisma](./prisma/schema.prisma) for full schema.

## 🚢 Deployment

### Environment Variables

```env
NODE_ENV=production
DATABASE_URL=<production-db-url>
JWT_SECRET=<secure-random-key>
FRONTEND_URL=<frontend-url>
PORT=3001
```

### Docker

```bash
docker build -t slack-backend .
docker run -p 3001:3001 slack-backend
```

### Heroku

```bash
heroku create your-app
heroku addons:create heroku-postgresql
git push heroku main
```

## 📝 Demo Credentials

After seeding:

| Role   | Email              | Password   |
| ------ | ------------------ | ---------- |
| Admin  | admin@example.com  | Admin123!  |
| Owner  | owner@example.com  | Owner123!  |
| Member | member@example.com | Member123! |

## 📖 Available Commands

```bash
npm run dev             # Development server
npm run build          # Production build
npm start              # Run built server
npm run type-check     # TypeScript check
npm run lint           # Code linting
npm run lint:fix       # Auto-fix linting
npm run prisma:migrate # DB migrations
npm run prisma:seed    # Seed data
npm run prisma:studio  # Database UI
```

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Ensure PostgreSQL is running
sudo service postgresql start

# Check DATABASE_URL in .env
# Verify credentials
```

### Port Already in Use

```bash
# Use different port
PORT=3002 npm run dev
```

### Dependency Issues

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📈 Performance

- **Database Queries**: Optimized with Prisma select/include
- **WebSocket**: Efficient message broadcasting
- **Rate Limiting**: Prevents server overload
- **Validation**: Early validation prevents errors
- **Error Handling**: Graceful error responses

## 🔐 Security Checklist

- ✅ JWT expiration configured
- ✅ Password hashing implemented
- ✅ CORS configured for frontend
- ✅ Input validation on all endpoints
- ✅ Rate limiting enabled
- ✅ Error messages safe
- ✅ Database queries parameterized
- ✅ Role-based access control

## 🤝 Contributing

1. Follow TypeScript conventions
2. Use services for business logic
3. Add validation schemas
4. Use custom error classes
5. Update documentation
6. Run linting: `npm run lint:fix`

## 📞 Support

- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for deep dives
- Review [API_REFERENCE.md](./API_REFERENCE.md) for endpoints
- Enable debug: `LOG_LEVEL=debug npm run dev`

## 📄 License

Proprietary and confidential.

---

**Built with ❤️ for team collaboration**

**Version**: 1.0.0 | **Last Updated**: June 2026

- [Create](https://docs.gitlab.com/user/project/repository/web_editor/#create-a-file) or [upload](https://docs.gitlab.com/user/project/repository/web_editor/#upload-a-file) files
- [Add files using the command line](https://docs.gitlab.com/topics/git/add_files/#add-files-to-a-git-repository) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.com/slack585922/slack_backend.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

- [Set up project integrations](https://gitlab.com/slack585922/slack_backend/-/settings/integrations)

## Collaborate with your team

- [Invite team members and collaborators](https://docs.gitlab.com/user/project/members/)
- [Create a new merge request](https://docs.gitlab.com/user/project/merge_requests/creating_merge_requests/)
- [Automatically close issues from merge requests](https://docs.gitlab.com/user/project/issues/managing_issues/#closing-issues-automatically)
- [Enable merge request approvals](https://docs.gitlab.com/user/project/merge_requests/approvals/)
- [Set auto-merge](https://docs.gitlab.com/user/project/merge_requests/auto_merge/)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [Get started with GitLab CI/CD](https://docs.gitlab.com/ci/quick_start/)
- [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/user/application_security/sast/)
- [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/topics/autodevops/requirements/)
- [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/user/clusters/agent/)
- [Set up protected environments](https://docs.gitlab.com/ci/environments/protected_environments/)

---

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name

Choose a self-explaining name for your project.

## Description

Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges

On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals

Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation

Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage

Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support

Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap

If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing

State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment

Show your appreciation to those who have contributed to the project.

## License

For open source projects, say how it is licensed.

## Project status

If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
