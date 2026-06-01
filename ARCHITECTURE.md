# Backend Architecture and Code Structure

## Project Overview

This is a professional-grade backend for a Slack-like real-time team communication platform. The architecture follows clean code principles with proper separation of concerns, comprehensive error handling, validation, and rate limiting.

## Folder Structure

```
src/
├── config/              # Configuration files
│   └── database.ts      # Prisma database configuration
├── controllers/         # Request handlers (legacy, being refactored)
├── middleware/          # Express middleware
│   ├── authMiddleware.ts        # Authentication & authorization
│   ├── errorHandler.ts          # Global error handling
│   ├── rateLimiter.ts           # Rate limiting policies
│   └── validationMiddleware.ts  # Request validation
├── routes/              # API route definitions
├── services/            # Business logic layer
│   ├── authService.ts           # Authentication service
│   ├── workspaceService.ts      # Workspace operations
│   └── index.ts                 # Service exports
├── types/               # TypeScript type definitions
│   └── index.ts         # Centralized types
├── utils/               # Utility functions
│   ├── auth.ts          # JWT and password utilities
│   ├── errors.ts        # Custom error classes
│   ├── logger.ts        # Structured logging
│   ├── response.ts      # API response formatting
│   └── validation.ts    # Joi validation schemas
├── websocket/           # WebSocket handlers
│   └── socketHandler.ts
├── prisma/              # Prisma ORM
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Database seeding
├── index.ts             # Application entry point
└── .env.example         # Environment variables template
```

## Key Architectural Components

### 1. **Middleware Stack**

#### Authentication Middleware (`authMiddleware.ts`)

- `authenticate`: Verifies JWT tokens
- `hasWorkspaceAccess`: Checks workspace membership
- `isWorkspaceAdmin`: Validates workspace admin role
- `isWorkspaceOwner`: Validates workspace owner role
- `hasChannelAccess`: Checks channel access permissions
- `isPlatformAdmin`: Validates platform admin role

#### Error Handling (`errorHandler.ts`)

- Global error handler middleware
- Custom `AppError` classes for different error types
- Prisma error mapping
- Standardized error response format
- 404 Not Found handler

#### Rate Limiting (`rateLimiter.ts`)

- `apiLimiter`: 100 requests per 15 minutes (general API)
- `authLimiter`: 5 requests per 15 minutes (auth endpoints)
- `messageLimiter`: 30 messages per minute
- `uploadLimiter`: 10 uploads per hour
- `searchLimiter`: 30 searches per minute

#### Validation Middleware (`validationMiddleware.ts`)

- Request body validation using Joi
- Query parameter validation
- URL parameter validation
- Detailed error messages for validation failures

### 2. **Error Handling System** (`utils/errors.ts`)

Custom error classes with proper HTTP status codes:

```typescript
- AppError: Base error class
- ValidationError: 400 - Input validation errors
- AuthenticationError: 401 - Auth failures
- AuthorizationError: 403 - Permission denied
- NotFoundError: 404 - Resource not found
- ConflictError: 409 - Duplicate/conflicting data
- RateLimitError: 429 - Rate limit exceeded
- DatabaseError: 500 - Database errors
- InternalServerError: 500 - Server errors
```

### 3. **Response Formatting** (`utils/response.ts`)

Standardized API response format:

```typescript
{
  success: boolean
  statusCode: number
  message: string
  data?: any
  error?: {
    code: ErrorCode
    details?: Record<string, any>
  }
  timestamp: string
}
```

### 4. **Validation Schemas** (`utils/validation.ts`)

Comprehensive Joi validation schemas for:

- Authentication (register, login, profile update)
- Workspace operations (create, invite, add members)
- Channel management
- Message creation and updates
- Direct messaging
- File uploads
- Search queries
- Pagination

### 5. **Services Layer** (emerging)

Business logic separation from controllers:

#### AuthService (`services/authService.ts`)

- `register`: User registration with validation
- `login`: Authentication with password verification
- `getUserProfile`: Fetch user details
- `updateProfile`: Profile updates with type safety
- `changePassword`: Password change with validation
- `refreshToken`: Token refresh

#### WorkspaceService (`services/workspaceService.ts`)

- `createWorkspace`: Workspace creation with slug validation
- `getWorkspaceById`: Fetch workspace details
- `getUserWorkspaces`: Get all user workspaces
- `updateWorkspace`: Update workspace info
- `addMember`: Add members with role assignment
- `removeMember`: Remove members
- `updateMemberRole`: Change member roles
- `getMembers`: List workspace members
- `inviteUser`: Send workspace invitations

### 6. **Type System** (`types/index.ts`)

Unified type definitions:

- `AuthRequest`: Extended Express Request with user/auth data
- `AuthResponse`: Standard auth response format
- `CreateWorkspaceRequest`: Workspace creation payload
- `CreateChannelRequest`: Channel creation payload
- `JWTPayload`: JWT token payload
- `FileUploadRequest`: File upload metadata
- `SocketMessage`: WebSocket message format

