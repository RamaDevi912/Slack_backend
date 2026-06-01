# Service Layer Architecture

## Overview

The application follows a **layered architecture pattern** with clear separation of concerns:

```
HTTP Request
    ↓
[Controller] ← HTTP layer, request validation, response formatting
    ↓
[Service] ← Business logic, data operations, authorization
    ↓
[Database] ← Data persistence
```

## Service Layer Structure

All business logic has been moved into dedicated service classes. Each service is responsible for a specific domain.

### Services Created

#### 1. **AuthService** (`src/services/authService.ts`)

**Responsibility:** User authentication and profile management

**Methods:**

- `register()` - Create new user account
- `login()` - Authenticate user with email/password
- `getUserProfile()` - Retrieve user details
- `updateProfile()` - Update user information
- `changePassword()` - Change user password
- `refreshToken()` - Refresh JWT token

**Example Usage in Controller:**

```typescript
const user = await authService.login(email, password);
```

---

#### 2. **WorkspaceService** (`src/services/workspaceService.ts`)

**Responsibility:** Workspace operations and member management

**Methods:**

- `createWorkspace()` - Create new workspace
- `getWorkspaces()` - List user's workspaces
- `getWorkspaceById()` - Get single workspace
- `updateWorkspace()` - Update workspace details
- `deleteWorkspace()` - Delete workspace
- `addMember()` - Add user to workspace
- `removeMember()` - Remove user from workspace
- `getMembers()` - List workspace members
- `updateMemberRole()` - Change member role

**Example Usage in Controller:**

```typescript
const workspace = await workspaceService.createWorkspace(userId, {
  name: "My Team",
  description: "Team workspace",
});
```

---

#### 3. **ChannelService** (`src/services/channelService.ts`)

**Responsibility:** Channel management and member operations

**Methods:**

- `createChannel()` - Create new channel
- `getChannels()` - List channels in workspace
- `getChannelById()` - Get channel details
- `updateChannel()` - Update channel info
- `deleteChannel()` - Delete channel
- `addMember()` - Add user to channel
- `removeMember()` - Remove user from channel
- `getMembers()` - List channel members
- `archiveChannel()` - Soft-delete channel

**Example Usage:**

```typescript
const channel = await channelService.createChannel(workspaceId, userId, {
  name: "general",
  description: "General discussion",
  isPublic: true,
});
```

---

#### 4. **MessageService** (`src/services/messageService.ts`)

**Responsibility:** Message operations, reactions, and threading

**Methods:**

- `sendMessage()` - Send message to channel
- `getMessages()` - Retrieve channel messages with pagination
- `updateMessage()` - Edit message
- `deleteMessage()` - Delete message (soft delete)
- `addReaction()` - Add emoji reaction to message
- `removeReaction()` - Remove reaction
- `replyToMessage()` - Create thread reply
- `getThread()` - Retrieve message thread

**Example Usage:**

```typescript
const message = await messageService.sendMessage(channelId, userId, {
  content: "Hello team!",
  attachments: ["file-id-1"],
});
```

---

#### 5. **CallService** (`src/services/callService.ts`)

**Responsibility:** Call lifecycle management (direct and group calls)

**Methods:**

- `initiateCall()` - Start new call (direct or group)
- `getCallStatus()` - Get current call state
- `acceptCall()` - Accept incoming call
- `declineCall()` - Reject call
- `endCall()` - Terminate call
- `getCallHistory()` - Retrieve past calls with pagination
- `addParticipant()` - Add user to group call
- `removeParticipant()` - Remove user from call
- `getActiveCalls()` - List active calls for user

**Example Usage:**

```typescript
const call = await callService.initiateCall(userId, {
  recipientId: "user-2",
  callType: "direct",
});
```

---

#### 6. **FileService** (`src/services/fileService.ts`)

**Responsibility:** File upload, validation, and management

**Methods:**

- `validateFile()` - Validate file size and type
- `uploadFile()` - Save file with metadata
- `getFile()` - Retrieve file details
- `deleteFile()` - Delete file
- `getChannelFiles()` - List files in channel
- `getMessageFiles()` - List files attached to message
- `getUserStorageUsage()` - Get storage statistics
- `downloadFile()` - Track and serve file download
- `deleteMultipleFiles()` - Batch file deletion

**Configuration:**

- Max file size: 50MB
- Allowed types: Images (jpeg, png, gif), Documents (pdf, doc, docx), Spreadsheets (xls, xlsx), Text files

