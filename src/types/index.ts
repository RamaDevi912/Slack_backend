import { Request, Response, NextFunction } from "express";
import { Server as SocketIOServer } from "socket.io";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    workspaceId: string;
    role: string;
  };
  io?: SocketIOServer;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    status: string;
  };
}

export interface CreateMessageRequest {
  content: string;
  fileId?: string;
  threadId?: string;
}

export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
}

export interface CreateChannelRequest {
  name: string;
  description?: string;
  isPrivate?: boolean;
}

export interface JWTPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export interface FileUploadRequest {
  filename: string;
  mimetype: string;
  size: number;
  path?: string;
}

export interface SocketMessage {
  userId: string;
  content: string;
  channelId?: string;
  dmRoomId?: string;
  timestamp: Date;
}

export type RouteHandler = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => Promise<void> | void;