## Key Features Implemented

### ✅ Authentication & Security

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- Token refresh mechanism
- Auth middleware protection

### ✅ Error Handling

- Custom error classes for all scenarios
- Comprehensive error mapping
- Prisma error translation
- Standardized error responses
- Detailed error logging

### ✅ Validation

- Joi schema validation for all routes
- Request body validation
- Query parameter validation
- URL parameter validation
- Type-safe validation results

### ✅ Rate Limiting

- Per-endpoint rate limits
- IP-based tracking
- Configurable thresholds
- Graceful rate limit responses

### ✅ Database Integration

- Prisma ORM with full type safety
- Database migrations
- Seed data for testing
- Transaction support
- Relationship management

### ✅ Real-Time Communication

- Socket.io integration
- Presence tracking
- Direct messaging channels
- Channel broadcasts

## Usage Examples

### Authentication Flow

```typescript
// Register
POST /api/auth/register
{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}

// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

### Workspace Management

```typescript
// Create workspace
POST /api/workspaces
{
  "name": "Tech Team",
  "slug": "tech-team",
  "description": "Engineering team workspace"
}

// Add member
POST /api/workspaces/:workspaceId/members
{
  "userId": "user-id",
  "role": "MEMBER"
}
```

### Message Operations

```typescript
// Send message
POST /api/workspaces/:workspaceId/channels/:channelId/messages
{
  "content": "Hello everyone!",
  "threadId": "optional-parent-message-id"
}

// With rate limiting: 30 messages/minute per user
```

## Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/slack_db
PORT=3001
NODE_ENV=development
JWT_SECRET=your_super_secret_key_here
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=debug
```

## Middleware Execution Order

1. CORS configuration
2. Request parsing (JSON/URL-encoded)
3. API rate limiting
4. Route-specific rate limits
5. Static file serving
6. Route handlers with auth/validation middleware
7. Error handler (catches all errors)
8. 404 handler (catches unmatched routes)

## Error Handling Flow

```
Request Error
    ↓
Validation Middleware → Joi validation error
    ↓
Route Handler → Business logic error (AppError)
    ↓
Service Layer → Database/business error
    ↓
Error Handler Middleware → Standardized response
    ↓
Client Response (standardized JSON format)
```

## Security Considerations

1. **Authentication**: JWT tokens with expiration
2. **Authorization**: Role-based access control at multiple levels
3. **Validation**: Input validation on all endpoints
4. **Rate Limiting**: Prevents abuse and DDoS attacks
5. **Error Messages**: No sensitive information in error responses
6. **CORS**: Configured for frontend origin
7. **Password Security**: Bcryptjs hashing with salt rounds

## Performance Optimizations

1. **Database Queries**: Optimized with Prisma select/include
2. **Caching**: Potential for Redis integration
3. **Pagination**: Support for large data sets
4. **Rate Limiting**: Prevents server overload
5. **Connection Pooling**: Prisma manages DB connections
6. **WebSocket Optimization**: Efficient message broadcasting

## Testing Strategies

1. **Unit Tests**: Service layer functions
2. **Integration Tests**: Database operations
3. **API Tests**: Route handlers with middleware
4. **Rate Limit Tests**: Verify rate limiting works
5. **Error Tests**: Custom error handling
6. **Validation Tests**: Input validation schemas

## Future Enhancements

1. **Logging**: Winston logger integration
2. **Caching**: Redis for session/message caching
3. **Message Queue**: Bull/RabbitMQ for background jobs
4. **File Storage**: S3/Cloud storage integration
5. **Monitoring**: Prometheus metrics
6. **API Documentation**: Swagger/OpenAPI
7. **GraphQL**: Alternative to REST API
8. **Webhooks**: Event-driven integrations

## Database Models

Key Prisma models:

- `User`: User accounts and profiles
- `Workspace`: Team workspaces
- `WorkspaceMember`: Membership with roles
- `Channel`: Communication channels
- `ChannelMember`: Channel memberships
- `Message`: Message content
- `DirectMessage`: Direct messages
- `Call`: Call records
- `File`: File uploads
- `Notification`: User notifications
- `MessageReaction`: Message reactions
- `PlatformAdmin`: Platform administrators
- `AuditLog`: System audit logs

## Running the Server

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Run migrations
npm run prisma:migrate

# Seed database (optional)
npm run prisma:seed

# Development mode
npm run dev

# Production build
npm run build
npm start

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

## Contributing Guidelines

1. Follow the established folder structure
2. Use TypeScript for type safety
3. Create services for business logic
4. Add validation schemas for new endpoints
5. Use custom error classes
6. Update API documentation
7. Write tests for new features
8. Keep responses consistent

---

**Last Updated**: June 2026
**Version**: 1.0.0
**Node**: 16+
**TypeScript**: 5.3+