**Example Usage:**

```typescript
fileService.validateFile(file); // Throws if invalid
const fileRecord = await fileService.uploadFile(userId, file, {
  channelId: "channel-1",
});
```

---

#### 7. **DirectMessageService** (`src/services/directMessageService.ts`)

**Responsibility:** Direct messaging between users

**Methods:**

- `getOrCreateConversation()` - Get or create DM with user
- `sendMessage()` - Send direct message
- `getMessageHistory()` - Retrieve conversation history
- `getUserConversations()` - List all DM conversations
- `editMessage()` - Edit sent message
- `deleteMessage()` - Delete message
- `markConversationAsRead()` - Mark all messages as read
- `deleteConversation()` - Archive DM thread
- `getUnreadCount()` - Count unread messages

**Example Usage:**

```typescript
const conversation = await directMessageService.getOrCreateConversation(
  userId,
  recipientId,
);

const message = await directMessageService.sendMessage(conversationId, userId, {
  content: "Hey there!",
});
```

---

#### 8. **SearchService** (`src/services/searchService.ts`)

**Responsibility:** Full-text search across workspace

**Methods:**

- `searchMessages()` - Search channel messages
- `searchUsers()` - Find users in workspace
- `searchChannels()` - Find channels
- `globalSearch()` - Search all types combined
- `searchMyMessages()` - Search own messages

**Features:**

- Full-text search support
- Date range filtering
- Pagination
- Workspace scoped
- Permission validated

**Example Usage:**

```typescript
const results = await searchService.searchMessages(
  workspaceId,
  userId,
  "keyword",
  { page: 1, limit: 20 },
);
```

---

#### 9. **NotificationService** (`src/services/notificationService.ts`)

**Responsibility:** Notification delivery and preferences

**Notification Types:**

- `message` - New message notification
- `mention` - User mentioned
- `call` - Call received
- `channel_invite` - Channel invitation
- `workspace_invite` - Workspace invitation

**Methods:**

- `sendNotification()` - Send single notification
- `sendBulkNotifications()` - Send to multiple users
- `getNotifications()` - Retrieve user notifications
- `markAsRead()` - Mark notification read
- `markAllAsRead()` - Mark all as read
- `deleteNotification()` - Delete notification
- `deleteAllNotifications()` - Clear all notifications
- `getPreferences()` - Get notification settings
- `updatePreferences()` - Update notification settings
- `getUnreadCount()` - Count unread notifications
- `getNotificationsByType()` - Filter by type

**Example Usage:**

```typescript
await notificationService.sendNotification(userId, {
  type: "mention",
  title: "@john mentioned you",
  message: "Check out message in #general",
  relatedChannelId: "channel-1",
});
```

---

#### 10. **AdminService** (`src/services/adminService.ts`)

**Responsibility:** System administration and analytics

**Methods:**

- `getDashboardStats()` - Overall system statistics
- `getUserStats()` - User statistics and analytics
- `getWorkspaceStats()` - Workspace statistics
- `getAuditLogs()` - System audit trail
- `logAction()` - Log administrative action
- `banUser()` - Ban user from system
- `unbanUser()` - Restore banned user
- `deactivateUser()` - Deactivate user account
- `getSystemHealth()` - System health check
- `getActivityLogs()` - Activity log retrieval
- `getTopActiveUsers()` - Most active users
- `getWorkspaceGrowth()` - Workspace growth metrics

**Example Usage:**

```typescript
const stats = await adminService.getDashboardStats();
// Returns: totalUsers, totalWorkspaces, totalChannels, activeUsers, etc.

await adminService.banUser(userId, "Spam violation");
```

---

## Refactored Controllers Pattern

### Before (Monolithic)

