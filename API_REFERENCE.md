# Slack Backend - API Reference Guide

## Overview

This is a comprehensive REST API for the Slack-like team communication platform. All endpoints require authentication via JWT token (except login/register).

## Base URL

```
http://localhost:3001/api
```

## Authentication

Include JWT token in Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Response Format

**Success Response (200-201)**

```json
{
  "message": "Operation successful",
  "data": {
    /* resource data */
  }
}
```

**Error Response (4xx-5xx)**

```json
{
  "message": "Error description",
  "error": {
    /* error details */
  }
}
```

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Register a new user account.

**Request Body**

```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response** `201 Created`

```json
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "abc123",
    "email": "user@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

### Login User

**POST** `/auth/login`

Authenticate and get JWT token.

**Request Body**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response** `200 OK`

```json
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    /* user data */
  }
}
```

---

### Get Current User

**GET** `/auth/me`

Get authenticated user's profile.

**Response** `200 OK`

```json
{
  "id": "abc123",
  "email": "user@example.com",
  "username": "username",
  "firstName": "John",
  "lastName": "Doe",
  "profilePicture": "https://...",
  "bio": "Software Engineer",
  "status": "ONLINE",
  "customStatus": "In a meeting",
  "workspaceMembers": [
    /* workspaces */
  ]
}
```

---

### Update Profile

**PATCH** `/auth/me/profile`

Update user profile information.

