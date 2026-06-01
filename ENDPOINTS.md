# Complete API Endpoints List

## Base URL

```
http://localhost:3001/api
```

## Authentication Header (for protected endpoints)

```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🔐 Authentication Endpoints (Public)

| Method | Endpoint         | Description       | Body                                               |
| ------ | ---------------- | ----------------- | -------------------------------------------------- |
| POST   | `/auth/register` | Register new user | `{email, username, password, firstName, lastName}` |
| POST   | `/auth/login`    | Login user        | `{email, password}`                                |

---

## 👤 User Endpoints (Protected)

| Method | Endpoint           | Description              | Auth |
| ------ | ------------------ | ------------------------ | ---- |
| GET    | `/auth/me`         | Get current user profile | ✅   |
| PATCH  | `/auth/me/profile` | Update profile           | ✅   |
| PATCH  | `/auth/me/status`  | Update user status       | ✅   |

**Status Values**: `ONLINE`, `AWAY`, `DO_NOT_DISTURB`, `OFFLINE`

---

## 🏢 Workspace Endpoints (Protected)

### Create & List

| Method | Endpoint      | Description          | Auth | Role |
| ------ | ------------- | -------------------- | ---- | ---- |
| POST   | `/workspaces` | Create workspace     | ✅   | Any  |
| GET    | `/workspaces` | List user workspaces | ✅   | Any  |

### Details & Management

| Method | Endpoint                   | Description           | Auth | Role    |
| ------ | -------------------------- | --------------------- | ---- | ------- |
| GET    | `/workspaces/:workspaceId` | Get workspace details | ✅   | Member+ |
| PATCH  | `/workspaces/:workspaceId` | Update workspace      | ✅   | Admin+  |

### Member Management

| Method | Endpoint                                     | Description   | Auth | Role   |
| ------ | -------------------------------------------- | ------------- | ---- | ------ |
| POST   | `/workspaces/:workspaceId/members`           | Add member    | ✅   | Admin+ |
| DELETE | `/workspaces/:workspaceId/members/:memberId` | Remove member | ✅   | Admin+ |

### Invitations

| Method | Endpoint                               | Description     | Auth | Role   |
| ------ | -------------------------------------- | --------------- | ---- | ------ |
| POST   | `/workspaces/:workspaceId/invitations` | Send invitation | ✅   | Admin+ |

---

## 📢 Channel Endpoints (Protected)

### Create & List

| Method | Endpoint                            | Description    | Auth |
| ------ | ----------------------------------- | -------------- | ---- |
| POST   | `/workspaces/:workspaceId/channels` | Create channel | ✅   |
| GET    | `/workspaces/:workspaceId/channels` | List channels  | ✅   |

### Channel Operations

| Method | Endpoint                                             | Description         | Auth | Notes              |
| ------ | ---------------------------------------------------- | ------------------- | ---- | ------------------ |
| GET    | `/workspaces/:workspaceId/channels/:channelId`       | Get channel details | ✅   | Member only        |
| PATCH  | `/workspaces/:workspaceId/channels/:channelId`       | Update channel      | ✅   | Channel owner only |
| POST   | `/workspaces/:workspaceId/channels/:channelId/join`  | Join channel        | ✅   | Public channels    |
| POST   | `/workspaces/:workspaceId/channels/:channelId/leave` | Leave channel       | ✅   |                    |

### Channel Members

| Method | Endpoint                                                         | Description   | Auth | Role          |
| ------ | ---------------------------------------------------------------- | ------------- | ---- | ------------- |
| POST   | `/workspaces/:workspaceId/channels/:channelId/members`           | Add member    | ✅   | Channel owner |
| DELETE | `/workspaces/:workspaceId/channels/:channelId/members/:memberId` | Remove member | ✅   | Channel owner |

### Pinned Messages

| Method | Endpoint                                                         | Description          | Auth |
| ------ | ---------------------------------------------------------------- | -------------------- | ---- |
| GET    | `/workspaces/:workspaceId/channels/:channelId/pinned`            | List pinned messages | ✅   |
| POST   | `/workspaces/:workspaceId/channels/:channelId/pinned/:messageId` | Pin message          | ✅   |
| DELETE | `/workspaces/:workspaceId/channels/:channelId/pinned/:messageId` | Unpin message        | ✅   |

---

## 💬 Message Endpoints (Protected)

### Send & Retrieve

| Method | Endpoint                                                | Description  | Auth | Parameters             |
| ------ | ------------------------------------------------------- | ------------ | ---- | ---------------------- |
| POST   | `/workspaces/:workspaceId/channels/:channelId/messages` | Send message | ✅   | {content, attachments} |
| GET    | `/workspaces/:workspaceId/channels/:channelId/messages` | Get messages | ✅   | ?limit=50&offset=0     |

### Message Operations

| Method | Endpoint                                                           | Description    | Auth | Role       |
| ------ | ------------------------------------------------------------------ | -------------- | ---- | ---------- |
| PATCH  | `/workspaces/:workspaceId/channels/:channelId/messages/:messageId` | Edit message   | ✅   | Owner only |
| DELETE | `/workspaces/:workspaceId/channels/:channelId/messages/:messageId` | Delete message | ✅   | Owner only |

### Reactions

| Method | Endpoint                                                                     | Description     | Auth | Body    |
| ------ | ---------------------------------------------------------------------------- | --------------- | ---- | ------- |
| POST   | `/workspaces/:workspaceId/channels/:channelId/messages/:messageId/reactions` | Add reaction    | ✅   | {emoji} |
| DELETE | `/workspaces/:workspaceId/channels/:channelId/messages/:messageId/reactions` | Remove reaction | ✅   | {emoji} |

### Thread Replies

| Method | Endpoint                                                                   | Description      | Auth | Body                   |
| ------ | -------------------------------------------------------------------------- | ---------------- | ---- | ---------------------- |
| POST   | `/workspaces/:workspaceId/channels/:channelId/messages/:messageId/replies` | Reply to message | ✅   | {content, attachments} |
| GET    | `/workspaces/:workspaceId/channels/:channelId/messages/:messageId/replies` | Get replies      | ✅   | ?limit=50&offset=0     |

### Read Status

| Method | Endpoint                                                 | Description          | Auth |
| ------ | -------------------------------------------------------- | -------------------- | ---- |
| POST   | `/workspaces/:workspaceId/channels/:channelId/mark-read` | Mark channel as read | ✅   |

---

## 👥 Direct Message Endpoints (Protected)

### Room Management

| Method | Endpoint                                         | Description        | Auth | Body     |
| ------ | ------------------------------------------------ | ------------------ | ---- | -------- |
| POST   | `/workspaces/:workspaceId/direct-messages/rooms` | Get/create DM room | ✅   | {userId} |
| GET    | `/workspaces/:workspaceId/direct-messages/rooms` | List DM rooms      | ✅   |          |

### Messages

| Method | Endpoint                                           | Description     | Auth | Body                               |
| ------ | -------------------------------------------------- | --------------- | ---- | ---------------------------------- |
| POST   | `/workspaces/:workspaceId/direct-messages/:roomId` | Send DM         | ✅   | {receiverId, content, attachments} |
| GET    | `/workspaces/:workspaceId/direct-messages/:roomId` | Get DM messages | ✅   | ?limit=50&offset=0                 |

### Message Operations

| Method | Endpoint                                              | Description | Auth | Role        |
| ------ | ----------------------------------------------------- | ----------- | ---- | ----------- |
| PATCH  | `/workspaces/:workspaceId/direct-messages/:messageId` | Edit DM     | ✅   | Sender only |
| DELETE | `/workspaces/:workspaceId/direct-messages/:messageId` | Delete DM   | ✅   | Sender only |

### Reactions

| Method | Endpoint                                                        | Description     | Auth | Body    |
| ------ | --------------------------------------------------------------- | --------------- | ---- | ------- |
| POST   | `/workspaces/:workspaceId/direct-messages/:messageId/reactions` | Add reaction    | ✅   | {emoji} |
| DELETE | `/workspaces/:workspaceId/direct-messages/:messageId/reactions` | Remove reaction | ✅   | {emoji} |

---

## ☎️ Call Endpoints (Protected)

### Call Management

| Method | Endpoint         | Description      | Auth | Body                                              |
| ------ | ---------------- | ---------------- | ---- | ------------------------------------------------- |
| POST   | `/calls`         | Initiate call    | ✅   | {type: "AUDIO"/"VIDEO", channelId OR recipientId} |
| GET    | `/calls/:callId` | Get call details | ✅   |                                                   |

### Call Actions

| Method | Endpoint                           | Description      | Auth |
| ------ | ---------------------------------- | ---------------- | ---- |
| GET    | `/calls/channel/:channelId/active` | Get active calls | ✅   |
| POST   | `/calls/:callId/accept`            | Accept call      | ✅   |
| POST   | `/calls/:callId/decline`           | Decline call     | ✅   |
| POST   | `/calls/:callId/leave`             | Leave call       | ✅   |

### History

| Method | Endpoint                      | Description      | Auth | Parameters         |
| ------ | ----------------------------- | ---------------- | ---- | ------------------ |
| GET    | `/calls/history/:workspaceId` | Get call history | ✅   | ?limit=50&offset=0 |

---

## 🔍 Search Endpoints (Protected)

| Method | Endpoint                               | Description     | Auth | Parameters                   |
| ------ | -------------------------------------- | --------------- | ---- | ---------------------------- |
| GET    | `/search/:workspaceId/messages`        | Search messages | ✅   | ?query=...&limit=50&offset=0 |
| GET    | `/search/:workspaceId/users`           | Search users    | ✅   | ?query=...&limit=20          |
| GET    | `/search/:workspaceId/channels`        | Search channels | ✅   | ?query=...&limit=20          |
| GET    | `/search/:workspaceId/direct-messages` | Search DMs      | ✅   | ?query=...&limit=50          |

---

## 🔔 Notification Endpoints (Protected)

### Notifications

| Method | Endpoint                              | Description         | Auth | Parameters                 |
| ------ | ------------------------------------- | ------------------- | ---- | -------------------------- |
| GET    | `/notifications`                      | Get notifications   | ✅   | ?unreadOnly=false&limit=50 |
| PATCH  | `/notifications/:notificationId/read` | Mark as read        | ✅   |                            |
| PATCH  | `/notifications/all/read`             | Mark all as read    | ✅   |                            |
| DELETE | `/notifications/:notificationId`      | Delete notification | ✅   |                            |

### Settings

| Method | Endpoint                  | Description                  | Auth |
| ------ | ------------------------- | ---------------------------- | ---- |
| GET    | `/notifications/settings` | Get notification settings    | ✅   |
| PATCH  | `/notifications/settings` | Update notification settings | ✅   |

---

## 📁 File Endpoints (Protected)

| Method | Endpoint                  | Description   | Auth | Type                |
| ------ | ------------------------- | ------------- | ---- | ------------------- |
| POST   | `/files/upload`           | Upload file   | ✅   | multipart/form-data |
| GET    | `/files/download/:fileId` | Download file | ✅   |                     |
| DELETE | `/files/:fileId`          | Delete file   | ✅   | Owner only          |

---

## 🛠️ Admin Endpoints (Protected - Platform Admin Only)

### Statistics

| Method | Endpoint           | Description            | Auth | Role  |
| ------ | ------------------ | ---------------------- | ---- | ----- |
| GET    | `/admin/stats`     | Get platform stats     | ✅   | Admin |
| GET    | `/admin/analytics` | Get activity analytics | ✅   | Admin |

### Management

| Method | Endpoint            | Description         | Auth | Role  | Parameters           |
| ------ | ------------------- | ------------------- | ---- | ----- | -------------------- |
| GET    | `/admin/users`      | List all users      | ✅   | Admin | ?search=...&limit=50 |
| GET    | `/admin/workspaces` | List all workspaces | ✅   | Admin | ?search=...&limit=50 |
| GET    | `/admin/channels`   | List all channels   | ✅   | Admin | ?limit=50            |

### Details

| Method | Endpoint                         | Description           | Auth | Role  |
| ------ | -------------------------------- | --------------------- | ---- | ----- |
| GET    | `/admin/users/:userId`           | Get user details      | ✅   | Admin |
| GET    | `/admin/workspaces/:workspaceId` | Get workspace details | ✅   | Admin |

### Admin Actions

| Method | Endpoint                       | Description      | Auth | Role  |
| ------ | ------------------------------ | ---------------- | ---- | ----- |
| POST   | `/admin/users/:userId/promote` | Promote to admin | ✅   | Admin |
| DELETE | `/admin/users/:userId/admin`   | Remove admin     | ✅   | Admin |

### Audit

| Method | Endpoint                                    | Description    | Auth | Role  | Parameters |
| ------ | ------------------------------------------- | -------------- | ---- | ----- | ---------- |
| GET    | `/admin/workspaces/:workspaceId/audit-logs` | Get audit logs | ✅   | Admin | ?limit=50  |

---

## HTTP Status Codes

| Code | Meaning                              |
| ---- | ------------------------------------ |
| 200  | OK - Request successful              |
| 201  | Created - Resource created           |
| 204  | No Content - Success with no return  |
| 400  | Bad Request - Invalid input          |
| 401  | Unauthorized - Missing/invalid token |
| 403  | Forbidden - Access denied            |
| 404  | Not Found - Resource doesn't exist   |
| 409  | Conflict - Resource already exists   |
| 500  | Server Error - Internal error        |

---

## Request/Response Examples

### Example 1: Login

```bash
POST /api/auth/login

Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response 200:
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username"
  }
}
```

### Example 2: Send Message

```bash
POST /api/workspaces/ws123/channels/ch123/messages
Authorization: Bearer eyJhbGc...

Body:
{
  "content": "Hello team!",
  "attachments": []
}

Response 201:
{
  "message": "Message created successfully",
  "data": {
    "id": "msg123",
    "content": "Hello team!",
    "userId": "user123",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Example 3: Pagination

```bash
GET /api/workspaces/ws123/channels/ch123/messages?limit=50&offset=100

Retrieves messages 100-150
```

---

## Error Response Format

```json
{
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details"
  }
}
```

---

## WebSocket Events

See [WEBSOCKET_EVENTS.md](./WEBSOCKET_EVENTS.md) for real-time events.

---

## Rate Limiting

- **Authenticated users**: 100 requests/minute
- **Unauthenticated**: 10 requests/minute

---

## API Version

**Current**: v1.0.0

All endpoints are production-ready.

---

Last Updated: May 2026