```typescript
// OLD: Business logic mixed in controller
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { content, fileId } = req.body;
    const { channelId } = req.params;
    const userId = req.user?.id;

    // Validation (should be in service)
    if (!content && !fileId) {
      res.status(400).json({ message: "Content or file required" });
      return;
    }

    // Database operation (should be in service)
    const message = await prisma.message.create({
      data: {
        channelId,
        userId,
        content,
        fileId,
      },
    });

    // Response
    res.status(201).json({
      success: true,
      message: "Message sent",
      data: message,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### After (Separated Concerns)

```typescript
// NEW: Controller handles HTTP only
export const sendMessage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { content, fileId } = req.body;
    const { channelId } = req.params;
    const userId = req.user?.id;

    // Delegate to service
    const message = await messageService.sendMessage(channelId, userId, {
      content,
      attachments: fileId ? [fileId] : [],
    });

    // Format response
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Message sent successfully",
      data: message,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Error handling middleware
    next(error);
  }
};
```

## Key Benefits

### 1. **Separation of Concerns**

- Controllers: HTTP request/response handling
- Services: Business logic and data operations
- Middleware: Cross-cutting concerns (auth, validation, logging)

### 2. **Reusability**

Services can be used from multiple contexts:

- HTTP endpoints
- WebSocket handlers
- Scheduled jobs
- Internal operations

### 3. **Testability**

- Unit test services without mocking HTTP
- Mock services in controller tests
- Test error handling independently

### 4. **Maintainability**

- Clear code structure
- Easy to understand data flow
- Single responsibility per class
- Consistent patterns

### 5. **Scalability**

- Easy to add new services
- Services can be moved to microservices
- Clear API contracts

## Error Handling Pattern

All services use custom error classes:

```typescript
// Services throw specific errors
throw new NotFoundError("Channel"); // 404
throw new AuthenticationError("Unauthorized"); // 401
throw new AuthorizationError("Forbidden"); // 403
throw new ValidationError("Invalid input"); // 400
throw new ConflictError("Already exists"); // 409
throw new RateLimitError("Too many requests"); // 429
```

## Implementation Checklist

### Phase 1: Service Creation ✅

- [x] AuthService
- [x] WorkspaceService
- [x] ChannelService
- [x] MessageService
- [x] CallService
- [x] FileService
- [x] DirectMessageService
- [x] SearchService
- [x] NotificationService
- [x] AdminService

### Phase 2: Controller Refactoring (Next)

- [ ] Refactor auth.controller.ts to use AuthService
- [ ] Refactor workspace.controller.ts to use WorkspaceService
- [ ] Refactor channel.controller.ts to use ChannelService
- [ ] Refactor message.controller.ts to use MessageService
- [ ] Refactor call.controller.ts to use CallService
- [ ] Refactor file.controller.ts to use FileService
- [ ] Refactor directMessage.controller.ts to use DirectMessageService
- [ ] Refactor search.controller.ts to use SearchService
- [ ] Refactor notification.controller.ts to use NotificationService
- [ ] Refactor admin.controller.ts to use AdminService

## Example: Complete Refactoring Flow

### Service (Business Logic)

```typescript
// messageService.ts
async sendMessage(channelId, userId, data) {
  // Verify access
  const channel = await prisma.channel.findUnique({...})
  const isMember = channel.members.some(m => m.userId === userId)
  if (!isMember) throw new AuthenticationError('Access denied')

  // Create message
  const message = await prisma.message.create({...})

  return message
}
```

### Controller (HTTP Handler)

```typescript
// message.controller.ts
export const sendMessage = async (req, res, next) => {
  try {
    const message = await messageService.sendMessage(
      req.params.channelId,
      req.user.id,
      { content: req.body.content },
    );

    res.status(201).json({
      success: true,
      message: "Message sent",
      data: message,
    });
  } catch (error) {
    next(error); // Error middleware handles it
  }
};
```

### Route (Wires it together)

```typescript
// message.routes.ts
router.post(
  "/:channelId/messages",
  authenticate,
  validateRequest(messageSchema),
  sendMessage,
);
```

## File Organization

```
src/
├── controllers/          ← HTTP handlers (thin)
│   ├── auth.controller.ts
│   ├── message.controller.ts
│   └── ...
├── services/            ← Business logic (fat)
│   ├── authService.ts
│   ├── messageService.ts
│   ├── index.ts
│   └── ...
├── routes/              ← Route definitions
├── middleware/          ← Cross-cutting concerns
├── types/               ← TypeScript definitions
└── utils/               ← Utilities (errors, helpers)
```

## Next Steps

1. ✅ Services created - all business logic organized
2. ⏳ Refactor controllers to be thin HTTP handlers
3. ⏳ Update error handling in all endpoints
4. ⏳ Add comprehensive tests for services
5. ⏳ Update API documentation

## Conclusion

The service layer architecture ensures:

- **Code clarity** - Anyone can read a service and understand what it does
- **Code reusability** - Services can be used from anywhere
- **Code testability** - Each service can be tested independently
- **Code maintainability** - New developers understand the structure immediately
- **Code scalability** - Ready for microservices migration

This architecture follows SOLID principles and is production-ready.