**Request Body**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Senior Engineer",
  "profilePicture": "https://..."
}
```

**Response** `200 OK`

---

### Update Status

**PATCH** `/auth/me/status`

Update user's online status.

**Request Body**

```json
{
  "status": "AWAY",
  "customStatus": "At lunch"
}
```

**Status Values**: `ONLINE`, `AWAY`, `DO_NOT_DISTURB`, `OFFLINE`

---

## Workspace Endpoints

### Create Workspace

**POST** `/workspaces`

Create a new workspace.

**Request Body**

```json
{
  "name": "My Company",
  "description": "Company communication workspace"
}
```

**Response** `201 Created`

---

### Get User Workspaces

**GET** `/workspaces`

Get all workspaces for current user.

**Query Parameters**

- None

**Response** `200 OK`

```json
[
  {
    "id": "workspace1",
    "name": "My Company",
    "slug": "my-company-abc123",
    "description": "...",
    "createdBy": "user1",
    "members": [
      /* members */
    ],
    "channels": [
      /* channels */
    ]
  }
]
```

---

### Get Workspace Details

**GET** `/workspaces/:workspaceId`

Get detailed workspace information.

**Response** `200 OK`

---

### Update Workspace

**PATCH** `/workspaces/:workspaceId`

Update workspace (admin only).

**Request Body**

```json
{
  "name": "New Name",
  "description": "New description",
  "logo": "https://..."
}
```

---

### Add Workspace Member

**POST** `/workspaces/:workspaceId/members`

Add user to workspace (admin only).

**Request Body**

```json
{
  "userId": "user123",
  "role": "MEMBER"
}
```

**Role Values**: `OWNER`, `ADMIN`, `MEMBER`, `GUEST`

---

### Remove Workspace Member

**DELETE** `/workspaces/:workspaceId/members/:memberId`

Remove user from workspace (admin only).

---

### Invite to Workspace

**POST** `/workspaces/:workspaceId/invitations`

Send workspace invitation (admin only).

**Request Body**

```json
{
  "email": "newuser@example.com",
  "role": "MEMBER"
}
```

---

## Channel Endpoints

### Create Channel

**POST** `/workspaces/:workspaceId/channels`

Create a new channel.

**Request Body**

```json
{
  "name": "general",
  "description": "General discussion",
  "isPrivate": false
}
```

**Response** `201 Created`

---

### List Channels

**GET** `/workspaces/:workspaceId/channels`

List all accessible channels in workspace.

**Response** `200 OK`

```json
[
  {
    "id": "channel1",
    "name": "general",
    "description": "...",
    "isPrivate": false,
    "members": [
      /* channel members */
    ]
  }
]
```

---

### Get Channel Details

**GET** `/workspaces/:workspaceId/channels/:channelId`

Get channel information with members.

---

### Join Channel

**POST** `/workspaces/:workspaceId/channels/:channelId/join`

Join a public channel.

---

### Leave Channel

**POST** `/workspaces/:workspaceId/channels/:channelId/leave`

Leave a channel.

---

## Message Endpoints

### Send Message

**POST** `/workspaces/:workspaceId/channels/:channelId/messages`

Send a message to channel.

**Request Body**

```json
{
  "content": "Hello team!",
  "attachments": ["file_id_1", "file_id_2"]
}
```

**Response** `201 Created`

```json
{
  "message": "Message created successfully",
  "data": {
    "id": "msg123",
    "channelId": "channel1",
    "userId": "user1",
    "content": "Hello team!",
    "attachments": [
      /* files */
    ],
    "createdAt": "2024-01-15T10:30:00Z",
    "user": {
      /* sender info */
    },
    "reactions": [
      /* reactions */
    ]
  }
}
```

---

### Get Messages

**GET** `/workspaces/:workspaceId/channels/:channelId/messages`

Retrieve messages from channel.

**Query Parameters**

- `limit` (default: 50) - Number of messages to retrieve
- `offset` (default: 0) - Pagination offset

**Response** `200 OK`

```json
[
  {
    "id": "msg123",
    "content": "Message text",
    "user": {
      /* sender */
    },
    "reactions": [
      /* reactions */
    ],
    "replies": [
      /* thread replies */
    ],
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

---

### Edit Message

**PATCH** `/workspaces/:workspaceId/channels/:channelId/messages/:messageId`

Edit a message (own messages only).

**Request Body**

```json
{
  "content": "Updated message text"
}
```

---

### Delete Message

**DELETE** `/workspaces/:workspaceId/channels/:channelId/messages/:messageId`

Delete a message (own messages only).

---

### Add Reaction

**POST** `/workspaces/:workspaceId/channels/:channelId/messages/:messageId/reactions`

Add emoji reaction to message.

**Request Body**

```json
{
  "emoji": "👍"
}
```

---

### Remove Reaction

**DELETE** `/workspaces/:workspaceId/channels/:channelId/messages/:messageId/reactions`

Remove emoji reaction.

**Request Body**

```json
{
  "emoji": "👍"
}
```

---

### Create Reply (Thread)

**POST** `/workspaces/:workspaceId/channels/:channelId/messages/:messageId/replies`

Reply to a message in thread.

**Request Body**

```json
{
  "content": "I agree with this!",
  "attachments": []
}
```

---

### Get Thread Replies

**GET** `/workspaces/:workspaceId/channels/:channelId/messages/:messageId/replies`

Get all replies in message thread.

**Query Parameters**

- `limit` (default: 50)
- `offset` (default: 0)

---

### Mark Channel as Read

**POST** `/workspaces/:workspaceId/channels/:channelId/mark-read`

Mark all messages in channel as read.

---

## Direct Message Endpoints

### Get or Create DM Room

**POST** `/workspaces/:workspaceId/direct-messages/rooms`

Get existing or create new DM conversation.

**Request Body**

```json
{
  "userId": "user2"
}
```

**Response** `200/201`

```json
{
  "id": "room123",
  "workspaceId": "workspace1",
  "participantIds": ["user1", "user2"],
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

### List DM Rooms

**GET** `/workspaces/:workspaceId/direct-messages/rooms`

Get all DM conversations for user.

---

### Send Direct Message

**POST** `/workspaces/:workspaceId/direct-messages/:roomId`

Send message to DM room.

**Request Body**

```json
{
  "receiverId": "user2",
  "content": "Hey, how are you?",
  "attachments": []
}
```

---

### Get DM Messages

**GET** `/workspaces/:workspaceId/direct-messages/:roomId`

Retrieve messages in DM conversation.

**Query Parameters**

- `limit` (default: 50)
- `offset` (default: 0)

---

### Edit DM Message

**PATCH** `/workspaces/:workspaceId/direct-messages/:messageId`

Edit direct message.

---

### Delete DM Message

**DELETE** `/workspaces/:workspaceId/direct-messages/:messageId`

Delete direct message.

---

## Call Endpoints

### Initiate Call

**POST** `/calls`

Start a new call.

**Request Body**

```json
{
  "type": "VIDEO",
  "channelId": "channel123"
}
```

Or for one-on-one:

```json
{
  "type": "AUDIO",
  "recipientId": "user123"
}
```

**Response** `201 Created`

```json
{
  "message": "Call initiated",
  "data": {
    "id": "call123",
    "initiatorId": "user1",
    "type": "VIDEO",
    "status": "INITIATED",
    "startedAt": "2024-01-15T10:30:00Z",
    "participants": [
      /* participants */
    ]
  }
}
```

---

### Get Active Calls in Channel

**GET** `/calls/channel/:channelId/active`

Get currently active calls in channel.

---

### Accept Call

**POST** `/calls/:callId/accept`

Accept incoming call.

---

### Decline Call

**POST** `/calls/:callId/decline`

Decline incoming call.

---

### Leave Call

**POST** `/calls/:callId/leave`

Leave active call.

---

### Get Call History

**GET** `/calls/history/:workspaceId`

Get ended calls in workspace.

**Query Parameters**

- `limit` (default: 50)
- `offset` (default: 0)

---

## Search Endpoints

### Search Messages

**GET** `/search/:workspaceId/messages?query=hello&limit=50&offset=0`

Search messages across accessible channels.

**Query Parameters**

- `query` (required) - Search term
- `limit` (default: 50)
- `offset` (default: 0)

---

### Search Users

**GET** `/search/:workspaceId/users?query=john`

Search workspace members.

---

### Search Channels

**GET** `/search/:workspaceId/channels?query=engineering`

Search channels.

---

### Search Direct Messages

**GET** `/search/:workspaceId/direct-messages?query=hello`

Search DM conversations.

---

## Notification Endpoints

### Get Notifications

**GET** `/notifications?unreadOnly=false&limit=50&offset=0`

Get user's notifications.

**Query Parameters**

- `unreadOnly` (default: false) - Only unread
- `limit` (default: 50)
- `offset` (default: 0)

---

### Mark as Read

**PATCH** `/notifications/:notificationId/read`

Mark notification as read.

---

### Mark All as Read

**PATCH** `/notifications/all/read`

Mark all notifications as read.

---

### Get Notification Settings

**GET** `/notifications/settings`

Get notification preferences.

---

### Update Notification Settings

**PATCH** `/notifications/settings`

Update notification preferences.

**Request Body**

```json
{
  "emailNotifications": true,
  "pushNotifications": true,
  "desktopNotifications": false,
  "soundEnabled": true,
  "mutedChannels": ["channel1", "channel2"],
  "mutedWorkspaces": [],
  "doNotDisturbUntil": "2024-01-15T15:00:00Z"
}
```

---

## Admin Endpoints (Platform Admin Only)

### Get Platform Statistics

**GET** `/admin/stats`

Get platform overview statistics.

**Response**

```json
{
  "totalUsers": 150,
  "totalWorkspaces": 5,
  "totalChannels": 45,
  "totalMessages": 5000,
  "totalDirectMessages": 2000,
  "activeCalls": 3,
  "recentUsers": [
    /* recent users */
  ]
}
```

---

### List All Users

**GET** `/admin/users?search=john&limit=50&offset=0`

List all platform users.

**Query Parameters**

- `search` - Search by email/username
- `limit` (default: 50)
- `offset` (default: 0)

---

### List All Workspaces

**GET** `/admin/workspaces?search=company&limit=50&offset=0`

List all workspaces.

---

### Get Activity Analytics

**GET** `/admin/analytics?days=30`

Get platform activity analytics.

**Query Parameters**

- `days` (default: 30) - Days to analyze

---

### Get User Details

**GET** `/admin/users/:userId`

Get detailed user information.

---

### Promote to Admin

**POST** `/admin/users/:userId/promote`

Make user a platform admin.

---

### Remove Admin

**DELETE** `/admin/users/:userId/admin`

Remove platform admin privileges.

---

## Error Codes

| Code | Meaning                              |
| ---- | ------------------------------------ |
| 400  | Bad Request - Invalid parameters     |
| 401  | Unauthorized - Missing/invalid token |
| 403  | Forbidden - Insufficient permissions |
| 404  | Not Found - Resource doesn't exist   |
| 409  | Conflict - Resource already exists   |
| 500  | Server Error                         |

---

## Rate Limiting

Rate limits are applied per user:

- 100 requests per minute for authenticated users
- 10 requests per minute for unauthenticated endpoints

---

## WebSocket Events

See `WEBSOCKET.md` for real-time event documentation.

---

## Examples

### Complete Chat Flow

1. **Register**

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","username":"user1","password":"Pass123"}'
```

2. **Create Workspace**

```bash
curl -X POST http://localhost:3001/api/workspaces \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"My Team"}'
```

3. **Send Message**

```bash
curl -X POST http://localhost:3001/api/workspaces/WORKSPACE_ID/channels/general/messages \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello team!"}'
```

---

## Support

For API issues and questions:

- Check error messages in response
- Review logs in `./logs`
- Open issue in repository
